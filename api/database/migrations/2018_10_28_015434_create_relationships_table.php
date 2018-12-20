<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelationshipsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('relationships', function (Blueprint $table) {
            $table->increments('id');

            // Relationships
            $table->integer('site_id');
            $table->integer('parent_id');
            $table->integer('child_id');
            $table->integer('attachment_id');

            // User
            $table->integer('user_id');

            // booleans
            $table->boolean('active');
            $table->integer('weight');

            // Basic record data
            $table->string('type');
            $table->longtext('data');

            // Timestamps
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
        Schema::dropIfExists('relationships');
    }
}
