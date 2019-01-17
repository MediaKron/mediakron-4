<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Site;
use App\Http\Requests\Admin\Site as SiteRequest;
use Auth;

class SiteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return Site::orderBy('created_at', 'ASC')->paginate(10);
        $user = Auth::user();
        if($user->isAdmin()){
            return Site::orderBy('created_at', 'ASC')->paginate(10);
        }else{
            return $user->sites()->latest()->paginate(50);
        }
        
    }

    /**
     * Get all users for a site
     *
     * @return \Illuminate\Http\Response
     */
    public function users($id)
    {
        //
        $site = Site::find($id);
        return $site->users;
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        //
        return response()->json($request->validator->messages(), 400);
    }

    /**
     * Store a newly created Site in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SiteRequest $request)
    {
        // Validate the data according to the rules
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json($request->validator->messages(), 400);
        }

        $data = $request->validated();

        // Create a Site
        $site = new Site;
        $site->fill($data);
        $site->adminFill($data);
        $site->save();

        // Return the Site data object
        return response()->json($site);
    }

    /**
     * Display the Site resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        $site = Site::with(['primary'])->find($id);
        if(!$site){
            $site = Site::with(['primary'])->where('uri', $id)->first();
        }
        if(!$site) abort(404);
        return $site;
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
        return response()->json($request->validator->messages(), 400);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(SiteRequest $request, $id)
    {
        // Validate the data according to the rules
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json($request->validator->messages(), 400);
        }
        $data = $request->validated();

        // Create a Site
        $site = Site::find($id);
        $site->fill($data);
        $site->adminFill($data);
        $site->save();

        $site = Site::with(['primary'])->find($site->id);

        // Return the Site data object
        return response()->json($site);
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
        $site = Site::find($id);
        $site->delete();
        return response()->json([], 204);
    }
}
