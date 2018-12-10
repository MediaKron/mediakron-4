<?php

namespace App\Models\Attributes;

use App\Models\BaseModel;

class Timeline extends BaseModel
{
    //
    public $fillable = [
        'url', 
        'position', 
        'type', 
        'year', 
        'month',
        'day',
        'hour',
        'minute',
        'second',
    ];

    static function mediakron_v3($data, $item_id){
        $metadata = new static();
        $metadata->fill($data);
        $metadata->item_id = $item_id;
        $metadata->save();
    }
}
