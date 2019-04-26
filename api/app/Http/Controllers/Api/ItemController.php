<?php


namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Site;
use App\Models\User;
use App\Http\Requests\Item as ItemRequest; 

use Log;



class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($site, Request $request)
    {
        //
        $query = Item::listQuery()->with(Item::$select_with)
            ->where('site_id', $site);
        $data = $query->paginate(request('per_page', 50));
        $custom = collect([
            'collections' => Item::listQuery()->where('site_id', $site)->where('type', 'collection')->count(),
            'images' => Item::listQuery()->where('site_id', $site)->where('type', 'image')->count(),
            'videos' => Item::listQuery()->where('site_id', $site)->where('type', 'video')->count(),
        ]);
        $data = $custom->merge($data);
        return $data;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
        abort(405);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($site_id, Request $request)
    {
        //
        try{
            // You can only create items in a site context, so find the site
            $site = Site::findOrFail($site_id);

            // Create a new item
            $item = new Item();
            $item->version_id = 0;
            // Check edit permissions
            $item->canCreate()
                ->buildItem($request) // Hydrate the item from the request
                ->getUri()
                ->setOwner()
                ->setEditor()
                ->setSite($site);
                
            // TODO: Handle inbound relationship mapinog
            // TODO: Handle metadata fields
            // TODO: Handle audio, video, images and text fields
            $item->save();
            $item->updateMetadata()
                ->addTags($site_id);
            return Item::with(Item::$select_with)->findOrFail($item->id);
        }catch(\Exception $e){
            // 
            Log::info('Error when creating item. ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        try{
            $item = Item::with(Item::$select_with)->findOrFail($id);
            //$item->canView();
            return $item;
        }catch(\Exception $e){
            // 
            Log::info('Access denied to user when viewing item');
            return response()->json(['error' => $e->getMessage() ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function multiple($site)
    {
        //
        try{
            $item = Item::with(Item::$select_with)->where('site_id', $site)->whereIn('uri', request()->all())->get();
            //$item->canView();
            return $item;
        }catch(\Exception $e){
            // 
            Log::info('Access denied to user when viewing item');
            throw $e;
            //return response()->json(['error' => $e->getMessage() ]);
        }
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update($site_id, $id, Request $request)
    {
        try{
            // You can only create items in a site context, so find the site
            $site = Site::findOrFail($site_id);
            // Create a new item
            $item = Item::findOrFail($id);
            $item->canUpdate()
                ->buildItem($request) // Hydrate the item from the request
                ->setOwner()
                ->setEditor()
                ->setSite($site)
                ->updateMetadata()
                ->addTags($site_id)
                ->upload();
            // TODO: Handle inbound relationship mapinog
            // TODO: Handle metadata fields
            // TODO: Handle audio, video, images and text fields
            $item->save();
            return Item::with(Item::$select_with)->findOrFail($item->id);
        }catch(\Exception $e){
            // 
            Log::info('Access denied to user when editing item');
            throw $e;
            //return response()->json(['error' => $e->getTraceAsString() ]);
        }
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
