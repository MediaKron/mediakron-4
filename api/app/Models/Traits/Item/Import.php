<?php

namespace App\Models\Traits\Item;

use Carbon\Carbon;
use App\Models\Attributes\Video;
use App\Models\Attributes\Audio;
use App\Models\Attributes\Image;
use App\Models\Attributes\Text;
use App\Models\Attributes\Metadata;
use App\Models\Attributes\Timeline;
use App\Models\Attributes\Map;


trait Import
{
    /**
     * Migrate site record from mediakron v3
     *
     * @param [type] $record
     * @return void
     */
    static function mediakron_v3($record, $site_id, $users){
        $item = new static();
        
        $item->version_id = $record->version;
        $item->user_id = isset($users[$record->userId]) ? $users[$record->userId]->id : 0;
        $item->editor_id = isset($users[$record->editor_id]) ? $users[$record->editor_id]->id : 0;
        $item->site_id = $site_id;

        // booleans
        $item->active = $record->active;
        $item->published = $record->published;
        $item->archived = $record->archived;
        $item->locked = $record->locked;

        // Main Record
        $item->title = substr($record->title, 0, 1000);
        $map_type = false;
        switch($record->type){
            case 'map':
            case 'image-map':
            case 'Esri_WorldStreetMap':
            case 'Esri_DeLorme':
            case 'Esri_NatGeoWorldMap':
            case 'Esri_WorldImagery':
            case 'stamen-lite':
            case 'physical':
            case 'stamen-light':
            case 'stamen-watercolor':
            case 'osm':
            case 'cartodb':
                $item->type = 'map';
                $item->template = $record->template;
                $map_type = $record->type;
                break;
            case 'comparison':
                $item->type = 'collection';
                $item->template = 'comparison';
                break;
            case 'progression':
                $item->type = 'collection';
                $item->template = 'progression';
                break;
            case 'slideshow':
                $item->type = 'collection';
                $item->template = 'slideshow';
                break;
            case 'folder':
                $item->type = 'collection';
                $item->template = $record->template;
                break;
            default:
                $item->template = $record->template;
                $item->type = $record->type;
        }
        
        $item->uri = $record->uri;
        
        $item->description = $record->description;
        $item->transcript = $record->transcript;
        $item->caption = $record->caption;

        $item->options = unserialize($record->options);
        if(isset($item->options->color)) $item->color = $item->options->color;
        if(isset($item->options->icon)) $item->color = $item->options->icon;
        
        $item->overlay = $record->overlay;

        // Dates
        $item->created_at = $record->created;
        $item->updated_at = $record->changed;
        $item->save();

        // Add metadata
        $metadata = unserialize($record->metadata);
        if(isset($metadata)){
            if(!empty($metadata)) Metadata::mediakron_v3($metadata, $item->id);
        }

        // Add images
        $image = unserialize($record->image);
        if(isset($image)){
            if(!empty($image)) Image::mediakron_v3($image, $item->id);
        }
        
        $data = unserialize($record->data);
        if(isset($data['audio'])){
            if(!empty($data['audio'])) Audio::mediakron_v3($data['audio'], $item->id);
        }
        
        if(isset($data['video'])){
            if(!empty($data['video'])) Video::mediakron_v3($data['video'], $item->id);
        }
        if(isset($data['text'])){
            if(!empty($data['text'])) Text::mediakron_v3($data['text'], $item->id);
        }
        $date = json_decode($record->date);
        if(!empty($date)){
            Timeline::mediakron_v3($data['timeline'], $date, $item->id);
        } 

        if($map_type){
            Map::mediakron_v3($data, $item->id, $map_type);
        }elseif(isset($data['map'])){
            if(!empty($data['map'])) Map::mediakron_v3($data, $item->id, false);
        } 
        return $item;
        //$item->save();
    }

}