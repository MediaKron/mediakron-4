<?php


namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Site;
use App\Models\User;
use App\Http\Requests\Admin\ItemRequest; 



class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($site_id)
    {
        //
        return Item::paginate(50);
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
            $item = new Item();
            // Check edit permissions
            $item->canCreate()->hydrate($request);
            return $item;
        }catch(\Exception $e){
            // 
            Log::info('Access denied to user when creating item');
            return response()->json(['error' => $e->getMessage() ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($site_id, $id)
    {
        //
        try{
            $item = Item::findOrFail($id);
            $item->canView();
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
    public function update($site_id, $id, Request $request)
    {
        //
        try{
            $item = Item::findOrFail($id);
            // Check edit permissions
            $item->canEdit()->hydrate($request);
            return $item;
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
