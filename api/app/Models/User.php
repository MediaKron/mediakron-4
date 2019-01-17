<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Hash;
use App\Models\Traits\User\Permissions;
use App\Models\Traits\User\Import;
use Illuminate\Database\Eloquent\SoftDeletes;


use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Collection as BaseCollection;
use Illuminate\Database\Eloquent\Relations\Pivot;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable, SoftDeletes, Import;

    static $filterable = [
        'username',
        'name',
        'email',
        'enabled',
        'bc'
    ];

    static $sortable = [
        'username',
        'name',
        'email',
        'enabled',
        'bc',
        'created_at',
        'updated_at',
        'last_login'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username',
        'name', 
        'email', 
        'password',
        'enabled',
        'bc',
        'displayname',
        'locked',
        'expired',
        'expires_at',

        'salt',
        'credentials_expired',
        'credentials_expire_at'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 
        'remember_token',
    ];

    /**
     * The dates on a user record
     *
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at',
        'last_login'
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
    /**
     * When we save from an admin side, we might need to
     * allow users to change passwords and roles.  
     * 
     * This should only be submitted by a user that has super admin 
     * privlidges because this would allow the super admin to take
     * over the user account
     *
     * @param [type] $data
     * @return void
     */
    public function adminFill($data){
        // If a password is supplied, lets set it here
        if (isset($data['password'])) $this->password = Hash::make($data['password']);
        if(isset($data['roles'])){
            $roles = [];
            foreach($data['roles'] as $role){
                if ($role == 'admin') $roles[] = 'admin';
                if ($role == 'super') $roles[] = 'super';
            }
            $this->roles = $roles;
        }
    }

    /**
     * Get the model's relationships in array form.
     *
     * @return array
     */
    public function relationsToArray()
    {
        $attributes = [];
        foreach ($this->getArrayableRelations() as $key => $value) {
            // If the values implements the Arrayable interface we can just call this
            // toArray method on the instances which will convert both models and
            // collections to their proper array form and we'll set the values.
            if ($value instanceof Arrayable) {
                if ($value instanceof BaseCollection) {
                    $relation = array_map(function ($item) {
                        return $item instanceof Arrayable ? $item->toRelationshipArray() : $item;
                    }, $value->all());
                }elseif($value instanceof Pivot){
                    $relation = $value;
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

    /**
     * Convert the model instance to an array.
     *
     * @return array
     */
    public function toRelationshipArray()
    {
        $table = $this->getTable();
        $resource = str_singular($table) . '/';
        return [
            'id' => $this->id,
            'path' => $this->api_path . $resource . $this->id
        ];
    }

    /**
     * Practices can have multiple users
     *
     * @return void
     */
    public function sites()
    {
        return $this->belongsToMany('App\Models\Site')->lists('role')->withPivot(['role', 'active', 'ldap', 'granted_at']);
    }

    /**
     * Practices can have multiple users
     *
     * @return void
     */
    public function items()
    {
        return $this->hasMany('App\Models\Item');
    }
        
}
