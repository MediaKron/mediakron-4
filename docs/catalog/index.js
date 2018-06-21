import React from "react";
import ReactDOM from "react-dom";
import { Catalog, pageLoader } from "catalog";
import css from "../../public/css/app.css";

const colors = { 
    pageHeadingBackground: "#255361",
    pageHeadingHeight: 100,
  }

const pages = [
  // Home
  { path: "/", 
    title: "Home", 
    component: require("./doc-pages/home.md") },
  // Items
  
  {
    path: '/overview/',
    title: 'Getting Started',
    component: require("../../README.md")
  },

  {
    path: '/api/',
    title: 'API',
    component: require("./doc-pages/api-readme.md")
  },

  {
    path: '/app/',
    title: 'App',
    component: require("../../app/app-readme.md")
  },

  {
    title: 'App > Items',
    pages: [
      {
        path: '/items/',
        title: 'Introduction',
        component: require("../../app/items/items-readme.md")
      },
      // Other subpages
    ]
  },
  
  {
    path: '/comments/',
    title: 'App > Comments',
    component: require("../../app/comments/comments-readme.md")
  },

  {
    path: '/content-tools/',
    title: 'App > Content Tools',
    component: require("../../app/content-tools/content-tools-readme.md")
  },

  {
    path: '/forms/',
    title: 'App > Forms',
    component: require("../../app/forms/forms-readme.md")
  },

  {
    path: '/help/',
    title: 'App > Help',
    component: require("../../app/help/help-readme.md")
  },

  {
    path: '/site-settings/',
    title: 'App > Site Settings',
    component: require("../../app/site-settings/site-settings-readme.md")
  },

  {
    path: '/theme/',
    title: 'App > Theme',
    component: require("../../app/theme/theme-readme.md")
  },

  // UI
  {
    title: 'App > UI',
    pages: [
      {
        path: '/ui/',
        title: 'Basic UI Elements',
        component: require("../../app/ui/ui-readme.md")
      },
        // Icons
        {
          path: '/ui/mk-icons',
          title: 'Icons',
          scripts: ['https://use.fontawesome.com/releases/v5.0.13/js/all.js'],
          component: require("../../app/ui/icons/mk-icons/mk-icons-readme.md")
        },
        // Tooltips
        {
          path: '/ui/tooltips',
          title: 'Tooltips',
          component: require("../../app/ui/tooltips/tooltips-readme.md")
        },
        // Other subpages
    ]
  },
  {
    title: 'App > Core CSS',
    pages: [
      {
        path: '/core-css/',
        title: 'Introduction',
        component: require("../../app/core-css/core-css-readme.md")
      },
      // Other subpages
    ]
  },
  {
    title: 'App > Core JS',
    pages: [
      {
        path: '/core-js/',
        title: 'Introduction',
        component: require("../../app/core-js/core-js-readme.md")
      },
      // Other subpages
    ]
  },

  {
    path: '/utilities/',
    title: 'App > Utilities',
    component: require("../../app/utilities/utilities-readme.md")
  },
];

ReactDOM.render(
  <Catalog 
    title="MediaKron 4 Docs" 
    pages={pages}  
    theme={colors}
  />,
  document.getElementById("catalog")
);

