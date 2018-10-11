import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./default.html";

var view = false;

export default class MapLayer extends MediakronView {

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
        this.model = model;
        return this;
    }

    /**
     * Render the view
     */
    render() {
        if (this.layout) {
            this.template = JST['pages.layer.' + this.layout];
        } else if (this.model.get('template')) {
            this.template = JST['pages.layer.' + this.model.get('template')];
        }
        var content = this.model.toJSON();
        content.model = this.model;
        this.$el.html(this.template(content));
        return this;
    }

    get events() {
        return {
            'click a': Mediakron.linkHandle
        }
    }

    afterrender() {
        this.model.getSidebar(this.$el);
    }

    /**
     * Description
     * @param {object} something 
     */
    gotoItem:{}
       
    }

}

// @REVIEW then, delete. Original view below

// Mediakron.Pages.layer = Mediakron.Extensions.View.extend({
//     template: JST['pages.layer.default'],
//     initialize: function(model) {
//         this.model = model;
//         return this;
//     },
//     render: function() {
//         if (this.layout) {
//             this.template = JST['pages.layer.' + this.layout];
//         } else if (this.model.get('template')) {
//             this.template = JST['pages.layer.' + this.model.get('template')];
//         }
//         var content = this.model.toJSON();
//         content.model = this.model;
//         this.$el.html(this.template(content));
//         return this;
//     },
//     afterRender: function() {
//         this.model.getSidebar(this.$el);
//     },
//     gotoItem: function() {},
//     events: {
//         'click a': Mediakron.linkHandle
//     }
// });