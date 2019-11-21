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
            $table->decimal('income', 4, 2)->after('type')->nullable()->default(0)->comment('收益，单位：元');
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
