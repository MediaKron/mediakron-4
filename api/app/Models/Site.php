<?php

namespace App\Models;

use App\Models\BaseModel;
use App\Models\Item;
use App\Models\Menu;
use Auth;

class Site extends BaseModel
{

    use \App\Models\Traits\Site\Import;

    public $fillable = [
        // metadata
        'title',
        'subtitle',
        'institution',
        'logo',
        

        // Options
        'public',
        'comment',
        'download',
        'view',
        'production',
        'sso',
        'navigation',
        'browse',
        'tags',
        'search',
        'mklogo',
        'login',
        'user',
        'fullscreen',

        // Settings
        'ga',
        'algorithm',

        // Styles
        'link_color',
        'banner_color',
        'banner_link_color',
        'skin',
        'font',

        // home page
        'description',
        'layout',
        'image',
        'alt'
    ];

    //
    /**
     * Get Site by URI
     *
     * @param [type] $uri
     * @return void
     */
    static function byUri($uri){
        $site = static::where('uri', $uri)->first();
        if($site){
            return $site;
        }
        return false;
    }

    public $data = [];

    // Add the data on, not sure if we need this
    protected $appends = [ 'data' ];

    /**
     * Undocumented function
     *
     * @return void
     */
    public function getDataAttribute(){
        return [
            "settings" => route('site.setting.show', ['site' => $this->uri]),

        ];/*
            "search" => [
                "query" => "{{ path(" search",{ 'uri': site.uri })|raw }}/" ,
                    "phonetic" => "{{ path(" searchPhonetic",{ 'uri': site.uri })|raw }}/" ,
                    "initialize" => "{{ path(" searchInitialize",{ 'uri': site.uri })|raw }}" ,
                    "index" => "{{ path(" searchIndex",{ 'uri': site.uri })|raw }}/" ,
                    "terms" => "{{ path(" searchAggregate",{ 'uri': site.uri })|raw }}"
            ]
                },
            "all" => "{{ path(" data_all ",{ 'uri': site.uri })|raw }}",
            "upload" => "{{ path(" upload ",{ 'uri': site.uri })|raw }}",
            "login" => "{{ path(" fos_user_security_check ")|raw }}",
            "logout" => "{{ path(" fos_user_security_logout ")|raw }}",
            "profile" => "{{ path('fos_user_profile_show')|raw }}",
            "canvasConnect" => "{{ path(" canvasConnect ",{'type': 'json'})|raw }}",
            "canvasDisconnect" => "{{ path(" canvasDisconnect ",{'type': 'json'})|raw }}",
            "courses" => "{{ path(" data_canvas_courses ", { 'uri': site.uri })|raw }}",
            "connectCourse" => "{{ path(" connectSiteToCanvas ", { 'uri': site.uri })|raw }}",
            "stats" => "{{ path(" data_stats ", { 'uri': site.uri })|raw }}",
            "revisions" => "{{ path(" data_revisions ", { 'site': site.uri })|raw }}",
            "trash" => "{{ path(" data_trash ", { 'uri': site.uri })|raw }}",
            "poll" => "{{ path(" data_poll ", { 'uri': site.uri })|raw }}",
            "addTags" => "{{ path(" data_add_tag ", { 'uri': site.uri })|raw }}",
            "collections" : {
            "items" => "{{ path(" data_all",{ 'uri': site.uri })|raw }}" ,
                "comments" => "{{ path(" data_comments_list",{ 'uri': site.uri })|raw }}" ,
                "archived" => "{{ path(" data_archived",{ 'uri': site.uri })|raw }}" ,
                "search" :"{{ site.uri }}/data/search" ,
                "users" => "{{ path(" get_users",{ 'uri': site.uri })|raw }}" ,
                "groups" => "{{ path(" get_groups ",{ 'uri': site.uri })|raw }}"
        },
            "models" : {
            "items" => "{{ path(" data_item",{ 'uri': site.uri })|raw }}" ,
                "comments" => "{{ path(" data_comments_show",{ 'uri': site.uri })|raw }}" ,
                "user" => "{{ path(" get_user",{ 'uri': site.uri })|raw }}" ,
                "group" => "{{ path(" get_group ",{ 'uri': site.uri })|raw }}"
        }*/
        
    }

    /**
     * Practices can have multiple users
     *
     * @return void
     */
    public function primary()
    {
        return $this->hasMany('App\Models\Menu');
    }

    /**
     * Practices can have multiple products
     *
     * @return void
     */
    public function institution()
    {
        return $this->belongsTo('App\Models\Institution');
    }

    /**
     * Practices can have multiple products
     *
     * @return void
     */
    public function users()
    {
        return $this->belongsToMany('App\Models\User')->withPivot(['role', 'active', 'ldap', 'granted_at']);
    }

    /**
     * When we save from an admin side, we might need to
     * allow users to change passwords and roles.  
     * 
     * This should only be submitted by a user that has super admin 
     * privlidges because this would allow the super admin to take
     * over the user account
     *
     * @param [type] $data
     * @return void
     */
    public function adminFill($data){
        return $this;
    }

    public function primaryMenu($data){
        $menus = [];
        $user = Auth::user();
        foreach($data as $link){
            // They're adding a 
            if(isset($link['id'])){
                // get item and attach it as the menu item
                $item = Item::where('id', $link['id'])->where('site_id', $this->id)->first();
                if($item){
                    // Get Menu
                    $menu = Menu::where('item_id', $link['id'])->where('site_id', $this->id)->first();
                    if(!$menu){
                        $menu = new Menu();
                        $menu->item_id = $item->id;
                        $menu->user_id = $user->id;
                        $menu->save();
                    } 
                    $menus[] = $menu->id;
                }                
            }elseif(isset($link['url'])){
                // get item and attach it as the menu item
                    // Get Menu
                $menu = Menu::where('url', $link['url'])->where('site_id', $this->id)->first();
                if(!$menu){
                    $menu = new Menu();
                    $menu->url = $link['url'];
                    $menu->title = isset($link['title']) ? $link['title'] : '';
                    $menu->save();
                } 
                $menus[] = $menu->id;               
            }


        }
    }


}
