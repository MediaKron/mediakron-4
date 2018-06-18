
Mediakron.Sidebar.Filters = Backbone.View.extend({
    template: JST['widgets.filters'],
    el: '.filter-bind',
    folders: [],
    tags: [],
    layers: [],
    found: {},
    filters: {},
    callback: false,
    initialize: function(data) {
        if (data.map) {
            this.model = data.map;
            this.type = 'map';
        } else if (data.timeline) {
            this.model = data.timeline;
            this.type = 'timeline';
            this.template = JST['widgets.timeline.filters'];
        }
        if (data.callback) this.callback = data.callback;

        // Reset
        this.folders = [];
        this.tags = [];
        this.layers = [];
        this.found = {};
        this.filters = {};

        var markers = this.model.getRelationship('layers'),
            m = 0,
            length = markers.length,
            marker, loadLayer, loadItem, loadTopics, t = 0,
            type, topic, found = {};
        for (m; m < length; m++) {
            marker = markers[m];
            if (marker.data.layer) {
                loadLayer = Mediakron.getItemFromURI(marker.data.layer);
                if (loadLayer) {
                    if (!this.found[loadLayer.get('uri')]) {
                        this.layers.push(loadLayer);
                        this.found[loadLayer.get('uri')] = true;
                    }
                }
            }
            if (marker.uri) {
                loadItem = Mediakron.getItemFromURI(marker.uri);
                if (loadItem) {
                    loadTopics = loadItem.getRelationship('topics');
                    t = 0;
                    for (t; t < loadTopics.length; t++) {
                        topic = Mediakron.getItemFromURI(loadTopics[t]);
                        if (topic) {
                            type = topic.getNormalType();
                            if (type == 'tag') {
                                if (!this.found[topic.get('uri')]) {
                                    this.tags.push(topic);
                                    this.found[topic.get('uri')] = true;
                                }
                            } else if (type == 'folder') {
                                if (!this.found[topic.get('uri')]) {
                                    this.folders.push(topic);
                                    this.found[topic.get('uri')] = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        this.layers = _.sortBy(this.layers, function(item) {
            return item.get('title');
        });

        this.render();
    },
    render: function() {
        var content = this.model.toJSON();
        content.folders = this.folders;
        content.tags = this.tags;
        content.layers = this.layers;

        this.$el.html(this.template(content));
        $('select').chosen({
            allow_single_deselect: true
        });
        if (this.callback) { this.callback(); }
        return this;
    },

    events: {
        'click .layerfilter': 'clickLayers',
        'change select': 'selectionChanged',
        'keyup #search-rows': 'selectionChanged',
        'click .empty-map-search': 'clearSearch',
        'click #overlay-toggle': 'toggleOverlay'
    },
    overlayVisible: true,
    toggleOverlay: function() {
        this.overlayVisible = !this.overlayVisible;
        this.filters.overlay = this.overlayVisible;
        if (Mediakron.Status.CurrentMap.removeMarkers) {
            Mediakron.Status.CurrentMap.removeMarkers();
            Mediakron.Status.CurrentMap.drawMarkers(this.filters);
        }
    },
    searchInterval: false,
    searchChanged: false,
    selectionChanged: function() {
        // get filters
        this.filters = {};
        var filter = false;

        var search = $('#search-rows').val();
        if (search !== '') {
            this.filters.title = search;
            filter = true;
            $('.empty-map-search').removeClass('hide');
        } else {
            this.filters.title = false;
        }

        var folders = $('#filter-folder').val();
        if (folders) {
            this.filters.folder = folders;
            filter = true;
        } else { this.filters.folder = false; }

        var tags = $('#filter-tag').val();
        if (tags) {
            this.filters.tag = tags;
            filter = true;
        } else { this.filters.tag = false; }

        var type = $('#filter-type').val();
        if (type) {
            this.filters.type = type;
            filter = true;
        } else { this.filters.type = false; }

        var user = $('#filter-user').val();
        if (user) {
            this.filters.user = user;
            filter = true;
        } else { this.filters.user = false; }

        var layers = [];
        $('.filter-by-layers li.hideLayer').each(function(i, el) {
            layers.push($(el).attr('filter-attr'));
        });
        if (layers.length > 0) {
            this.filters.layers = layers;
            filter = true;
        } else { this.filters.layers = false; }

        if (Mediakron.Status.CurrentMap.removeMarkers) {
            Mediakron.Status.CurrentMap.removeMarkers();
            Mediakron.Status.CurrentMap.drawMarkers(this.filters);
        }
    },
    clearSearch: function() {
        $('#search-rows').val('');
        $('.empty-map-search').addClass('hide');
        this.filters.title = false;
        if (Mediakron.Status.CurrentMap.removeMarkers) {
            Mediakron.Status.CurrentMap.removeMarkers();
            Mediakron.Status.CurrentMap.drawMarkers(this.filters);
        }

    },
    clickLayers: function(e) {
        $(e.currentTarget).toggleClass('hideLayer');
        this.selectionChanged();
    }

});