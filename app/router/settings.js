
import HomePage from '@/views/site/homepage/Homepage';
import ItemPage from '@/views/site/items/Item';
import Browse from '../views/site/items/Browse';

export default [
      {
        path: ':first/:second?/:third?',
        name: 'item',
        component: ItemPage,
        props: true,
      },
      {
        path: '/browse',
        name: 'browser',
        component: Browse,
        props: true,
      },
      {
        path: '/',
        name: 'homepage',
        component: HomePage,
        props: true,
      }
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