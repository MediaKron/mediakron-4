<?php

namespace App\Models\Attributes;

use App\Models\BaseModel;

class Text extends BaseModel
{
    //

    public $fillable = [
        'uri', 'filename', 'type', 'mime', 'extension'
    ];

    static function mediakron_v3($data, $item_id){
        $text = new static();
        $text->fill($data);
        $text->item_id = $item_id;
        $text->save();
    }

}
