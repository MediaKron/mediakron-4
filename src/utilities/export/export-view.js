Mediakron.Admin.ExportPage = Mediakron.Extensions.View.extend({
    template: JST['settings.export'],
    initialize: function() {},
    render: function() {
        $(this.el).html(this.template());
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle
    }
});