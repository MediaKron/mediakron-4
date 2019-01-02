<?php

namespace App\Models\Attributes;

use App\Models\BaseModel;

class Image extends BaseModel
{
    //

    public $fillable = [
        'url', 'filename', 'type', 'mime', 'extension'
    ];

    static function mediakron_v3($data, $item_id){
        $image = new static();
        $image->fill((array) $data);
        if(isset($data->uri)) $image->url = $data->uri;
        $image->item_id = $item_id;
        $image->save();
    }
}
