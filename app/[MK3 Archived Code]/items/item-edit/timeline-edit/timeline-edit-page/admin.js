Mediakron.Admin.Event = {};

Mediakron.Admin.Event.Default = Mediakron.Extensions.View.extend({
    timeline: false,
    event: false,
    request: false,
    initialize: function(data) {
        this.timeline = data.timeline;
        if (data.event) {
            this.event = data.event;
            if (this.event.data.background) {
                this.background = true;
            }
            this.start = this.event.data.end;
            this.end = this.event.data.end;
        } else {
            this.create = true;
        }
        this.afterInit(data);
    },
    afterInit: function(data) {},
    render: function() {

    },
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': 'cancel',
        'click #cancel-editing': 'cancel',
        'click .overlay-bg': 'cancel',
        'click #done-editing': 'save',
    },
});

// Event Management
Mediakron.Admin.Event.Simple = Mediakron.Admin.Event.Default.extend({
    template: JST['settings.timeline.simple'],
    afterInit: function(data) {
        this.label = this.event.data.label;
    },
});

Mediakron.Admin.Event.Create = Mediakron.Extensions.View.extend({
    template: JST['settings.map.create'],
    afterInit: function(data) {
        this.create = true;
    },
});

Mediakron.Admin.Event.Browse = Mediakron.Extensions.View.extend({
    template: JST['settings.map.browse'],
    afterInit: function(data) {},
});

Mediakron.Admin.Event.Date = Mediakron.Extensions.View.extend({
    template: JST['settings.map.browse'],
    afterInit: function(data) {},
});

Mediakron.Admin.Event.Date = Mediakron.Extensions.View.extend({
    template: JST['settings.map.browse'],
    afterInit: function(data) {},
});

Mediakron.Admin.EventAdd = Mediakron.Extensions.View.extend({
    template: JST['settings.map.event'],
    timeline: false,
    event: false,
    create: false,
    background: false,
    label: '',
    start: false,
    end: false,
    initialize: function(data) {
        this.timeline = data.timeline;
        if (data.event) {
            this.event = data.event;
            if (this.event.data.background) {
                this.background = true;
            }
            this.label = this.event.data.label;
            this.start = this.event.data.end;
            this.start = this.event.data.end;
        } else {
            this.create = true;
        }
    },

    render: function() {
        var view = this;

        var content = {
            timeline: this.timeline,
            background: this.background,
            uri: this.uri,
            label: this.label,
            start: this.start,
            end: this.end
        };

        $(this.el).html(this.template(content));
        $(this.el).append('<div id="admin-link-content" class="marker-add-pane" />');

        return this;
    },

    afterRender: function() {
        var start = false,
            end = false;
        if (!this.layer) this.layer = { 'data': {} };
        if (this.layer.data.start) start = this.layer.data.start;
        if (this.layer.data.end) end = this.layer.data.end;
        this.startWidget = new Mediakron.Timeline.selectWidget({
            parent: this,
            $parent: $('.start-date-fields'),
            date: start,
            map: true
        });
        this.startWidget.render();
        this.endWidget = new Mediakron.Timeline.selectWidget({
            parent: this,
            $parent: $('.end-date-fields'),
            date: end,
            map: true
        });
        this.endWidget.render();
    },
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': 'cancel',
        'click #cancel-editing': 'cancel',
        'click .overlay-bg': 'cancel',
        'click #done-editing': 'save',
    },
    cancel: function(e) {
        if (!this.marker.options.editing) this.marker.options.editing = {};
        this.marker.editing.disable();
        Mediakron.Edit.cancelEdit(e);
    },
    save: function(e) {

        var children = this.map.model.getRelationship('layers'),
            count = children.length,
            i = 0,
            child, extract;

        if (this.changes) {
            if (this.changes.uri) {
                this.layer.uri = this.changes.uri;
            }
        }

        this.marker.editing.disable();
        var label = $('#simple-label').val();
        this.layer.data.label = label.replace(/'/g, '&#39;');

        if (this.map.model.get('template') == 'timemap') {
            var start = this.startWidget.validate(false),
                end = this.endWidget.validate('end');
            this.layer.data.start = start;
            this.layer.data.end = end;
        }

        this.layer.data.layer = this.filter;


        if (this.layer.data.type == 'point') {
            this.layer.data.coordinate = this.marker.getLatLng();
        } else {
            this.layer.data.coordinate = this.marker.getLatLngs();
        }

        for (i; i < count; i++) {
            child = children[i];

            if (child.uri == this.oldURI) {

                if (this.uri !== this.oldURI) {
                    extract = child;
                    delete children[i];
                    extract = {
                        uri: this.oldURI,
                        data: false,
                        remove: true
                    };

                    if (extract.uri) {
                        children.push(extract);
                    } else {
                        this.nochild = true;
                    }
                    this.layer.data.nochild = this.nochild;
                    children[i] = this.layer;
                } else {
                    children[i] = this.layer;
                }

            }
        }
        this.map.model.setRelationship('layers', children);
        this.map.model.save({}, {
            'success': function() {
                Mediakron.Status.CurrentMap.removeMarkers();
                Mediakron.Status.CurrentMap.drawMarkers();

                Mediakron.App.Events.trigger('marker:edit');
            }
        });
        Mediakron.Status.formChanged = false;
        Mediakron.Edit.cancelEdit(e);
    },
    removeItem: function() {
        $('#selected-map').remove();
        $('.marker-content-options').removeClass('hide');
        this.oldURI = this.uri;
        this.uri = 'map-unassigned-' + Math.floor(Math.random() * 90000) + 10000;
        this.nochild = true;
        this.changes.uri = this.uri;
    },
});