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
        $metadata->fill($data);
        $metadata->item_id = $item_id;
        $metadata->save();
    }
}
