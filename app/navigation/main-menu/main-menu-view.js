import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./main-menu.html";

var view = false;

export default class MainMenu extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'MainMenu',
            data: false,
            item: false,
        })
        this.data = {};
            if (!this.changes) {
                this.changes = Mediakron.Settings;
            }
        view = this;
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
        this.$el.html(this.template(this.data)).addClass(this.className);
        return this;
    }

    get events() {
        return {
            'click .js-menu-trigger': 'toggleMenu',
            'click .js-menu-screen': 'toggleMenu',
            'click .main-menu-sidebar .close-button': 'closeMenu',
            'click a': Mediakron.linkHandle,
            'click .main-menu-sidebar.is-visible a': 'toggleMenu'
        }
    }

    afterrender() {

    }

    toggleMenu(){
        $('.js-menu,.js-menu-screen', this.parent).toggleClass('is-visible');
        //         $('#main-container').toggleClass('content-push');
    }

    closeMenu(){
        $('.js-menu,.js-menu-screen', this.parent).removeClass('is-visible');
        //         $('#main-container').toggleClass('content-push');
    }

}

// @REVIEW then, delete. Original view below

// import _ from "lodash";
// var template = require("./main-menu.html")
//
//
// export default class MainMenu extends Backbone.View {
//     /**
//      * The constructor for the backbone class
//      * @param {object} options
//      */
//     constructor(options){
//         // execute the parent options first
//         super(options);
//         //this.template = template;
//         this.el = '#nav-main';
//         this.items = [];
//         this.tags = [];
//         this.items = [];
//     }
//
//     // Cast the html template
//     get template() { return _.template(template); }
//
//     /**
//      * This should initialize the view
//      */
//     initialize(){
//         this.topics = Mediakron.topics;
//         /*Mediakron.App.Events.on("context:goto", function (event) {
//             var title = '';
//             if (event.view.model) {
//                 title = event.view.model.get('title') + ' | ';
//
//             }
//             title = title + Mediakron.Settings.name;
//             $('title').text(title);
//         });*/
//         var view = this;
//         //Mediakron.App.Events.on('update_content', function () {
//         view.render();
//         //});
//     }
//
//     render(){
//         var items = Mediakron.Settings.Navigation.primary,
//             length = items.length,
//             i = 0,
//             item;
//         this.items = [];
//         for (i; i < length; i++) {
//             if (items[i] === null) { continue; }
//             if (typeof (items[i]) == 'object') {
//                 if (items[i].type == 'external') {
//                     this.items.push(items[i]);
//                 }
//             } else if (typeof (items[i]) == 'string') {
//                 this.items.push(Mediakron.getItemFromURI(items[i]));
//             }
//         }
//         this.$el.hide();
//         this.$el.html(this.template({
//             topics: this.topics,
//             'items': this.items,
//             'tags': this.tags,
//             secondary: Mediakron.Settings.Navigation.secondary
//         }));
//         this.$el.show();
//
//         return this;
//     }
//
//     get events() {
//         return {
//             'click .js-menu-trigger': 'toggleMenu',
//             'click .js-menu-screen': 'toggleMenu',
//             'click .main-menu-sidebar .close-button': 'closeMenu',
//             'click a': Mediakron.linkHandle,
//             'click .main-menu-sidebar.is-visible a': 'toggleMenu'
//         }
//     }
//
//     toggleMenu(){
//         $('.js-menu,.js-menu-screen', this.parent).toggleClass('is-visible');
//         //         $('#main-container').toggleClass('content-push');
//     }
//
//     closeMenu(){
//         $('.js-menu,.js-menu-screen', this.parent).removeClass('is-visible');
//         //         $('#main-container').toggleClass('content-push');
//     }
//
// }
