<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDateToRobotConfigsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('robot_configs', function (Blueprint $table) {
            $table->date('date')->after('limit')->comment('开始日期');
            $table->index(['date']);
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
            $table->dropColumn('date');
        });
    }
}
