<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('alipay_accounts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id')->comment('用户ID');
            $table->bigInteger('name')->comment('账号名称');
            $table->bigInteger('account')->comment('账号');
            $table->timestamps();
            $table->index(['id', 'user_id']);
        });

        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id')->comment('用户ID');
            $table->string('bank', 30)->comment('银行名称');
            $table->bigInteger('name')->comment('账号名称');
            $table->bigInteger('account')->comment('账号');
            $table->timestamps();
            $table->index(['id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('alipay_accounts');
        Schema::dropIfExists('bank_accounts');

    }
}
