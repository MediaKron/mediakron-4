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