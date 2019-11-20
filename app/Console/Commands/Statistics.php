<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Robot;
use App\Models\RobotStatistics;
use Illuminate\Console\Command;
use App\Models\RegisterStatistics;
use Illuminate\Support\Facades\DB;

class Statistics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:statistics';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'statistics';

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
        $date = date('Y-m-d');
        DB::beginTransaction();
        try {
            $userCount = User::whereDate('created_at', $date)->where('add_type', 1)->count();
            RegisterStatistics::create([
                'count' => $userCount
            ]);
            $buyCount = Robot::whereDate('created_at', $date)->where('add_type', 0)->count();
            $activateCount = Robot::whereDate('created_at', $date)->where('add_type', 1)->count();
            $giftCount = Robot::whereDate('created_at', $date)->where('add_type', 2)->count();

            RobotStatistics::create([
                'buy_count' => $buyCount,
                'activate_count' => $activateCount,
                'gift_count' => $giftCount
            ]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
        }
    }
}
