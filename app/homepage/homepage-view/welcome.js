
Mediakron.Pages.welcome = Mediakron.Extensions.View.extend({
    template: JST['pages.welcome.full'],
    className: 'item-page',
    data: false,
    item: false,
    initialize: function () {
        this.data = Mediakron.Settings.HomePage;
        if (this.data.layout) {
            if (JST['pages.welcome.' + this.data.layout]) {
                this.template = JST['pages.welcome.' + this.data.layout];
                var layout = this.data.layout;
                Mediakron.classes.queue(Mediakron.Settings.HomePage.options[layout].classes);
            }

        }
        this.item = false;
        if (Mediakron.Settings.HomePage.item) {
            this.item = Mediakron.getItemFromURI(Mediakron.Settings.HomePage.item);
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
                view.afterRender();
            }
        }
        if (this.data.layout) {
            if (this.data.layout == 'menus-basic' || this.data.layout == 'menus-half' || this.data.layout == 'menus-full' || this.data.layout == 'updates-basic' || this.data.layout == 'updates-half' || this.data.layout == 'updates-full') {
                // reload the home page once the load is complete 
                this.renderMenu();
            }
        }

        /* fade main titles on scroll  */
        $('#main-container').scroll(function () {
            $(".home-template__info h1, .home-template__info  h2")
                .css("opacity", 1 - $('#main-container').scrollTop() / 500);
        });
    },
    renderMenu: function () {
        if (this.data.layout == 'menus-basic' || this.data.layout == 'menus-half' || this.data.layout == 'menus-full') {
            region = new this.menu();
        } else if (this.data.layout == 'updates-basic' || this.data.layout == 'updates-half' || this.data.layout == 'updates-full') {
            region = new this.updates();
            region = new this.menu();
        }
    },
    menu: Mediakron.Extensions.View.extend({
        template: JST['pages.welcome.region.menu'],
        el: '#homepage-menu',
        initialize: function () {
            if (!Mediakron.loading) {
                this.render();
            } else {
                var view = this;
                Mediakron.App.Events.on('load:complete', function () {
                    view.render();
                });
            }
        },
        render: function () {
            var items = Mediakron.Settings.Navigation.primary,
                length = items.length,
                i = 0,
                item;
            this.items = [];
            for (i; i < length; i++) {
                if (items[i] === null) { continue; }
                if (typeof (items[i]) == 'object') {
                    if (items[i].type == 'external') {
                        this.items.push(items[i]);
                    }
                } else if (typeof (items[i]) == 'string') {
                    this.items.push(Mediakron.getItemFromURI(items[i]));
                }
            }
            this.$el.html(this.template({
                'items': this.items
            }));
        },
        events: {
            'click a': Mediakron.linkHandle
        },
    }),
    updates: Mediakron.Extensions.View.extend({
        template: JST['pages.welcome.region.updates'],
        el: '#homepage-updates',
        initialize: function () {
            var view = this;
            Mediakron.App.Events.on('update_content', function () {
                view.render();
            });
            if (!Mediakron.loading) {
                this.render();
            } else {
                Mediakron.App.Events.on('load:complete', function () {
                    view.render();
                });
            }
        },
        render: function () {
            this.$el.html(this.template({
                updated: Mediakron.items.updatedItems(),
                created: Mediakron.items.newItems(),
            }));
        },
        events: {
            'click a': Mediakron.linkHandle
        }
    })
});