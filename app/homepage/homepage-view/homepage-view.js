import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./homepage-templates/basic.html";

var view = false;

export default class Homepage extends MediakronView {
    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'item-page',
            data: false,
            item: false
        })
        this.data = Mediakron.Settings.HomePage;
        var view = this;
        if (this.data.layout) {
            if (JST['pages.welcome.' + this.data.layout]) {
                this.template = JST['pages.welcome.' + this.data.layout];
            }

        }
        this.item = false;
        if (request.item) {
            this.item = request.item;
        }

        // Cast the html template 
        get template() { 
        return _.template(tpl); }

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
            this.$el.html(this.template(this.data));
            return this;
        }

        afterrender() {
        if (this.item) {
            var view = this.item.getView();
            if (view) {
                view.setElement('#homepage-content');
                $('.home-template--nobanner').addClass('home-content-active');
                view.render();
            }
        }

        get events() {
            return {
                'click a': Mediakron.linkHandle
            }
        }
    }
}

// @REVIEW
// Mediakron.Pages.home = Mediakron.Extensions.View.extend({
//     template: JST['pages.welcome.full'],
//     className: 'item-page',
//     data: false,
//     item: false,
//     initialize: function (request) {
//         this.data = Mediakron.Settings.HomePage;
//         var view = this;
//         if (this.data.layout) {
//             if (JST['pages.welcome.' + this.data.layout]) {
//                 this.template = JST['pages.welcome.' + this.data.layout];
//             }

//         }
//         this.item = false;
//         if (request.item) {
//             this.item = request.item;
//         }

//     },
//     events: {
//         'click a': Mediakron.linkHandle
//     },
//     render: function () {
//         this.$el.html(this.template(this.data));
//         return this;
//     },
//     afterRender: function () {
//         if (this.item) {
//             var view = this.item.getView();
//             if (view) {
//                 view.setElement('#homepage-content');
//                 $('.home-template--nobanner').addClass('home-content-active');
//                 view.render();
//             }
//         }
//     }
// });