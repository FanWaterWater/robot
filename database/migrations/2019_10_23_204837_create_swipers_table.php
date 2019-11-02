<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSwipersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('swipers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('image', 512)->default('')->comment('图片');
            $table->string('url', 512)->nullable()->default('')->comment('链接');
            $table->integer('sort')->nullable()->default(0)->comment('排序');
            $table->tinyInteger('hidden')->nullable()->default(0)->comment('是否隐藏，0：否，1:是');
            $table->timestamps();
            $table->index(['id', 'sort', 'hidden']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('swipers');
    }
}
