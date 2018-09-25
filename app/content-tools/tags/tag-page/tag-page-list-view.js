import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./content-tools/tags/tag-page/tag.html";

var view = false;

export default class TagList extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            el: '.taglist',
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
        this.render();
        return this;
    }

    /**
     * Render the view
     */
    render() {
        var content = this.model.toJSON();
        content.model = this.model;
        this.$el.append(this.template(content));
        return this;
    }

    get events() {
        return {
            'event target': 'callback'
        }
    }

}

// @REVIEW then, delete. Original view below

// Mediakron.Pages.tagRow = Mediakron.Extensions.View.extend({
//     template: JST['pages.tag.tag'],
//     el: '.taglist',
//     initialize: function(model){
//         this.model = model;
//         this.render();
//         return this;
//     },
    
//     render: function(){
//         var content = this.model.toJSON();
//         content.model = this.model;
//         this.$el.append(this.template(content));
//         return this;
//     },
    
//     events: {
//         'click a':                          Mediakron.linkHandle
//     }

// });