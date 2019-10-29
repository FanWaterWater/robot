<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIncomeSwitchToRobotConfigsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('robot_configs', function (Blueprint $table) {
            $table->tinyInteger('income_switch')->after('id')->default(0)->nullable()->comment('收益开关，0：关，1：开');
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
            $table->dropColumn('income_switch');
        });
    }
}
