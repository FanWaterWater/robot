<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use App\Jobs\CalcRobotIncome as CalcRobotIncomeJob;

class CalcRobotIncome extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:calc-robot-income';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'calc robot income';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $config = Cache::get('robot_config');
        $income = $config['income'];
        if ($config['income_switch'] == 1) {
            $users = User::where('status', 0)->get(['id']);
            foreach ($users as $user) {
                \Log::info('用户:' . $user->id);
                CalcRobotIncomeJob::dispatch($user->id, $income);
            }
            \Log::info('机器收益结算,今日结算用户数量:' . count($users));
        }
    }
}
