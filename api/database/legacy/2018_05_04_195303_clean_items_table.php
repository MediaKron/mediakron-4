<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\Models\Site;
use App\Models\Item;
use App\Models\Relationship;

class CleanItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        $sites = Site::all();
        foreach($sites as $site){
            if(!Schema::hasTable($site->uri . '_Items')) continue;
            Schema::table($site->uri . '_Items', function ($table) {
                $table->renameColumn('created', 'created_at');
                $table->renameColumn('changed', 'updated_at');
                $table->softDeletes();

                $table->dropColumn('userId');

                $table->integer('version')->default(0)->change();
                $table->integer('active')->default(1)->change();
                $table->integer('published')->default(1)->change();
                $table->integer('archived')->default(0)->change();
                $table->integer('locked')->default(0)->change();

                $table->longtext('body')->default('')->change();
                $table->longtext('description')->default('')->change();
                $table->string('type')->default('folder')->change();
                $table->longtext('transcript')->default('')->change();
                $table->longtext('caption')->default('')->change();
                $table->longtext('overlay')->default('')->change();
                $table->longtext('date')->default('')->change();

                $table->longtext('options')->default('a:0:{}')->change();
                $table->longtext('image')->default('a:0:{}')->change();
                $table->longtext('metadata')->default('a:0:{}')->change();
                
            });
            if (!Schema::hasTable($site->uri . '_Relationships')) continue;
            Schema::table($site->uri . '_Relationships', function ($table) {
                $table->integer('parent_id')->default(0);
                $table->integer('child_id')->default(0);
                $table->timestamps();
            });
            $relationships = new Relationship;
            $relationships->setTable($site->uri . '_Relationships');
            foreach($relationships->get() as $relationship){
                $item = new Item;
                $item->setTable($site->uri . '_Items');
                $relationship->setTable($site->uri . '_Relationships');
                $parent = $item->where('uri', $relationship->parent)->first();
                if($parent) $relationship->parent_id = $parent->id;
                $child = $item->where('uri', $relationship->child)->first();
                if($child) $relationship->child_id = $child->id;
                $relationship->save();
            }

            if (!Schema::hasTable($site->uri . '_Revisions')) continue;
            Schema::table($site->uri . '_Revisions', function ($table) {
                $table->renameColumn('site', 'site_id');
                $table->renameColumn('user', 'user_id');
                $table->renameColumn('item', 'item_id');
                $table->integer('site_id')->default(0)->change();
                $table->integer('user_id')->default(0)->change();
                $table->integer('item_id')->default(0)->change();
                $table->integer('version_id')->default(0)->change();
                $table->string('uri')->default('')->change();
                $table->longtext('document')->default('')->change();
            });

        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
