// @question seems to point to the same view

Mediakron.Admin.Landing = Mediakron.Extensions.View.extend({
    template: JST['settings.settings'],
    type: false,
    changes: false,
    initialize: function() {},
    render: function() {
        var content = {};
        $(this.el).html(this.template(content));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click .intro-tour': 'guidedTour'
    },
    guidedTour: function() {
        require(["tours/intro"], function(tour) {
            tour.start();
        });
    }
});

Mediakron.Admin.SettingsPage = Mediakron.Extensions.View.extend({
    template: JST['settings.settings'],
    initialize: function() {},
    render: function() {
        $(this.el).html(this.template());
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click #cancel-editing': Mediakron.Edit.cancelEdit
    }
});

