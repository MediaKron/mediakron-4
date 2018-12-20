<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use DB;
use App\Models\Site;
use App\Models\User;
use App\Models\Item;

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
        foreach($users as $user){
            $new_user = User::mediakron_v3($user);
        }

        $sites = DB::connection('mediakron_v3')->table('Site')->get();
        foreach($sites as $site){
            $new_site = Site::mediakron_v3($site);
        }

        $sites = Site::all();
        foreach($sites as $site){
            $id = $site->uri . '_Items';
            if(DB::connection('mediakron_v3')->getSchemaBuilder()->hasTable($id)){
                $items = DB::connection('mediakron_v3')->table($site->uri . '_Items')->get();
                $new_items = [];
                foreach($items as $item){
                    $new_items[$item->uri] = Item::mediakron_v3($item, $site->id);
                }
                foreach($new_items as $item){
                    $relationships = DB::connection('mediakron_v3')->table($site->uri . '_Relationships')
                        ->where('parent', $site->uri)
                        ->orWhere('child', $site->uri)
                        ->orWhere('attachment', $site->uri)
                        ->get();

                    $new_relationship = Relationship::where('site_id', $site->id)
                        ->where('parent_id', $item->id)
                        ->orWhere('child_id', $item->id)
                        ->orWhere('attachment_id', $item->id)
                        ->first();

                    $new_relationship = 
                        $new_items[$item->uri] = Item::mediakron_v3($item, $site->id);
                }

            }
            
        }

    }
}
