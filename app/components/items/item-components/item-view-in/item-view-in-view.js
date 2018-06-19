Mediakron.Sidebar.Init = Backbone.View.extend({
    template: JST['widgets.item-view-in'],
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