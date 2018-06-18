Mediakron.ContentBrowser = {};
Mediakron.ContentBrowser.filter = {
    thumbnail: false,
    filter: false,
    sort: false,
    skip: false,
    search: false,
    result: false,
    disabled: false,
    user: false,
    archived: false
};


Mediakron.ContentBrowser.View = Mediakron.Extensions.View.extend({
    template: JST['components.browsers.content'],
    sortDirection: 1,
    context: 'default',
    title: 'Browse Content',
    callback: false,
    cancelCallback: false,
    item: false,
    noresult: 'components.browser.no.results',
    query: {},
    row_count: 40,
    hideLoad: function() {
        $('#edit-loading').hide();
    },
    tbody: false,
    prerender: function() {},
    help: 'Use this interface to administer content',
    initialize: function(data) {
        if (data.el) {
            this.el = data.el;
            this.$el = $(this.el);
        }
        if (data.item) {
            Mediakron.Status.Managing = data.item;
            this.item = data.item;
        }
        Mediakron.ContentBrowser.filter.user = false;
        this.query = Mediakron.ContentBrowser.filter;
        this.query.archived = false;
        this.query.criteria = data.criteria;

        if(!this.query.disabled && !data.disabled ){
          this.query.disabled = 
            [
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
            ];
        }
        if (data.criteria == 'user') {
            this.query.user = data.query;
        } else {
            if (data.user) {
                this.query.user = data.user;
            }
        }
        if (data.thumbnail) {
            this.query.thumbnail = data.thumbnail;
        } else if (this.query.thumbnail) {} else {
            this.query.thumbnails = 150;
        }
        if (data.sort) {
            this.query.sort = data.sort;
        }
        if (data.filters) {
            this.query.filter = data.filters;
        }
        if (data.skip) {
            this.query.skip = data.skip;
        }else{
          this.query.skip = false;
        }
        if (data.search) {
            this.query.search = data.search;
        }
        if (data.result) {
            this.query.result = data.result;
        }
        if (data.disabled) {
            this.query.disabled = data.disabled;
        }
        if (data.archived) {
            this.query.archived = data.archived;
        }
        if (data.context) {
            this.context = data.context;
        }
        if (data.cancelCallback) {
            this.cancelCallback = data.cancelCallback;
        }
        if (data.callback) {
            this.callback = data.callback;
        }

        $('body').addClass(this.className);
        if (data.items) {
            this.items = data.items;
        } else if (data.archived) {
            this.items = data.archived;
        } else {
            this.items = Mediakron.items;
        }
        
        this.topics = Mediakron.topics;
        this.maps = Mediakron.maps;
        this.timelines = Mediakron.timelines;
        this.comparisons = Mediakron.comparisons;
        var view = this;
        this.render();
    },
    render: function() {
        var content = {
            title: this.title,
            help: this.help,
            context: this.context,
            item: this.item,
            count: this.items.length
        };

        this.$el.html(this.template(content));
        return this;
    },
    close: function() {
        $('body').removeClass(this.className);
    },
    afterRender: function(reset) {
        if (this.edit) {
            this.$el.append('<div id="edit-loading" >Loading</div>');
        }
        this.tbody = new Mediakron.ContentBrowser.Body({
            context: this.context,
            items: false,
            callback: this.callback,
            query: this.query,
            reset: reset,
            empty: JST[this.noresult](),
            row_count: this.row_count
        }).render();
        $('#content-filters select').chosen({
            allow_single_deselect: true
        }); /* preserve active searchbox styling when returning to page */
        if ($('#search-rows').val()) {
            $('#search-rows').addClass('search-active');
            $('.empty-search').addClass('visible');
        }
        return this;
    },
    events: {
        'click a':  Mediakron.linkHandle,
        'change #sort': 'sortTable',
        'change #filter': 'filterTable',
        'change #user': 'filterUser',
        'change #mycontent': 'myContent',
        'change #thumbnail': 'changeThumbnails',
        'change #bulk': 'changeBulk',
        'keyup  #search-rows': 'search',
        'click .add-new-button': 'dropdown',
        'click #list-view': 'toggleList',
        'click #gallery-view': 'toggleGallery',
        'click #cancel-editing': 'cancel',
        'click #close-settings-context': 'cancel',
        'click .close-button': 'cancel',
        'click .overlay-bg': 'cancel',
        'click .fade-screen-sidebar ': 'cancel',
        'click #add-external': 'externalCallback',
        'click .select-all': 'selectAll',
        'click .toggle-filters': 'toggleFilters',
        'click .tab-link': 'tab',
        'click .empty-search': 'emptySearch',
        'click .open-modal': 'openModal',
        'click .close-modal': 'closeModal'
    },
    tab: function(e) {
        e.preventDefault();
        var target = $(e.currentTarget),
            open = $('.tab-content.is-open'),
            closed = $('.tab-content:not(.is-open)');
        if (target.hasClass('is-active')) {} else {
            open.removeClass('is-open').hide();
            closed.addClass('is-open').show();
            $('.tab-link.is-active').removeClass('is-active');
            target.addClass('is-active');
        }
        return false;
    },
    selectAll: function(e) {
        var checked = $(e.currentTarget).prop('checked');
        $('.bulk-action').click();
    },
    cancel: function() {
        Mediakron.ContentBrowser.filter.skip = [];
        this.cancelCallback();
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
        return false;
    },
    externalCallback: function() {
        var link = $('#external-link').val();
        this.callback({
            'external': link
        });
        return false;
    },
    toggleList: function(e) {
        $('#admin-content').addClass('list-view').removeClass('gallery-view');
        $('#list-view').addClass('active');
        $('#gallery-view').removeClass('active');
        this.query.thumbnails = 50;
        this.tbody.query = this.query;
        this.tbody.render();
    },
    toggleGallery: function(e) {
        $('#admin-content').removeClass('list-view').addClass('gallery-view');
        $('#list-view').removeClass('active');
        $('#gallery-view').addClass('active');
        this.query.thumbnails = 150;
        this.tbody.query = this.query;
        this.tbody.render();
    },
    dropdown: function(e) {
        e.preventDefault();
        $(e.currentTarget).next().slideToggle();
        return false;
    },
    openModal: function(e) {
        $('.modal-content').attr({'data-visually-hidden': 'true'});
        e.preventDefault();
        $(e.currentTarget).next().attr({'data-visually-hidden': 'false'});
        return false;
    },
    closeModal: function(e) {
        e.preventDefault();
        $(e.currentTarget).parent().attr({'data-visually-hidden': 'true'});
        return false;
    },
    search: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var search = $(e.currentTarget).val(); /* add active searchbox styling when field has content  */
        if (search) {
            $('#search-rows').addClass('search-active');
            $('.empty-search').addClass('visible');
        } else {
            $('#search-rows').removeClass('search-active');
            $('.empty-search').removeClass('visible');
        }
        this.query.search = search;
        this.tbody.query = this.query;
        this.tbody.render();
        return false;
    },
    /* Remove active searchbox styling when clicking close icon */
    emptySearch: function(e) {
        $('#search-rows').val('').removeClass('search-active');
        $('.empty-search').removeClass('visible');
        this.query.search = false;
        this.tbody.query = this.query;
        this.tbody.render();
    },
    sortTable: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var sort = $(e.currentTarget).val();
        this.query.sort = sort;
        this.tbody.query = this.query;
        this.tbody.render();
        return false;
    },
    filterUser: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var user = $(e.currentTarget).val();
        if (user > -1) {
            this.query.user = user;
        } else {
            this.query.user = false;
        }
        this.tbody.query = this.query;
        this.tbody.render();
        return false;
    },
    /* Show only logged in user's content */
    myContent: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var user = $(e.currentTarget).val();
        if ($('#mycontent').is(':checked')) {
            this.query.user = user;
            $('#user').val('').trigger('chosen:updated');
        } else {
            this.query.user = false;
        }
        this.tbody.query = this.query;
        this.tbody.render();
        return false;
    },
    filterTable: function(e) {
        e.stopPropagation();
        e.preventDefault();
        var filter = $(e.currentTarget).val();
        this.query.filter = filter;
        this.tbody.query = this.query;
        this.tbody.render();
        return false;
    },
    changeThumbnails: function(e) {
        var target = $(e.currentTarget).val();
        this.query.thumbnails = target;
        this.tbody.query = this.query;
        this.tbody.render();
    },
    changeBulk: function(e) {
        var action = $(e.currentTarget).val(),
            accept, reject, text, target = $('#content-manage'),
            view = this;
        $('#bulk').val(0);
        $('#bulk').trigger("chosen:updated");
        switch (action) {
        case 'publish':
            text = "Are you sure you want to publish these items?";
            accept = this.bulkPublish;
            reject = function(request) {
                Mediakron.messages.message("No changes made");
            };
            Mediakron.message({
                text: text,
                type: 'warning',
                timeout: 0,
                layout: 'center',
                confirm: true,
                callback: function() {
                    accept({
                        'view': view
                    });
                },
                cancel: function() {
                    reject();
                }
            });
            break;
        case 'unpublish':
            text = "Are you sure you want to unpublish these items?";
            accept = this.bulkUnpublish;
            reject = function(request) {
                Mediakron.messages.message("No changes made");
            };
            Mediakron.message({
                text: text,
                type: 'warning',
                timeout: 0,
                layout: 'center',
                confirm: true,
                callback: function() {
                    accept({
                        'view': view
                    });
                },
                cancel: function() {
                    reject();
                }
            });
            break;
        case 'delete':
            text = "Are you sure you want to delete these items? This cannot be undone";
            accept = this.bulkDelete;
            reject = function(request) {
                Mediakron.messages.message("No changes made");
            };
            Mediakron.message({
                text: text,
                type: 'warning',
                timeout: 0,
                layout: 'center',
                confirm: true,
                callback: function() {
                    accept({
                        'view': view
                    });
                },
                cancel: function() {
                    reject();
                }
            });
            break;
        }
    },
    bulkPublish: function(data) {
        var body, item, view = data.view,
            selected = $('.bulk-action').filter(':checked'),
            length = selected.length,
            i = 0;
        selected.each(function(e, target) {
            item = Mediakron.getItemFromURI($(target).val());
            item.set('published', 1);
            item.save({}, {
                'success': function() {
                    $(target).attr('checked', false);
                    i++;
                    if (i == length) {
                        view.tbody.render();
                    }
                }
            });
        });
    },
    bulkUnpublish: function(data) {
        var body, item, view = data.view,
            selected = $('.bulk-action').filter(':checked'),
            length = selected.length,
            i = 0;
        selected.each(function(e, target) {
            item = Mediakron.getItemFromURI($(target).val());
            item.set('published', 0);
            item.save({}, {
                'success': function() {
                    $(target).attr('checked', false);
                    i++;
                    if (i == length) {
                        view.tbody.render();
                    }
                }
            });
        });
    },
    bulkDelete: function(data) {
        var body, item, view = data.view,
            selected = $('.bulk-action').filter(':checked'),
            length = selected.length,
            i = 0;
        selected.each(function(e, target) {
            item = Mediakron.getItemFromURI($(target).val());
            item.destroy({
                'success': function() {
                    $(target).attr('checked', false);
                    i++;
                    if (i == length) {
                        view.tbody.render();
                    }
                }
            });
        });
    },
    toggleFilters: function(e) {
        $('.content-filters-inner').toggleClass("filters-toggled");
    }
});

Mediakron.ContentBrowser.Updates = Mediakron.Extensions.View.extend({
  template: JST['compontents.browser.content.updates'],
  callback: false,
  initialize: function(data){
    var view = this;
    Mediakron.App.Events.on('update_content', function(){
      view.render();
    });
  },
  render:function(){
    
    this.$el.html(this.template({
      updated: Mediakron.items.updatedItems(),
      created: Mediakron.items.newItems(),
    }));
  },
  afterRender:function(){
    
  },
  events: {
    'click a': Mediakron.linkHandle
  },
});

Mediakron.ContentBrowser.AddPage = Mediakron.Extensions.View.extend({
  template: JST['compontents.add-panes.content.addnew'],
  callback: false,
  initialize: function(data){
    if(data.callback) this.callback = data.callback;
    if(data.cancelCallback) this.cancelCallback = data.cancelCallback;
  },
  render:function(){
    this.$el.html(this.template());
  },
  afterRender:function(){
    
  },
  events: {
    'click .add-item li a': 'openEdit',
    'click .add-collection li a': 'openEdit',
    'click #cancel-editing': 'cancel',
    'click #close-settings-context': 'cancel',
    'click .close-button': 'cancel',
    'click .overlay-bg': 'cancel',
    'click .fade-screen-sidebar ': 'cancel'
  },
  openEdit:function(e){
    var $target = $('.btn', $(e.currentTarget)),
      type = $target.attr('item-attr'),
      build = this;
      console.log(type);
      var view = new Mediakron.Admin.AddContentPage({
        type: type,
        edit: false,
        callback: build.callback
      });
      view.setElement(this.el);
      view.render().afterRender();
  },
  cancel: function() {
    Mediakron.ContentBrowser.filter.skip = [];
    this.cancelCallback();
    Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
    return false;
  }
});

Mediakron.ContentBrowser.MyContent = Mediakron.ContentBrowser.View.extend({
    className: 'mycontent',
    template: JST['components.browsers.content.mycontent'],
    title: 'My Content',
    context: 'default',
    help: ''
});
Mediakron.ContentBrowser.Archived = Mediakron.ContentBrowser.View.extend({
    template: JST['components.browsers.content'],
    title: 'Archived Content',
    context: 'default',
    help: ''
});
Mediakron.ContentBrowser.Public = Mediakron.ContentBrowser.View.extend({
    className: 'public-browser',
    template: JST['components.browsers.content.public'],
    title: 'Browse',
    context: 'public',
    help: ''
});


Mediakron.ContentBrowser.Selector = Mediakron.ContentBrowser.View.extend({
    template: JST['components.browsers.content.selector'],
    el: false,
    context: 'selector'
});
Mediakron.ContentBrowser.Narrative = Mediakron.ContentBrowser.View.extend({
    template: JST['components.browsers.content.narrative'],
    el: false,
    context: 'narrative'
});
Mediakron.ContentBrowser.LinkSelector = Mediakron.ContentBrowser.View.extend({
    template: JST['settings.browser.content.link'],
    el: false,
    context: 'selector'
});
Mediakron.ContentBrowser.SelectorMap = Mediakron.ContentBrowser.View.extend({
    template: JST['settings.browser.content.selectormap'],
    el: false,
    context: 'selectormap',
    afterRender: function() {
        var map = Mediakron.Status.CurrentMap,
            item = this.item;
        this.tbody = new Mediakron.ContentBrowser.Body({
            context: this.context,
            items: false,
            callback: this.callback,
            query: this.query
        }).render();
        $('#content-filters select').chosen({
            allow_single_deselect: true
        });
        _.each(map.markers, function(marker, uri) {
            child = Mediakron.getItemFromURI(uri);
            marker.on('mouseover', function() {
                $('.manage-layer-' + uri).addClass('active');
            });
            marker.on('mouseout', function() {
                $('.manage-layer-' + uri).removeClass('active');
            });
            marker.dragging.enable();
            marker.on('dragend', function(e) {
                var lnglat = e.target.getLatLng();
                item.remove(child);
                item.add(child, {
                    'coordinate': lnglat,
                    'type': 'point'
                });
            });
        });
        $('.map-template').addClass('content-push-sidebar'); /* move content to left  */
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay so edit area is available  */
        return this;
    }
});

Mediakron.ContentBrowser.Timeline = Mediakron.ContentBrowser.View.extend({
    template: JST['settings.browser.content.timeline'],
    el: false,
    context: 'timeline'
});


Mediakron.ContentBrowser.Body = Backbone.View.extend({
    template: JST['settings.browser.content.tbody'],
    el: '#admin-content-body',
    callback: false,
    items: [],
    query: false,
    reset: false,
    row_count: 40,
    initialize: function(data) {
        this.query = data.query;
        this.callback = data.callback;
        this.context = data.context;
        this.topics = Mediakron.topics;
        this.empty = data.empty;
        this.reset = data.reset;
        if(data.row_count) this.row_count = data.row_count;
    },
    update: function() {
        if (this.query.sort) {
            Mediakron.items.processSort(this.query.sort).sort();
        } else {
            Mediakron.items.processSort('changed_desc').sort();
        }
        if (this.reset) {
            this.items = [];
            this.reset = false;
        }
        var type, title, query = this.query,
            search;
        var view = this;
        if (query.search) search = query.search.toLowerCase();
        if (this.query.result) {
            _.each(this.query.result, function(item) {
                view.items.push(Mediakron.getItemFromURI(item.uri));
            });
        } else {
            this.items = Mediakron.items.filter(function(item) {
                type = item.getNormalType();
                if (type == 'tag') {
                    return false;
                }
                title = item.get('title');
                if (query.user) {
                    user = item.get('user');
                    if (query.user != user.id) {
                        return false;
                    }
                }
                if (query.filter) if (query.filter.indexOf(type) < 0) return false;
                if (query.search) if (title.toLowerCase().indexOf(search) == -1) return false;
                if (query.disabled) if (query.disabled.indexOf(type) < 0) return false;
                if (query.archived) {
                    if (item.get('archived') !== true) return false;
                } else {
                    if (item.get('archived') === true) return false;
                }
                return true;
            });
        }
        this.number = this.items.length;
    },
    render: function() {
        this.update();
        this.$el.empty();
        $('.count-view').text(this.number);
        if (this.number === 0 || (this.query.result && _.size(this.query.result) === 0)) {
            this.$el.html(this.empty);
        } else {
            var content = {
                items: this.items,
                context: this.context,
                callback: this.callback
              }, i = 0,
                 view = this;
            this.renderChunk(0);
            i = i + view.row_count;
            Mediakron.App.Events.on('scroll:nearbottom', function(object) {
                view.renderChunk(i);
                i = i + view.row_count;
            });
        }
        return this;
    },
    afterRender: function() {
        return this;
    },
    renderChunk: function(i) {
        var limit = i + this.row_count,
            item, view, uri, user;
        for (i; i < limit; i++) {
            item = this.items[i];
            if (!item) break;
            uri = item.get('uri');
            user = item.get('user');
            if (this.query.skip) {
              if (this.query.skip.indexOf(uri) > -1) {
                continue;
              }
            }
            if(!item.canView(true)) continue;
            view = item.getRow(this.context, this.callback, this.query.thumbnails);
            this.$el.append(view.render().$el);
            view.afterRender();
            view.delegateEvents();
            $('select', view.$el).chosen({
                allow_single_deselect: true
            });
        }
    }
});
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

Mediakron.ContentBrowser.rowSelector = Mediakron.ContentBrowser.Row.extend({
    events: {
        'click a.btn-add': 'linkCallback',
        'click .bulk-action': 'toggleSelect'
    },
    linkCallback: function(e) {
        this.remove();
        if (this.callback) this.callback(this.item);
        return false;
    }
});
Mediakron.ContentBrowser.rowNarrative = Mediakron.ContentBrowser.Row.extend({
    events: {
        'click a.btn-add': 'linkCallback',
        'click .bulk-action': 'toggleSelect'
    },
    linkCallback: function(e) {
        this.remove();
        var data = {};
        itemTemplate = $('.narrative-template-select', this.$el).val();
        if (itemTemplate) {
            if (!data) {
                data = {};
            }
            data.template = itemTemplate;
        }
        data.hideTitle = $('.hide-title', this.$el).prop('checked');
        data.hideSidebar = $('.hide-sidebar', this.$el).prop('checked');
        if (this.callback) this.callback(this.item, data);
        return false;
    }
});
Mediakron.ContentBrowser.rowSelectorMap = Mediakron.ContentBrowser.Row.extend({
    events: {
        'click a.btn-add': 'linkCallback',
        'click .bulk-action': 'toggleSelect',
        'click .gogogeocode': 'geocode'
    },
    geocode: function(e) {
        var address = $('.geocode', this.$el).val(),
            row = this,
            item = this.item,
            callback = this.callback;
        $.getJSON('https://nominatim.openstreetmap.org/search/' + address + '?format=json&addressdetails=1&limit=1&polygon_svg=1', function(data) {
            if (data) {
                if (data.length > 0) {
                    delete data[0].svg;
                    callback(item, {
                        'coordinate': data[0],
                        'address': address,
                        'type': 'point'
                    }, row.rebindDrag);
                    row.remove();
                }
            }
        });
    },
    linkCallback: function(e) {
        this.remove();
        if (this.callback) this.callback(this.item, false, this.rebindDrag);
        return false;
    },
    rebindDrag: function() {
        var map = Mediakron.Status.CurrentMap;
        _.each(map.markers, function(marker, uri) {
            child = Mediakron.getItemFromURI(uri);
            marker.on('mouseover', function() {
                $('.manage-layer-' + uri).addClass('active');
            });
            marker.on('mouseout', function() {
                $('.manage-layer-' + uri).removeClass('active');
            });
            marker.dragging.enable();
            marker.on('dragend', function(e) {
                var lnglat = e.target.getLatLng();
                item.remove(child);
                item.add(child, {
                    'coordinate': lnglat,
                    'type': 'point'
                });
            });
        });
    },
    afterRender: function() {
        var map = Mediakron.Status.CurrentMap,
            currentLoc = false,
            item = this.item,
            callback = this.callback,
            child, view = this;
        this.$el.draggable({
            cursor: "move",
            cursorAt: {
                top: 0,
                left: 0
            },
            appendTo: "#main",
            helper: function(event) {
                return $('<span class="mki mki-marker dragging-marker"></span>');
            },
            start: function() {
                map.on('mousemove', function(e) {
                    currentLoc = e.latlng;
                });
            },
            stop: function() {
                map.off('mousemove');
                this.remove();
                callback(item, {
                    'coordinate': currentLoc,
                    'type': 'point'
                }, view.rebindDrag);
            }
        });
    }
});
Mediakron.ContentBrowser.rowTimeline = Mediakron.ContentBrowser.Row.extend({
    events: {
        'click a.date-add': 'linkCallback',
        'click .bulk-action': 'toggleSelect'
    },
    end: {},
    start: {},
    endWidget: false,
    startWidget: false,
    linkCallback: function(e) {
        // validation
        var start = this.startWidget.validate('start'),
            end = this.endWidget.validate('end');
        if (!start || !end) return false;
        this.remove();
        this.callback(this.item, {
            'start': start,
            'end': end
        });
        return false;
    },
    afterRender: function() {
        this.startWidget = this.addStart();
        this.endWidget = this.addEnd();
    },
    addStart: function() {
        var content = {
            type: 'start',
            parent: this,
            $parent: $('.start-date-' + this.item.get('uri')),
            date: false,
            item: this.item,
            timeline: this.context
        },
            uri = this.item.get('uri'),
            startWidget = new Mediakron.Timeline.selectWidget(content);
        startWidget.render();
        return startWidget;
    },
    addEnd: function() {
        var content = {
            type: 'end',
            parent: this,
            $parent: $('.end-date-' + this.item.get('uri')),
            date: false,
            item: this.item,
            timeline: this.context
        },
            uri = this.item.get('uri'),
            endWidget = new Mediakron.Timeline.selectWidget(content);
        endWidget.render();
        return endWidget;
    },
    setDate: function(position, type, value, uri) {
        var content = {
            type: position,
            parent: this,
            $parent: $('.' + position + '-date-' + this.item.get('uri')),
            date: false,
            item: this.item,
            timeline: this.context
        };
        this[position][type] = value;
    },
    removeDate: function(position, type, uri) {
        delete this[position][type];
    }
});
Mediakron.ContentBrowser.rowPublic = Mediakron.ContentBrowser.Row.extend({
    events: {}
});