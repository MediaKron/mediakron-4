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
            $table->integer('creator_id')->default(0);
            $table->integer('administrator_id')->default(0);
            $table->integer('institution_id')->default(0);

            // booleans
            $table->boolean('comment')->default(0)->nullable();
            $table->boolean('download')->default(0)->nullable();
            $table->boolean('author')->default(0)->nullable();
            $table->boolean('view')->default(0)->nullable();
            $table->boolean('public')->default(0)->nullable();
            $table->boolean('initialized')->default(0)->nullable();
            $table->boolean('production')->default(0)->nullable();
            $table->boolean('indexed')->default(0)->nullable();
            $table->boolean('sso')->default(0)->nullable();

            // Basic record data
            $table->string('uri')->default('');
            $table->string('title')->default('')->nullable();
            $table->string('subtitle')->default('')->nullable();
            $table->string('logo')->default('')->nullable();
            $table->string('ga')->default('')->nullable();
            $table->string('algorithm')->default('')->nullable();

            // Design
            $table->string('navigation_color')->default('')->nullable();
            $table->string('link_color')->default('')->nullable();
            $table->string('banner_color')->default('')->nullable();
            $table->string('banner_link_color')->default('')->nullable();
            $table->string('skin')->default('')->nullable();
            $table->string('font')->default('')->nullable();

            // Homepage
            $table->integer('item_id')->default(0);
            $table->string('item_uri')->default('')->nullable();
            $table->text('description')->nullable();
            $table->string('layout')->default('')->nullable();
            $table->string('image')->default('')->nullable();
            $table->string('alt')->default('')->nullable();

            // Navigation 
            $table->string('navigation');

            // Secondary menu
            $table->boolean('browse')->default(0);
            $table->boolean('tags')->default(0);
            $table->boolean('search')->default(0);
            $table->boolean('mklogo')->default(0);
            $table->boolean('login')->default(0);
            $table->boolean('user')->default(0);
            $table->boolean('fullscreen')->default(0);

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
        Schema::dropIfExists('sites');
    }
}
