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

    $.widget( "mk.annotateImage" , {

        //Options to be used as defaults
        options: {
            editing: false,
            zoomed: false,
            model:    false,
            notes: false,
            zoomType: 'full'
        },

        //Setup widget (eg. element creation, apply theming
        // , bind events etc.)
        _create: function () {
            var widget = this, image = this.image = this.element,
                zoomHTML = '';
            
            if(this.options.zoomType == 'minimal'){
                zoomHTML = '<div class="zoom zoom-min"><div class="zoom-bar"><div class="zoomout"><span class="mk-icon mk-minus"> </span></div><div class="zoom-wrapper"><div class="zoom-control"></div></div><div class="zoomin"><span class="mk-icon mk-plus"> </span></div></div></div>';
            }else{
                zoomHTML = '<div class="zoom"><div class="zoomover zoomover-top"></div><div class="zoomover zoomover-left"></div><div class="zoomover zoomover-right"></div><div class="zoomover zoomover-bottom"></div><div class="zoomover-window"></div><div class="zoom-bar"><div class="zoomout"><span class="mk-icon mk-minus"> </span></div><div class="zoom-wrapper"><div class="zoom-control"></div></div><div class="zoomin"><span class="mk-icon mk-plus"> </span></div></div></div>';
            }
           
            this.element.load(function(){
                var width= widget.image.width(), height = widget.image.height(),
                    aspect = width/height,
                    notes = {},
                    size = widget.options.model.get('size'),
                    zoom = $(zoomHTML);
                     widget.zoom = zoom;
                     widget.currentZoom = 0;
                     widget.notes = notes;
                     widget.mode = 'view';

                     widget.width = width; widget.height = height;
                var container = widget.container = $('<div class="annotated"></div>'),
                    engage = $('<button id="enable-annotation" type="submit" class="btn btn-primary btn-sm">Annotations</button>');
                engage.hide();
                widget.notesContainer = $('<div class="notes"></div>');
                container.append(widget.notesContainer);
                widget.engage = engage;
                var frame = widget.frame = $('<div class="annotated-frame"></div>');
                widget.image.after(frame);

                widget.frame.html(widget.container);
    
                widget.container.css({
                    'background-repeat': 'no-repeat',
                    'background-image': 'url("' + widget.image.attr('src') + '")',
                    'background-size': 'contain',
                    'width':width,
                    'height':height
                });
                if(widget.options.zoomType == 'minimal'){
                    zoom.css({
                        'width':                '22px',
                        'height':               '50px'
                    });
                }else{
                    if(!size.width && !size.height){
                        size.height = 150;
                        size.width = (widget.width/widget.height)*150;
                    }
                    zoom.css({
                        'background-repeat':    'no-repeat',
                        'background-image':     'url("' + widget.image.attr('src') + '")',
                        'background-size':      'contain',
                        'width':                size.width+'px',
                        'height':               size.height+'px'
                    });
                }
                $('.zoom-wrapper',zoom).width((size.width-67)+'px');
                var zWrapperWidth = size.width-67;
                
                
                widget.container.after(zoom);
                if(widget.options.model.canEdit(false)){
                    widget.container.after(engage);
                }
                
                engage.click(function(){
                    widget.makeEditable();
                });
                
                widget.zoomoverTop = $('.zoomover-top');
                widget.zoomoverLeft = $('.zoomover-left');
                widget.zoomoverRight = $('.zoomover-right');
                widget.zoomoverBottom = $('.zoomover-bottom');
                widget.zoomoverWindow = $('.zoomover-window');
                
                widget.frame.hover(function(){
                        if(!widget.editing && !widget.zoomed){
                            widget.notesContainer.fadeIn('fast');
                            engage.fadeIn('fast');
                            zoom.fadeIn('fast');
                        } 
                    },
                    function(){
                        if(!widget.editing && !widget.zoomed){
                            widget.notesContainer.fadeOut('fast');
                            zoom.fadeOut('fast');
                            engage.fadeOut('fast');
                        }
                    }
                );
                
                frame.css({'width':width,'height':height});
                
                Mediakron.App.Events.on("sidebar:show", function(event){ 
                    width = image.width();
                    height = image.height();
                    container.css({
                        'width':width,
                        'height':height
                    });
                    frame.css({'width':width,'height':height});
                    widget.height = height;
                    widget.width = width;
                });    
                Mediakron.App.Events.on("sidebar:hide", function(event){ 
                    width = image.width();
                    height = image.height();
                    container.css({
                        'width':width,
                        'height':height
                    });
                    frame.css({'width':width,'height':height});
                    widget.height = height;
                    widget.width = width;
                });    
                
                $(window).resize(function(){
                    width = image.width();
                    height = image.height();
                    container.css({
                        'width':width,
                        'height':height
                    });
                    frame.css({'width':width,'height':height});
                    widget.height = height;
                    widget.width = width;
                });
                
                $('.zoom-control',zoom).draggable({
                    axis: "x",
                    containment: "parent",
                    drag: function() {
                        widget.zoomTo(($(this).position().left/zoom.width())*500);
                        widget.setZoomBox();
                    }
                });
                
                $('.zoomout',zoom).click(function(){
                    var left = $('.zoom-control',zoom).position().left-5,
                        leftPercent = (left/zWrapperWidth)*100;
                    if(leftPercent < 0){ leftPercent = 0; left = 0; }
                    if(!leftPercent){ leftPercent = 0; left = 0; }
                    if(left === 0){ widget.zoomed = false; }
                    $('.zoom-control',zoom).css({'left':leftPercent+'%'});
                    widget.zoomTo((left/zoom.width())*500);
                    widget.setZoomBox();
                });
                $('.zoomin',zoom).click(function(){
                    widget.zoomed = true;
                    engage.fadeOut('fast');
                    var left = $('.zoom-control',zoom).position().left+5,
                        leftPercent = (left/zWrapperWidth)*100;
                    if(leftPercent > 100){ leftPercent = 100; left = 100; }
                    $('.zoom-control',zoom).css({'left':leftPercent+'%'});
                    widget.zoomTo((left/zoom.width())*500);
                    widget.setZoomBox();
                });

                /*widget.frame.bind('mousewheel DOMMouseScroll wheel', function(e){
                    e.preventDefault();
                    var left,leftPercent;
                    if(e.originalEvent.deltaY > 0) {
                        left = $('.zoom-control',zoom).position().left+5;
                        leftPercent = (left/zWrapperWidth)*100;
                        if(leftPercent > 100){ leftPercent = 100; left = 100; }
                    }
                    else{
                        left = $('.zoom-control',zoom).position().left-5;
                        leftPercent = (left/zWrapperWidth)*100;
                        if(leftPercent < 0){ leftPercent = 0; left = 0; }
                    }
                    $('.zoom-control',zoom).css({'left':leftPercent+'%'});
                    widget.zoomTo((left/zoom.width())*500);
                    return false;
                });*/
                
                widget.createNotes(widget.options.notes);
                widget.image.addClass('annotated-move'); 
            
                widget.container.on('dblclick',function(event){
                    var x = event.originalEvent.layerX,
                        y = event.originalEvent.layerY,
                        target = $(event.currentTarget),
                        height = target.height(),
                        width = target.width(),
                        percentHeight = (y/height)*100,
                        percentWidth = (x/width)*100;
                    $('.zoomin',widget.zoom).click();
                });
                
            });
            
            
            return this;
        },
        
        setZoomBox: function(){
            var height = this.container.height(),
                width = this.container.width(),
                position = this.container.position(),
                top = position.top,
                left = position.left,
                frameWidth = this.frame.width(),
                frameHeight = this.frame.height(),
                bottom = (frameHeight - (top + height)),
                right = (frameWidth - (left + width)),
                topPercent = 0,leftPercent = 0,rightPercent = 0,bottomPercent = 0,
                widget = this;
            if(top !== 0){
                topPercent = (top/height)*-100;
            }
            if(left !== 0){
                leftPercent = (left/width)*-100;
            }
            if(right !== 0){
                rightPercent = (right/width)*-100;
            }
            if(bottom !== 0){
                bottomPercent = (bottom/height)*-100;
            }
            if(left !== 0){ leftPercent = (left/width)*-100; }
            this.zoomoverTop.css({
                width:100 - (leftPercent+rightPercent)+'%',
                left:leftPercent+'%',
                height:topPercent+'%'
            });
            this.zoomoverBottom.css({
                width:100 - (leftPercent+rightPercent)+'%',
                left:leftPercent+'%',
                height:bottomPercent+'%'
            });
            this.zoomoverLeft.css({width:leftPercent+'%'});
            this.zoomoverRight.css({width:rightPercent+'%'});
            var zoomWinHeight = 100 - topPercent - bottomPercent,
                zoomWinWidth = 100 - leftPercent - rightPercent,
                zoomHeight = this.zoom.height(),
                zoomWidth = this.zoom.width();
            this.zoomoverWindow.css({
                left:leftPercent+'%',
                top:topPercent+'%',
                width:zoomWinWidth+'%',
                height:zoomWinHeight+'%',
            });
            
            if(this.currentScalar > 0){
                this.zoomoverWindow.draggable({
                    containment:'parent',
                    drag: function(event,ui){
                        var left = ui.position.left,
                            top = ui.position.top,
                            topPercent = (top/zoomHeight)*100,
                            leftPercent = (left/zoomWidth)*100,
                            heightPercent = (zoomWinHeight/zoomHeight)*100,
                            widthPercent = (zoomWinWidth/zoomWidth)*100;

                         widget.zoomoverTop.css({left:leftPercent+'%', height: topPercent+'%'});
                         widget.zoomoverBottom.css({left:leftPercent+'%', height: (100 - topPercent - zoomWinHeight)+'%'});
                         widget.zoomoverLeft.css({width: leftPercent+'%'});
                         widget.zoomoverRight.css({width: (100 - leftPercent - zoomWinWidth)+'%'});
                         

                         widget.container.css({
                             top:(topPercent/100)*height*-1+'px',
                             left:(leftPercent/100)*width*-1+'px'
                         });
                    }
                });
            }else{
                this.zoomoverWindow.draggable('destroy');
            }
            

        },

        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },

        makeEditable: function ( event ) {

            this.editing = true;
            if(this.container.hasClass("ui-draggable")) {
                this.container.draggable('destroy');
            }
            this.engage.hide();
            this.notesContainer.show();
             var save = $('<button id="done-editing" type="submit" class="btn btn-success submit btn-sm"><span class="mk-icon mk-save"> </span> Save</button>'),
                add = $('<button id="add-annotation" type="submit" class="btn btn-primary btn-sm"><span class="mk-icon mk-add"> </span> Add</button>'),
                cancel = $('<button id="cancel-editing" class="btn btn-default btn-sm close"><span class="mk-icon mk-close"> </span> Cancel</button>'),
                method = this;
            this.container.addClass('editing');
            
            $('.note-text').attr('contenteditable',true).on('keypress', function(e){
                var val = $(e.currentTarget).text(),
                    length = val.length;
                if(length > 150 && e.keyCode != 8 && e.keyCode != 46){
                    e.preventDefault();
                    return false;
                }
            }).on('paste',function(e){
                var element = this;
                  setTimeout(function () {
                        var text = $(element).text(),
                            returned = text.substring(0,150);
                        $(element).text(returned);
                  }, 4);
            });
            this.container.off('dblclick');
            $.each(this.notes,function(id,note){
                note.resizable().draggable({handle:'.note-area'});
                $('.note-remove',note).click(function(){
                    $(this).closest('.note').remove();
                    delete method.notes[id];
                });
            });
           
            this.zoom.fadeOut('fast');
            //this.zoomTo(0);
            this.container.append(save);
            this.container.append(add);
            this.container.append(cancel);
            save.click(function(){ method.save(); save.remove(); add.remove(); cancel.remove();method.engage.show(); });
            add.click(function(){ method.add(); });
            cancel.click(function(){ method.cancel(); save.remove(); add.remove(); cancel.remove();method.engage.show(); });
        },

        save: function ( event ) {
            this.editing = false;
            $('.note-text').attr('contenteditable',false).hide().off('keypress').off('paste');
            this.container.removeClass('editing');
            var width, height, left, top, imageWidth = this.image.width(), imageHeight = this.image.height(), 
            annotation, annotations = [], position;

            $.each(this.notes,function(id,note){
                position = note.position();
                annotation = {
                    'uri': note.uri,
                    'data': {
                        'text': $('.note-text',note).text(),
                        'width': (note.width()/imageWidth)*100,
                        'height': (note.height()/imageHeight)*100,
                        'left': (position.left/imageWidth)*100,
                        'top': (position.top/imageHeight)*100,
                    }
                };
                annotations.push(annotation);
                note.resizable('destroy').draggable('destroy');
            });
            this.container.on('dblclick',function(event){
                var x = event.originalEvent.layerX,
                    y = event.originalEvent.layerY,
                    target = $(event.currentTarget),
                    height = target.height(),
                    width = target.width(),
                    percentHeight = (y/height)*100,
                    percentWidth = (x/width)*100;
                $('.zoomin',widget.zoom).click();
            });
            this.options.model.setRelationship('annotations',annotations);
            this.options.model.save();
        },
        add: function(event){
            var properties = {
                uri: 'annotation:'+Mediakron.user.get('id')+':'+$.now(),
                data: {
                    text: 'Edit This Note',
                    left: 10,
                    top:10,
                    width:20,
                    height:20
                }
            }, note = this.createNote(properties), method = this,
              id = properties.uri;
            note.resizable().draggable({handle:'.note-area'});
            $('.note-remove', note).click(function(){
              $(this).closest('.note').remove();
              delete method.notes[id];
            });
            $('.note-text',note).attr('contenteditable',true).on('keypress', function(e){
                var val = $(e.currentTarget).text(),
                    length = val.length;
                if(length > 150 && e.keyCode != 8 && e.keyCode != 46){
                    e.preventDefault();
                    return false;
                }
            }).on('paste',function(e){
                var element = this;
                  setTimeout(function () {
                        var text = $(element).text(),
                            returned = text.substring(0,150);
                        $(element).text(returned);
                  }, 4);
            });
            
        },
        cancel: function ( event ) {
            this.editing = false;
            $('.note-text').attr('contenteditable',false).hide().off('keypress').off('paste');
            this.container.removeClass('editing');
            var method = this;
            $.each(this.notes,function(id,note){
                note.remove();
                method.createNotes(method.options.notes);
            });
            this.container.on('dblclick',function(event){
                var x = event.originalEvent.layerX,
                    y = event.originalEvent.layerY,
                    target = $(event.currentTarget),
                    height = target.height(),
                    width = target.width(),
                    percentHeight = (y/height)*100,
                    percentWidth = (x/width)*100;
                $('.zoomin',widget.zoom).click();
            });
        },
        
        zoomTo: function(percent){
        
            var height = this.height,
                width = this.width,
                scalar = percent/100,
                transformHeight = height+(height*scalar),
                transformWidth = width+(width*scalar),
                topOffset = (transformHeight - height)/2,
                leftOffset = (transformWidth - width)/2,
                frameWidth = $('.annotated-frame').width(),
                frameHeight = $('.annotated-frame').height(),
                widget = this;
            this.container.css({
                left:'-'+leftOffset+'px',
                top:'-'+topOffset+'px',
                width: transformWidth+'px',
                height: transformHeight+'px'
            });
            this.currentScalar = scalar;
            if(scalar > 0){
                position = false;
                this.container.draggable({
                    drag: function(event,ui){
                        position = ui.position;
                        if(position.left > 0){
                            ui.position.left = 0;
                        }
                        if(position.top > 0){
                            ui.position.top = 0;
                        }
                        if(position.top < frameHeight - transformHeight){
                            ui.position.top = (frameHeight - transformHeight)+'px';
                        }
                        if(position.left < frameWidth - transformWidth){
                            ui.position.left = (frameWidth - transformWidth)+'px';
                        }
                        widget.setZoomBox();
                    }
                });
            }else{
                if(this.container.hasClass("ui-draggable")) {
                    this.container.draggable('destroy');
                }
            }
        },
        
        createNote: function(properties){
            var note = $('<div class="note"><div class="note-area"><div class="note-remove"><span class="mk-icon mk-remove"></span></div></div><div class="note-text">'+properties.data.text+'</div></div>').css({
                'width':properties.data.width+'%',
                'height':properties.data.height+'%',
                'top':properties.data.top+'%',
                'left':properties.data.left+'%'
            }), method = this;
            note.uri = properties.uri;
            this.notesContainer.append(note);
            this.notes[properties.uri] = note;
            

            note.hover(
                function(){ 
                        $('.note-text',note).show(); 
                        if($('.note-text',note).height() > 20){
                            //$('.note-text',note).css({'width':note.width()*2});
                            //$('.note-text',note).css({'bottom':(0-$('.note-text',note).height()-3)+'px' });
                        }
                        
                        if(100 < properties.data.left + (($('.note-text',note).width()/method.width)*100)){
                            $('.note-text',note).css({'right':0});
                        }
                        
                        if(95 < properties.data.top + ((note.height()/method.height)*100)){
                            $('.note-text',note).css({'top':(0-$('.note-text',note).height()-10)+'px', 'bottom':'auto'});
                        }
                },
                function(){ if(!method.editing){ $('.note-text',note).hide(); } }
            );
           
            return note;
        },
        
        createNotes: function(notes){
            var method = this;
            if(notes){
                if(notes.length){
                    $.each(notes, function(uri,props){
                        method.createNote(props);
                    });
                }
            }
            return this;
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