import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";

var Mediakron = {

    router: false, // this will later be the mediakron router funciton.  Useful for going cool places
    loading: true,
    socket: false,

    Status: { // a set of helpful internal flags.  Maybe will eventually incoperate some of these other places
        url: document.URL.split('#')[0], // handy
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
    AuthResponse: {},
    Extensions: {},
    eventBus: _.extend({}, Backbone.Events),
    console: function (log) { },
}

export default Mediakron;