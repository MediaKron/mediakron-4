<?php

namespace App\Models\Attributes;

use App\Models\BaseModel;

class Image extends BaseModel
{
    //

    public $fillable = [
        'uri', 'filename', 'type', 'mime', 'extension'
    ];

    static function mediakron_v3($data, $item_id){
        $image = new static();
        $image->fill($data);
        $image->item_id = $item_id;
        $image->save();
    }
}
