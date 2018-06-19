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