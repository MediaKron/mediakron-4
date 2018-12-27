import SiteLayout from "@/views/site/SiteLayout";
import SiteAdminLayout from "@/views/site/SiteAdminLayout";
import HomePage from "@/views/site/homepage/Homepage";
import ItemPage from "@/views/site/items/Item";
import Browse from "../views/site/items/Browse";
import People from "../views/site/siteadmin/People";

import settings from "./settings";

var routes = {
  default: {
    path: "/:site",
    component: SiteLayout,
    title: "Site",
    props: true,
    children: [
      {
        path: "siteadmin",
        component: SiteAdminLayout,
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
        path: "/people",
        name: "people",
        component: People,
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

