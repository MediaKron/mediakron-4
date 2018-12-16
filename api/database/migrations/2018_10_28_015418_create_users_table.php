<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('v3_id')->default(0);
            $table->string('username');
            $table->string('display_name')->nullable();
            $table->string('email');
            $table->string('salt');
            $table->string('password');
            $table->string('canvas_token')->default('')->nullable();

            // booleans
            $table->boolean('enabled')->default(0);
            $table->boolean('locked')->default(0);
            $table->boolean('expired')->default(0);
            $table->boolean('bc')->default(0)->nullable();
            $table->boolean('admin')->default(0);

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
        Schema::dropIfExists('users');
    }
}
