import SiteLayout from "@/views/site/SiteLayout";
import SettingsLayout from "@/views/site/options/settings/SettingsLayout";
import PeopleLayout from "@/views/site/options/people/PeopleLayout";
import HomePage from "@/views/site/homepage/Homepage";
import Item from "@/views/site/items/Item";
import ContentLayout from "@/views/site/content/ContentLayout";
import SiteOptions from "@/views/site/options/SiteOptions";
import MenusLayout from "@/views/site/options/menus/MenusLayout";
import Appearance from "@/views/site/options/Appearance";
import HomePageSettings from "@/views/site/options/HomePageSettings";
import Profile from "@/views/site/options/Profile";
import Help from "@/views/help/help";

import settings from "./settings";
import people from "./people";
import menus from "./menus";
import content from "./content";

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
        component: ContentLayout,
        title: "Content",
        props: true,
        children: content
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
        props: true,
        meta:{
          inAppearance: true
        }
      },
      {
        path: "options/homepage",
        component: HomePageSettings,
        title: "Homepage Settings",
        props: true,
        meta:{
          inHomepage: true
        }
      },
      {
        path: "options",
        component: SiteOptions,
        title: "SiteOptions",
        props: true,
      },
      {
        path: ":firstUri/:secondUri/:thirdUri",
        name: "Item3",
        component: Item,
        props: true
      },
      {
        path: ":firstUri/:secondUri",
        name: "Item2",
        component: Item,
        props: true
      },
      {
        path: ":firstUri",
        name: "Item1",
        component: Item,
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

