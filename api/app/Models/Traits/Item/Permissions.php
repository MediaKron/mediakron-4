<?php

namespace App\Models\Traits\Item;


trait Permissions
{

    /**
     * Check if the current user can view this record
     *
     * @return boolean
     */
    public function canView(){
        // TODO: Define can view actions
        return $this;
    }

    /**
     * Check if the current user can edit this record
     *
     * @return Model
     */
    public function canUpdate(){
        // TODO: Define can edit actions
        return $this;
    }

    /**
     * Check if the current user can create this record
     *
     * @return boolean
     */
    public function canCreate(){
        // TODO: Define can view actions
        return $this;
    }

    /**
     * Check if the current user can delete this record
     *
     * @return boolean
     */
    public function canDelete(){
        // TODO: Define can delete actions
        return $this;
    }
}