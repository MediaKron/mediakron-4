<?php

namespace App\Models\Attributes;

use App\Models\BaseModel;

class Video extends BaseModel
{
    //

    public $fillable = [
        'url', 'filename', 'type', 'mime', 'extension'
    ];

    static function mediakron_v3($data, $item_id){
        $video = new static();
        $video->fill((array) $data);
        $video->item_id = $item_id;
        $video->save();
    }

}
