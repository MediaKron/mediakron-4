<?php

if (!function_exists('site')) {
    function site()
    {
        return app()->make('App\Models\Site');
    }
}