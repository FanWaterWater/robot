<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVipCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vip_codes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code', 30)->unique()->comment('邀请码');
            $table->integer('user_id')->nullable()->default(0)->comment('使用的会员ID');
            $table->integer('level_id')->nullable()->default(0)->comment('会员等级ID');
            $table->tinyInteger('status')->nullable()->default(0)->comment('使用状态：0：未使用，1：已使用');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vip_codes');
    }
}
