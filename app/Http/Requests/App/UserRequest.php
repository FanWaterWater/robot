<?php

namespace App\Http\Requests\App;

use App\Http\Requests\CommonRequest;

class UserRequest extends CommonRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'username' => 'required|unique:users',
            'password' => 'required',

        ];
    }

    /**
     * 获取被定义验证规则的错误消息
     *
     * @return array
     * @translator laravelacademy.org
     */
    public function messages()
    {
        return [
            'username.unique' => '手机号已被使用',
            'username.required' => '手机号必填',
            'password.required' => '密码必填'
        ];
    }
}
