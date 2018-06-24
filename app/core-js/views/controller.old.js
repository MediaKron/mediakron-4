import MediakronView from '../extensions/views';

export default class Controller extends MediakronView {
    constructor(options) {
        super(options);
    }

    initialize() {}
}

/* 
 * The View handling for Mediakron
 * 
 * We're going to add a couple of methods to the backbone view
 * Specifically, we're oing to give ourself an after render function
 * that will only get called once the transition in effects are complete
 * We're also going to provide a transition in and a transition out function to be called by our main app view
 * super spiffy transition stuff going on here.
 *  
 * This was an awesome idea, that came in part from mike fowler.   http://mikefowler.me/2013/11/18/page-transitions-in-backbone/
 * Credit where credit due, right?
 * 
 */




/**
 * This is the primary app view.  Its going to attach itself to the core region and act as an
 * air traffic controller for all of the children views.  Awesome, cause by binding it this way,
 * we can grab a view, and ask it to transition inward, and the fly effects will work nicely.
 */
//var template = require('../../templates/context/default.tpl');
//console.log(template());
var controller = Mediakron.Extensions.View.extend({
    template: template,
    className: 'pages pages-layout layout-pages',
    el: '#main', // el attaches to existing element
    admin: '#settings-context',
    help: '#help-contents',
    linkBrowser: '#linkbrowser-contents',
    $admin: false,
    currentRoute: false,
    lastRoute: false,
    views: [],
    types: [],
    items: [],
    oldbreadcrumb: [],
    breadcrumb: [],
    uri: [],
    currentItem: null,
    currentView: null,
    currentAdmin: null,
    currentHelp: null,
    reloadTimeMarkers: false,
    scrollUp: false,
    tempLoop: [],
    history: [],
    lastRealPage: [],
    refresh: false,
    oldZero: 0,
    popup: true,
    initialize: function() {
        this.render();
        this.$admin = $(this.admin);
        this.$help = $(this.help);
        this.$linkBrowser = $(this.linkBrowser);
        var widget = this;
        $('#help-context').on('click', function() {
            widget.$help.parent().addClass('closed').removeClass('opened');
            widget.$help.empty();
        });

        return this;
    },
    render: function() {

        var view = this;
        console.log(this.template)
        this.$el.append(this.template());
        var height = ($(window).height() * -1) / 2,
            pos, $wrapper = $('#main-container'),
            $main = $('#wrapper-main'),
            $admin = $('#settings-context'),
            $adminPane = $('#settings-context .pages'),
            $content = $('#main'),
            object = { wrapper: $wrapper };

        $admin.scroll(function(e) {
            if ($admin.scrollTop() > $('#settings-context .pages').height() - $(document).height() - 200) {
                Mediakron.App.Events.trigger('scroll:nearbottom', object);
            }
        });

        $wrapper.scroll(function() {
            pos = view.$el.position().top;
            Mediakron.App.Events.trigger('scroll:ing', { pos: pos });
            if (pos < 20) {

                $('#main-container').addClass('scrolled');
                $('.sticky-header').addClass('active');
                $('.item-header').addClass('header-visibility');
                $('#content-browser #content-manage').addClass('sticky-filters');
                $('.edit-content header').addClass('header-visibility');

            } else if (pos > 20) {

                $('#main-container').removeClass('scrolled');
                $('.item-header').removeClass('header-visibility');
                $('.sticky-header').removeClass('active');
                $('#content-browser #content-manage').removeClass('sticky-filters');
                $('.edit-content header').removeClass('header-visibility');
            }

            if ($wrapper.scrollTop() > $content.height() - $(document).height() - 200) {
                Mediakron.App.Events.trigger('scroll:nearbottom', object);
            }
            
//            if (pos < 0) {
//                $('.scroll-top').show();
//                view.scrollUp = true;
//            }
//            if (pos > 0) {
//                $('.scroll-top').hide();
//                view.scrollUp = false;
//            }
            
        });

        $('.scroll-top	').click(function() {
            if (view.scrollUp) {
                $('#main-container').animate({ scrollTop: 0 }, '700');
            } else {

            }
        });
        $('.scroll-down').click(function() {
            $('#main-container  ').animate({ scrollTop: $wrapper.height() }, '700');
        });
        return this;
    },

    reset: function() {
        this.views = [];
        this.items = [];
        this.breadcrumb = [];
        this.uri = [];
    },

    doBreadcrumb: function() {

    },

    closeAdmin: function() {
        if (this.$admin.hasClass('opened')) { this.$admin.addClass('closed').removeClass('opened'); }
        $('#settings-context').empty();
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
        $('.template').removeClass('content-push-sidebar'); /* remove content push if present */
    },


    closeLinkBrowser: function() {
        if (this.$linkBrowser.parent().hasClass('opened')) { this.$linkBrowser.parent().addClass('closed').removeClass('opened'); }
        $('#linkbrowser-content').empty();
    },

    gotoItem: function() {
        this.tempLoop = this.uri.slice(0);
        this.closeAdmin();
        Mediakron.breadcrumb.setBreadcrumb(this.items);
        var count = this.breadcrumb.length;

        if (count > 0) {
            var zero = count - 2,
                one = count - 1;
            if (zero < 0) zero = 0;
            if (one < 1) one = 1;
            var item = this.breadcrumb[zero],
                view = this.views[zero];

            Mediakron.classes.item(item);

            if (Mediakron.controller.forcepopup) {
            
            } else if (this.oldbreadcrumb[zero]) {
                if (this.oldbreadcrumb[zero] !== this.breadcrumb[zero]) {
                    this.gotoView(zero);
                    this.popup = false;
                } else {
                    if (((this.types[zero] == 'slideshow' || this.types[zero] == 'map' || this.types[zero] == 'timeline') ||
                            (this.types[one] == 'map' || this.types[one] == 'timeline')) &&
                        this.oldcount <= count) {
                        this.popup = true;
                        if (this.refresh) {
                            this.gotoView(zero);
                            this.refresh = false;
                        }
                    } else {
                        this.gotoView(zero);
                        this.popup = false;
                    }
                }
            } else {
                this.popup = false;
                this.gotoView(zero);
            }
            if (this.breadcrumb[one]) {
                if ((this.types[zero] == 'map' || this.types[zero] == 'timeline') && (this.types[one] == 'map' || this.types[one] == 'timeline')) {
                    item = this.breadcrumb[one];
                    view = this.views[one];
                    this.gotoView(one);
                } else {
                    view.gotoItem(this.breadcrumb[one]);
                }
            } else {
                this.views[zero].closeChildren();
            }
            this.renderFolderNavigation();
            this.oldcount = count;
        }
    },

    getContextPath: function(uri) {

        var last = this.breadcrumb,
            length = last.length,
            i = 0,
            gotoUrl = '';
        if (this.isHome()) {
            if (Mediakron.Settings.HomePage.item) {
                gotoUrl += Mediakron.Settings.HomePage.item + '/';
            }
        }
        if (length > 0) {
            for (i; i < length; i++) {
                gotoUrl = gotoUrl + last[i].get('uri') + '/';
                if (last[i].get('uri') == uri) break;
            }
        }

        return gotoUrl;
    },

    getPath: function(removeCurrent) {
        var last = this.lastRealPage,
            length = last.length,
            i = 0,
            gotoUrl = '';
        if (length > 0) {
            if (removeCurrent) length = length - 1;
            for (i; i < length; i++) {
                gotoUrl = gotoUrl + last[i].get('uri') + '/';
            }
        }

        return gotoUrl;
    },
    getPathTo: function(find) {
        var last = this.lastRealPage,
            length = last.length,
            i = 0,
            gotoUrl = '';

        /*if (this.isHome()) {
            if (Mediakron.Settings.HomePage.item) {
                gotoUrl += 'home/';
            }
        }*/
        if (length > 0) {
            for (i; i < length; i++) {
                gotoUrl = gotoUrl + last[i].get('uri') + '/';
                if (find == last[i].get('uri')) break;
            }
        }
        return gotoUrl;
    },
    isHome: function() {
        var frag = Backbone.history.getFragment();
        if (frag === '' || frag === 'home') return true;
        return false;
    },
    getEditPath: function(stop) {
        var last = this.lastRealPage,
            length = last.length,
            i = 0,
            gotoUrl = '',
            uri;

        if (this.isHome()) {
            if (Mediakron.Settings.HomePage.item) {
                return Mediakron.Settings.HomePage.item;
            }
        }

        if (length > 0) {
            for (i; i < length; i++) {
                uri = last[i].get('uri');
                if (stop) {
                    if (uri == stop) break;
                }
                gotoUrl = gotoUrl + uri + '/';

            }
            gotoUrl = gotoUrl + stop + '/';
        }
        return gotoUrl;
    },
    getLastFolderId: function() {
        var uri,
            length = this.items.length,
            i = -1,
            item;

        if (length > -1) {
            for (length; i < length; length--) {
                item = this.items[length];
                if (item) {
                    if (item.getNormalType() == 'folder') {
                        return length;
                    }
                }
            }
        }
        return false;
    },
    getLastFolder: function() {
        var uri,
            length = this.items.length,
            i = -1,
            item;

        if (length > -1) {
            for (length; i < length; length--) {
                item = this.items[length];
                if (item) {
                    if (item.getNormalType() == 'folder') {
                        return item.get('uri');
                    }
                }
            }
        }
        return false;
    },
    renderFolderNavigation: function() {
        // get the view id of the last folder
        var lastFolderId = this.getLastFolderId();
        if (lastFolderId !== false) { // there is a last folder and this is its position in the view array
            // view
            var view = this.views[lastFolderId],
                item = this.items[lastFolderId],
                uri = this.breadcrumb[lastFolderId],
                length = this.breadcrumb.length - 1;
            // check if this is the last item
            if (this.breadcrumb[length] == uri) {
                // the last folder is the last item
                // check for a parent folder
                var i = -1,
                    lookfor, found = -1;
                lastFolderId = lastFolderId - 1;
                for (lastFolderId; i < lastFolderId; lastFolderId--) {
                    lookfor = this.items[lastFolderId];
                    if (lookfor) {
                        if (lookfor.getNormalType() == 'folder') {
                            found = lastFolderId;
                            break;
                        }
                    }
                }
                if (found > -1) {
                    view = this.views[found];
                    view.renderNavigation(this.items[found], item);
                }

            } else {
                // the last folder isn't the last item
                view.renderNavigation(item, this.items[length]);
            }
        }
    },
    gotoCallback: false,
    gotoLast: function() {
        if (this.gotoCallback) {
            this.gotoCallback();
            return false;
        }
        var last = this.lastRealPage,
            length = last.length,
            i = 0,
            gotoUrl = '/';
        if (length > 0) {
            for (i; i < length; i++) {
                gotoUrl = gotoUrl + last[i].get('uri') + '/';
            }
        }
        if (gotoUrl.substr(-1) == '/') {
            gotoUrl = gotoUrl.substr(0, gotoUrl.length - 1);
        }
        this.refresh = true;
        Mediakron.router.navigate(gotoUrl, { trigger: true });
    },
    /**
     * 
     */
    closeOverlay: function(trigger, forceTo) {
        if (this.gotoCallback) {
            this.gotoCallback();
            return false;
        }
        var last = this.lastRealPage,
            length = last.length - 1,
            i = 0,
            gotoUrl = '/',
            refresh = [];
        if (length > 0) {
            for (i; i < length; i++) {
                gotoUrl = gotoUrl + last[i].get('uri') + '/';
                refresh.push(last[i]);
            }
        }

        if (gotoUrl.substr(-1) == '/') {
            gotoUrl = gotoUrl.substr(0, gotoUrl.length - 1);
        }
        this.refresh = false;
        if (!trigger) {
            trigger = { trigger: true };
        } else {    
            this.lastRealPage = refresh;
        }
        if(forceTo){
            Mediakron.router.navigate(forceTo, trigger);
        }else{
            Mediakron.router.navigate(gotoUrl, trigger);
        }
        
    },

    refreshPrimary: function() {
        this.tempLoop = this.uri.slice(0);
        Mediakron.breadcrumb.setBreadcrumb(this.items);

        var item = this.breadcrumb[0],
            view = item.getView();
        this.views[0] = view;
        Mediakron.classes.item(item);

        this.gotoView(view, true);
        this.currentItem = false;
    },

    refreshLast: function() {
        this.tempLoop = this.uri.slice(this.items.length - 1);
        Mediakron.breadcrumb.setBreadcrumb(this.items);

        var item = this.breadcrumb[this.breadcrumb.length - 1],
            view = item.getView();
        this.views[this.views.length - 1] = view;
        Mediakron.classes.item(item);

        this.gotoView(view, true);
        this.currentItem = false;
    },

    gotoView: function(view, close) {
        if (!close) { this.closeAdmin(); }
        var id = 0;
        if (typeof(view) == 'number') {
            id = view;
            view = this.views[view];

        }
        this.currentItem = this.breadcrumb[id];

        var previous = this.currentView || null,
            next = view;
        if (previous) {
            previous.remove();
            previous.close();
            $('#main').removeClass(previous.classes);
        }
        var $el = $('<div id="' + view.cid + '" class="main-content"></div>');
        this.$el.append($el);
        next.setElement('#' + view.cid);
        Mediakron.breadcrumb.setBreadcrumb(this.items);
        next.render();

        Mediakron.App.Events.trigger("context:goto", { view: next });
        $('#main').addClass(next.classes);
        next.$el.addClass('page');
        next.afterRender();
        Mediakron.App.Events.trigger('page:rendered', { view: next });
        this.currentView = next;
        return next;
    },
    gotoAdmin: function(view) {
        if (this.$admin.hasClass('closed')) { this.$admin.addClass('opened').removeClass('closed'); }
        var previous = this.currentAdmin || null,
            next = view;

        if (previous) {
            previous.remove();
        }
        Mediakron.breadcrumb.setBreadcrumb(this.items);
        next.render();
        this.$admin.html(next.$el);

        Mediakron.App.Events.trigger("context:goto", { view: next });

        next.afterRender();
        if (typeof(next.transitionIn) === 'function') {
            next.transitionIn();
        } else {
            next.$el.show();
        }
        $('#settings-context').scrollTop('0');
        Mediakron.App.Events.trigger('page:rendered', { view: next });
        this.currentAdmin = next;

        return next;
    },
    gotoHelp: function(view) {
        if (this.$help.parent().hasClass('closed')) { this.$help.parent().addClass('opened').removeClass('closed'); }
        var previous = this.currentHelp || null,
            next = view;

        if (previous) {
            previous.remove();
        }
        Mediakron.breadcrumb.setBreadcrumb(this.items);
        next.render();
        this.$help.html(next.$el);

        Mediakron.App.Events.trigger("context:goto", { view: next });

        next.afterRender();
        next.$el.show();
        this.currentHelp = next;
        this.$help.scrollTop('0');
        Mediakron.App.Events.trigger('page:rendered', { view: next });
        return next;
    },
    openLinkBrowser: function() {
        if (this.$linkBrowser.parent().hasClass('closed')) { this.$linkBrowser.parent().addClass('opened').removeClass('closed'); }
        this.$linkBrowser.scrollTop('0');
    },
    setPrimary: function(item) {

        if (!item) { Mediakron.Events.ThrowError(); return false; }
        this.oldbreadcrumb = this.breadcrumb;
        var prev = false,
            view;
        if (this.items[0]) {
            prev = this.items[0];
        }

        if (prev != item) {
            view = item.getView();
        } else {
            view = this.views[0];
        }

        view.primary = true;
        this.views = [view];
        this.items = [item];
        this.breadcrumb = [item];
        this.uri = [item.get('uri')];
        this.types = [item.getNormalType()];
    },
    setView: function(item, i) {
        if (!item) { Mediakron.Events.ThrowError(); return false; }
        var view = item.getView(),
            length = this.views.push(view);

        this.breadcrumb.push(item);
        this.items.push(item);
        this.uri.push(item.get('uri'));
        this.types.push(item.getNormalType());
    },

    showFull: function(item) {

    }
});

module.exports = controller;