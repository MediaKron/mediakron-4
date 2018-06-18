/*
 * Here is our app router.  Some handy stuff.
 *
 * I think we are going to drift away from demanding the layout object be called as a variable.  It makes the
 * routing table kind of unreadable, and I think I want to rethink the way we handle this a bit.
 */
var router =  Backbone.Router.extend({
    routes: {
        "settings/organize(/:type)": "SettingsOrganize",
        "settings/content/add(/:type)": "SettingsContentAdd",
        "settings/content/edit/*path": "SettingsContentEdit",
        "settings/convert/:type/:uri": "convertToType",
        "settings/revisions/:uri": "getRevisions",
        "settings/transmit/:uri": "transmitTo",
        "settings/duplicate/:uri": "copyItem",
        "settings/content/:action(/:uri)": "SettingsContentConfirm",
        "settings/content(/:context)": "SettingsContent",
        "settings/manage/:action/*path": "SettingsManageContext",
        "settings/marker/:map/:marker": "SettingsMarkers",
        "settings/marker/:map/:marker/remove": "SettingsRemoveMarker",

        ":parent/manager/:child/remove": "SettingsManagerRemove",

        ":parent/manager/:type(/:uri)": "SettingsManager",


        "settings/event/:timeline/:event": "SettingsEvent",
        "settings/event/:timeline/:event/remove": "SettingsRemoveEvent",

        "settings/export": "SettingsExport",
        "settings/statistics": "SettingsStatistics",
        "settings/appearance": "SettingsAppearance",
        "settings/homepage": "SettingsHomepage",
        "settings/canvas": "SettingsCanvas",
        "settings/search": "SettingsSearch",
        "settings/performance": "SettingsPerformance",
        "settings/navigation": "SettingsNavigation",
        "settings/import": "SettingsImport",
        "settings/trash": "Trashcan",
        "settings/import/mediakron2": "SettingsImportMK2",
        "settings/general": "SettingsGeneral",
        "settings/users": "SettingsUsers",
        "settings/comments": "SettingsComments",
        "settings/privacy": "SettingsPrivacy",
        "settings/googleanalytics": "SettingsGoogleAnalytics",
        "settings/itemoptions": "SettingsItemOptions",
        "settings": "Settings",
        "help(/:help)": "Help",
        // Authentication routes
        "redirect/logout": "Logout",
        "redirect/profile": "Profile",
        "redirect/admin": "Admin",
        "(/)browse/lti": "BrowseLTI",
        "?token=:token/browse/lti(:context)": "BrowseLTIToken",
        "(/)search/:search": "Search",
        "(/)browse": "Browse",
        "(/)browse/archived": "BrowseArchived",
        "(/)browse/archived/clear": "BrowseArchivedClear",
        "(/)browse/(:criteria)(/)(:query)": "Browse",
        "(/)updates": "Updates",
        "(/)mycontent": "MyContentBrowse",
        "(/)tags": "Tags",
        "(/)comments": "Comments",
        "(/)login": "Login",
        "(/)home": "Welcome",
        "(/)home/:first(/)(:second)(/)(:third)(/)(:fourth)(/)(:fifth)(/)(:sixth)(/)(:seventh)": "ItemsInWelcome",

        "(/)lti/:first(/)(:second)(/)(:third)(/)(:fourth)(/)(:fifth)(/)(:sixth)(/)(:seventh)": "ItemInLTI",
        "(/):first(/)(:second)(/)(:third)(/)(:fourth)(/)(:fifth)(/)(:sixth)(/)(:seventh)": "Primary",
        "*actions": "Welcome"
    },
    MyContentBrowse: function () {
        if (Mediakron.Access.isGuest()) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.App.DoIfLoaded(function () {
            var ContentPage = new Mediakron.ContentBrowser.MyContent({
                user: Mediakron.user.get('id')
            });
            if (ContentPage) {
                Mediakron.controller.gotoView(ContentPage);
            }
        });
    },
    Updates: function () {
        if (Mediakron.Access.isGuest()) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.App.DoIfLoaded(function () {
            var ContentPage = new Mediakron.ContentBrowser.Updates();
            if (ContentPage) {
                Mediakron.controller.gotoView(ContentPage);
            }
        });
    },
    copyItem: function (uri) {
        if (!Mediakron.Access.check('can create content')) {
            Mediakron.Access.denied();
            return false;
        }
        var item = Mediakron.getItemFromURI(uri);
        if (!item) return false;
        item.duplicate();
    },
    getRevisions: function (uri) {
        var item = Mediakron.getItemFromURI(uri);
        if (!item.canEdit()) {
            Mediakron.Access.denied();
            return false;
        }
        var ContentPage = new Mediakron.Admin.Revisions({
            item: item
        });
        if (ContentPage) {
            Mediakron.controller.gotoAdmin(ContentPage);
        }
    },
    Trashcan: function (uri) {
        var item = Mediakron.getItemFromURI(uri);
        if (!Mediakron.Access.check('can restore from trash')) {
            Mediakron.Access.denied();
            return false;
        }
        $('#settings-context').removeClass('opened').addClass('closed');
        Mediakron.message({
            text: 'Retrieving Deleted Items',
            type: 'success',
            timeout: 4000,
            layout: 'bottom'
        });
        $.getJSON(Mediakron.Data.trash, function (data) {
            var ContentPage = new Mediakron.Admin.Trashcan({ 'trash': data });
            if (ContentPage) {
                Mediakron.controller.gotoAdmin(ContentPage);
            }
        });
    },
    transmitTo: function (uri) {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Access.denied();
            return false;
        }
        var item = Mediakron.getItemFromURI(uri);
        var ContentPage = new Mediakron.Admin.Transmit({
            item: item
        });
        if (ContentPage) {
            Mediakron.controller.gotoAdmin(ContentPage);
        }
    },
    Logout: function () {
        window.location = Mediakron.Data.logout;
    },
    Profile: function () {
        window.location = Mediakron.Data.profile;
    },
    Admin: function () {
        window.location = '/admin/sites/' + Mediakron.Settings.uri;
    },
    Login: function () {
        if ((Mediakron.Access.check('can access site') && !Mediakron.Settings.public) || (Mediakron.Settings.public && !Mediakron.Access.isGuest())) {
            return this.Welcome();
        }
        var query = Mediakron.AuthResponse;
        query.fromRoute = true;
        var login = new Mediakron.Login(query);
        Mediakron.controller.gotoView(login);
    },
    getItem: function (id) {
        var item = Mediakron.getItemFromURI(id);
        if (!item) {
            Mediakron.Events.ThrowError();
            return false;
        }
        // check permissions
        if (!item.canView()) {
            return false;
        }
        return item;
    },
    Primary: function (first, second, third, fourth, fifth, sixth, seventh) {
        if (typeof (first) == 'object') {
            var getter = first;
            if (getter[0]) first = getter[0];
            if (getter[1]) second = getter[1];
            if (getter[2]) third = getter[2];
            if (getter[3]) fourth = getter[3];
            if (getter[4]) fifth = getter[4];
            if (getter[5]) sixth = getter[5];
            if (getter[6]) seventh = getter[6];
        }
        Mediakron.controller.forcepopup = false;
        if (!second) {
            if (Mediakron.HomepagePopup(first)) {
                // TODO: SOLVE THIS PROBLEM
                //Mediakron.controller.forcepopup = true;
                //third = second;
                //second = first;
                //first = Mediakron.Settings.HomePage.item;
            }
        }
        var item, url, itemView, itemcollection;
        // Get the URL of the Item
        var item1, item2, item3, item4;
        item1 = this.getItem(first);
        view1 = Mediakron.controller.setPrimary(item1);
        Mediakron.setPollQuery(item1, 'view');
        if (second) {
            item2 = this.getItem(second);
            Mediakron.controller.setView(item2, 1);
            Mediakron.setPollQuery(item2, 'view');
        }
        if (third) {
            item3 = this.getItem(third);
            Mediakron.controller.setView(item3, 2);
            Mediakron.setPollQuery(item3, 'view');
        }
        if (fourth) {
            item4 = this.getItem(fourth);
            Mediakron.controller.setView(item4, 3);
            Mediakron.setPollQuery(item4, 'view');
        }
        if (fifth) {
            item5 = this.getItem(fifth);
            Mediakron.controller.setView(item5, 4);
            Mediakron.setPollQuery(item5, 'view');
        }
        if (sixth) {
            item6 = this.getItem(sixth);
            Mediakron.controller.setView(item6, 5);
            Mediakron.setPollQuery(item6, 'view');
        }
        if (seventh) {
            item7 = this.getItem(seventh);
            Mediakron.controller.setView(item7, 6);
            Mediakron.setPollQuery(item7, 'view');
        }
        Mediakron.controller.lastRealPage = Mediakron.controller.breadcrumb;
        Mediakron.controller.gotoItem();
    },
    ItemInLTI: function (id, access) {
        var item, url, itemView, itemcollection;
        Mediakron.classes.setStatic('lti-view snargle');
        Mediakron.Status.lti = true;
        // Get the URL of the Item
        item = Mediakron.getItemFromURI(id);
        // does the item exists.  if not throw a page not found error and perhaps log it
        // todo think about logging
        if (item === undefined) {
            Mediakron.Events.ThrowError();
            return false;
        }
        // check permissions
        if (!item.canView()) {
            return false;
        }
        Mediakron.Status.current = item.get('uri');
        Mediakron.controller.gotoView(item.getView());
    },
    // TODO: are we still using this?
    ItemWithContextFull: function (context, id) {
        var item, itemView, contextItem, contextView;
        contextItem = Mediakron.getItemFromURI(context);
        item = Mediakron.getItemFromURI(id);
        if (!item) {
            Mediakron.Events.ThrowError();
            return false;
        }
        // check permissions
        if (!item.canView()) {
            return false;
        }
        Mediakron.Status.current = item.get('uri');
        Mediakron.controller.gotoView(item.getView());
        Mediakron.controller.showFull(item);
    },
    // TODO: are we still using this?
    ItemWithContext: function (context, id) {
        var item, itemView, contextItem, contextView;
        contextItem = Mediakron.getItemFromURI(context);
        item = Mediakron.getItemFromURI(id);
        if (!item) {
            Mediakron.Events.ThrowError();
            return false;
        }
        // check permissions
        if (!item.canView()) {
            return false;
        }
        Mediakron.Status.current = item.get('uri');
        Mediakron.controller.gotoView(item.getView());
    },
    // TODO: are we still using this?
    ItemWithContextAndSidebar: function (context, id, sidebar) {
        var item, itemView, contextItem, contextView;
        item = Mediakron.getItemFromURI(id);
        if (item === undefined) {
            Mediakron.Events.ThrowError();
            return false;
        }
        // check permissions
        if (!item.canView()) {
            return false;
        }
        contextItem = Mediakron.getItemFromURI(context);
        Mediakron.Status.current = item.get('uri');
        Mediakron.controller.gotoView(item.getView());
    },
    Help: function (help) {
        if (!Mediakron.Access.check('can access site')) {
            Mediakron.Access.denied();
            return false;
        }
        if (!help) {
            Mediakron.controller.gotoView(new Mediakron.HelpPage(help));
        } else {
            Mediakron.controller.gotoHelp(new Mediakron.HelpPage(help));
        }
    },
    BrowseLTIToken: function (token, context) {
        this.BrowseLTI(context);
    },
    BrowseLTI: function (context) {
        if (!Mediakron.Access.check('can access site')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        if (context.indexOf('token') > -1) context = false;
        Mediakron.App.DoIfLoaded(function () {
            var ContentPage = new Mediakron.ContentBrowser.LTI({
                context: context
            });
            if (ContentPage) {
                Mediakron.controller.gotoView(ContentPage);
            }
        });
    },
    Browse: function (criteria, query, context) {
        Mediakron.controller.reset();
        if (!Mediakron.Access.check('can access site')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        Mediakron.App.DoIfLoaded(function () {
            var ContentPage = new Mediakron.ContentBrowser.View({
                context: context,
                criteria: criteria,
                query: query,
                archived: false,
                skip: [],
                disabled: [
                    "image",
                    "video",
                    "story",
                    "file",
                    "audio",
                    "narrative",
                    "slideshow",
                    "folder",
                    "progression",
                    "comparison",
                    "map",
                    "maptimeline",
                    "timeline"
                ]
            });
            if (ContentPage) {
                Mediakron.controller.gotoView(ContentPage);
            }
        });
    },
    BrowseArchived: function (criteria, query, context) {
        Mediakron.controller.reset();
        if (!Mediakron.Access.check('can archive content')) {
            Mediakron.Access.denied();
            return false;
        }
        if (!Mediakron.Status.archiveLoaded) {
            $.get(Mediakron.Data.collections.archived, function (data) {
                var d = 0,
                    length = data.length,
                    item, model;
                for (d; d < length; d++) {
                    model = new Mediakron.Models.Item(data[d]);
                    model.addToCollection();
                }
                Mediakron.createUrlMap();
                Mediakron.message({
                    text: '<span class="archive-message">Archive Mode Enabled </span><a class="btn btn-default btn-sm disable-archive">Disable</a><span class="archive-message-info"><a href="/app_dev.php/story/browse/archived">Archived items</a>  will be visible throughout the site.</span> ',
                    type: 'warning',
                    timeout: 0,
                    dismiss: false,
                    layout: 'bottom',
                    bindHelper: function (parent) {
                        $('.disable-archive').click(function (e) {
                            e.preventDefault();
                            var text = "Are you sure you want to exit archived mode?";
                            var accept = function () {
                                Mediakron.items.remove(Mediakron.items.where({
                                    archived: true
                                }));
                                Mediakron.router.navigate('browse', {
                                    trigger: true
                                });
                                parent.close();
                            };
                            var reject = function () {
                                Mediakron.messages.message("No changes made");
                            };
                            Mediakron.message({
                                text: text,
                                type: 'warning',
                                timeout: 0,
                                layout: 'center',
                                confirm: true,
                                callback: function () {
                                    accept();
                                },
                                cancel: function () {
                                    reject();
                                }
                            });
                            return false;
                        });
                    }
                });
                Mediakron.Status.archiveLoaded = true;
                var ContentPage = new Mediakron.ContentBrowser.Archived({
                    archived: true,
                    context: context,
                    criteria: criteria,
                    query: query
                });
                if (ContentPage) {
                    Mediakron.controller.gotoView(ContentPage);
                }
            });
        } else {
            var ContentPage = new Mediakron.ContentBrowser.Archived({
                archived: true,
                context: context,
                criteria: criteria,
                query: query
            });
            if (ContentPage) {
                Mediakron.controller.gotoView(ContentPage);
            }
        }
    },
    Tags: function (context) {
        Mediakron.controller.reset();
        if (!Mediakron.Access.check('can access site')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var Tags = new Mediakron.Pages.tags();
        if (Tags) {
            Mediakron.controller.gotoView(Tags);
        }
    },
    Comments: function (context) {
        Mediakron.controller.reset();
        if (!Mediakron.Access.check('can access site')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var Comments = new Mediakron.Pages.comments();
        if (Comments) {
            Mediakron.controller.gotoView(Comments);
        }
    },
    Search: function (search) {
        if (!Mediakron.Access.check('can access site')) {
            Mediakron.Access.denied();
            return false;
        }
        var Search = new Mediakron.Search.elasticSearch({});
        Search.search(search, function () {
            Mediakron.controller.gotoView(Search);
        });
    },
    ItemsInWelcome: function (first, second, third, fourth, fifth, sixth, seventh) {
        if (typeof (first) == 'object') {
            var getter = first;
            if (getter[0]) first = getter[0];
            if (getter[1]) second = getter[1];
            if (getter[2]) third = getter[2];
            if (getter[3]) fourth = getter[3];
            if (getter[4]) fifth = getter[4];
            if (getter[5]) sixth = getter[5];
            if (getter[6]) seventh = getter[6];
        }
        var item, url, itemView, itemcollection;
        Mediakron.classes.setStatic('home-view snargle');

        // Get the URL of the Item
        item = Mediakron.getItemFromURI(Mediakron.Settings.HomePage.item);

        // does the item exists.  if not throw a page not found error and perhaps log it
        // todo think about logging
        if (item === undefined) {
            Mediakron.Events.ThrowError();
            return false;
        }
        // check permissions
        if (!item.canView()) {
            return false;
        }
        view = Mediakron.controller.setPrimary(item);
        Mediakron.setPollQuery(item, 'view');

        if (first) {
            item1 = this.getItem(first);
            Mediakron.controller.setView(item1, 1);
            Mediakron.setPollQuery(item1, 'view');
        }
        if (second) {
            item2 = this.getItem(second);
            Mediakron.controller.setView(item2, 2);
            Mediakron.setPollQuery(item2, 'view');
        }
        if (third) {
            item3 = this.getItem(third);
            Mediakron.controller.setView(item3, 3);
            Mediakron.setPollQuery(item3, 'view');
        }
        if (fourth) {
            item4 = this.getItem(fourth);
            Mediakron.controller.setView(item4, 4);
            Mediakron.setPollQuery(item4, 'view');
        }
        if (fifth) {
            item5 = this.getItem(fifth);
            Mediakron.controller.setView(item5, 5);
            Mediakron.setPollQuery(item5, 'view');
        }
        if (sixth) {
            item6 = this.getItem(sixth);
            Mediakron.controller.setView(item6, 6);
            Mediakron.setPollQuery(item6, 'view');
        }

        Mediakron.Status.current = item.get('uri');
        Mediakron.controller.lastRealPage = Mediakron.controller.breadcrumb;
        Mediakron.controller.gotoItem();
    },
    Welcome: function () {
        if (!Mediakron.Access.check('can access site')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.controller.reset();
        if (Mediakron.Settings.HomePage.image || Mediakron.Settings.HomePage.description || Mediakron.Settings.HomePage.item) {
            item = Mediakron.getItemFromURI(Mediakron.Settings.HomePage.item);
            if (Mediakron.Settings.HomePage.layout == 'nointro') {
                Mediakron.classes.queue('home-page-item');
                Mediakron.router.navigate(item.get('uri'), {
                    trigger: true
                });
            }


            Mediakron.controller.gotoView(new Mediakron.Pages.welcome({
                item: item
            }));
        } else {
            if (!Mediakron.Access.check('can access site')) {
                Mediakron.Access.denied();
                return false;
            }
            Mediakron.classes.queue('home-help');
            Mediakron.controller.gotoView(new Mediakron.HelpPage(false));
        }
    },
    SettingsContent: function (context) {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var ContentPage = new Mediakron.ContentBrowser.View({
            context: context
        });
        if (ContentPage) {
            Mediakron.controller.gotoAdmin(ContentPage);
        }
    },
    SettingsStatistics: function () {
        if (!Mediakron.Access.check('can access statistics')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var StatisticsPage = new Mediakron.Admin.StatisticsPage();
        if (StatisticsPage) {
            Mediakron.controller.gotoAdmin(StatisticsPage);
        }
    },
    SettingsAppearance: function () {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var AppearancePage = new Mediakron.Admin.AppearancePage();
        if (AppearancePage) {
            Mediakron.controller.gotoAdmin(AppearancePage);
        }
    },
    SettingsHomepage: function () {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var HomePage = new Mediakron.Admin.HomePage();
        if (HomePage) {
            Mediakron.controller.gotoAdmin(HomePage);
        }
    },
    SettingsNavigation: function () {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var NavigationPage = new Mediakron.Navigation.Form();
        if (NavigationPage) {
            Mediakron.controller.gotoAdmin(NavigationPage);
        }
    },
    SettingsComments: function () {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var CommentsPage = new Mediakron.Admin.CommentsPage();
        if (CommentsPage) {
            Mediakron.controller.gotoAdmin(CommentsPage);
        }

    },
    SettingsPrivacy: function () {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var PrivacyPage = new Mediakron.Admin.PrivacyPage();
        if (PrivacyPage) {
            Mediakron.controller.gotoAdmin(PrivacyPage);
        }
    },
    SettingsGoogleAnalytics: function () {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var GoogleAnalyticsPage = new Mediakron.Admin.GoogleAnalyticsPage();
        if (GoogleAnalyticsPage) {
            Mediakron.controller.gotoAdmin(GoogleAnalyticsPage);
        }
    },
    SettingsItemOptions: function () {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var ItemOptionsPage = new Mediakron.Admin.ItemOptionsPage();
        if (ItemOptionsPage) {
            Mediakron.controller.gotoAdmin(ItemOptionsPage);
        }
    },
    SettingsCanvas: function () {
        if (!Mediakron.Access.check('can connect site to canvas')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var NavigationPage = new Mediakron.Canvas.Form();
        if (NavigationPage) {
            Mediakron.controller.gotoAdmin(NavigationPage);
        }
    },
    SettingsSearch: function () {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var Search = new Mediakron.Search.settings();
        if (Search) {
            Mediakron.controller.gotoAdmin(Search);
        }
    },
    SettingsPerformance: function () {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var Performance = new Mediakron.Admin.PerformancePage();
        if (Performance) {
            Mediakron.controller.gotoAdmin(Performance);
        }
    },
    SettingsOrganize: function (type) {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        if (type == 'structure') {
            var StructurePage = new Mediakron.Admin.Organize.StructurePage();
            if (StructurePage) {
                Mediakron.controller.gotoAdmin(StructurePage);
            }
        }
    },
    SettingsImport: function (type) {
        if (!Mediakron.Access.check('can import')) {
            Mediakron.Access.denied();
            return false;
        }
        var ImportForm = new Mediakron.Import.Initial();
        if (ImportForm) {
            Mediakron.controller.gotoAdmin(ImportForm);
        }
    },
    SettingsExport: function () {
        if (!Mediakron.Access.check('can export')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.setPollQuery();
        var ExportPage = new Mediakron.Export.Initial();
        if (ExportPage) {
            Mediakron.controller.gotoAdmin(ExportPage);
        }
    },
    SettingsImportMK2: function (type) {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Access.denied();
            return false;
        }
        Mediakron.DontPoll = true;
        var ImportForm = new Mediakron.Import.Mk2();
        if (ImportForm) {
            Mediakron.controller.gotoAdmin(ImportForm);
        }
    },
    SettingsRemoveMarker: function (map, marker) {
        var item = Mediakron.getItemFromURI(map);
        if (!item) return false;
        if (item.canEdit()) {
            var layers = item.getRelationship('layers'),
                i = 0,
                count = layers.length,
                layer, newlayers = [];
            for (i; i < count; i++) {
                layer = layers[i];
                if (layer.uri == marker) {
                    layers[i].remove = true;
                } else {
                    newlayers.push(layer);
                }
            }
            item.setRelationship('layers', layers);
            item.save({}, {
                success: function (data) {
                    Mediakron.router.navigate(item.get('uri'), {
                        trigger: false
                    });
                    Mediakron.Status.CurrentMap.drawMarkers();
                }
            });
        }
    },

    SettingsRemoveEvent: function (map, marker) {
        var item = Mediakron.getItemFromURI(map);
        if (!item) return false;
        if (item.canEdit()) {
            var events = item.getRelationship('events'),
                i = 0,
                count = events.length,
                event, newevents = [];
            for (i; i < count; i++) {
                event = events[i];
                if (event.uri == marker) {
                    events[i].remove = true;
                } else {
                    newlayers.push(layer);
                }
            }
            item.setRelationship('events', layers);
            item.save({}, {
                success: function (data) {
                    Mediakron.router.navigate(item.get('uri'), {
                        trigger: false
                    });
                    Mediakron.Status.CurrentMap.drawMarkers();
                }
            });
        }
    },

    SettingsMarkers: function (map, marker) {

        Mediakron.classes.queue('settings-manage-organize');
        var item = Mediakron.getItemFromURI(map);
        if (!item.canAddTo()) {
            Mediakron.Access.denied();
            return false;
        }
        var request = {
            map: item,
            marker: marker
        };
        var ManageMarkers = new Mediakron.Admin.Marker(request);
        if (ManageMarkers) {
            Mediakron.controller.gotoAdmin(ManageMarkers);
        }
    },

    SettingsManager: function (parent, child) {

        Mediakron.classes.queue('settings-manage-organize');
        var item = Mediakron.getItemFromURI(parent);
        if (!item.canAddTo()) {
            Mediakron.Access.denied();
            return false;
        }
        this.Primary(parent);

        var request = {
            parent: item,
            child: false,
            data: {}
        },
            Manager = false;
        if (child == 'simple') {
            request.event = false;
            Manager = new Mediakron.ContentManager.Edit(request);
            request.type = 'simple';
        } else if (child == 'browse') {
            request.event = false;
            Manager = new Mediakron.ContentManager.Browse(request);
            request.type = 'item';
        } else if (child == 'add') {
            request.event = false;
            Manager = new Mediakron.ContentManager.Create(request);
            request.type = 'item';
        } else {
            uri = child;
            childitem = Mediakron.getItemFromURI(child);
            if (childitem) {
                request.child = childitem;
                request.type = 'item';
            } else {
                request.child = child;
                request.type = 'simple';
            }
            var relationship = request.parent.getChildByUri(uri);

            if (relationship.data) {
                request.data = relationship.data;
            } else {
                relationship.data = {};
            }
            Manager = new Mediakron.ContentManager.Edit(request);
        }
        if (Manager) Mediakron.controller.gotoAdmin(Manager);
    },

    SettingsManagerRemove: function (parent, child) {
        Mediakron.classes.queue('settings-manage-organize');
        var item = Mediakron.getItemFromURI(parent);
        if (!item.canAddTo()) {
            Mediakron.Access.denied();
            return false;
        }
        this.Primary(parent);
        var childItem = Mediakron.getItemFromURI(child);

        var title = '';
        if (!childItem) {
            var relationship = item.getChildByUri(child);
            title = relationship.data.label;
        } else {
            title = childItem.get('title');
        }
        text = "Are you sure you want to remove " + title + "?";
        accept = function (item, child) {
            Mediakron.message({
                text: "Removing " + title,
                type: 'success',
                timeout: 4000,
                layout: 'bottom',
                confirm: false
            });
            var callback = function () {
                Mediakron.message({
                    text: title + " removed",
                    type: 'success',
                    timeout: 4000,
                    layout: 'bottom',
                    confirm: false
                });
                if (item.getNormalType() == 'timeline') {
                    $('.timeline-' + item.get('uri')).timeline('redraw');
                }
            };
            if (childItem) {
                item.remove(childItem, callback);
            } else {
                item.remove(child, callback);
            }
            Mediakron.router.navigate(item.get('uri'), {
                trigger: true
            });


        };
        reject = function (item, child) {
            Mediakron.message({
                text: "No changes made",
                type: 'success',
                timeout: 4000,
                layout: 'bottom',
                confirm: false,
                callback: function () {
                    Mediakron.router.navigate(item.get('uri'), {
                        trigger: true
                    });
                }
            });
        };
        Mediakron.message({
            text: text,
            type: 'warning',
            timeout: 0,
            layout: 'center',
            confirm: true,
            callback: function () {
                accept(item, child);
            },
            cancel: function () {
                reject(item, child);
            }
        });
    },

    SettingsEvent: function (timeline, event) {
        Mediakron.classes.queue('settings-manage-organize');
        var item = Mediakron.getItemFromURI(timeline);
        if (!item.canAddTo()) {
            Mediakron.Access.denied();
            return false;
        }
        var request = {
            timeline: item
        };
        var ManageEvent = false;
        if (event == 'create') {
            request.event = false;
            ManageEvent = new Mediakron.Admin.Event.Create(request);
        } else if (event == 'simple') {
            request.event = false;
            ManageEvent = new Mediakron.Admin.Event.Simple(request);
        } else if (event == 'existing') {
            request.event = false;
            ManageEvent = new Mediakron.Admin.Event.Browser(request);
        } else {
            request.event = Mediakron.getItemFromURI(timeline);
            ManageEvent = new Mediakron.Admin.Event.Edit(request);
        }
        if (ManageEvent) {
            Mediakron.controller.gotoAdmin(ManageEvent);
        }

    },
    SettingsManageContext: function (action, path) {
        Mediakron.classes.queue('settings-manage-' + action);
        var pathparts = path.split('/'),
            pathcount = pathparts.length,
            i = 0,
            first = pathcount - 2,
            second = pathcount - 1,
            uri = false,
            item = false;
        if (pathcount > 0) {
            if (first > -1) {
                uri = pathparts[first]; //should be the second to last item in the chain of being
                item = pathparts[second]; // should be the last item in the chain of being
            } else {
                uri = pathparts[second]; // should be the last item in the chain of being
            }
        } else {
            Mediakron.Events.ThrowError();
            return false;
        }
        var create = false;
        if (action == 'add') {
            create = item;
            item = false;
            delete pathparts[pathcount - 1];
        }
        this.Primary(pathparts);
        $('#settings-context').removeClass('closed').addClass('opened');
        var context = Mediakron.getItemFromURI(uri),
            Manage, controller, current = context.get('version');
        if (action == 'select') {
            if (!context.canAddTo()) {
                Mediakron.Access.denied();
                return false;
            }
            Manage = new Mediakron.Relationships.getSelect(context);
        } else if (action == 'edit') {
            if (!context.canEdit()) {
                Mediakron.Access.denied();
                return false;
            }
            Manage = new Mediakron.Relationships.getEdit(context);
        } else if (action == 'add') {
            if (!context.canAddTo()) {
                Mediakron.Access.denied();
                return false;
            }
            Manage = new Mediakron.Relationships.getAdd({
                'context': context,
                'create': create
            });
        } else if (action == 'organize') {
            if (!context.canAddTo()) {
                Mediakron.Access.denied();
                return false;
            }
            Manage = new Mediakron.Relationships.getManage(context);
        }
        Mediakron.setPollQuery(context, 'edit');
        context.fetch({
            data: {
                'poll': 'edit'
            },
            success: function (item) {
                if (current != item.get('version')) {
                    Mediakron.message({
                        'type': 'info',
                        'timeout': 1000,
                        'layout': 'right',
                        'confirm': false,
                        'text': 'Refreshing Item.'
                    });
                }
                Mediakron.manageController = new Mediakron.Relationships.controller({
                    'item': context,
                    'view': Manage,
                    'current': action
                });
                if (Manage) {
                    Mediakron.controller.gotoAdmin(Mediakron.manageController);
                }
                Manage.hideLoad();
            }
        });
    },
    SettingsContentAdd: function (type, arg) {
        var AddContent;
        if (!Mediakron.Access.check('can create content')) {
            Mediakron.Access.denied();
            return false;
        }
        if (!type) {
            AddContent = new Mediakron.Admin.AddPage(request);
            if (AddContent) {
                Mediakron.controller.gotoAdmin(AddContent);
            }
            return true;
        }
        var request = {
            type: type
        };
        if (type == 'story') {
            request.addStory = true;
            AddStory = new Mediakron.Pages.story(request);
            Mediakron.controller.gotoView(AddStory);
        } else {
            AddContent = new Mediakron.Admin.AddContentPage(request);
            if (AddContent) {
                Mediakron.controller.gotoAdmin(AddContent);
            }
        }
    },
    convertToType: function (type, uri) {
        var item = Mediakron.getItemFromURI(uri);
        if (item === undefined || !item) {
            Mediakron.Events.ThrowError();
            return false;
        }
        if (!item.canEdit()) {
            return false;
        }
        text = "Are you sure you want to convert " + item.get('title') + " into a " + type + "?  This operation is difficult to undo.";
        accept = function (item) {
            item.set('type', type);
            item.save();
            Mediakron.messages.message(item.get('title') + " Converted to a " + type);
            Mediakron.router.navigate("browse", {
                trigger: true
            });
            Mediakron.router.navigate(item.get('uri'), {
                trigger: true
            });
        };
        reject = function (request) {
            Mediakron.messages.message("No changes made");
        };
        Mediakron.message({
            text: text,
            type: 'warning',
            timeout: 0,
            layout: 'center',
            confirm: true,
            callback: function () {
                accept(item);
            },
            cancel: function () {
                reject(item);
            }
        });
    },
    SettingsContentEdit: function (path) {
        var pathparts = path.split('/'),
            pathcount = pathparts.length,
            i = 0,
            first = pathcount - 1,
            uri = false,
            item = false;
        if (pathcount > 0) {
            uri = pathparts[first]; //should be the second to last item in the chain of being
        } else {
            Mediakron.Events.ThrowError();
            return false;
        }
        item = Mediakron.getItemFromURI(uri);
        current = item.get('version');
        if (item === undefined) {
            Mediakron.Events.ThrowError();
            return false;
        }
        if (!item.canEdit()) {
            return false;
        }
        //        Mediakron.message({
        //            'type':        'info',
        //            'timeout':     1000,
        //            'layout':      'right',
        //            'confirm':     false,
        //            'text':        'Checking for changes.'
        //        });
        Mediakron.setPollQuery(item, 'edit');
        item.fetch({
            data: {
                'poll': 'edit'
            },
            success: function (item) {
                if (current != item.get('version')) {
                    Mediakron.message({
                        'type': 'warning',
                        'timeout': 1000,
                        'layout': 'center',
                        'confirm': false,
                        'text': 'Refreshing Item.'
                    });
                }
                var request = {
                    type: item.getNormalType(),
                    edit: true,
                    item: item
                };
                var AddContent = new Mediakron.Admin.AddContentPage(request);
                if (AddContent) {
                    Mediakron.controller.gotoAdmin(AddContent);
                }
                AddContent.hideLoad();
            }
        });
    },
    SettingsContentConfirm: function (action, uri) {
        var item = Mediakron.getItemFromURI(uri);
        if (item === undefined) {
            Mediakron.Events.ThrowError();
            return false;
        }
        var request = {
            item: item,
            action: action
        },
            accept, reject, text;
        switch (action) {
            case 'publish':
                text = "Are you sure you want to publish " + item.get('title') + "?";
                accept = function (request) {
                    item.set('published', 1);
                    item.save();
                    Mediakron.message({
                        text: request.item.get('title') + " Published",
                        type: 'success',
                        timeout: 4000,
                        layout: 'bottom',
                        confirm: false
                    });
                    Mediakron.goToBrowse();
                };
                reject = function (request) {
                    Mediakron.message({
                        text: "No changes made",
                        type: 'success',
                        timeout: 4000,
                        layout: 'bottom',
                        confirm: false
                    });
                    Mediakron.goToBrowse();
                };
                Mediakron.message({
                    text: text,
                    type: 'warning',
                    timeout: 0,
                    layout: 'center',
                    confirm: true,
                    callback: function () {
                        accept(request);
                    },
                    cancel: function () {
                        reject(request);
                    }
                });
                break;
            case 'unpublish':
                text = "Are you sure you want to unpublish " + item.get('title') + "?";
                accept = function (request) {
                    item.set('published', 0);
                    item.save();
                    Mediakron.message({
                        text: request.item.get('title') + " Unpublished",
                        type: 'success',
                        timeout: 4000,
                        layout: 'bottom',
                        confirm: false
                    });
                    Mediakron.goToBrowse();
                };
                reject = function (request) {
                    Mediakron.messages.message("No changes made");
                    Mediakron.goToBrowse();
                };
                Mediakron.message({
                    text: text,
                    type: 'warning',
                    timeout: 0,
                    layout: 'center',
                    confirm: true,
                    callback: function () {
                        accept(request);
                    },
                    cancel: function () {
                        reject(request);
                    }
                });
                break;
            case 'lock':
                text = "Are you sure you want to lock " + item.get('title') + "?";
                accept = function (request) {
                    item.set('locked', 1);
                    item.save();
                    Mediakron.message({
                        text: request.item.get('title') + " Locked",
                        type: 'success',
                        timeout: 4000,
                        layout: 'bottom',
                        confirm: false
                    });
                    Mediakron.goToBrowse();
                };
                reject = function (request) {
                    Mediakron.message({
                        text: "No changes made",
                        type: 'success',
                        timeout: 4000,
                        layout: 'bottom',
                        confirm: false
                    });
                    Mediakron.goToBrowse();
                };
                Mediakron.message({
                    text: text,
                    type: 'warning',
                    timeout: 0,
                    layout: 'center',
                    confirm: true,
                    callback: function () {
                        accept(request);
                    },
                    cancel: function () {
                        reject(request);
                    }
                });
                break;
            case 'unlock':
                text = "Are you sure you want to unlock " + item.get('title') + "?";
                accept = function (request) {
                    item.set('locked', 0);
                    item.save();
                    Mediakron.message({
                        text: request.item.get('title') + " Unlocked",
                        type: 'success',
                        timeout: 4000,
                        layout: 'bottom',
                        confirm: false
                    });
                    Mediakron.goToBrowse();
                };
                reject = function (request) {
                    Mediakron.message({
                        text: "No changes made",
                        type: 'success',
                        timeout: 4000,
                        layout: 'bottom',
                        confirm: false
                    });
                    Mediakron.goToBrowse();
                };
                Mediakron.message({
                    text: text,
                    type: 'warning',
                    timeout: 0,
                    layout: 'center',
                    confirm: true,
                    callback: function () {
                        accept(request);
                    },
                    cancel: function () {
                        reject(request);
                    }
                });
                break;
            case 'archive':
                text = "Are you sure you want to archive " + item.get('title') + "?";
                accept = function (request) {
                    item.set('archived', 1);
                    item.save();
                    Mediakron.items.remove({
                        id: item.id
                    });
                    Mediakron.message({
                        text: request.item.get('title') + " Archived",
                        type: 'success',
                        timeout: 4000,
                        layout: 'bottom',
                        confirm: false
                    });
                    Mediakron.goToBrowse();
                };
                reject = function (request) {
                    Mediakron.message({
                        text: "No changes made",
                        type: 'success',
                        timeout: 4000,
                        layout: 'bottom',
                        confirm: false
                    });
                    Mediakron.goToBrowse();
                };
                Mediakron.message({
                    text: text,
                    type: 'warning',
                    timeout: 0,
                    layout: 'center',
                    confirm: true,
                    callback: function () {
                        accept(request);
                    },
                    cancel: function () {
                        reject(request);
                    }
                });
                break;
            case 'restore':
                text = "Are you sure you want to restore " + item.get('title') + "?";
                accept = function (request) {
                    item.set('archived', 0);
                    item.save();
                    Mediakron.message({
                        text: request.item.get('title') + " Restored",
                        type: 'success',
                        timeout: 4000,
                        layout: 'bottom',
                        confirm: false
                    });
                    Mediakron.router.navigate('browse/archived', {
                        trigger: true
                    });
                };
                reject = function (request) {
                    Mediakron.message({
                        text: "No changes made",
                        type: 'success',
                        timeout: 4000,
                        layout: 'bottom',
                        confirm: false
                    });
                    Mediakron.router.navigate('browse/archived', {
                        trigger: true
                    });
                };
                Mediakron.message({
                    text: text,
                    type: 'warning',
                    timeout: 0,
                    layout: 'center',
                    confirm: true,
                    callback: function () {
                        accept(request);
                    },
                    cancel: function () {
                        reject(request);
                    }
                });
                break;
            case 'delete':
                text = "Are you sure you want to delete " + item.get('title') + "?";
                accept = function (request) {
                    var title = request.item.get('title');
                    item.destroy();
                    //                      Mediakron.messages.message(title+" Deleted"); 
                    Mediakron.message({
                        text: 'Item Deleted',
                        type: 'success',
                        timeout: 4000,
                        layout: 'bottom'
                    });
                    Mediakron.goToBrowse();
                };
                reject = function (request) {
                    Mediakron.message({
                        text: "No changes made",
                        type: 'success',
                        timeout: 4000,
                        layout: 'bottom',
                        confirm: false
                    });
                    Mediakron.goToBrowse();
                };
                Mediakron.message({
                    text: text,
                    type: 'warning',
                    timeout: 300,
                    layout: 'center',
                    confirm: true,
                    callback: function () {
                        accept(request);
                    },
                    cancel: function () {
                        reject(request);
                    }
                });
                break;
        }
    },
    SettingsGeneral: function () {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Events.AccessDenied();
            return false;
        }
        var AdminPage = new Mediakron.Admin.AdminPage();
        if (AdminPage) {
            Mediakron.controller.gotoAdmin(AdminPage);
        }
    },
    SettingsUsers: function () {
        if (!Mediakron.Access.check('can change site settings')) {
            Mediakron.Events.AccessDenied();
            return false;
        }
        var AdminPage = new Mediakron.Admin.UsersPage();
        if (AdminPage) {
            Mediakron.controller.gotoAdmin(AdminPage);
        }
    },
    Settings: function () {
        if (Mediakron.Access.isGuest()) {
            Mediakron.Events.AccessDenied();
            return false;
        }
        var AdminPage = new Mediakron.Admin.Landing();
        if (AdminPage) {
            Mediakron.controller.gotoAdmin(AdminPage);
        }
    },
    back: function () {
        if (this.routesHit > 1) {
            //more than one route hit -> user did not land to current page directly
            window.history.back();
        } else {
            //otherwise go to the home page. Use replaceState if available so
            //the navigation doesn't create an extra history entry
            this.navigate('/', {
                trigger: true,
                replace: true
            });
        }
    },
    refresh: function () {
        var current = Backbone.history.fragment;
        Backbone.history.fragment = false;
        Mediakron.Status.context = false;
        Mediakron.router.navigate(current, {
            trigger: true
        });
        Backbone.history.fragment = current;
    }
});

module.exports = router;