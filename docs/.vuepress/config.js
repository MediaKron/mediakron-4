// auto generated sidebar
const { sidebarTree } = require('../code/config');

module.exports = {
  dest: 'dist',
  locales: {
    '/': {
      title: 'MediaKron Docs',
      description: 'Generate jsdoc markdown files for vuepress'
    }
  },
  themeConfig: {
    sidebarDepth: 2,
    docsDir: 'code',
    locales: {
      '/code/': {
        // Add the generated sidebar
        sidebar: Object.assign({}, sidebarTree)
      },
      '/': {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Code', link: '/code/' },
          { text: 'About', link: '/about/' },
          { text: 'MediaKron', link: 'https://mediakron.bc.edu' },
        ],
        // Add the generated sidebar
        sidebar: Object.assign({}, sidebarTree)
      }
    }
  }
};