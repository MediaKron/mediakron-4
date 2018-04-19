/**
 * This is the primary app view.  Its going to attach itself to the core region and act as an
 * air traffic controller for all of the children views.  Awesome, cause by binding it this way,
 * we can grab a view, and ask it to transition inward, and the fly effects will work nicely.
 */
Mediakron.Pages.slideshow = Mediakron.Extensions.View.extend({
    template: JST['pages.slideshow.default'],
    className: 'pages pages-layout layout-pages',
    context: false,
    item: false,
    direction:'forward',
    current: false,
    fakeCurrent: false,
    childrenURI: [],
    overlay: false,
    
    initialize: function(model){
        this.context = model;
        this.model = model;
        this.current = model;
        this.childrenURI = [];
        var children = this.model.getRelationship('children'), number = children.length, i = 0, child, uri, view = this, current = this.current.get('uri');
        for(i;i<number;i++){
            if(children[i]){
                uri = children[i].uri;
                this.childrenURI.push(uri);
            }
        }
        return this;
    },
    
    
    
    render: function(){
        if(this.layout){
            this.template = JST['pages.slideshow.'+this.layout];
        }else if(this.model.get('template')){
            this.template = JST['pages.slideshow.'+this.model.get('template')];
        }
        this.childrenURI.push(this.model.get('uri'));
        
        this.getCurrent();
        
        var content = this.model.toJSON();
            content.model = this.model;
            content.item = this.model;
            content.current = this.current.get('uri');
        this.$el.html(this.template(content));
        
        var itemWidth = $('.carousel-item').width(), number = $('.carousel-item').length,
            width = itemWidth*number, padding = number * 20;
            $('#carousel-content').css({"width":width+padding});
            
        
        return this;
    },
    
    afterRender: function(){
        this.model.getSidebar(this.$el);
        var children = this.model.getRelationship('children'), number = children.length, i = 0, child, uri, view = this,
            width = $('.carousel').width(), mid = (width/2)-100, current = this.current.get('uri');
        
        var desired = this.childrenURI.indexOf(current), containerWidth = $('.region-carousel').width(),
            containerHalf = containerWidth/2,
            rightBound = containerHalf - (this.childrenURI.length*200),
            leftBound = (mid-(desired*200));
            this.leftBound = leftBound; this.rightBound = rightBound;
        
        child = Mediakron.getItemFromURI(current);
        if(child && current != this.model.get('uri')){
            var childView = child.getView();
            childView.setElement('#si-'+this.model.get('uri')+'-'+current);
            childView.render();
            childView.afterRender();
            this.overlay = false;
            this.current = child;
        }
        
        $('.carousel-content').css({left: leftBound+'px'}).draggable({
            axis:'x',
            stop:function(evt,ui){
                $('.carousel-next').show();
                if(ui.position.left > leftBound){
                     $('.carousel-next').hide();
                     $('.carousel-content').animate({left:leftBound});
                }else if(ui.position.left < rightBound){
                    $('.carousel-previous').hide();
                    $('.carousel-content').animate({left:rightBound});
                }else{
                    $('.carousel-next').show();
                    $('.carousel-previous').show();
                }
            }
        });
        $('.carousel').on('mousewheel DOMMouseScroll wheel',function(e){
            e.preventDefault();
            var pos = $('.carousel-content').position(),
                left;
            if(e.originalEvent.deltaX > 0) {
                left = pos.left+20;
                if(left < leftBound){
                    $('.carousel-next').show();
                    $('.carousel-previous').show();
                    $('.carousel-content').css({left:left+'px'});
                }else{
                    $('.carousel-next').hide();
                }
            }
            else{
                left = pos.left-20;
                if(left > rightBound){
                    $('.carousel-next').show();
                    $('.carousel-previous').show();
                    $('.carousel-content').css({left:left+'px'},200);
                }else{
                    $('.carousel-previous').hide();
                }
                
                
            }
            return false;
        });
        $("#si-"+this.model.get('uri')+" .annotate img").annotateImage({
            editable: true,
            model: this.model,
            notes: this.model.getRelationship('annotations')
        });
        
        this.getNext().getPrevious();  
        $('#slideshow-'+this.model.get('uri')).justifiedGallery({
          lastRow:'justify',
          rowHeight:'200'
        });
        
        /* Load accessible dropdown menu plugin  */
        accessibleNav();
    },
    
    events: {
        'click a':                              Mediakron.linkHandle,
        'click .carousel-toggle':               "carouselToggle",
        'mousedown .carousel-previous':         "onPrevious",
        'mouseup .carousel-previous':           "offPrevious",
        'mousedown .carousel-next':             "onNext",
        'mouseup .carousel-next':               "offNext",
        'mouseover .carousel':                  'showCarousel',
        'mouseout .carousel':                   'hideCarousel',
        'mouseenter':                           'enter',
        'mouseleave':                           'leave',
        'keydown':                              'keyAction',
        'click .overlay-bg':                    'closeSlideshow',
        'click .overlay-close':                 'closeSlideshow',
        'click .info-button':                   'toggleInfo',
        'click .close-button':                  'closeSlideshow'
    },
    closeSlideshow:function(){
        this.overlay = false;
        Mediakron.router.navigate(Mediakron.controller.getPath(true),{trigger:true});
    },
    enter: function() {
        this.$el.addClass('hover');
        var span = $('#key-nav');
        span.attr('tabindex', '1').attr('contenteditable', 'true');
        span.focus();
    },

    leave: function() {
        this.$el.removeClass('hover');
        var span = $('#key-nav');
        span.removeAttr('contenteditable').removeAttr('tabindex');
        span.blur();
    },
    
    keyAction: function(e) {
        var code = e.keyCode || e.which, current, next, pos, path;
        if(code == 39) { 
            current = this.current.get('uri');
            pos = this.childrenURI.indexOf(current);
            next = this.childrenURI[pos+1];
            path = this.model.getCurrentUrl();
                
            if(next != this.model.get('uri') && next){
                path = path+'/'+next;
            }
            Mediakron.router.navigate(path,{trigger:true});
            return this;
        }
        if(code == 37) { 
            current = this.current.get('uri');
            pos = this.childrenURI.indexOf(current);
            previous = this.childrenURI[pos-1];
            path = this.model.getCurrentUrl();
                
            if(previous != this.model.get('uri') && previous){
                path = path+'/'+previous;
            }
            Mediakron.router.navigate(path,{trigger:true});
            return this;
        }
        return this;
    },
    nextInterval: false,
    onNext:function(){
        var view = this;
        this.nextInterval = setInterval(function(){
            view.carouselRetreat();
        },33);
    },
    offNext:function(){
        clearInterval(this.nextInterval);
    },
    prevInterval: false,
    onPrevious:function(){
        var view = this;
        this.prevInterval = setInterval(function(){
            view.carouselAdvance();
        },33);
    },
    offPrevious:function(){
        clearInterval(this.prevInterval);
    },
    carouselAdvance: function(){
        var pos = $('.carousel-content').position(),
            left = pos.left+30;
        if(left < this.leftBound){
            $('.carousel-next').show();
            $('.carousel-previous').show();
            $('.carousel-content').css({left:left});
        }else{
            $('.carousel-next').hide();
        }
        
    },
    carouselRetreat: function(){
        var pos = $('.carousel-content').position(),
            left = pos.left-30;
        if(left > this.rightBound){
            $('.carousel-previous').show();
            $('.carousel-next').show();
            $('.carousel-content').css({left:left});
        }else{
            $('.carousel-previous').hide();
        }
    },
    
    
    showCarousel:    function(){
        $('.carousel').removeClass('sl-closed').addClass('sl-opened');
    },
    hideCarousel:    function(){
        $('.carousel').removeClass('sl-opened').addClass('sl-closed');
    },
    getNext:        function(){
        
        var current = this.current.get('uri'), 
            pos = this.childrenURI.indexOf(current),
            next = this.childrenURI[pos+1],
            path = this.model.getCurrentUrl();

        if(next != this.model.get('uri')){
            path = path+'/'+next;
          var nextModel = Mediakron.getItemFromURI(next);
          if(nextModel){
            $('.slideshow-next')
            .show()
            .html('<span class="navigation-title sr-only"><span class="navigation-slideshow">Next in <em>'+this.model.get('title')+'</em>:</span><br> '+nextModel.get('title')+'</span><span class="mk-icon mk-arrow-right"></span>')
            .attr('href',basepath+path);
          }else{
              $('.slideshow-next').hide();
          }
        } else{
            $('.slideshow-next').hide();
        }    
            
        return this;
        
    },
    getPrevious:        function(){
        var current = this.current.get('uri'), 
            pos = this.childrenURI.indexOf(current),
            previous = this.childrenURI[pos-1],
            path = this.model.getCurrentUrl();
        
        if(previous != this.model.get('uri')){
            path = path+'/'+previous;
            var previousModel = Mediakron.getItemFromURI(previous);
            if(previousModel){
                $('.slideshow-previous')
                    .show()
                    .html('<span class="mk-icon mk-arrow-left"></span><span class="navigation-title sr-only"><span class="navigation-slideshow">Previous in <em>'+this.model.get('title')+':</em></span><br> '+previousModel.get('title')+'</span>')
                    .attr('href',basepath+path);
            }else{
                $('.slideshow-previous').hide();
            }

        }else{
            $('.slideshow-previous').hide();
        }
        
        return this;
    },
    gotoItem:     function (item) {
        var gotoThis = '#si-'+this.model.get('uri')+'-'+item.get('uri'),
            $gotoThis = $(gotoThis),
            $current = $('.current'),
            currentPosition = $current.attr('slideposition'),
            gotoPosition = $gotoThis.attr('slideposition');
        
        if(!this.overlay){
            $('.item-overlay').addClass('opened');
            this.overlay = true;
        }
        this.current = item;
        var childView = item.getView();
        childView.setElement(gotoThis);
        childView.render();
        childView.afterRender();

        if(currentPosition == gotoPosition){
            
        }else if(currentPosition < gotoPosition){
            // set up the position of the two right
            $current.addClass('current').removeClass('backward forward');
            $gotoThis.addClass('forward').removeClass('current backward');
            
            // Do the animation
            setTimeout(function(){
                $current.addClass('transition backward').removeClass('current').one('transitionend', function(){ $current.removeClass('transition'); });
                $gotoThis.addClass('transition current').removeClass('forward').one('transitionend', function(){ $gotoThis.removeClass('transition'); });
            }, 10);
            
        }else{
            // set up the position of the two right
            $current.addClass('current').removeClass('backward forward');
            $gotoThis.addClass('backward').removeClass('current forward');
            setTimeout(function(){
                // Do the animation
                $current.addClass('transition forward').removeClass('current').one('transitionend', function(){ $current.removeClass('transition'); });
                $gotoThis.addClass('transition current').removeClass('backward').one('transitionend', function(){ $gotoThis.removeClass('transition'); });
            }, 10);
        }
        this.getPrevious().getNext();
    },
    toggleInfo:     function (item) {
        $('.slideshow-item.current .title-box, .slideshow-item.current .info-button ').toggleClass('is-visible');
    }

});