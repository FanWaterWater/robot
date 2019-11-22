<?php

namespace App\Http\Controllers\Api\App;

use App\Models\User;
use App\Services\Token;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redis;
use App\Utils\TeamRole;

class TeamController extends Controller
{
    public function index()
    {
        $user = Token::user();
        return Redis::smembers('direct_user' . $user['id']);
        $recommend = User::where('id', $user['invite_id'])->first(['id', 'phone', 'wechat', 'avatar', 'nickname']);
        $directUser = Redis::scard('direct_user' . $user['id']);
        $indirectUser = Redis::scard('indirect_user' . $user['id']);
        $teamUser = $directUser + $indirectUser + Redis::scard('team_user' . $user['id']);
        $directRobot = Redis::scard('direct_robot' . $user['id']);
        $indirectRobot  = Redis::scard('indirect_robot' . $user['id']);
        $teamRobot  = Redis::scard('team_robot_total' . $user['id']);
        $data = compact('recommend', 'directUser', 'indirectUser', 'teamUser', 'directRobot', 'indirectRobot', 'teamRobot');
        return success($data);
    }

    public function detail(Request $request)
    {
        $type = $request->type;
        $userId = Token::id();
        if($type == TeamRole::DIRECT) {
            $userIds = Redis::smembers('direct_user' . $userId);
        }else if($type == TeamRole::INDIRECT) {
            $userIds = Redis::smembers('indirect_user' . $userId);
        }else {
            $userIds = Redis::smembers('team_user' . $userId);
        }
        $users = User::whereIn('id', $userIds)->with('level:id,name')->orderBy('id', 'desc')->paginate(config('common.pagesize'), ['id', 'avatar', 'nickname', 'phone', 'wechat', 'level_id']);
        foreach($users as &$user) {
            $user->direct_users_count = Redis::scard('direct_user' . $user->id);
            $user->indirect_users_count = Redis::scard('indirect_user' . $user->id);
            $user->team_users_count = Redis::scard('team_user' . $user->id);
            $user->robots_count = Redis::scard('robot' . $user->id);
            $user->team_robots_count  = Redis::scard('team_robot_total' . $user->id);
        }
        return success($users);

    }
}
