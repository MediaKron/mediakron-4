<?php

namespace App\Models;

use App\Models\BaseModel;

class Menu extends BaseModel
{
    //

    /**
     * Practices can have multiple products
     *
     * @return void
     */
    public function creator()
    {
        return $this->belongsTo('App\Models\User');
    }

    /**
     * Practices can have multiple products
     *
     * @return void
     */
    public function site()
    {
        return $this->belongsTo('App\Models\Site');
    }
}
