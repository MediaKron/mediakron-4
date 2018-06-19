import React from "react";
import ReactDOM from "react-dom";
import { Catalog, pageLoader } from "catalog";
import css from "../../../public/css/app.css";

const pages = [
  { path: "/", title: "Welcome", component: require("./home.md") },
  {
    title: 'Items',
    pages: [
      {
        path: '/items/',
        title: 'Introduction',
        component: require("../../items/items-docs.md")
      },
      // Other subpages
    ]
  },
  {
    title: 'UI',
    pages: [
      {
        path: '/ui/',
        title: 'Introduction',
        component: require("../../ui/ui-docs.md")
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

