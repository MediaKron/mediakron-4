import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./templates/default.html";

var view = false;

export default class Map extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'Map',
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
            'click a': Mediakron.linkHandle,
            'click .close-item-overlay': 'closeOverlay',
            'click .opened .overlay-bg': 'closeOverlay',
            'click .map-filters': 'mapFilters',
            'click .sidebar-details': 'mapFilters',
            'click .close-sidebars-button': 'sidebarClose',
            'click .tour-contents': 'tourContents',
            'click .tour-previous': 'scrollPrev',
            'click .tour-next': 'scrollNext',
            'click .general-filters h3': 'expandFilters',
            'click .tour-item-title': 'tourScrollMap',
            'keydown': 'keyAction'
        }
    }

    afterrender() {

    }

    /**
     * Render the timeline
     */
    renderTimeline() {
        $('.timeline-slider').timeline({
            'model': this.model,
            'map': true
        });
    },
    /**
     * Render the Tour
     */
    renderTour() {
        // Get the tour bindpoint
        var $tour = $('.tour-content');
        $tour.empty();
        this.tourEl = $tour;
        this.tourItems = [];
        var layers = this.model.getRelationship('layers'),
            l = 0,
            layersNum = layers.length,
            layer, item, inlineEl, $inlineEl, viewtracking = this;

        currentTour = 0;
        var t = 1,
            h = 0;
        if (layers.length < 1) {
            $('.tour-content').append('<p class="tour-empty-message">This tour does not have any content yet</p>');
        }
        // Iterate over the layers
        for (l; l < layersNum; l++) {
            layer = layers[l];
            item = false;
            if (layer.uri) {
                item = Mediakron.getItemFromURI(layer.uri);
                if (item) {
                    if (l === 0) {
                        var marker = this.map.markers[layer.uri];
                        if (marker) {
                            if (marker.layer == 'point') {
                                marker.setIcon(Mediakron.Maps.Icons.highlight);
                                this.map.panTo(marker.getLatLng());
                            }
                        }
                    }
                    inlineEl = 'mptour-' + this.model.get('uri') + '-' + layer.uri;
                    $inlineEl = $('<div id=' + inlineEl + ' class="tour-item tour-item-' + item.getNormalType() + '" uri="' + layer.uri + '"> ');
                    $tour.append($inlineEl);
                    $inlineEl.uri = layer.uri;
                    this.tourItems.push($inlineEl);
                    view = item.getView('tour');
                    view.setElement('#' + inlineEl);
                    view.render();
                    // run after render as required
                    var itemType = item.getNormalType();
                    if (itemType != 'map') {
                        view.afterRender();
                    }
                }
            }
        }
        var i = 0,
            lenHeight, pos, posLow, posHi, current = 0,
            heights = false;
        setTimeout(function() {
            //viewtracking.scrollToItem(viewtracking.tourItems[0], false);
            $tour.on('scroll', function(e) {
                if(viewtracking.scrollEnabled){
                    i = 0;
                    if (!heights) {
                        heights = [0];
                        $('.tour-content .tour-item').each(function(i, el) {
                            h = h + $(el).height();
                            heights.push(h);
                            lenHeight = heights.length;
                        });
                    }
                    pos = $(e.currentTarget).scrollTop();
                    posLow = pos - 10;
                    posHi = pos + 10;
                    for (i; i < lenHeight; i++) {
                        if (heights[i] > posLow && heights[i] < posHi && current != i) {
                            item = viewtracking.tourItems[i];
                            viewtracking.scrollToItem(item, false);
                            current = i;
                            break;
                        }
                    }
                }
            });
        }, 100);
        $('.tour-content .tour-item').click(function(e) {
            var $target = $(e.currentTarget);
            var item = viewtracking.getTourItem($target.attr('uri'));
            viewtracking.scrollToItem(item, false);
        });
    },
    getTourItem(uri) {
        var i = 0,
            length = this.tourItems.length;
        for (i; i < length; i++) {
            if (uri == this.tourItems[i].uri) {
                return this.tourItems[i];
            }
        }
    },
    gotoItem(item) {
        var view, $el;
        if (this.tour) {
            if (Mediakron.Status.OpenOverlay) {
                view = item.getView();
                $el = $('.map-overlay .item-contents');
                view.$el = $el;
                view.render();
                view.afterRender();
                this.$el.addClass('full');
                $('.map-overlay').addClass('opened').removeClass('closed');
                Mediakron.Status.OpenOverlay = false;
            }
            // open the tour sidebar if it's not open
            $('.map-template__content').attr('class', 'map-template__content tour-container-open');
            setTimeout(function() {
                Mediakron.Status.CurrentMap.invalidateSize();
            }, 400);
            // this is a tour, scroll to item instead of opening item
            var find = this.getTourItem(item.get('uri'));
            this.scrollToItem(find, true);
        } else if (!item) {
            $('.map-overlay').addClass('closed').removeClass('opened');
            this.$el.removeClass('full');
            $('.map-overlay .item-contents').empty();
        } else {
            if (!Mediakron.controller.popup) {
                $('.map-overlay').addClass('closed').removeClass('opened');
                var marker = this.map.markers[this.current.get('uri')];
                marker.openPopup();
                if (marker.layer == 'point') { marker.setIcon(Mediakron.Maps.Icons.highlight); }
                //this.map.panTo(marker.getLatLng());
            } else {
                view = item.getView();
                $el = $('.map-overlay .item-contents');
                view.$el = $el;
                view.render();
                view.afterRender();
                this.$el.addClass('full');
                $('.map-overlay').addClass('opened').removeClass('closed');
            }
        }
        if (this.initialEvent) {
            Mediakron.router.navigate(this.model.get('uri'), { trigger: false });
            this.initialEvent = false;
        }
    },
    mapFilters(e) {
        $('.map-template__content').attr('class', 'map-template__content filters-open');
        setTimeout(function() {
            Mediakron.Status.CurrentMap.invalidateSize();
        }, 400);
    },
    sidebarClose(e) {
        $('.map-template__content').attr('class', 'map-template__content sidebar-closed');
        setTimeout(function() {
            Mediakron.Status.CurrentMap.invalidateSize();
        }, 400);
    },
    tourContents(e) {
        $('.map-template__content').attr('class', 'map-template__content tour-container-open');
        setTimeout(function() {
            Mediakron.Status.CurrentMap.invalidateSize();
        }, 400);
    },
    expandFilters(e) {
        $('.general-filters-inner').toggleClass('open');
        setTimeout(function() {
            Mediakron.Status.CurrentMap.invalidateSize();
        }, 400);
    },
    scrollNext(e) {
        this.currentTour++;
        var item = this.tourItems[this.currentTour];
        this.scrollToItem(item, true);
    },
    scrollPrev(e) {
        this.currentTour--;
        var item = this.tourItems[this.currentTour];
        this.scrollToItem(item, true);
    },
    scrollToItem(item, scroll) {
        // Disable scroll tracking
        this.scrollEnabled = false;
        // set timeout to reenable scroll tracking after scroll
        var view = this;
        setTimeout(function(){ view.scrollEnabled = true; }, 1500);
        var getLayerTop = function(latlngs) {
            var length = latlngs.length,
                top = latlngs[0],
                topLat = top.lat,
                i = 0,
                latlng;
            for (i; i < length; i++) {
                latlng = latlngs[i];
                if (latlng.lat > topLat) {
                    topLat = latlng.lat;
                    top = latlng;
                }
            }
            return top;
        };

        if (item) {
            this.map.refreshMarkers();

            if (scroll) this.tourEl.animate({ scrollTop: (this.tourEl.scrollTop() + item.position().top) + "px" });
            $('.activetour', this.tourEl).removeClass('activetour');
            item.addClass('activetour');
            var marker = this.map.markers[item.uri],
                data = marker.data;

            var zoom = this.model.get('zoom');
            if (data.zoom) {
                zoom = data.zoom;
            }

            //this.map.setZoom(zoom);
            var center_latlng = false;
            if (marker.layer == 'point') {
                marker.setIcon(Mediakron.Maps.Icons.highlight);

                if (data.center) {
                    if(data.center.lat && data.center.lon){
                        center_latlng = data.center;
                    }

                }
                if(!center_latlng){
                    center_latlng = marker.getLatLng();
                }
                this.map.setView(center_latlng, zoom);
            } else {
                //marker.trigger('mouseover');
                if (data.center) {
                    if(data.center.lat && data.center.lon){
                        center_latlng = data.center;
                    }
                }
                if(!center_latlng){
                    center_latlng = marker.getBounds().getCenter();
                }
                this.map.setView(center_latlng, zoom);
            }


            marker.openPopup();
            if (this.currentTour == this.tourItems.length) $(e.currentTarget).addClass('hide');
        }
    },
    closeOverlay(e) {
        $('.map-overlay .item-contents').empty();
        this.$el.removeClass('full');
        Mediakron.controller.items = [this.model];
        Mediakron.controller.types = ['map'];
        Mediakron.controller.oldcount = 1;
        Mediakron.controller.oldbreadcrumb = Mediakron.controller.breadcrumb = Mediakron.controller.items;
        Mediakron.controller.refresh = false;
        $('.map-overlay').addClass('closed').removeClass('opened');
        Mediakron.controller.closeOverlay({
            trigger: false,
        }, this.model.get('uri'));
        Mediakron.controller.popup = false;
        Mediakron.controller.currentItem = this.model;
    },
    keyAction(e) {
        var item, code = e.keyCode; /* Next Arrow */
        if (code == 39) {
            this.currentTour++;
            item = this.tourItems[this.currentTour];
            this.scrollToItem(item, true);
        } /* Down Arrow */
        if (code == 40) {
            this.currentTour++;
            item = this.tourItems[this.currentTour];
            this.scrollToItem(item, true);
        } /* Left Arrow */
        if (code == 37) {
            this.currentTour--;
            item = this.tourItems[this.currentTour];
            this.scrollToItem(item, true);
        } /* Up Arrow */
        if (code == 38) {
            this.currentTour--;
            item = this.tourItems[this.currentTour];
            this.scrollToItem(item, true);
        }
    }

// @REVIEW then, delete. Original view below

/**
 * Map View Interface
 *
 * This renders the primary view interface for the map
 */
// Mediakron.Pages.map = Mediakron.Extensions.View.extend({
//     template: JST['pages.map.default'],
//     className: 'pages pages-layout layout-pages map-context',
//     current: false,
//     item: false,
//     map: false,
//     tour: false,
//     tourEl: false,
//     tourItems: [],
//     currentTour: false,
//     initialEvent: true,
//     scrollEnabled: true,
//     initialize(model) {
//         this.model = model;
//         this.current = model;
//         this.identifier = 'map-' + model.get('uri') + '-' + Math.floor((Math.random() * 100000) + 1);
//         return this;
//     },
//     render() {
//         if (this.layout) {
//             this.template = JST['pages.map.' + this.layout];
//         } else if (this.model.get('template')) {
//             this.template = JST['pages.map.' + this.model.get('template')];
//             if (this.model.get('template') == 'maptour') this.tour = true;
//             if (this.model.get('template') == 'timemap') this.timeline = true;
//         }
//         this.getCurrent();
//         var content = this.model.toJSON();
//         content.item = this.model;
//         content.model = this.model;
//         content.identifier = this.identifier;
//         content.current = this.current.get('uri');
//         this.$el.html(this.template(content));
//         return this;
//     },
//     afterRender() {
//         var view = this;
//         this.model.getSidebar(this.$el);
//         if (!Mediakron.loading) {
//             this.filters = new Mediakron.Sidebar.Filters({
//                 map: this.model,
//                 filter(filters) {
//                     Mediakron.Status.CurrentMap.removeMarkers();
//                     Mediakron.Status.CurrentMap.drawMarkers(filters);
//                 },
//                 callback() {
//                     $("#overlay-slider").slider({
//                         'value': 100,
//                         slide(event, ui) {
//                             Mediakron.Maps.currentOverlay.setOpacity(ui.value / 100);
//                         }
//                     });
//                 }
//             });
//         } else {
//             Mediakron.App.Events.on('load:complete', function() {
//                 view.filters = new Mediakron.Sidebar.Filters({
//                     map: view.model,
//                     filter(filters) {
//                         Mediakron.Status.CurrentMap.removeMarkers();
//                         Mediakron.Status.CurrentMap.drawMarkers(filters);
//                     },
//                     callback() {
//                         $("#overlay-slider").slider({
//                             'value': 100,
//                             slide(event, ui) {
//                                 Mediakron.Maps.currentOverlay.setOpacity(ui.value / 100);
//                             }
//                         });
//                     }
//
//                 });
//             });
//         }
//         if (this.model.get('type') != 'cartodb') {
//             this.map = Mediakron.Maps.Theme(this.model, this.identifier);
//
//             $('#' + this.identifier).css({
//                 'height': ($('#main').height()) + 'px'
//             });
//         }
//         if (this.tour) {
//
//         } else {
//             if (this.model.get('uri') != this.current.get('uri')) {
//                 if (this.map.goFull) {
//                     var item = this.current,
//                         view1 = item.getView(),
//                         $el = $('.item-view .item-contents');
//                     view1.$el = $el;
//                     view1.render();
//                     view1.afterRender();
//                 } else {
//                     $('.item-view').addClass('closed').removeClass('opened');
//                     var marker = this.map.markers[this.current.get('uri')];
//                     marker.openPopup();
//                     if (marker.layer == 'point') {
//                         marker.setIcon(Mediakron.Maps.Icons.highlight);
//                         this.map.panTo(marker.getLatLng());
//                     }
//                 }
//             }
//         }
//         // Render the map tour
//         if (this.tour) {
//             this.renderTour();
//         }
//         // Render the timeline under the view
//         if (this.timeline) {
//             this.renderTimeline();
//         }
//         // Listen for a marker edit event and render the tour and timeline
//         Mediakron.App.Events.on('marker:edit', function() {
//             if (view.tour) view.renderTour();
//             if (view.timeline) view.renderTimeline();
//         });
//
//         /* Move pin button to first in line */
//         $(".leaflet-draw-toolbar a:eq(0)").before($(".leaflet-draw-toolbar a:eq(3)")); /* Move geosearch button into draw toolbar */
//         $(".leaflet-draw-toolbar a:eq(0)").before($(".leaflet-control-geosearch"));
//
//         /* Load accessible dropdown menu plugin  */
//         accessibleNav();
//
//     },
//     /**
//      * Render the timeline
//      */
//     renderTimeline() {
//         $('.timeline-slider').timeline({
//             'model': this.model,
//             'map': true
//         });
//     },
//     /**
//      * Render the Tour
//      */
//     renderTour() {
//         // Get the tour bindpoint
//         var $tour = $('.tour-content');
//         $tour.empty();
//         this.tourEl = $tour;
//         this.tourItems = [];
//         var layers = this.model.getRelationship('layers'),
//             l = 0,
//             layersNum = layers.length,
//             layer, item, inlineEl, $inlineEl, viewtracking = this;
//
//         currentTour = 0;
//         var t = 1,
//             h = 0;
//         if (layers.length < 1) {
//             $('.tour-content').append('<p class="tour-empty-message">This tour does not have any content yet</p>');
//         }
//         // Iterate over the layers
//         for (l; l < layersNum; l++) {
//             layer = layers[l];
//             item = false;
//             if (layer.uri) {
//                 item = Mediakron.getItemFromURI(layer.uri);
//                 if (item) {
//                     if (l === 0) {
//                         var marker = this.map.markers[layer.uri];
//                         if (marker) {
//                             if (marker.layer == 'point') {
//                                 marker.setIcon(Mediakron.Maps.Icons.highlight);
//                                 this.map.panTo(marker.getLatLng());
//                             }
//                         }
//                     }
//                     inlineEl = 'mptour-' + this.model.get('uri') + '-' + layer.uri;
//                     $inlineEl = $('<div id=' + inlineEl + ' class="tour-item tour-item-' + item.getNormalType() + '" uri="' + layer.uri + '"> ');
//                     $tour.append($inlineEl);
//                     $inlineEl.uri = layer.uri;
//                     this.tourItems.push($inlineEl);
//                     view = item.getView('tour');
//                     view.setElement('#' + inlineEl);
//                     view.render();
//                     // run after render as required
//                     var itemType = item.getNormalType();
//                     if (itemType != 'map') {
//                         view.afterRender();
//                     }
//                 }
//             }
//         }
//         var i = 0,
//             lenHeight, pos, posLow, posHi, current = 0,
//             heights = false;
//         setTimeout(function() {
//             //viewtracking.scrollToItem(viewtracking.tourItems[0], false);
//             $tour.on('scroll', function(e) {
//                 if(viewtracking.scrollEnabled){
//                     i = 0;
//                     if (!heights) {
//                         heights = [0];
//                         $('.tour-content .tour-item').each(function(i, el) {
//                             h = h + $(el).height();
//                             heights.push(h);
//                             lenHeight = heights.length;
//                         });
//                     }
//                     pos = $(e.currentTarget).scrollTop();
//                     posLow = pos - 10;
//                     posHi = pos + 10;
//                     for (i; i < lenHeight; i++) {
//                         if (heights[i] > posLow && heights[i] < posHi && current != i) {
//                             item = viewtracking.tourItems[i];
//                             viewtracking.scrollToItem(item, false);
//                             current = i;
//                             break;
//                         }
//                     }
//                 }
//             });
//         }, 100);
//         $('.tour-content .tour-item').click(function(e) {
//             var $target = $(e.currentTarget);
//             var item = viewtracking.getTourItem($target.attr('uri'));
//             viewtracking.scrollToItem(item, false);
//         });
//     },
//     getTourItem(uri) {
//         var i = 0,
//             length = this.tourItems.length;
//         for (i; i < length; i++) {
//             if (uri == this.tourItems[i].uri) {
//                 return this.tourItems[i];
//             }
//         }
//     },
//     gotoItem(item) {
//         var view, $el;
//         if (this.tour) {
//             if (Mediakron.Status.OpenOverlay) {
//                 view = item.getView();
//                 $el = $('.map-overlay .item-contents');
//                 view.$el = $el;
//                 view.render();
//                 view.afterRender();
//                 this.$el.addClass('full');
//                 $('.map-overlay').addClass('opened').removeClass('closed');
//                 Mediakron.Status.OpenOverlay = false;
//             }
//             // open the tour sidebar if it's not open
//             $('.map-template__content').attr('class', 'map-template__content tour-container-open');
//             setTimeout(function() {
//                 Mediakron.Status.CurrentMap.invalidateSize();
//             }, 400);
//             // this is a tour, scroll to item instead of opening item
//             var find = this.getTourItem(item.get('uri'));
//             this.scrollToItem(find, true);
//         } else if (!item) {
//             $('.map-overlay').addClass('closed').removeClass('opened');
//             this.$el.removeClass('full');
//             $('.map-overlay .item-contents').empty();
//         } else {
//             if (!Mediakron.controller.popup) {
//                 $('.map-overlay').addClass('closed').removeClass('opened');
//                 var marker = this.map.markers[this.current.get('uri')];
//                 marker.openPopup();
//                 if (marker.layer == 'point') { marker.setIcon(Mediakron.Maps.Icons.highlight); }
//                 //this.map.panTo(marker.getLatLng());
//             } else {
//                 view = item.getView();
//                 $el = $('.map-overlay .item-contents');
//                 view.$el = $el;
//                 view.render();
//                 view.afterRender();
//                 this.$el.addClass('full');
//                 $('.map-overlay').addClass('opened').removeClass('closed');
//             }
//         }
//         if (this.initialEvent) {
//             Mediakron.router.navigate(this.model.get('uri'), { trigger: false });
//             this.initialEvent = false;
//         }
//     },
//     events: {
//         'click a': Mediakron.linkHandle,
//         'click .close-item-overlay': 'closeOverlay',
//         'click .opened .overlay-bg': 'closeOverlay',
//         'click .map-filters': 'mapFilters',
//         'click .sidebar-details': 'mapFilters',
//         'click .close-sidebars-button': 'sidebarClose',
//         'click .tour-contents': 'tourContents',
//         'click .tour-previous': 'scrollPrev',
//         'click .tour-next': 'scrollNext',
//         'click .general-filters h3': 'expandFilters',
//         'click .tour-item-title': 'tourScrollMap',
//         'keydown': 'keyAction'
//     },
//     mapFilters(e) {
//         $('.map-template__content').attr('class', 'map-template__content filters-open');
//         setTimeout(function() {
//             Mediakron.Status.CurrentMap.invalidateSize();
//         }, 400);
//     },
//     sidebarClose(e) {
//         $('.map-template__content').attr('class', 'map-template__content sidebar-closed');
//         setTimeout(function() {
//             Mediakron.Status.CurrentMap.invalidateSize();
//         }, 400);
//     },
//     tourContents(e) {
//         $('.map-template__content').attr('class', 'map-template__content tour-container-open');
//         setTimeout(function() {
//             Mediakron.Status.CurrentMap.invalidateSize();
//         }, 400);
//     },
//     expandFilters(e) {
//         $('.general-filters-inner').toggleClass('open');
//         setTimeout(function() {
//             Mediakron.Status.CurrentMap.invalidateSize();
//         }, 400);
//     },
//     scrollNext(e) {
//         this.currentTour++;
//         var item = this.tourItems[this.currentTour];
//         this.scrollToItem(item, true);
//     },
//     scrollPrev(e) {
//         this.currentTour--;
//         var item = this.tourItems[this.currentTour];
//         this.scrollToItem(item, true);
//     },
//     scrollToItem(item, scroll) {
//         // Disable scroll tracking
//         this.scrollEnabled = false;
//         // set timeout to reenable scroll tracking after scroll
//         var view = this;
//         setTimeout(function(){ view.scrollEnabled = true; }, 1500);
//         var getLayerTop = function(latlngs) {
//             var length = latlngs.length,
//                 top = latlngs[0],
//                 topLat = top.lat,
//                 i = 0,
//                 latlng;
//             for (i; i < length; i++) {
//                 latlng = latlngs[i];
//                 if (latlng.lat > topLat) {
//                     topLat = latlng.lat;
//                     top = latlng;
//                 }
//             }
//             return top;
//         };
//
//         if (item) {
//             this.map.refreshMarkers();
//
//             if (scroll) this.tourEl.animate({ scrollTop: (this.tourEl.scrollTop() + item.position().top) + "px" });
//             $('.activetour', this.tourEl).removeClass('activetour');
//             item.addClass('activetour');
//             var marker = this.map.markers[item.uri],
//                 data = marker.data;
//
//             var zoom = this.model.get('zoom');
//             if (data.zoom) {
//                 zoom = data.zoom;
//             }
//
//             //this.map.setZoom(zoom);
//             var center_latlng = false;
//             if (marker.layer == 'point') {
//                 marker.setIcon(Mediakron.Maps.Icons.highlight);
//
//                 if (data.center) {
//                     if(data.center.lat && data.center.lon){
//                         center_latlng = data.center;
//                     }
//
//                 }
//                 if(!center_latlng){
//                     center_latlng = marker.getLatLng();
//                 }
//                 this.map.setView(center_latlng, zoom);
//             } else {
//                 //marker.trigger('mouseover');
//                 if (data.center) {
//                     if(data.center.lat && data.center.lon){
//                         center_latlng = data.center;
//                     }
//                 }
//                 if(!center_latlng){
//                     center_latlng = marker.getBounds().getCenter();
//                 }
//                 this.map.setView(center_latlng, zoom);
//             }
//
//
//             marker.openPopup();
//             if (this.currentTour == this.tourItems.length) $(e.currentTarget).addClass('hide');
//         }
//     },
//     closeOverlay(e) {
//         $('.map-overlay .item-contents').empty();
//         this.$el.removeClass('full');
//         Mediakron.controller.items = [this.model];
//         Mediakron.controller.types = ['map'];
//         Mediakron.controller.oldcount = 1;
//         Mediakron.controller.oldbreadcrumb = Mediakron.controller.breadcrumb = Mediakron.controller.items;
//         Mediakron.controller.refresh = false;
//         $('.map-overlay').addClass('closed').removeClass('opened');
//         Mediakron.controller.closeOverlay({
//             trigger: false,
//         }, this.model.get('uri'));
//         Mediakron.controller.popup = false;
//         Mediakron.controller.currentItem = this.model;
//     },
//     keyAction(e) {
//         var item, code = e.keyCode; /* Next Arrow */
//         if (code == 39) {
//             this.currentTour++;
//             item = this.tourItems[this.currentTour];
//             this.scrollToItem(item, true);
//         } /* Down Arrow */
//         if (code == 40) {
//             this.currentTour++;
//             item = this.tourItems[this.currentTour];
//             this.scrollToItem(item, true);
//         } /* Left Arrow */
//         if (code == 37) {
//             this.currentTour--;
//             item = this.tourItems[this.currentTour];
//             this.scrollToItem(item, true);
//         } /* Up Arrow */
//         if (code == 38) {
//             this.currentTour--;
//             item = this.tourItems[this.currentTour];
//             this.scrollToItem(item, true);
//         }
//     }
// });
