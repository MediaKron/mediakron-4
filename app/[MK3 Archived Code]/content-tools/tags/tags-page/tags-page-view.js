import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./content-tools/tags/tags-page/tags-page.html";

var view = false;

export default class Tags extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'classname',
            data: false,
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
     * @param {object} data 
     */
    initialize(data) {
        this.tags = Mediakron.items.where({type:'tag'});
        this.tags = _.sortBy(this.tags, function(tag){ return tag.get('title'); });
        if (!Mediakron.loading) {
          this.render();
        }else{
          this.$el.html("Loading ...");
          Mediakron.App.Events.on('load:complete', function(){
            view.render();
          });
        }
        return this;
    }

    /**
     * Render the view
     */
    render() {
        this.$el.html(this.template());
        return this;
    }

    get events() {
        return {
            'event target': 'callback'
        }
    }

    afterrender() {
        var row;
        _.each(this.tags,function(tag){
            row = new Mediakron.Pages.tagRow(tag);
        });
    }

    /**
     * Description
     * @param {object} something 
     */
    newName(something) {
       
    }

}

// @REVIEW then, delete. Original view below
// Mediakron.Pages.tags = Mediakron.Extensions.View.extend({
//     template: JST['pages.tags'],
//     tags:{},
//     initialize: function(){
//         this.tags = Mediakron.items.where({type:'tag'});
//         this.tags = _.sortBy(this.tags, function(tag){ return tag.get('title'); });
//         if (!Mediakron.loading) {
//           this.render();
//         }else{
//           this.$el.html("Loading ...");
//           Mediakron.App.Events.on('load:complete', function(){
//             view.render();
//           });
//         }
//         return this;
//     },
    
//     render: function(){
//         this.$el.html(this.template());
//         return this;
//     },
//     afterRender:function(){
//         var row;
//         _.each(this.tags,function(tag){
//             row = new Mediakron.Pages.tagRow(tag);
//         });
//     },
    
//     events: {
//         'click a':                          Mediakron.linkHandle
//     }

// });