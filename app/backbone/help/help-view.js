import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./templatename.html";

var view = false;

export default class HelpPage extends MediakronView {
    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            type: false,
        })
        this.data = Mediakron.Settings.HomePage;
        var view = this;

        // @brad - not sure how to handle multiple templates
        if (this.data.layout) {
            if (JST['pages.welcome.' + this.data.layout]) {
                this.template = JST['pages.welcome.' + this.data.layout];
            }
        }
        this.item = false;
        if (request.item) {
            this.item = request.item;
        }
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
        this.type = type;
        this.elementParent = $('#help-context');
        if(type){
            var template = 'help.'+type;
            if(JST[template]){
                this.template = JST[template];
            }
        }
    }

    /**
     * Render the view
     */
    render() {
        var content = {};
        $(this.el).html(this.template(content));
        return this;
    }

    get events() {
        return {
            'click a':                  Mediakron.linkHandle,
            'click #close-help':        'closeHelp',
            'click .intro-tour':        'guidedTour'
        }
    }

    /**
     * Close Help Window
     * @param {object} 
     */
    closeHelp() {
        this.elementParent.addClass('closed').removeClass('opened');
        Mediakron.router.navigate(this.lastRoute);
        this.currentRoute = this.lastRoute;
    }
}

// @REVIEW then, delete. Original view below

// Mediakron.HelpPage = Mediakron.Extensions.View.extend({
//     template: JST['help.default'],
//     type: false,
//     initialize: function (type) {
//         this.type = type;
//         this.elementParent = $('#help-context');
//         if(type){
//             var template = 'help.'+type;
//             if(JST[template]){
//                 this.template = JST[template];
//             }
//         }
//     },
//     render: function () {
//         var content = {};
//         $(this.el).html(this.template(content));
//         return this;
//     },
//     afterRender: function(){
//     },
//     events: {
//         'click a':                         Mediakron.linkHandle,
//         'click #close-help':               'closeHelp',
//         'click .intro-tour':        'guidedTour'
//     },
    
//     closeHelp:function(){
//         this.elementParent.addClass('closed').removeClass('opened');
//         Mediakron.router.navigate(this.lastRoute);
//         this.currentRoute = this.lastRoute;
//     }
    
// });