import React from "react";
import ReactDOM from "react-dom";
import { Catalog, pageLoader } from "catalog";

const pages = [
  { path: "/", title: "Welcome", component: require("./home.md") },
  {
    title: 'Components',
    pages: [
      {
        path: '/components/',
        title: 'Introduction',
        component: require("../../components/components-docs.md")
      },
      // Other subpages
    ]
  },
  {
    title: 'Core CSS',
    pages: [
      {
        path: '/core-css/',
        title: 'Introduction',
        component: require("../../core-css/core-css-docs.md")
      },
      // Other subpages
    ]
  },
  {
    title: 'Core JS',
    pages: [
      {
        path: '/core-js/',
        title: 'Introduction',
        component: require("../../core-js/core-js-docs.md")
      },
      // Other subpages
    ]
  },
  
];

ReactDOM.render(
  <Catalog title="MediaKron 4 Style Guide" pages={pages} />,
  document.getElementById("catalog")
);

