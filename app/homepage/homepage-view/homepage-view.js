Mediakron.Pages.home = Mediakron.Extensions.View.extend({
    template: JST['pages.welcome.full'],
    className: 'item-page',
    data: false,
    item: false,
    initialize: function (request) {
        this.data = Mediakron.Settings.HomePage;
        var view = this;
        if (this.data.layout) {
            if (JST['pages.welcome.' + this.data.layout]) {
                this.template = JST['pages.welcome.' + this.data.layout];
            }

        }
        this.item = false;
        if (request.item) {
            this.item = request.item;
        }

    },
    events: {
        'click a': Mediakron.linkHandle
    },
    render: function () {
        this.$el.html(this.template(this.data));
        return this;
    },
    afterRender: function () {
        if (this.item) {
            var view = this.item.getView();
            if (view) {
                view.setElement('#homepage-content');
                $('.home-template--nobanner').addClass('home-content-active');
                view.render();
            }
        }
    }
});