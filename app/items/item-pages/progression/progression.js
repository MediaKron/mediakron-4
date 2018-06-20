/*!
 * jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
 * Author: @addyosmani
 * Further changes: @peolanha
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

    // define your widget under a namespace of your choice
    //  with additional parameters e.g.
    // $.widget( "namespace.widgetname", (optional) - an
    // existing widget prototype to inherit from, an object
    // literal to become the widget's prototype );

    $.widget( "mk.progression" , {

        //Options to be used as defaults
        options: {
            editing:    false,
            model:      false,
            canvas:     false
        },
        
        frame:false,
        order:{},

        //Setup widget (eg. element creation, apply theming
        // , bind events etc.)
        _create: function () {
            var element = this.element, 
                canvas,
                progression = this,
                i = 0, 
                div, 
                bar, 
                drag,
                children = this.options.model.getRelationship('children'),
                items,
                count = children.length,
                height,
                ratio,
                $items = [],
                item,
                width,
                marker,
                $markers = [],
                source,
                size,
                position = {};
            var frame = this.frame = $('.progression-frame');
            if(count > 0){
                this.children = children;
                items = this.renderChildren();
                
                // create canavas
                bar     = this.bar      = $('<div class="progression-bar"></div>');
                drag    = this.drag     = $('<div class="progression-drag"></div>');
                
                
                bar.append(drag);
                this.element.append(bar);
                width   = this.width    = bar.width();
                frameSize   = {height:frame.height(),width:frame.width()};
                ratio   = this.ratio    = (1/(count-1))*100;
                
                var frameWidth = frame.width();
                items.each(function(i, div){
                    item = $(div);
                    if(children[i]){
                        item.uri = children[i].uri;
                        source = Mediakron.getItemFromURI(item.uri);
                        if(!children[i].data){
                            size = {height: item.height(),width: item.width()};
                            ratio = size.width/size.height;
                            if(ratio > 1){ // wider than tall
                                position = {
                                    top:0,
                                    left:0,
                                    width: width+'px',
                                    height: size.height*(height/width)+'px'
                                };
                            }else if(ratio < 1){ // taller than wide
                                position = {
                                    top:0,
                                    left:0,
                                    width: size.width*(height/width)+'px',
                                    height: height+'px'
    
                                };
                            }else{ // square
                                position = {
                                    top:0,
                                    left:0,
                                    width: size.width*(height/width)+'px',
                                    height: size.height*(width/height)+'px'
                                };
                            }
                
                        }else{
                    
                            position = children[i].data;
                        }
                    }

                    position.opacity = 0;
                    item.hide();
                    item.addClass('pitem pitem-'+i).css(position);
                    
                    $items.push(item);
                });
                this.bindDrag();
                
                $('.progression-item').hover(function(e){
                    var target = $(e.currentTarget);
                    $('.title-box').slideDown('fast');
                },function(e){
                    var target = $(e.currentTarget);
                    $('.title-box').slideUp('fast');
                });
                $items[0].css({opacity:1}).show();
                this.$items = $items;
                progression.renderMarkers();
                var showTitles = $('<div class="showTitles"><span class="mk-icon mk-info"></span><span class="sr-only">Show Titles</span></div>');
                this.frame.append(showTitles);
                showTitles.click(function(){
                    $('.progression-item-info',this.$el).toggle();
                });
            }
        },
        
        renderChildren: function(){
            var i = 0, count = this.children.length, child, id,
                uri = this.options.model.get('uri'), items = [];
            this.frame.empty();
            for(i;i<count;i++){
                child = this.children[i];
                this.order[child.uri] = child;
                id = 'prg-'+uri+'-'+child.uri;
                element = '<div id="'+id+'"></div>';
                this.frame.append(element);
                item = Mediakron.getItemFromURI(child.uri);
                if(item){
                    view = item.getView('progression');
                    view.setElement('#'+id);
                    view.render();
                }
            }
            return this.frame.children();
        },
        
        renderMarkers: function(){
            
            var count = this.$items.length,
                ratio = (1/(count-1))*100,
                marker, i = 0, item, last = count-1, classes = '', lastStyle = '';
                this.$markers = [];
            $('.progression-marker').remove();
            for(i; i<count; i++){
                classes = '';
                item = Mediakron.getItemFromURI(this.$items[i].uri);
                if(i == last && item){ 
                    classes = 'last-prg'; 
                    lastStyle = 'style="left:-'+(item.get('title').length*9)+'px"'; 
                }
                marker = $('<div class="progression-marker '+classes+'" ></div>');
                marker.css({width:ratio+'%',left:ratio*i+'%'});
                this.bar.append(marker);
                this.$markers.push(marker);
            }
        },
        
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        
        bindDrag: function(){
            var progression = this;
            if(this.drag){
                this.drag.draggable({
                    axis:'x',
                    containment: "parent",
                    drag: function(event,ui){
                        var left = ui.position.left,
                            progress = (left/progression.width)*100, 
                            item = Math.floor(progress/progression.ratio), 
                            next = item+1,
                            nextOpacity = (progress/progression.ratio) - item,
                            thisOpacity = 1 - nextOpacity;
                        if(progress > 99){
                            ui.position.left = (left-1)+'px';
                        }else{
                            $('.pitem').css({'opacity':0}).hide();
                            progression.$items[item].css({opacity:thisOpacity});
                            if(thisOpacity > 0) progression.$items[item].show();
                            if(progression.$items[next]){
                                progression.$items[next].css({opacity:nextOpacity});
                                if(nextOpacity > 0) progression.$items[next].show();
                            }
                        }   
                    }
                });  
            }
            
        },

        makeEditable: function ( event ) {
            this.element.css({
                'width':'768px',
                'height':'510px'
            });
            if(this.bar){
                width   = this.width    = this.bar.width();
                if(this.$items){
                    this.bindDrag();
                    var count = this.$items.length,
                        i = 0,
                        item;
                    
                    for(i; i < count; i++){
                        item = this.$items[i];
                        item.draggable().resizable({
                            helper: "ui-resizable-helper",
                            aspectRatio: true,
                            handles: "all"
                        });
                    }
                    this.drawBoard();
                }
            }
        },
        
        drawBoard: function(){
            var canvas = $('<canvas class="edit-board"></canvas>'),
                frame = $('.progression-frame'),
                bw = frame.width(),
                bh = frame.height(),
                p = 0,
                cw = bw + (p*2) + 1,
                ch = bh + (p*2) + 1,
                context, x = 0, y = 0;
            canvas.css({width:'100%',height:'100%'});
            this.element.prepend(canvas);
            context = canvas[0].getContext("2d");
            context.beginPath();
				context.strokeStyle = "#ccc";
				x = 0;
				for (x = 0.5; x < 750; x += 10) {
					context.moveTo(x, 0);
					context.lineTo(x, 490);
				}
                y = 0;
				for (y = 0.5; y < 490; y += 10) {
					context.moveTo(0, y);
					context.lineTo(750, y);
				}
				context.stroke();
				context.closePath();
				
				context.beginPath();
				context.strokeStyle = "#888";
				x = 0;
				for (x = 0.5; x < 750; x += 50) {
					context.moveTo(x, 0);
					context.lineTo(x, 490);
				}
                y = 0;
				for (y = 0.5; y < 490; y += 50) {
					context.moveTo(0, y);
					context.lineTo(750, y);
				}
				context.stroke();
				context.closePath();
        },
        
      
        reorder: function( order ){
//            Tim: Not necessary since give a warning if users try to leave the page without saving
//            Mediakron.message({
//                'timeout':     3000,
//                'type':        'warning',
//                'text':        'Changes to order will not appear until you hit save',
//                'layout':      'top',
//                'confirm':     false,
//                'dismiss':      true
//                
//            });
            var view = this;
            view.order = {};
            _.each(order,function(child){
                if(child){
                    view.order[child.uri] = child;
                }
                
            });
        },
        getItemPositions: function(){
            var count = this.$items.length,
                i = 0, 
                item;
            for(i; i < count; i++){
                item = this.$items[i];
                offset = item.position();
            }
        },
        save: function ( event ) {
            var count = this.$items.length,
                i = 0,
                item, 
                uri, 
                position, offset, height, width,
                frame = $('.progression-frame'),
                frameWidth = frame.width(),
                frameHeight = frame.height(),
                relationship = [],
                dataObject = {},
                model = this.options.model;
            for(i; i < count; i++){
                item = this.$items[i];
                item.show();
                offset = item.position();
                item.hide();
                position = {
                    top:((offset.top/frameHeight)*100)+'%',
                    left:((offset.left/frameWidth)*100)+'%',
                    height:((item.height()/frameHeight)*100)+'%',
                    width:((item.width()/frameWidth)*100)+'%'
                };
                dataObject[item.uri] = {
                    'uri': item.uri,
                    'data': position
                };
            }

            var find;
            _.each(this.order, function(order){
                find = dataObject[order.uri];
                if(find){
                    relationship.push(find);
                }else{
                    relationship.push(order);
                }
            });

            model.setRelationship('children',relationship);
            model.save({},{
                'success':function(model){
                    model.goTo();
                }
            });
            
        },
        add: function(event){
              
        },
        cancel: function ( event ) {

        },
        remove: function(uri){
            var count = this.$items.length,
                i = 0,
                item,
                items = [];
            for(i; i < count; i++){
                if(this.$items[i].uri == uri){
                    this.$items[i].remove();
                }else{
                    items.push(this.$items[i]);
                }
            }
            this.$items = items;
            this.renderMarkers();
            $('.pitem').css({'opacity':0}).hide();
            this.$items[0].css({opacity:1}).show();
        },
        _setOption: function ( key, value ) {
            switch (key) {
            case "model":
                this.model = value;
                break;
            default:
                this.options[ key ] = value;
                break;
            }

            // For UI 1.8, _setOption must be manually invoked
            // from the base widget
            $.Widget.prototype._setOption.apply( this, arguments );
            // For UI 1.9 the _super method can be used instead
            // this._super( "_setOption", key, value );
        }
    });

})( jQuery, window, document );