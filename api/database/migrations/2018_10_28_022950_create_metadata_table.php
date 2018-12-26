<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMetadataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('metadata', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('item_id');
            // metadata
            $table->text('source')->nullable();
            $table->text('citation')->nullable();
            $table->text('description')->nullable();
            $table->text('published')->nullable();
            $table->text('creator')->nullable();
            $table->text('publisher')->nullable();
            $table->text('contributor')->nullable();
            $table->text('format')->nullable();
            $table->text('identifier')->nullable();
            $table->text('language')->nullable();
            $table->text('relation')->nullable();
            $table->text('coverage')->nullable();
            $table->text('rights')->nullable();
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
        Schema::dropIfExists('metadata');
    }
}
