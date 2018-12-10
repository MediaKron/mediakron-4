<?php

namespace App\Models;

use App\Models\BaseModel;
use App\Scopes\ItemScope;

class Item extends BaseModel
{
    use \App\Models\Traits\Item\Import;

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
    public function map()
    {
        return $this->hasOne('App\Models\Attributes\Map');
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
    public function getOptionsAttribute($value)
    {
        return unserialize($value);
    }

    /**
     * Set the roles for the user as a serialized array
     *
     * @param [type] $roles
     * @return void
     */
    public function setOptionsAttribute($metadata)
    {
        $this->attributes['options'] = serialize($metadata);
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
     * Get the roles for the user
     *
     * @param [type] $value
     * @return void
     */
    public function getMetadataAttribute($value)
    {
        return unserialize($value);
    }

    /**
     * Set the roles for the user as a serialized array
     *
     * @param [type] $roles
     * @return void
     */
    public function setMetadataAttribute($metadata)
    {
        $this->attributes['metadata'] = serialize($metadata);
    }

    /**
     * Get the roles for the user
     *
     * @param [type] $value
     * @return void
     */
    public function getDataAttribute($value)
    {
        return unserialize($value);
    }

    /**
     * Set the roles for the user as a serialized array
     *
     * @param [type] $roles
     * @return void
     */
    public function setDataAttribute($metadata)
    {
        $this->attributes['data'] = serialize($metadata);
    }

    /**
     * Get the parents
     *
     * @return void
     */
    public function parents()
    {
      $site = site();
      $foreign_key = 'Relationship.parent_id';
      if($site){
        $foreign_key = $site->uri . '_Relationships.parent_id';
      }
      return $this->hasMany('App\Relationship', $foreign_key);
    }

    /**
     * Get the children relationships
     *
     * @return void
     */
    public function children()
    {
        $foreign_key = 'Relationship.child_id';
        if ($site) {
            $foreign_key = $site->uri . '_Relationships.child_id';
        }
        return $this->hasMany('App\Relationship', $foreign_key);
    }
}
