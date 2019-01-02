import SiteLayout from "@/views/site/SiteLayout";
import SettingsLayout from "@/views/site/siteadmin/SettingsLayout";
import SiteOptions from "@/views/site/siteadmin/SiteOptions";
import HomePage from "@/views/site/homepage/Homepage";
import ItemPage from "@/views/site/items/Item";
import Browse from "../views/site/items/Browse";


import settings from "./settings";
import people from "./people";

var routes = {
  default: {
    path: "/:site",
    component: SiteLayout,
    title: "Site",
    props: true,
    children: [
      {
        path: "siteoptions",
        component: SiteOptions,
        title: "SiteOptions",
        props: true,
      },
      {
        path: "settings",
        component: SettingsLayout,
        title: "Site Settings",
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
        component: SettingsLayout,
        props: true,
        children: people
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

