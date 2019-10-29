<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('username', 50)->unique()->comment('用户名（手机号）');
            $table->string('password', 100)->nullable()->comment('密码');
            $table->string('nickname', 30)->nullable()->comment('昵称');
            $table->string('avatar', 255)->nullable()->comment('头像');
            $table->string('wechat', 50)->nullable()->comment('微信号');
            $table->integer('level_id')->nullable()->default(0)->comment('等级');
            $table->decimal('amount', 10, 2)->nullable()->default(0)->comment('可提现余额');
            $table->decimal('amount_total', 10, 2)->nullable()->default(0)->comment('累计余额');
            $table->bigInteger('invite_id')->nullable()->default(0)->comment('邀请人ID');
            $table->string('invite_code', 30)->nullable()->comment('邀请码');
            $table->tinyInteger('status')->nullable()->default(0)->comment('账号状态');
            $table->string('remark', 256)->nullable()->default('')->comment('备注，账号状态为封号的时候使用');
            $table->timestamps();
            $table->index(['id', 'username', 'level_id', 'invite_id', 'invite_code', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
