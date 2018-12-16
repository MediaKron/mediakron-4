<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTimelinesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('timelines', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('item_id');
            $table->string('url')->nullable();
            $table->string('type')->nullable();
            $table->string('position')->nullable();
            $table->float('year')->nullable();
            $table->float('month')->nullable();
            $table->float('day')->nullable();
            $table->float('hour')->nullable();
            $table->float('minute')->nullable();
            $table->float('second')->nullable();
            $table->float('timestamp')->nullable();
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
        Schema::dropIfExists('timelines');
    }
}
