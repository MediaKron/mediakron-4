<?php

namespace App\Models\Attributes;

use App\Models\BaseModel;

class Audio extends BaseModel
{
    //

    public $fillable = [
        'url', 'type', 'start', 'stop'
    ];

    static function mediakron_v3($data, $item_id){
        $audio = new static();
        $audio->fill($data);
        $audio->item_id = $item_id;
        $audio->save();
    }

}
