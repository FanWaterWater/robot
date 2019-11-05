<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRobotOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('robot_orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('order_no', 50)->nullable()->default('')->comment('订单编号');
            $table->string('app_id', 50)->nullable()->default('')->comment('订单编号');
            $table->string('trade_no', 100)->nullable()->default('')->comment('支付宝交易凭证号');
            $table->string('out_biz_no', 100)->nullable()->default('')->comment('商户业务ID，主要是退款通知中返回退款申请的流水号');
            $table->bigInteger('user_id')->default(0)->comment('用户ID');
            $table->decimal('price', 10, 2)->default(0)->comment('价格');
            $table->integer('status')->default(0)->comment('订单状态，0：待支付，1：已支付');
            $table->timestamps();
            $table->index(['id', 'order_no', 'trade_no']);
            $table->index(['out_biz_no', 'user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('robot_orders');
    }
}
