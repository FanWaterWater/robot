<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddGmtPaymentToRobotOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('robot_orders', function (Blueprint $table) {
            $table->timestamp('gmt_payment')->after('out_biz_no')->nullable()->comment('支付时间');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('robot_orders', function (Blueprint $table) {
            $table->dropColumn('gmt_payment');
        });
    }
}
