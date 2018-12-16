<?php

namespace App\Models\Attributes;

use App\Models\BaseModel;

class Metadata extends BaseModel
{
    //
    public $fillable = [
        'source', 'citation', 'description', 'published', 'creator',
        'publisher', 'contributor', 'format', 'identifier', 'language',
        'relation', 'coverage', 'rights'
    ];

    static function mediakron_v3($data, $item_id){
        $metadata = new static();
        $metadata->fill((array) $data);
        $metadata->item_id = $item_id;
        $metadata->save();
    }

    /**
     * Convert the model instance to an array.
     *
     * @return array
     */
    public function toRelationshipArray()
    {
        return $this->toArray();
    }
}
