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
            $table->text('source');
            $table->text('citation');
            $table->text('description');
            $table->text('published');
            $table->text('creator');
            $table->text('publisher');
            $table->text('contributor');
            $table->text('format');
            $table->text('identifier');
            $table->text('language');
            $table->text('relation');
            $table->text('coverage');
            $table->text('rights');            
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
        Schema::dropIfExists('metadata');
    }
}
