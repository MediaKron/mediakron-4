Mediakron.Relationships = {};

//deprecated
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

// doesn't seem to exist
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






