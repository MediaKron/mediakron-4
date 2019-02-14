import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./map-organize.html";

var view = false;

export default class MapOrganize extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'MapOrganize',
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
            'click #done-editing': 'saveMarkers',
            'click #cancel-editing': 'cancel',
            'click .close-button': 'cancel',
            'click .overlay-bg': 'cancel',
            'mouseover .manage-map-list li': 'highlightMarker',
            'mouseout .manage-map-list li': 'unhighlightMarker'
        }
    }

    afterrender() {
        var view = this;
        var item, uri, data, order = [];
        $('#manage-map-list li').each(function () {
            item = $(this);
            uri = item.attr('uri');
            data = JSON.parse(item.attr('data'));
            order.push({
                'uri': uri,
                'data': data
            });
        });
        this.order = order;

        $('#manage-map-list').sortable({
            placeholder: "ui-state-highlight",
            handle: ".drag-item",
            stop: function (event, ui) {
                Mediakron.Status.formChanged = true;
                var uri, type, title, order = [];
                $('#manage-map-list li').each(function () {
                    item = $(this);
                    uri = item.attr('uri');
                    data = JSON.parse(item.attr('data'));
                    order.push({
                        'uri': uri,
                        'data': data
                    });
                });
                view.order = order;
                console.log(view.order);
            }
        });
    }

    /**
     * Description
     * @param {object} something
     */
        highlightMarker(e) {
            var map = Mediakron.Status.CurrentMap,
                $target = $(e.currentTarget),
                uri = $target.attr('uri');

            if (map.markers[uri]) {
                if (map.markers[uri].layer) {
                    if (map.markers[uri].layer == 'point') map.markers[uri].setIcon(Mediakron.Maps.Icons.highlight);
                }
            }
        }
        unhighlightMarker(e) {
            var map = Mediakron.Status.CurrentMap,
                $target = $(e.currentTarget),
                uri = $target.attr('uri');
            if (map.markers[uri]) {
                if (map.markers[uri].layer) {
                    if (map.markers[uri].layer == 'point') map.markers[uri].setIcon(Mediakron.Maps.Icons.normal);
                }
            }
        }
        saveMarkers(e) {
            Mediakron.Status.formChanged = false;
            var map = Mediakron.Status.CurrentMap,
                changes, markerItem, marker;
            changes = this.changes = [];
            var relationship = {};
            console.log(this.order);
            console.log(map.markers);
            _.each(this.order, function(ordered) {
                marker = map.markers[ordered.uri];
                if (marker) {
                    if (marker.removeItem) {
                        relationship = {
                            'uri': ordered.uri,
                            'data': false,
                            'remove': true
                        };
                        delete map.markers[ordered.uri];
                    } else {
                        data = ordered.data;
                        if (data.type == 'point') {
                            data.coordinate = marker.getLatLng();
                        } else {
                            data.coordinate = marker.getLatLngs();
                        }
                        relationship = {
                            'uri': ordered.uri,
                            'data': data,
                            'changed': true
                        };
                        markerItem = Mediakron.getItemFromURI(ordered.uri);
                        if (markerItem && data.type == 'point') {
                            marker.setIcon(Mediakron.Maps.Icons.normal);
                        }
                    }
                    console.log(relationship);
                    changes.push(relationship);
                    if (!marker) marker = { editing: {} };
                    if (!marker.editing) marker.editing = {};
                    //if (marker.editing.disable) marker.editing.disable();

                }
            })
            console.log(changes);
            this.item.setRelationship('layers', changes);
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
                    Mediakron.controller.gotoLast();
                    map.drawMarkers();
                    /* Refresh map width */
                    setTimeout(function() { Mediakron.Status.CurrentMap.invalidateSize(); }, 400);
                }
            });
        }
        cancelSave() {
            // Mediakron.router.refresh();
        }
        removeRelationship(e) {
            Mediakron.Status.formChanged = true;
            var map = Mediakron.Status.CurrentMap,
                $target = $(e.currentTarget),
                uri = $target.attr('uri');
            if (map.markers[uri]) {
                map.removeLayer(map.markers[uri]);
                map.markers[uri].removeItem = true;
            } else {
                map.markers[uri] = {
                    removeItem: true
                };
            }
            $target.closest("li").remove();
        }

}

// @REVIEW then, delete. Original view below



// Organize map
// Mediakron.Relationships.Manage.map = Mediakron.Relationships.Manage.abstract.extend({
//     template: JST['settings.relationships.manage.map'],
//     order: [],
//     layers: [],
//     initialize: function(item) {
//         this.item = item;
//         this.layers = this.item.getRelationship('layers');
//         /* $('.map-template').addClass('content-push-sidebar');  move content to left  */
//         /* setTimeout(function(){ Mediakron.Status.CurrentMap.invalidateSize(); }, 400);  Refresh map width */
//     },
//     render: function() {
//         this.$el.html(this.template({
//             'item': this.item.toJSON(),
//             'model': this.item
//         }));
//         var map = Mediakron.Status.CurrentMap,
//             view = this,
//             mark;
//         map.drawMarkers();
//         $('.timeline-slider').slider('values', 0, 0);
//         $('.timeline-slider').slider('values', 1, 100);
//         _.each(map.markers, function(marker, uri) {
//             if (marker) {
//                 mark = view.layers[uri];
//                 marker.on('mouseover', function() {
//                     $('.manage-layer-' + uri).addClass('active');
//                 });
//                 marker.on('mouseout', function() {
//                     $('.manage-layer-' + uri).removeClass('active');
//                 });
//                 if (!marker.options.editing) marker.options.editing = {};
//                 marker.editing.enable();
//                 marker.on('dragend', function(e) {
//                     Mediakron.Status.formChanged = true;
//                     var lnglat = e.target.getLatLng();
//                     $('.manage-layer-' + uri + ' .coordinates').text(lnglat.lng + ',' + lnglat.lat);
//                 });
//                 marker.off("click");
//
//             }
//         });
//         return this;
//     },
//     afterRender: function() {
//         var view = this;
//         var item, uri, data, order = [];
//         $('#manage-map-list li').each(function() {
//             item = $(this);
//             uri = item.attr('uri');
//             data = JSON.parse(item.attr('data'));
//             order.push({
//                 'uri': uri,
//                 'data': data
//             });
//         });
//         this.order = order;
//
//         $('#manage-map-list').sortable({
//             placeholder: "ui-state-highlight",
//             handle: ".drag-item",
//             stop: function(event, ui) {
//                 Mediakron.Status.formChanged = true;
//                 var uri, type, title, order = [];
//                 $('#manage-map-list li').each(function() {
//                     item = $(this);
//                     uri = item.attr('uri');
//                     data = JSON.parse(item.attr('data'));
//                     order.push({
//                         'uri': uri,
//                         'data': data
//                     });
//                 });
//                 view.order = order;
//                 console.log(view.order);
//             }
//         });
//         /* $('.map-template').addClass('content-push-sidebar');move content to left  */
//         /*  setTimeout(function(){ Mediakron.Status.CurrentMap.invalidateSize(); }, 400); /* Refresh map width */
//     },
//     events: {
//         'click .remove-item': 'removeRelationship',
//         'click #done-editing': 'saveMarkers',
//         'click #cancel-editing': 'cancel',
//         'click .close-button': 'cancel',
//         'click .overlay-bg': 'cancel',
//         'mouseover .manage-map-list li': 'highlightMarker',
//         'mouseout .manage-map-list li': 'unhighlightMarker'
//     },
//     highlightMarker: function(e) {
//         var map = Mediakron.Status.CurrentMap,
//             $target = $(e.currentTarget),
//             uri = $target.attr('uri');
//
//         if (map.markers[uri]) {
//             if (map.markers[uri].layer) {
//                 if (map.markers[uri].layer == 'point') map.markers[uri].setIcon(Mediakron.Maps.Icons.highlight);
//             }
//         }
//     },
//     unhighlightMarker: function(e) {
//         var map = Mediakron.Status.CurrentMap,
//             $target = $(e.currentTarget),
//             uri = $target.attr('uri');
//         if (map.markers[uri]) {
//             if (map.markers[uri].layer) {
//                 if (map.markers[uri].layer == 'point') map.markers[uri].setIcon(Mediakron.Maps.Icons.normal);
//             }
//         }
//     },
//     saveMarkers: function(e) {
//         Mediakron.Status.formChanged = false;
//         var map = Mediakron.Status.CurrentMap,
//             changes, markerItem, marker;
//         changes = this.changes = [];
//         var relationship = {};
//         console.log(this.order);
//         console.log(map.markers);
//         _.each(this.order, function(ordered) {
//             marker = map.markers[ordered.uri];
//             if (marker) {
//                 if (marker.removeItem) {
//                     relationship = {
//                         'uri': ordered.uri,
//                         'data': false,
//                         'remove': true
//                     };
//                     delete map.markers[ordered.uri];
//                 } else {
//                     data = ordered.data;
//                     if (data.type == 'point') {
//                         data.coordinate = marker.getLatLng();
//                     } else {
//                         data.coordinate = marker.getLatLngs();
//                     }
//                     relationship = {
//                         'uri': ordered.uri,
//                         'data': data,
//                         'changed': true
//                     };
//                     markerItem = Mediakron.getItemFromURI(ordered.uri);
//                     if (markerItem && data.type == 'point') {
//                         marker.setIcon(Mediakron.Maps.Icons.normal);
//                     }
//                 }
//                 console.log(relationship);
//                 changes.push(relationship);
//                 if (!marker) marker = { editing: {} };
//                 if (!marker.editing) marker.editing = {};
//                 //if (marker.editing.disable) marker.editing.disable();
//
//             }
//         });
//         console.log(changes);
//         this.item.setRelationship('layers', changes);
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
//                 Mediakron.controller.gotoLast();
//                 map.drawMarkers();
//                 /* Refresh map width */
//                 setTimeout(function() { Mediakron.Status.CurrentMap.invalidateSize(); }, 400);
//             }
//         });
//
//
//     },
//     cancelSave: function() {
//         // Mediakron.router.refresh();
//     },
//     removeRelationship: function(e) {
//         Mediakron.Status.formChanged = true;
//         var map = Mediakron.Status.CurrentMap,
//             $target = $(e.currentTarget),
//             uri = $target.attr('uri');
//         if (map.markers[uri]) {
//             map.removeLayer(map.markers[uri]);
//             map.markers[uri].removeItem = true;
//         } else {
//             map.markers[uri] = {
//                 removeItem: true
//             };
//         }
//         $target.closest("li").remove();
//     }
// });