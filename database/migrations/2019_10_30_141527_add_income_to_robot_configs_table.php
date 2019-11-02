<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIncomeToRobotConfigsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('robot_configs', function (Blueprint $table) {
            $table->tinyInteger('income')->after('type')->nullable()->default(0)->comment('收益百分比，单位：%');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('robot_configs', function (Blueprint $table) {
            $table->dropColumn('income');
        });
    }
}
