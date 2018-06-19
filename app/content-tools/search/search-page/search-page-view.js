Mediakron.Search.initial =  Backbone.View.extend({
    template: JST['navigation.search'],
    el: 'body',
    initialize: function(){
        var view = this;
        view.render();
        var bestPictures = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          limit:10,
          prefetch: {
              cache: false,
              url: Mediakron.Data.search.terms
            }
        });
        var typeahead = $('#search-field').typeahead({
          hint: true,
          highlight: true,
          minLength: 1
        },
        {
          name: 'value',
          display: 'value',
          source: bestPictures,
          templates: {
            header: '<div class="typeahead-header">Common Words:</div>',
            suggestion: _.compile('<div><strong><%= value %></strong> (<%= count %>)</div>')
          }
          
        });
        $('#search-field').bind('typeahead:selected', function(obj, datum, name) {   
            view.doSearch();
        });

        
    },
    render: function(){
        this.$el.append(this.template());
        return this;
    },
    events: {
        'click .search-submit':                     'doSearch'
    },
    doSearch:function(evt){
        var search = $('#search-field').val();
        var Search = new Mediakron.Search.elasticSearch({}).render();
        Search.search(search,function(){
            console.log('search complete');
        });
        return false;
    }
});


