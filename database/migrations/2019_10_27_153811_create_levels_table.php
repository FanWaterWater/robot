<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLevelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('levels', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 30)->comment('等级名');
            $table->integer('direct_reward')->nullable()->default(0)->comment('直推奖励');
            $table->integer('indirect_reward')->nullable()->default(0)->comment('间推奖励');
            $table->string('income_reward', 512)->nullable()->comment('收益奖励，单位%');
            $table->string('upgrade', 512)->nullable()->comment('升级条件');
            $table->tinyInteger('sort')->nullable()->default(0)->comment('排序');
            $table->timestamps();
            $table->index(['id', 'sort']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('levels');
    }
}
