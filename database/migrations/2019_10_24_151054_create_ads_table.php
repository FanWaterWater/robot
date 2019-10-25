<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAdsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ads', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title', 256)->default('')->nullable()->comment('标题');
            $table->string('image', 256)->default('')->nullable()->comment('图片');
            $table->string('url', 512)->nullable()->comment('链接');
            $table->tinyInteger('hidden')->default()->nullable()->comment('是否隐藏，0：否，1：是');
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
        Schema::dropIfExists('ads');
    }
}
