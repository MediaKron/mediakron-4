let mix = require('laravel-mix');

mix.webpackConfig({
    resolve: {
        alias: {
            // bind version of jquery-ui
            "jquery-ui": 'jquery-ui-dist/jquery-ui.js',
            // bind to modules;
            modules: path.join(__dirname, "node_modules"),
        }
    },
    module: {
        rules: [{
            test: /(\.tpl|\.html)$/,
            loader: 'lodash-template-webpack-loader',
        }],
    }
});


/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('src/js/app.js', 'public/js')
   .sass('src/sass/app.scss', 'public/css');
