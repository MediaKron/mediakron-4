Mediakron.Canvas = {};

Mediakron.Canvas.Form = Mediakron.Extensions.View.extend({
    template: JST['settings.canvas'],
    courses: false,
    popup: false,
    initialize: function () {
        
    },
    render: function () {
        this.$el.html(this.template(Mediakron.user.toJSON()));
        var view = this;
        Mediakron.App.Events.on("refresh:canvas",function(change) {
            Mediakron.user.fetch({
                success: function(user){
                    view.render();
                    setTimeout(function(){
                        if(user.get('canvas')){
                            var courses = new Mediakron.Canvas.Courses();
                        }
                    },1000);
                    var i = 0, end = 100, interval = setInterval(function(){ 
                        $('#site-list .progress-bar').width(i+'%').attr('aria-valuenow',i); 
                        i++;
                        if(i > end){
                            clearInterval(interval);
                        }
                    },10);
                    
                }
            });
        });
        return this;
    },
    events: {
        'click a':                         Mediakron.linkHandle,

        'click #connect':            'connect',
        'click #disconnect':         'disconnect',
        'click #close-settings-context':   Mediakron.Edit.cancelEdit,
        'click .close-button':              Mediakron.Edit.cancelEdit,
    },
    afterRender:function(){
        var courses = new Mediakron.Canvas.Courses();
        
    },
    connect:function(){
        var view = this;
        window.open(Mediakron.Data.canvasConnect, 'canvasconnect', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=700,height=500');
    },
    disconnect:function(){
        var view = this;
        window.open(Mediakron.Data.canvasDisconnect, 'canvasconnect', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=450,height=450');
    }
});

Mediakron.Canvas.Courses = Mediakron.Extensions.View.extend({
    template: JST['settings.canvas.courses'],
    courses: false,
    el:'#site-list',
    initialize: function () {
        this.render();
    },
    render: function () {
        var courses = this.courses, view = this;
        $.ajax( {
            type: "get",
            cache: false,
            url: Mediakron.Data.courses, 
            success: function(data) {
                courses = JSON.parse(data);
                view.$el.html(view.template({'courses':courses}));
            },
            error: function(request) {
                var message = JSON.parse(request.responseText);
                Mediakron.message({
                    layout: 'top',
                    text: message.error,
                    type:'danger',
                    confirm:     false,
                    dismiss:    true      
                });
            }
        });
        
        
        return this;
    },
    events: {
        'click a':                         Mediakron.linkHandle,
        'click .connect':                   'connect'
    },
    connect: function(e){
        var target = $(e.currentTarget), courseId = target.attr('course'), view = this;
        $.ajax( {
            type: "get",
            cache: false,
            url: Mediakron.Data.connectCourse + '/' + courseId , 
            success: function(data) {
                view.render();
            },
            error: function(request) {
                var message = JSON.parse(request.responseText);
                Mediakron.message({
                    layout: 'top',
                    text: message.error,
                    type:'danger'
                });
            }
        });
    }
});