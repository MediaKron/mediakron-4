import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./comments-page.html";

var view = false;

export default class CommentsPage extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            tags: {},
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
        var view = this;
        this.comments =  new Mediakron.Collections.Comments({
            uri: false
        })
        view.render();
        return this;
    }

    /**
     * Render the view
     */
    render() {
        this.$el.html(this.template());
        return this;
    }

    get events() {
        return {
            'click a': Mediakron.linkHandle
        }
    }

    afterrender() {
        var row, view = this;
        $('.commentlist').html("Loading ...");
        this.comments.fetch({
            'success' : function (data) {
                view.comments.sort();
                view.comments.each(function (comment) {
                    row = new Mediakron.Pages.commentRow(comment);
                });
            }
        });
    }
}

// @REVIEW then, delete. Original view below

// Mediakron.Pages.comments = Mediakron.Extensions.View.extend({
//     template: JST['pages.comments'],
//     tags: {},
//     initialize: function () {
//         var view = this;
//         this.comments =  new Mediakron.Collections.Comments({
//             uri: false
//         })
//         view.render();
//         return this;
//     },

//     render: function () {
//         this.$el.html(this.template());
//         return this;
//     },
//     afterRender: function () {
//         var row, view = this;
//         $('.commentlist').html("Loading ...");
//         this.comments.fetch({
//             'success' : function (data) {
//                 view.comments.sort();
//                 view.comments.each(function (comment) {
//                     row = new Mediakron.Pages.commentRow(comment);
//                 });
//             }
//         });
//     },

//     events: {
//         'click a': Mediakron.linkHandle
//     }

// });