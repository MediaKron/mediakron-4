<?php

namespace App\Models\Attributes;

use App\Models\BaseModel;

class Map extends BaseModel
{
    //
    public $fillable = [
        'url', 'filename', 'location', 'zoom'
    ];

    /**
     * The attributes that are spatial fields.
     *
     * @var array
     */
    protected $spatialFields = [
        'location'
    ];

    /**
     * Import map data
     *
     * @param [type] $data
     * @param [type] $item_id
     * @param string $type
     * @return void
     */
    static function mediakron_v3($data, $item_id, $type = 'stamen-light'){
        $map = new static();
        $data = (array) $data;
        
        if(isset($data['map'])) $map->fill((array) $data['map']);
        $map->type = $type;

        if(isset($data['center'])){
            $data['center'] = (array) $data['center'];
            if(isset($data['center']['lng'])) $map->longitude = $data['center']['lng'];
            if(isset($data['center'][0])) $map->longitude = $data['center'][0];
            if(isset($data['center']['lat'])) $map->latitude = $data['center']['lat'];
            if(isset($data['center'][1])) $map->longitude = $data['center'][1];
        }
        if(isset($data['zoom'])){
            $map->zoom = $data['zoom'];
        } 
        $map->item_id = $item_id;
        $map->save();
    }

    /**
     * Convert the model instance to an array
     * because we don't often want the full
     * data in relationships
     *
     * @return array
     */
    public function toRelationshipArray()
    {

        $data = [ 
            'id' => $this->id,
            'center' => [ 'lat' => $this->latitude, 'lng' => $this->longitude],
            'type' => $this->type,
            'zoom' => $this->zoom
        ];
        return $data;
    }
}
