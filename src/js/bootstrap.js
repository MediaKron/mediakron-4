
window._ = require('lodash');
window.Popper = require('popper.js').default;

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
    window.$ = window.jQuery = require('jquery');
    require('jquery-ui');
    require('rangy');
    window.Backbone = require('backbone');
    if(!window.JSON){
        window.JSON = require('json2');
    }
    
    // Load Spectrum
    require('spectrum-colorpicker');
    // Load the mediaelement
    require('mediaelement');
    // Load Leaflet into the root namespace 
    require('leaflet');             // TODO: Can we load this only if we have a map
    // Load the typeahead module for searching 
    require('typeahead');           // TODO: Move this into the search module and make this disablable if search is disabled
    //require('linkify');           // TODO: Can we replace this with an in house function: Does not work yet because of unmetable dependencies
    // Mediakron Libraries
    require('./fullscreen');        // Creates a full screen plugin in browsers that don't support it

    require('./init')();            // TODO: consider moving this into the app initialization to consolidate
    require('./extensions/init')(); // This should invoke all of the extensions.  These functions extend backbones MVC with our custom function
    //require('./');

    Mediakron.Access = require('./access');            // Load the access module so we can check access
    console.log('post access')
    // if the site is public, the guest user perms should be slightly different
    //if (Mediakron.Settings.public) {
    //    Mediakron.Access.roles.guest.permissions['can access site'] = true;
    //}

    // Load up all of the models
    Mediakron.Models = require('./models');
    console.log(Mediakron.Models)
    require('bootstrap');
} catch (e) {
    console.log(e);     
}

//require('./jquery-ui-touch-punch');

/*
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

 

    <script src="/mediakron/js/vendor/me/mediaelement-and-player.min.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/chosen/chosen.jquery.min.js" type="text/javascript"></script>

    <script id="settings" src="/release39/settings.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/require/require-2.1.15.min.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/fullscreen.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/init.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/access.js" type="text/javascript"></script>
    <script src="/mediakron/js/build/templates.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/messages.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/functions.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/media.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/annotation.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/progression.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/comparison.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/models.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/collections.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/edit.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/accessibility.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/views.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/comments.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/sidebars.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/controller.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/item.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/story.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/slideshow.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/narrative.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/folder.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/progression.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/comparison.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/map.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/timeline.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/regions.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/popups.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/maps.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/timeline/format.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/timeline/zoom.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/timeline/timeline.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/tag.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/events.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/help.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/settings/settings.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/settings/content.forms.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/settings/browsers.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/settings/navigation.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/settings/relationships.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/settings/import.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/settings/export.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/settings/canvas.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/views/search.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/settings/search.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/settings/manager.js" type="text/javascript"></script>


       <script src="/mediakron/js/vendor/jquery-ui-1.12.1.min.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/jquery.punch.min.js" type="text/javascript"></script>

    <script src="/mediakron/js/vendor/bootstrap.min.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/json2.min.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/hoverIntent.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/spectrum.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/lodash.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/backbone.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/leaflet-src.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/typeahead.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/linkify.min.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/accessibility/jquery-accessible-accordion-aria.js" type="text/javascript"></script>
    <script src="/mediakron/js/src/preview/build/components/compatibility.js"></script>
    <script src="/mediakron/js/src/preview/build/pdf.js"></script>
    <script src="/mediakron/js/src/preview/build/components/pdf_viewer.js"></script>

    <script src="/mediakron/js/vendor/rangy/rangy-core.min.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/rangy/rangy-selectionsaverestore.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/rangy/rangy-textrange.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/rangy/rangy-serializer.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/rangy/rangy-classapplier.js" type="text/javascript"></script>
    <script src="/mediakron/js/vendor/rangy/rangy-highlighter.js" type="text/javascript"></script>


    <script src="/mediakron/js/src/app.js" type="text/javascript"></script>

    <!--this should be removed from every live site.Debugging only-- >
        <script src="/mediakron/js/src/debug.js" type="text/javascript"></script>
    */

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo'

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     encrypted: true
// });
