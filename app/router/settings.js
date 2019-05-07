

import General from '@/views/site/settings/General';
import Menus from "@/views/site/settings/Menus";
import Appearance from "@/views/site/settings/Appearance";
import People from "@/views/site/settings/People";
import Groups from "@/views/site/settings/Groups";

export default [
      {
        path: 'general',
        name: 'general',
        component: General,
        meta:{
          inSettings: true,
          sectionClass: "section-settings"
        }
      },
      {
        path: "people/:page?",
        component: People,
        title: "People",
        meta:{
          inPeople: true,
          sectionClass: "section-settings"
        }
      },
      {
        path: "groups",
        component: Groups,
        title: "Groups",
        meta:{
          inGroups: true,
          sectionClass: "section-settings"
        }
      },
      {
        path: "menus",
        component: Menus,
        title: "Menus",
        meta:{
          inMenus: true,
          sectionClass: "section-settings"
        }
      },
      {
        path: "appearance",
        component: Appearance,
        title: "Appearance",
        props: true,
        meta:{
          inAppearance: true
        }
      },
      {
        path: "/",
        component: General,
        title: "General",
        props: true,
        meta:{
          inSettings: true,
          sectionClass: "section-settings"
        }
      },
    ]