
Mediakron.LightBox = Backbone.View.extend({
    template: JST['extra.lightbox'],
    el: 'body',
    contents: false,
    width: '75%',
    height: '90%',
    initialize: function (object) {
        Mediakron.lightbox = this;
        this.contents = object.contents;
    },
    render: function () {
        $('#lightbox').remove();
        this.$el.append(this.template({ contents: this.contents }));
        $('#lightbox-content').css({ 'height': this.height, 'width': this.width });
        return this;
    },
    goToView: function (view) {
        view.render();
        this.contents = view.$el.html();
        this.$el.html(this.template({ contents: this.contents }));
        return this;
    },
    close: function () {
        $('#lightbox').remove();
    },
    events: {
        'click #lightbox-shadow': 'closeLightbox',
        'click #lightbox-close': 'closeLightbox'
    },
    closeLightbox: function () {
        this.close();
    }
});