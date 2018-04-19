Mediakron.Pages.folder = Mediakron.Extensions.View.extend({
    template: JST['pages.folder.default'],
    className: 'pages pages-layout layout-pages',
    $itemEl: false,
    context: false,
    item: false,
    uri: false,
    childrenURI: [],
    primary: false,
    initialize: function(model){
        this.primary = false;
        this.context = model;
        this.model = model;
        this.current = this.model;
        this.uri = this.model.get('uri');
        this.childrenURI = _.map(this.model.getRelationship('children'), function(item){
            if(item){
                return item.uri;
            }
        });

        return this;
    },
    render: function(){
        if(this.layout){
            this.template = JST['pages.folder.'+this.layout];
        }else if(this.model.get('template')){
            this.template = JST['pages.folder.'+this.model.get('template')];
        }
        if(!this.template){
            this.template = JST['pages.folder.default'];
        }
        this.getCurrent();

        var content = this.model.toJSON();
            content.model = this.model;
            content.item = this.model;
            content.current = this.current.get('uri');
            content.primary = this.primary;

        var lastFolder = Mediakron.controller.getLastFolder();
        if(this.model.get('uri') == lastFolder){
            content.last = true;
        }else{
            content.last = false;
        }

        this.$el.append(this.template(content));  
        return this;
    },
    afterRender: function(){
        this.model.getSidebar(this.$el); 
        $(".annotate img",this.$el).annotateImage({
            editable: true,
            model: this.model,
            notes: this.model.getRelationship('annotations')
        });
        //if(this.model.get('uri') !== this.current.get('uri')){
        //    this.gotoItem(this.current,this.model.get('uri'));
        //}

        $( ".folder-previous" ).hover(function() {
          $( this ).find( "span.navigation-title" ).toggleClass( "sr-only" );
        });
        
        $('#folder-mosaic-'+this.model.get('uri')).justifiedGallery({
                  lastRow:'justify',
                  rowHeight:'200'
        });
        
        /* fade main titles on scroll  */
        $('#main-container').scroll(function(){        
          $(".background-image-active .item-header h2")
           .css("opacity", 1 - $('#main-container').scrollTop() / 500);
        });
        
        /* Load accessible dropdown menu plugin  */
        accessibleNav();
    },
    events: {
        'click a':                         Mediakron.linkHandle,
        'mouseenter .organize-button-bind': 'showOrganizeButton',
        'mouseleave .organize-button-bind': 'removeOrganizeButton'
        
    },
    showOrganizeButton: function() {
     $( ".sticky-header .option-organize" ).clone().appendTo( ".organize-button-bind" ).addClass("in-context");   
    },
    removeOrganizeButton: function() {
     $( ".organize-button-bind .option-organize").remove();  
    },
    gotoItem:     function (item,otrace) { 
        var currentItem;
        if(item){
            currentItem = item;
            var $el = $('.folder-current-item'), view = item.getView();
            $el.empty();
            view.setElement('.folder-current-item');
            view.render();
            $('#fl-'+this.model.get('uri')).hide();
            $el.show();
            view.afterRender();
        }else{
            currentItem = this.model;
            $('#fl-'+this.model.get('uri')).show();
            $('.folder-current-item').hide();
        }
    },
    renderNavigation:function(folder,item){
            
        this.childrenURI = _.map(folder.getRelationship('children'), function(look){
            if(look){
                return look.uri;
            }
        });
    
        var current = item.get('uri'), 
            pos = this.childrenURI.indexOf(current),
            next = this.childrenURI[pos+1],
            previous = this.childrenURI[pos-1];
            path = Mediakron.controller.getPath(true);
        
        if(next != this.model.get('uri')){
            path = path+next;
        }
        if(next){
            var nextModel = Mediakron.getItemFromURI(next);
            if(nextModel){
                $('.folder-next')
                    .show()
                    .html('<span class="navigation-title">Next <span class="navigation-folder"> in <em>'+this.model.get('title')+'</em></span>: <strong> '+nextModel.get('title')+'</strong></span><span class="mk-icon mk-arrow-right"></span>')
                    .attr('href',basepath+path);
            }else{
                $('.folder-next').hide();
            }
        }else{
            $('.folder-next')
                .show()
                .html('<span class="navigation-title navigation-last"><span class="navigation-folder">End of <em>'+this.model.get('title')+' </em> | </span> Back to contents </span><span class="mk-icon mk-return"></span>')
                .attr('href',Mediakron.controller.getPath(true));
        }
        
        path = this.model.getCurrentUrl();
        if(previous != this.model.get('uri')){
            path = path+'/'+previous;
        }
        
  
        
        if(previous){
            var previousModel = Mediakron.getItemFromURI(previous);
            if(previousModel){
                $('.folder-previous')
                    .show()
                    .html('<span class="mk-icon mk-arrow-left"></span><span class="navigation-title sr-only">Previous <span class="navigation-folder">in <em>  '+this.model.get('title')+'</em></span>:  <strong>'+previousModel.get('title')+'</strong></span')
                    .attr('href',basepath+path);
            }else{
                $('.folder-previous').hide();
            }
        }else{
            $('.folder-previous').hide();
        }
        
    }

});