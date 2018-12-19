<?php

namespace App\Http\Controllers\Api\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\User;
use App\Http\Requests\Admin\UserRequest; 

class UserController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return User::orderBy('created_at', 'ASC')->paginate(20);
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
     * Store a newly created user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserRequest $request)
    {
        // Validate the data according to the rules
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json($request->validator->messages(), 400);
        }

        $data = $request->validated();

        // Create a user
        $user = new User;
        $user->fill($data);
        $user->adminFill($data);
        $user->save();

        // Return the user data object
        return response()->json($user);
    }

    /**
     * Display the user resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        return User::where('id', $id)->orderBy('created_at', 'ASC')->paginate(10);
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
    public function update(UserRequest $request, $id)
    {
        // Validate the data according to the rules
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json($request->validator->messages(), 400);
        }
        $data = $request->validated();

        // Create a user
        $user = User::find($id);
        $user->fill($data);
        $user->adminFill($data);
        $user->save();

        // Return the user data object
        return response()->json($user);
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
        $user = User::find($id);
        $user->delete();
        return response()->json([], 204);
    }
}
