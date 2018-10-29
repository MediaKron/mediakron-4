<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Site;

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
        if(!Storage::exists($site->uri)){
            Storage::makeDirectory($directory);
        }
        $pathToOriginal = $site->uri . DIRECTORY_SEPARATOR . $image;
        if (!Storage::exists($pathToOriginal)) abort(404, 'Image Not Found');

        if (!Storage::exists($site->uri . '/styles/')) {
            Storage::makeDirectory($site->uri . '/styles/');
        }

        // Make sure the style path exists
        $pathToStyle = $site->uri . '/styles/' . $style['uri'];
        if (!Storage::exists($pathToStyle)){
            Storage::makeDirectory($pathToStyle);
        }

        $pathToNew = $pathToStyle . DIRECTORY_SEPARATOR . $image;
        $image = Image::make(storage_path($pathToOriginal))->resize($style['height'], $style['height']);
        $image->save($pathToNew);
        return $image->response('jpg');
    }
}
