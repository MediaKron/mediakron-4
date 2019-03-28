<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMenusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('site_id')->default(0);
            $table->integer('user_id')->default(0);
            $table->integer('parent_id')->default(0);
            $table->integer('weight')->default(0);

            $table->string('title')->default('')->nullable();
            $table->string('url')->default('')->nullable();
            $table->string('item_id')->default(0);
            $table->boolean('external')->default(0);

            $table->softDeletes();
            $table->timestamps();
            $table->index('item_id');
            $table->index('site_id');
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
        Schema::dropIfExists('menus');
    }
}
