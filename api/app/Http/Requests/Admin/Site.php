<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\JsonRequest;

use Illuminate\Contracts\Validation\Validator;

class Site extends JsonRequest
{
    /*
     * Validator instance updated on failedValidation
     *
     * @var \Illuminate\Contracts\Validation\Validator
     */
    public $validator = null;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Overrid Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        $this->validator = $validator;
    }
    

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {

        return [
            // metadata
            'title' => 'required',
            'subtitle' => '',
            'institution' => '',
            'logo' => '',
            

            // Options
            'public' => '',
            'comment' => '',
            'download' => '',
            'view' => '',
            'production' => '',
            'sso' => '',
            'navigation' => '',
            'browse' => '',
            'tags' => '',
            'search' => '',
            'mklogo' => '',
            'login' => '',
            'user' => '',
            'fullscreen' => '',

            // Settings
            'ga' => '',
            'algorithm' => '',

            // Styles
            'link_color' => '',
            'banner_color' => '',
            'banner_link_color' => '',
            'skin' => '',
            'font' => '',

            // home page
            'description' => '',
            'layout' => '',
            'image' => '',
            'alt' => '',

            'primary' => ''
        ];
    }
}
