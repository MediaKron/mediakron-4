<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Attributes\Tag;
use App\Models\Site;

class TagController extends Controller
{
    //
    public function index($site){
        $site = Site::findOrFail($site);
        return Tag::where('site_id', $site->id)->get();
    }
}
