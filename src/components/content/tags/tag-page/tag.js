/**
 * This is the primary app view.  Its going to attach itself to the core region and act as an
 * air traffic controller for all of the children views.  Awesome, cause by binding it this way,
 * we can grab a view, and ask it to transition inward, and the fly effects will work nicely.
 */
 
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


 Mediakron.Pages.tagRow = Mediakron.Extensions.View.extend({
    template: JST['pages.tag.tag'],
    el: '.taglist',
    initialize: function(model){
        this.model = model;
        this.render();
        return this;
    },
    
    render: function(){
        var content = this.model.toJSON();
        content.model = this.model;
        this.$el.append(this.template(content));
        return this;
    },
    
    events: {
        'click a':                          Mediakron.linkHandle
    }

});

Mediakron.Pages.tag = Mediakron.Extensions.View.extend({
    template: JST['pages.tag.default'],
    
    initialize: function(model){
        this.model = model;
        return this;
    },
    
    
    
    render: function(){
        if(this.layout){
            this.template = JST['pages.tag.'+this.layout];
        }else if(this.model.get('template')){
            this.template = JST['pages.tag.'+this.model.get('template')];
        }
        
        var content = this.model.toJSON();
            content.model = this.model;
        this.$el.html(this.template(content));

        return this;
    },
    
    afterRender: function(){
        this.model.getSidebar(this.$el);
    },
    gotoItem:function(){},
    events: {
        'click a':                          Mediakron.linkHandle
    }
});