<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    protected $table = 'Site';

    protected $appends = [ 'data' ];
    
    //
    static function byUri($uri){
        $site = static::where('uri', $uri)->first();
        if($site){
            return $site;
        }
        return false;
    }

    public $data = [];

    public function getDataAttribute(){
        return [
            "settings" => route('settings.show', ['site' => $this->uri]),
            
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
     * Get the roles for the user
     *
     * @param [type] $value
     * @return void
     */
    public function getPrimaryNavAttribute($value)
    {
        return unserialize($value);
    }

    /**
     * Set the roles for the user as a serialized array
     *
     * @param [type] $roles
     * @return void
     */
    public function setPrimaryNavAttribute($metadata)
    {
        $this->attributes['primary_nav'] = serialize($metadata);
    }

    /**
     * Get the roles for the user
     *
     * @param [type] $value
     * @return void
     */
    public function getSecondaryNavAttribute($value)
    {
        return unserialize($value);
    }

    /**
     * Set the roles for the user as a serialized array
     *
     * @param [type] $roles
     * @return void
     */
    public function setSecondaryNavAttribute($metadata)
    {
        $this->attributes['secondary_nav'] = serialize($metadata);
    }


}
