<?php

namespace App\Models\Attributes;

use App\Models\BaseModel;

class Map extends BaseModel
{
    //
    public $fillable = [
        'url', 'filename', 'longitude', 'latitude', 'zoom'
    ];

    static function mediakron_v3($data, $item_id){
        $metadata = new static();
        $metadata->fill($data);
        
        if(isset($data['center'])){
            if(isset($data['center']['lng'])) $map->longitude = $data['center']['lng'];
            if(isset($data['center']['lat'])) $map->latitude = $data['center']['lat'];
        }
        if(isset($data['zoom'])) $map->zoom = $data['zoom'];
        $metadata->item_id = $item_id;
        $metadata->save();
    }
}
