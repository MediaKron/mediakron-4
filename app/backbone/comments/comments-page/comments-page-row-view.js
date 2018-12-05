import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./comments-page-row.html";

var view = false;

export default class CommentsPageRow extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            el: '.commentlist',
        })
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
            'click a': Mediakron.linkHandle
        }
    }
}

// @REVIEW then, delete. Original view below

// Mediakron.Pages.commentRow = Mediakron.Extensions.View.extend({
//     template: JST['pages.comment.row'],
//     el: '.commentlist',
//     initialize: function (model) {
//         this.model = model;
//         this.render();
//         return this;
//     },

//     render: function () {
//         var content = this.model.toJSON();
//         content.model = this.model;
//         this.$el.append(this.template(content));
//         return this;
//     },

//     events: {
//         'click a': Mediakron.linkHandle
//     }
// });