import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./canvas.html";

var view = false;

export default class CanvasForm extends MediakronView {
    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            courses: false,
            popup: false,
        })
        this.data = {};
            if (!this.changes) {
                this.changes = Mediakron.Settings;
            }
        view = this;    
    }

    // Cast the html template 
    get template() { 
        return _.template(tpl); 
    }

    /**
     * 
     * @param {object} data 
     */
    initialize(data) {
        return this;
    }

    /**
     * Render the view
     */
    render() {
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
    }

    get events() {
        return {
            'click a':                         Mediakron.linkHandle,
            'click #connect':            'connect',
            'click #disconnect':         'disconnect',
            'click #close-settings-context':   Mediakron.Edit.cancelEdit,
            'click .close-button':              Mediakron.Edit.cancelEdit
        }
    }

    afterrender() {
        var courses = new Mediakron.Canvas.Courses();
    }

    /**
     * Connect Canvas Site
     * @param {object} something 
     */
    connect() {
        var view = this;
        window.open(Mediakron.Data.canvasConnect, 'canvasconnect', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=700,height=500');
    }

    /**
     * Disconnect Canvas Site
     * @param {object} something 
     */
    disconnect() {
        var view = this;
        window.open(Mediakron.Data.canvasDisconnect, 'canvasconnect', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=450,height=450')
    }

}

// @REVIEW then, delete. Original view below;

// Mediakron.Canvas.Form = Mediakron.Extensions.View.extend({
//     template: JST['settings.canvas'],
//     courses: false,
//     popup: false,
//     initialize: function () {
        
//     },
//     render: function () {
//         this.$el.html(this.template(Mediakron.user.toJSON()));
//         var view = this;
//         Mediakron.App.Events.on("refresh:canvas",function(change) {
//             Mediakron.user.fetch({
//                 success: function(user){
//                     view.render();
//                     setTimeout(function(){
//                         if(user.get('canvas')){
//                             var courses = new Mediakron.Canvas.Courses();
//                         }
//                     },1000);
//                     var i = 0, end = 100, interval = setInterval(function(){ 
//                         $('#site-list .progress-bar').width(i+'%').attr('aria-valuenow',i); 
//                         i++;
//                         if(i > end){
//                             clearInterval(interval);
//                         }
//                     },10);
                    
//                 }
//             });
//         });
//         return this;
//     },
//     events: {
//         'click a':                         Mediakron.linkHandle,

//         'click #connect':            'connect',
//         'click #disconnect':         'disconnect',
//         'click #close-settings-context':   Mediakron.Edit.cancelEdit,
//         'click .close-button':              Mediakron.Edit.cancelEdit,
//     },
//     afterRender:function(){
//         var courses = new Mediakron.Canvas.Courses();
        
//     },
//     connect:function(){
//         var view = this;
//         window.open(Mediakron.Data.canvasConnect, 'canvasconnect', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=700,height=500');
//     },
//     disconnect:function(){
//         var view = this;
//         window.open(Mediakron.Data.canvasDisconnect, 'canvasconnect', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=450,height=450');
//     }
// });

