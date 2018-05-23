Mediakron.Relationships.Manage.timeline = Mediakron.Relationships.Manage.abstract.extend({
    template: JST['settings.relationships.manage.timeline'],
    eventMap: {},
    startWidgets: {},
    endWidgets: {},
    initialize: function(item) {
        this.item = item;
        $('.timeline-template').addClass('content-push-sidebar'); /* move content to left  */
    },
    render: function() {
        this.eventMap = {};
        this.$el.html(this.template({
            'item': this.item.toJSON(),
            'model': this.item
        }));
        return this;
    },
    afterRender: function() {
        Mediakron.Status.formChanged = true;
        var timeline = this.item,
            events = this.item.getRelationship('events'),
            item, content, view = this,
            startWidget, endWidget, hoverIn = function() {
                $('.event-' + uri).addClass('active');
            },
            hoverOut = function() {
                $('.event-' + uri).removeClass('active');
            };
        _.each(timeline.$markers, function(div, uri) {
            div.hover(hoverIn, hoverOut);
        });
        _.each(events, function(event) {
            view.eventMap[event.uri] = {
                'start': event.data.start,
                'end': event.data.end
            };
            item = Mediakron.getItemFromURI(event.uri);
            if (item) {
                view.startWidgets[event.uri] = view.addStart({
                    date: event.data.start,
                    uri: event.uri
                });
                view.endWidgets[event.uri] = view.addEnd({
                    date: event.data.end,
                    uri: event.uri
                });
            }
        });
        $('select', view.$el).chosen({
            allow_single_deselect: true
        });
    },
    events: {
        'click .remove-item': 'removeRelationship',
        'click #done-editing': 'saveEvents',
        'click #cancel-editing': 'cancel',
        'click .overlay-bg': 'cancel',
        'click .close-button': 'cancel',
    },
    saveEvents: function(e) {
        Mediakron.Status.formChanged = false;
        var $div, start, end, changes = [],
            marker = {},
            range, value, view = this;
        _.each(this.eventMap, function(data, uri) {
            if (data.remove) {
                changes.push({
                    'uri': uri,
                    'remove': true,
                    'data': false
                });
            } else {
                var start = view.startWidgets[uri].validate('start'),
                    end = view.endWidgets[uri].validate('end');
                if (!start || !end) {
                    Mediakron.message({
                        text: "You have provided an invalid value for one of the date entries.  Please check the highlighted box and try again.",
                        type: 'warning',
                        'timeout': 3000,
                        'dismiss': true,
                        layout: 'center'
                    });
                    return false;
                }
                changes.push({
                    'uri': uri,
                    'data': {
                        start: start,
                        end: end
                    }
                });
            }
        });
        $('.timeline-' + this.item.get('uri')).timeline('serializeEvents');
        this.item.setRelationship('events', changes);
        $('#done-editing').html('<span class="mk-icon mk-save"> </span> Saving...');
        Mediakron.controller.reloadTimeMarkers = true;
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
                $('.timeline-' + item.get('uri')).timeline('serializeEvents');
                Mediakron.controller.gotoLast();
            }
        });
    },
    cancelSave: function() {
        this.item.goTo();
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
    },
    removeRelationship: function(e) {
        Mediakron.Status.formChanged = true;
        var $target = $(e.currentTarget),
            uri = $target.attr('uri'),
            length = this.changes.length,
            i = 0;
        this.eventMap[uri].remove = true;
        delete this.startWidgets[uri];
        delete this.endWidgets[uri];
        $target.closest("li").remove();
    },
    addStart: function(date) {
        var content = {
                parent: this,
                $parent: $('.start-date-' + date.uri),
                date: date.date
            },
            startWidget = new Mediakron.Timeline.selectWidget(content);
        startWidget.render();
        return startWidget;
    },
    addEnd: function(date) {
        var content = {
                parent: this,
                $parent: $('.end-date-' + date.uri),
                date: date.date
            },
            endWidget = new Mediakron.Timeline.selectWidget(content);
        endWidget.render();
        return endWidget;
    },
    setDate: function(position, type, value, uri) {
        if (!this.eventMap[uri]) this.eventMap[uri] = {
            start: false,
            end: false
        };
        if (!this.eventMap[uri][position]) this.eventMap[uri][position] = {};
        this.eventMap[uri][position][type] = value;
    },
    removeDate: function(position, type, uri) {
        delete this.eventMap[uri][position][type];
    }
});