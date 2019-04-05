var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var childProcess = require('child_process');

console.log(path.resolve(__dirname + "/app"));

// import Purgecss webpack plugin and glob-all
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')

module.exports = {
  outputDir: 'public',
  assetsDir: 'assets',

  css: {
    sourceMap: process.env.NODE_ENV === 'development'? true: false,
    loaderOptions: {
      sass: {
        // @/ is an alias to src/
        // data: `@import "@/sass/main.scss";`,
      },
    },
  },

  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        // other modules
        introJs: ['intro.js', 'introJs']
      }),
      // Remove unused CSS using purgecss. See https://github.com/FullHuman/purgecss
      // for more information about purgecss.
      new PurgecssPlugin({
        paths: glob.sync([
          path.join(__dirname, './app/index.html'),
          path.join(__dirname, './app/**/*.vue'),
          path.join(__dirname, './app/**/*.js')
        ])
      }),
    ],
    resolve: {
        alias: {
            "~": path.resolve(__dirname + "/app"),
            "@": path.resolve(__dirname + "/app"),
        }
    },
    entry: {
        app: './app/app.js'
    }
  },

  chainWebpack: config => {
   config
     .plugin('html')
       .tap(args => {
         args[0].template = 'app/index.html';
         return args;
       })
       .end()
     .plugin('define')
       .tap(args => {
         args[0]['process.env']['VUE_APP_BUILD'] = JSON.stringify(childProcess.execSync('git rev-parse --short HEAD').toString().trim());
         return args;
       })
       .end();
   
   // Fix for the vue-cli non-configurable static asset dir
   // Static assets now go to /static
   publicDir = path.resolve(process.cwd(), 'public')
   staticDir = path.resolve(process.cwd(), 'static')

   // Unset the default config    
   if (fs.existsSync(publicDir)) {
     config.plugin('copy')
       .tap(args => {
         args[0] = [];
         return args;
       })
       .end();
   }
   // Use a different source dir
   if (fs.existsSync(staticDir)) {
     config.plugin('copy')
       .use(require('copy-webpack-plugin'), [[{
         from: staticDir,
         to: publicDir,
         toType: 'dir',
         ignore: ['index.html', '.DS_Store']
       }]])
       .end();
   }
 },

  pluginOptions: {
    s3Deploy: {
      awsProfile: 'default',
      region: 'us-east-1',
      bucket: 'mediakron.us',
      createBucket: false,
      staticHosting: true,
      staticIndexPage: 'index.html',
      staticErrorPage: 'index.html',
      assetPath: 'public',
      assetMatch: ['**/*', '!storage', '!*.php'],
      deployPath: '/',
      acl: 'public-read',
      pwa: true,
      pwaFiles: 'service-worker.js',
      enableCloudfront: false,
      cloudfrontId: 'mediakron.us',
      cloudfrontMatchers: '/*',
      uploadConcurrency: 5,
      pluginVersion: '3.0.0'
    }
  }
};
