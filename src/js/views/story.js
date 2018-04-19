Mediakron.Pages.story = Mediakron.Extensions.View.extend({
    template: JST['pages.story.default'],
    add: false,
    current: false,
    edit: false,
    editor: false,
    full: true,
    initialize: function(model) {
        if (model.addStory) {
            if (Mediakron.Access.check('can create content')) {
                this.add = true;
                this.model = new Mediakron.Models.Item();
                this.model.set('type', 'story');
            }
        } else {
            this.add = false;
            this.current = model;
            this.model = model;
            var annotations = {},
                annotationRelationships = this.model.getRelationship('annotations'),
                length = annotationRelationships.length,
                i = 0;
            for (i; i < length; i++) {
                annotations[annotationRelationships[i].uri] = annotationRelationships[i];
            }
            this.model.set('annotations', annotations);
        }
    },
    afterRender: function() {
        if (this.current) {
            if (this.model.get('uri') != this.current.get('uri')) {
                if (this.map.goFull) {
                    var item = this.current,
                        view1 = item.getView(),
                        $el = $('.item-view .item-contents');
                    view1.$el = $el;
                    view1.render();
                    view1.afterRender();
                } else {
                    $('.item-view').addClass('closed').removeClass('opened');
                }
            }
        }
        this.model.getSidebar(this.$el);
        Mediakron.App.Events.trigger('story:ready');

        /* fade main title on scroll  */
        $('#main-container').scroll(function() {
            $(".item-header-container h1.story-title")
                .css("opacity", 1 - $('#main-container').scrollTop() / 100);
        });

        /* Load accessible dropdown menu plugin  */
        accessibleNav();

    },
    gotoItem: function(item) {
        if (!item) {
            $('.story-overlay').addClass('closed').removeClass('opened');
            this.$el.removeClass('full');
            $('.story-overlay .item-contents').empty();
            this.overlayItem = false;
        } else {
            this.overlayItem = item;

        }
    },
    render: function() {
        if (this.layout) {
            this.template = JST['pages.story.' + this.layout];
            if (this.layout == 'comparison') {
                this.annotate = 'minimal';
            }
        } else if (this.model.get('template')) {
            this.template = JST['pages.story.' + this.model.get('template')];
        }

        var content = this.model.toJSON(),
            view = this, storyview = this;
        content.model = this.model;
        content.item = this.model;
        content.current = false;
        if (this.current) {
            content.current = this.current.get('uri');
        }

        require(["/mediakron/js/src/story/wysiwyg/parse.js"], function(Parser) {
            var parser = view.parser = new Parser();
            content.renderedHtml = parser.getObjectAndMakeHTML(content.body);
            view.$el.html(view.template(content));
            view.afterRender();
            if (!Mediakron.loading) {
                view.renderFeatures();
                view.renderCitations();
                view.renderTOC();
            } else {
                Mediakron.App.Events.on('load:complete', function() {
                    view.renderFeatures();
                    view.renderCitations();
                    view.renderTOC();
                });
            }
            var options = {
                model: view.model,
                $el: view.$el,
                parent: view,
                add: true,
                parser: parser
            };
            Mediakron.App.Events.on('story:render', function(data) {
                view.renderFeatures();
                view.renderCitations();
            });
            // overlay
            if (view.overlayItem) {
                var itemview = view.overlayItem.getView(),
                    $el = $('.story-overlay .item-contents');
                itemview.$el = $el;
                itemview.render();
                itemview.afterRender();
                view.$el.addClass('full');
                $('.story-overlay').addClass('opened').removeClass('closed');
            }

            if (view.model.canEdit() && view.add) {
                require(["src/story/edit.v2"], function(edit) {
                    view.editor = edit(options);
                    view.edit = true;
                    Mediakron.Status.linkDisable = true;
                    view.renderCitations();
                });
            }
            
            if (storyview.full){
                storyview.bindComments();
            }
        });

        return this;

    },

    bindComments: function(){
        var commentBound = false, view = this;
        if(!view.add) {
            require(["/mediakron/js/src/story/comment.js"], function (Comment) {
                if (!commentBound) {
                    commentBound = true;
                    Comment(view.model);

                }
            });
        }
    },

    renderTOC: function() {
        var $toc = $('<aside class="story-toc open" role="navigaton" aria-label="Story Contents"><span class="mk-icon mk-menu open-button" role="button"></span><div id="story-toc-content"><header><span class="mk-icon mk-menu"></span><span class="mk-icon mk-close" role="button"></span><span class="header-text sr-only"> Contents </span></header><ul>');

        if ($('.story-body h2').length) {
            $('.story-body', this.$el).before($toc);
            $('.contents-open-button').removeClass('hide');
            $('.story-template').addClass('toc-active');
        }

        $('.story-body h2', this.$el).each(function(e) {
            var el = $(this);
            var tocLine = $('<li>' + el.text() + '</li>');
            $('.story-toc ul').append(tocLine);

            tocLine.click(function() {
                $(this).siblings().removeClass("active");
                $(this).addClass("active");
                $('#main-container').animate({
                    scrollTop: $('#main-container').scrollTop() + el.offset().top - 100
                }, '700');
            });

        });

    },

    renderCitations: function() {
        // don't render citations if layout
        if (this.layout) return true;
        var annotations = {},
            getAnnotations = this.model.get('annotations'),
            renderedEl;
        var template = JST['story.annotation'];
        var view = this;
        $('cite').each(function(i, item) {
            var $item = $(item),
                id = $item.attr('annotation-id');
            $item.addClass('annotation annotation-' + id);
            if (getAnnotations){
                if (getAnnotations[id]) {
                    var attach = false;
                    if (getAnnotations[id].attachment) attach = Mediakron.getItemFromURI(getAnnotations[id].attachment);
                    renderedEl = template({
                        id: id,
                        uri: false,
                        item: attach,
                        model: view.model,
                        edit: view.edit,
                        title: getAnnotations[id].data.title,
                        annotation: getAnnotations[id].data.body
                    });
                } else {
                    renderedEl = template({
                        id: id,
                        uri: false,
                        item: false,
                        model: view.model,
                        edit: view.edit,
                        title: '',
                        annotation: ''
                    });
                }
                annotations[id] = renderedEl;
            }
        });

        this.renderCitationSidebar(annotations);


        /* Add a class to cite elements when they contain a sup */
        $("cite:has(sup)").addClass('contains-sup');

        /* Add a class to cite elements when they contain a sup */
        $("sup:has(cite)").addClass('contains-cite');

        var rollout;
        // bind a rollover action
        $('cite').off('mouseover');
        $('cite').each(function(i, item) {
            var $item = $(this),
                id = $item.attr('annotation-id'),
                pos = $item.position(),
                $html = $(annotations[id]);
            var over = false,
                on = false,
                controls = false;
            $item.on('mouseover', function() {
                console.log('over')
                over = true;
                $item.addClass('highlight');
                $('.annotation-item-' + id).addClass('highlight');
                if (annotations[id]) {
                    $('.annotation-popup', $item).remove();
                    $item.append($html);
                    var vert = $item.offset();
                    if (vert.top) {
                        if (vert.top < 200) {
                            $html.addClass('flip');
                        } else {
                            $html.removeClass('flip');
                        }
                    }
                    if (view.edit) {
                        controls = $('.annotation-controls', $item);
                    }
                    var offset = $item.inlineOffset();
                    $('.annotation-popup', $item).css({
                        top: offset.top - 20 + 'px'
                    });
                    $('.annotation-shadow', $item).css({
                        'width': offset.left + 10 + 'px',
                        'right': ((offset.left + 10) * -1) + 'px'
                    });

                    if (controls && !on) {
                        controls.css({
                            'left': offset.left + 'px',
                            'top': offset.top - 70 + 'px'
                        });
                        $('.remove-annotation', controls).click(function(e) {
                            view.removeCitation(e, view);
                        });
                        $('.edit-annotation', controls).click(function(e) {
                            view.editCitation(e);
                        });
                    }
                    on = true;
                    $html.show();
                    
                } else {
                    //$('.annotation-' + id).contents().unwrap();
                }

            });
            var popup = $('.annotation-popup', $item);
            popup.off('mouseover').off('mouseout');
            popup.on('mouseover', function() {
                over = true;
            });
            popup.on('mouseout', function() {
                over = false;
            });
            $item.off('mouseout');
            $item.on("mouseout", function(e) {
                over = false;
                var interval = setTimeout(function () {

                    if (!over) {
                        on = false;
                        $('.annotation-popup', $item).remove();
                        $item.removeClass('highlight');
                        $('.annotation-item-' + id).removeClass('highlight');
                        if (controls) {
                            controls.remove();
                        }
                    }
                }, 1000);
            });
            $('cite').on("click", function(e) {
                var $item = $(this),
                    id = $item.attr('annotation-id');
                $('.story-template').addClass('annotation-sidebar-open');
                $('cite').removeClass('highlight');
                $('.annotation-item').removeClass('highlight');
                $item.addClass('highlight');
                $('cite.annotation-' + id).addClass('highlight');
                $('.annotation-item-' + id).addClass('highlight');
                $('.annotation-sidebar').stop(true, false).animate({
                    scrollTop: $('.annotation-sidebar').scrollTop() + $('.annotation-item-' + id).offset().top - 130
                }, '200');
                
                /* Close comment's sidebar if open */
                $('.story-template').removeClass('comment-sidebar-open');
            });
        });
    },
    editCitation: function(e) {
        var uniqueId = $(e.currentTarget).attr('annotation-id');
        console.log(uniqueId)
        var annotationController = new this.editor.control.editor.wysiwyg.annotationAddController({
            'annotationId': uniqueId,
            'model': this.model,
            'callback': function() {
                // handle save
            }
        });
        var annotationPane = $('<div>');
        $('.story-edit-right-bind').append(annotationPane);
        annotationController.setElement(annotationPane);
        annotationController.render();
    },
    removeCitation: function(e, view) {        
        var $target = $(e.currentTarget),
            id = $target.attr('annotation-id');
        $('.annotation-sidebar .annotation-item-' + id).remove();
        var annotations = view.model.get('annotations');
        delete annotations[id];
        this.model.set('annotations', annotations);
        model.updateAnnotationRelationship();
        Mediakron.App.Events.trigger('story:render', {});
        $('.annotation-' + id).contents().unwrap();
        $('.annotation-popup').remove();
        $('.annotation-controls').remove();
    },
    renderCitationSidebar: function() {
        var template = JST['story.annotation.sidebar'];
        var view = this;
        var annotations = this.model.getRelationship('annotations');
        var $el = $('.annotation-sidebar');
        var html = template({
                annotations: annotations
            }),
            item;
        if (!$.isEmptyObject(annotations)) {
            $el.html(html);
            _.each(annotations, function(annotation) {
                if (annotation.attachment) {
                    if (annotation.attachment) {
                        item = Mediakron.getItemFromURI(annotation.attachment);
                        if (item) {
                            if (annotation.uri != view.model.get('uri')){
                                view = item.getView('tour');
                                view.setElement('#annotation-bind-' + annotation.uri);
                                view.render();
                                var itemType = item.getNormalType();
                                if (itemType != 'map') {
                                    view.afterRender();
                                }
                            }
                        }
                    }
                }
            });

            // Add note count to note button
            $('.notes-count').text("(" + annotations.length + ")");

            $('.open-annotations-sidebar').removeClass('hide');
            $('.story-template').addClass('annotations-present');

            /* Keep sidebar open until users close it  */
            if (localStorage.getItem('annotation-sidebar') == 'open') {
                $('.story-template').addClass('annotation-sidebar-open');
                $('.annotation-sidebar').removeClass('closed');
            }

            /* Keep Story Toc closed until users open it  */
            //          if(localStorage.getItem('story-toc') == 'open'){
            //            $('.story-toc').addClass('open');
            //          }

        }
        $('.annotation-item').click(function() {
            var $item = $(this),
                id = $item.attr('annotation-id');
            $('cite, sup.contains-cite').removeClass('highlight');
            $('.annotation-item').removeClass('highlight');
            $item.addClass('highlight');
            $('cite.annotation-' + id).addClass('highlight').parent(".contains-cite").addClass('highlight');
            //            $('cite.annotation-' + id).parent("contains-cite").addClass('highlight');
            $('#main-container').animate({
                scrollTop: $('#main-container').scrollTop() + $('cite.annotation-' + id).offset().top - 100
            }, '700');
        });

        $('.annotation-item a.open-overlay').click(function(e) {
            var $target = $(e.currentTarget);
            var uri = $target.attr('uri'),
                item = Mediakron.getItemFromURI(uri),
                controller = this;
            if (!item) return false;
            if (item.getNormalType() == 'timeline' || item.getNormalType() == 'map' || item.getNormalType() == 'story' || item.getNormalType() == 'slideshow' || item.getNormalType() == 'folder') {
                e.preventDefault();
                Mediakron.router.navigate(item.get('uri'), { trigger: true });
                return false;
            } else {
                e.preventDefault();
                var view = item.getView(),
                    $el = $('.story-overlay .item-contents');
                view.setElement($el);
                view.render();
                view.afterRender();
                view.$el.addClass('full');
                $('.story-overlay').addClass('opened').removeClass('closed');
                return false;
            }

        });
    },
    renderFeatures: function() {
        var view = this,
            model;
        $('figure').each(function(i, item) {
            var $item = $(item),
                uri = $item.attr('uri'),
                align = $item.attr('align'),
                rendered = $item.attr('render'),
                model = Mediakron.getItemFromURI(uri),
                id = $item.attr('id'),
                relationship = view.model.getChild(uri),
                caption = '';
            if (relationship.data) {
                if (relationship.data.caption) {
                    caption = relationship.data.caption;
                }
            }
            if (!model) {
                return true;
            }
            var type = model.getNormalType(),
                template = JST['story.' + type],
                identifier = model.getNormalType() + '-' + model.get('uri') + '-' + Math.floor((Math.random() * 100000) + 1),
                html = template({
                    model: model,
                    identifier: identifier,
                    caption: caption
                });
            $item.html(html);
            switch (type) {
                case 'image':
                    break;
                case 'video':
                    var video = model.get('video');
                    if (video.type == 'bc') {
                        var $iframe = $('iframe#iframe-for-' + model.get('uri')),
                            height = $iframe.height(),
                            width = $iframe.width(),
                            url = video.url;
                        if (url.indexOf('?') != -1) {
                            url = url + '&height=' + height + '&width=' + width;
                        } else {
                            url = url + '?height=' + height + '&width=' + width;
                        }
                        $iframe.attr('src', url);
                    }
                    model.loadVideo();
                    break;
                case 'audio':
                    model.loadAudio();
                    break;
                case 'text':
                    break;
                case 'slideshow':
                    setTimeout(function() {
                        $('#slideshow-' + uri).justifiedGallery({
                            lastRow: 'justify',
                            rowHeight: '150'
                        });
                    }, 500);
                    break;
                case 'file':
                    var file = model.get('text'),
                        filetype = file.type,
                        fileuri = model.get('uri');
                    if (filetype == 'pdf' || filetype == 'doc' || filetype == 'xls' || filetype == 'ppt') {
                        var $canvas = $('canvas', $item);
                        $canvas.empty();
                        var filename = file.url,
                            split = filename.split('.'),
                            last = split.length - 1,
                            ext = split[last],
                            previewFilename = filename.replace(ext, 'pdf');
                        PDFJS.getDocument(Mediakron.Settings.filepath + 'preview/' + previewFilename + '?ext=' + ext).then(function(pdf) {
                            // Using promise to fetch the page
                            view.numPages = pdf.numPages;
                            var $pages = $('.pages', view.$el);
                            view.canvas = $canvas[0];
                            view.context = view.canvas.getContext('2d');
                            view.pdf = pdf;
                            view.loadPage(1);
                        });
                    }
                    break;
                case 'map':
                    this.map = Mediakron.Maps.Theme(model, identifier, false, '400');
                    break;
                case 'timeline':
                    $('#' + identifier).timeline({
                        'model': model
                    });
                    if (this.zoom == 1) {
                        $('.zoomout').hide();
                    }
                    $('.popover').popover('hide');
                    break;
                case 'comparison':
                    this.map = Mediakron.Maps.Theme(model, identifier, false, '400');
                    break;
                case 'progression':
                    $('#' + identifier).progression({
                        'model': model
                    });
                    break;
            }
        });
        var windowWidth = $(window).width() + 5,
            offset = $('.story-body').offset();
        var left = false;
        if (offset) {
            left = (offset.left * -1) - 11;
            $('.alignFull').css({
                "width": windowWidth + 'px',
                "margin-left": left + 'px'
            });
        }
    },
    loadPage: function(number) {
        var view = this;
        this.page = number;
        this.pdf.getPage(number).then(function(page) {
            var scale = 1;
            var viewport = page.getViewport(scale);
            view.canvas.height = viewport.height;
            view.canvas.width = viewport.width;
            var renderContext = {
                canvasContext: view.context,
                viewport: viewport
            };
            page.render(renderContext);
        });
    },

    events: {
        'click a': Mediakron.linkHandle,
        'click #edit-story': 'startEdit',
        'click figure': 'openFigure',
        'click figure .slideshow-image': 'openFigure',
        'click figure .view-full-audio': 'openFigure',
        'click figure .view-full-video': 'openFigure',
        'click .close-story-overlay': 'cancel',
        'click .close-item-overlay': 'cancel',
        'click .overlay-bg': 'cancel',
        'click .close-annotation-sidebar': 'closeAnnotationsidebar',
        'click .open-annotations-sidebar': 'openAnnotationsidebar',
        'click .story-toc .mk-close': 'closeTOC',
        'click .story-toc .open-button': 'openTOC',
        'mouseover .comment-controls': 'commentsHighlighted',
        'mouseout .comment-controls': 'removeCommentsHighlighted'
    },
    expandEdit: function() {
        $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'false' });
        $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.edit-button').addClass('open');
        $('.button-secondary-options').removeClass('open');
    },
    collapseEdit: function() {
        $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.edit-button').removeClass('open');
        $('.button-secondary-options').removeClass('open');
    },
    expandSecondaryoptions: function() {
        $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'false' });
        $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.button-secondary-options').addClass('open');
        $('.edit-button').removeClass('open');
    },
    collapseSecondaryoptions: function() {
        $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.button-secondary-options').removeClass('open');
        $('.edit-button').removeClass('open');
    },
    cancel: function(e) {
        if (!this.add) {
            this.overlay = false;
            var $el = $('.story-overlay .item-contents');
            this.$el.removeClass('full');
            $('.story-overlay').removeClass('opened').addClass('closed');
            $el.empty();
            this.overlayItem = false;
        } else {
            e.preventDefault();
            if (this.edit) {
                var model = this.model;
            }
            if (Mediakron.Status.formChanged) {
                if (this.edit) {
                    var uri = this.model.get('uri');
                    text = "You have unsaved changes on this form.  Are you sure you want to cancel?";
                    accept = function(request) {
                        Mediakron.Status.formChanged = false;
                        Mediakron.Status.linkDisable = false;
                        Mediakron.App.Events.trigger('content:edit:cancel', {
                            model: this.model
                        });
                        Mediakron.controller.gotoLast();
                    };
                    reject = function(request) {};
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
                } else {
                    text = "You have unsaved changes on this form.  Are you sure you want to cancel?";
                    accept = function(request) {
                        Mediakron.Status.formChanged = false;
                        Mediakron.Status.linkDisable = false;
                        Mediakron.App.Events.trigger('content:create:cancel');
                        Mediakron.controller.gotoLast();
                    };
                    reject = function(request) {};
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
                }
            } else {
                if (this.edit) {
                    Mediakron.App.Events.trigger('content:edit:cancel', {
                        model: this.model
                    });
                    Mediakron.Status.linkDisable = false;
                    Mediakron.controller.gotoLast();
                } else {
                    Mediakron.App.Events.trigger('content:create:cancel');
                    Mediakron.Status.linkDisable = false;
                    Mediakron.router.back();
                }
            }
            return false;
        }
    },
    openFigure: function(e) {
        if (this.edit) return false;
        var $target = $(e.currentTarget);
        if (($target.hasClass('type-image') || $target.hasClass('type-file') || $target.hasClass('view-full-audio') || $target.hasClass('view-full-video')) && !this.edit) {
            var uri = $target.attr('uri'),
                item = Mediakron.getItemFromURI(uri),
                controller = this;
            if (!item) return false;
            var view = item.getView(),
                $el = $('.story-overlay .item-contents');
            view.setElement($el);
            view.render();
            view.afterRender();
            if ($target.hasClass('slideshow-image')) {
                var previous = $target.prev(),
                    next = $target.next();
                $('.slideshow-previous').hide();
                $('.slideshow-next').hide();
                if (previous.length > 0) {
                    var previousItem = Mediakron.getItemFromURI(previous.attr('uri'));
                    $('.slideshow-previous').show().one('click', function() {
                        previous.click();
                    });
                    $('.slideshow-previous .navigation-slideshow').text('Previous: ' + previousItem.get('title'));
                }
                if (next.length > 0) {
                    var nextItem = Mediakron.getItemFromURI(next.attr('uri'));
                    $('.slideshow-next').show().one('click', function() {
                        next.click();
                    });
                    $('.slideshow-next .navigation-slideshow').text('Next: ' + nextItem.get('title'));
                }
            }
            this.$el.addClass('full');
            $('.story-overlay').addClass('opened').removeClass('closed');
        }
    },
    closeAnnotationsidebar: function(e) {
        $('.story-template').removeClass('annotation-sidebar-open');
        localStorage.removeItem('annotation-sidebar', 'open');
    },
    openAnnotationsidebar: function(e) {
        $('.story-template').addClass('annotation-sidebar-open');
        localStorage.setItem('annotation-sidebar', 'open');
        $('.story-template').removeClass('comment-sidebar-open');
    },
    closeTOC: function(e) {
        $('.story-toc').toggleClass('open');
        //        localStorage.removeItem('story-toc','open');
    },
    openTOC: function(e) {
        $('.story-toc').toggleClass('open');
        //        localStorage.setItem('story-toc','open');
    },
    commentsHighlighted:function(){
        $('.comment').addClass('commentControls-highlight');
    },
    removeCommentsHighlighted:function(){
        $('.comment').removeClass('commentControls-highlight');
    },

    startEdit: function(e) {
        var view = this;
        if (this.model.canEdit()) {
            require(["/mediakron/js/src/story/wysiwyg/parse.js"], function(Parser) {
                var parser = view.parser = new Parser();
                var options = {
                    model: view.model,
                    $el: view.$el,
                    parent: view,
                    add: false,
                    parser: parser
                };
                require(["src/story/edit.v2"], function(edit) {
                    view.editor = edit(options);
                    view.edit = true;
                    Mediakron.Status.linkDisable = true;
                    view.renderCitations();
                    view.renderTOC();
                    Mediakron.App.Events.trigger('comment:edit');
                });
            });
            $('.main-content').addClass('editing-enabled');
            $('.story-template').removeClass('comment-sidebar-open');/* close comments sidebar if open */
            Mediakron.hideNextPrev();
        }
    }
});
/*
 * Justified Gallery - v3.5.4
 * http://miromannino.com/projects/justified-gallery/
 * Copyright (c) 2014 Miro Mannino
 * Licensed under the MIT license.
 */
(function($) {
    /* Events
        jg.complete : called when all the gallery has been created
        jg.resize : called when the gallery has been resized
      */
    $.fn.justifiedGallery = function(arg) {
        // Default options
        var defaults = {
            sizeRangeSuffixes: {
                'lt100': '',
                // e.g. Flickr uses '_t'
                'lt240': '',
                // e.g. Flickr uses '_m' 
                'lt320': '',
                // e.g. Flickr uses '_n' 
                'lt500': '',
                // e.g. Flickr uses '' 
                'lt640': '',
                // e.g. Flickr uses '_z'
                'lt1024': '',
                // e.g. Flickr uses '_b'
            },
            rowHeight: 120,
            maxRowHeight: 0,
            // negative value = no limits, 0 = 1.5 * rowHeight
            margins: 1,
            border: -1,
            // negative value = same as margins, 0 = disabled
            lastRow: 'nojustify',
            // or can be 'justify' or 'hide'
            justifyThreshold: 0.75,
            /* if row width / available space > 0.75 it will be always justified 
                                              (i.e. lastRow setting is not considered) */
            fixedHeight: false,
            waitThumbnailsLoad: true,
            captions: true,
            cssAnimation: false,
            imagesAnimationDuration: 500,
            // ignored with css animations
            captionSettings: { // ignored with css animations
                animationDuration: 500,
                visibleOpacity: 0.7,
                nonVisibleOpacity: 0.0
            },
            rel: null,
            // rewrite the rel of each analyzed links
            target: null,
            // rewrite the target of all links
            extension: /\.[^.\\/]+$/,
            refreshTime: 100,
            randomize: false
        };

        function getSuffix(width, height, context) {
            var longestSide;
            longestSide = (width > height) ? width : height;
            if (longestSide <= 100) {
                return context.settings.sizeRangeSuffixes.lt100;
            } else if (longestSide <= 240) {
                return context.settings.sizeRangeSuffixes.lt240;
            } else if (longestSide <= 320) {
                return context.settings.sizeRangeSuffixes.lt320;
            } else if (longestSide <= 500) {
                return context.settings.sizeRangeSuffixes.lt500;
            } else if (longestSide <= 640) {
                return context.settings.sizeRangeSuffixes.lt640;
            } else {
                return context.settings.sizeRangeSuffixes.lt1024;
            }
        }

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        function removeSuffix(str, suffix) {
            return str.substring(0, str.length - suffix.length);
        }

        function getUsedSuffix(str, context) {
            var voidSuffix = false;
            for (var si in context.settings.sizeRangeSuffixes) {
                if (context.settings.sizeRangeSuffixes[si].length === 0) {
                    voidSuffix = true;
                    continue;
                }
                if (endsWith(str, context.settings.sizeRangeSuffixes[si])) {
                    return context.settings.sizeRangeSuffixes[si];
                }
            }
            if (voidSuffix) return "";
            else throw 'unknown suffix for ' + str;
        }
        /* Given an image src, with the width and the height, returns the new image src with the
               best suffix to show the best quality thumbnail. */
        function newSrc(imageSrc, imgWidth, imgHeight, context) {
            var matchRes = imageSrc.match(context.settings.extension);
            var ext = (matchRes !== null) ? matchRes[0] : '';
            var newImageSrc = imageSrc.replace(context.settings.extension, '');
            newImageSrc = removeSuffix(newImageSrc, getUsedSuffix(newImageSrc, context));
            newImageSrc += getSuffix(imgWidth, imgHeight, context) + ext;
            return newImageSrc;
        }

        function onEntryMouseEnterForCaption(ev) {
            var $caption = $(ev.currentTarget).find('.caption');
            if (ev.data.settings.cssAnimation) {
                $caption.addClass('caption-visible').removeClass('caption-hidden');
            } else {
                $caption.stop().fadeTo(ev.data.settings.captionSettings.animationDuration, ev.data.settings.captionSettings.visibleOpacity);
            }
        }

        function onEntryMouseLeaveForCaption(ev) {
            var $caption = $(ev.currentTarget).find('.caption');
            if (ev.data.settings.cssAnimation) {
                $caption.removeClass('caption-visible').removeClass('caption-hidden');
            } else {
                $caption.stop().fadeTo(ev.data.settings.captionSettings.animationDuration, ev.data.settings.captionSettings.nonVisibleOpacity);
            }
        }

        function showImg($entry, callback, context) {
            if (context.settings.cssAnimation) {
                $entry.addClass('entry-visible');
                callback();
            } else {
                $entry.stop().fadeTo(context.settings.imagesAnimationDuration, 1.0, callback);
            }
        }

        function hideImgImmediately($entry, context) {
            if (context.settings.cssAnimation) {
                $entry.removeClass('entry-visible');
            } else {
                $entry.stop().fadeTo(0, 0);
            }
        }

        function imgFromEntry($entry) {
            var $img = $entry.find('> img');
            if ($img.length === 0) $img = $entry.find('> a > img');
            return $img;
        }

        function displayEntry($entry, x, y, imgWidth, imgHeight, rowHeight, context) {
            var $image = imgFromEntry($entry);
            $image.css('width', imgWidth);
            $image.css('height', imgHeight);
            //if ($entry.get(0) === $image.parent().get(0)) { // this creates an error in link_around_img test
            $image.css('margin-left', -imgWidth / 2);
            $image.css('margin-top', -imgHeight / 2);
            //}
            $entry.width(imgWidth);
            $entry.height(rowHeight);
            $entry.css('top', y);
            $entry.css('left', x);
            // Image reloading for an high quality of thumbnails
            var imageSrc = $image.attr('src');
            var newImageSrc = newSrc(imageSrc, imgWidth, imgHeight, context);
            $image.one('error', function() {
                $image.attr('src', $image.data('jg.originalSrc')); //revert to the original thumbnail, we got it.
            });

            function loadNewImage() {
                if (imageSrc !== newImageSrc) { //load the new image after the fadeIn
                    $image.attr('src', newImageSrc);
                }
            }
            if ($image.data('jg.loaded') === 'skipped') {
                onImageEvent(imageSrc, function() {
                    showImg($entry, loadNewImage, context);
                    $image.data('jg.loaded', true);
                });
            } else {
                showImg($entry, loadNewImage, context);
            }
            // Captions ------------------------------
            var captionMouseEvents = $entry.data('jg.captionMouseEvents');
            if (context.settings.captions === true) {
                var $imgCaption = $entry.find('.caption');
                if ($imgCaption.length === 0) { // Create it if it doesn't exists
                    var caption = $image.attr('alt');
                    if (typeof caption === 'undefined') caption = $entry.attr('title');
                    if (typeof caption !== 'undefined') { // Create only we found something
                        $imgCaption = $('<div class="caption">' + caption + '</div>');
                        $entry.append($imgCaption);
                    }
                }
                // Create events (we check again the $imgCaption because it can be still inexistent)
                if ($imgCaption.length !== 0) {
                    if (!context.settings.cssAnimation) {
                        $imgCaption.stop().fadeTo(context.settings.imagesAnimationDuration, context.settings.captionSettings.nonVisibleOpacity);
                    }
                    if (typeof captionMouseEvents === 'undefined') {
                        captionMouseEvents = {
                            mouseenter: onEntryMouseEnterForCaption,
                            mouseleave: onEntryMouseLeaveForCaption
                        };
                        $entry.on('mouseenter', undefined, context, captionMouseEvents.mouseenter);
                        $entry.on('mouseleave', undefined, context, captionMouseEvents.mouseleave);
                        $entry.data('jg.captionMouseEvents', captionMouseEvents);
                    }
                }
            } else {
                if (typeof captionMouseEvents !== 'undefined') {
                    $entry.off('mouseenter', undefined, context, captionMouseEvents.mouseenter);
                    $entry.off('mouseleave', undefined, context, captionMouseEvents.mouseleave);
                    $entry.removeData('jg.captionMouseEvents');
                }
            }
        }

        function prepareBuildingRow(context, isLastRow) {
            var settings = context.settings;
            var i, $entry, $image, imgAspectRatio, newImgW, newImgH, justify = true;
            var minHeight = 0;
            var availableWidth = context.galleryWidth - 2 * context.border - ((context.buildingRow.entriesBuff.length - 1) * settings.margins);
            var rowHeight = availableWidth / context.buildingRow.aspectRatio;
            var justificable = context.buildingRow.width / availableWidth > settings.justifyThreshold;
            //Skip the last row if we can't justify it and the lastRow == 'hide'
            if (isLastRow && settings.lastRow === 'hide' && !justificable) {
                for (i = 0; i < context.buildingRow.entriesBuff.length; i++) {
                    $entry = context.buildingRow.entriesBuff[i];
                    if (settings.cssAnimation) $entry.removeClass('entry-visible');
                    else $entry.stop().fadeTo(0, 0);
                }
                return -1;
            }
            // With lastRow = nojustify, justify if is justificable (the images will not become too big)
            if (isLastRow && !justificable && settings.lastRow === 'nojustify') justify = false;
            for (i = 0; i < context.buildingRow.entriesBuff.length; i++) {
                $image = imgFromEntry(context.buildingRow.entriesBuff[i]);
                imgAspectRatio = $image.data('jg.imgw') / $image.data('jg.imgh');
                if (justify) {
                    newImgW = (i === context.buildingRow.entriesBuff.length - 1) ? availableWidth : rowHeight * imgAspectRatio;
                    newImgH = rowHeight;
                    /* With fixedHeight the newImgH must be greater than rowHeight. 
                              In some cases here this is not satisfied (due to the justification).
                              But we comment it, because is better to have a shorter but justified row instead 
                              to have a cropped image at the end. */
                    /*if (settings.fixedHeight && newImgH < settings.rowHeight) {
                                newImgW = settings.rowHeight * imgAspectRatio;
                                newImgH = settings.rowHeight;
                              }*/
                } else {
                    newImgW = settings.rowHeight * imgAspectRatio;
                    newImgH = settings.rowHeight;
                }
                availableWidth -= Math.round(newImgW);
                $image.data('jg.jimgw', Math.round(newImgW));
                $image.data('jg.jimgh', Math.ceil(newImgH));
                if (i === 0 || minHeight > newImgH) minHeight = newImgH;
            }
            if (settings.fixedHeight && minHeight > settings.rowHeight) minHeight = settings.rowHeight;
            return {
                minHeight: minHeight,
                justify: justify
            };
        }

        function rewind(context) {
            context.lastAnalyzedIndex = -1;
            context.buildingRow.entriesBuff = [];
            context.buildingRow.aspectRatio = 0;
            context.buildingRow.width = 0;
            context.offY = context.border;
        }

        function flushRow(context, isLastRow) {
            var settings = context.settings;
            var $entry, $image, minHeight, buildingRowRes, offX = context.border;
            buildingRowRes = prepareBuildingRow(context, isLastRow);
            minHeight = buildingRowRes.minHeight;
            if (isLastRow && settings.lastRow === 'hide' && minHeight === -1) {
                context.buildingRow.entriesBuff = [];
                context.buildingRow.aspectRatio = 0;
                context.buildingRow.width = 0;
                return;
            }
            if (settings.maxRowHeight > 0 && settings.maxRowHeight < minHeight) minHeight = settings.maxRowHeight;
            else if (settings.maxRowHeight === 0 && (1.5 * settings.rowHeight) < minHeight) minHeight = 1.5 * settings.rowHeight;
            for (var i = 0; i < context.buildingRow.entriesBuff.length; i++) {
                $entry = context.buildingRow.entriesBuff[i];
                $image = imgFromEntry($entry);
                displayEntry($entry, offX, context.offY, $image.data('jg.jimgw'), $image.data('jg.jimgh'), minHeight, context);
                offX += $image.data('jg.jimgw') + settings.margins;
            }
            //Gallery Height
            context.$gallery.height(context.offY + minHeight + context.border + (context.spinner.active ? context.spinner.$el.innerHeight() : 0));
            if (!isLastRow || (minHeight <= context.settings.rowHeight && buildingRowRes.justify)) {
                //Ready for a new row
                context.offY += minHeight + context.settings.margins;
                context.buildingRow.entriesBuff = []; //clear the array creating a new one
                context.buildingRow.aspectRatio = 0;
                context.buildingRow.width = 0;
                context.$gallery.trigger('jg.rowflush');
            }
        }

        function checkWidth(context) {
            context.checkWidthIntervalId = setInterval(function() {
                var galleryWidth = parseInt(context.$gallery.width(), 10);
                if (context.galleryWidth !== galleryWidth) {
                    context.galleryWidth = galleryWidth;
                    rewind(context);
                    // Restart to analyze
                    startImgAnalyzer(context, true);
                }
            }, context.settings.refreshTime);
        }

        function startLoadingSpinnerAnimation(spinnerContext) {
            clearInterval(spinnerContext.intervalId);
            spinnerContext.intervalId = setInterval(function() {
                if (spinnerContext.phase < spinnerContext.$points.length) spinnerContext.$points.eq(spinnerContext.phase).fadeTo(spinnerContext.timeslot, 1);
                else spinnerContext.$points.eq(spinnerContext.phase - spinnerContext.$points.length).fadeTo(spinnerContext.timeslot, 0);
                spinnerContext.phase = (spinnerContext.phase + 1) % (spinnerContext.$points.length * 2);
            }, spinnerContext.timeslot);
        }

        function stopLoadingSpinnerAnimation(spinnerContext) {
            clearInterval(spinnerContext.intervalId);
            spinnerContext.intervalId = null;
        }

        function stopImgAnalyzerStarter(context) {
            context.yield.flushed = 0;
            if (context.imgAnalyzerTimeout !== null) clearTimeout(context.imgAnalyzerTimeout);
        }

        function startImgAnalyzer(context, isForResize) {
            stopImgAnalyzerStarter(context);
            context.imgAnalyzerTimeout = setTimeout(function() {
                analyzeImages(context, isForResize);
            }, 0.001);
            analyzeImages(context, isForResize);
        }

        function analyzeImages(context, isForResize) { /* The first row */
            var settings = context.settings;
            var isLastRow;
            for (var i = context.lastAnalyzedIndex + 1; i < context.entries.length; i++) {
                var $entry = $(context.entries[i]);
                var $image = imgFromEntry($entry);
                if ($image.data('jg.loaded') === true || $image.data('jg.loaded') === 'skipped') {
                    isLastRow = i >= context.entries.length - 1;
                    var availableWidth = context.galleryWidth - 2 * context.border - ((context.buildingRow.entriesBuff.length - 1) * settings.margins);
                    var imgAspectRatio = $image.data('jg.imgw') / $image.data('jg.imgh');
                    if (availableWidth / (context.buildingRow.aspectRatio + imgAspectRatio) < settings.rowHeight) {
                        flushRow(context, isLastRow);
                        if (++context.yield.flushed >= context.yield.every) {
                            startImgAnalyzer(context, isForResize);
                            return;
                        }
                    }
                    context.buildingRow.entriesBuff.push($entry);
                    context.buildingRow.aspectRatio += imgAspectRatio;
                    context.buildingRow.width += imgAspectRatio * settings.rowHeight;
                    context.lastAnalyzedIndex = i;
                } else if ($image.data('jg.loaded') !== 'error') {
                    return;
                }
            }
            // Last row flush (the row is not full)
            if (context.buildingRow.entriesBuff.length > 0) flushRow(context, true);
            if (context.spinner.active) {
                context.spinner.active = false;
                context.$gallery.height(context.$gallery.height() - context.spinner.$el.innerHeight());
                context.spinner.$el.detach();
                stopLoadingSpinnerAnimation(context.spinner);
            }
            /* Stop, if there is, the timeout to start the analyzeImages.
                      This is because an image can be set loaded, and the timeout can be set,
                      but this image can be analyzed yet. 
                  */
            stopImgAnalyzerStarter(context);
            //On complete callback
            if (!isForResize) context.$gallery.trigger('jg.complete');
            else context.$gallery.trigger('jg.resize');
        }

        function checkSettings(context) {
            var settings = context.settings;

            function checkSuffixesRange(range) {
                if (typeof settings.sizeRangeSuffixes[range] !== 'string') throw 'sizeRangeSuffixes.' + range + ' must be a string';
            }

            function checkOrConvertNumber(parent, settingName) {
                if (typeof parent[settingName] === 'string') {
                    parent[settingName] = parseFloat(parent[settingName], 10);
                    if (isNaN(parent[settingName])) throw 'invalid number for ' + settingName;
                } else if (typeof parent[settingName] === 'number') {
                    if (isNaN(parent[settingName])) throw 'invalid number for ' + settingName;
                } else {
                    throw settingName + ' must be a number';
                }
            }
            if (typeof settings.sizeRangeSuffixes !== 'object') throw 'sizeRangeSuffixes must be defined and must be an object';
            checkSuffixesRange('lt100');
            checkSuffixesRange('lt240');
            checkSuffixesRange('lt320');
            checkSuffixesRange('lt500');
            checkSuffixesRange('lt640');
            checkSuffixesRange('lt1024');
            checkOrConvertNumber(settings, 'rowHeight');
            checkOrConvertNumber(settings, 'maxRowHeight');
            if (settings.maxRowHeight > 0 && settings.maxRowHeight < settings.rowHeight) {
                settings.maxRowHeight = settings.rowHeight;
            }
            checkOrConvertNumber(settings, 'margins');
            checkOrConvertNumber(settings, 'border');
            if (settings.lastRow !== 'nojustify' && settings.lastRow !== 'justify' && settings.lastRow !== 'hide') {
                throw 'lastRow must be "nojustify", "justify" or "hide"';
            }
            checkOrConvertNumber(settings, 'justifyThreshold');
            if (settings.justifyThreshold < 0 || settings.justifyThreshold > 1) throw 'justifyThreshold must be in the interval [0,1]';
            if (typeof settings.cssAnimation !== 'boolean') {
                throw 'cssAnimation must be a boolean';
            }
            checkOrConvertNumber(settings.captionSettings, 'animationDuration');
            checkOrConvertNumber(settings, 'imagesAnimationDuration');
            checkOrConvertNumber(settings.captionSettings, 'visibleOpacity');
            if (settings.captionSettings.visibleOpacity < 0 || settings.captionSettings.visibleOpacity > 1) throw 'captionSettings.visibleOpacity must be in the interval [0, 1]';
            checkOrConvertNumber(settings.captionSettings, 'nonVisibleOpacity');
            if (settings.captionSettings.visibleOpacity < 0 || settings.captionSettings.visibleOpacity > 1) throw 'captionSettings.nonVisibleOpacity must be in the interval [0, 1]';
            if (typeof settings.fixedHeight !== 'boolean') {
                throw 'fixedHeight must be a boolean';
            }
            if (typeof settings.captions !== 'boolean') {
                throw 'captions must be a boolean';
            }
            checkOrConvertNumber(settings, 'refreshTime');
            if (typeof settings.randomize !== 'boolean') {
                throw 'randomize must be a boolean';
            }
        }

        function onImageEvent(imageSrc, onLoad, onError) {
            if (!onLoad && !onError) {
                return;
            }
            /* Check if the image is loaded or not using another image object.
                   We cannot use the 'complete' image property, because some browsers,
                   with a 404 set complete = true */
            var memImage = new Image();
            var $memImage = $(memImage);
            if (onLoad) {
                $memImage.one('load', function() {
                    $memImage.off('load error');
                    onLoad(memImage);
                });
            }
            if (onError) {
                $memImage.one('error', function() {
                    $memImage.off('load error');
                    onError(memImage);
                });
            }
            memImage.src = imageSrc;
        }
        return this.each(function(index, gallery) {
            var $gallery = $(gallery);
            $gallery.addClass('justified-gallery');
            var context = $gallery.data('jg.context');
            if (typeof context === 'undefined') {
                if (typeof arg !== 'undefined' && arg !== null && typeof arg !== 'object') throw 'The argument must be an object';
                // Spinner init
                var $spinner = $('<div class="spinner"><span></span><span></span><span></span></div>');
                var extendedSettings = $.extend({}, defaults, arg);
                var border = extendedSettings.border >= 0 ? extendedSettings.border : extendedSettings.margins;
                //Context init
                context = {
                    settings: extendedSettings,
                    imgAnalyzerTimeout: null,
                    entries: null,
                    buildingRow: {
                        entriesBuff: [],
                        width: 0,
                        aspectRatio: 0
                    },
                    lastAnalyzedIndex: -1,
                    yield: {
                        every: 2,
                        /* do a flush every context.yield.every flushes (
                         * must be greater than 1, else the analyzeImages will loop */
                        flushed: 0 //flushed rows without a yield
                    },
                    border: border,
                    offY: border,
                    spinner: {
                        active: false,
                        phase: 0,
                        timeslot: 150,
                        $el: $spinner,
                        $points: $spinner.find('span'),
                        intervalId: null
                    },
                    checkWidthIntervalId: null,
                    galleryWidth: $gallery.width(),
                    $gallery: $gallery
                };
                $gallery.data('jg.context', context);
            } else if (arg === 'norewind') {
                /* Hide the image of the buildingRow to prevent strange effects when the row will be
                           re-justified again */
                for (var i = 0; i < context.buildingRow.entriesBuff.length; i++) {
                    hideImgImmediately(context.buildingRow.entriesBuff[i], context);
                }
                // In this case we don't rewind, and analyze all the images
            } else {
                context.settings = $.extend({}, context.settings, arg);
                context.border = context.settings.border >= 0 ? context.settings.border : context.settings.margins;
                rewind(context);
            }
            checkSettings(context);
            context.entries = $gallery.find('> a, > div:not(.spinner)').toArray();
            if (context.entries.length === 0) return;
            // Randomize
            if (context.settings.randomize) {
                context.entries.sort(function() {
                    return Math.random() * 2 - 1;
                });
                $.each(context.entries, function() {
                    $(this).appendTo($gallery);
                });
            }
            var imagesToLoad = false;
            var skippedImages = false;
            $.each(context.entries, function(index, entry) {
                var $entry = $(entry);
                var $image = imgFromEntry($entry);
                $entry.addClass('jg-entry');
                if ($image.data('jg.loaded') !== true && $image.data('jg.loaded') !== 'skipped') {
                    // Link Rel global overwrite
                    if (context.settings.rel !== null) $entry.attr('rel', context.settings.rel);
                    // Link Target global overwrite
                    if (context.settings.target !== null) $entry.attr('target', context.settings.target);
                    // Image src
                    var imageSrc = (typeof $image.data('safe-src') !== 'undefined') ? $image.data('safe-src') : $image.attr('src');
                    $image.data('jg.originalSrc', imageSrc);
                    $image.attr('src', imageSrc);
                    var width = parseInt($image.attr('width'), 10);
                    var height = parseInt($image.attr('height'), 10);
                    if (context.settings.waitThumbnailsLoad !== true && !isNaN(width) && !isNaN(height)) {
                        $image.data('jg.imgw', width);
                        $image.data('jg.imgh', height);
                        $image.data('jg.loaded', 'skipped');
                        skippedImages = true;
                        startImgAnalyzer(context, false);
                        return true;
                    }
                    $image.data('jg.loaded', false);
                    imagesToLoad = true;
                    // Spinner start
                    if (context.spinner.active === false) {
                        context.spinner.active = true;
                        $gallery.append(context.spinner.$el);
                        $gallery.height(context.offY + context.spinner.$el.innerHeight());
                        startLoadingSpinnerAnimation(context.spinner);
                    }
                    onImageEvent(imageSrc, function imgLoaded(loadImg) {
                        $image.data('jg.imgw', loadImg.width);
                        $image.data('jg.imgh', loadImg.height);
                        $image.data('jg.loaded', true);
                        startImgAnalyzer(context, false);
                    }, function imgLoadError() {
                        $image.data('jg.loaded', 'error');
                        startImgAnalyzer(context, false);
                    });
                }
            });
            if (!imagesToLoad && !skippedImages) startImgAnalyzer(context, false);
            checkWidth(context);
        });
    };
}(jQuery));