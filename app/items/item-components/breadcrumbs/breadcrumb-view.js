import MediakronView from '~/core-js/extensions/views';
import _ from "lodash";
import tpl  from "./items/item-components/breadcrumbs/breadcrumbs.html";

var view = false;

export default class breadcrumbs extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'classname',
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
            'event target': 'callback'
        }
    }

    /**
     * Description
     * @param {object} something 
     */
    setBreadcrumb(items) {
        this.items = items;
    }

    /**
     * Description
     * @param {object} something 
     */
    getBreadcrumb() {
        return this.template({ items: this.items });
    }

}

// @REVIEW then, delete. Original view below
// var template = require('../../templates/navigation/breadcrumb.html')
// module.exports = Backbone.View.extend({
//     template: template,
//     el: '#breadcrumb',
//     items: [],
//     initialize: function () {
//         this.$el.hide();
//         return this;
//     },
//     setBreadcrumb: function (items) {
//         this.items = items;
//     },
//     getBreadcrumb: function () {
//         return this.template({ items: this.items });
//     }
// });