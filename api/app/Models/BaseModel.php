<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Storage;
use DB;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Collection as BaseCollection;
use Illuminate\Database\Eloquent\Relations\Pivot;

class BaseModel extends Model
{
    //
    // Add the search trait to all models
    use \App\Models\Traits\Search;
    
    public $drupal = false;

    public $api_path = '/api/' ;

    /**
     * An array of model validation rules
     */
    static $validate = [];

    public $uploadable = [];

    public $addToArray = [];

    static $filterable = [];
    static $default_sort = 'updated_at';
    static $sortable = [
        'created_at',
        'updated_at'
    ];
    static $default_direction = 'DESC';
    static $directions = [
        'ASC',
        'DESC'
    ];
    static $per_page = 10;

    /**
     * Build a basic list query with filerable and sortable arrays
     *
     * @param boolean $query
     * @return \Illuminate\Database\Query\Builder
     */
    static function listQuery($query = false){
        if(!$query) $query = static::query();
        // Get an array of possible filters
        $filters = request(static::$filterable, []); 
        //Filter by everything we can filter by
        foreach($filters as $key => $filter){
            if(in_array($key, static::$filterable) && !empty($filter)){
                $query->where($key, $filter);
            }
        }

        // fetch a string of the column to sort on, assuming created_at if not specified
        $sort = static::allowedSort(request('sort', static::$default_sort));
        // Get the sort direction, assume ASC unless provided
        $direction = static::allowedDirection(request('direction', static::$default_direction));

        $query->orderBy($sort, $direction);
        return $query;
    }

    /**
     * Given a sort string, validate that we can sort on it,
     * or return the default
     *
     * @param string $sort
     * @return string
     */
    static function allowedSort($sort){
        if(in_array($sort, static::$sortable)) return $sort;
        return static::$default_sort;
    }


    /**
     * Given a sort string, validate that we can sort on it,
     * or return the default
     *
     * @param string $sort
     * @return string
     */
    static function allowedDirection($direction){
        if(in_array($direction, static::$directions)) return $direction;
        return static::$default_direction;
    }


    /**
     * upload a file
     *
     * @return void
     */
    public function upload(){
        $request = request();

        foreach($this->uploadable as $key){
            if($request->has($key)){
                // Load File
                $file = $request->get($key);
                if(isset($file['id'])){
                    $upload = File::find($file['id']);
                    if($upload){
                        $clone = $upload->replicate();
                        $clone->display = $key;
                        $clone->asset_id = $this->id;
                        $this->{$key}()->save($clone);
                    }
                }elseif($file === null || empty($file)){
                    // Remove file
                    $this->{$key}()->delete();
                }
            }
            if($request->has($key . '_id')){
                // Load File
                $id = $request->get($key . '_id');
                if($id === null){
                    $this->{$key}()->delete();
                }else{
                    $upload = File::find($id);
                
                    if($upload){
                        $clone = $upload->replicate();
                        $clone->display = $key;
                        $clone->asset_id = $this->id;
                        $this->{$key}()->save($clone);
                    }
                }
            }
        }
    }

    /**
     * Convert the model instance to an array
     * because we don't often want the full
     * data in relationships
     *
     * @return array
     */
    public function toRelationshipArray()
    {
        $table = $this->getTable();
        $resource = str_singular($table) . '/';
        $data = [ 
            'id' => $this->id,
            'entity_url' => $this->api_path  . $resource . $this->id,
        ];
        if(isset($this->title)){
            $data['title'] = $this->title;
        };
        foreach($this->addToArray as $key){
            $data[$key] = $this->{$key};
        }
        return $data;
    }

    /**
     * Get the model's relationships in array form.
     *
     * @return array
     */
    public function relationsToArray()
    {
        $attributes = [];
        foreach ($this->getArrayableRelations() as $key => $value) {
            // If the values implements the Arrayable interface we can just call this
            // toArray method on the instances which will convert both models and
            // collections to their proper array form and we'll set the values.
            if ($value instanceof Arrayable) {
                if ($value instanceof BaseCollection) {
                    $relation = array_map(function ($item) {
                        return $item instanceof Arrayable ? $item->toRelationshipArray() : $item;
                    }, $value->all());
                } else {
                    $relation = $value->toRelationshipArray();
                }

            }

            // If the value is null, we'll still go ahead and set it in this list of
            // attributes since null is used to represent empty relationships if
            // if it a has one or belongs to type relationships on the models.
            elseif (is_null($value)) {
                $relation = $value;
            }

            // If the relationships snake-casing is enabled, we will snake case this
            // key so that the relation attribute is snake cased in this returned
            // array to the developers, making this consistent with attributes.
            if (static::$snakeAttributes) {
                $key = Str::snake($key);
            }

            // If the relation value has been set, we will set it on this attributes
            // list for returning. If it was not arrayable or null, we'll not set
            // the value on the array because it is some type of invalid value.
            if (isset($relation) || is_null($value)) {
                $attributes[$key] = $relation;
            }

            unset($relation);
        }

        return $attributes;
    }

}