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
    static function mediakron_v3($record, $site_id){
        $item = new static();
        
        $item->version_id = $record->version;
        $item->user_id = $record->userId;
        $item->editor_id = $record->editor_id;
        $item->site_id = $site_id;

        // booleans
        $item->active = $record->active;
        $item->published = $record->published;
        $item->archived = $record->archived;
        $item->locked = $record->locked;

        // Main Record
        $item->title = substr($record->title, 0, 1000);
        $item->type = $record->type;
        $item->uri = $record->uri;
        $item->template = $record->template;
        $item->description = $record->description;
        $item->transcript = $record->transcript;
        $item->caption = $record->caption;

        $item->options = unserialize($record->options);
        
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

        //$item->save();
    }

}