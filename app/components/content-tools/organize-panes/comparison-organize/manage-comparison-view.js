Mediakron.Relationships.Manage.comparison = Mediakron.Relationships.Manage.abstract.extend({
    template: JST['settings.relationships.manage.comparison'],
    afterRender: function() {
        var view = this;
        $('#sort-comparison').sortable({
            placeholder: "ui-state-highlight",
            stop: function(event, ui) {
                Mediakron.Status.formChanged = true;
                var uri, type, title, order = [];
                $('#sort-comparison li').each(function() {
                    item = $(this);
                    uri = item.attr('uri');
                    data = JSON.parse(item.attr('data'));
                    order.push({
                        'uri': uri,
                        'data': data
                    });
                });
                view.changes = order;
            }
        });
    }
});