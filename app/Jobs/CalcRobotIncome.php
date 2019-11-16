<?php

namespace App\Jobs;

use App\Models\User;
use App\Utils\FundType;
use App\Models\UserFund;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class CalcRobotIncome implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $userId;
    private $income;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($userId, $income)
    {
        $this->userId = $userId;
        $this->income = $income;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        \Log::info('队列执行');
        DB::beginTransaction();
        try {
            $user = User::with('level:id,income_reward')->find($this->userId);
            $income = $this->income;
            $myIncome = Redis::scard('today_robot' . $user->id) * $income;
            //直推收益
            $directIncome = Redis::scard('today_direct_robot' . $user->id) * ($user->level->income_reward['direct'] / 100 * $income);
            //间推收益
            $indirectIncome = Redis::scard('today_indirect_robot' . $user->id) * ($user->level->income_reward['indirect'] / 100 * $income);
            //团队收益
            $teamIncome = Redis::scard('today_team_robot' . $user->id) * ($user->level->income_reward['team'] / 100 * $income);
            $totalIncome = $myIncome + $directIncome + $indirectIncome + $teamIncome;
            if ($totalIncome > 0) {
                $user->increment('amount', $totalIncome);
                $user->increment('amount_total', $totalIncome);
                UserFund::create([
                    'user_id' => $user->id,
                    'type' => FundType::ROBOT_INCOME,
                    'change_amount' => $totalIncome,
                    'after_amount' => $user->amount,
                    'content' => "每日机器收益结算，获得持有机器收益{$myIncome}元、直推机器收益{$directIncome}元、间推机器收益{$indirectIncome}元、团队机器收益{$teamIncome}元,总共{$totalIncome}元",
                    'remark' => '机器收益结算'
                ]);
            }
            DB::commit();
            //更新今日机器数量
            $user->updateTodayRobotCount();
        } catch (\Exception $e) {
            \Log::info('机器收益结算回滚-userId:' . $this->userId);
            DB::rollback();
        }
    }
}
