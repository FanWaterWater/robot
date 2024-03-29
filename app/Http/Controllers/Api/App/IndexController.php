<?php

namespace App\Http\Controllers\Api\App;

use App\Models\Ad;
use App\Models\Help;
use App\Models\Agent;
use App\Models\Level;
use App\Models\Robot;
use App\Models\Video;
use App\Models\Notice;
use App\Models\Swiper;
use App\Models\Company;
use App\Services\Token;
use Illuminate\Http\Request;
use App\Models\AgentIntroduction;
use App\Http\Controllers\Controller;
use App\Models\Headline;

class IndexController extends Controller
{
    public function index()
    {
        $swipers = Swiper::where('hidden', 0)->orderBy('sort', 'desc')->get(['id', 'image', 'url']);
        $notices = Headline::orderBy('id', 'desc')->limit(10)->get(['id', 'content']);
        foreach($notices as &$notice) {
            $notice->content =  '🎉🎉🎉' . $notice->content;
        }
        $agents = Agent::inRandomOrder()->where('type', 0)->limit(5)->get();
        return  success(compact('swipers', 'notices', 'agents'));
    }

    public function notices()
    {
        $notices = Notice::orderBy('id', 'desc')->get();
        return success($notices);
    }

    public function noticeDetail(Request $request)
    {
        $notice = Notice::find($request->id);
        return success($notice);
    }

    public function helps()
    {
        $helps = Help::orderBy('id', 'desc')->get();
        return success($helps);
    }

    public function helpDetail(Request $request)
    {
        $help = Help::find($request->id);
        return success($help);
    }


    public function videos()
    {
        $videos = Video::orderBy('id', 'desc')->get();
        return success($videos);
    }

    public function agents(Request $request)
    {
        $keyword = $request->keyword;
        $agents = Agent::when($keyword, function ($query) use ($keyword) {
            return $query->where('wechat', 'like', '%' . $keyword . '%')->orWhere('name', 'like', '%' . $keyword . '%');
        })->orderBy('type', 'desc')->paginate(10);
        return success($agents);
    }

    public function agentsByType(Request $request)
    {
        $type = $request->type;
        $agents = Agent::when($type, function ($query) use ($type) {
            return $query->where('type', $type);
        })->inRandomOrder()->get();
        return success($agents);
    }

    public function ad(Request $request)
    {
        $ad = Ad::where('hidden', 0)->inRandomOrder()->first();
        return success($ad);
    }


    public function companyIntroduction()
    {
        $company = Company::first();
        return success($company);
    }

    public function agentIntroduction()
    {
        $agentIntroduction = AgentIntroduction::first();
        return success($agentIntroduction);
    }
}
