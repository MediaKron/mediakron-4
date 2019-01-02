<?php

namespace App\Models;

use App\Models\BaseModel;
use App\Scopes\ItemScope;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Collection as BaseCollection;
use Illuminate\Database\Eloquent\Relations\Pivot;


class Item extends BaseModel
{
    use \App\Models\Traits\Item\Import;

    static $select_with = [
        'metadata', 
        'image',
        'audio', 
        'video', 
        'text', 
        'timeline', 
        'map', 
        'children', 
        'parents', 
        'attachments'
    ];

    protected $appends = [
        'thumbnail'
    ];

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();
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
    public function parents()
    {
        return $this->hasManyThrough('App\Models\Item', 'App\Models\Relationship', 'child_id', 'id');
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function children()
    {
        return $this->hasManyThrough('App\Models\Item', 'App\Models\Relationship', 'parent_id', 'id');
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function attachments()
    {
        return $this->hasMany('App\Models\Relationship', 'attachment_id');
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
    public function getThumbnailAttribute($value)
    {
        if($this->image){
            if(isset($this->image->url)){
                return $this->image->url;
            }
        }
        return false;
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
            'title' => $this->title,
            'type' => $this->type,
            'image' => $this->thumbnail
        ];
        return $data;
    }


}
