
Mediakron.MainMenu = Backbone.View.extend({
    template: JST['navigation.main.menu'],
    el: '#nav-main',
    items: [],
    tags: [],
    initialize: function () {
        this.topics = Mediakron.topics;
        Mediakron.App.Events.on("context:goto", function (event) {
            var title = '';
            if (event.view.model) {
                title = event.view.model.get('title') + ' | ';

            }
            title = title + Mediakron.Settings.name;
            $('title').text(title);
        });
        var view = this;
        Mediakron.App.Events.on('update_content', function () {
            view.render();
        });
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
        this.$el.hide();
        this.$el.html(this.template({
            topics: this.topics,
            'items': this.items,
            'tags': this.tags,
            secondary: Mediakron.Settings.Navigation.secondary
        }));
        this.$el.show();

        return this;
    },
    events: {
        'click .js-menu-trigger': 'toggleMenu',
        'click .js-menu-screen': 'toggleMenu',
        'click .main-menu-sidebar .close-button': 'closeMenu',
        'click a': Mediakron.linkHandle,
        'click .main-menu-sidebar.is-visible a': 'toggleMenu'
    },
    toggleMenu: function () {
        $('.js-menu,.js-menu-screen', this.parent).toggleClass('is-visible');
        //         $('#main-container').toggleClass('content-push');
    },
    closeMenu: function () {
        $('.js-menu,.js-menu-screen', this.parent).removeClass('is-visible');
        //         $('#main-container').toggleClass('content-push');
    }

});
