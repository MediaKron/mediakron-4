Mediakron.ContentManager.Create = Mediakron.ContentManager.Default.extend({
    template: JST['settings.content.manager.create'],
    bindpoint: '.add-bind',
    afterInit: function(data) {},
    events: {
        'click .add-link': 'addType',
        'click .close-button': 'cancel',
        'click #cancel-editing': 'cancel',
        'click .overlay-bg': 'cancel',
        'click #done-editing': 'save'

    },
    addType: function(e) {
        e.preventDefault();
        var target = $(e.currentTarget),
            type = target.attr('data-type'),
            view = this;
        $('.add-show').hide();
        this.bindpoint.removeClass('hide');
        var addPane = new Mediakron.Admin.AddContentPage({
            callback: function(model) {
                // Validate
                view.model = model;
                view.child = model;
                var valid = view.validate(model, {});
                if (valid) {
                    view.save();
                }
            },
            validate: function(model, changes) {
                view.child = model;
                return view.validate(model, changes, true);
            },
            type: type
        });
        addPane.setElement(this.bindpoint);
        addPane.render();
        addPane.afterRender();
        return false;
    }
});