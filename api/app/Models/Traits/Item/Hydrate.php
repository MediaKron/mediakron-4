<?php

namespace App\Models\Traits\Item;

use Auth;
use App\Models\Site;


trait Hydrate
{
    public function hydrate($request){
        $this->fill($request->get([
            'active',
            'published',
            'locked',
            'type',
            'template',
            'title',
            'description',
            'transcript',
            'body',
            'caption',
            'options',
            'overlay'
        ]));
    }

    /**
     * Set the current user as the owner of the record
     *
     * @return App\Models\User
     */
    public function setOwner(){
        $user = Auth::user();
        $this->user_id = $user->id;
        return $this;
    }

    /**
     * Set the current user as the editor
     *
     * @return App\Models\User
     */
    public function setEditor(){
        $user = Auth::user();
        $this->editor_id = $user->id;
        return $this;
    }

    /**
     * Undocumented function
     *
     * @param Site $site
     * @return void
     */
    public function setSite(Site $site){
        $this->site_id = $site->id;
        return $this;
    }

    /**
     * Undocumented function
     *
     * @param Site $site
     * @return void
     */
    public function setActive($status = 1){
        $this->active = $status;
        return $this;
    }

    /**
     * Undocumented function
     *
     * @param Site $site
     * @return void
     */
    public function setLocked($status = 0){
        $this->locked = $status;
        return $this;
    }

    /**
     * Undocumented function
     *
     * @param Site $site
     * @return void
     */
    public function setPublished($status = 1){
        $this->published = $status;
        return $this;
    }
}