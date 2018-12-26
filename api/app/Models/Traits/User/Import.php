<?php

namespace App\Models\Traits\User;

use Carbon\Carbon;
use App\Models\Menu;

trait Import
{
    /**
     * Migrate site record from mediakron v3
     *
     * @param [type] $record
     * @return void
     */
    static function mediakron_v3($record){
        $user = new static();
        $user->v3_id = $record->id;
        $user->email = $record->email;
        $user->username = $record->username;
        $user->display_name = $record->displayname;
        $user->salt = $record->salt;
        $user->password = $record->password;
        $user->canvas_token = $record->canvastoken;

        // Booleans
        $user->enabled = $record->enabled;
        $user->locked = $record->locked;
        $user->expired = $record->expired;
        $user->bc = $record->bc;

        // Dates
        $user->last_login = $record->last_login;
        $user->expired_at = $record->expires_at;
        //$user->created_at = $record->created_at;
        //$user->updated_at = $record->updated_at;
        $user->save();
        return $user;
    }
}