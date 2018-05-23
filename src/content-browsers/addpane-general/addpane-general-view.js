Mediakron.Admin.AddPage = Mediakron.Extensions.View.extend({
    template: JST['settings.add'],
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
        'click #close-settings-context': Mediakron.Edit.cancelEdit
    }
});