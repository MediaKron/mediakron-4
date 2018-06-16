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

Mediakron.Admin.ActivityPage = Mediakron.Extensions.View.extend({
    template: JST['settings.activity'],
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
        });
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click .sort': 'sort'
    },
    sort: function(e) {
        var attr = $(e.currentTarget).attr('sort'),
            dir = $(e.currentTarget).attr('dir');
        this.attr = attr;
        if (!dir) dir = 'desc';
        if (dir == 'asc') {
            dir = 'desc';
        } else if (dir == 'desc') {
            dir = 'asc';
        }
        $(e.currentTarget).attr('dir', dir).removeClass('sort-asc sort-desc').addClass('sort-' + dir);
        this.tbody.empty();
        var data;
        if (dir == 'asc') {
            data = this.statistics.sort(

            function(a, b) {
                if (a[attr] < b[attr]) return -1;
                if (a[attr] > b[attr]) return 1;
                return 0;
            });
        } else {
            data = this.statistics.sort(

            function(a, b) {
                if (a[attr] > b[attr]) return -1;
                if (a[attr] < b[attr]) return 1;
                return 0;
            });
        }
        this.tbody.append(this.rows({
            users: data
        }));
    }
});