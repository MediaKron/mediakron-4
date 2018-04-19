
Mediakron.HelpPage = Mediakron.Extensions.View.extend({
    template: JST['help.default'],
    type: false,
    initialize: function (type) {
        this.type = type;
        this.elementParent = $('#help-context');
        if(type){
            var template = 'help.'+type;
            if(JST[template]){
                this.template = JST[template];
            }
        }
    },
    render: function () {
        var content = {};
        $(this.el).html(this.template(content));
        return this;
    },
    afterRender: function(){
    },
    events: {
        'click a':                         Mediakron.linkHandle,
        'click #close-help':               'closeHelp',
        'click .intro-tour':        'guidedTour'
    },
    guidedTour:function(){
        require(["tours/intro"],function(tour){
            tour.start(); 
        });

    },
    closeHelp:function(){
        this.elementParent.addClass('closed').removeClass('opened');
        Mediakron.router.navigate(this.lastRoute);
        this.currentRoute = this.lastRoute;
    }
    
});