Mediakron.Pages.tags = Mediakron.Extensions.View.extend({
    template: JST['pages.tags'],
    tags:{},
    initialize: function(){
        this.tags = Mediakron.items.where({type:'tag'});
        this.tags = _.sortBy(this.tags, function(tag){ return tag.get('title'); });
        if (!Mediakron.loading) {
          this.render();
        }else{
          this.$el.html("Loading ...");
          Mediakron.App.Events.on('load:complete', function(){
            view.render();
          });
        }
        return this;
    },
    
    render: function(){
        this.$el.html(this.template());
        return this;
    },
    afterRender:function(){
        var row;
        _.each(this.tags,function(tag){
            row = new Mediakron.Pages.tagRow(tag);
        });
    },
    
    events: {
        'click a':                          Mediakron.linkHandle
    }

});
