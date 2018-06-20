/**
 * This is the primary app view.  Its going to attach itself to the core region and act as an
 * air traffic controller for all of the children views.  Awesome, cause by binding it this way,
 * we can grab a view, and ask it to transition inward, and the fly effects will work nicely.
 */
Mediakron.Pages.timeline = Mediakron.Extensions.View.extend({
    template: JST['pages.timeline.default'],
    className: 'pages pages-layout layout-pages timeline-context',
    zoom: 1,
    layout: false,
    item: false,
    timelineRendered: false,
    initState: false,
    initialize: function(model) {
        this.model = model;
        this.current = model;
        return this;
    },
    render: function() {
        this.getCurrent();
        var content = this.model.toJSON();
        content.item = this.model;
        content.model = this.model;
        content.current = this.current.get('uri');
        if (this.layout) {
            this.template = JST['pages.timeline.' + this.layout];
        } else if (this.model.get('template')) {
            this.template = JST['pages.timeline.' + this.model.get('template')];
        }
        this.$el.html(this.template(content));
        Mediakron.Status.CurrentTimeline = this.model;
        return this;
    },
    afterRender: function() {

        this.model.getSidebar(this.$el);
        var uri = this.model.get('uri'),
            view = this;
        $('.timeline-' + uri).timeline({
            'model': this.model
        });
        $('.timeline-' + uri).timeline('renderTour');

        if (!Mediakron.loading) {
            this.filters = new Mediakron.Sidebar.Filters({
                timeline: this.model,
                callback: function() {
                    $('.timeline-' + uri).timeline('filters');
                },
                filter: function(filters) {
                    $('.timeline-' + uri).timeline('filter', filters);
                }

            });

        } else {
            Mediakron.App.Events.on('load:complete', function() {
                view.filters = new Mediakron.Sidebar.Filters({
                    timeline: view.model,
                    callback: function() {
                        $('.timeline-' + uri).timeline('filters');
                    },
                    filter: function(filters) {
                        $('.timeline-' + uri).timeline('filter', filters);
                    }
                });
                if(Mediakron.CurrentTimeline) Mediakron.CurrentTimeline.redraw();
            });
        }

        if (this.zoom == 1) {
            $('.zoomout').hide();
        }
        $('.popover').popover('hide');

        /* Load accessible dropdown menu plugin  */
        accessibleNav();
    },
    onClose: function() {
        $('.popover').popover('hide');
    },
    gotoItem: function(item) {
        if (!item) {
            $('.timeline-overlay').addClass('closed').removeClass('opened');
            $('.timeline-overlay .item-contents').empty();
        } else {
            if (!Mediakron.controller.popup) {
                $('.timeline-overlay').addClass('closed').removeClass('opened');
                $('.timelineMarker-' + this.current.get('uri') + ' .timelineMakerText').popover('show');
                Mediakron.router.navigate(Mediakron.controller.getPath(true), {
                    trigger: false
                });
            } else {
                var view = item.getView(),
                    $el = $('.timeline-overlay .item-contents');
                $el.empty();
                view.setElement($el);
                view.render();
                view.afterRender();
                $('.timeline-overlay').addClass('opened').removeClass('closed');
            }
        }
        this.initState = false;
    },
    events: {
        'click a': Mediakron.linkHandle,
        'click #toggleSidebar': Mediakron.sidebarHandle,
        'click .panel-heading': Mediakron.sidebarPanelOpen,
        'click .zoomin': 'zoomIn',
        'click .zoomout': 'zoomOut',
        'click .close-item-overlay': 'closeOverlay',
        'click .opened .overlay-bg': 'closeOverlay',
        'click .close-details-button': 'detailsClosed',
        'click .open-details-button': 'detailsOpen',
        'mouseleave .item-sidebar': 'filtersClose',
        'mouseenter .item-sidebar': 'filtersOpen',
        'mouseenter .tour-item': 'itemHighlight',
        'mouseleave .tour-item': 'itemUnhighlight',
        'click .tour-contents': 'tourOpen',
        'click .close-timeline-tour-button': 'tourClose'
    },
    filtersClose: function(e) {
        $('.timeline-template').addClass('filters-closed').removeClass('filters-open');
    },
    filtersOpen: function(e) {
        $('.timeline-template').addClass('filters-open').removeClass('filters-closed');
    },
    itemHighlight: function(e) {
        $('.tour-item').addClass('not-highlighted');
    },
    itemUnhighlight: function(e) {
        $('.timeline-template').removeClass('not-highlighted');
    },
    tourOpen: function(e) {
        $('.timeline-template').addClass('timeline-tour-open');
        $('.details-sidebar').addClass('details-closed tour-open').removeClass('details-open');
    },
    tourClose: function(e) {
        $('.timeline-template').removeClass('timeline-tour-open');
        $('.details-sidebar').removeClass('tour-open');
    },
    detailsClosed: function(e) {
        $('.details-sidebar').addClass('details-closed').removeClass('details-open');
    },
    detailsOpen: function(e) {
        $('.details-sidebar').addClass('details-open').removeClass('details-closed tour-open');
        $('.timeline-template').removeClass('timeline-tour-open');
    },
    closeOverlay: function(e) {
        $('.timeline-overlay .item-contents').empty();
        this.$el.removeClass('full');
        Mediakron.controller.items.pop();
        Mediakron.controller.breadcrumb = Mediakron.controller.items;
        Mediakron.controller.refresh = false;
        $('.timeline-overlay').addClass('closed').removeClass('opened');
        Mediakron.controller.closeOverlay({
            trigger: false
        });
        Mediakron.controller.popup = false;
        Mediakron.controller.currentItem = this.model;
    },
    closeChildren: function() {
        $('.item-view').addClass('closed').removeClass('opened');
    },
});