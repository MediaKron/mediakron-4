/*!
 * Mediakron Render Cartesian Map
 * This javascript creates the maps objects, collections and views, using the openlayers api.
 */

var basepath = Mediakron.Settings.basepath;
Mediakron.Maps = {};
Mediakron.Maps.LoadedMaps = {};
Mediakron.Maps.Markers = [];
Mediakron.Maps.CurrentMap = {};


Mediakron.Maps.Icons = {
    normal: L.divIcon({
        // Specify a class name we can refer to in CSS.
        className: 'map-marker',
        // Define what HTML goes in each marker.
        html: '<div class="map-marker"><span class="mki mki-marker"></span></div>',
        // Set a markers width and height.
        iconSize: [30, 30],
        iconAnchor: [18, 35],
        popupAnchor: [0, -35]
    }),
    highlight: L.divIcon({
        // Specify a class name we can refer to in CSS.
        className: 'map-marker highlight',
        // Define what HTML goes in each marker.
        html: '<div class="map-marker highlight"><span class="mki mki-marker"></span></div>',
        // Set a markers width and height.
        iconSize: [30, 30],
        iconAnchor: [18, 35],
        popupAnchor: [0, -35]
    }),
    move: L.divIcon({
        // Specify a class name we can refer to in CSS.
        className: 'map-marker marker-fullscreen',
        // Define what HTML goes in each marker.
        html: '<div class="map-marker"><span class="mk-icon mk-fullscreen-open"></span></div>',
        // Set a markers width and height.
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [-3, -35]
    }),
    edit: L.divIcon({
        // Specify a class name we can refer to in CSS.
        className: 'map-marker marker-edit',
        // Define what HTML goes in each marker.
        html: '<div class="map-marker map-edit"><span class="mki mki-marker map-edit"></span></div>',
        // Set a markers width and height.
        iconSize: [24, 24],
        iconAnchor: [18, 12],
        popupAnchor: [0, -35]
    })
};

var getPopup = function(template, options) {
    if (!options) options = {};
    var jst = JST['popup.default'];
    if (template) {
        if (JST['popup.' + template]) {
            jst = JST['popup.' + template];
        }
    }
    options.item = this;
    return jst(options);
};

Mediakron.Maps.Marker = L.Marker.extend({
    afterPopup: false,
    openPopup: function() {
        if (this._popup && this._map && !this._map.hasLayer(this._popup)) {
            this._popup.setLatLng(this._latlng);
            this._map.openPopup(this._popup);
        }
        if (this.afterPopup) {
            this.afterPopup();
        }
        return this;
    }
});


Mediakron.Maps.Theme = function(model, id, type, height, zoom, skipMarkers) {
    this.goFull = false;
    if (!type) type = model.get('type');
    if (!height) height = '1000px';
    if (!zoom) zoom = 1;

    var mapLayers = [],
        center = [0, 0],
        target = id,
        layers,
        file,
        projection,
        length,
        i,
        map,
        marker,
        itemUri,
        nochild = false,
        draw = false,
        template = 'default',
        drawnItems, existingItems,
        filters = {
            layers: [],
            folders: [],
            tags: [],
            types: [],
            authors: [],
            title: false
        };

    if (model) {
        layers = model.getRelationship('layers');
        file = model.get('file');
        projection = model.get('projection');
        center = model.get('center');
        zoom = model.get('zoom');
        target = id + '-' + model.get('uri');
        length = layers.length;
        template = model.get('template');
        i = 0;
        if (!id) {
            id = 'map-' + model.get('uri');
        }

        draw = true;
    }
    if (!id) { id = 'map'; }

    map = L.map(id, { 'attributionControl': true, 'scrollWheelZoom': false, 'doubleClickZoom': true }).setView(center, zoom);
    // Initialise the FeatureGroup to store editable layers

    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    existingItems = new L.FeatureGroup();
    map.addLayer(existingItems);

    if (model) {
        map.uri = model.get('uri');
    }

    switch (type) {

        case 'image-map':
            var imageUrl = Mediakron.Image.style(model.get('image'), 'double'),
                size = model.get('size');
            //if(size.height  < 1 || size.width < 1){
            // recalculate size right quick
            //$('#'+id).append(Mediakron.Image.theme(Mediakron.Image.style(model.get('image'),'small')))
            //}

            var heightDiff = (100 - (150 - size.height) / 1.5) / 2,
                widthDiff = (100 - (150 - size.width) / 1.5) / 2,
                leftOffset = heightDiff * -1,
                topOffset = widthDiff * -1,
                imageBounds = [
                    [leftOffset, topOffset],
                    [heightDiff, widthDiff]
                ];
            map.setView([0, 0], 4);
            L.imageOverlay(imageUrl, imageBounds).addTo(map);
            break;
        case 'osm':
            L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
                attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.'
            }).addTo(map);

            // old osm layer http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png
            break;
        case 'carto-voyager':
            L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png', {
                attribution: 'Copyright Carto. Data by OpenStreetMap'
            }).addTo(map);
            break;
        case 'stamen-light':
            L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
                attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.'
            }).addTo(map);
            break;
        case 'stamen-watercolor':
            L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
                attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.'
            }).addTo(map);
            break;


        default:
            break;

    }
    if (model.overlayType) {
        var overlay = model.overlayType();
        Mediakron.Maps.currentOverlay = false;
        if (overlay == 'tilemap') {
            Mediakron.Maps.currentOverlay = L.tileLayer(model.overlayUrl(), {
                attribution: model.overlayTitle(),
            });
            Mediakron.Maps.currentOverlay.addTo(map);
        } else if (overlay == 'geojson') {
            $.get(model.overlayFile(), function(data) {
                Mediakron.Maps.currentOverlay = L.geoJSON(data, {
                    attribution: model.overlayTitle()
                });
                Mediakron.Maps.currentOverlay.addTo(map);
            });

        }
    }
    map.markers = {};
    map.model = model;

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

    map.start = false;
    map.end = false;

    map.filter = false;
    map.drawMarkers = function(filter) {
        if (filter) map.filter = filter;
        if (this.model) {
            var item, model = this.model,
                view = this,
                layers = model.getRelationship('layers'),
                length = layers.length,
                i = 0,
                eventtime, timeLayers,
                start = false,
                end = false;

            // declare filters from input
            if (filter) {
                if (filter.start) map.start = start = filter.start;
                if (filter.end) map.end = end = filter.end;

            }

            if (_.size(this.markers)) {
                this.removeMarkers();
            }
            if (template == 'timemap') {
                timeLayers = model.get('timeLayers');
            }

            if (length > 0) {
                var goToContext = function(e) {
                        if (e.target.item) {
                            e.originalEvent.preventDefault();
                            e.originalEvent.stopPropagation();
                            view.goFull = true;
                            Mediakron.router.navigate(Mediakron.controller.getPathTo(view.model.get('uri')) + e.target.item.get('uri'), { trigger: true });
                        }
                        return false;
                    },
                    currentMarker,
                    makeEditable = function(e) {
                        e.originalEvent.preventDefault();
                        e.originalEvent.stopPropagation();
                        var uri = e.target.item.get('uri');
                        map.markers[uri].setIcon(Mediakron.Maps.Icons.edit);
                        return false;
                    },
                    openPopup = function() {
                        if (this._latlngs) {
                            this._openPopup({ latlng: getLayerTop(this._latlngs) });
                        } else {
                            this.openPopup();
                        }
                    },
                    popupClose = function() {
                        var overpopup = false,
                            interval = false,
                            pop = this;
                        $('.popup').hover(function() {
                            overpopup = true;
                        }, function() {
                            overpopup = false;
                        });
                        interval = setInterval(function() {
                            if (!overpopup) {
                                pop.closePopup();
                                clearInterval(interval);
                            }
                        }, 1000);
                    };

                var closePopup = function(pop) { pop.closePopup(); },
                    uri = false,
                    icon = Mediakron.Maps.Icons.normal,
                    fillcolor = '#000',
                    strokcolor = '#000',
                    filterlayer;
                for (i; i < length; i++) {
                    uri = layers[i].uri;
                    item = Mediakron.getItemFromURI(uri);
                    nochild = false;
                    if (layers[i].data) {
                        if (layers[i].data.nochild) nochild = true;
                    }
                    // filter logic

                    if (template == 'timemap' && start && end) {

                        if (timeLayers.keyed_items[uri]) {
                            eventtime = timeLayers.keyed_items[uri];

                            if (eventtime.start) {
                                if (eventtime.start > end) { continue; }
                            }

                            if (eventtime.end) {
                                if (eventtime.end < start) { continue; }
                            } else {
                                if (eventtime.start) { if (eventtime.start < start) { continue; } }
                            }
                        }
                    }

                    // are we filtering the map?
                    if (this.filter) {
                        // filtering really only makes sense for items.  Non items don't really get filtered on title or type
                        if (this.filter.layers) {
                            if (layers[i].data.layer) {

                                if (this.filter.layers.indexOf(layers[i].data.layer) > -1) { continue; }
                            }
                        }
                        var filterUri = false;
                        if (item) {
                            if (this.filter.title) {
                                if (item.get('title').toLowerCase().indexOf(this.filter.title.toLowerCase()) == -1) { continue; }
                            }
                            if (this.filter.type) {
                                if (this.filter.type.indexOf(item.getNormalType()) < 0) { continue; }
                            }
                            if (this.filter.user) {
                                if (item.get('user').id != this.filter.user) { continue; }
                            }
                            if (this.filter.folder) {
                                filterUri = this.filter.folder;
                                if (typeof(filterUri) == 'object') filterUri = filterUri[0];
                                if (!item.inTopic(filterUri)) { continue; }
                            }
                            if (this.filter.tag) {
                                filterUri = this.filter.tag;
                                if (typeof(filterUri) == 'object') filterUri = filterUri[0];
                                if (!item.inTopic(filterUri)) { continue; }
                            }
                        } else if (!this.filter.layers) {
                            // if there isn't an item attached skip this item
                            if (this.filter.title || this.filter.type || this.filter.folder || this.filter.tag || this.filter.user) {
                                continue;
                            }
                            //continue;
                        }
                    }

                    if (item || nochild) {
                        icon = Mediakron.Maps.Icons.normal;
                        fillcolor = '#000';
                        strokcolor = '#000';
                        if (layers[i].data.layer) {
                            filterlayer = Mediakron.getItemFromURI(layers[i].data.layer);
                            if (filterlayer) {
                                layersettings = filterlayer.get('options');
                                if (!layersettings.icon) layersettings.icon = 'mki mki-marker';
                                icon = L.divIcon({
                                    // Specify a class name we can refer to in CSS.
                                    className: 'map-marker',
                                    // Define what HTML goes in each marker.
                                    html: '<div class="map-marker map-edit"><span style="color:' + layersettings.color + '" class="' + layersettings.icon + ' map-edit"></span></div>',
                                    // Set a markers width and height.
                                    iconSize: [30, 30],
                                    iconAnchor: [18, 30],
                                    popupAnchor: [0, -25],
                                    color: layersettings.color
                                });
                                fillcolor = layersettings.color;
                            }
                        }

                        if (layers[i].data.type == 'point') {
                            if (!layers[i].data.coordinate) { continue; }
                            if (layers[i].data.coordinate.lat === null || layers[i].data.coordinate.lng === null) { continue; }
                            this.markers[layers[i].uri] = new Mediakron.Maps.Marker(layers[i].data.coordinate, {
                                icon: icon
                            });
                        } else if (layers[i].data.type == 'polygon') {
                            this.markers[layers[i].uri] = new L.polygon(layers[i].data.coordinate, {
                                fillColor: fillcolor,
                                color: fillcolor,
                                weight: 3,
                                opacity: 0.5,
                                smoothFactor: 1,
                                interactive: true
                            });
                        } else if (layers[i].data.type == 'polyline') {
                            this.markers[layers[i].uri] = new L.Polyline(layers[i].data.coordinate, {
                                fillColor: fillcolor,
                                color: fillcolor,
                                weight: 3,
                                opacity: 0.5,
                                smoothFactor: 1
                            });
                        }

                        this.markers[layers[i].uri].layer = layers[i].data.type;
                        this.markers[layers[i].uri].data = layers[i].data;
                        currentMarker = this.markers[layers[i].uri];

                        if (!nochild || item) {
                            currentMarker.bindPopup(item.getPopup('map', { parent: model, item: item, mapUri: model.get('uri'), uri: layers[i].uri }));
                            currentMarker.model = model;
                            currentMarker.item = item;
                            currentMarker.uri = item.get('uri');
                        } else {
                            currentMarker.item = false;
                            currentMarker.bindPopup(getPopup('map.empty', { parent: model, item: item, mapUri: model.get('uri'), uri: layers[i].uri, layer: layers[i] }));
                        }

                        currentMarker.on('mouseover', openPopup);
                        currentMarker.on('mouseout', popupClose);
                        currentMarker.on('dblclick', makeEditable);
                        currentMarker.on('click', goToContext);
                        currentMarker.addTo(map);

                    }
                }
            }
        }
    };

    map.closeMarkers = function() {
        var i = 0,
            view = this,
            markers = this.markers,
            length = _.size(markers);
        if (length > 0) {
            _.each(markers, function(marker) {
                view.closePopup();
            });
        }
        this.markers = {};

    };

    map.editMarkers = function() {
        var i = 0,
            view = this,
            markers = this.markers,
            length = _.size(markers);
        if (length > 0) {
            _.each(markers, function(marker) {
                marker.editing.enable();
            });
        }

    };


    map.removeMarkers = function() {
        var i = 0,
            view = this,
            markers = this.markers,
            length = _.size(markers);
        if (length > 0) {
            _.each(markers, function(marker) {
                view.removeLayer(marker);
            });
        }
        this.markers = {};

    };

    map.refreshMarkers = function() {
        map.removeMarkers();
        map.drawMarkers();
    };

    if (!skipMarkers) {
        map.drawMarkers();
        // Initialise the draw control and pass it the FeatureGroup of editable layers
        if (model) {
            if (model.canAddTo(false)) {
                var drawControl = new L.Control.Draw({
                    draw: {
                        circle: false
                    }
                });
                map.addControl(drawControl);
                new L.Control.GeoSearch({
                    provider: new L.GeoSearch.Provider.OpenStreetMap(),
                    showMarker: false,
                    retainZoomLevel: true
                }).addTo(map);

                map.on('geosearch_showlocation', function(data) {
                    var layers = model.getRelationship('layers');
                    var uri = 'map-unassigned-' + Math.floor(Math.random() * 90000) + 10000;
                    layers.push({
                        uri: uri,
                        data: {
                            type: 'point',
                            coordinate: new L.LatLng(data.Location.Y, data.Location.X),
                            address: data.Location.Label,
                            nochild: true
                        }
                    });
                    model.setRelationship('layers', layers);
                    model.save();
                    map.drawMarkers();
                    Mediakron.router.navigate('settings/marker/' + model.get('uri') + '/' + uri, {
                        trigger: true
                    });
                });
            }
        }

    }


    map.on(L.Draw.Event.CREATED, function(e) {
        var layers = model.getRelationship('layers');
        var id = 'map-unassigned-' + Math.floor(Math.random() * 90000) + 10000;
        var type = e.layerType,
            layer = e.layer;
        if (type === 'marker') {
            // Do marker specific actions
            layers.push({
                uri: id,
                data: {
                    type: 'point',
                    coordinate: layer.getLatLng(),
                    nochild: true
                }
            });


        } else if (type === 'polygon' || type === 'rectangle') {
            layers.push({
                uri: id,
                data: {
                    type: 'polygon',
                    coordinate: layer.getLatLngs(),
                    nochild: true
                }
            });
        } else if (type === 'polyline') {
            layers.push({
                uri: id,
                data: {
                    type: 'polyline',
                    coordinate: layer.getLatLngs(),
                    nochild: true
                }
            });
        }

        model.setRelationship('layers', layers);
        model.save();

        // Do whatever else you need to. (save to db, add to map etc)
        //drawnItems.addLayer(layer);
        map.drawMarkers();
        Mediakron.router.navigate('settings/marker/' + model.get('uri') + '/' + id, {
            trigger: true
        });
    });


    Mediakron.Status.CurrentMap = map;


    $('#' + id).css({ 'height': height });
    return map;
};



Mediakron.Maps.FeatureJson = function(type, model, points) {
    return {
        "type": "Feature",
        "geometry": {
            "type": type,
            "coordinates": points
        },
        "properties": {
            "id": model.get('id'),
            "item": model.get('type'),
            "uri": model.get('uri')
        }
    };
};