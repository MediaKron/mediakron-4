<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\File;

class UploadController extends Controller
{
    //
    /**
     * Generic File upload handler
     *
     * @param boolean $type
     * @param Request $request
     * @return void
     */
    public function upload($site, $type = false, Request $request){
        $site = Site::findOrFail($site);

        $validatedData = $request->validate(File::$validation);
        $file = File::handleUpload($site, $type, $request);
        return $file;
    }
}
