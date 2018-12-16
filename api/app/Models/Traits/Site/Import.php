<?php

namespace App\Models\Traits\Site;

use Carbon\Carbon;
use App\Models\Menu;

trait Import
{
    /**
     * Migrate site record from mediakron v3
     *
     * @param [type] $record
     * @return void
     */
    static function mediakron_v3($record){
        $site = new static();
        $site->creator_id = 0;
        $site->administrator_id = 0;
        $site->institution_id = 0;

        // booleans
        $site->comment = $record->comment;
        $site->download = $record->download;
        $site->comment = $record->comment;
        $site->author = $record->showAuthor;
        $site->view = $record->showView;
        $site->public = $record->public;
        $site->initialized = $record->initialized;
        $site->production = $record->production;
        $site->indexed = 0;
        $site->sso = $record->enforceldap;


        // Main Site data
        $site->uri = $record->uri;
        $site->title = $record->title;
        $site->subtitle = $record->title;
        $site->logo = $record->logo;
        $site->algorithm = $record->searchAlgorithm;
        $site->ga = $record->ga;

        // Colors and Fonts
        $site->navigation_color = $record->nav_color;
        $site->link_color = $record->link_color;
        $site->banner_color = $record->banner_color;
        $site->banner_link_color = $record->banner_link_color;
        $site->skin = $record->skin;
        $site->font = $record->font;

        // Homepage
        $site->item_uri = $record->homepageItem;
        $site->item_id = 0;
        $site->description = $record->homepage_description;
        $site->image = $record->homepage_image;
        $site->layout = $record->homepage_layout;
        $site->alt = $record->homepageImageAlt;

        // Dates
        $site->created_at = $record->created;

        // Navigation 
        $site->navigation = $record->navigation;
        $primary_links = unserialize($record->primary_nav);
        $secondary_links = unserialize($record->secondary_nav);
        if($secondary_links){
            $site->fullscreen = (isset($secondary_links['fullscreen'])) ? $secondary_links['fullscreen'] : 0;
            $site->search = (isset($secondary_links['fullscreen'])) ? $secondary_links['search'] : 0;
            $site->tags = (isset($secondary_links['tags'])) ? $secondary_links['tags'] : 0;
            $site->mklogo = (isset($secondary_links['logo'])) ? $secondary_links['logo'] : 0;
            $site->user = (isset($secondary_links['user'])) ? $secondary_links['user'] : 0;
            $site->browse = (isset($secondary_links['browse'])) ? $secondary_links['browse'] : 0;
        }

        $site->save();

        if($primary_links){
            foreach($primary_links as $link){
                if(is_string($link)){
                    // its a uri, but we might not have items yet at this point in the migration
                    $menu = new Menu();
                    $menu->url = $link;
                    $menu->site_id = $site->id;
                    $menu->save();
                }else{
                    $menu = new Menu();
                    $menu->url = $link['url'];
                    $menu->title = $link['title'];
                    $menu->site_id = $site->id;
                    $menu->external = true;
                    $menu->save();
                }
            }
        }
    }
}