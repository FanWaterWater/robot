<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/4/9
 * Time: 9:17
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function load(Request $request)
    {
        $from_id = $request->from_id;
        $data = Chat::where(['to_id' => $from_id, 'is_read' => 0])->get();
        Chat::where(['to_id' => $from_id, 'is_read' => 0])->update(['is_read' => 1]);
        return success($data);
    }

    public function save(Request $request)
    {
        $data = $request->all();
        $data['add_time'] = time();
        $chat = DB::table('chats')->insert($data);
        if ($chat)
            return success();
        return error();
    }

    public function unRead(Request $request)
    {
        $from_id = $request->from_id;
        $data = Chat::where(['to_id' => $from_id, 'is_read' => 0])->count();
        return success($data);
    }
}
