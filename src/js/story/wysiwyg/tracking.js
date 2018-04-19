define(
    "/mediakron/js/src/story/wysiwyg/tracking.js", 
    [   
        "/mediakron/js/src/story/wysiwyg/selection.js", 
        "/mediakron/js/src/story/wysiwyg/paste.js" 
    ], 
    function(Selection, Paste) {
    var tracker = function($root, wysiwyg, parser) {
            this.$el = $root;
            this.selected = false;
            this.anchor = false;
            this.focus = false;
            this.multiple = false;
            this.root = false;
            this.tag = false;
            this.element = false;
            this.position = false;
            this.text = false;
            this.empty = false;
            this.wysiwyg = wysiwyg;
            this.parser = parser;
            this.shift = false;
            this.control = false;
            this.applekey = false;
            var view = this;
            this.mousedownBody = false;
            this.featureSelected = false;
            this.captionEdit = false;
            $(document).on('mouseup',function(e){
              // if you release the mouse up event outside of the document scope, we should catch that
              if(this.mousedownBody){
                this.mousedownBody = false;
              }
                
            });
            
            //this.wysiwyg.showBubble(this.$el, Selection);
            
            Mediakron.App.Events.on('story:featureselect', function(target){
                view.featureSelected = target;
            });
            Mediakron.App.Events.on('story:captionedit', function(target){
                view.captionEdit = true;
            });
            Mediakron.App.Events.on('story:captionexit', function(target){
                view.captionEdit = false;
            });
            
            Mediakron.App.Events.on('story:needs:cleaning',function(args){

              setTimeout(function(){
                  var savedSel = rangy.saveSelection();
                  view.$el.html(view.parser.cleanHTML(view.$el.html(), true, false));
                  view.parser.fixCitation(view.$el);
                  Mediakron.App.Events.trigger('story:render');
                  $('#story-body p').removeClass('story-body story-body-text story-content');
                  rangy.restoreSelection(savedSel);
              },10);  

            });
            
            
            
            // subscribe a handler to the read event
            Mediakron.App.Events.on('story:structure:change',function(args){
              // check to see if we are in a block without a parent
              view.getState();
              view.$el.linkify({ target: "_blank" });
              $('.annotation-popup',view.$el).remove();
              view.parser.readToObject(view.$el.html());
              Mediakron.App.Events.trigger('story:after:object:format');
            });
        };
    tracker.prototype = {
        trigger: function(action, type, event, selection, state, change){
            var data = {
                action: action,
                type: type,
                event: event,
                selection: selection,
                state: state
            };
            Mediakron.App.Events.trigger('wysiwyg:event', data);
            if(change){
                Mediakron.App.Events.trigger('story:change', data);
            }
        },
        getState: function() {
            var t0 = performance.now();
            Selection.getSelection(true);
            this.range = Selection.getRange();
            this.selected = Selection.isSomethingSelected();
            this.setParentAndRoot();
            this.text = Selection.getRangeText();
            var t1 = performance.now();
            //this.updateContents();
        },
        getContents: function() {},
        setParentAndRoot: function() {
            var selection = Selection.getSelection(),
                range = Selection.getRange();
            this.anchor = selection.anchorNode;
            this.focus = selection.focusNode;
            
            this.multiple = false;
            this.parent = false;
            this.tag = false;
            if (this.$el[0] == $(range.commonAncestorContainer)[0]) {
                this.multiple = true;
            } else {
                var focus = $(selection.focusNode),
                    parents = focus.parentsUntil('.story-body');
                this.element = focus;
                if (parents.length > 0) {
                    var length = parents.length;
                    this.parent = $(parents[length - 1]);
                }else{
                    this.parent = focus;
                }
                this.tag = this.parent.prop('tagName');
            }
            return this;
        },
        // 1 is the pass through action.  It doesn't act at all on the dom structure
        defaultAction: function(e, type) {
            // Pass through action
            this.getState();
            this.trigger('default', type, e, Selection, this, true);
            if(!this.tag){
              //document.execCommand('formatBlock', false, 'p');
            }
            if(this.featureSelected){
                var newpara = $('<p>');
                this.featureSelected.after(newpara);
                this.featureSelected.removeClass('selected');
                newpara.selectionToEnd();
                this.featureSelected = false;
            }
        },
        // 2 is a navigation action.  We update our status tracker, but we don't otherwise change the dom
        // unless the naviagtion event happens to interact with a figure
        navigationAction: function(e, type) {
            // Navigation 
            // affirm the current state
            this.getState();
            this.trigger('navigation', type, e, Selection, this);
            if(this.featureSelected){

            }
        },
        // 3 is a selection event.  Generally mouse down select, double click, or shift arrows
        // Opens the wysiwyg if text is selected, and handle the feature selection
        selectionAction: function(e, type, preventClose) {
            // Navigation 
            this.getState();
            this.trigger('select', type, e, Selection, this);
            this.featureSelected = false;
        },
        // 4 are actions that might create new dom.  Based on the current state, take a certain action, either inserting
        // a new paragragh, a new list item, putting a paragraph before the current figure, etc
        createAction: function(e, type) {
            // Navigation 
            this.getState();
            this.trigger('create', type, e, Selection, this, true);
            var view = this;
            
            if(this.featureSelected){
                var newpara = $('<p>');
                this.featureSelected.after(newpara);
                this.featureSelected.removeClass('selected');
                newpara.selectionToEnd();
                this.featureSelected = false;
            }
            
            
            if(type == 'keyup'){
                if(this.tag == 'DIV'){
                    document.execCommand('formatBlock', false, 'p');
                }

            }
            if(this.selected){
                
            }else{
                
                if(this.tag == 'OL' || this.tag == 'UL'){

                }else{ 
                    if(type == 'keyup'){
                            if(!this.parent){
                              document.execCommand('formatBlock', false, 'p');
                            } else if(!this.tag){
                              document.execCommand('formatBlock', false, 'p');
                            }else{
                              var name = this.parent.attr('name');
                              $('.mk-p-'+name).each(function(i,el){
                                  uid = view.parser.guidGenerator();
                                  el.setAttribute('name', uid);
                                  el.setAttribute('class', 'mk-p mk-p-'+uid);
                              });
                            }
                            
                            Mediakron.App.Events.trigger('story:structure:change');
                    }
                }
            }


        },
        // 5 are actions that might delete content or dom.  Based on the current state, take a certain action, either deleting
        // a  paragragh, a  list item, deleting the current object, or a figure, etc
        deleteAction: function(e, type) {
            this.getState();
            this.trigger('delete', type, e, Selection, this, true);
            if(this.featureSelected && !$(e.target).is("input, textarea")){
                this.featureSelected.remove();
                this.featureSelected = false;
            }
            // try to detect feature delete by checking the previous container
            if(type == 'keydown'){
              if(this.range.startOffset == 0){
                var startdiv = $(this.range.startContainer);
                
                if(startdiv[0].nodeType == 3){
                  if(!this.range.startContainer.previousSibling){
                    if(startdiv.parent().prev() && startdiv.prev().length == 0){
                      if(startdiv.parent().prev().is('figure')){
                        e.preventDefault();
                        startdiv.parent().prev().remove();
                        return false;
                      }
                    }
                  }
                }
              }
            }
            
            if(type == 'keyup'){
              Mediakron.App.Events.trigger('story:structure:change');
                if(!this.parent){
                    //document.execCommand('formatBlock', false, 'p');
                    /*this.getState();
                    uid = this.parser.guidGenerator();
                    this.parent.attr('name', uid);
                    this.parent.removeClass().addClass('mk-p mk-p-'+uid);*/
                    
                }
                
            }
        },
        controlAction: function(e, type) {
            // Navigation 
            this.getState();
            this.trigger('control', type, e, Selection, this);
            if(e.keyCode == 16){
                if(type == 'keydown'){
                    this.shift = true;
                }else{
                    this.shift = false;
                }
            }
            if(e.keyCode == 17){
                if(type == 'keydown'){
                    this.control = true;
                }else{
                    this.control = false;
                }
            }
            if(e.keyCode == 224){
                if(type == 'keydown'){
                    this.applekey = true;
                }else{
                    this.applekey = false;
                }
            }
        },
        pasteAction: function(e, type) {
            // Navigation /*
            var view = this;
            var $helper = $('<div id="pastehelper"  contenteditable="true" />');
            this.$el.after($helper);
            var savedSel = rangy.saveSelection();
            console.log('body post');
            
            $helper.focus();
            setTimeout(function(){
                html = $helper.html();
                html = view.parser.cleanHTML(html, true, true);
                rangy.restoreSelection(savedSel)
                var r = getSelection().getRangeAt(0);
                r.insertNode(r.createContextualFragment(html));


                Mediakron.App.Events.trigger('story:needs:cleaning');
                $helper.remove();
            }, 50);
            
            return true;
        },
        keyDown: function(e) {
            if(this.captionEdit){
                return true;
            }
            switch (e.keyCode) {
            case 8:// delete
            case 46: // backspace
                this.deleteAction(e, 'keydown');
                break;
            case 13: // return
                this.createAction(e, 'keydown');
                break;
            case 16:
            case 17:
            case 224:
                // shift
                this.controlAction(e, 'keydown');
                break;
            case 37:
            case 38:
            case 39:
            case 40:
                if(this.shift){
                    this.selectionAction(e,'keydown');
                }else{
                    this.navigationAction(e, 'keydown');
                }
                
                break;
            case 86:
                if(this.applekey || this.control){
                    // paste fallback if actual paste isn't handled
                    this.defaultAction(e, 'keydown');
                }else{
                    this.defaultAction(e, 'keydown');
                }
                
                break;
            default:
                
                this.defaultAction(e, 'keydown');
                break;
            }
        },
        keyUp: function(e) {
            if(this.captionEdit){
                return true;
            }
            switch (e.keyCode) {
            case 8:
            case 46:
                this.deleteAction(e, 'keyup');
                break;
            case 13:
                this.createAction(e, 'keyup');
                break;
            case 16:
            case 17:
                // shift
                this.controlAction(e, 'keyup');
                break;
            case 37:
            case 38:
            case 39:
            case 40:
                if(this.shift){
                    this.selectionAction(e,'keyup');
                }else{
                    this.navigationAction(e, 'keyup');
                }
                break;
            default:
                this.defaultAction(e, 'keyup');
                break;
            }
        },
        mouseDown: function(e) {
            var view = this;
            this.mousedownBody = true;
            this.navigationAction(e, 'mousedown');
            $('body').one('mouseup', function(e){ view.selectionAction(e,'mouseup'); });
        },
        pasted: function(e) {
            this.pasteAction(e, 'paste');
        },
        mouseUp: function(e) {
            this.mousedownBody = false;
            this.mouseupFlag = true;
            this.selectionAction(e,'mouseup');
        },
        blured: function(e) {
            this.getState();
        },
        focused: function(e) {
            // is the body empty
            if(!this.parser.workingObject){
                // create an empty element in the dom
                var uid = this.parser.guidGenerator(),
                    p = this.wysiwyg.newParagraph(uid);
                this.$el[0].appendChild(p);
                $(p).focus().selectionToBegin();
                this.parser.workingObject = {};
                this.parser.workingObject[uid] = {
                    tag: 'p',
                    name: uid,
                    children:[]
                };
            }
        }
    };
    return tracker;
});