<?php

namespace App\Models\Traits\Relationship;

use Carbon\Carbon;


trait Import
{
    /**
     * Migrate site record from mediakron v3
     *
     * @param [type] $record
     * @return void
     */
    static function mediakron_v3($record, $site_id){
        $item = new static();
        
        //$item->save();
    }

}