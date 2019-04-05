

import Settings from '@/views/site/options/Settings';
import Menus from "@/views/site/options/Menus";
import Appearance from "@/views/site/options/Appearance";
import HomePageSettings from "@/views/site/options/HomePageSettings";
import People from "@/views/site/options/People";
import Groups from "@/views/site/options/Groups";

export default [
      {
        path: 'settings',
        name: 'settings',
        component: Settings,
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
        path: "homepage",
        component: HomePageSettings,
        title: "Homepage Settings",
        props: true,
        meta:{
          inHomepage: true
        }
      },

      {
        path: "/",
        component: Settings,
        title: "Settings",
        props: true,
        meta:{
          inSettings: true,
          sectionClass: "section-settings"
        }
      },
    ]
/*export default {
    /*
    ":site/settings/organize(/:type)": "SettingsOrganize",
            ":site/settings/content/add(/:type)": "SettingsContentAdd",
            ":site/settings/content/edit/*path": "SettingsContentEdit",
            ":site/settings/convert/:type/:uri": "convertToType",
            ":site/settings/revisions/:uri": "getRevisions",
            ":site/settings/transmit/:uri": "transmitTo",
            ":site/settings/duplicate/:uri": "copyItem",
            ":site/settings/content/:action(/:uri)": "SettingsContentConfirm",
            ":site/settings/content(/:context)": "SettingsContent",
            ":site/settings/manage/:action/*path": "SettingsManageContext",
            ":site/settings/marker/:map/:marker": "SettingsMarkers",
            ":site/settings/marker/:map/:marker/remove": "SettingsRemoveMarker",

            ":site/:parent/manager/:child/remove": "SettingsManagerRemove",

            ":site/:parent/manager/:type(/:uri)": "SettingsManager",


            ":site/settings/event/:timeline/:event": "SettingsEvent",
            ":site/settings/event/:timeline/:event/remove": "SettingsRemoveEvent",

            ":site/settings/export": "SettingsExport",
            ":site/settings/statistics": "SettingsStatistics",
            ":site/settings/appearance": "SettingsAppearance",
            ":site/:site/settings/homepage": "SettingsHomepage",
            ":site/settings/canvas": "SettingsCanvas",
            ":site/settings/search": "SettingsSearch",
            ":site/settings/performance": "SettingsPerformance",
            ":site/settings/navigation": "SettingsNavigation",
            ":site/settings/import": "SettingsImport",
            ":site/settings/trash": "Trashcan",
            ":site/settings/import/mediakron2": "SettingsImportMK2",
            ":site/settings/general": "SettingsGeneral",
            ":site/settings/users": "SettingsUsers",
            ":site/settings/comments": "SettingsComments",
            ":site/settings/privacy": "SettingsPrivacy",
            ":site/settings/googleanalytics": "SettingsGoogleAnalytics",
            ":site/settings/itemoptions": "SettingsItemOptions",
            ":site/settings": "Settings",
            
}
*/