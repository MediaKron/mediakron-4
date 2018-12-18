import SiteLayout from "@/views/site/SiteLayout";
import AdminLayout from "@/views/site/AdminLayout";
import HomePage from "@/views/site/homepage/Homepage";
import ItemPage from "@/views/site/items/Item";
import Browse from "../views/site/items/Browse";

import settings from "./settings";

var routes = {
  default: {
    path: "/:site",
    component: SiteLayout,
    title: "Site",
    props: true,
    children: [
      {
        path: "settings",
        component: AdminLayout,
        title: "Site",
        props: true,
        children: settings
      },
      {
        path: ":first/:second?/:third?",
        name: "item",
        component: ItemPage,
        props: true
      },
      {
        path: "/browse",
        name: "browser",
        component: Browse,
        props: true
      },
      {
        path: "/",
        name: "homepage",
        component: HomePage,
        props: true
      }
    ]
  }
};
export default routes;

