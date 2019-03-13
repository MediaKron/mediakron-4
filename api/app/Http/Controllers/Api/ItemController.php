<?php


namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Site;
use App\Models\User;
use App\Http\Requests\Admin\ItemRequest; 

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
        return $query->paginate(request('per_page', 50));
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
    public function store($site_id, ItemRequest $request)
    {
        //
        try{
            // You can only create items in a site context, so find the site
            $site = Site::findOrFail($site_id);

            // Create a new item
            $item = new Item();

            // Check edit permissions
            $item->canCreate()
                ->buildItem($request) // Hydrate the item from the request
                ->setOwner()
                ->setEditor()
                ->setSite($site);
            // TODO: Handle inbound relationship mapinog
            // TODO: Handle metadata fields
            // TODO: Handle audio, video, images and text fields
            $item->save();
            return $item;
        }catch(\Exception $e){
            // 
            Log::info('Error when creating item. ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage() ]);
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
            return response()->json(['error' => $e->getMessage() ]);
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
    public function update($site_id, $id, ItemRequest $request)
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
                ->setSite($site);
            // TODO: Handle inbound relationship mapinog
            // TODO: Handle metadata fields
            // TODO: Handle audio, video, images and text fields
            $item->save();
        }catch(\Exception $e){
            // 
            Log::info('Access denied to user when editing item');
            return response()->json(['error' => $e->getMessage() ]);
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
