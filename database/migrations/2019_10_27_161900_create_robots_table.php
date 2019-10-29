<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRobotsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('robots', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id')->comment('用户ID');
            $table->tinyInteger('type')->nullable()->default(0)->comment('机器运行周期，0：永久，1：周期');
            $table->string('robot_no', 30)->nullable()->comment('机器编号');
            $table->timestamp('start_time')->nullable()->comment('开始日期');
            $table->timestamp('end_time')->nullable()->comment('到期日期');
            $table->timestamps();
            $table->index(['id', 'user_id', 'type', 'start_time', 'end_time']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('robots');
    }
}
