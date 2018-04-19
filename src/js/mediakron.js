/**
 * 
 */
module.exports = { 
    // check authentication state
    auth: function() {
        Mediakron.user = new Mediakron.Models.User();
        Mediakron.user.fetch({
            data: {
                token: Mediakron.Settings.token
            },
            processData: true,
            success: function(model, response) {
                if (model.get('role') == 'manager' || model.get('role') == 'instructor' || model.get('role') == 'administrator' || model.get('role') == 'ia') {
                    Mediakron.classes.setStatic('can-administer');
                } else {
                    Mediakron.classes.setStatic('not-administer');
                }
                if (Mediakron.node) {
                    //require(["src/io"], function(plugin) {}); TODO: This is depricated and should be removed
                }
                Mediakron.user.lastVisit();
                $(window).unload(function() {
                    $.ajax({
                        type: 'POST',
                        url: Mediakron.Data.stats,
                        async: false,
                        data: {
                            'views': Mediakron.Status.views
                        }
                    });
                });
                Mediakron.App.init();
            },
            error: function(model, response) {
                Mediakron.AuthResponse = response.responseJSON;
                if (Mediakron.Settings.public) {
                    Mediakron.user = new Mediakron.Models.User();
                    Mediakron.user.guest();
                    Mediakron.App.init();
                } else {
                    var login = new Mediakron.Login(response.responseJSON);
                    Mediakron.controller.gotoView(login);
                }
            }
        });
    },
        // set up the intial classes
    load: function() {
        Mediakron.App.InitializeAppearance();
        Mediakron.menu.render();
        Mediakron.configure.render();
    },
    InitializeAppearance: function() {
        if (Mediakron.Settings.Appearance.navigation) Mediakron.classes.swap('default-nav menu-vertical menu-horizontal', Mediakron.Settings.Appearance.navigation);
        $('#site-name a').text(Mediakron.Settings.name);
        $('#branding a').click(Mediakron.linkHandle);
        $('#copyright').text(Mediakron.Settings.copyright); /* Sidebar menu - mobile */
        $('.mobile-nav-button').click(function() {
            $('#navbar').toggleClass('is-visible');
            $('.fade-screen').toggleClass('is-visible');
            //            $('#main-container').toggleClass('content-push-mobile');
        }); /* Sidebar menu - large screen  */
        $('.fade-screen, #navbar.is-visible .close-button-mobile').click(function() {
            $('#navbar').removeClass('is-visible');
            $('.fade-screen').removeClass('is-visible');
            //            $('#main-container').removeClass('content-push-mobile');
        }); /* Full-screen view    */
        $('.fullscreen-nav-toggle').click(function() {
            $('#header').toggleClass('is-visible');
        }); /* Sidebar menu - large screen  */
        $('.fade-screen').click(function() {
            $('.fade-screen').removeClass('is-visible');
            $('#main-container').removeClass('content-push');
        });
        $('.toggle-search').click(function() {
            $(".search-pane").removeClass('closed').addClass("opened"); /* close search overlay */
            $("#search-field").focus(); /* give the search box focus  */
        });
        $('#search .close-button').click(function() {
            $(".search-pane").removeClass("opened").addClass('closed'); /* close search overlay */
            $('.toggle-search').focus(); /* return focus to search toggle button */
        });
        // Install override skin
        if (Mediakron.skins[Mediakron.Settings.Appearance.skin]) {
            $('#skin').attr('href', Mediakron.Settings.cssURL + "skins/" + Mediakron.Settings.Appearance.skin);
        }
        // ==== Custom appearance styles ==== 
        var dynamicStyles = '';
        var banner = Mediakron.Settings.Appearance.colors.banner;
        var banner_rgb = convertHex(banner, 100);
        var banner_transparent = convertHex(banner, 0);
        if (Mediakron.Settings.Appearance.colors.banner) {
            // Background color set in appearance settings
            dynamicStyles = '.primary-background, #mediakron #login-submit, #login-banner, #mediakron #header, #mediakron .sticky-filters #content-filters,  #messages .alert-success, #mediakron .btn-primary, #mediakron .btn-primary a, #mediakron .btn-success, #content-filter li.search-choice, #content-user .chosen-container-single .chosen-single, .settings-pane .overlay header, .overlay header.admin-style-header, .search-pane.opened .overlay header, .site-loader#progress-bar, .edit-story .wysiwyg, .edit-story .wysiwyg-headers-inner, cite.annotation.highlight, cite.annotation.highlight, cite.annotation.contains-sup sup:hover, sup.contains-cite:hover, cite.annotation.highlight, cite.annotation.contains-sup.highlight sup, sup.contains-cite.highlight, .home-menus--grid .homepage-menu-title, #navbar .dropdown-container li.dropdown-title, .home-image--half .home-template__info, .home-image--full .home-template__info,  .timeline-category .add-category, .folder-navigation .mk-icon, .folder-navigation a:hover { background-color:' + Mediakron.Settings.Appearance.colors.banner + '; }';

            // Linear gradient background for site-loader
            //            dynamicStyles = dynamicStyles + '.site-loader .progress { background: linear-gradient(to left, ' + Mediakron.Settings.Appearance.colors.banner + ', ' + Mediakron.Settings.Appearance.colors.banner + ' 20%, rgba(255,255,255,0));}';
            //            
            // Linear gradient background fade left
            dynamicStyles = dynamicStyles + '.menu-horizontal #nav-main { background: linear-gradient(to left, ' + banner_rgb + ', ' + banner_rgb + ' 90%, ' + banner_transparent + ');}';
            dynamicStyles = dynamicStyles + '.menu-horizontal #nav-main { background: -webkit-linear-gradient(right, ' + banner_rgb + ' 0%,' + banner_rgb + ' 85%,' + banner_transparent + ' 100%);}'; /* Chrome10-25,Safari5.1-6 */
            // Linear gradient background fade right  
            dynamicStyles = dynamicStyles + 'h1.page-header { background: linear-gradient(to right, ' + banner_rgb + ', ' + banner_rgb + ' 90%, ' + banner_transparent + ');}';
            dynamicStyles = dynamicStyles + 'h1.page-header { background: -webkit-linear-gradient(left, ' + banner_rgb + ' 0%,' + banner_rgb + ' 85%,' + banner_transparent + ' 100%);}'; /* Chrome10-25,Safari5.1-6 */

            // Provide contrasting background color
            dynamicStyles = dynamicStyles + '.settings-pane .overlay .page-options .mk-icon.mk-close::before, .settings-pane .overlay .page-options .mk-icon.mk-close::after, .search-pane .overlay .page-options .mk-icon.mk-close::before, .search-pane .overlay .page-options .mk-icon.mk-close::after, .overlay header.admin-style-header .page-options .mk-icon.mk-close::before, .overlay header.admin-style-header .page-options .mk-icon.mk-close::after, .add-content .edit-story .story-edit-page-options .page-options .mk-icon.mk-close::before, .add-content .edit-story .story-edit-page-options .page-options .mk-icon.mk-close::after, .editing-enabled .story-template .story-edit-page-options .page-options .mk-icon.mk-close::before, .editing-enabled .story-template .story-edit-page-options .page-options .mk-icon.mk-close::after, #navbar .close-modal .mk-icon.mk-close::after, #navbar .close-modal .mk-icon.mk-close::before, .edit-story .wlink-tool button, .folder-navigation a:hover .mk-icon { background-color:' + getContrastColor(Mediakron.Settings.Appearance.colors.banner) + '; }';

            // Provide contrasting font color
            dynamicStyles = dynamicStyles + '#mediakron .settings-pane .overlay header h2, .settings-pane .overlay header h1, #mediakron .settings-pane .overlay h2 .mk-icon, .overlay .page-options a, .overlay .page-options button, .add-story-header .page-options button.close-button, .overlay .page-options .option-help a, .add-story-header .page-options a, .add-story-header .page-options button, .search-pane.opened .overlay header h2,  .overlay header.admin-style-header h2, .overlay header.admin-style-header .mk-icon, .search-pane.opened .overlay header .mk-search, .edit-story .wysiwyg-button, .editing-enabled .story-template .story-edit-page-options .page-options .option-help a .mk-icon,  .timeline-category .add-category, .folder-previous .mk-arrow-left, .folder-navigation .mk-icon, .folder-navigation a:hover .mk-icon { color:' + getContrastColor(Mediakron.Settings.Appearance.colors.banner) + '; }';

            // border color same as background
            dynamicStyles = dynamicStyles + '{ border-color:' + Mediakron.Settings.Appearance.colors.banner + '; }';

            // font color same as background
            dynamicStyles = dynamicStyles + '.edit-story .wlink-tool button, #mediakron #navbar #user .mk-user.level-1, .folder-navigation a:hover .mk-icon { color:' + Mediakron.Settings.Appearance.colors.banner + '; }';

            // Provide contrast color for borders
            dynamicStyles = dynamicStyles + '#navbar .main-menu .add-menu-navbar.no-menus a, .site-loader#progress-bar { border-color: ' + getContrastColor(Mediakron.Settings.Appearance.colors.banner) + '; }';

            // use color if it's dark enough on white background; otherwise, use black
            dynamicStyles = dynamicStyles + 'cite.annotation.highlight, cite.annotation.highlight, cite.annotation.contains-sup sup:hover, sup.contains-cite:hover, cite.annotation.highlight, cite.annotation.contains-sup.highlight sup, sup.contains-cite.highlight { background:' + getContrastOnWhite(Mediakron.Settings.Appearance.colors.banner) + '; }';

            dynamicStyles = dynamicStyles + '.annotation-popup .mk-icon { color:' + getContrastOnWhite(Mediakron.Settings.Appearance.colors.banner) + '; }';

            dynamicStyles = dynamicStyles + '.annotation-popup, .annotation-item:hover, .annotation-item.highlight  { border-color: ' + getContrastOnWhite(Mediakron.Settings.Appearance.colors.banner) + '; }';

            dynamicStyles = dynamicStyles + 'cite.annotation.highlight, cite.annotation.highlight, cite.annotation.contains-sup sup:hover, sup.contains-cite:hover, cite.annotation.highlight, cite.annotation.contains-sup.highlight sup, sup.contains-cite.highlight {' + getContrastOnWhiteColor(Mediakron.Settings.Appearance.colors.banner) + ' }';


            // Provide tinted color for borders
            dynamicStyles = dynamicStyles + ' { border-color: ' + getTint(Mediakron.Settings.Appearance.colors.banner) + '; }';

            // Provide tinted color for backgrounds
            dynamicStyles = dynamicStyles + '.site-loader .progress  { background-color: ' + getTint(Mediakron.Settings.Appearance.colors.banner) + '; }';

            // Provide tinted color for color
            dynamicStyles = dynamicStyles + '{ color: ' + getTint(Mediakron.Settings.Appearance.colors.banner) + '; }';

            // Provide underline color based on link color
            dynamicStyles = dynamicStyles + '#mediakron .contrast-tint { border-bottom: 1px solid ' + Mediakron.Settings.Appearance.colors.bannerlink + '; }';
        }
        var bannerlink = Mediakron.Settings.Appearance.colors.bannerlink;
        banner_rgb = convertHex(banner, 100);
        if (Mediakron.Settings.Appearance.colors.bannerlink) {
            // Banner link color from appearance settings

            dynamicStyles = dynamicStyles + '.secondary-font, #mediakron #login-submit, #mediakron #header a, #mediakron #header .mk-icon, #mediakron #header button, .sticky-filters#content-manage h3, .add-menu-navbar a, .add-menu-navbar .mk-icon, #messages .alert-success, #mediakron .btn-primary, #mediakron .btn-success, #login-banner a, .loading-message,  #content-filter li.search-choice,  #content-user .chosen-container-single .chosen-single span, .site-loader #progress-text, .home-menus--grid .homepage-menu-title, #navbar .dropdown-container li.dropdown-title, .home-image--full h1, .home-image--half h1, .home-image--full .subtitle, .home-image--half .subtitle  { color:' + Mediakron.Settings.Appearance.colors.bannerlink + '; }';

            dynamicStyles = dynamicStyles + '#navbar #user .mk-user.level-1, .secondary-menu li.level-1:hover { background:' + Mediakron.Settings.Appearance.colors.bannerlink + '; }';

        }
        if (dynamicStyles) {
            // Apply custom styles to page
            $('<style type="text/css">' + dynamicStyles + '</style>').appendTo("head");
        }
        if (Mediakron.Settings.Appearance.font) {
            // Apply custom font from appearance settings
            if (Mediakron.Settings.Appearance.fonts[Mediakron.Settings.Appearance.font]) {
            
                var sitefont = Mediakron.Settings.Appearance.font, 
                    googlefont = false, bodyfont;
                if (sitefont == "Roboto" || sitefont == "Roboto (san serif)") { googlefont = 'Roboto:400,700'; bodyfont = 'font-roboto';  }
                if (sitefont == "Merriweather" || sitefont == "Merriweather (serif)") { googlefont = 'Merriweather'; bodyfont = 'font-merriweather'; }
                // if (sitefont == "Open-Sans") { googlefont = 'Open+Sans:400,700'; bodyfont = 'font-open-sans'; }
                // if (sitefont == "Nunito") { googlefont = 'Nunito|Open+Sans'; bodyfont = 'font-nunito'; }
                // if (sitefont == "Roboto-Slab") { googlefont = 'Roboto+Slab|Roboto'; bodyfont = 'font-roboto-slab'; }
                // if (sitefont == "Alegreya") { googlefont = 'Alegreya:700|Roboto'; bodyfont = 'font-alegreya'; }
                // if (sitefont == "Amatic-Josefin-Sans") { googlefont = 'Josefin+Sans|Amatic+SC:700'; bodyfont = 'font-amatic-josefin-sans'; }
                // if (sitefont == "Playfair-Display") { googlefont = 'Playfair+Display:900|Source+Sans+Pro'; bodyfont = 'font-playfair'; }
                // if (sitefont == "Goudy-Book-Letter") { googlefont = 'Goudy+Bookletter+1911|Average+Sans'; bodyfont = 'font-goudy'; }
                if (googlefont) {
                    $('head').append('<link href="https://fonts.googleapis.com/css?family=' + googlefont + '" rel="stylesheet">');
                    $('body').addClass('' + bodyfont + '');
                }else{
                    $('body').css('font-family', Mediakron.Settings.Appearance.fonts[Mediakron.Settings.Appearance.font]);
                }
            }
        }
        // Add logo from appearance settings
        $('#site-logo').html(Mediakron.Image.logo('medium'));
    },
    // event pub sub for the app.
    Events: false,
    // run the application
    run: function() {
        Mediakron.createUrlMap();
        Mediakron.router = new Mediakron.Router();
        Mediakron.menu = new Mediakron.MainMenu();

        Mediakron.configure = new Mediakron.MenuRight();
        //Mediakron.changeTracker = new Mediakron.UpdatedContent();
        Mediakron.App.load();


        Mediakron.router.routesHit = 0;
        Backbone.listenTo(Mediakron.router, "route", function(route, params) {
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
        }
    },
    // initialize and execute primary applicaiton
    init: function() {
        var execute = this.run;
        Mediakron.Search.view = new Mediakron.Search.initial();
        Mediakron.items = new Mediakron.Collections.Items();
        if (!Mediakron.users) {
            Mediakron.users = false;
            if (Mediakron.Access.check('can access site')) {
                Mediakron.users = new Mediakron.Collections.Users();
                Mediakron.users.fetch();
                Mediakron.groups = new Mediakron.Collections.Groups();
                Mediakron.groups.fetch();
            }
        }
        Mediakron.items.reset(Mediakron.preload);
        execute();
        if (!Mediakron.Status.lti) {
            $('#header').show();
        }
        Mediakron.items.fetch({
            data: {
                token: Mediakron.Settings.token
            },
            remove: false,
            processData: true,
            xhr: Mediakron.Events.xhrProgress,
            success: function(collection, data) {
                Mediakron.Status.lastPoll = new Date().getTime() / 1000;
                Mediakron.Status.online = true;
                Mediakron.createUrlMap();
                Mediakron.menu.render();
                Mediakron.loading = false;
                if (Mediakron.Access.check('can edit own content')) {
                    var poll = new Mediakron.Admin.Poll();
                    poll.render();
                }
                Mediakron.App.Events.trigger('load:complete');
                //                Mediakron.Accessibility.boot();
            }
        });
    },
    DoIfLoaded: function(callback) {
        if (!Mediakron.loading) {
            callback();
        } else {
            Mediakron.App.Events.on('load:complete', callback);
        }
    }
};
