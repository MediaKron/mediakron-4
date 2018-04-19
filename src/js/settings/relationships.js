Mediakron.Relationships = {};

Mediakron.Relationships.controller = Mediakron.Extensions.View.extend({
    template: JST['settings.relationships.control'],
    className: 'pages pages-layout layout-pages',
    initialize: function(data) {
        this.model = data.item;
        this.view = data.view;
        this.current = data.current;
        return this;
    },
    render: function() {
        var content = this.model.toJSON();
        content.current = this.current;
        this.$el.append(this.template(content)).addClass(this.className);
        return this;
    },
    afterRender: function() {
        this.view.render();
        $('#manage').html(this.view.$el);
        this.view.afterRender();
    },
    events: {
        'click a': Mediakron.linkHandle
    }
});
Mediakron.Relationships.getSelect = function(item, callback, type) {
    var selectorClass = 'Selector',
        context = 'selector',
        primary = item,
        filter = false;
    if (type) {
        filter = type;
    }
    if (item.getNormalType() == 'map') {
        selectorClass = 'SelectorMap';
        context = 'selectormap';
    }
    if (item.getNormalType() == 'narrative') {
        selectorClass = 'Narrative';
        context = 'narrative';
    }
    if (item.getNormalType() == 'timeline') {
        selectorClass = 'Timeline';
        context = 'timeline';
    }
    if (!callback) {
        callback = function(item, data, after) {
            var primary = Mediakron.manageController.model,
                getView, view, uri = primary.get('uri'),
                context = Mediakron.getItemFromURI(uri);
            itemUri = item.get('uri');
            if (!data) {
                data = primary.defaultData();
            }
            context.add(item, data);
            if (context.get('type') == 'timeline') {
                $('.timeline-' + uri).timeline('serializeEvents');
                Mediakron.controller.refreshPrimary();
            } else if (context.getNormalType() == 'map') {
                Mediakron.Status.CurrentMap.removeMarkers();
                Mediakron.Status.CurrentMap.drawMarkers();
            } else if (context.getNormalType() == 'slideshow') {
                Mediakron.controller.refreshPrimary();
            } else if (context.getNormalType() == 'folder') {
                Mediakron.controller.refreshLast();
            } else {
                Mediakron.controller.refreshPrimary();
            }
            if (after) {
                after();
            }
            Mediakron.ContentBrowser.filter.filter = false;
            Mediakron.message({
                'timeout': 4000,
                'type': 'success',
                'text': '<span class="mk-icon mk-save"></span> Item added',
                'layout': 'bottom',
                'confirm': false,
                'dismiss': true
            });
        };
    }
    var selector = new Mediakron.ContentBrowser[selectorClass]({
        'callback': callback,
        'context': context,
        'skip': item.skips(),
        'filters': filter,
        'item': item,
        'cancelCallback': function() {
            Mediakron.ContentBrowser.filter.filter = false;
            item.goTo();
        }
    });
    selector.query.disabled = Mediakron.Contexts[item.getNormalType()].children;
    return selector;
};
Mediakron.Relationships.getAdd = function(item) {
    var request = {
            type: item.create
        },
        source, AddContent = new Mediakron.Admin.AddContentPage(request);
    AddContent.callback = function(item) {
        var getView, view, primary = Mediakron.manageController.model,
            data = primary.defaultData();
        primary.add(item, data);
        Mediakron.controller.refreshPrimary();
        primary.goTo();
        Mediakron.message({
            'timeout': 4000,
            'type': 'success',
            'text': 'Item added',
            'layout': 'bottom',
            'confirm': false,
            'dismiss': true
        });
    };
    return AddContent;
};
Mediakron.Relationships.getEdit = function(item) {
    var request = {
        type: item.getNormalType(),
        edit: true,
        item: item
    };
    return new Mediakron.Admin.AddContentPage(request);
};
Mediakron.Relationships.getManage = function(item) {
    var type = item.getNormalType(),
        view = new Mediakron.Relationships.Manage[type](item);
    return view;
};
Mediakron.Relationships.Selection = Backbone.View.extend({
    template: JST['settings.relationships.select'],
    item: false,
    el: "#add-to-relationship",
    content: false,
    browser: false,
    lightbox: false,
    initialize: function(content) {
        this.content = content;
    },
    render: function() {
        $(this.el).html(this.template(this.content));
        return this;
    },
    callback: function(item) {
        var getView, view;
        if (Mediakron.context.item) {
            var data = Mediakron.context.item.defaultData();
            Mediakron.context.item.add(item, data);
            Mediakron.router.refresh();
        }
    },
    hideLoad: function() {
        $('#edit-loading').hide();
    },
    events: {
        'click #tab-existing': 'showExisting',
        'click #tab-new': 'showNew',
        'click .create': 'goToAdd',
        'click a': Mediakron.linkHandle,
        'click #add-content-context': 'dropdown'
    },
    dropdown: function(e) {
        e.preventDefault();
        $(e.currentTarget).next().slideToggle();
        return false;
    },
    showExisting: function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#browser').show();
        $('#add-content').hide();
    },
    showNew: function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#browser').hide();
        $('#add-content').show();
    },
    goToAdd: function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var type = $(e.currentTarget).attr('type'),
            request = {
                type: type
            },
            AddContent = new Mediakron.Admin.AddContentPage(request);
        AddContent.callback = this.callback;
        Mediakron.lightbox.goToView(AddContent);
    }
});
Mediakron.Relationships.Tools = Backbone.View.extend({
    template: JST['settings.relationships.tool'],
    el: 'footer .right',
    item: false,
    context: false,
    callback: function(item) {
        var getView, view;
        if (Mediakron.context.item) {
            var data = Mediakron.context.item.defaultData();
            Mediakron.context.item.add(item, data);
            Mediakron.router.refresh();
        }
        Mediakron.lightbox.close();
    },
    initialize: function() {
        var manage = this,
            context = false,
            item = false;
        Mediakron.App.Events.on("context:set", function(event) {
            if (event.change && event.model) {
                manage.context = event.model;
                context = manage.context.get('uri');
            }
            manage.render();
        });
        Mediakron.App.Events.on("context:goto", function(event) {
            if (event.view.model) {
                item = event.view.model.get('uri');
                if (context != item) {
                    manage.item = event.view.model;
                }
                manage.render();
            }
        });
    },
    render: function() {
        this.$el.html(this.template({
            'context': this.context,
            'item': this.item
        }));
        return this;
    },
    events: {
        'click #annotate-this-image': 'annotateImage',
        'click a': Mediakron.linkHandle
    },
    annotateImage: function() {
        $(".annotate img").annotateImage('makeEditable');
    },
});
Mediakron.Relationships.Manage = {};
Mediakron.Relationships.Manage.abstract = Backbone.View.extend({
    template: JST['settings.relationships.manage'],
    item: false,
    children: [],
    classes: 'managing',
    changes: [],
    initialize: function(item) {
        this.item = item;
        var children = item.getRelationship('children'),
            length = children.length,
            i = 0;
        this.changes = children;
        for (i; i < length; i++) {
            this.children.push(Mediakron.getItemFromURI(children[i].uri));
        }
    },
    hideLoad: function() {
        $('#edit-loading').hide();
    },
    render: function() {
        var view = this;
        this.$el.html(this.template({
            'item': this.item.toJSON(),
            'children': this.children,
            'model': this.item
        }));
        return this;
    },
    afterRender: function() {},
    events: {
        'click .remove-item': 'removeRelationship',
        'click #done-editing': 'save',
        'click #cancel-editing': 'cancel',
        'click .close-button': 'cancel',
        'click .overlay-bg': 'cancel',
        'click .fade-screen-sidebar': 'cancel',
        'blur .field': 'change'
    },
    change: function() {
        Mediakron.Status.formChanged = true;
    },
    save: function() {
        Mediakron.Status.formChanged = false;
        var length = this.changes.length,
            i = 0,
            view = this;
        this.item.setRelationship('children', this.changes);
        // hiding until we can have this appear without stacking the save message
        //        Mediakron.message({
        //            'timeout':     3000,
        //            'type':        'info',
        //            'text':        'Updating Record...',
        //            'layout':      'bottom',
        //            'confirm':     false,
        //            'dismiss':      true
        //            
        //        });
        $('#done-editing').html('<span class="mk-icon mk-save"> </span> Saving...');
        this.item.save({}, {
            success: function(item) {
                Mediakron.message({
                    'timeout': 4000,
                    'type': 'success',
                    'text': '<span class="mk-icon mk-save"></span>Changes Saved',
                    'layout': 'bottom',
                    'confirm': false,
                    'dismiss': true
                });
                Mediakron.controller.refreshPrimary();
                Mediakron.controller.gotoLast();
                Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
            }
        });
    },
    cancel: function() {
        if (Mediakron.Status.formChanged) {
            var uri = this.item.get('uri');
            text = "You have unsaved changes on this form.  Are you sure you want to cancel?";
            accept = function(request) {
                Mediakron.Status.formChanged = false;
                Mediakron.controller.gotoLast();
            };
            reject = function(request) {};
            Mediakron.message({
                text: text,
                type: 'warning',
                timeout: 0,
                layout: 'center',
                confirm: true,
                callback: function() {
                    accept();
                },
                cancel: function() {
                    reject();
                }
            });
        } else {
            Mediakron.controller.gotoLast();

            /* If there's a map, refresh width it after closing */
            setTimeout(function() { Mediakron.Status.CurrentMap.invalidateSize(); }, 400);
        }
    },
    removeRelationship: function(e) {
        Mediakron.Status.formChanged = true;
        var $target = $(e.currentTarget),
            uri = $target.attr('uri'),
            length = this.changes.length,
            i = 0;
        for (i; i < length; i++) {
            if (this.changes[i]) {
                if (uri == this.changes[i].uri) {
                    this.changes[i].remove = true;
                    $target.closest("li").remove();
                }
            }
        }
    }
});
Mediakron.Relationships.Manage.slideshow = Mediakron.Relationships.Manage.abstract.extend({
    template: JST['settings.relationships.manage.slideshow'],
    afterRender: function() {
        var view = this;
        $('#sort-slideshow').sortable({
            placeholder: "ui-state-highlight",
            handle: ".drag-item",
            stop: function(event, ui) {
                Mediakron.Status.formChanged = true;
                var uri, type, title, order = [];
                $('#sort-slideshow li').each(function() {
                    item = $(this);
                    uri = item.attr('uri');
                    data = JSON.parse(_.unescape(item.attr('data')));
                    order.push({
                        'uri': uri,
                        'data': data
                    });
                });
                view.changes = order;
            }
        });
    }
});
Mediakron.Relationships.Manage.narrative = Mediakron.Relationships.Manage.abstract.extend({
    template: JST['settings.relationships.manage.narrative'],
    events: {
        'click .remove-item': 'removeRelationship',
        'click #done-editing': 'save',
        'click #cancel-editing': 'cancel',
        'click .close-button': 'cancel',
        'click .overlay-bg': 'cancel',
        'blur .field': 'change'
    },
    change: function() {
        Mediakron.Status.formChanged = true;
    },
    save: function() {
        Mediakron.Status.formChanged = false;
        var length = this.changes.length,
            i = 0,
            order = [],
            change, view = this;
        for (i; i < length; i++) {
            change = this.changes[i];
            uri = change.uri;
            item = $('.nr-sort-' + uri);
            if (item.attr('data')) {
                data = JSON.parse(item.attr('data'));
                itemTemplate = $('.narrative-template-' + uri).val();
                if (itemTemplate) {
                    if (!data) {
                        data = {};
                    }
                    data.template = itemTemplate;
                }
                data.hideTitle = $('.hide-title-' + uri).prop('checked');
                data.hideSidebar = $('.hide-sidebar-' + uri).prop('checked');
            } else {
                data = false;
            }
            if (change.remove) {
                order.push({
                    'uri': uri,
                    'data': data,
                    remove: true
                });
            } else {
                order.push({
                    'uri': uri,
                    'data': data
                });
            }
        }
        this.changes = order;
        $('#done-editing').html('<span class="mk-icon mk-save"> </span> Saving ');
        // hiding until we can have this appear without stacking the save message
        //        this.item.setRelationship('children',this.changes);
        //        Mediakron.message({
        //            'timeout':     3000,
        //            'type':        'success',
        //            'text':        'Updating record...',
        //            'layout':      'top',
        //            'confirm':     false,
        //            'dismiss':      true
        //            
        //        });
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
                Mediakron.controller.refreshPrimary();
            }
        });
    },
    afterRender: function() {
        $('.narrative-template-select').chosen({
            allow_single_deselect: true
        });
        var view = this;
        $('#sort-narrative').sortable({
            placeholder: "ui-state-highlight",
            handle: ".drag-item",
            stop: function(event, ui) {
                Mediakron.Status.formChanged = true;
                var item, itemTemplate, uri, type, title, order = [];
                $('#sort-narrative li').each(function() {
                    item = $(this);
                    uri = item.attr('uri');
                    data = JSON.parse(item.attr('data'));
                    itemTemplate = $('.narrative-template-' + uri).val();
                    if (!itemTemplate) {
                        itemTemplate = 'default';
                    }
                    data.template = itemTemplate;
                    order.push({
                        'uri': uri,
                        'data': data
                    });
                });
                view.changes = order;
            }
        });
    }
});
Mediakron.Relationships.Manage.comparison = Mediakron.Relationships.Manage.abstract.extend({
    template: JST['settings.relationships.manage.comparison'],
    afterRender: function() {
        var view = this;
        $('#sort-comparison').sortable({
            placeholder: "ui-state-highlight",
            stop: function(event, ui) {
                Mediakron.Status.formChanged = true;
                var uri, type, title, order = [];
                $('#sort-comparison li').each(function() {
                    item = $(this);
                    uri = item.attr('uri');
                    data = JSON.parse(item.attr('data'));
                    order.push({
                        'uri': uri,
                        'data': data
                    });
                });
                view.changes = order;
            }
        });
    }
});
Mediakron.Relationships.Manage.folder = Mediakron.Relationships.Manage.abstract.extend({
    template: JST['settings.relationships.manage.slideshow'],
    afterRender: function() {
        var view = this;
        $('#sort-slideshow').sortable({
            placeholder: "ui-state-highlight",
            handle: ".drag-item",
            stop: function(event, ui) {
                Mediakron.Status.formChanged = true;
                var uri, type, title, order = [];
                $('#sort-slideshow li').each(function() {
                    item = $(this);
                    uri = item.attr('uri');
                    data = JSON.parse(item.attr('data'));
                    order.push({
                        'uri': uri,
                        'data': data
                    });
                });
                view.changes = order;
            }
        });
    }
});
Mediakron.Relationships.Manage.tag = Mediakron.Relationships.Manage.abstract.extend({
    template: JST['settings.relationships.manage.slideshow'],
    afterRender: function() {
        var view = this;
        $('#sort-slideshow').sortable({
            placeholder: "ui-state-highlight",
            handle: ".drag-item",
            stop: function(event, ui) {
                Mediakron.Status.formChanged = true;
                var uri, type, title, order = [];
                $('#sort-slideshow li').each(function() {
                    item = $(this);
                    uri = item.attr('uri');
                    data = JSON.parse(item.attr('data'));
                    order.push({
                        'uri': uri,
                        'data': data
                    });
                });
                view.changes = order;
            }
        });
    }
});
// Organize map
Mediakron.Relationships.Manage.map = Mediakron.Relationships.Manage.abstract.extend({
    template: JST['settings.relationships.manage.map'],
    order: [],
    layers: [],
    initialize: function(item) {
        this.item = item;
        this.layers = this.item.getRelationship('layers');
        /* $('.map-template').addClass('content-push-sidebar');  move content to left  */
        /* setTimeout(function(){ Mediakron.Status.CurrentMap.invalidateSize(); }, 400);  Refresh map width */
    },
    render: function() {
        this.$el.html(this.template({
            'item': this.item.toJSON(),
            'model': this.item
        }));
        var map = Mediakron.Status.CurrentMap,
            view = this,
            mark;
        map.drawMarkers();
        $('.timeline-slider').slider('values', 0, 0);
        $('.timeline-slider').slider('values', 1, 100);
        _.each(map.markers, function(marker, uri) {
            if (marker) {
                mark = view.layers[uri];
                marker.on('mouseover', function() {
                    $('.manage-layer-' + uri).addClass('active');
                });
                marker.on('mouseout', function() {
                    $('.manage-layer-' + uri).removeClass('active');
                });
                if (!marker.options.editing) marker.options.editing = {};
                marker.editing.enable();
                marker.on('dragend', function(e) {
                    Mediakron.Status.formChanged = true;
                    var lnglat = e.target.getLatLng();
                    $('.manage-layer-' + uri + ' .coordinates').text(lnglat.lng + ',' + lnglat.lat);
                });
                marker.off("click");

            }
        });
        return this;
    },
    afterRender: function() {
        var view = this;
        var item, uri, data, order = [];
        $('#manage-map-list li').each(function() {
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
            stop: function(event, ui) {
                Mediakron.Status.formChanged = true;
                var uri, type, title, order = [];
                $('#manage-map-list li').each(function() {
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
        /* $('.map-template').addClass('content-push-sidebar');move content to left  */
        /*  setTimeout(function(){ Mediakron.Status.CurrentMap.invalidateSize(); }, 400); /* Refresh map width */
    },
    events: {
        'click .remove-item': 'removeRelationship',
        'click #done-editing': 'saveMarkers',
        'click #cancel-editing': 'cancel',
        'click .close-button': 'cancel',
        'click .overlay-bg': 'cancel',
        'mouseover .manage-map-list li': 'highlightMarker',
        'mouseout .manage-map-list li': 'unhighlightMarker'
    },
    highlightMarker: function(e) {
        var map = Mediakron.Status.CurrentMap,
            $target = $(e.currentTarget),
            uri = $target.attr('uri');

        if (map.markers[uri]) {
            if (map.markers[uri].layer) {
                if (map.markers[uri].layer == 'point') map.markers[uri].setIcon(Mediakron.Maps.Icons.highlight);
            }
        }
    },
    unhighlightMarker: function(e) {
        var map = Mediakron.Status.CurrentMap,
            $target = $(e.currentTarget),
            uri = $target.attr('uri');
        if (map.markers[uri]) {
            if (map.markers[uri].layer) {
                if (map.markers[uri].layer == 'point') map.markers[uri].setIcon(Mediakron.Maps.Icons.normal);
            }
        }
    },
    saveMarkers: function(e) {
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
        });
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


    },
    cancelSave: function() {
        // Mediakron.router.refresh();
    },
    removeRelationship: function(e) {
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
});
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
Mediakron.Relationships.Manage.progression = Mediakron.Relationships.Manage.abstract.extend({
    template: JST['settings.relationships.manage.progression'],
    initialize: function(item) {
        this.item = item;
        var children = item.getRelationship('children'),
            length = children.length,
            i = 0;
        this.changes = children;
        $('.progression-frame').progression('makeEditable');
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay so edit area is available  */
        $('.progression-template').addClass('content-push-sidebar');
    },
    render: function() {
        this.$el.html(this.template({
            item: this.item.toJSON(),
            'model': this.item
        }));
        return this;
    },
    remove: [],
    afterRender: function() {
        var view = this;
        $('#sort-slideshow').sortable({
            placeholder: "ui-state-highlight",
            handle: ".drag-item",
            stop: function(event, ui) {
                Mediakron.Status.formChanged = true;
                var uri, type, title, order = [];
                $('#sort-slideshow li').each(function() {
                    item = $(this);
                    uri = item.attr('uri');
                    data = JSON.parse(item.attr('data'));
                    order.push({
                        'uri': uri,
                        'data': data
                    });
                });
                view.changes = order;
                $('.progression-frame').progression('reorder', order);
            }
        });
    },
    events: {
        'click .remove-item': 'removeRelationship',
        'click #done-editing': 'saveProgression',
        'click #cancel-editing': 'cancelSave',
        'click .overlay-bg': 'cancel',
        'click .close-button': 'cancelSave'
    },
    saveProgression: function() {
        Mediakron.Status.formChanged = false;
        var order = this.changes,
            i = 0,
            length = this.remove.length;
        for (i; i < length; i++) {
            order.push(this.remove[i]);
        }
        $('#done-editing').html('<span class="mk-icon mk-save"> </span> Saving...');
        $('.progression-frame').progression('reorder', order);
        $('.progression-frame').progression('save');
        Mediakron.message({
            'timeout': 4000,
            'type': 'success',
            'text': '<span class="mk-icon mk-save"></span> Changes saved',
            'layout': 'bottom',
            'confirm': false,
            'dismiss': true
        });
        Mediakron.controller.gotoLast();
    },
    cancelSave: function() {
        $('.progression-frame').progression('cancel');
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
        this.cancel();
    },
    removeRelationship: function(e) {
        Mediakron.Status.formChanged = true;
        var $target = $(e.currentTarget),
            uri = $target.attr('uri'),
            length = this.changes.length,
            i = 0;
        for (i; i < length; i++) {
            if (this.changes[i]) {
                if (uri == this.changes[i].uri) {
                    this.changes[i].remove = true;
                    this.remove.push(this.changes[i]);
                    delete this.changes[i];
                    $target.parent().parent().remove();
                }
            }
        }
        $('.progression-frame').progression('remove', uri);
    }
});