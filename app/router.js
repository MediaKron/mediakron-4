import Vue from 'vue';
import Router, { Location } from 'vue-router';

// Middleware
import auth from './middleware/auth';
import anon from './middleware/anon';
import require from './middleware/auth';
import log from './middleware/log';

// Layouts
import Layout from './views/multisite/Layout.vue';

// Home page vue
import Home from './views/multisite/Home.vue';
import About from './views/multisite/About.vue';
import Help from './views/multisite/Help.vue';

// Authentication Views
import Login from './views/auth/Login.vue';
import Logout from './views/auth/Logout.vue';
import Profile from './views/multisite/Profile.vue';
import Reset from './views/auth/Reset.vue';
import Confirm from './views/auth/Confirm.vue';

// Mediakron Site Mangement
import ListSites from './views/multisite/sites/List';
import CreateSite from './views/multisite/sites/Create';
import EditSite from './views/multisite/sites/Edit';
import SiteOverview from './views/multisite/sites/SiteOverview';

// People
import ListPeople from './views/multisite/people/List';
import User from './views/multisite/people/User';
import EditUser from './views/multisite/people/Edit';

// Site Views
import itemsRoutes from './router/index';
import browseRoutes from './router/browse';
import settingsRoutes from './router/settings';

import NotFound from './views/404.vue';
import store from './store';

import VueDemo from './views/multisite/VueDemo.vue';

Vue.use(Router);

/**
 * Main route definition
 */
var baseRoutes = [
    {
      path: '/',
      component: Layout,
      children: [
        {
            path: '/login',
            name: 'mediakron-login',
            component: Login
        },
        {
            path: '/logout',
            name: 'mediakron-logout',
            component: Logout
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile
        },
        {
            path: '/reset',
            name: 'mediakron-reset',
            component: Reset
        },
        {
            path: '/confirm',
            name: 'mediakron-confirm',
            component: Confirm
        },
        {
            path: '/admin/people/:page?',
            name: 'list-people',
            component: ListPeople,
        },
        {
            path: '/admin/user/:id',
            name: 'user',
            component: User
        },
        {
            path: '/admin/user/:id/edit',
            name: 'user-edit',
            component: EditUser,
        },
        {
            path: '/admin/sites/:page?',
            name: 'list-sites',
            component: ListSites
        },
        {
            path: '/admin/sites-new',
            name: 'create-site',
            component: CreateSite
        },
        {
            path: '/admin/sites-view/:uri',
            name: 'site-overview',
            component: SiteOverview
        },
        {
            path: '/admin/sites/:id/edit',
            name: 'edit-site',
            component: EditSite,
            props: true
        },
        {
          path: '/',
          name: 'mediakron-home',
          component: Home
        },
        {
          path: '/about',
          name: 'About',
          component: About
        },
        {
          path: '/help',
          name: 'Help',
          component: Help
        },
        {
          path: '/vue-demo',
          name: 'vue-demo',
          component: VueDemo
        }
      ]
    }
  ];

  // Get the item routes
  //baseRoutes.push(browseRoutes);
  //baseRoutes.push(settingsRoutes);
  //baseRoutes.push(itemsRoutes.settings);
  baseRoutes.push(itemsRoutes.default);


// 404 route
baseRoutes.push({
    // Do NOT put this route as children of '/' path
    path: '*',
    component: Layout,
    children: [
      {
        path: '*',
        name: '404',
        component: NotFound,
      }
    ]
});

const router = new Router({
    mode: 'history',
    routes: baseRoutes
});


const actionableName = (name) => {
  return name.replace(/-/g, '_').toUpperCase();
};

/**
 * Global navigation guard to present the login for unauthenticated users

router.beforeEach(async (to, from, routerNext) => {
  store.dispatch(RootActions.CLEAR_ERRORS);
  store.dispatch(RootActions.LOAD_PROGRESS_RESET);

  const next = (nextTo) => {
    store.dispatch(RootActions.LOAD_PROGRESS_COMPLETE);
    window.loader(false); // make sure we hide the global loader

    routerNext(nextTo);
  };

  if (store.getters['user/isLoggedIn'] || to.name === 'login' || to.name === 'reset' || to.name === 'confirm') {
    const fromName = from.name? actionableName(from.name) : 'DIRECT';
    const toName = to.name? actionableName(to.name) : 'ROOT';

    if(from.name) {
      window.loader(false); // if its not a direct request we can hide the global loader earlier
    }

    const enterFrom = await store.dispatch('DISPATCH_ROUTER_ACTION', {actionName: 'ROUTE_ENTER_FROM_' + fromName, to, from});

    if (enterFrom && enterFrom.next) {
      next(enterFrom.next);

      return Promise.resolve();
    }

    const enterToFrom = await store.dispatch('DISPATCH_ROUTER_ACTION', {actionName: 'ROUTE_ENTER_' + toName + '_FROM_' + fromName, to, from});

    if (enterToFrom && enterToFrom.next) {
      next(enterToFrom.next);

      return Promise.resolve();
    }

    const enterTo = await store.dispatch('DISPATCH_ROUTER_ACTION', {actionName: 'ROUTE_ENTER_' + toName, to, from});

    if (enterTo && enterTo.next) {
      next(enterTo.next);

      return Promise.resolve();
    }

    next();
    return Promise.resolve();
  } else {
    routerNext('login');
    return Promise.resolve();
  }
});
*/
export default router;


/*
 * Here is our app router.  Some handy stuff.
 *
 * I think we are going to drift away from demanding the layout object be called as a variable.  It makes the
 * routing table kind of unreadable, and I think I want to rethink the way we handle this a bit.


export default class Router extends Backbone.Router {
    get routes() {
        return {
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
            ":site/help(/:help)": "Help",
            // Authentication routes
            ":site/redirect/logout": "Logout",
            ":site/redirect/profile": "Profile",
            ":site/redirect/admin": "Admin",

            "(/)browse/lti": "BrowseLTI",
            "?token=:token/browse/lti(:context)": "BrowseLTIToken",

            ":site/search/:search": "Search",
            ":site/browse": "Browse",
            ":site/browse/archived": "BrowseArchived",
            ":site/browse/archived/clear": "BrowseArchivedClear",
            ":site/browse/(:criteria)(/)(:query)": "Browse",
            ":site/updates": "Updates",
            ":site/mycontent": "MyContentBrowse",
            ":site/tags": "Tags",
            ":site/comments": "Comments",
            ":site/login": "Login",
            ":site/home": "Welcome",
            ":site/home/:first(/)(:second)(/)(:third)(/)(:fourth)(/)(:fifth)(/)(:sixth)(/)(:seventh)": "ItemsInWelcome",

            ":site/lti/:first(/)(:second)(/)(:third)(/)(:fourth)(/)(:fifth)(/)(:sixth)(/)(:seventh)": "ItemInLTI",
            ":site/:first(/)(:second)(/)(:third)(/)(:fourth)(/)(:fifth)(/)(:sixth)(/)(:seventh)": "Primary",
            ":site": "Welcome",

            "/sites/new": "CreateSite",
            "/sites": "Sites",

            "/": "Index",
            "*actions": "Index"
        }
    }
*/
