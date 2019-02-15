import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./progression-organize.html";

var view = false;

export default class ProgressionOrganize extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'ProgressionOrganize',
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
            'click .remove-item': 'removeRelationship',
            'click #done-editing': 'saveProgression',
            'click #cancel-editing': 'cancelSave',
            'click .overlay-bg': 'cancel',
            'click .close-button': 'cancelSave'
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
                $('.progression-frame').progression('reorder', order);
            }
        });
    }

    /**
     * Description
     * @param {object} something
     */
    saveProgression() {
        Mediakron.Status.formChanged = false;
        var order = this.changes,
            i = 0,
            length = this.remove.length;
        for (i; i < length; i++) {
            order.push(this.remove[i]);
        }
        $('#done-editing').html('<span class="mk-icon mk-save"> </span> Saving...');
        $('.progression-frame').progression('reorder', order);
        $('.progression-frame').progression('save');
        Mediakron.message({
            'timeout': 4000,
            'type': 'success',
            'text': '<span class="mk-icon mk-save"></span> Changes saved',
            'layout': 'bottom',
            'confirm': false,
            'dismiss': true
        });
        Mediakron.controller.gotoLast();
    }
    cancelSave() {
        $('.progression-frame').progression('cancel');
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
        this.cancel();
    },
    removeRelationship: function(e) {
        Mediakron.Status.formChanged = true;
        var $target = $(e.currentTarget),
            uri = $target.attr('uri'),
            length = this.changes.length,
            i = 0;
        for (i; i < length; i++) {
            if (this.changes[i]) {
                if (uri == this.changes[i].uri) {
                    this.changes[i].remove = true;
                    this.remove.push(this.changes[i]);
                    delete this.changes[i];
                    $target.parent().parent().remove();
                }
            }
        }
        $('.progression-frame').progression('remove', uri);
    }
}

// @REVIEW then, delete. Original view below

// Mediakron.Relationships.Manage.progression = Mediakron.Relationships.Manage.abstract.extend({
//     template: JST['settings.relationships.manage.progression'],
//     initialize: function(item) {
//         this.item = item;
//         var children = item.getRelationship('children'),
//             length = children.length,
//             i = 0;
//         this.changes = children;
//         $('.progression-frame').progression('makeEditable');
//         Mediakron.closeFadeScreen(); /* close the fade-screen overlay so edit area is available  */
//         $('.progression-template').addClass('content-push-sidebar');
//     },
//     render: function() {
//         this.$el.html(this.template({
//             item: this.item.toJSON(),
//             'model': this.item
//         }));
//         return this;
//     },
//     remove: [],
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
//                 $('.progression-frame').progression('reorder', order);
//             }
//         });
//     },
//     events: {
//         'click .remove-item': 'removeRelationship',
//         'click #done-editing': 'saveProgression',
//         'click #cancel-editing': 'cancelSave',
//         'click .overlay-bg': 'cancel',
//         'click .close-button': 'cancelSave'
//     },
//     saveProgression: function() {
//         Mediakron.Status.formChanged = false;
//         var order = this.changes,
//             i = 0,
//             length = this.remove.length;
//         for (i; i < length; i++) {
//             order.push(this.remove[i]);
//         }
//         $('#done-editing').html('<span class="mk-icon mk-save"> </span> Saving...');
//         $('.progression-frame').progression('reorder', order);
//         $('.progression-frame').progression('save');
//         Mediakron.message({
//             'timeout': 4000,
//             'type': 'success',
//             'text': '<span class="mk-icon mk-save"></span> Changes saved',
//             'layout': 'bottom',
//             'confirm': false,
//             'dismiss': true
//         });
//         Mediakron.controller.gotoLast();
//     },
//     cancelSave: function() {
//         $('.progression-frame').progression('cancel');
//         Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
//         this.cancel();
//     },
//     removeRelationship: function(e) {
//         Mediakron.Status.formChanged = true;
//         var $target = $(e.currentTarget),
//             uri = $target.attr('uri'),
//             length = this.changes.length,
//             i = 0;
//         for (i; i < length; i++) {
//             if (this.changes[i]) {
//                 if (uri == this.changes[i].uri) {
//                     this.changes[i].remove = true;
//                     this.remove.push(this.changes[i]);
//                     delete this.changes[i];
//                     $target.parent().parent().remove();
//                 }
//             }
//         }
//         $('.progression-frame').progression('remove', uri);
//     }
// });