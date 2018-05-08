
Mediakron.Pages.text = Mediakron.Extensions.View.extend({
    template: JST['pages.text.default'],
    className: 'item-page',
    layout: false,
    annotate: 'full',
    initialize: function(model) {
        this.model = model;
    },
    afterRender: function() {
        console.log(arguments.callee.caller);
        var view = this,
            text = this.model.get('text'),
            type = text.type;
        this.model.getSidebar(this.$el);
        $(".annotate img", this.$el).annotateImage({
            editable: true,
            zoomType: this.annotate,
            model: this.model,
            notes: this.model.getRelationship('annotations')
        });
        if (type == 'pdf') {
            $('#viewer-' + view.model.get('uri')).empty();
            PDFJS.getDocument(Mediakron.Settings.filepath + text.url).then(function(pdf) {
                // Using promise to fetch the page
                view.numPages = pdf.numPages;
                var i = 1,
                    $pages = $('.pages', view.$el);
                for (i; i <= view.numPages; i++) {
                    $pages.append('<span class="gotoPage" page="' + i + '">' + i + '</span>');
                }
                view.canvas = document.getElementById('viewer-' + view.model.get('uri'));
                view.context = view.canvas.getContext('2d');
                view.pdf = pdf;
                view.loadPage(1);
            });
        }
        if (type == 'word' || type == 'ppt') {
            var preview = new Mediakron.Pages.textPreview(this.model);
        }
        
        /* Load accessible dropdown menu plugin  */
        accessibleNav();
    },
    render: function() {
        if (this.layout) {
            this.template = JST['pages.text.' + this.layout];
            if (this.layout == 'comparison') {
                this.annotate = 'minimal';
            }
        } else if (this.model.get('template')) {
            this.template = JST['pages.text.' + this.model.get('template')];
        }
        var content = this.model.toJSON();
        if (this.model.comparison) content.comparison = this.model.comparison;
        content.model = this.model;
        content.item = this.model;
        this.$el.html(this.template(content));
        return this;
    },
    events: {
        'click a': Mediakron.linkHandle,
        'click .panel-heading': Mediakron.sidebarPanelOpen,
        'click .panel-body a': Mediakron.linkHandle,
        'click #toggleSidebar': Mediakron.sidebarHandle,
        'click .remove': 'removeFromComparison',
        'click .comparison-description-button': 'showCompareDescription',
        'keypress .searchPdf': 'search'
    },
    search: function(e) {
        var val = $(e.currentTarget).val();
    },
    showCompareDescription: function() {
        $('.comparison-description', this.$el).toggleClass('hidden');
    },
    removeFromComparison: function() {
        this.model.comparison.remove(this.model, false);
        this.model.comparison.save();
    }
});
Mediakron.Pages.file = Mediakron.Extensions.View.extend({
    template: JST['pages.file.default'],
    className: 'item-page',
    layout: false,
    annotate: 'full',
    preview: false,
    initialize: function(model) {
        this.model = model;
    },
    afterRender: function() {
        var view = this,
            text = this.model.get('text'),
            type = text.type;
        this.model.getSidebar(this.$el);
        $(".annotate img", this.$el).annotateImage({
            editable: true,
            zoomType: this.annotate,
            model: this.model,
            notes: this.model.getRelationship('annotations')
        });
        if (type == 'pdf' || type == 'doc' || type == 'xls' || type == 'ppt') {
            var viewer = $('#viewer-' + view.model.get('uri'));
            viewer.empty();
            require(["/mediakron/js/src/preview/preview.js"], function(docPreview) {
                view.preview = new docPreview(viewer, view.model.get('uri'));
            });
        }
        
        /* Load accessible dropdown menu plugin  */
        accessibleNav();
    },
    render: function() {
        if (this.layout) {
            this.template = JST['pages.file.' + this.layout];
            if (this.layout == 'comparison') {
                this.annotate = 'minimal';
            }
        } else if (this.model.get('template')) {
            this.template = JST['pages.file.' + this.model.get('template')];
        }
        var content = this.model.toJSON();
        if (this.model.comparison) content.comparison = this.model.comparison;
        content.model = this.model;
        content.item = this.model;
        content.viewer = JST['pages.file.viewer']();
        this.$el.html(this.template(content));
        return this;
    },
    events: {
        'click a': Mediakron.linkHandle,
        'click .panel-heading': Mediakron.sidebarPanelOpen,
        'click .panel-body a': Mediakron.linkHandle,
        'click #toggleSidebar': Mediakron.sidebarHandle,
        'click .remove': 'removeFromComparison',
        'click .comparison-description-button': 'showCompareDescription',
        'click .pdf-thumbnail-toggle button': 'pdfThumbnails',
        'click .pdfZoomIn': 'pdfZoomin',
        'click .pdfZoomOut': 'pdfZoomout',
        'click .doSearch': 'pdfSearch',
        'click .clearSearch': 'pdfClearsearch',
        'mousedown .searchPdf': 'removeClearbutton',
        'keypress .searchPdf': 'keyhandler',
    },
    showCompareDescription: function() {
        $('.comparison-description', this.$el).toggleClass('hidden');
    },
    removeFromComparison: function() {
        this.model.comparison.remove(this.model, false);
        this.model.comparison.save();
    },
    pdfThumbnails: function() {
        $('.pdfThumbnails', this.$el).toggleClass('thumbnails-visibility');
        $('.pdf-container', this.$el).toggleClass('thumbnails-visibility');
        $('.pdf-thumbnail-toggle button', this.$el).toggleClass('thumbnails-visibility');
    },
    pdfZoomin: function() {
        $('.pdfZoomIn', this.$el).addClass('active');
        $('.pdfZoomOut', this.$el).removeClass('active');
    },
    pdfZoomout: function() {
        $('.pdfZoomOut', this.$el).addClass('active');
        $('.pdfZoomIn', this.$el).removeClass('active');
    },
    pdfSearch: function() {
        $('.doSearch', this.$el).addClass('hide');
        $('.clearSearch', this.$el).removeClass('hide');
        $('.searchNav', this.$el).removeClass('hide');
    },
    pdfClearsearch: function() {
        $('.doSearch', this.$el).removeClass('hide');
        $('.clearSearch', this.$el).addClass('hide');
        $('.searchNav', this.$el).addClass('hide');
        $('.searchPdf').val('');
    },
    removeClearbutton: function() {
        $('.doSearch', this.$el).removeClass('hide');
        $('.clearSearch', this.$el).addClass('hide');
        $('.searchNav', this.$el).addClass('hide');
    },
    keyhandler: function(e) { 
        if(e.keyCode == 13){
          var search = $(e.currentTarget).val();
          this.preview.search(search);
          $('.doSearch', this.$el).addClass('hide');
          $('.clearSearch', this.$el).removeClass('hide');
          $('.searchNav', this.$el).removeClass('hide');
        }
    },
});
Mediakron.Pages.video = Mediakron.Extensions.View.extend({
    template: JST['pages.video.default'],
    className: 'item-page',
    layout: false,
    initialize: function(model) {
        this.model = model;
    },
    render: function() {
        if (this.layout) {
            this.template = JST['pages.video.' + this.layout];
        } else if (this.model.get('template')) {
            this.template = JST['pages.video.' + this.model.get('template')];
        }
        var content = this.model.toJSON();
        content.renderedVideo = this.model.getVideo();
        if (this.model.comparison) content.comparison = this.model.comparison;
        content.model = this.model;
        content.item = this.model;
        this.$el.html(this.template(content));
        return this;
    },
    remove: function() {
        // custom cleanup or closing code, here
        $('video, audio').each(function() {
            if ($(this)[0]) {
                if ($(this)[0].player) {
                    $(this)[0].player.pause();
                }
            }
        });
        // call the base class remove method 
        Backbone.View.prototype.remove.apply(this, arguments);
    },
    afterRender: function() {
        this.model.getSidebar(this.$el);
        $(".annotate img", this.$el).annotateImage({
            editable: true,
            model: this.model,
            notes: this.model.getRelationship('annotations')
        });
        var video = this.model.get('video');
        if (video.type == 'bc') {
            var $iframe = $('iframe#iframe-for-' + this.model.get('uri')),
                height = $iframe.height(),
                width = $iframe.width(),
                url = video.url;
            if (url.indexOf('?') != -1) {
                url = url + '&height=' + height + '&width=' + width;
            } else {
                url = url + '?height=' + height + '&width=' + width;
            }
            $iframe.attr('src', url);
        }
        this.model.loadVideo();
        
        /* Load accessible dropdown menu plugin  */
        accessibleNav();
    },
    events: {
        'click a': Mediakron.linkHandle,
        'click .panel-heading': Mediakron.sidebarPanelOpen,
        'click .panel-body a': Mediakron.linkHandle,
        'click #toggleSidebar': Mediakron.sidebarHandle,
        'click .remove': 'removeFromComparison',
        'click .comparison-description-button': 'showCompareDescription',
        'click .js-expandmore': 'showHideHelp'
    },
    showCompareDescription: function() {
      $('.comparison-description', this.$el).toggleClass('hidden');
    },
    showHideHelp: function() {
      $('.js-to_expand').toggleClass('hidden');
    },
    removeFromComparison: function() {
        this.model.comparison.remove(this.model, false);
        this.model.comparison.save();
    }
});
Mediakron.Pages.audio = Mediakron.Extensions.View.extend({
    template: JST['pages.audio.default'],
    className: 'item-page',
    layout: false,
    annotate: 'full',
    onClose: function() {},
    initialize: function(model) {
        this.model = model;
    },
    render: function() {
        if (this.layout) {
            this.template = JST['pages.audio.' + this.layout];
            if (this.layout == 'comparison') {
                this.annotate = 'minimal';
            }
        } else if (this.model.get('template')) {
            this.template = JST['pages.audio.' + this.model.get('template')];
        }
        var content = this.model.toJSON();
        content.renderedAudio = this.model.getAudio();
        if (this.model.comparison) content.comparison = this.model.comparison;
        content.model = this.model;
        content.item = this.model;
        this.$el.html(this.template(content));
        return this;
    },
    remove: function() {
        // custom cleanup or closing code, here
        $('video, audio').each(function() {
            if ($(this)[0]) {
                if ($(this)[0].player) {
                    $(this)[0].player.pause();
                }
            }
        });
        // call the base class remove method 
        Backbone.View.prototype.remove.apply(this, arguments);
    },
    afterRender: function() {
        this.model.getSidebar(this.$el);
        this.player = this.model.loadAudio();
        $(".annotate img", this.$el).annotateImage({
            editable: true,
            model: this.model,
            zoomType: this.annotate,
            notes: this.model.getRelationship('annotations')
        });
        
        /* Load accessible dropdown menu plugin  */
        accessibleNav();
    },
    events: {
        'click a': Mediakron.linkHandle,
        'click .panel-heading': Mediakron.sidebarPanelOpen,
        'click .panel-body a': Mediakron.linkHandle,
        'click #toggleSidebar': Mediakron.sidebarHandle,
        'click .remove': 'removeFromComparison',
        'click .comparison-description-button': 'showCompareDescription'
    },
    showCompareDescription: function() {
        $('.comparison-description', this.$el).toggleClass('hidden');
    },
    removeFromComparison: function() {
        this.model.comparison.remove(this.model, false);
        this.model.comparison.save();
    }
});