
import General from '@/views/site/options/settings/General';
import SearchSettings from '@/views/site/options/settings/SearchSettings';
import Canvas from '@/views/site/options/settings/Canvas';
import SettingsIndex from "@/views/site/options/settings/SettingsIndex";

export default [
      {
        path: 'general',
        name: 'general_settings',
        component: General,
        meta:{
          inSettings: true,
          sectionClass: "section-settings"
        }
      },
      {
        path: 'searchsettings',
        name: 'search_settings',
        component: SearchSettings,
        meta:{
          inSettings: true,
          sectionClass: "section-settings"
        }
      },
      {
        path: 'canvas',
        name: 'canvas_settings',
        component: Canvas,
        meta:{
          inSettings: true,
          sectionClass: "section-settings"
        }
      },
      {
        path: "/",
        component: SettingsIndex,
        title: "setting_index",
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