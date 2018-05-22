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