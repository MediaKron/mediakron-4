<?php

namespace App\Models\Attributes;

use App\Models\BaseModel;

class Timeline extends BaseModel
{
    //
    public $fillable = [
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
    static function mediakron_v3($data, $date, $item_id){
        $type = 'traditional';

        if(isset($data->type)) $type = $data->type;

        if(isset($date->start)){
            if($date->start){
                $timeline = new static();
                $start = (array) $date->start;
                foreach($start as $i => $val){
                    $start[$i] = intval($val);
                }
                $timeline->fill($start);
                $timeline->position = 'start';
                $timeline->type = $type;
                $timeline->item_id = $item_id;
                $timeline->save();
            }
        }
        if(isset($date->end)){
            if($date->end){
                $timeline = new static();
                $end = (array) $date->end;
                foreach($end as $i => $val){
                    $end[$i] = intval($val);
                }
                $timeline->fill($end);
                $timeline->position = 'end';
                $timeline->type = $type;
                $timeline->item_id = $item_id;
                $timeline->save();
            }
        }
        
    }
}
