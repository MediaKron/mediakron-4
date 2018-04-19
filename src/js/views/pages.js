/**
 * Pages are full screen layouts extending the base view, so that there can be transitions between the 
 * individual views
 */



Mediakron.Pages.Default = Mediakron.Extensions.View.extend({
    template: JST['pages.default'],
    className: 'pages pages-layout layout-pages',
    el: '#main', // el attaches to existing element
    initialize: function(){
        this.render();
        return this;
    },
    render: function(){
        
        this.$el.append(this.template());
        this.$el.addClass('sidebarScroll');
        return this;
    },
    gotoView: function (view) {
        var previous = this.currentPage || null;
        var next = view;

        if (previous){
            if(typeof(previous.transitionOut) === 'function') {
                previous.transitionOut(function () {
                    previous.remove();
                });
            }else{
                previous.remove();
            }
        }

        next.render();

        Mediakron.App.Events.trigger("context:goto",{ view: next });
        
        next.$el.addClass('page');
        this.$el.append( next.$el );
        next.afterRender();
        if(typeof(next.transitionIn) === 'function'){
            next.transitionIn();
        }else{
            next.$el.show();
        }
        this.currentPage = next;

    },
    showFull: function(item){
        
    }

});



