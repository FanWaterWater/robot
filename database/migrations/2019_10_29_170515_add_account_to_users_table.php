<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAccountToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->bigInteger('alipay_account_id')->after('status')->nullable()->default(0)->comment('支付宝账号ID');
            $table->bigInteger('bank_account_id')->after('alipay_account_id')->nullable()->default(0)->comment('银行卡账号ID');
            $table->index(['alipay_account_id', 'bank_account_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('alipay_account_id');
            $table->dropColumn('bank_account_id');
        });
    }
}
