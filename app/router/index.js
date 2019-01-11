import SiteLayout from "@/views/site/SiteLayout";
import SettingsLayout from "@/views/site/siteadmin/SettingsLayout";
import PeopleLayout from "@/views/site/siteadmin/PeopleLayout";
import HomePage from "@/views/site/homepage/Homepage";
import ItemPage from "@/views/site/items/Item";
import Browse from "../views/site/items/Browse";
import SiteOptions from "@/views/site/siteadmin/SiteOptions";


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
        path: "options/settings",
        component: SettingsLayout,
        title: "Site Settings",
        props: true,
        children: settings
      },
      {
        path: "options/appearence",
        component: SettingsLayout,
        title: "Site Settings",
        props: true
      },
      {
        path: "options/people",
        component: PeopleLayout,
        title: "People",
        props: true,
        children: people
      },
      {
        path: "options",
        component: SiteOptions,
        title: "SiteOptions",
        props: true,
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

