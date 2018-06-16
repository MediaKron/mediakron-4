Mediakron.Collections.SearchResults = Backbone.Collection.extend({
    model: Mediakron.SearchResult,
    url: function () {
        return basepath + 'mediakron/fetch/collection/search/' + Mediakron.Settings.searchQuery;
    }
});