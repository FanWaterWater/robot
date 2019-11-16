<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAddTypeToRobotsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('robots', function (Blueprint $table) {
            $table->tinyInteger('add_type')->after('type')->nullable()->default(0)->comment('添加类型，0：购买，1：激活');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('robots', function (Blueprint $table) {
            $table->dropColumn('add_type');
        });
    }
}
