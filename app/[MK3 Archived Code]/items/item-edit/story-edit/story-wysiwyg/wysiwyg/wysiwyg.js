/***
  * Builds and defines the story editing wysiwyg interface
  * as a require.js module. 
  *
  */

define('/mediakron/js/src/story/wysiwyg/wysiwyg.js', ["/mediakron/js/src/story/wysiwyg/selection.js", 'text!src/story/wysiwyg.html', 'text!src/story/annotation.html'], function(Selection, wysiwygTemplate, annotationTemplate) {
    var AddAnnotation = Backbone.View.extend({
        model: false,
        uri: false,
        edit: false,
        title: '',
        body: '',
        annotationId: false,
        initialize: function(data){
            // new model
            
            this.model = data.model;
            var annotationId = this.annotationId = data.annotationId;
            this.annotations = this.model.get('annotations');
            if(!this.annotations) this.annotations = {};
            
            // edit mode
            if(this.annotations[annotationId]){
              this.annotation = this.annotations[annotationId];
              this.edit = true;
              if(this.annotation.data.body)   this.body = this.annotation.data.body;
              if(this.annotation.attachment)    this.uri = this.annotation.attachment;
            // create
            }else{
              this.annotation = {};
              this.annotations[annotationId] = {};
            }
        },
        render: function(){
            var item = false;
            if(this.uri){
              item = Mediakron.getItemFromURI(this.uri);
            }
            this.$el.append(_.template(annotationTemplate)({ 
              item: item,
              title: this.title,
              body: this.body,
              wysiwyg: Mediakron.Wysiwyg.form()
            }));
            $('.annotate-story').addClass('is-visible');
        },
        rerender: function(body){
            var item = false;
            if(this.uri){
              item = Mediakron.getItemFromURI(this.uri);
            }
            this.$el.empty();
            this.$el.append(_.template(annotationTemplate)({ 
              item: item,
              body: this.body,
              wysiwyg: Mediakron.Wysiwyg.form()
            }));
            $('#annotation-body').html(body);
            $('.annotate-story').addClass('is-visible');
        },
        afterRender: function(){
          
        },
        throwError: function(el, message){
            Mediakron.message({
                text: message,
                type: 'danger',
                timeout: 4000,
                layout: 'top'
            });
        },
        removeAnnotation: function(){
          $('.annotation-'+this.annotationId).remove();
          delete this.annotations[this.annotationId];
          this.model.set('annotations', this.annotations);
        },
        close: function(){
          this.remove();
          this.$el.empty();
        },
        events: {
          'mousedown .wysiwyg-button': Mediakron.Wysiwyg.apply,
          'mousedown .enable-wysiwyg': "bindWysiwygListner",
          'mouseup .enable-wysiwyg': "openWysiwyg",
          'keyup .enable-wysiwyg': "openWysiwyg",
          'paste .enable-wysiwyg': "cleanPaste",
          'blur .enable-wysiwyg': "blurWysiwyg",
          'focus .enable-wysiwyg': "focusWysiwyg",
          'click button.save-add': 'save',
          'click button.cancel': 'cancel',
          'click .close-button': 'cancel',
          'click .story-annotate-bg': 'cancel',
          'click #attach-existing': 'attachExisting',
          'click #attach-new': 'attachNew',
          'click #remove-attach': 'removeAttachment'
        },
        bindWysiwygListner: function(e) {
            var target = $(e.currentTarget),
                form = this;
            $('body').one('mouseup', function(event) {
                form.openWysiwyg(e);
            });
        },
        openWysiwyg: function(e) {
            // this might work!
            if (e.keyCode == '13') {
                if (!e.shiftKey) {
                    document.execCommand('formatBlock', false, 'p');
                }
            }
            var selection = window.getSelection(),
                oRange = selection.getRangeAt(0),
                ancestor = $(oRange.commonAncestorContainer),
                parentEditor = ancestor.closest("div[contenteditable='true']"),
                text = selection.toString();
            if (text.length > 0) {
                this.range = oRange.cloneRange();
                this.selection = selection;
                Mediakron.Wysiwyg.showBubble(e.currentTarget);
                var $node = $(this.getSelectionStartNode());
                console.log('finding')
                console.log(ancestor.closest('blockquote'));
                if (ancestor.closest('blockquote').length > 0) {
                    console.log('found');
                    $('.wysiwyg-indent').addClass('hide');
                    $('.wysiwyg-outdent').removeClass('hide');
                } else {
                    $('.wysiwyg-indent').removeClass('hide');
                    $('.wysiwyg-outdent').addClass('hide');
                }
                if (findinselection('a', parentEditor[0])) {
                    $('.wysiwyg-link').addClass('hide');
                    $('.wysiwyg-unlink').removeClass('hide');
                } else {
                    $('.wysiwyg-link').removeClass('hide');
                    $('.wysiwyg-unlink').addClass('hide');
                }
            } else {
                $('.rich-text .wysiwyg').hide();
            }
        },
        cleanPaste: function(e) {

            var target = $(e.currentTarget);
            target.attr('disabled', true);
            console.log(target);
            setTimeout(function() {
                html = Mediakron.cleanHTML(target.html());
                target.html(html);
                target.attr('disabled', false);
            }, 20);
        },
    blurWysiwyg: function(e) {
        var target = $(e.currentTarget),
            text = target.text(),
            placeholder = target.attr('data-placeholder');
        if (text === '') {
            target.html('');
        }
    },
    focusWysiwyg: function(e) {
        var target = $(e.currentTarget),
            text = target.text(),
            placeholder = target.attr('data-placeholder');
        this.focusElement = target;
        if (text == placeholder || text === '') {
            target.html('<p></p>');
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart(target.children()[0], 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    },
    range: false,
    selection: false,
    restoreRange: function() {
        this.focusElement.focus();
        if (this.range) {
            if (window.getSelection()) {
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(this.range);
                this.range = false;
            } else if (document.selection && this.range.select) {
                this.range.select();
                this.range = false;
            }
        }
    },
    getSelectionStartNode: function() {},
        attachNew: function(){
          $('.story-annotate-main').hide();
          $('#admin-link-content').show();
            
          var data, callback, view, lightbox, thisView = this;
          var body = $('#annotation-body').html();
          data = {
            'context': false,
            'callback': function(item) {
              thisView.uri = item.get('uri');
              Mediakron.Status.formChanged = true;
              thisView.item = item;
              thisView.rerender(body);
              thisView.afterRender();
              $('#admin-link-content').hide().empty();
              $('.story-annotate-main').show(); 
              Mediakron.ContentBrowser.filter.filter = false;
            },
            'cancelCallback': function(){
              $('#admin-link-content').hide().empty();
              $('.story-annotate-main').show();
              thisView.rerender(body);
              thisView.afterRender();
              Mediakron.ContentBrowser.filter.filter = false;
            }
          };
          view = new Mediakron.ContentBrowser.AddPage(data);
          view.setElement('#admin-link-content');
          html = view.render();
          view.afterRender();
        },
        attachExisting: function() {
          $('.story-annotate-main').hide();
          $('#admin-link-content').show();
          
          var data, callback, view, lightbox, thisView = this;
          var body = $('#annotation-body').html();
          // Get body and text for repopulation later
          data = {
            'context': false,
            'callback': function(item) {
              thisView.uri = item.get('uri');
              Mediakron.Status.formChanged = true;
              thisView.item = item;
              thisView.rerender(body);
              thisView.afterRender();
              $('#admin-link-content').hide().empty();
              $('.story-annotate-main').show(); 
              Mediakron.ContentBrowser.filter.filter = false;
            },
            'cancelCallback': function(){
              $('#admin-link-content').hide().empty();
              $('.story-annotate-main').show();
              thisView.rerender(body);
              thisView.afterRender();
              Mediakron.ContentBrowser.filter.filter = false;
            }
          };
          view = new Mediakron.ContentBrowser.Selector(data);
          view.setElement('#admin-link-content');
          html = view.render();
          view.afterRender();
        },
        removeAttachment: function(){
          $('#selected-item').empty();
          this.item = false;
          this.uri = false;
          this.changes.uri = this.uri;
        },
        save: function(){
          var body = $('#annotation-body').html();

          var uri = this.uri;
          this.annotation = {
            uri: this.annotationId,
            data: {
              body: body,
              id: this.annotationId,
              user: Mediakron.user.get('id')
            },
            attachment: this.uri
          };
          this.annotations[this.annotationId] = this.annotation;
          this.model.set('annotations', this.annotations);
          model.updateAnnotationRelationship();
          Mediakron.App.Events.trigger('story:change', {});
          Mediakron.App.Events.trigger('story:render', {});
          this.close();
        },
        cancel: function(){
          if(this.edit){
            
          }else{
            $('.annotation-'+this.annotationId).contents().unwrap();
            $('.annotation-popup').empty();
            $('.annotation-popup').hide();
          }
          this.close();
        },
        getContentBrowser: function() {
          $('.organize-marker').hide();
          $('#admin-link-content').show();
          var data, callback, lightbox, view = this;
          data = {
              'context': false,
              'callback': function(item) {
                  view.changes.uri = item.get('uri');
                  Mediakron.Status.formChanged = true;
                  view.item = item;
                  view.oldURI = view.uri;
                  view.uri = markerPane.changes.uri;
                  view.render();
                  view.afterRender();
                  $('#admin-link-content').hide().empty();
                  $('#organize-marker').show();
              }
          };
          view = new Mediakron.ContentBrowser.Selector(data);
          view.setElement('#admin-link-content');
          html = view.render();
          view.afterRender();
      },
    });
    var Wysiwyg = function(element) {
            this.$el = false;
            this.range = false;
            this.newElement = '<p class="mk-paragraph" />';
            this.domRepresentation = {};
            this.model = false;
            this.init(element);
            this.annotationAddController = AddAnnotation;
        }
    Wysiwyg.prototype = {
        init: function(element) {
            var $el = $(element),
                Wysiwyg = this;
            this.$el = $el;
            var $wrapper = $('<div>');
            $wrapper.html(_.template(wysiwygTemplate)());
            $el.parent().parent().parent().before($wrapper);
            $('button.wysiwyg-button', $wrapper).click(function(e){ Wysiwyg.apply(e) });
            $('.wlink-internal',$wrapper).click(Wysiwyg.showWysiwgyInternal);
            $('.wysiwyg-headers',$wrapper).hover(function(){
              $('.wysiwyg-headers-inner').show();
            },function(){
              $('.wysiwyg-headers-inner').hide();
            })
            Mediakron.App.Events.on('wysiwyg:event', function(data){
              if(data.action == 'select') Wysiwyg.toggleLinkButton();
            });
            //this.enableDebug('#json');
        },
        setModel: function(model){
          this.model = model;
        },
        
        // deal with enabling and disabling debugger.  Could be removed from prod code
        enableDebug: function(el){
          this.debug = $(el);
          var editorInstance = this;
          Mediakron.App.Events.on('after.object.format',function(args){
            editorInstance.debugRender();
          });
        },
        // Debugger Handler
        debugRender: function(){
          // get tracker object
          var str = JSON.stringify(this.trackerObject, null, '\t');
          this.debug.text(str);
        },
        // this function will be run under certian conditions to update the contents from the source, and clean anything weird
        // for instance, a backspace that deletes a dom element should update the contents
        updateContents: function() {
            this.contents = this.$el.html();
            if (!this.placeholder) {
                if (!this.contents) {
                    this.$el.html('<p class="mk-placeholder">' + this.$el.attr('data-placeholder') + '</p>')
                    this.initial = true;
                }
            }
        },
        createElement: function() {
            return $(this.newElement);
        },
        removePlaceholder: function() {
            $('.mk-placeholder', this.$el).remove();
            this.currentElement = paragraph = $('<p class="mk-paragraph" />');
            this.$el.append(paragraph);
            paragraph.selectionToEnd();
            return this;
        },
        newParagraph: function(uid) {
            var p = document.createElement('p');
            p.setAttribute('name', uid);
            p.setAttribute('class', 'mk-p mk-p-' + uid);
            return p;
        },
        splitNode: function(uid) {
            var p = Selection.splitNode();
            p.setAttribute('name', uid);
            p.setAttribute('class', 'mk-p mk-p-' + uid);
            return p;
        },
        deleteCurrent: function() {
            this.currentElement.remove();
        },
        showBubble: function(target, selection) {
            this.toggleLinkButton();
            $('.wysiwyg').show().addClass('showWysiwyg');
            $('.wysiwyg').children().addClass('hide');
            $('.normal-wysiwyg').removeClass('hide');
        },
        /*hideBubble: function(target) {
            $('.wysiwyg').hide().removeClass('showWysiwyg');
        },
        /*updateBubblePosition: function(target) {
            var boundry = Selection.getBoundry(),
                position = $(target).offset(),
                parent = $(target).parent(),
                left, top;
            if (position) {
                top = boundry.top - position.top - 100;
                left = boundry.left - position.left - 310;
                $('.wysiwyg', parent).css({
                    'top': top + "px",
                    'left': left + "px"
                });
            }
        },*/
        toggleLinkButton: function(){
            var selection = window.getSelection(),
                oRange = selection.getRangeAt(0),
                ancestor = $(oRange.commonAncestorContainer);
            if (ancestor.closest('blockquote').length > 0) {
                $('.wysiwyg-indent').addClass('hide');
                $('.wysiwyg-outdent').removeClass('hide');
            } else {
                $('.wysiwyg-indent').removeClass('hide');
                $('.wysiwyg-outdent').addClass('hide');
            }
            if (findinselection('a', this.$el[0])) {
                $('.wysiwyg-link').addClass('hide');
                $('.wysiwyg-unlink').removeClass('hide');
            } else {
                $('.wysiwyg-link').removeClass('hide');
                $('.wysiwyg-unlink').addClass('hide');
            }
        },
        insertCitation: function(html) {
            var sel, initRange, node;
            var uniqueId = Mediakron.user.get('id')+'-'+(((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
            if (window.getSelection) {
                // IE9 and non-IE
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    initRange = window.getSelection().getRangeAt(0);
                    
                    var templateElement = document.createElement("cite");
                    templateElement.className = "annotation annotation-"+uniqueId;
                    templateElement.setAttribute('annotation-id', uniqueId);
                    var ranges = [];
                    var range;
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        ranges.push( sel.getRangeAt(i) );
                    }
                    sel.removeAllRanges();
                    // Surround ranges in reverse document order to prevent surrounding subsequent ranges messing with already-surrounded ones
                    i = ranges.length;
                    while (i--) {
                        range = ranges[i];
                        surroundRangeContents(range, templateElement);
                        sel.addRange(range);
                    }

                    sel.removeAllRanges();
                    sel.addRange(initRange);
                    var insertView = new AddAnnotation({
                      'annotationId': uniqueId,
                      'model': this.model
                    });
                    var annotationPane = $('<div>');
                    $('.story-edit-right-bind').append(annotationPane);
                    insertView.setElement(annotationPane);
                    insertView.render();
                    
                }
            } else if (document.selection && document.selection.createRange) {
                // IE < 9
                range = document.selection.createRange();
                range.collapse(isBefore);
                range.pasteHTML(html);
            }
        },
        apply: function(e) {
            e.preventDefault();
            var action = $(e.currentTarget),
                execute = action.attr('data-tag');
            if (execute == 'submitLink') {
                Selection.restoreRange(range);
            }
            console.log(execute);
            var edit = $el, navView = this;
            range = Selection.getRange();
            nodename = Selection.selection.focusNode.parentElement.nodeName;
            switch (execute) {
            case 'h1':
            case 'h2':
            case 'h3':
                if($(Selection.selection.focusNode).parents('ul').length > 0 || $(Selection.selection.focusNode).parents('ol').length > 0){
                  
                } else if($(Selection.selection.focusNode).parents('h2').length > 0 || $(Selection.selection.focusNode).parents('h3').length > 0) {
                    document.execCommand("formatBlock", false, 'p');
                } else {
                    document.execCommand("formatBlock", false, execute);
                }  
                break;
            case 'headers':
                 $('.wysiwyg-headers-inner').toggleClass("open");
                 break;
            case 'createLink':
                $('.normal-wysiwyg').addClass('hide');
                $('.wlink-tool').removeClass('hide');
                break;
            
            case 'createNote':
                this.insertCitation();
                return true;
              break;
            case 'submitLink':
                var url = $('#wlink-external-field').val();
                if (url === "") return false;
                if (!url.match("^(http://|https://|mailto:)")) url = "http://" + url;
                document.execCommand('createLink', false, url);
                $('.normal-wysiwyg').removeClass('hide');
                $('.wlink-tool').addClass('hide');
                navView.toggleLinkButton();
                $('#wlink-external-field').val('');
                break;
            case 'cancelLink':
                var top = $('#settings-context').scrollTop();
                $('.normal-wysiwyg').removeClass('hide');
                $('.wlink-tool').addClass('hide');
                $('#wlink-external-field').val('');
                break;
            case 'removeLink':
                $('.wysiwyg-link').addClass('hide');
                $('.wysiwyg-unlink').removeClass('hide');
                document.execCommand("unlink", false, false);
                this.toggleLinkButton();
                break;
            case 'addFeature': 
                document.execCommand("insertHtml", false, "</p><figure>figure</figure><p>");
                $('.story-add .add-button').click();
              break;
            case 'superscript':
                document.execCommand(execute);
                break;

            case 'indent':
                $('.wysiwyg-indent').addClass('hide');
                $('.wysiwyg-outdent').removeClass('hide');
                document.execCommand(execute);
                break;
            case 'outdent':
                $('.wysiwyg-indent').removeClass('hide');
                $('.wysiwyg-outdent').addClass('hide');
                document.execCommand(execute);
                document.execCommand('formatBlock', false, 'p');
                break;
            case 'insertOrderedList':
                if($(Selection.selection.focusNode).parents('h1').length > 0 || $(Selection.selection.focusNode).parents('h2').length > 0 || $(Selection.selection.focusNode).parents('h3').length > 0){
                  
                }else{
                  document.execCommand(execute);
                }
                break;
            case 'insertUnorderedList':
                if($(Selection.selection.focusNode).parents('h1').length > 0 || $(Selection.selection.focusNode).parents('h2').length > 0 || $(Selection.selection.focusNode).parents('h3').length > 0){
                  
                }else{
                  document.execCommand(execute);
                }
                break;
            default:
                document.execCommand(execute);
                break;
            }
            edit.contents().focus();
            Mediakron.App.Events.trigger('story:structure:change');
            return false;
        },
        
        
        
        showWysiwgyInternal: function() {
            var data, callback, navView = this, view;
            var range = Selection.saveRange();
            $('#linkbrowser-contents').scrollTop(0);
            data = {
                'context': false,
                'el': '#linkbrowser-contents',
                'callback': function(menu) {
                    Selection.restoreRange(range);
                    document.execCommand('createLink', false, basepath + menu.get('uri'));
                    Mediakron.controller.closeLinkBrowser();
                    $('.normal-wysiwyg').removeClass('hide');
                    $('.wlink-tool').addClass('hide');

                    $('.wysiwyg-link').addClass('hide');
                    $('.wysiwyg-unlink').removeClass('hide');

                    Mediakron.App.Events.trigger('story:structure:change');
                },
                'cancelCallback': function() {
                    Selection.restoreRange(range);
                    Mediakron.controller.closeLinkBrowser();
                    $('.normal-wysiwyg').removeClass('hide');
                    $('.wlink-tool').addClass('hide');
                    Mediakron.App.Events.trigger('story:structure:change');
                }
            };
            Mediakron.controller.openLinkBrowser();
            view = new Mediakron.ContentBrowser.LinkSelector(data);
            html = view.render();
            view.afterRender();
        },
        
    }
    
    
    return Wysiwyg;
});



function getNextNode(node) {
    var next = node.firstChild;
    if (next) {
        return next;
    }
    while (node) {
        if ( (next = node.nextSibling) ) {
            return next;
        }
        node = node.parentNode;
    }
}

function getNodesInRange(range) {
    var start = range.startContainer;
    var end = range.endContainer;
    var commonAncestor = range.commonAncestorContainer;
    var nodes = [];
    var node;

    // Walk parent nodes from start to common ancestor
    for (node = start.parentNode; node; node = node.parentNode) {
        nodes.push(node);
        if (node == commonAncestor) {
            break;
        }
    }
    nodes.reverse();

    // Walk children and siblings from start until end is found
    for (node = start; node; node = getNextNode(node)) {
        nodes.push(node);
        if (node == end) {
            break;
        }
    }

    return nodes;
}

function getNodeIndex(node) {
    var i = 0;
    while ( (node = node.previousSibling) ) {
        ++i;
    }
    return i;
}

function insertAfter(node, precedingNode) {
    var nextNode = precedingNode.nextSibling, parent = precedingNode.parentNode;
    if (nextNode) {
        parent.insertBefore(node, nextNode);
    } else {
        parent.appendChild(node);
    }
    return node;
}

// Note that we cannot use splitText() because it is bugridden in IE 9.
function splitDataNode(node, index) {
    var newNode = node.cloneNode(false);
    newNode.deleteData(0, index);
    node.deleteData(index, node.length - index);
    insertAfter(newNode, node);
    return newNode;
}

function isCharacterDataNode(node) {
    var t = node.nodeType;
    return t == 3 || t == 4 || t == 8 ; // Text, CDataSection or Comment
}

function splitRangeBoundaries(range) {
    var sc = range.startContainer, so = range.startOffset, ec = range.endContainer, eo = range.endOffset;
    var startEndSame = (sc === ec);

    // Split the end boundary if necessary
    if (isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
        splitDataNode(ec, eo);
    }

    // Split the start boundary if necessary
    if (isCharacterDataNode(sc) && so > 0 && so < sc.length) {
        sc = splitDataNode(sc, so);
        if (startEndSame) {
            eo -= so;
            ec = sc;
        } else if (ec == sc.parentNode && eo >= getNodeIndex(sc)) {
            ++eo;
        }
        so = 0;
    }
    range.setStart(sc, so);
    range.setEnd(ec, eo);
}

function getTextNodesInRange(range) {
    var textNodes = [];
    var nodes = getNodesInRange(range);
    for (var i = 0, node, el; node = nodes[i++]; ) {
        if (node.nodeType == 3) {
            textNodes.push(node);
        }
    }
    return textNodes;
}

function surroundRangeContents(range, templateElement) {
    splitRangeBoundaries(range);
    var textNodes = getTextNodesInRange(range);
    if (textNodes.length == 0) {
        return;
    }
    for (var i = 0, node, el; node = textNodes[i++]; ) {
        if (node.nodeType == 3) {
            el = templateElement.cloneNode(false);
            node.parentNode.insertBefore(el, node);
            el.appendChild(node);
        }
    }
    range.setStart(textNodes[0], 0);
    var lastTextNode = textNodes[textNodes.length - 1];
    range.setEnd(lastTextNode, lastTextNode.length);
}