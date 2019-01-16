import SiteLayout from "@/views/site/SiteLayout";
import SettingsLayout from "@/views/site/siteadmin/SettingsLayout";
import PeopleLayout from "@/views/site/siteadmin/PeopleLayout";
import HomePage from "@/views/site/homepage/Homepage";
import ItemPage from "@/views/site/items/Item";
import Content from "@/views/site/items/Content";
import SiteOptions from "@/views/site/siteadmin/SiteOptions";
import MenusLayout from "@/views/site/siteadmin/MenusLayout";
import Appearance from "@/views/site/siteadmin/Appearance";
import HomePageSettings from "@/views/site/siteadmin/HomePageSettings";
import Profile from "@/views/site/siteadmin/Profile";
import Help from "@/views/help/help";

import settings from "./settings";
import people from "./people";
import menus from "./menus";

var routes = {
  default: {
    path: "/:site",
    component: SiteLayout,
    title: "Site",
    props: true,
    children: [
      {
        path: "profile",
        component: Profile,
        title: "Profile",
        props: true
      },
      {
        path: "help",
        component: Help,
        title: "Help",
        props: true
      },

      {
        path: "content",
        component: Content,
        title: "Content",
        props: true
      },

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
        path: "options/menus",
        component: MenusLayout,
        title: "Menus",
        props: true,
        children: menus
      },
      {
        path: "options/appearance",
        component: Appearance,
        title: "Appearance",
        props: true
      },
      {
        path: "options/homepage",
        component: HomePageSettings,
        title: "Homepage Settings",
        props: true
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
        path: "/",
        name: "homepage",
        component: HomePage,
        props: true
      }
    ]
  }
};
export default routes;

