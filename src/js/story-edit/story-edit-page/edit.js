// Filename: views/projects/list
define([
    'text!src/story/wysiwyg.html', 
    'text!src/story/save.html', 
    'text!src/story/add.html', 
    'text!src/story/note.html', 
    'text!src/story/figurehelp.html',
    '/mediakron/js/vendor/Autolinker.js/dist/Autolinker.min.js'], 
    
    function(wysiwygTemplate, saveTemplate, addTemplate, noteTemplate, helpTextTemplate, autolinker) {
    if (!Date.now) {
        Date.now = function() {
            return new Date().getTime();
        };
    }
    jQuery.fn.removeAttributes = function() {
        return this.each(function() {
            var attributes = $.map(this.attributes, function(item) {
                return item.name;
            });
            var img = $(this);
            $.each(attributes, function(i, item) {
                img.removeAttr(item);
            });
        });
    };
    var model, $el, features = [],
        storyParent, $titleField, $bodyField, wysiwygView, editView, add = false,
        shiftDown = false,
        addSelection = false;
    var init = function(options) {
            // Initialize here
            //document.designMode = "on";
            //document.execCommand('enableObjectResizing', false, 'false');
            if (options.model) {
                model = options.model;
            }
            if (options.$el) {
                $el = options.$el;
            }
            if (options.parent) {
                storyParent = options.parent;
            }
            if (options.add) {
                add = true;
            }
            $el.addClass('edit-story');
            $titleField = $('.story-title', $el);
            $bodyField = $('.story-body', $el);
            var checkTitle = $titleField.attr('contenteditable', true).text(),
                checkBody = $bodyField.attr('contenteditable', true).text().replace(/\s/g, '');

            editView = new editBind(model);
            editView.setElement($('.story-edit-bar .save-bar-inner', $el));
            editView.render();
            $('#story-done-editing').click(function() {
                editView.saveExit();
            });
            wysiwygView = new wysiwygBind(model);
            wysiwygView.setElement($('.story-template', $el));
            wysiwygView.render();
            window.DragonDrop = new DRAGON_DROP({
                draggables: $('figure'),
                dropzones: $('[contenteditable]'),
                noDrags: $('figure img')
            });
            return this;
        };
    var destroyEdit = function() {
            editView.remove();
            wysiwygView.remove();
        };
    var wysiwygBind = Mediakron.Extensions.View.extend({
        template: _.template(wysiwygTemplate),
        addTemplate: _.template(addTemplate),
        noteTemplate: _.template(noteTemplate),
        helpTextTemplate: _.template(helpTextTemplate),
        selected: false,
        clickIntercept: false,
        createModel: false,
        trace: false,
        $wysiwygLinkBind: false,
        initialize: function(model) {
            this.model = model;
        },
        afterRender: function() {},
        render: function() {
            $('.story-body', this.$el).before(this.template());
            $('.story-edit-left-bind', this.$el).html(this.addTemplate() + this.noteTemplate());
            this.afterRender();
            this.$wysiwygLinkBind = $('.wbrowse ul');
            var view = this;
            $(document).keydown(function(e) {
                view.keydown(e);
            });
            $(document).keyup(function(e) {
                view.keyup(e);
            });
            return this;
        },
        close: function() {
            $(document).off('keydown').off('keyup');
        },
        keydown: function(e) {
            Mediakron.Status.formChanged = true;
            var selection = window.getSelection(),
                oRange = selection.getRangeAt(0),
                ancestor = $(oRange.commonAncestorContainer),
                focus = $(selection.focusNode),
                tag = focus.prop('tagName'),
                view = this, parent, previous = oRange.commonAncestorContainer.previousSibling;
            if(!tag){
                
                parent = ancestor.parent();
                if(parent){
                    tag = parent.prop('tagName');
                    ancestor = parent;
                }
            }

            if (e.keyCode) {
                switch (e.keyCode) {
                case 16:
                    // shift
                    shiftDown = true;
                  break;
                case 8:
                    // backspace

                    if (oRange.startOffset === 0) {
                        if(previous){
                            if(previous.length > 0){
                                return true; 
                            }
                        }
                        
                        // we be at the beginning of a text ndoe probably
                        var previousElement = false;
                        if(tag == 'LI'){
                            // Lets see what the previous is
                            var prev = ancestor.prev();
                            if(prev.length === 0){ // this is the first element in the list
                                previousElement = ancestor.parent().prev();
                            }else{
                                return true;
                            }
                            
                        }else{
                            var rootElement = view.getRootElement(ancestor);
                        
                            if(rootElement.prop('tagName') == 'P'){
                                previousElement = rootElement.prev();
                            }
                        }
                        

                        if (previousElement) {
                            if (previousElement.prop('tagName') == 'FIGURE') {
                                e.preventDefault();
                                view.selectElement(previousElement);
                                text = "Are you sure you want to remove this?";
                                accept = function(request) {
                                    view.selected.remove();
                                };
                                reject = function(request) {
                                    return false;
                                };
                                Mediakron.message({
                                    text: text,
                                    type: 'warning',
                                    timeout: 0,
                                    layout: 'center',
                                    confirm: true,
                                    callback: function() {
                                        accept();
                                    },
                                    cancel: function() {
                                        reject();
                                    }
                                });
                                return false;
                            }
                        }
                    }
                    break;
                }
            }
        },
        getRootElement: function(element) {
            var parent;
            parent = element.parent();
            if (parent.hasClass('story-body')) {
                return element;
            } else {
                return this.getRootElement(parent);
            }
        },
        keyup: function(e) {
            Mediakron.Status.formChanged = true;
            var selection = window.getSelection(),
                oRange = selection.getRangeAt(0),
                commonancestor = ancestor = $(oRange.commonAncestorContainer),
                focus = $(selection.focusNode),
                view = this,
                tag = focus.prop('tagName'),
                parent = false,
                end = false;
            if (!tag) {
                
                // we don't know what the tag is, which either means we are in a text block
                // or we just left a text block and we're in an empty row.  Lets find out which one
                parent = ancestor.parent();
                if (parent.prop('tagName') == 'P') {
                    ancestor = parent;
                    tag = 'P';
                }
                
                if(!tag){
                    tag = parent.prop('tagName');
                    ancestor = parent;
                }
            }
            if (tag == 'INPUT' || focus.hasClass('wlink-tool') || focus.hasClass('add')) {
                return true;
            }
            if (focus.hasClass('story-body')) {
            }
            var next = ancestor.next(),
                prev = ancestor.prev();
            if (next.length < 1) {
                end = true;
            }

            if (e.keyCode) {
                switch (e.keyCode) {
                case 8:
                    // backspace
                    // don't mess with stuff if we're editing a caption
                    if (this.inCaption) return true;
                    // if its a div and we're removing it, format the result as a paragraph
                    if (tag == 'DIV') {
                        //document.execCommand('formatBlock', false, 'p');
                    }
                    // we're working in a selected feature, so we should take confirm the feature delete
                    // if everything in the body is empty after hitting delete, make sure we have a placeholder paragraph
                    var checkBody = $bodyField.text().replace(/\s/g, '');
                    if (checkBody === '') {
                        $bodyField.html('<p/>');
                    }
                    break;
                case 13:
                    // return
                    if (tag == 'FIGURE') {
                        var mainDiv = ancestor;
                        var range = document.createRange();
                        e.preventDefault();
                        $insert = $('<p> </p>');
                        $insert.insertAfter(mainDiv);
                        range.setStart($insert[0], 0);
                        range.setEnd($insert[0], 1);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        $('.selected').removeClass('selected');
                        this.selected = false;
                        return false;
                    } else if (tag == 'LI' || ancestor.prop('tagName') == 'LI') {
                        
                    } else if (tag == 'SPAN') {
                        } else if (tag == 'H3') {
                            } else if (tag == 'H2') {
                        
                    }else if (tag == 'DIV') {
                        //document.execCommand('formatBlock', false, 'p');
                    }else{
                        if(!shiftDown){
                            document.execCommand('formatBlock', false, 'p');
                        }
                        
                    }
                    break;
                case 16:
                        shiftDown = false;
                    break;
                case 37:
                    //left arrow
                case 38:
                    // Up Arrow
                case 39:
                    // right arrow
                case 40:
                    // down Arrow
                    if (tag == 'FIGURE') {
                        this.selectElement(focus);
                    }else{
                        this.deSelectElement();
                    }
                    break;
                default:
                    // 
                    break;
                }
            }
            this.openWysiwyg(e);
        },
        selectElement: function(focus) {
            this.selected = focus;
            focus.addClass('selected');
            $('.story-body').get(0).focus();
        },
        deSelectElement: function(focus) {
            this.selected = false;
            $('.selected').removeClass('selected');
            $('.story-body').get(0).focus();
        },
        events: {
            'mouseup .wysiwyg-button': 'apply',
            'mousedown .story-add-button': 'addTo',
            'mousedown .story-body': "bindWysiwygListner",
            //'keydown .story-body':              "handleKeydown",
            //'keyup .story-body':                "handleKeyup",
            'mouseup .story-body': "openWysiwyg",
            'paste .story-body': "cleanPaste",
            'blur .story-body': "blurWysiwyg",
            'focus .story-body': "focusWysiwyg",
            'mouseup .add-button': "showAdd",
            'mouseup .story-add-bg': "showAdd",
            'mouseup .story-add-content .close-story-button': "showAdd",
            'click .story-body figure': 'highlightFigure',
            'focus .story-body figure': 'highlightFigure',
            'click .story-body': 'catchEditClicks',
            'click .add-new': 'showAdds',
            'click .add-existing': 'showBrowses',
            'mouseenter .story-body figure': 'hoverOverFigure',
            'click .save-add': 'saveNew',
            'dragenter .add-dropzone': "dragEnter",
            'dragover .add-dropzone': "dragOver",
            'drop .add-dropzone': "dropFile",
            'change #file-file': "addFile",
            'change #image-file': "addFile",
            'click #upload-image': "triggerImageUpload",
            'click #upload-file': "triggerFileUpload",
            'keyup .filter-browse': "filterBrowse",
            'click .wlink-internal': "showWysiwgyInternal",
            'click .tab-link': 'tab'
        },
        highlightFigure: function(e) {
            //this.selectElement($(e.currentTarget));
        },
        triggerImageUpload: function(e) {
            e.preventDefault();
            $('#image-file').click();
            return false;
        },
        triggerFileUpload: function(e) {
            e.preventDefault();
            $('#file-file').click();
            return false;
        },
        inCaption: false,
        hoverOverFigure: function(e) {
            var $target = $(e.currentTarget),
                type = $target.attr('type'),
                uri = $target.attr('uri'),
                item = Mediakron.getItemFromURI(uri),
                caption = $('.figure-caption', $target).html(),
                $helpText = $(this.helpTextTemplate({
                    type: type,
                    caption: caption
                })),
                view = this;
            $('.figure-caption',$target).hide();
            $target.append($helpText);
            $('.figure-button', $helpText).click(function(e) {
                var $action = $(e.currentTarget),
                    figure, action = $action.attr('class-tag');
                if (action == 'edit') {
                    figure = $target;
                    if (item) {
                        url = item.editURL();
                        Mediakron.controller.gotoCallback = function() {
                            Mediakron.controller.closeAdmin();
                            if (add) {
                                Mediakron.router.navigate('settings/content/add/story');
                            } else {
                                Mediakron.router.navigate(uri);
                            }
                            storyParent.renderFeatures('edit');
                        };
                        Mediakron.router.navigate(url, {
                            trigger: true
                        });
                    }
                } else if (action == 'delete') {
                    $target.remove();
                    document.execCommand('formatBlock', false, 'p');
                } else {
                    figure = $target;
                    var type = figure.attr('type'),
                        classes = '';
                    _.each(Mediakron.Story.wysiwyg[type], function(options) {
                        classes += options['class'] + ' ';
                    });
                    figure.attr('style', '').removeClass(classes).addClass(action);
                    if (action == 'alignFull') {
                        var windowWidth = $(window).width() + 5,
                            offset = $('.story-body').offset(),
                            left = (offset.left * -1) - 11;
                        figure.css({
                            "width": windowWidth + 'px',
                            "margin-left": left + 'px'
                        });
                    }
                }
            });
            $('.caption-edit', $helpText).click(function(e) {
                var val = $(e.currentTarget).val();
                $('.figure-caption', $target).text(val);
                view.inCaption = true;
            });
            $('.caption-edit', $helpText).blur(function(e) {
                var val = $(e.currentTarget).val();
                $('.figure-caption', $target).text(val);
                view.inCaption = false;
                $('figure .helptext').remove();
                $('.figure-caption',$target).show();
            });
            $helpText.hover(function(e) {}, function(e) {
                if(!view.inCaption){
                    $('figure .helptext').remove();
                    $('.figure-caption',$target).show();
                }
            });
        },
        saveNew: function(e) {
            var type = $(e.currentTarget).attr('data-type'),
                $target = $('#story-add-' + type),
                view = this,
                title = $('.title-field', $target).val(),
                file = $('.file-url-field', $target).val();
            if(!title){
                
            }
            
            this.createModel.set({
                'title': title,
                'caption': $('.caption-field', $target).val()
            });
            if (type == 'audio') {
                this.createModel.set({
                    'audio': {
                        'type': $('#audio-type', $target).val(),
                        'url': file
                    }
                });
            } else if (type == 'video') {
                this.createModel.set({
                    'video': {
                        'type': $('.select-video', $target).val(),
                        'url': file
                    }
                });
            } else if (type == 'file') {
                this.createModel.set({
                    'title': $('.title-field', $target).val(),
                    'caption': $('.caption-field', $target).val()
                });
            }
            view.restoreSelection(addSelection);
            this.createModel.save({}, {
                success: function(model) {
                    model.addToCollection();
                    Mediakron.createUrlMap();
                    view.insertFeature(model);
                    $('.add-items').removeClass('is-visible');
                    $('.story-add-bg').removeClass('is-visible');
                    $('.title-field', $target).val('');
                    $('.caption-field', $target).val('');
                    $('.select-audio', $target).val('');
                     $('.file-url-field', $target).val('');
                    $('.select-video', $target).val('');
                    $('.edit-thumbnail', $target).empty();
                    view.createModel = new Mediakron.Models.Item();
                    view.createModel.set({
                        type: model.get('type')
                    });
                },
                error: function(status) {}
            });
        },
        dragEnter: function(e) {
            target = $(e.currentTarget);
            e.stopPropagation();
            e.preventDefault();
            target.css('border', '2px solid #0B85A1');
        },
        dragOver: function(e) {
            e.stopPropagation();
            e.preventDefault();
        },
        dropFile: function(e) {
            $(this).css('border', '2px dotted #0B85A1');
            e.preventDefault();
            var evt = e.originalEvent;
            evt.dataTransfer.dropEffect = 'copy';
            evt.target.files = evt.dataTransfer.files;
            this.upload(e);
        },
        addImage: function(e) {
            this.upload(e);
        },
        addFile: function(e) {
            this.upload(e);
        },
        upload: function(e) {
            var type = false;
            if (e.target.files[0].type == 'image/jpg' || e.target.files[0].type == 'image/jpeg' || e.target.files[0].type == 'image/png' || e.target.files[0].type == 'image/gif') {
                type = 'image';
            }
            if (e.target.files[0].type == 'application/pdf') {
                type = 'pdf';
            }
            if (!type) Mediakron.message({
                text: "That file appears to be invalid.",
                type: 'warning',
                'timeout': 0,
                'dismiss': true,
                layout: 'center'
            });
            var upload = Mediakron.Edit.fileUpload(e),
                view = this;
            upload.done(function(response) {
                Mediakron.Status.formChanged = true;
                if (type == 'image') {
                    view.createModel.set({
                        image: {
                            uri: response.file,
                            mime: e.target.files[0].type,
                            size: {
                                'width': $('.edit-thumbnail img').width(),
                                'height': $('.edit-thumbnail img').height()
                            },
                            zoom: 2
                        },
                        text: {
                            uri: response.file,
                            mime: e.target.files[0].type,
                            type: 'image'
                        }
                    });
                } else {
                    view.createModel.set({
                        text: {
                            uri: response.file,
                            url: response.file,
                            mime: e.target.files[0].type,
                            type: 'pdf'
                        }
                    });
                }
                $('#remove-image').removeClass('hide');
                $('.field-alt').removeClass('hide');
            }).fail(function(response) {
                // yarg failed. TODO FIGURE OUT FAILURE
            });
        },
        showAdds: function(e) {
            $('.story-add-type .add-existing-content').addClass('hide');
            $('.story-add-type .add-new-content').removeClass('hide');
            $('.add-existing').removeClass('is-active');
            $('.add-new').addClass('is-active');
            var type = $(e.currentTarget).attr('data-type');
            this.createModel = new Mediakron.Models.Item();
            this.createModel.set('type', type);
        },
        showBrowses: function(e) {
            $('.story-add-type .add-new-content').addClass('hide');
            $('.story-add-type .add-existing-content').removeClass('hide');
            $('.add-new').removeClass('is-active');
            $('.add-existing').addClass('is-active');
            var type = $(e.currentTarget).attr('data-type'),
                items = Mediakron.items.filter(function(item) {
                    normalType = item.getNormalType();
                    if (!item.get('published')) return false;
                    if (normalType !== type) return false;
                    return true;
                }),
                $bind = $('#story-add-' + type + ' .browse ul');
            this.drawBrowse($bind, items);
        },
        filterBrowse: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var type = $(e.currentTarget).attr('data-type'),
                val = $(e.currentTarget).val().toLowerCase(),
                normalType, title, items = Mediakron.items.filter(function(item) {
                    normalType = item.getNormalType();
                    title = item.get('title');
                    if (!item.get('published')) return false;
                    if (normalType !== type) return false;
                    if (title.toLowerCase().indexOf(val) == -1) return false;
                    return true;
                }),
                $bind = $('#story-add-' + type + ' .browse ul');
            this.drawBrowse($bind, items);
            return false;
        },
        drawBrowse: function($bind, items) {
            var view = this,
                i = 0,
                count = items.length,
                item;
            $bind.empty();
            if (count > 0) {
                for (i; i < count; i++) {
                    $bind.append('<li uri="' + items[i].get('uri') + '"><span class="mk-icon mk-add btn btn-primary"> </span><span class="title">' + items[i].get('title') + '</span></li>');
                }
            }
            $('li', $bind).click(function(ev) {
                var action = $(ev.currentTarget),
                    uri = action.attr('uri');
                var item = Mediakron.getItemFromURI(uri);
                view.insertFeature(item);
                $('.add-items').removeClass('is-visible');
                $('.story-add-bg').removeClass('is-visible');
            });
        },
        insertFeature: function(item) {
            var feature = $(item.getFeature('alignCol'));
            this.restoreSelection(addSelection);
            var listId = window.getSelection();
            var range = this.insertHTMLAtCursor(feature);
            range.selectNodeContents(feature[0]);
            if (feature.is(':last-child')) {
                feature.after('<p>');
            }
            features.push(feature);
            storyParent.renderFeatures('edit');
        },
        catchEditClicks: function(e) {},
        //highlightFigure: function(e) {},
        removePlaceholder: function(e) {
            var checkTitle = $titleField.attr('contenteditable', true).html(),
                checkTitleText = $titleField.attr('contenteditable', true).text();
            if (checkTitle == '<span class="ce-placeholder">Title</span>') {
                $('.ce-placeholder', $titleField).remove();
            } else if (checkTitleText === '') {
                $titleField.html('<span class="ce-placeholder">Title</span>');
            }
        },
        addPlaceholder: function(e) {
            var checkTitle = $titleField.attr('contenteditable', true).html(),
                checkTitleText = $titleField.attr('contenteditable', true).text();
            if (checkTitle == '<span class="ce-placeholder">Title</span>') {
                $('.ce-placeholder', $titleField).remove();
            } else if (checkTitleText === '') {
                $titleField.html('<span class="ce-placeholder">Title</span>');
            }
        },
        addTo: function(e) {
            var $target = $(e.currentTarget),
                type = $target.attr('data-type'),
                $aim = $('#story-add-' + type);
            $('.story-add-button').removeClass('selected');
            $('.story-add-type').addClass('hide');
            $aim.removeClass('hide');
            this.showBrowses(e);
            $('.add-existing-content', $aim).removeClass('hide');
            $('.add-new-content', $aim).addClass('hide');
            $('.add-new').removeClass('is-active');
            $('.add-existing').addClass('is-active');
            $target.addClass('selected');
        },
        initAdd: true,
        showAdd: function() {
            $('.add-items').toggleClass('is-visible');
            $('.story-content').toggleClass('story-add-content');
            $('.story-add-bg').toggleClass('is-visible');
            if (this.initAdd) {
                var type = 'image',
                    items = Mediakron.items.filter(function(item) {
                        normalType = item.getNormalType();
                        if (!item.get('published')) return false;
                        if (normalType !== type) return false;
                        return true;
                    }),
                    $bind = $('#story-add-image .browse ul');
                this.initAdd = false;
                this.drawBrowse($bind, items);
            }
        },
        showAddNote: function() {
            $('.add-items').toggleClass('is-visible');
            $('.story-content').toggleClass('story-add-content');
            $('.story-add-bg').toggleClass('is-visible');
           
        },
        showBubble: function(target) {
            this.updateBubblePosition(target);
            $('.wysiwyg').show().addClass('showWysiwyg');
        },
        updateBubblePosition: function(target) {
            var selection = window.getSelection(),
                range = selection.getRangeAt(0),
                boundary = range.getBoundingClientRect(),
                position = $(target).offset();
            if (position) {
                var parent = $(target).parent(),
                    left = ((boundary.left + boundary.right) / 2) - position.left - 230,
                    before = 230;
                if (left < 0) {
                    before = before + left;
                    left = 0;
                }
                $('.wysiwyg', parent).css({
                    'top': boundary.top - position.top - 75 + "px",
                    'left': left + "px"
                });
                $('.wysiwyg-arrow', parent).css({
                    'left': before + "px"
                });
            }
        },
        showWysiwgyInternal: function() {
            var data, callback, navView = this;
            $('#linkbrowser-contents').scrollTop(0);
            data = {
                'context': false,
                'el': '#linkbrowser-contents',
                'callback': function(menu) {
                    navView.restoreRange();
                    document.execCommand('createLink', false, basepath + menu.get('uri'));
                    Mediakron.controller.closeLinkBrowser();
                    $('.normal-wysiwyg').removeClass('hide');
                    $('.wlink-tool').addClass('hide');
                    if (findinselection('a', $bodyField[0])) {
                        $('.wysiwyg-link').addClass('hide');
                        $('.wysiwyg-unlink').removeClass('hide');
                    } else {
                        $('.wysiwyg-link').removeClass('hide');
                        $('.wysiwyg-unlink').addClass('hide');
                    }
                },
                'cancelCallback': function() {
                    navView.restoreRange();
                    Mediakron.controller.closeLinkBrowser();
                    $('.normal-wysiwyg').removeClass('hide');
                    $('.wlink-tool').addClass('hide');
                }
            };
            Mediakron.controller.openLinkBrowser();
            view = new Mediakron.ContentBrowser.LinkSelector(data);
            html = view.render();
            view.afterRender();
        },
        apply: function(e) {
            e.preventDefault();
            var action = $(e.currentTarget),
                execute = action.attr('data-tag');
            if (execute == 'submitLink') {
                this.restoreSelection(addSelection);
            }
            var edit = $('.rich-text #description'),
                view = this,
                selection = window.getSelection(),
                oRange = selection.getRangeAt(0),
                text = selection.toString(),
                ancestor = $(oRange.commonAncestorContainer),
                nodename = selection.focusNode.parentElement.nodeName;
            switch (execute) {
            case 'h1':
            case 'h2':
            case 'h3':
                if (nodename == 'H1' || nodename == 'H2' || nodename == 'H3') {
                    if (execute.toUpperCase() == nodename) {
                        document.execCommand("formatBlock", false, 'p');
                    } else {
                        document.execCommand("formatBlock", false, execute);
                    }
                } else {
                    document.execCommand("formatBlock", false, execute);
                }
                break;
            case 'createLink':
                $('.normal-wysiwyg').addClass('hide');
                $('.wlink-tool').removeClass('hide');
                break;
            case 'submitLink':
                var url = $('#wlink-external-field').val();
                if (url === "") return false;
                if (!url.match("^(http://|https://|mailto:)")) url = "http://" + url;
                document.execCommand('createLink', false, url);
                $('.normal-wysiwyg').removeClass('hide');
                $('.wlink-tool').addClass('hide');
                if (findinselection('a', $bodyField[0])) {
                    $('.wysiwyg-link').addClass('hide');
                    $('.wysiwyg-unlink').removeClass('hide');
                } else {
                    $('.wysiwyg-link').removeClass('hide');
                    $('.wysiwyg-unlink').addClass('hide');
                }
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
                break;
            case 'insertOrderedList':
                document.execCommand(execute);
                
                selection = window.getSelection();
                oRange = selection.getRangeAt(0);
                ancestor = $(oRange.commonAncestorContainer);
                
                ancestor.contents().filter(function() {
                    return this.nodeType == 3;  // Only text nodes
                }).wrap('<p></p>');
                $('br',ancestor.parent()).remove();
                break;
            case 'insertUnorderedList':
                document.execCommand(execute);
                selection = window.getSelection();
                oRange = selection.getRangeAt(0);
                ancestor = $(oRange.commonAncestorContainer);
                
                ancestor.contents().filter(function() {
                    return this.nodeType == 3;  // Only text nodes
                }).wrap('<p></p>');
                $('br',ancestor.parent()).remove();
                break;
            default:
                document.execCommand(execute);
                break;
            }
            edit.contents().focus();
            return false;
        },
        cleanPaste: function(e) {
            var html = '',
                selection = window.getSelection(),
                oRange = selection.getRangeAt(0),
                tools = this,
                i = 0;

            var myDiv = $("#pastehelper");
            myDiv.empty();
            myDiv.focus().select();
            
            var target = $(e.currentTarget);
            target.attr('disabled', true);
            setTimeout(function() {
                $('#pastehelper p:empty').remove();
                html = $('#pastehelper').html();

                html = Mediakron.cleanHTML(html, true);
                $('#pastehelper').html(html);
                var frag = document.createDocumentFragment(),
                    node, lastNode, el = $('#pastehelper')[0];
                target.attr('disabled', false);
                tools.restoreSelection(oRange);
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }

                oRange.insertNode(frag);
                $('p', target).removeAttr('style');
                $('a', target).removeAttr('style');
                $('blockquote', target).removeAttr('style');
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
            checkBody = $bodyField.text().replace(/\s/g, '');
            var children = $bodyField.children();
            if (checkBody === '' && children.length === 0) {
                $bodyField.html('<p/>');
            }
            var target = $(e.currentTarget),
                text = target.text(),
                placeholder = target.attr('data-placeholder'),
                tag = target.prop('tagName');
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
        saveSelection: function() {
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    return sel.getRangeAt(0);
                }
            } else if (document.selection && document.selection.createRange) {
                return document.selection.createRange();
            }
            return null;
        },
        restoreSelection: function(range) {
            if (range) {
                if (window.getSelection) {
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection && range.select) {
                    range.select();
                }
            }
        },
        insertHTMLAtCursor: function(text) {
            var sel, range, html;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    if (!$(range.startContainer).is('div')) { // make sure that we don't delete the body
                        $(range.startContainer).remove();
                    }
                    range.insertNode(text[0]);
                }
            } else if (document.selection && document.selection.createRange) {
                document.selection.createRange().text = text;
            }
            return range;
        },
        getSelectionStartNode: function() {},
        bindWysiwygListner: function(e) {
            var target = $(e.currentTarget),
                form = this;
            $('body').one('mouseup', function(event) {
                form.openWysiwyg(e);
            });
        },
        openWysiwyg: function(e, forceClose, forceOpen) {
            if (forceClose) {
                $('.wysiwyg').hide().removeClass('showWysiwyg');
                $('.wysiwyg').children().addClass('hide');
                return true;
            }
            var selection = window.getSelection();
            var oRange = selection.getRangeAt(0),
                text = selection.toString(),
                ancestor = $(oRange.commonAncestorContainer),
                anCheck = ancestor.text(),
                $target = $(e.currentTarget),
                tag = ancestor.prop('tagName'),
                offset = $('.story-body').offset(),
                top = 0;
                if(offset.top){
                    top1 = $('.story-body').offset().top;
                }
                
            if (!anCheck) {
                $('.story-add').css({
                    top: (ancestor.offset().top - top1) + 'px'
                });
                $('.story-add').show();
                $('.note-add').hide();
                addSelection = this.saveSelection();
            } else {
                var previousnode = this.getRootElement(ancestor).prev(), isprev = false;
                if(previousnode.prop('tagName') == 'P'){
                    if(!previousnode.text()){
                        isprev = true;
                    }
                }
                if(isprev){
                    $('.story-add').css({
                        top: (previousnode.offset().top - top1) + 'px'
                    });
                    $('.story-add').show();
                }else{
                    $('.story-add').hide();
                }
                
                addSelection = this.saveSelection();
            }
            if (text.length > 0) {
                $('.wysiwyg').children().addClass('hide');
                $('.normal-wysiwyg').removeClass('hide');
                this.range = oRange.cloneRange();
                this.selection = selection;
                this.showBubble(e.currentTarget);
                var $node = $(this.getSelectionStartNode());
                console.log('find')
                if (ancestor.closest('blockquote').length > 0) {
                    console.log('found')
                    $('.wysiwyg-indent').addClass('hide');
                    $('.wysiwyg-outdent').removeClass('hide');
                } else {
                    $('.wysiwyg-indent').removeClass('hide');
                    $('.wysiwyg-outdent').addClass('hide');
                }
                if (findinselection('a', $bodyField[0])) {
                    $('.wysiwyg-link').addClass('hide');
                    $('.wysiwyg-unlink').removeClass('hide');
                } else {
                    $('.wysiwyg-link').removeClass('hide');
                    $('.wysiwyg-unlink').addClass('hide');
                }
                addSelection = this.saveSelection();
            } else {
                $('.wysiwyg').hide().removeClass('showWysiwyg');
                $('.wysiwyg').children().addClass('hide');
            }
        }
    });
    var editBind = Mediakron.Extensions.View.extend({
        template: _.template(saveTemplate),
        changed: false,
        title: '',
        body: '',
        lastSave: false,
        initialize: function(model) {
            this.model = model;
            this.title = model.get('title');
            this.body = model.get('body');
        },
        afterRender: function() {
            var view = this;
            $('.story-body', $el).keypress(this.change);
            $('.story-title', $el).keypress(this.change);
            $('.close-button').click(function() {
                view.discard();
            });
        },
        render: function() {
            var content = {};
            this.$el.html(this.template(content));
            this.afterRender();
            return this;
        },
        events: {
            'click .save': 'saveStory',
            'click .save-exit': 'saveExit',
            'click .discard': 'discard',
            'click .close-button': 'discard',
            'keypress .story-body': 'change'
        },
        saveStory: function() {
            this.save();
        },
        saveExit: function() {
            var parent = this;
           
            this.save(function (model) {
                Mediakron.Status.linkDisable = false;
                $('.main-content').removeClass('editing-enabled');
                if (add) {

                    Mediakron.router.navigate(model.get('uri'), {
                        trigger: true
                    });
                } else {
                    Backbone.history.loadUrl(Backbone.history.fragment);
                }
            });
            
        },
        cleanHTML: function() {
            var $body = $('.story-body');
            $('figure', $body).removeClass('selected');
            $('span', $body).contents().unwrap();
        },
        save: function(callback) {
            var title = $('.story-title').text();
            if(title === ''){
                Mediakron.message({
                    text: 'Your story must have a title',
                    type: 'danger',
                    timeout: 4000,
                    layout: 'top'
                });
                $('#main-container').scrollTop(0);
                $('h1.story-title').css({'background-color':'#ffcccc'});
                return false;
            }
            this.cleanHTML();
            var view = this,
                $body = $('.story-body'),
                bodyContent = $body.html(),
                uri;
            bodyContent = Autolinker.link(bodyContent);
            model.setRelationship('children', []);
            $('figure', $body).each(function(i, item) {
                uri = $(item).attr('uri');
                child = Mediakron.getItemFromURI(uri);
                caption = $('.figure-caption', $(item)).text();
                model.add(child, {
                    'caption': caption
                }, true);
            }); 
            
            Mediakron.App.Events.trigger('comment:updateposition');
            Mediakron.message({
                text: 'Saving Story',
                type: 'success',
                timeout: 1000,
                layout: 'bottom'
            });
            setTimeout(function () {
                this.model.save({
                    'title': title,
                    'body': bodyContent
                }, {
                    success: function(model) {
                        view.model = model;
                        model.addToCollection();
                        Mediakron.createUrlMap();
                        Mediakron.Status.formChanged = false;
                        storyParent.edit = false;
                        Mediakron.message({
                            text: '<span class="mk-icon mk-save"></span>Changes saved',
                            type: 'success',
                            timeout: 4000,
                            layout: 'bottom',
                            dismiss:    true   
                        });
                        if (callback) {
                            callback(model);
                        }
                    }
                });
            }, 1000);
        },
        discard: function() {
            accept = function(request){ 
                Mediakron.Status.formChanged = false;
                Mediakron.Status.linkDisable = false;
                $('.main-content').removeClass('editing-enabled');
                storyParent.edit = false;
                if (add) {
                    Mediakron.back();
                } else {
                    Backbone.history.loadUrl(Backbone.history.fragment);
                } 
            };
            if(Mediakron.Status.formChanged){
                text = "You have unsaved changes on this form.  Are you sure you want to cancel?";
                reject = function(request){ };
                   Mediakron.message({
                        text:text,
                        type:'warning',
                        timeout:3000,
                        layout: 'center',
                        confirm:true,
                        callback: function(){ accept(); },
                        cancel: function(){  reject(); }
                        });
            }else{
                accept();
            }
            
        },
        change: function() {}
    });
    return init;
});
/*

==== Dragon Drop: a demo of precise DnD
          in, around, and between 
         multiple contenteditable's.

=================================
== MIT Licensed for all to use ==
=================================
Copyright (C) 2013 Chase Moskal

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
============
  
*/
function DRAGON_DROP(o) {
    var DD = this;
    // "o" params:
    DD.$draggables = null;
    DD.$dropzones = null;
    DD.$noDrags = null; // optional
    DD.dropLoad = null;
    DD.engage = function(o) {
        DD.$draggables = $(o.draggables);
        DD.$dropzones = $(o.dropzones);
        DD.$draggables.attr('draggable', 'true');
        DD.$noDrags = (o.noDrags) ? $(o.noDrags) : $();
        DD.$dropzones.attr('dropzone', 'copy');
        DD.bindDraggables();
        DD.bindDropzones();
    };
    DD.bindDraggables = function() {
        DD.$draggables = $(DD.$draggables.selector); // reselecting
        DD.$noDrags = $(DD.$noDrags.selector);
        DD.$noDrags.attr('draggable', 'false');
        DD.$draggables.off('dragstart').on('dragstart', function(event) {
            var e = event.originalEvent;
            $(e.target).removeAttr('dragged');
            var dt = e.dataTransfer,
                content = e.target.outerHTML;
            var is_draggable = DD.$draggables.is(e.target);
            if (is_draggable) {
                dt.effectAllowed = 'copy';
                dt.setData('text/plain', ' ');
                DD.dropLoad = content;
                $(e.target).attr('dragged', 'dragged');
            }
        });
    };
    DD.bindDropzones = function() {
        DD.$dropzones = $(DD.$dropzones.selector); // reselecting
        DD.$dropzones.off('dragleave').on('dragleave', function(event) {
            var e = event.originalEvent;
            var dt = e.dataTransfer;
            var relatedTarget_is_dropzone = DD.$dropzones.is(e.relatedTarget);
            var relatedTarget_within_dropzone = DD.$dropzones.has(e.relatedTarget).length > 0;
            var acceptable = relatedTarget_is_dropzone || relatedTarget_within_dropzone;
            if (!acceptable) {
                dt.dropEffect = 'none';
                dt.effectAllowed = 'null';
            }
        });
        DD.$dropzones.off('drop').on('drop', function(event) {
            var e = event.originalEvent;
            if (!DD.dropLoad) return false;
            var range = null;
            if (document.caretRangeFromPoint) { // Chrome
                range = document.caretRangeFromPoint(e.clientX, e.clientY);
            } else if (e.rangeParent) { // Firefox
                range = document.createRange();
                range.setStart(e.rangeParent, e.rangeOffset);
            }
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            $(sel.anchorNode).closest(DD.$dropzones.selector).get(0).focus(); // essential
            document.execCommand('insertHTML', false, '<param name="dragonDropMarker" />' + DD.dropLoad);
            sel.removeAllRanges();
            // verification with dragonDropMarker
            var $DDM = $('param[name="dragonDropMarker"]');
            var insertSuccess = $DDM.length > 0;
            if (insertSuccess) {
                $(DD.$draggables.selector).filter('[dragged]').remove();
                $DDM.remove();
            }
            DD.dropLoad = null;
            DD.bindDraggables();
            e.preventDefault();
        });
    };
    DD.disengage = function() {
        DD.$draggables = $(DD.$draggables.selector); // reselections
        DD.$dropzones = $(DD.$dropzones.selector);
        DD.$noDrags = $(DD.$noDrags.selector);
        DD.$draggables.removeAttr('draggable').removeAttr('dragged').off('dragstart');
        DD.$noDrags.removeAttr('draggable');
        DD.$dropzones.removeAttr('droppable').off('dragenter');
        DD.$dropzones.off('drop');
    };
    if (o) DD.engage(o);
}