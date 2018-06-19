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

