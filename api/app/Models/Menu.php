<?php

namespace App\Models;

use App\Models\BaseModel;

class Menu extends BaseModel
{
    //

    /**
     * Practices can have multiple products
     *
     * @return void
     */
    public function creator()
    {
        return $this->belongsTo('App\Models\User');
    }

    /**
     * Practices can have multiple products
     *
     * @return void
     */
    public function site()
    {
        return $this->belongsTo('App\Models\Site');
    }

    /**
     * Practices can have multiple products
     *
     * @return void
     */
    public function item()
    {
        return $this->belongsTo('App\Models\Item');
    }

    /**
     * Undocumented function
     *
     * @return void
     */
    public function toRelationshipArray()
    {
        
        $table = $this->getTable();
        $resource = str_singular($table) . '/';
        $data = [ 
            'id' => $this->id,
            'url' => $this->url,
        ];
        if($this->item_id > 0){
            $data['title'] = $this->item->title;
            $data['external'] = 0;
        }elseif(isset($this->title)){
            $data['title'] = $this->title;
            $data['external'] = 1;
        };
        foreach($this->addToArray as $key){
            $data[$key] = $this->{$key};
        }
        return $data;
    }
}
