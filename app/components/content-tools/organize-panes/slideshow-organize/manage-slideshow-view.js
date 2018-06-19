Mediakron.Relationships.Manage.folder = Mediakron.Relationships.Manage.abstract.extend({
    template: JST['settings.relationships.manage.slideshow'],
    afterRender: function() {
        var view = this;
        $('#sort-slideshow').sortable({
            placeholder: "ui-state-highlight",
            handle: ".drag-item",
            stop: function(event, ui) {
                Mediakron.Status.formChanged = true;
                var uri, type, title, order = [];
                $('#sort-slideshow li').each(function() {
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