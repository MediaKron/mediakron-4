<?php

namespace App\Models;

use App\Models\BaseModel;
use App\Scopes\RelationshipScope;


class Relationship extends BaseModel
{
     /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function parent()
    {
        return $this->belongsTo('App\Models\Item', 'parent_id');
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function child()
    {
        return $this->belongsTo('App\Models\Item', 'child_id');
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function attachment()
    {
        return $this->belongsTo('App\Models\Item', 'attachment_id');
    }

    /**
     * Set options attribute
     *
     * @param [type] $value
     * @return void
     */
    public function setDataAttribute($value){
        $this->attributes['data'] = json_encode($value);
    }

    /**
     * Undocumented function
     *
     * @param [type] $value
     * @return void
     */
    public function getDataAttribute($value){
        return json_decode($value);
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
        $table = $this->getTable();
        $resource = str_singular($table) . '/';
        $data = [ 
            'id' => $this->id,
            'data' => $this->data,
        ];

        foreach($this->addToArray as $key){
            $data[$key] = $this->{$key};
        }
        return $data;
    }
}
