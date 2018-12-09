<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSitesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sites', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('creator_id');
            $table->integer('administrator_id');
            $table->integer('institution_id');

            // booleans
            $table->boolean('comment');
            $table->boolean('download');
            $table->boolean('author');
            $table->boolean('view');
            $table->boolean('public');
            $table->boolean('initialized');
            $table->boolean('production');
            $table->boolean('indexed');
            $table->boolean('sso');

            // Basic record data
            $table->string('uri');
            $table->string('title');
            $table->string('subtitle');
            $table->string('logo');
            $table->string('ga');
            $table->string('algorithm');

            // Design
            $table->string('navigation_color');
            $table->string('link_color');
            $table->string('banner_color');
            $table->string('banner_link_color');
            $table->string('skin');
            $table->string('font');

            // Homepage
            $table->string('item');
            $table->text('description');
            $table->string('layout');
            $table->string('image');
            $table->string('alt');

            // Navigation 
            $table->string('navigation');

            // Secondary menu
            $table->boolean('browse');
            $table->boolean('tags');
            $table->boolean('search');
            $table->boolean('mklogo');
            $table->boolean('login');
            $table->boolean('fullscreen');

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
        Schema::dropIfExists('sites');
    }
}
