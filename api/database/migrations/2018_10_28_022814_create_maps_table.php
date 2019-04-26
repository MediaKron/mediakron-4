<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMapsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('maps', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('item_id');
            $table->string('url')->nullable();
            $table->string('type')->nullable();
            $table->decimal('latitude', 10, 6)->default(0);
            $table->decimal('longitude', 10, 6)->default(0);
            $table->integer('zoom')->default(1);
            $table->timestamps();
            $table->index('item_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('maps');
    }
}
