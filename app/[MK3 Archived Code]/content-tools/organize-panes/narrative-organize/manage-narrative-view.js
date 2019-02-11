import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./narrative-organize.html";

var view = false;

export default class NarrativeOrganize extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'NarrativeOrganize',
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
            'click #done-editing': 'save',
            'click #cancel-editing': 'cancel',
            'click .close-button': 'cancel',
            'click .overlay-bg': 'cancel',
            'blur .field': 'change'
        }
    }

    afterrender() {

    }

    /**
     * Description
     * @param {object} something
     */
    change() {
        Mediakron.Status.formChanged = true;
    },
    save() {
        Mediakron.Status.formChanged = false;
        var length = this.changes.length,
            i = 0,
            order = [],
            change, view = this;
        for (i; i < length; i++) {
            change = this.changes[i];
            uri = change.uri;
            item = $('.nr-sort-' + uri);
            if (item.attr('data')) {
                data = JSON.parse(item.attr('data'));
                itemTemplate = $('.narrative-template-' + uri).val();
                if (itemTemplate) {
                    if (!data) {
                        data = {};
                    }
                    data.template = itemTemplate;
                }
                data.hideTitle = $('.hide-title-' + uri).prop('checked');
                data.hideSidebar = $('.hide-sidebar-' + uri).prop('checked');
            } else {
                data = false;
            }
            if (change.remove) {
                order.push({
                    'uri': uri,
                    'data': data,
                    remove: true
                });
            } else {
                order.push({
                    'uri': uri,
                    'data': data
                });
            }
        }
        this.changes = order;
        $('#done-editing').html('<span class="mk-icon mk-save"> </span> Saving ');
        // hiding until we can have this appear without stacking the save message
        //        this.item.setRelationship('children',this.changes);
        //        Mediakron.message({
        //            'timeout':     3000,
        //            'type':        'success',
        //            'text':        'Updating record...',
        //            'layout':      'top',
        //            'confirm':     false,
        //            'dismiss':      true
        //
        //        });
        this.item.save({}, {
            success: function(item) {
                Mediakron.message({
                    'timeout': 4000,
                    'type': 'success',
                    'text': '<span class="mk-icon mk-save"></span> Changes saved',
                    'layout': 'bottom',
                    'confirm': false,
                    'dismiss': true
                });
                Mediakron.controller.refreshPrimary();
            }
        });
    },
    afterRender() {
        $('.narrative-template-select').chosen({
            allow_single_deselect: true
        });
        var view = this;
        $('#sort-narrative').sortable({
            placeholder: "ui-state-highlight",
            handle: ".drag-item",
            stop: function(event, ui) {
                Mediakron.Status.formChanged = true;
                var item, itemTemplate, uri, type, title, order = [];
                $('#sort-narrative li').each(function() {
                    item = $(this);
                    uri = item.attr('uri');
                    data = JSON.parse(item.attr('data'));
                    itemTemplate = $('.narrative-template-' + uri).val();
                    if (!itemTemplate) {
                        itemTemplate = 'default';
                    }
                    data.template = itemTemplate;
                    order.push({
                        'uri': uri,
                        'data': data
                    });
                });
                view.changes = order;
            }
        });
    }

}

// @REVIEW then, delete. Original view below

//
// Mediakron.Relationships.Manage.narrative = Mediakron.Relationships.Manage.abstract.extend({
//     template: JST['settings.relationships.manage.narrative'],
//     events: {
//         'click .remove-item': 'removeRelationship',
//         'click #done-editing': 'save',
//         'click #cancel-editing': 'cancel',
//         'click .close-button': 'cancel',
//         'click .overlay-bg': 'cancel',
//         'blur .field': 'change'
//     },
//     change: function() {
//         Mediakron.Status.formChanged = true;
//     },
//     save: function() {
//         Mediakron.Status.formChanged = false;
//         var length = this.changes.length,
//             i = 0,
//             order = [],
//             change, view = this;
//         for (i; i < length; i++) {
//             change = this.changes[i];
//             uri = change.uri;
//             item = $('.nr-sort-' + uri);
//             if (item.attr('data')) {
//                 data = JSON.parse(item.attr('data'));
//                 itemTemplate = $('.narrative-template-' + uri).val();
//                 if (itemTemplate) {
//                     if (!data) {
//                         data = {};
//                     }
//                     data.template = itemTemplate;
//                 }
//                 data.hideTitle = $('.hide-title-' + uri).prop('checked');
//                 data.hideSidebar = $('.hide-sidebar-' + uri).prop('checked');
//             } else {
//                 data = false;
//             }
//             if (change.remove) {
//                 order.push({
//                     'uri': uri,
//                     'data': data,
//                     remove: true
//                 });
//             } else {
//                 order.push({
//                     'uri': uri,
//                     'data': data
//                 });
//             }
//         }
//         this.changes = order;
//         $('#done-editing').html('<span class="mk-icon mk-save"> </span> Saving ');
//         // hiding until we can have this appear without stacking the save message
//         //        this.item.setRelationship('children',this.changes);
//         //        Mediakron.message({
//         //            'timeout':     3000,
//         //            'type':        'success',
//         //            'text':        'Updating record...',
//         //            'layout':      'top',
//         //            'confirm':     false,
//         //            'dismiss':      true
//         //
//         //        });
//         this.item.save({}, {
//             success: function(item) {
//                 Mediakron.message({
//                     'timeout': 4000,
//                     'type': 'success',
//                     'text': '<span class="mk-icon mk-save"></span> Changes saved',
//                     'layout': 'bottom',
//                     'confirm': false,
//                     'dismiss': true
//                 });
//                 Mediakron.controller.refreshPrimary();
//             }
//         });
//     },
//     afterRender: function() {
//         $('.narrative-template-select').chosen({
//             allow_single_deselect: true
//         });
//         var view = this;
//         $('#sort-narrative').sortable({
//             placeholder: "ui-state-highlight",
//             handle: ".drag-item",
//             stop: function(event, ui) {
//                 Mediakron.Status.formChanged = true;
//                 var item, itemTemplate, uri, type, title, order = [];
//                 $('#sort-narrative li').each(function() {
//                     item = $(this);
//                     uri = item.attr('uri');
//                     data = JSON.parse(item.attr('data'));
//                     itemTemplate = $('.narrative-template-' + uri).val();
//                     if (!itemTemplate) {
//                         itemTemplate = 'default';
//                     }
//                     data.template = itemTemplate;
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