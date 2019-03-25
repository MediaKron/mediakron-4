<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('site_id');
            $table->string('title');
            $table->string('uri');
            $table->timestamps();
        });

        // Products can be used for multiple treatments
        Schema::create('item_tag', function (Blueprint $table) {
            $table->integer('item_id')->unsigned(); // Author id
            $table->integer('tag_id')->unsigned();
            $table->timestamps();
            $table->primary(['item_id', 'tag_id']);

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tags');
        Schema::dropIfExists('item_tag');
    }
}
