import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./secondary-menu.html";

var view = false;

export default class SecondaryMenu extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            items: [],
            tags: [],
            fullscreen: false,
        })
        this.data = {};
            this.tags = Mediakron.items.where({ type: 'tag' });
            var view = this;
            Mediakron.App.Events.on('update_content', function () {
                view.render();
            });
            Mediakron.App.Events.on('load:complete', function () {
                view.render();
            });
            Mediakron.router.on("route", function (route, params) {
                view.closeAllModels();
            });
            Mediakron.App.Events.on("context:goto", function (eventName) {
                $(".search-pane").removeClass("opened"); /* close search overlay */
                $('.toggle-search').focus(); /* return focus to search toggle button */
            });
            $(document).on('fullscreenchange', function () {
                $('body').toggleClass('fullscreen');
            });
    }

    // Cast the html template 
    get template() { 
        return _.template(tpl); 
    }

    /**
     * 
     * @param {object} data 
     */
    initialize(data) {
        return this;
    }

    /**
     * Render the view
     */
    render() {
        this.$el.hide();
        this.tags = Mediakron.items.where({ type: 'tag' });
        this.$el.html(this.template({
            secondary: Mediakron.Settings.Navigation.secondary,
            tags: this.tags
        }));

        this.$el.show();

        var titles = Mediakron.items.map(function (item) { return item.get('title'); });
        return this;
    }

    get events() {
        return {
            'click #configure-site-menu': 'toggleConfig',
            'click #dev-site-menu': 'toggleDev',
            'keyup #search-field': 'doSearch',
            'submit #search form': 'doSearch',
            'click #full-screen': 'fullScreen',
            'click .open-modal': 'openModal',
            'click .close-modal': 'closeModal',
            'click .menu-bg': 'closeModalBg',
            'click .toggle-search': 'revealSearch',
            'click a': Mediakron.linkHandle
        }
    }

    /**
     * Description
     * @param {object} something 
     */
    newName(something) {
       
    }

    /**
     * Close All Models
     * @param {object}
     */
    closeAllModels() {
        $('.secondary-menu .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.menu-bg').removeClass('open');
    }


    /**
     * Fullscreen
     * @param {object} e 
     */
    fullScreen(e) {
        var element = document.getElementById("mediakron"),
            $el = $(e.currentTarget);
        if (this.fullscreen) {
            Mediakron.exitFullScreen();
            $el.html('<span class="mk-icon mk-fullscreen-open"></span>');
            this.fullscreen = false;
        } else {
            Mediakron.goFullScreen(element);
            $el.html('<span class="mk-icon mk-fullscreen-close"></span>');
            this.fullscreen = true;
        }
    }

    /**
     * Toggle Config
     * @param {object} 
     */
    toggleConfig() {
        $('#configure-menu').slideToggle('fast');
    }
    
    /**
     * Search
     * @param {object} e 
     */
    doSearch(some) {
        e.preventDefault();
        var searchFor = $(e.currentTarget).val();
        if (e.keyCode == '13') {
            if (searchFor.length > 1) {
                Mediakron.router.navigate('search/' + searchFor, { trigger: true });
            }
        }
        return false;
    }

    /**
     * Description
     * @param {object} something 
     */
    newName(something) {
       
    }

    openModal: function (e) {
        e.preventDefault();
        this.closeAllModels();
        $(e.currentTarget).next().attr({ 'data-visually-hidden': 'false' });
        $('.menu-bg').addClass('open');
        return false;
    },

    /**
     * Close Modal
     * @param {object} e 
     */
    closeModal(e) {
        e.preventDefault();
        $(e.currentTarget).parent().attr({ 'data-visually-hidden': 'true' });
        $('.menu-bg').removeClass('open');
        return false;
    }

    /**
     * Close Modal Background
     * @param {object} e 
     */
    closeModalBg(e) {
        e.preventDefault();
        $('#navbar .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.menu-bg').removeClass('open');
        return false;
    }
    
    /**
     * Toggle Dev Menu
     * @param {object}
     */
    toggleDev() {
        $('#dev-menu').slideToggle('fast');
    }

    /**
     * Open Search
     * @param {object}  
     */
    revealSearch() {
        $(".search-pane").toggleClass("opened");
        $("#search-field").focus(); /* give the search box focus  */
    }
}

// @REVIEW then, delete. Original view below

// Mediakron.MenuRight = Backbone.View.extend({
//     template: JST['navigation.main.right'],
//     el: '#nav-secondary',
//     items: [],
//     tags: [],
//     fullscreen: false,
//     initialize: function () {
//         this.tags = Mediakron.items.where({ type: 'tag' });
//         var view = this;
//         Mediakron.App.Events.on('update_content', function () {
//             view.render();
//         });
//         Mediakron.App.Events.on('load:complete', function () {
//             view.render();
//         });
//         Mediakron.router.on("route", function (route, params) {
//             view.closeAllModels();
//         });
//         Mediakron.App.Events.on("context:goto", function (eventName) {
//             $(".search-pane").removeClass("opened"); /* close search overlay */
//             $('.toggle-search').focus(); /* return focus to search toggle button */
//         });
//         $(document).on('fullscreenchange', function () {
//             $('body').toggleClass('fullscreen');
//         });
//     },
//     render: function () {
//         this.$el.hide();
//         this.tags = Mediakron.items.where({ type: 'tag' });
//         this.$el.html(this.template({
//             secondary: Mediakron.Settings.Navigation.secondary,
//             tags: this.tags
//         }));

//         this.$el.show();

//         var titles = Mediakron.items.map(function (item) { return item.get('title'); });
//         return this;
//     },
//     afterRender: function () { // make sure you return this at the end of an afterRender function
//     },
//     closeAllModels: function () {
//         $('.secondary-menu .dropdown-container').attr({ 'data-visually-hidden': 'true' });
//         $('.menu-bg').removeClass('open');
//     },
//     events: {
//         'click #configure-site-menu': 'toggleConfig',
//         'click #dev-site-menu': 'toggleDev',
//         'keyup #search-field': 'doSearch',
//         'submit #search form': 'doSearch',
//         'click #full-screen': 'fullScreen',
//         'click .open-modal': 'openModal',
//         'click .close-modal': 'closeModal',
//         'click .menu-bg': 'closeModalBg',
//         'click .toggle-search': 'revealSearch',
//         'click a': Mediakron.linkHandle
//     },
//     fullScreen: function (e) {
//         var element = document.getElementById("mediakron"),
//             $el = $(e.currentTarget);
//         if (this.fullscreen) {
//             Mediakron.exitFullScreen();
//             $el.html('<span class="mk-icon mk-fullscreen-open"></span>');
//             this.fullscreen = false;
//         } else {
//             Mediakron.goFullScreen(element);
//             $el.html('<span class="mk-icon mk-fullscreen-close"></span>');
//             this.fullscreen = true;
//         }
//     },
//     toggleConfig: function () {
//         $('#configure-menu').slideToggle('fast');
//     },
//     doSearch: function (e) {
//         e.preventDefault();
//         var searchFor = $(e.currentTarget).val();
//         if (e.keyCode == '13') {
//             if (searchFor.length > 1) {
//                 Mediakron.router.navigate('search/' + searchFor, { trigger: true });
//             }
//         }
//         return false;
//     },
//     openModal: function (e) {
//         e.preventDefault();
//         this.closeAllModels();
//         $(e.currentTarget).next().attr({ 'data-visually-hidden': 'false' });
//         $('.menu-bg').addClass('open');
//         return false;
//     },
//     closeModal: function (e) {
//         e.preventDefault();
//         $(e.currentTarget).parent().attr({ 'data-visually-hidden': 'true' });
//         $('.menu-bg').removeClass('open');
//         return false;
//     },
//     closeModalBg: function (e) {
//         e.preventDefault();
//         $('#navbar .dropdown-container').attr({ 'data-visually-hidden': 'true' });
//         $('.menu-bg').removeClass('open');
//         return false;
//     },
//     toggleDev: function () {
//         $('#dev-menu').slideToggle('fast');
//     },
//     revealSearch: function () {
//         $(".search-pane").toggleClass("opened");
//         $("#search-field").focus(); /* give the search box focus  */
//     }
// });