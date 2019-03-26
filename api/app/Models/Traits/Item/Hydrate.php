<?php

namespace App\Models\Traits\Item;

use Auth;
use App\Models\Site;
use Illuminate\Support\Str;
use App\Models\Item;
use App\Models\Attributes\Metadata;
use App\Models\Attributes\Tag;

trait Hydrate
{
    public function buildItem($request){
        $this->fill(request([
            'active',
            'published',
            'locked',
            'type',
            'template',
            'title',
            'description',
            'transcript',
            'body',
            'caption',
            'options',
            'overlay'
        ]));
        return $this;
    }

    /**
     * Create Uri
     *
     * @return App\Models\User
     */
    public function getUri(){
        $slug = Str::slug($this->title, '-');
        $iterate = $slug;
        // check for unqiueness
        $unique = false;
        $i = 0;
        while(!$unique){
            $find = Item::where('uri', $iterate)->first();
            if($find){
                $iterate = $slug . "-$i";
            }else{
                $slug = $iterate;
                $unique = true;
                break;
            }
            $i++;
        }
        $this->uri = $slug;
        return $this;
    }

    /**
     * Create Uri
     *
     * @return App\Models\User
     */
    public function updateMetadata(){
        //
        if(!$this->metadata){
            $metadata = new Metadata();
        }else{
            $metadata = $this->metadata;
        }

        $fill = request(['metadata']);
        if(isset($fill['metadata'])){
            $metadata->fill($fill['metadata']);
            $metadata->item_id = $this->id;
            $metadata->save();
        }
        
        return $this;
    }

    /**
     * Create Uri
     *
     * @return App\Models\User
     */
    public function addTags(){
        //
        $tags = request(['tags']);
        $sync = [];
        foreach($tags['tags'] as $tag){
            $save = false;
            if(isset($tag['id'])){
                $save = Tag::find($tag['id']);
            }
            if(!$save && isset($tag['title'])){
                // Try to find a matching tag by Title
                $save = Tag::where('title', $tag['title'])->first();
            }
            if(!$save) $save = new Tag();
            $save->title = $tag['title'];
            $save->uri = Str::slug($tag['title']);
            $save->site_id = 0;
            $save->save();
            $sync[] = $save->id;
        }
        $this->tags()->sync($sync);
        return $this;
    }

    public function attach(){
        // switch for type
        switch($this->type){
            default:
                // always attach an image
                $this->attachImage();
              break;
        }
    }

   public function attachImage(){
       // check to see if there is an iamge
       $image = request('image');
       if(isset($image['file'])){
        $file = File::find(['file']['id']);
        if($file){
            // TODO: Attach image here
        }
       }
       
   }

    /**
     * Set the current user as the owner of the record
     *
     * @return App\Models\User
     */
    public function setOwner(){
        //$user = Auth::user();
        $this->user_id =  0;//$user->id; TODO: Bind to authenticated user
        return $this;
    }

    /**
     * Set the current user as the editor
     *
     * @return App\Models\User
     */
    public function setEditor(){
        //$user = Auth::user();
        $this->editor_id = 0;//$user->id; TODO: Bind to authenticated user
        return $this;
    }

    /**
     * Undocumented function
     *
     * @param Site $site
     * @return void
     */
    public function setSite(Site $site){
        $this->site_id = $site->id;
        return $this;
    }

    /**
     * Undocumented function
     *
     * @param Site $site
     * @return void
     */
    public function setActive($status = 1){
        $this->active = $status;
        return $this;
    }

    /**
     * Undocumented function
     *
     * @param Site $site
     * @return void
     */
    public function setLocked($status = 0){
        $this->locked = $status;
        return $this;
    }

    /**
     * Undocumented function
     *
     * @param Site $site
     * @return void
     */
    public function setPublished($status = 1){
        $this->published = $status;
        return $this;
    }
}