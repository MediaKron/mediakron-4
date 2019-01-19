<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use DB;
use App\Models\Site;
use App\Models\User;
use App\Models\Item;
use App\Models\Relationship;

class Mediakron3Migration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mediakron:migrate:v3';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import data from version 3';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //
        $users = DB::connection('mediakron_v3')->table('User')->get();
        $new_users = [];
        foreach($users as $user){
            $new_users[$user->id] = User::mediakron_v3($user);
        }
        $new_sites = [];
        $sites = DB::connection('mediakron_v3')->table('Site')->get();
        foreach($sites as $site){
            $new_sites[$site->id] = Site::mediakron_v3($site);
        }

        $sites = Site::all();
        foreach($sites as $site){
            $id = $site->uri . '_Items';
            if(DB::connection('mediakron_v3')->getSchemaBuilder()->hasTable($id)){
                // Fetch Items
                $items = DB::connection('mediakron_v3')->table($id)->get();
                $new_items = [];
                foreach($items as $item){
                    $new_items[$item->uri] = Item::mediakron_v3($item, $site->id, $new_users);
                }

                // Fetch Relationships
                $relationships = DB::connection('mediakron_v3')->table($site->uri . '_Relationships')
                    ->get();

                foreach($relationships as $import){
                    $relationship = new Relationship();
                    if(!isset($new_items[$import->parent]) || !isset($new_items[$import->child])) continue;
                    $relationship->parent_id = $new_items[$import->parent]->id;
                    $relationship->child_id = $new_items[$import->child]->id;
                    if(isset($new_items[$import->attachment])){
                        $relationship->attachment_id = $new_items[$import->attachment]->id;
                    }else{
                        $relationship->attachment_id = 0;
                    }
                    $relationship->site_id = $site->id;
                    $relationship->active = $import->active;
                    $relationship->type = $import->type;
                    $relationship->weight = $import->weight;
                    $relationship->user_id = (isset($new_users[$import->user_id])) ? $new_users[$import->user_id] : 0;
                    $relationship->data = json_encode(unserialize($import->data));
                    $relationship->save();
                }
            }
        }
        $access = DB::connection('mediakron_v3')->table('SiteAccess')->get();
        foreach($access as $role){
            if(isset($new_sites[$role->site_id]) && isset($new_users[$role->user_id])){
                $site = $new_sites[$role->site_id];
                $user = $new_users[$role->user_id];
                $site->users()->attach($user, [
                    'role' => $role->role,
                    'granted_at' => $role->granted,
                    'active' => $role->active,
                    'ldap' => $role->ldap
                ]);
            }
        }

    }
}
