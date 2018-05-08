Mediakron.Pages.narrative = Mediakron.Extensions.View.extend({
    template: JST['pages.narrative.default'],
    className: 'pages pages-layout layout-pages',
    itemEl: '#narrative-items',
    $itemEl: false,
    context: false,
    item: false,
    childrenURI: [],
    initialize: function(model){
        this.context = model;
        this.model = model;
        this.current = model;
        
        return this;
    },
    render: function(){
        var content = this.model.toJSON();
            content.item = this.model;
            content.model = this.model;
            content.current = this.current.get('uri');
        if(this.model.get('template')){
            this.template = JST['pages.narrative.'+this.model.get('template')];
        }
        this.getCurrent();
        this.$el.append(this.template(content));
        
        return this;
    },
    afterRender: function(){
        this.model.getSidebar(this.$el);
        
        var children = this.model.getRelationship('children'), number = children.length, i = 0, child, uri, view,
            current = this.current.get('uri'), layout, template, type, imageHeight = (Mediakron.Status.Height * 0.8)+'px',
            positions = [], top, position = 0, next = 0, prev = 0, narURI = this.model.get('uri');
        for(i;i<number;i++){
            uri = children[i].uri;
            this.childrenURI.push(uri);
            child = Mediakron.getItemFromURI(uri);
            if(child){
                template = 'default';
                layout = false;
                type = child.getNormalType();
                if(Mediakron.Narrative.templates[type]){
                    if(children[i].data){
                        if(children[i].data.template){
                            template = children[i].data.template;
                            layout = 'narrative.'+template;
                        }
                    }
                }
                if(!layout){
                    layout = 'narrative.default';
                }
                view = child.getView(layout);
                view.setElement('#nr-'+this.model.get('uri')+'-'+uri);
                view.render();
                
                $('.annotate img',view.$el).css({ 'max-height':imageHeight });
                view.afterRender();
                //top = view.$el.position().top;
                //positions.push({pos:-1*(top-30),link:this.model.get('uri')+'/'+uri});
            }
        }
        setTimeout(function(){
            var lookForNext = positions[next], lookForPrevious = positions[prev];
            var find = $('.nr-'+current);
            if(find){
                if(find.length > 0){
                    var top1 = find.position().top;
                    $('#mediakron').scrollTop(top1);
                }
            }
            
        }, 100);
        /*
        
        setTimeout(function(){
            var lookForNext = positions[next], lookForPrevious = positions[prev];
            var find = $('.nr-'+current);
            if(find){
                if(find.length > 0){
                    var top1 = find.position().top;
                    $('#mediakron').scrollTop(top1);
                }
            }
            
        }, 100);
        
        
        Mediakron.App.Events.on('scroll:ing',function(object){
            if(lookForNext){
                if(lookForNext.pos){
                    if(lookForNext.pos > object.pos){
                        Mediakron.router.navigate(lookForNext.link);
                        next = next+1;
                        lookForNext = positions[next];
                        prev = next-1;
                        if(prev < 0) prev = 0;
                        lookForPrevious = positions[prev];
                    }

                }
            }
            if(lookForPrevious.pos < object.pos && next > 0){
                Mediakron.router.navigate(lookForPrevious.link);
                next = next-1;
                lookForNext = positions[next];
                prev = next-1;
                if(prev < 0) prev = 0;
                lookForPrevious = positions[prev];
            }
            if(object.pos > 0 && next === 0){
                Mediakron.router.navigate(narURI);
                next = 0;
                lookForNext = positions[next];
                prev = 0;
                lookForPrevious = positions[prev];
            }
        });*/
        
        /* Load accessible dropdown menu plugin  */
        accessibleNav();
        
    },
    events: {
        'click a':                         Mediakron.linkHandle
    },
    gotoItem:     function (item) {
        if(!item){
            $('.narrative').scrollTop(0);
            return this;
        }
        var top1 = $('.nr-'+item.get('uri')).position().top;
        jQuery('#mediakron').scrollTop(top1);
    }
});
