<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\JsonRequest;

use Illuminate\Contracts\Validation\Validator;

class UserRequest extends JsonRequest
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
        if ($this->method() == 'PUT') {
            // Update operation, exclude the record with id from the validation:
            $email_rule = 'required|email|unique:User,email,' . $this->get('id');
        } else {
            // Create operation. There is no id yet.
            $email_rule = 'required|email|unique:User,email';
        }
        return [
                'username' => 'required', //Must be a number and length of value is 8
                'email' => $email_rule,
                'enabled' => 'required'
        ];
    }
}
