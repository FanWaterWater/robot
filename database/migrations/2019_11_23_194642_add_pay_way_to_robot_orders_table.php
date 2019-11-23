<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPayWayToRobotOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('robot_orders', function (Blueprint $table) {
            $table->string('pay_way')->after('order_no')->nullable()->comment('支付方式');
            $table->integer('num')->after('pay_way')->nullable()->comment('购买数量');
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
            $table->dropColumn('pay_way');
            $table->dropColumn('num');
        });
    }
}
