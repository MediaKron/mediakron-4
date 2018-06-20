Mediakron.Relationships.controller = Mediakron.Extensions.View.extend({
    template: JST['settings.relationships.organize'],
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