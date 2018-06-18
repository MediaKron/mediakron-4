Mediakron.Collections.Groups = Backbone.Collection.extend({
    model: Mediakron.Models.Group,
    url: (Mediakron.Data.collections.groups) ? Mediakron.Data.collections.groups : ''
});