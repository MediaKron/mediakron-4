<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
    //
    public function upload($site, $type, Request $request){
        $validatedData = $request->validate([
            'image' => 'image|max:100000',
            'video' => 'mimes:mp4,wmv,m4v,mpg,mpeg,mov|max:100000',
            'audio' => 'mimes:mp3,m4a|max:100000',
            'file' => 'mimes:jpeg,png,gif,tif,pdf,docx,doc,tiff,txt,html,ppt,pptx|max:100000',
            'pdf' => 'mimes:pdf|max:100000'
        ]);
        $file = false;
        $user = Auth::user();

        if ($request->hasFile($type)) {
            $file = $request->file($field);
        }

        if (!$file) {
            throw new \Exception('No File Provided');
        }
        $file->store($type, 's3');
        return $file;
    }
}
