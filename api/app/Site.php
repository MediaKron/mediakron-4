<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    protected $table = 'Site';
    
    //
    static function byUri($uri){
        $site = static::where('uri', $uri)->first();
        if($site){
            return $site;
        }
        return false;
    }
}
