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