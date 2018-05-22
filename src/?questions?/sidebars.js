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