import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./templatenames/default.html";

var view = false;

export default class Comparison extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'pages pages-layout layout-pages',
            itemEl: '#comparison-items',
            $itemEl: false,
            children: false,
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
        this.children = this.model.getRelationship('children');
        
        this.template = JST['pages.comparison.'+model.get('template')];

        return this;
    }

    /**
     * Render the view
     */
    render() {
        if(this.layout){
            if(JST['pages.comparison.'+this.layout]){
              this.template = JST['pages.comparison.'+this.layout];
            }
          }
          
          var content = this.model.toJSON();
              content.item = this.model;
              content.model = this.model;
              content.children = this.children;
          this.$el.append(this.template(content));    
          
          return this;
    }

    get events() {
        return {
            'click a': Mediakron.linkHandle,
        }
    }

    afterrender() {
        this.model.getSidebar(this.$el);
        var child,view, comparison = this.context;
        if(this.children){
            if(this.children[0]){
                child = Mediakron.getItemFromURI(this.children[0].uri);
                if(child){
                    child.comparison = this.item;
                    view = child.getView('comparison');
                    view.setElement('.items-comparison-'+comparison.get('uri')+' .cmp-'+this.children[0].uri+' .contents');
                    view.render();
                    view.afterRender();
                }
            }
            if(this.children[1]){
                child = Mediakron.getItemFromURI(this.children[1].uri);
                child.comparison = this.item;
                if(child){
                    view = child.getView('comparison');
                    view.setElement('.items-comparison-'+comparison.get('uri')+' .cmp-'+this.children[1].uri+' .contents');
                    view.render();
                    view.afterRender();
                }
            }
            var length = this.children.length, i = 2;
            for(i; i < length; i++){
                if(this.children[i]){
                    child = Mediakron.getItemFromURI(this.children[i].uri);
                    if(child){
                        child.comparison = this.item;
                        view = child.getView('comparison');
                        view.setElement('.items-comparison-'+comparison.get('uri')+' .cmp-'+this.children[i].uri+' .contents');
                        view.render();
                        view.afterRender();
                    }
                    
                }
            } 
            
        }
        
        $('#comparison-items .comparison-item').hover(function(e){
            e.preventDefault();
            e.stopPropagation();
            var target = $(e.currentTarget);
            $('.remove',target).fadeIn('fast');
            return false;
        },function(e){
            e.preventDefault();
            e.stopPropagation();
            var target = $(e.currentTarget);
            $('.remove',target).fadeOut('fast');
            return false;
        });
        
        this.$el.addClass('comparison comparison-'+this.children.length);
        
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

Mediakron.Pages.comparison =  Mediakron.Extensions.View.extend({
    template: JST['pages.comparison.default'],
    className: 'pages pages-layout layout-pages',
    itemEl: '#comparison-items',
    $itemEl: false,
    children: false,
    initialize: function(model){
        
        this.context = model;
        this.model = model;
        this.children = this.model.getRelationship('children');
        
        this.template = JST['pages.comparison.'+model.get('template')];


        return this;
    },
    render: function(){
        if(this.layout){
          if(JST['pages.comparison.'+this.layout]){
            this.template = JST['pages.comparison.'+this.layout];
          }
        }
        
        var content = this.model.toJSON();
            content.item = this.model;
            content.model = this.model;
            content.children = this.children;
        this.$el.append(this.template(content));    
        
        return this;
    },
    afterRender: function(){
        this.model.getSidebar(this.$el);
        var child,view, comparison = this.context;
        if(this.children){
            if(this.children[0]){
                child = Mediakron.getItemFromURI(this.children[0].uri);
                if(child){
                    child.comparison = this.item;
                    view = child.getView('comparison');
                    view.setElement('.items-comparison-'+comparison.get('uri')+' .cmp-'+this.children[0].uri+' .contents');
                    view.render();
                    view.afterRender();
                }
            }
            if(this.children[1]){
                child = Mediakron.getItemFromURI(this.children[1].uri);
                child.comparison = this.item;
                if(child){
                    view = child.getView('comparison');
                    view.setElement('.items-comparison-'+comparison.get('uri')+' .cmp-'+this.children[1].uri+' .contents');
                    view.render();
                    view.afterRender();
                }
            }
            var length = this.children.length, i = 2;
            for(i; i < length; i++){
                if(this.children[i]){
                    child = Mediakron.getItemFromURI(this.children[i].uri);
                    if(child){
                        child.comparison = this.item;
                        view = child.getView('comparison');
                        view.setElement('.items-comparison-'+comparison.get('uri')+' .cmp-'+this.children[i].uri+' .contents');
                        view.render();
                        view.afterRender();
                    }
                    
                }
            } 
            
        }
        
        $('#comparison-items .comparison-item').hover(function(e){
            e.preventDefault();
            e.stopPropagation();
            var target = $(e.currentTarget);
            $('.remove',target).fadeIn('fast');
            return false;
        },function(e){
            e.preventDefault();
            e.stopPropagation();
            var target = $(e.currentTarget);
            $('.remove',target).fadeOut('fast');
            return false;
        });
        
        this.$el.addClass('comparison comparison-'+this.children.length);
        
        /* Load accessible dropdown menu plugin  */
        accessibleNav();
    },
    events: {
        'click a':                                 Mediakron.linkHandle,
    },
    gotoItem:     function (item) {

    }
});