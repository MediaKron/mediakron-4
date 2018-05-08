Mediakron.Search = {};

_.compile = function(templ) {
  var compiled = this.template(templ);
  compiled.render = function(ctx) {
     console.log(ctx);
     return this(ctx);
  };
  return compiled;
};

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


Mediakron.Search.elasticSearch = Mediakron.ContentBrowser.View.extend({
    el:'.search-results',
    template: JST['settings.browser.content.elasticsearch'],
    title: 'Search Results',
    context: 'elasticsearch',
    help: '',
    noresult:'settings.browser.no.results.search',
    initialize: function (data) {
        if(data.item){
            Mediakron.Status.Managing = data.item;
            this.item = data.item;
        }
        
        this.query.thumbnails = '75';
        this.query.thumbnail = data.thumbnail;     
        this.query.sort = data.sort;             
        this.query.filter = data.filters;         
        this.query.skip = data.skip;             
        this.query.search = data.search;   
        this.query.result = data.result;   
        this.query.disabled = data.disabled;   

        if(data.context){ this.context = data.context; }
        if(data.callback){ this.callback = data.callback; }
        $('body').addClass(this.className);
        this.items = Mediakron.items;
        this.topics = Mediakron.topics;
        this.maps = Mediakron.maps;
        this.timelines = Mediakron.timelines;
        this.comparisons = Mediakron.comparisons;
    },
    search:function(value,callback){
        view = this;

        $.post( Mediakron.Data.search.query + value, function( data ) {
            $('table#admin-content').html("We're looking...");
        }).done(function( data ) {
            
            view.process(data);
            //view.tbody.update();
            view.tbody.reset = true;
            view.render().afterRender(true);
            
            callback();
        });
    },
    process: function(data){
        this.query.result = {};
        if(!data.timed_out){
            var total = data.hits.total, i = 0, hit, item;
            if(total > 0){
                for(i;i < total; i++){
                    hit = data.hits.hits[i];
                    if(hit){
                        item = Mediakron.items.get(hit._id);
                        if(item){
                            hit.uri = item.get('uri');
                            item.set('hit',hit);
                            this.query.result[hit.uri] = hit;
                        }
                    }
                }
            }else{
                $('table#admin-content').html("No Results.");
            }
        }else{
            $('table#admin-content').html("Error");
        }
        
    }
    
});

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