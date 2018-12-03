let mix = require('laravel-mix');

mix.webpackConfig({
  output: {
    publicPath: "/public"
  },
  resolve: {
    alias: {
      // bind version of jquery-ui
      "jquery-ui": "jquery-ui-dist/jquery-ui.js",
      "~": path.resolve(__dirname + "/app"),
      "@": path.resolve(__dirname + "/app"),
      // bind to modules;
      modules: path.join(__dirname, "node_modules")
    }
  },
  module: {
    rules: [
      { test: /\.jpg$/, use: ["file-loader"] },
      { test: /\.png$/, use: ["url-loader?mimetype=image/png"] },
      { test: /\.html$/, loader: 'html-loader' }
    ]
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

mix
  .setPublicPath('public')
  .js("app/app.js", "public/js")
  .sass("app/core-css/base.scss", "public/css/app.css")
  .sourceMaps();
