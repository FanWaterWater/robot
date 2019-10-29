<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWithdrawsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('withdraws', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('order_no',50)->default('')->comment('申请编号');
            $table->bigInteger('user_id')->default(0)->comment('会员ID');
            $table->tinyInteger('type')->default(0)->comment('类型，0：支付宝，1：银行卡');
            $table->string('account', 30)->comment('提现账号');
            $table->string('account_name', 20)->comment('提现人姓名');
            $table->decimal('price', 10, 2)->comment('提现金额');
            $table->tinyInteger('status')->nullable()->default(0)->comment('转账状态，0：未到账，1：已到账');
            $table->tinyInteger('verify_status')->nullable()->default(0)->comment('审核状态，0：待审核，1：审核通过，-1：审核拒绝');
            $table->string('remark', 256)->nullable()->comment('备注');
            $table->timestamps();
            $table->index(['id', 'user_id', 'type', 'status', 'verify_status']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('withdraws');
    }
}
