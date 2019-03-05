<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('files', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('site_id')->default('0'); // Site id
            $table->integer('asset_id')->default('0'); // Author id
            $table->string('asset_type')->nullable();
            $table->string('display')->default('');
            $table->string('name')->nullable();
            $table->string('mime', 1000);
            $table->string('uri', 1000);
            $table->integer('size')->default(0);
            $table->string('title')->default('');
            $table->string('alt')->default('');
            $table->string('preview')->default('');
            $table->integer('user_id')->default(0);
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
        Schema::dropIfExists('files');
    }
}
