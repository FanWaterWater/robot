<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Robot;

class CleanExpiredRobot extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:clean-expired-robot';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'clean expired robot';

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
        Robot::where('type', 1)->whereDate('end_time', '<=', now())->delete();
    }
}
