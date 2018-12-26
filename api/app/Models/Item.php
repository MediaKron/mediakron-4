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
            'title' => $this->title
        ];
        return $data;
    }

    /**
     * Get the model's relationships in array form.
     *
     * @return array
     */
    public function relationsToArray()
    {
        $attributes = [];
        dd($this->parents);
        foreach ($this->getArrayableRelations() as $key => $value) {
            // If the values implements the Arrayable interface we can just call this
            // toArray method on the instances which will convert both models and
            // collections to their proper array form and we'll set the values.
            if ($value instanceof Arrayable) {
                if ($value instanceof BaseCollection) {
                    dd($value->pivot);
                    //$item->toRelationshipArray();
                } else {
                    $relation = $value->toRelationshipArray();
                }

            }

            // If the value is null, we'll still go ahead and set it in this list of
            // attributes since null is used to represent empty relationships if
            // if it a has one or belongs to type relationships on the models.
            elseif (is_null($value)) {
                $relation = $value;
            }

            // If the relationships snake-casing is enabled, we will snake case this
            // key so that the relation attribute is snake cased in this returned
            // array to the developers, making this consistent with attributes.
            if (static::$snakeAttributes) {
                $key = Str::snake($key);
            }

            // If the relation value has been set, we will set it on this attributes
            // list for returning. If it was not arrayable or null, we'll not set
            // the value on the array because it is some type of invalid value.
            if (isset($relation) || is_null($value)) {
                $attributes[$key] = $relation;
            }

            unset($relation);
        }

        return $attributes;
    }

}
