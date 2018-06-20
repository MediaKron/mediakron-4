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