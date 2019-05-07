import SiteLayout from "@/views/site/SiteLayout";

import OptionsLayout from "@/views/site/options/OptionsLayout";
import ContentLayout from "@/views/site/content/ContentLayout";
import Item from "@/views/site/items/Item";
import Help from "@/views/help/help";
import Tags from "@/views/site/tags/Tags";
import Search from "@/views/site/search/Search";
import HomePage from "@/views/site/homepage/Homepage";
import HomeSettings from "@/views/site/homepage/HomeSettings";
import content from "./content";
import siteoptions from "./siteoptions";

var routes = {
  default: {
    path: "/:site",
    component: SiteLayout,
    title: "Site",
    props: true,
    children: [
      {
        path: "help",
        component: Help,
        title: "Help",
        props: true
      },
      {
        path: "homesettings",
        component: HomeSettings,
        title: "Homepage Settings",
        props: true,
      },
      {
        path: "tags",
        component: Tags,
        title: "Tags",
        props: true
      },
      {
        path: "search",
        component: Search,
        title: "Search",
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
        path: "options",
        component: OptionsLayout,
        title: "SiteOptions",
        props: true,
        children: siteoptions
      },
      {
        path: ":firstUri/:secondUri/:thirdUri",
        name: "Item3",
        component: Item,
        props: true,
        meta:{
          siteNav: true,
        }
      },
      {
        path: ":firstUri/:secondUri",
        name: "Item2",
        component: Item,
        props: true,
        meta:{
          siteNav: true,
        }
      },
      {
        path: ":firstUri",
        name: "Item1",
        component: Item,
        props: true, 
        meta:{
          siteNav: true,
        }
      },
      

      {
        path: "/",
        name: "homepage",
        component: HomePage,
        props: true
      },
      


    ]
  }
};
export default routes;

