<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('site_id');
            $table->integer('user_id');
            $table->integer('item_id');
            $table->integer('version');

            $table->integer('start');
            $table->integer('end');

            $table->boolean('active')->default(true);
            $table->boolean('private')->default(false);
            $table->boolean('archive')->default(false);

            // Basic record data
            $table->string('uri');
            $table->longtext('snippet');
            $table->longtext('comment');

            // Timestamps
            $table->softDeletes();
            $table->timestamps();

            $table->index('site_id');
            $table->index('item_id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('comments');
    }
}
