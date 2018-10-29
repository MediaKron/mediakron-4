<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Scopes\ItemScope;

class Item extends Model
{

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public function user()
    {
        return $this->hasOne('App\User');
    }

    /**
    * The attributes that should be hidden for arrays .
    *
    * @var array
    */
    public function  editor() {
        return $this->hasOne('App\User');
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
