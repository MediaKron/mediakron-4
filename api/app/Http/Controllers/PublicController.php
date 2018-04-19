<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PublicController extends Controller
{
    //
    /**
     * This is the main app route for mediakron
     *
     * @return void
     */
    public function index(){
        return view('index');
    }
}
