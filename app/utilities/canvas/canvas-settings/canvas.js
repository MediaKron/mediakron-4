// The base view class
import MediakronView from '~/core-js/extensions/views';
// Import Jquewry
import $ from "jquery";
// Import Lodash
import _ from "lodash";

// Import template
import template from "./canvas.html";

export default class CanvasForm extends MediakronView{
    /**
     * 
     */
    constructor(){
        this.courses = false;
        this.popup = false;
    }
    
    /**
     * 
     */
    initialize () {
        return this;
    }

    /**
     * 
     */
    render () {
        this.$el.html(this.template(Mediakron.user.toJSON()));
        var view = this;
        Mediakron.App.Events.on("refresh:canvas",function(change) {
            Mediakron.user.fetch({
                success(user){
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
    /**
     * 
     */
    get events(){
        return {
            'click a':                          Mediakron.linkHandle,
            'click #connect':                   'connect',
            'click #disconnect':                'disconnect',
            'click #close-settings-context':    Mediakron.Edit.cancelEdit,
            'click .close-button':              Mediakron.Edit.cancelEdit,
        }
    }

    /**
     * 
     */
    afterRender(){
        var courses = new Mediakron.Canvas.Courses();
        
    }
    /**
     * 
     */
    connect(){
        var view = this;
        window.open(Mediakron.Data.canvasConnect, 'canvasconnect', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=700,height=500');
    }

    /**
     * 
     */
    disconnect(){
        var view = this;
        window.open(Mediakron.Data.canvasDisconnect, 'canvasconnect', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=450,height=450');
    }
}
