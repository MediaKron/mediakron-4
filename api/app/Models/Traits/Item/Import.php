<?php

namespace App\Models\Traits\Item;

use Carbon\Carbon;
use App\Models\Video;
use App\Models\Audio;
use App\Models\Image;
use App\Models\Metadata;
use App\Models\Timeline;
use App\Models\Map;



trait Import
{
    /**
     * Migrate site record from mediakron v3
     *
     * @param [type] $record
     * @return void
     */
    static function mediakron_v3($record, $site_id){
        $item = new static();
        
        $item->version = $record->version;
        $item->user_id = $record->userId;
        $item->editor_id = $record->editor_id;
        $item->site_id = $site_id;

        // booleans
        $item->active = $record->active;
        $item->published = $record->published;
        $item->archived = $record->archived;
        $item->locked = $record->locked;

        // Main Record
        $item->title = $record->title;
        $item->type = $record->type;
        $item->uri = $record->uri;
        $item->template = $record->template;
        $item->description = $record->description;
        $item->transcript = $record->transcript;
        $item->caption = $record->caption;

        $item->options = $record->options;
        $item->metadata = $record->metadata;
        $item->overlay = $record->overlay;

        // Dates
        $item->created_at = $record->created;
        $item->updated_at = $record->changed;
        $item->save();

        // Add images
        $image = unserialize($record->image);
        if(isset($image)){
            if(!empty($image)) Video::mediakron_v3($image);
        }
        
        $data = unserialize($record->data);
        if(isset($data['audio'])){
            if(!empty($data['audio'])) Audio::mediakron_v3($data['audio']);
        }
        
        if(isset($data['video'])){
            if(!empty($data['video'])) Video::mediakron_v3($data['video']);
        }
        if(isset($data['text'])){
            if(!empty($data['text'])) Video::mediakron_v3($data['text']);
        }

        $metadata = unserialize($record->metadata);
        
        dump($metadata);

        //$item->save();
    }

}