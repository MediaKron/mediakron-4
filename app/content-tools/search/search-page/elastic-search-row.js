Mediakron.Search.rowElasticSearch = Mediakron.ContentBrowser.Row.extend({
    events: {
        'click a':                          Mediakron.linkHandle,
        'click .show-highlight':            'showResults'
    },
    showResults: function(e){
        var target = $(e.currentTarget);
        target.next().slideDown('slow');
        return false;
    }
});