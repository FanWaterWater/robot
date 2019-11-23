<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MgopayController extends Controller
{
    public function pay()
    {

    }

    public function notify()
    {
        \Log::info('收到通知');
    }
}
