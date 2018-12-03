<!-- welcome.blade.php -->

<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>True North</title>
        <!-- Fonts -->
        <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    </head>
    <body>
        <div id="app" class="app-container">
            <router-view></router-view>
        </div>
        <script src="{{ mix('js/app.js') }}" ></script>
    </body>
</html>
