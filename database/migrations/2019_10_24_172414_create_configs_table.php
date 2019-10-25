<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConfigsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('configs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->tinyInteger('type')->nullable()->default(0)->comment('数据类型，0：数字，1：字符串');
            $table->string('flag', 50)->nullable()->default('')->comment('配置标识');
            $table->decimal('int_param', 10,2)->nullable()->default(0)->comment('数字数据');
            $table->string('string_param', 50)->nullable()->default('')->comment('字符串数据');
            $table->string('remark',100)->nullable()->default('')->comment('备注');
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
        Schema::dropIfExists('configs');
    }
}
