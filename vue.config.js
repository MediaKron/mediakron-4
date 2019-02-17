var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var childProcess = require('child_process');

console.log(path.resolve(__dirname + "/app"));

module.exports = {
  outputDir: 'public/client',
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
      })
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
  }
};
