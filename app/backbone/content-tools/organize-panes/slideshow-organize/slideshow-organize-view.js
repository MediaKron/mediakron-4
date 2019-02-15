import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./slideshow-organize.html";

var view = false;

export default class SlideshowOrganize extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'SlideshowOrganize',
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

    afterrender() {

        var view = this;
        $('#sort-slideshow').sortable({
            placeholder: "ui-state-highlight",
            handle: ".drag-item",
            stop: function(event, ui) {
                Mediakron.Status.formChanged = true;
                var uri, type, title, order = [];
                $('#sort-slideshow li').each(function() {
                    item = $(this);
                    uri = item.attr('uri');
                    data = JSON.parse(item.attr('data'));
                    order.push({
                        'uri': uri,
                        'data': data
                    });
                });
                view.changes = order;
            }
        });
    }

    /**
     * Description
     * @param {object} something
     */
    newName(something) {

    }

}

// @REVIEW then, delete. Original view below


// Mediakron.Relationships.Manage.folder = Mediakron.Relationships.Manage.abstract.extend({
//     template: JST['settings.relationships.manage.slideshow'],
//     afterRender: function() {
//         var view = this;
//         $('#sort-slideshow').sortable({
//             placeholder: "ui-state-highlight",
//             handle: ".drag-item",
//             stop: function(event, ui) {
//                 Mediakron.Status.formChanged = true;
//                 var uri, type, title, order = [];
//                 $('#sort-slideshow li').each(function() {
//                     item = $(this);
//                     uri = item.attr('uri');
//                     data = JSON.parse(item.attr('data'));
//                     order.push({
//                         'uri': uri,
//                         'data': data
//                     });
//                 });
//                 view.changes = order;
//             }
//         });
//     }
// });