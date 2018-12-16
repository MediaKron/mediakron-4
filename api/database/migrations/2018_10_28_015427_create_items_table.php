<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            // Ids
            $table->increments('id');
            $table->integer('site_id');
            $table->integer('version_id');
            $table->integer('user_id');
            $table->integer('editor_id')->nullable();

            // booleans
            $table->boolean('active');
            $table->boolean('published');
            $table->boolean('archived');
            $table->boolean('locked');

            // Basic record data
            $table->string('uri')->length(255);
            $table->string('type');
            $table->string('template');
            $table->string('title')->length(1001);

            // Long text fields
            $table->longtext('description');
            $table->longtext('transcript');
            $table->longtext('body')->nullable();
            $table->longtext('caption');
            $table->longtext('options');
            $table->longtext('overlay')->nullable();

            // Timestamps
            $table->timestamp('last_login')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->softDeletes();
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
        Schema::dropIfExists('items');
    }
}
