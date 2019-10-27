<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIndexToTableTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->index(['id']);
        });

        Schema::table('vip_codes', function (Blueprint $table) {
            $table->index(['id', 'user_id', 'level_id', 'status']);
        });

        Schema::table('swipers', function (Blueprint $table) {
            $table->index(['id', 'group']);
        });

        Schema::table('swiper_groups', function (Blueprint $table) {
            $table->index(['id', 'display']);
        });

        Schema::table('helps', function (Blueprint $table) {
            $table->index(['id']);
        });

        Schema::table('notices', function (Blueprint $table) {
            $table->index(['id']);
        });

        Schema::table('companys', function (Blueprint $table) {
            $table->index(['id']);
        });

        Schema::table('agents', function (Blueprint $table) {
            $table->index(['id', 'type']);
        });

        Schema::table('videos', function (Blueprint $table) {
            $table->index(['id']);
        });

        Schema::table('ads', function (Blueprint $table) {
            $table->index(['id', 'hidden']);
        });

        Schema::table('agent_introductions', function (Blueprint $table) {
            $table->index(['id']);
        });

        Schema::table('configs', function (Blueprint $table) {
            $table->index(['id', 'type', 'flag']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

    }
}
