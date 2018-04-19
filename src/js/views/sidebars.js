Mediakron.Sidebar = {};


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


Mediakron.Sidebar.Edit = Backbone.View.extend({
    template: JST['widgets.edit'],
    el: false,
    model: false,
    initialize: function(model) {
        this.model = model;
        this.el = '.page-options-' + model.get('uri');
        this.$el = $(this.el);
        this.render();
        return this;
    },
    render: function() {
        var content = this.model.toJSON(),
            options = this.model.get('options');
        content.item = this.model;
        content.context = false;
        content.collections = this.collections;

        if (Mediakron.context) {
            if (Mediakron.context.item) {
                content.context = Mediakron.context.item;
            }
        }
        this.$el.html(this.template(content));
        return this;
    },
    events: {
        'click a': Mediakron.linkHandle,
        //        'mouseenter .option-edit': 'expandEdit',
        //        'mouseleave .option-edit': 'collapseEdit',
        //        'mouseenter .option-add-to': 'expandAdd',
        //        'mouseleave .option-add-to': 'expandAdd',
        //        'mouseenter #secondary-options': 'expandSecondaryoptions',
        //        'mouseleave #secondary-options': 'collapseSecondaryoptions'   
    },
    expandEdit: function() {
        $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'false' });
        $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.button-secondary-options').removeClass('open');
        $('.edit-button').addClass('open');
    },
    collapseEdit: function() {
        $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.edit-button').removeClass('open');
        $('.button-secondary-options').removeClass('open');
    },
    expandAdd: function() {
        $('.option-add-to .dropdown-container').attr({ 'data-visually-hidden': 'false' });
        $('.add-to-button').addClass('open');
    },
    collapseAdd: function() {
        $('.option-add-to .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.edit-button').removeClass('open');
    },
    expandSecondaryoptions: function() {
        $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'false' });
        $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.button-secondary-options').addClass('open');
        $('.edit-button').removeClass('open');
    },
    collapseSecondaryoptions: function() {
        $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.button-secondary-options').removeClass('open');
        $('.edit-button').removeClass('open');
    },
});


Mediakron.Sidebar.Init = Backbone.View.extend({
    template: JST['widgets.initial'],
    sidebar: false,
    active: false,
    parent: false,
    el: false,
    collections: {
        'comparison': [],
        'story': [],
        'folder': [],
        'slideshow': [],
        'progression': [],
        'narrative': [],
        'map': [],
        'tag': [],
        'timeline': [],
        'citation': []

    },
    initialize: function(model) {
        this.parent = model.parent;
        this.model = model;
        this.el = '.widgets-menu-' + model.get('uri');
        this.$el = $(this.el);
        var topics = model.getRelationship('topics'),
            count = topics.length,
            t = 0,
            topic, item, type;
        this.collections = {
            'comparison': [],
            'story': [],
            'folder': [],
            'slideshow': [],
            'progression': [],
            'narrative': [],
            'map': [],
            'tag': [],
            'timeline': [],
            'citation': []

        };

        for (t; t < count; t++) {
            topic = topics[t];
            if (topic) {
                item = Mediakron.getItemFromURI(topic.uri);
                if (item) {
                    type = item.get('type');
                    if (this.collections[type]) {
                        this.collections[type].push(topic);
                    }

                }
            }
        }
        this.collections.map = model.getRelationship('maps');
        this.collections.citation = model.getRelationship('citations');
        if (!this.collections.citation) this.collections.citation = [];
        this.collections.timeline = model.getRelationship('timelines');
        this.hasCollection = false;
        if (this.collections.map.length > 1 || this.collections.timeline.length > 1 || this.collections.citation.length > 1 || topics.length > 1) {
            this.hasCollection = true;
        }
    },
    render: function() {
        var content = this.model.toJSON(),
            options = this.model.get('options'),
            uri = this.model.get('uri'),
            $below = $('.widgets--below-' + uri),
            object = this.model.toJSON();
        sidebar = false;
        options = content.options;
        content.item = this.model;
        content.context = false;
        content.collections = this.collections;
        content.hasCollection = this.hasCollection;

        if (Mediakron.context) {
            if (Mediakron.context.item) {
                content.context = Mediakron.context.item;
            }
        }
        this.edit = new Mediakron.Sidebar.Edit(this.model);

        this.$el.html(this.template(content));

        object.item = this.model;
        if (options.defaultSidebar) {
            if (options.defaultSidebar !== 'none') {
                var $sidebar = $('.widgets--sidebar-' + uri),
                    parent = $sidebar.parent();
                $sidebar.html(JST['widgets.' + options.defaultSidebar](object));
                sidebar = options.defaultSidebar;
                $('.main-item-content', parent).addClass('col-md-8');
                $('.widgets--sidebar-' + uri).addClass('col-md-4');
            }
            if (options.defaultSidebar == 'description') {
                $('.description-button').addClass('hidden');
                $('.detail-list-description').addClass('hidden');
            }
            if (options.defaultSidebar == 'details') {
                $('.details-button').addClass('hidden');
                $('.detail-list-details').addClass('hidden');
            }
            if (options.defaultSidebar == 'transcript') {
                $('.transcript-button').addClass('hidden');
                $('.detail-list-transcript').addClass('hidden');
            }
        }

        if (sidebar != 'details') $('.widgets--below-' + uri + ' .widgets__details').html(JST['widgets.details'](object));
        if (sidebar != 'description') $('.widgets--below-' + uri + ' .widgets__description').html(JST['widgets.description'](object));
        if (sidebar != 'transcript') $('.widgets--below-' + uri + ' .widgets__transcript').html(JST['widgets.transcript'](object));

        /*var maps = new Mediakron.Sidebar.Description(this.model);
        maps.setElement('.content-below-'+uri+' .maps-wrapper');
        maps.render();*/

        var comments = new Mediakron.Sidebar.Comments(this.model);
        comments.setElement('.widgets--below-' + uri + ' .widgets__comments');
        comments.render();
    },

    events: {

        'click a': Mediakron.linkHandle,
        'click .toggleSidebar': Mediakron.sidebarHandle,
        'click .details-button': 'scrollDown',
        'click .description-button': 'description',
        'click .transcript-button': 'transcript',
        'click .collections-link': 'toggleCollections',
        'click .comments-button': 'comments',
        'click .scroll-down': 'scrollDown',
        'click .top-button': 'backToTop',
        'click .item-header h2': 'backToTop',

    },
    toggleCollections: function(e) {
        $('.collections-list', this.parent).toggleClass('opened');
    },
    maps: function(e) {
        if (!e) return false;
        var parent = this.parent,
            map = $(e.currentTarget).attr('map');
        $('.collections-list', this.parent).removeClass('opened');
        if (this.sidebar != 'maps-' + map || !this.active) { // we aren't on the details right now
            var view = new Mediakron.Sidebar.Maps({ 'model': this.model, 'map': map, 'parent': this.parent });
            view.render();
            if (!this.active) {
                Mediakron.Sidebar.show(parent);
                this.active = true;
            }
            view.afterRender();
            this.sidebar = 'maps-' + map;
        } else {
            if (this.active) {
                Mediakron.Sidebar.hide(parent);
                this.active = false;
            }
        }
    },
    topics: function(e) {
        var parent = this.parent,
            topic = $(e.currentTarget).attr('topic');
        $('.collections-list', this.parent).removeClass('opened');
        if (this.sidebar != 'topics-' + topic || !this.active) { // we aren't on the details right now
            var view = new Mediakron.Sidebar.Topics({ 'model': this.model, 'topic': topic, 'parent': this.parent });
            view.render();
            if (!this.active) {
                Mediakron.Sidebar.show(parent);
                this.active = true;
            }
            view.afterRender();
            this.sidebar = 'topics-' + topic;
        } else {
            if (this.active) {
                Mediakron.Sidebar.hide(parent);
                this.active = false;
            }
        }
    },
    backToTop: function() {
        $('#main-container').animate({ scrollTop: 0 }, '700');
    },
    scrollDown: function() {
        var uri = this.model.get('uri');
        $('#main-container').animate({ scrollTop: $('.widgets--below-' + uri + '').offset().top - 50 }, '700');
    },
    details: function() {
        var uri = this.model.get('uri');
        $('#main-container').animate({ scrollTop: $('.widgets--below-' + uri + ' .widgets__details').offset().top - 50 }, '700');
    },
    description: function() {
        var uri = this.model.get('uri');
        $('#main-container').animate({ scrollTop: $('.widgets--below-' + uri + ' .widgets__description').offset().top - 50 }, '700');
    },
    comments: function() {
        var uri = this.model.get('uri');
        $('#main-container').animate({ scrollTop: $('.widgets--below-' + uri + ' .widgets__comments').offset().top - 50 }, '700');
    },
    transcript: function() {
        var uri = this.model.get('uri');
        $('#main-container').animate({ scrollTop: $('.widgets--below-' + uri + ' .widgets__transcript').offset().top - 50 }, '700');
    }

});

Mediakron.Sidebar.Comments = Backbone.View.extend({
    template: JST['widgets.comments'],
    initialize: function(model) {
        this.model = model;
    },
    render: function() {
        var content = this.model.toJSON();
        this.$el.html(this.template(content));
        return this;
    },
    events: {
        'click .panel-body a': Mediakron.linkHandle,
        'click #toggleSidebar': Mediakron.sidebarHandle,
        'click #save': 'saveComment',
        'mousedown .wysiwyg-button': Mediakron.Wysiwyg.apply,
        'mouseup #comment-field': "openWysiwyg",
        'keyup #comment-field': "openWysiwyg",
    },
    saveComment: function() {
        var html = $('#comment-field').html();
        if ($('#comment-field').text().length < 1) {
            Mediakron.message({
                type: 'danger',
                text: 'You cannot submit an empty comment.'
            });
            return false;
        }
        this.model.addComment(html);
        this.model.save();
        this.render();
    },
    openWysiwyg: function(e) {

        var selection = window.getSelection(),
            oRange = selection.getRangeAt(0),
            text = selection.toString();
        if (text.length > 0) {
            Mediakron.Wysiwyg.showBubble();
        } else {
            $('#wysiwyg').hide();
        }

    }
});

Mediakron.Sidebar.Topics = Backbone.View.extend({
    template: JST['widgets.topics'],
    el: false,
    initialize: function(content) {
        if (content.topic == 'default') {
            content.topic = content.model.getRelationship('topics')[0].uri;
        }
        this.model = content.model;
        this.el = '.sidebar-' + this.model.get('uri');
        this.$el = $(this.el);
        this.parent = content.model.parent;
        this.$el = $(this.el, this.parent);
        this.topic = Mediakron.getItemFromURI(content.topic);
        var type = this.topic.get('type');
        if (JST['sidebars.topics.' + type]) {
            this.template = JST['sidebars.topics.' + type];
        }

    },
    render: function() {
        var content = this.topic.toJSON();
        this.$el.html(this.template(content));
        return this;
    },
    afterRender: function() {

    },
    events: {
        'click .panel-body a': Mediakron.linkHandle,
        'click #toggleSidebar': Mediakron.sidebarHandle
    }
});

Mediakron.Sidebar.Maps = Backbone.View.extend({
    template: JST['widgets.maps'],
    el: false,
    initialize: function(content) {
        this.model = content.model;
        this.el = '.sidebar-' + this.model.get('uri');
        this.$el = $(this.el);
        this.parent = content.model.parent;
        this.$el = $(this.el, this.parent);
        this.map = Mediakron.getItemFromURI(content.map);
    },
    render: function() {
        var content = this.map.toJSON();
        this.$el.html(this.template(content));

        return this;
    },
    afterRender: function() {
        var parentHeight = $('.sidebar-active', this.parent).height() * 0.9;
        var map = Mediakron.Maps.Theme(this.map, 'map-sidebar-' + this.map.get('uri'), false, parentHeight),
            marker = map.markers[this.model.get('uri')];
        map.panTo(marker.getLatLng());
        marker.setIcon(Mediakron.Maps.Icons.highlight);
        marker.openPopup();

    },
    events: {
        'click .panel-body a': Mediakron.linkHandle,
        'click #toggleSidebar': Mediakron.sidebarHandle
    }
});