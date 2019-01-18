<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Validator;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public $validator = false;

    // default number of records per page
    public $per_page = 10;

    /**
     * Validates a json request or returns false
     *
     * @param [type] $rules
     * @return void
     */
    public function validateJsonRequest($rules){
        // Fetch Contents
        $data = json_decode(request()->getContent(), true);

        // Validate user data
        $this->validator = Validator::make($data, $this->rules);
        if ($this->validator->passes()) {
            return $data;
        } else {
            // Return error array if errors
            return false;
        }
    }
}
