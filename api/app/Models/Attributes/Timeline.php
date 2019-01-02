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

    /**
     * Undocumented function
     *
     * @param [type] $data
     * @param [type] $item_id
     * @return void
     */
    static function mediakron_v3($data, $item_id){
        $metadata = new static();
        $metadata->fill((array) $data);
        $metadata->item_id = $item_id;
        $metadata->save();
    }
}
