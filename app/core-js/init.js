import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";

// Auth
import Auth from "./auth/auth"
import Access from "./auth/access";

import Site from "./models/site"
import Items from "./collections/items";
import ClassManagement from "../core-js/util/class.management";

// import url functions
import { uri, base_path, getItemFromURI, createUrlMap } from "./util/url"
import Settings from "../settings"
import Theme from "../theme/theme";

import Router from "./router";
import MainMenu from "../navigation/main-menu/main-menu";

var state = {

    // 
    uri: false, 

    router: false, // this will later be the mediakron router funciton.  Useful for going cool places
    loading: true,
    socket: false,

    Status: { // a set of helpful internal flags.  Maybe will eventually incoperate some of these other places
        url: false, // handy
        context: false, // maybe not necessary anymore
        time: 0, // not sure what this does
        CurrentTopic: 0, // Probably can be depricated
        CurrentTag: 0, // depricate
        CurrentMap: 0, // track the current map
        CurrentTimeline: false, // track the current timeline
        FileUploadSupport: true, // maybe impliment to throw a file upload alert:  ToDO impliment a loading broser check
        uploadInProgress: false, // in use
        lti: false, // in use
        ltiReturnUrl: false, // in use
        ltiIntendedUse: false, // in use
        Managing: false, // in use
        formChanged: false, // in use
        bodyClasses: '', // figure out a better way
        views: 0, // in use
        historyStarted: false,
        lastPoll: false, // when did we last check for updates
        currentEditors: {}, // which users are currently editing what
        PollQuery: '',
        currentEditing: {},
        online: false,
        storyDebug: false

    },
    eventBus: _.extend({}, Backbone.Events),
    console: function (log) { },
}

class App {
  constructor(state) {
    this.data = {};
    this.state = state;

    // Set up the settings
    this.Settings = new Settings();
    this.ClassManagement = new ClassManagement();
  }

  /**
   * Boot mediakron
   */
  boot() {
    var app = this;
    // set up permissions
    app.Access = Access;
    // load up the site
    var site = this.site = new Site({ uri: uri });

    // Backfill functions to support mediakron legacy
    this.polyfill(this);

    // after fetch, initialize the site
    this.router = new Router();
    Auth(function(){
        this.site.fetch().done(function () {

            site.initializeSettings();

            // Start
            app.Theme = new Theme();
            app.Theme = Mediakron.Theme.Initialize();

            app.items = new Items();
            app.items.fetch().done(function () {
                app.run();
            })
        });
    });
    
  }

  polyfill(mk){
      console.log(mk);
      mk.getItemFromURI = getItemFromURI;
  }

    run() {
        this.data = createUrlMap();
        
        this.menu = new MainMenu();
        /*this.configure = new Mediakron.MenuRight();
        //Mediakron.changeTracker = new Mediakron.UpdatedContent();
        Mediakron.App.load();


        Mediakron.router.routesHit = 0;
        Backbone.listenTo(Mediakron.router, "route", function (route, params) {
            // queue classes from route
            Mediakron.controller.lastRoute = Mediakron.controller.currentRoute;
            Mediakron.controller.currentRoute = Backbone.history.fragment;
            if (Mediakron.Routes[route]) {
                if (Mediakron.Routes[route].classes) {
                    Mediakron.classes.queue(Mediakron.Routes[route].classes);
                }
            }
            Mediakron.router.routesHit = Mediakron.router.routesHit + 1;
            Mediakron.Status.views = Mediakron.Status.views + 1;
            Mediakron.classes.reset();
        });
        if (!Mediakron.Status.historyStarted) {
            Backbone.history.start({
                pushState: true,
                // I think we're going to stick with the Push state.  
                // I was thinking about using hashbangs but 
                // http://danwebb.net/2011/5/28/it-is-about-the-hashbangs is compelling
                root: Mediakron.Settings.basepath
            });
            Mediakron.Status.historyStarted = true;
        }*/
    }

  // make the utility class avaliable
}  

export default App;