<?php

namespace App\Models;

use App\Models\BaseModel;
use App\Scopes\ItemScope;

class Item extends BaseModel
{
    use \App\Models\Traits\Item\Import;

    static $select_with = ['metadata', 'image', 'audio', 'video', 'text', 'timeline', 'map'];

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        // Allow us to set permissions via the global scope
        static::addGlobalScope(new ItemScope);
    }

    /**
     * Set options attribute
     *
     * @param [type] $value
     * @return void
     */
    public function setOptionsAttribute($value){
        $this->attributes['options'] = json_encode($value);
    }

    /**
     * Undocumented function
     *
     * @param [type] $value
     * @return void
     */
    public function getOptionsAttribute($value){
        return json_decode($value);
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    /**
    * The attributes that should be hidden for arrays .
    *
    * @var array
    */
    public function  editor() {
        return $this->belongsTo('App\Models\User', 'editor_id');
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function relationship()
    {
        return $this->hasMany('App\Relationship');
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function audio()
    {
        return $this->hasOne('App\Models\Attributes\Audio');
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function image()
    {
        return $this->hasOne('App\Models\Attributes\Image');
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function video()
    {
        return $this->hasOne('App\Models\Attributes\Video');
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function text()
    {
        return $this->hasOne('App\Models\Attributes\Text');
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function map()
    {
        return $this->hasOne('App\Models\Attributes\Map');
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function timeline()
    {
        return $this->hasOne('App\Models\Attributes\timeline');
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function metadata()
    {
        return $this->hasOne('App\Models\Attributes\Metadata');
    }


    /**
     * Get the roles for the user
     *
     * @param [type] $value
     * @return void
     */
    public function getImageAttribute($value)
    {
        return unserialize($value);
    }

    /**
     * Set the roles for the user as a serialized array
     *
     * @param [type] $roles
     * @return void
     */
    public function setImageAttribute($metadata)
    {
        $this->attributes['image'] = serialize($metadata);
    }

    /**
     * Get the parents
     *
     * @return void
     */
    public function parents()
    {
      return $this->hasMany('App\Relationship');
    }

    /**
     * Get the children relationships
     *
     * @return void
     */
    public function children()
    {
        return $this->hasMany('App\Relationship');
    }
}
