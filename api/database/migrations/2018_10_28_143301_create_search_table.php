<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSearchTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('search', function (Blueprint $table) {
            $table->string('word', 50)->index();
            $table->string('type', 16)->index();
            $table->integer('sid', false)->unsigned()->index();
            $table->float('score', 10, 10)->default(0);
            $table->integer('boost');
            $table->integer('position');
        });

        DB::statement("ALTER TABLE search ADD PRIMARY KEY(word, type, sid, position)");
        DB::statement("ALTER TABLE search ADD KEY (word)");
        DB::statement("ALTER TABLE search ADD KEY (type)");
        DB::statement("ALTER TABLE search ADD KEY (sid)");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('search');
    }
}
