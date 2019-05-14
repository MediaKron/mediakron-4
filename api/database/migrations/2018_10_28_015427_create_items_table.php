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
            $table->integer('version_id')->default(1);
            $table->integer('user_id');
            $table->integer('editor_id')->nullable();

            // booleans
            $table->boolean('active')->default(1);
            $table->boolean('published')->default(1);
            $table->boolean('archived')->default(0);
            $table->boolean('locked')->default(0);

            // Basic record data
            $table->string('uri')->length(255);
            $table->string('type');
            $table->string('template')->default('default');
            $table->string('title')->length(1001);

            // Long text fields
            $table->longtext('description')->nullable();
            $table->longtext('transcript')->nullable();
            $table->longtext('body')->nullable();
            $table->longtext('caption')->nullable();
            $table->longtext('options')->nullable();
            $table->longtext('overlay')->nullable();
            $table->string('color')->default('#000000');
            $table->string('icon')->default('');

            // Timestamps
            $table->timestamp('last_login')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('user_id');
            $table->index('editor_id');
            $table->index('site_id');
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
