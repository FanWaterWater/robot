<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserFundsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_funds', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id')->comment('用户ID');
            $table->tinyInteger('type')->nullable()->comment('资金类型');
            $table->decimal('change_amount', 10 ,2)->nullable()->comment('变动金额');
            $table->decimal('after_amount', 10 ,2)->nullable()->comment('变动后的金额');
            $table->string('content', 256)->nullable()->comment('变动内容');
            $table->string('remark', 256)->nullable()->comment('备注');
            $table->timestamps();
            $table->index(['id', 'user_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_funds');
    }
}
