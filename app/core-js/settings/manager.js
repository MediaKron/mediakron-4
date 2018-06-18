Mediakron.ContentManager = {};

Mediakron.ContentManager.Default = Mediakron.Extensions.View.extend({
    parent: false,
    child: false,
    data: false,
    type: false,
    label: false,

    renderData: {},
    bindpoint: false,
    initialize: function(data) {
        this.parent = data.parent;
        this.type = this.parent.getNormalType();
        this.child = data.child;
        this.data = data.data;
        this.renderData = data;
        this.relationshipType = data.type;
        this.afterInit(data);
    },
    afterInit: function(data) {},
    render: function() {
        this.$el.html(this.template(this.renderData));
    },
    afterRender: function(data) {
        if (this.bindpoint) this.bindpoint = $(this.bindpoint);
    },
    afterSave: function() {

    },
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': 'cancel',
        'click #cancel-editing': 'cancel',
        'click .overlay-bg': 'cancel',
        'click #done-editing': 'save',
    },
    cancel: function() {
        Mediakron.App.Events.trigger('content:create:cancel');
        Mediakron.controller.gotoLast();
    },
    validate: function(model, changes, message) {
        var validation = false,
            view = this;

        switch (this.type) {
            case 'timeline':
                validation = this.child.validateTimeline(changes);
                if (validation && message) {
                    Mediakron.message.error(validation);
                }
                var data = view.data;
                data.dateEntry = JST['settings.content.form.date.widget']({
                    start: false,
                    end: false,
                    type: 'traditional'
                });
                var contentview = new Mediakron.ContentManager.Edit({
                    parent: view.parent,
                    viewtype: view.type,
                    child: view.child,
                    data: data,
                    type: 'item'
                });
                Mediakron.controller.gotoAdmin(contentview);
                return false;
        }

        return true;
    },
    save: function() {
        this.parent.add(this.child, this.data);
        this.parent.save();
        Mediakron.controller.gotoLast();
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
    }
});

Mediakron.ContentManager.Create = Mediakron.ContentManager.Default.extend({
    template: JST['settings.content.manager.create'],
    bindpoint: '.add-bind',
    afterInit: function(data) {},
    events: {
        'click .add-link': 'addType',
        'click .close-button': 'cancel',
        'click #cancel-editing': 'cancel',
        'click .overlay-bg': 'cancel',
        'click #done-editing': 'save'

    },
    addType: function(e) {
        e.preventDefault();
        var target = $(e.currentTarget),
            type = target.attr('data-type'),
            view = this;
        $('.add-show').hide();
        this.bindpoint.removeClass('hide');
        var addPane = new Mediakron.Admin.AddContentPage({
            callback: function(model) {
                // Validate
                view.model = model;
                view.child = model;
                var valid = view.validate(model, {});
                if (valid) {
                    view.save();
                }
            },
            validate: function(model, changes) {
                view.child = model;
                return view.validate(model, changes, true);
            },
            type: type
        });
        addPane.setElement(this.bindpoint);
        addPane.render();
        addPane.afterRender();
        return false;
    }
});
/**
 * Build the browse interface for the content manager
 */
Mediakron.ContentManager.Browse = Mediakron.ContentManager.Default.extend({
    template: JST['settings.content.manager.browse'],
    bindpoint: '.browser-bind',
    afterRender: function(data) {
        var view = this;
        var viewdata = {
            'context': false,
            'filters': false,
            'skip': this.parent.skips(),
            'disabled': [
                "image",
                "video",
                "story",
                "file",
                "audio",
                "narrative",
                "slideshow",
                "folder",
                "progression",
                "comparison",
                "map",
                "maptimeline",
                "timeline"
            ],
            'callback': function(model) {
                view.child = model;
                view.model = model;
                var valid = view.validate(model, {});
                if (valid) {
                    view.save();
                }
            },
            'cancelCallback': function(item) {
                view.cancel();
            }
        };
        selector = new Mediakron.ContentBrowser.Selector(viewdata);
        selector.setElement(this.bindpoint);
        selector.render();
        selector.afterRender();
    }
});


Mediakron.ContentManager.Edit = Mediakron.ContentManager.Default.extend({
    template: JST['settings.content.manager.edit'],
    dateWidget: false,
    category: false,
    currentBind: false,
    currentTemplate: JST['widgets.currentCategory'],
    afterRender: function() {
        $('select', this.$el).chosen();
        this.currentBind = $('.currentCategory');
        this.bindColors();
        this.bindRemoveCategory();
    },
    afterInit: function(data) {
        this.renderData.inCategories = false;
        var relationship;
        if (this.relationshipType == 'item') {
            var start = this.child.start();
            if (!start) {
                // get from timeline relationship
                relationship = this.parent.fetchRelationship(this.child.get('uri'), 'events');
                if (relationship) {
                    if (relationship.data.start) start = relationship.data.start;
                }
            }
            var end = this.child.end();
            if (!end) {
                // get from timeline relationship
                relationship = this.parent.fetchRelationship(this.child.get('uri'), 'events');
                if (relationship) {
                    if (relationship.data.end) end = relationship.data.end;
                }
            }
            this.renderData.dateWidget = JST['settings.content.form.date.widget']({
                start: start,
                end: end,
                type: 'traditional'
            });
            this.renderData.item = this.child;
            this.renderData.inCategories = this.child.getRelationship('topics');

        } else {
            var renderdata = {
                start: {},
                end: {},
                type: 'traditional'
            };
            if (this.data.start) renderdata.start = this.data.start;
            if (this.data.end) renderdata.end = this.data.end;


            this.renderData.dateWidget = JST['settings.content.form.date.widget'](renderdata);
            this.renderData.item = false;
            this.renderData.label = '';
            if (this.data.title) this.renderData.label = this.data.title;
        }
        this.renderData.categories = Mediakron.items.where({ type: 'folder' });
        var category = this.getCategory();

        this.category = this.renderData.currentCategory = category;
        this.renderData.currentRender = false;
        if (category) {
            this.renderData.currentRender = this.currentTemplate({
                uri: category.get('uri'),
                title: category.get('title'),
                color: category.color()
            });
            
        } else {
            this.renderData.currentRender = this.currentTemplate({
                uri: false,
                title: 'No Category',
                color: '#000000'
            });
        }


    },

    bindColors: function() {
        var view = this;
        $('#layer-color').spectrum({
            showPaletteOnly: true,
            hideAfterPaletteSelect: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'more',
            togglePaletteLessText: 'less',
            clickoutFiresChange: true,
            preferredFormat: "hex",
            showInput: true,
            palette: [
                ["#030303", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            change: function(color) {

                view.color = color.toHexString();
                view.category.color(view.color);
                view.category.save();
                $('.current-folder-title').css({ 'background': color, 'color': 'getContrastColor(color)' });
            }
        });
    },
    events: {
        'click .add-link': 'addType',
        'click .close-button': 'cancel',
        'click #cancel-editing': 'cancel',
        'click .overlay-bg': 'cancel',
        'click #done-editing': 'save',
        'change #category': 'changeCategory',
        'click .add-category': 'addCategory',
        'click #remove-folder': 'removeFolder'
    },
    bindRemoveCategory: function(){
        var view = this;
        $('#remove-folder').click(function(){
            view.currentBind.empty();
            view.category = false;
            $('#category').val('nocategory');
            $('#category').trigger("chosen:updated");
        });
        
    },
    addCategory: function(e) {
        e.preventDefault();
        var view = this;
        var control = new Mediakron.ContentManager.QuickFolderAdd({
            'callback': function(item) {
                view.category = item;

                var html = view.currentTemplate({
                    uri: item.get('uri'),
                    title: item.get('title'),
                    color: item.color()
                });

                view.currentBind.html(html);
                view.bindColors();
                view.bindRemoveCategory();
                
            }
        });
    },
    changeCategory: function(e) {
        var uri = $(e.currentTarget).val();
        var html, view = this;
        if (uri == '000-nocategory') {
            this.category = false;
            html = this.currentTemplate({
                uri: false,
                title: 'No Category',
                color: '#000000'
            });
            this.currentBind.html(html);
            view.bindRemoveCategory();
        } else {
            var item = Mediakron.getItemFromURI(uri);
            if (item) {
                this.category = item;
                html = this.currentTemplate({
                    uri: this.category.get('uri'),
                    title: this.category.get('title'),
                    color: this.category.color()
                });
                this.currentBind.html(html);
                this.bindColors();
                view.bindRemoveCategory();
            }
        }
    },
    /**
     * 
     */
    renderAddFolder: function() {
        var view = this;
        var data = {
            'context': false,
            'filters': false,
            'skip': this.parent.skips(),
            'disabled': [
                "image",
                "video",
                "story",
                "file",
                "audio",
                "narrative",
                "slideshow",
                "folder",
                "progression",
                "comparison",
                "map",
                "maptimeline",
                "timeline"
            ],
            'callback': function(model) {
                view.child = model;
                view.model = model;
                var valid = view.validate(model, {});
                if (valid) {
                    view.save();
                }
            },
            'cancelCallback': function(item) {
                view.cancel();
            }
        };
        selector = new Mediakron.ContentBrowser.Selector(data);
        selector.setElement(this.bindpoint);
        selector.render();
        selector.afterRender();
    },
    /**
     * 
     */
    getDate: function(scope) {
        var date = {};
        if (!scope) return false;
        if (scope.length === 0) return false;
        if ($(".year input", scope).val().length > 0) date.year = $(".year input", scope).val();
        if ($("[date='month']", scope).val().length > 0) date.month = $("[date='month']", scope).val();
        if ($(".day input", scope).val().length > 0) date.day = $(".day input", scope).val();
        if ($(".hour input", scope).val().length > 0) date.hour = $(".hour input", scope).val();
        if ($(".minute input", scope).val().length > 0) date.minute = $(".minute input", scope).val();
        if ($(".second input", scope).val().length > 0) date.second = $(".second input", scope).val();

        if (_.size(date) > 0) return date;
        return false;
    },
    /**
     * 
     */
    getCategory: function() {
        if (this.data.category) {
            var category = Mediakron.getItemFromURI(this.data.category);
            if (category) return category;
            return false;
        }
        return false;
    },
    /**
     * 
     */
    validate: function(model, changes, message) {
        var validation = false,
            view = this;
        switch (this.type) {
            case 'timeline':
                if (this.relationshipType == 'item') {
                    validation = this.child.validateTimeline(changes.date);
                } else {
                    validation = Mediakron.validateTimeline(changes.date);
                }

                if (validation && message) {
                    Mediakron.message.error(validation);
                    return false;
                }

                break;
        }

        return true;
    },
    /**
     * 
     */
    save: function() {
        var view = this,
            relationship;

        var valid = this.validate(this.parent, {
            date: {
                start: view.getDate($('.datewidget-start')),
                end: view.getDate($('.datewidget-end'))
            }
        }, true);

        if (!valid) return false;

        if (this.relationshipType == 'item') {
            this.child.set({
                date: {
                    start: view.getDate($('.datewidget-start')),
                    end: view.getDate($('.datewidget-end')),
                }
            });

            this.child.save();
            if (this.category) {
                relationship = {
                    category: this.category.get('uri')
                };
                this.category.add(this.child, false);
            } else {
                relationship = false;
            }
            this.parent.add(this.child, relationship);

        } else {
            var category = false;
            if (this.category) {
                category = this.category.get('uri');
            }
            relationship = {
                start: view.getDate($('.datewidget-start')),
                end: view.getDate($('.datewidget-end')),
                title: $('#simple-label').val(),
                category: category,
                type: 'simple'
            };

            var events = this.parent.getRelationship('events');
            var uri = 'event-' + this.parent.get('uri') + '-' + Mediakron.user.id + '-' + Math.round(Math.random(10) * 1000000);
            if (this.child) {
                uri = this.child;
                for (i = 0; i < events.length; i++) {
                    if (events[i].uri == uri) {
                        events[i].data = relationship;
                    }
                }
            } else {
                events.push({
                    uri: uri,
                    data: relationship
                });
            }

            this.parent.setRelationship('events', events);
            this.parent.save();
        }
        $('.timeline-' + this.parent.get('uri')).timeline('redraw');
        Mediakron.controller.gotoLast();
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
    }

});

Mediakron.ContentManager.QuickFolderAdd = Mediakron.Extensions.View.extend({
    template: JST['widgets.quick.folder'],
    el: '#folder-quick-add',
    callback: false,
    color: '#000000',
    initialize: function(data) {
        this.callback = data.callback;
        this.$el.empty();
        this.render();
        var view = this;
        $('.new-color', this.$el).spectrum({
            showPaletteOnly: true,
            hideAfterPaletteSelect: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'more',
            togglePaletteLessText: 'less',
            clickoutFiresChange: true,
            preferredFormat: "hex",
            showInput: true,
            palette: [
                ["#030303", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            change: function(color) {
                view.color = color.toHexString();
            }
        });
    },
    afterInit: function(data) {},
    render: function() {
        this.$el.html(this.template(this.renderData));
        console.log($('#remove-folder'));
    },
    events: {
        'click a': Mediakron.linkHandle,
        'click .cancel': 'cancel',
        'click .save': 'save',
        'click #remove-folder': 'removeFolder'
    },
    cancel: function() {
        this.$el.empty();
    },
    removeFolder: function(){
        console.log('removing');
        this.$el.empty();
    },
    save: function() {
        Mediakron.message.pending('Creating Folder');
        var view = this;
        var category = new Mediakron.Models.Item({
            'title': $('.title', this.$el).val(),
            'type': 'folder'
        });
        category.color(this.color);
        category.save({}, {
            success: function() {
                Mediakron.message.success('Folder Created');
                view.$el.empty();
                view.callback(category);
            }
        });

    }

});