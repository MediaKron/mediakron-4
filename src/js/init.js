module.exports = function(){
    // YOU PROBABLY DON"T NEED TO EDIT ANYTHING AFTER THIS LINE
    // Well, ok then, but be careful and don't whine if you break something
    Mediakron.router = false; // this will later be the mediakron router funciton.  Useful for going cool places
    Mediakron.loading = true;
    Mediakron.socket = false;
    Mediakron.Status = { // a set of helpful internal flags.  Maybe will eventually incoperate some of these other places
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

    };

    Mediakron.HomepagePopup = function(argument) {
        var uri = Mediakron.Settings.HomePage.item;
        if (uri) {
            var item = Mediakron.getItemFromURI(uri);
            if (item) {
                if (item.getNormalType() == 'map') {
                    return item.getRelationshipByURI(argument, 'layers');
                } else if (item.getNormalType() == 'timeline') {
                    return item.getRelationshipByURI(argument, 'events');
                }
            }
        }
        return false;
    };



    require.config({
        baseUrl: "/mediakron/js",
        urlArgs: "version=" + Mediakron.Settings.version + Math.random(),
        paths: {
            jquery: 'vendor/jquery',
            lodash: 'vendor/lodash',
            backbone: 'vendor/backbone',
            text: 'vendor/require/text',
            filesaver: 'vendor/filesaver',
            socketio: '//cdn.socket.io/socket.io-1.0.0',
            tourist: 'vendor/tourist/tourist',
            datatables: 'vendor/jquery.dataTables',
            typeahead: 'vendor/typeahead',
            hopscotch: 'vendor/hopscotch/dist/js/hopscotch',
            'rangy-main': '/mediakron/js/src/story/vendor/rangy.main',
        },
        shim: {
            typeahead: {
                deps: ['jquery'],
                init: function($) {
                    return require.contexts._.registry['typeahead.js'].factory($);
                }
            }
        }
    });

    //L.Icon.Default.imagePath = '/mediakron/js/vendor/leaflet/images/'; // TODO: Turn this back on when leaflet is ready

    Mediakron.AuthResponse = {};
    //PDFJS.workerSrc = '/mediakron/js/src/preview/build/pdf.worker.js'; TODO: Turn this back on when PDF JS IS READY

    Mediakron.Extensions = {};
    

    Mediakron.eventBus = _.extend({}, Backbone.Events);

    Backbone.View.prototype.close = function() {
        this.remove();
        this.unbind();
        if (this.onClose) {
            this.onClose(); 
        }
    };

    Mediakron.console = function(log) {};
};