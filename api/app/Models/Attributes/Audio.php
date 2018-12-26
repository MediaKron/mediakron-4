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
        $audio->fill((array) $data);
        $audio->item_id = $item_id;
        $audio->save();
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
            'url' => $this->url,
            'type' => $this->type,
            'mime' => $this->mime,
            'start' => $this->start,
            'stop' => $this->stop,
        ];
        return $data;
    }

}
