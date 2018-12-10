<?php

namespace App\Models;

use App\Models\BaseModel;

class Site extends BaseModel
{

    use \App\Models\Traits\Site\Import;
    
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
    public function menus()
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


}
