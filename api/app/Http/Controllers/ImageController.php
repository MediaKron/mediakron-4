<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Site;
use Storage;
use Image;

class ImageController extends Controller
{
    //
    public $styles = [
        'original' => false,
        
        'double' => [
            'uri' => 'double',
            'width' => 3000,
            'height' => 3000,
            'upscale' => true
        ],
        'full' => [
            'uri' => 'full',
            'width' => 1280,
            'height' => 900,
            'upscale' => true
        ],
        'large' => [
            'uri' => 'large',
            'width' => 800,
            'height' => 600,
            'upscale' => true
        ],
        'medium' => [
            'uri' => 'medium',
            'width' => 400,
            'height' => 300,
            'upscale' => true
        ],
        'small' => [
            'uri' => 'small',
            'width' => 100,
            'height' => 100,
            'upscale' => true
        ]
    ];

    /**
     * Style an uploaded file on first request
     *
     * @param [type] $site
     * @param [type] $style
     * @param Request $request
     * @return void
     */
    public function style($site, $style, $image, Request $request){
        $site = Site::byUri($site);
        if(!$site) abort(404, 'Site Not Found');

        // if the request style doesn't exist abort
        if(!isset($this->styles[$style])) abort(404, 'Style Not Found');
        $style = $this->styles[$style];

        // Make sure the site folder exists
        if(!Storage::disk('public')->exists($site->uri)){
            Storage::disk('public')->makeDirectory($site->uri);
        }

        // See if we have the source image here
        $pathToOriginal = $site->uri . DIRECTORY_SEPARATOR . $image;
        if (!Storage::disk('public')->exists($pathToOriginal)){
            // we didn't find it.  It might be on S3
            //dd($pathToOriginal);
            if (Storage::disk('s3')->exists($pathToOriginal)){
                // clone the file down to the local disk
                $contents = Storage::disk('s3')->get($pathToOriginal);
                Storage::disk('public')->put($pathToOriginal, $contents);
            }
        }

        if (!Storage::disk('public')->exists($site->uri . '/styles/')) {
            Storage::disk('public')->makeDirectory($site->uri . '/styles/');
        }

        // Make sure the style path exists
        $pathToStyle = $site->uri . '/styles/' . $style['uri'];
        if (!Storage::disk('public')->exists($pathToStyle)){
            Storage::disk('public')->makeDirectory($pathToStyle);
        }

        $pathToNew = $pathToStyle . DIRECTORY_SEPARATOR . $image;
        $image = Image::make('/app/api/storage/app/public/' . $pathToOriginal)->resize($style['height'], $style['height']);
        $image->save('/app/api/storage/app/public/' . $pathToNew);
        return $image->response('jpg');
    }

    /**
     * Style an uploaded file on first request
     *
     * @param [type] $site
     * @param [type] $style
     * @param Request $request
     * @return void
     */
    public function cache($site, $image, Request $request){
        $site = Site::byUri($site);
        if(!$site) abort(404, 'Site Not Found');

        // Make sure the site folder exists
        if(!Storage::disk('public')->exists($site->uri)){
            Storage::disk('public')->makeDirectory($site->uri);
        }

        // See if we have the source image here
        $pathToOriginal = $site->uri . DIRECTORY_SEPARATOR . $image;
        if (!Storage::disk('public')->exists($pathToOriginal)){
            
            // we didn't find it.  It might be on S3
            //dd($pathToOriginal);
            if (Storage::disk('s3')->exists($pathToOriginal)){
                dd('file not found on remote');
                // clone the file down to the local disk
                $contents = Storage::disk('s3')->get($pathToOriginal);
                Storage::disk('public')->put($pathToOriginal, $contents);
            }
        }

        return response()->file(Storage::disk('public')->getAdapter()->getPathPrefix() . $pathToOriginal);
    }
}
