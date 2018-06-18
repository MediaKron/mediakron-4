<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateJoinedTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::dropIfExists('Items');
        Schema::create('Items', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('version');
            $table->integer('user_id');
            $table->integer('editor_id');
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
            $table->boolean('active')->default(1);
            $table->boolean('published')->default(1);
            $table->boolean('archived')->default(0);
            $table->boolean('locked')->default(0);
            $table->string('type', 50)->default('folder');
            $table->string('template', 255)->default('default');
            $table->longText('options')->default('a:0:{}');
            $table->string('uri');
            $table->string('title', 1000);
            $table->string('tags', 1000);
            $table->longText('description')->default('');
            $table->longText('transcript')->default('');
            $table->longText('body')->default('');
            $table->longText('caption')->default('');
            $table->longText('image')->default('');
            $table->longText('metadata')->default(''); // TODO: Consider breaking this out into cast fields
            $table->longText('data')->default('');
            $table->longText('overlay')->default('');
            $table->longText('date')->default('');
            $table->longText('location')->default('');
        });
        Schema::dropIfExists('Relationships');
        Schema::create('Relationships', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('version');
            $table->integer('user_id');
            $table->integer('editor_id');
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
            $table->boolean('active')->default(1);
            $table->boolean('published')->default(1);
            $table->boolean('archived')->default(0);
            $table->boolean('locked')->default(0);
            $table->string('type', 50)->default('folder');
            $table->string('template', 255)->default('default');
            $table->longText('options')->default('a:0:{}');
            $table->string('uri');
            $table->string('title', 1000);
            $table->string('tags', 1000);
            $table->longText('description')->default('');
            $table->longText('transcript')->default('');
            $table->longText('body')->default('');
            $table->longText('caption')->default('');
            $table->longText('image')->default('');
            $table->longText('metadata')->default(''); // TODO: Consider breaking this out into cast fields
            $table->longText('data')->default('');
            $table->longText('overlay')->default('');
            $table->longText('date')->default('');
            $table->longText('location')->default('');
        });

        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::dropIfExists('Items');
    }
}
