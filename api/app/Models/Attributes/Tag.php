<?php

namespace App\Models\Attributes;

use App\Models\BaseModel;

class Tag extends BaseModel
{
    //

    public $fillable = [
        'uri', 'title'
    ];

    static function mediakron_v3($record, $site_id, $users){
        $item = new static();
        $item->site_id = $site_id;
        $item->title = substr($record->title, 0, 1000);
        $item->uri = $record->uri;
        $item->save();
        return $item;
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function items()
    {
        return $this->belongsToMany('App\Models\Item');
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
            'uri' => $this->uri,
            'title' => $this->title
        ];
        return $data;
    }


}
