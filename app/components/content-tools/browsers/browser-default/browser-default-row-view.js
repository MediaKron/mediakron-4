Mediakron.ContentBrowser.Row = Backbone.View.extend({
    template: JST['settings.browser.row.default'],
    context: 'default',
    callback: false,
    thumbnails: false,
    initialize: function(data) {
        if (data.context) {
            this.template = JST['settings.browser.row.' + data.context];
        }
        if (data.callback) {
            this.callback = data.callback;
        }
        if (data.thumbnails) {
            this.thumbnails = data.thumbnails;
        }
        this.item = data.item;
        var topics = this.item.getRelationship('topics'),
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
            'timeline': []
        };
        for (t; t < count; t++) {
            topic = topics[t];
            if (topic) {
                item = Mediakron.getItemFromURI(topic.uri);
                if (item) {
                    type = item.get('type');
                    if (!this.collections[type]) this.collections[type] = [];
                    this.collections[type].push(topic);
                }
            }
        }
        this.collections.map = this.item.getRelationship('maps');
        this.collections.timeline = this.item.getRelationship('timelines');
        this.hasCollection = false;
        if (this.collections.map.length > 0 || this.collections.timeline.length > 0 || topics.length > 0) {
            this.hasCollection = true;
        }
        return this;
    },
    render: function() {
        var content = this.item.toJSON();
        content.item = this.item;
        content.thumbnails = this.thumbnails;
        content.hasCollection = this.hasCollection;
        content.collections = this.collections;
        this.$el.html(this.template(content));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .bulk-action': 'toggleSelect'
    },
    toggleSelect: function() {
        this.$el.toggleClass('selected');
    }
});
