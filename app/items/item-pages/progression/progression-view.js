import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./templates/default.html";

var view = false;

export default class Progression extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'pages pages-layout layout-pages',
            itemEl: '#progression',
            $itemEl: false,
            context: false,
            item: false,
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
     * @param {object} model
     */
    initialize(model) {
        this.context = model;
        this.model = model;
        return this;
    }

    /**
     * Render the view
     */
    render() {
        if(this.layout){
            this.template = JST['pages.progression.'+this.layout];
        }
        var content = this.model.toJSON();
        content.item = this.model;
        content.model = this.model;
        this.$el.append(this.template(content));    
        return this;s;
    }

    get events() {
        return {
            'click a': Mediakron.linkHandle
        }
    }

    afterrender() {
        this.model.getSidebar(this.$el);
        var children = this.model.getRelationship('children'), number = children.length, i = 0, item, uri, view;
        $('.progression-frame').progression({'model':this.model});
        
        /* Load accessible dropdown menu plugin  */
        accessibleNav();
    }

    /**
     * Description
     * @param {object} something 
     */
    gotoItem:(item) {
       
    }

}

// @REVIEW then, delete. Original view below

// Mediakron.Pages.progression =  Mediakron.Extensions.View.extend({
//     template: JST['pages.progression.default'],
//     className: 'pages pages-layout layout-pages',
//     itemEl: '#progression',
//     $itemEl: false,
//     context: false,
//     item: false,

//     initialize: function(model){
//         this.context = model;
//         this.model = model;
//         return this;
//     },
//     render: function(){
//         if(this.layout){
//             this.template = JST['pages.progression.'+this.layout];
//         }
//         var content = this.model.toJSON();
//         content.item = this.model;
//         content.model = this.model;
//         this.$el.append(this.template(content));    
//         return this;
//     },
//     afterRender: function(){
//         this.model.getSidebar(this.$el);
//         var children = this.model.getRelationship('children'), number = children.length, i = 0, item, uri, view;
//         $('.progression-frame').progression({'model':this.model});
        
//         /* Load accessible dropdown menu plugin  */
//         accessibleNav();
//     },
    
//     events: {
//         'click a':                         Mediakron.linkHandle
//     },
//     gotoItem:     function (item) {

//     }
// });