<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Site;
use App\Http\Requests\Admin\SiteRequest;

class SettingsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return Site::orderBy('created', 'ASC')->paginate(10);
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
        return Site::where('uri', $id)->first();
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