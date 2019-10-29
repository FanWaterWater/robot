<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRobotConfigsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('robot_configs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->tinyInteger('type')->nullable()->default(0)->comment('机器运行周期，0：永久，1：周期');
            $table->integer('limit')->nullable()->default(0)->comment('周期长度，单位：天');
            $table->decimal('price', 8, 2)->nullable()->default(0)->comment('机器价格');
            $table->timestamps();
            $table->index(['id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('robot_configs');
    }
}
