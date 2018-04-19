Mediakron.Collections.Comments = Backbone.Collection.extend({
    initialize: function (data) {
        this.uri = data.uri;
    },
    uri: 'uri',
    model: Mediakron.Models.Comment,
    comparator: function (item) {
        return parseInt(item.get('created'), 10) * -1;
    },
    url: function () {
        if (this.uri) {
            return Mediakron.Data.collections.comments + '/' + this.uri;
        } else {
            return Mediakron.Data.collections.comments;
        }

    }
});