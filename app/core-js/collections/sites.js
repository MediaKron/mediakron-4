Mediakron.Collections.Sites = Backbone.Collection.extend({
    initialize: function (data) {
        this.uri = data.uri;
    },
    uri: 'uri',
    model: Mediakron.Models.Sites,

    url: function () {
        if (this.uri) {
            return Mediakron.Data.collections.comments + '/' + this.uri;
        } else {
            return Mediakron.Data.collections.comments;
        }

    }
});