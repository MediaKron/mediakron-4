Mediakron.Pages.progression =  Mediakron.Extensions.View.extend({
    template: JST['pages.progression.default'],
    className: 'pages pages-layout layout-pages',
    itemEl: '#progression',
    $itemEl: false,
    context: false,
    item: false,

    initialize: function(model){
        this.context = model;
        this.model = model;
        return this;
    },
    render: function(){
        if(this.layout){
            this.template = JST['pages.progression.'+this.layout];
        }
        var content = this.model.toJSON();
        content.item = this.model;
        content.model = this.model;
        this.$el.append(this.template(content));    
        return this;
    },
    afterRender: function(){
        this.model.getSidebar(this.$el);
        var children = this.model.getRelationship('children'), number = children.length, i = 0, item, uri, view;
        $('.progression-frame').progression({'model':this.model});
        
        /* Load accessible dropdown menu plugin  */
        accessibleNav();
    },
    
    events: {
        'click a':                         Mediakron.linkHandle
    },
    gotoItem:     function (item) {

    }
});
