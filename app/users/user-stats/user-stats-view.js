Mediakron.Admin.StatisticsPage = Mediakron.Extensions.View.extend({
    template: JST['settings.statistics'],
    rows: JST['settings.statistics.tbody'],
    statistics: false,
    tbody: false,
    attr: false,
    initialize: function() {},
    render: function() {
        var view = this;
        view.$el.html(view.template());
        view.tbody = $('tbody', view.$el);
        $.getJSON(Mediakron.Data.stats, function(data) {
            view.statistics = data.users;
            view.tbody.append(view.rows({
                users: data.users
            }));
            require(["datatables"], function(plugin) {
                $('#admin-site-settings table').dataTable({
                    paginate: false
                });
            });
        });
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit
    }
});