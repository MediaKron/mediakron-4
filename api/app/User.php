<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Hash;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable, SoftDeletes;

    protected $table = 'User';

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
     * Get the roles for the user
     *
     * @param [type] $value
     * @return void
     */
    public function getRolesAttribute($value)
    {
        return unserialize($value);
    }

    /**
     * Set the roles for the user as a serialized array
     *
     * @param [type] $roles
     * @return void
     */
    public function setRolesAttribute($roles){
        $this->attributes['roles'] = serialize($roles);
    }
}
