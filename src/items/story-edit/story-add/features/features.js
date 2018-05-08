define(
    "/mediakron/js/src/story/features/features.js", 
    [
        "/mediakron/js/src/story/wysiwyg/selection.js",
        'text!src/story/features/add.html',
        'text!src/story/features/image.html',
        'text!src/story/features/audio.html',
        'text!src/story/features/video.html',
        'text!src/story/features/file.html',
        'text!src/story/features/slideshow.html',
        'text!src/story/features/map.html',
        'text!src/story/features/figurehelp.html'
    ],  
    function(selection, addTemplate, imageTemplate, audioTemplate, videoTemplate, fileTemplate, slideshowTemplate, mapTemplate, helpTextTemplate) {
        var features = function($root, tracking, story) {
            this.$root = $root;
            this.view = false;
            this.$el = $('.story-edit-left-bind');
            this.addTemplate = _.template(addTemplate);
            this.$root.before(this.$el);
            this.$el.html(this.addTemplate());
            this.tracking = tracking;
            this.selection = selection;
            this.$add = $('.story-add');
            this.story = story;
            this.helpTextTemplate = _.template(helpTextTemplate);
            this.toggleAdd().bind();
            this.featureSelect = false;
        };
    
        
            
        
    features.prototype = {
        toggleAdd: function(){
            var view = this;
            Mediakron.App.Events.on('wysiwyg:event', function(data){
                view.tracking = data.tracking;
                var text = '',
                    focus = view.selection.selection.focusNode,
                    top = 0;
                view.selection.saveRange(true);
                if(focus){
                    focus = $(focus);
                    if(focus.offset().top){
                        top = focus.offset().top;
                    }
                    text = focus.text();
                }
                view.$add.css({
                    top: (top - view.$el.offset().top) + 'px'
                });
                if(!text){
                    view.$add.show();
                }else{
                    view.$add.hide();
                }
            });
            return this;
        },
        bind: function(){
            
            var view = this;
            $('.add-button',view.$add).click(function(e){ view.showAdd(e); });
            $('.filter-browse',view.$add).keyup(function(e){ view.filterBrowse(e); });
            $('.story-add-button',view.$add).click(function(e){ view.addTo(e); });
            $('figure',view.$root).mouseenter(function(e){ view.hoverOverFigure(e); });
            $('figure',view.$root).click(function(e){ view.clickFigure(e); });
            $('.close-story-button',view.$add).click(function(e){ view.showAdd(e); });
            $('.story-add-bg',view.$add).click(function(e){ view.showAdd(e); });
            $('.add-new',view.$add).click(function(e){ view.showAdds(e); });
            $('.add-existing',view.$add).click(function(e){ view.showBrowses(e); });
            
            Mediakron.App.Events.on('story:dropped',function(data){
              Mediakron.App.Events.trigger('story:render');
              $('figure',view.$root).mouseenter(function(e){ view.hoverOverFigure(e); });
            });
            
            return this;
        },
        clickFigure: function(e) {
            //this.hoverOverFigure(e);
            var $target = $(e.currentTarget);
            this.featureSelect = $target;
            $target.addClass('selected');
            Mediakron.App.Events.trigger('story:featureselect', $target);
        },
        hoverOverFigure: function(e){
            if(!this.inCaption){
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
                Mediakron.App.Events.on('story:dragging',function(){
                  $helpText.hide();
                });
                $target.mouseleave(function(e){
                    if(!view.inCaption){
                        $helpText.remove();
                    }
                    $('.figure-caption',$target).show();
                });
                $('.figure-button', $helpText).click(function(e) {
                    var $action = $(e.currentTarget),
                        figure, action = $action.attr('class-tag'), returnPath = Backbone.history.getFragment();
                    if (action == 'edit') {
                        figure = $target;
                        if (item) {
                            url = item.editURL();
                            Mediakron.controller.gotoCallback = function() {
                                Mediakron.controller.closeAdmin();
                                Mediakron.router.navigate(returnPath);
                                Mediakron.App.Events.trigger('story:render',{});
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
                        figure.attr('style', '').removeClass(classes).addClass(action).attr('align',action);
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
                    Mediakron.App.Events.trigger('story:captionedit', {});
                    view.inCaption = true;
                });
                $('.caption-edit', $helpText).blur(function(e) {
                    var val = $(e.currentTarget).val();
                    $('.figure-caption', $target).text(val);
                    Mediakron.App.Events.trigger('story:captionexit', {});
                    view.inCaption = false;
                    $helpText.remove();
                    $('.figure-caption',$target).show();
                });
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
        
        showAdd: function(e) {
            $('.add-items').toggleClass('is-visible');
            $('.story-content').toggleClass('story-add-content');
            $('.story-add-bg').toggleClass('is-visible');
            
            $('.story-add-type .add-new-content').addClass('hide');
            $('.story-add-type .add-existing-content').removeClass('hide');
            $('.add-new').removeClass('is-active');
            $('.add-existing').addClass('is-active');
            var type = $(e.currentTarget).attr('data-type');
            if(this.view){
                this.view.remove();
                
            }
            
            if (this.initAdd) {
                
                if(!type) type = 'image';
                var items = Mediakron.items.filter(function(item) {
                        normalType = item.getNormalType();
                        if (!item.get('published')) return false;
                        if (normalType !== type) return false;
                        return true;
                    }),
                    $bind = $('#story-add-'+type+' .browse ul');
                this.initAdd = false;
                this.drawBrowse($bind, items);
            }
        },
        
        
        showAdds: function(e) {
            $('.story-add-type .add-existing-content').addClass('hide');
            $('.story-add-type .add-new-content').removeClass('hide');
            $('.add-existing').removeClass('is-active');
            $('.add-new').addClass('is-active');
            var type = $(e.currentTarget).attr('data-type');
            $('#story-add-'+type+' .add-new-content').append('<div class="bindAdd"></div>');
            if(this.view){ 
                this.view.remove();
            }
            this.view = false;
            switch(type){
                case 'image':
                    this.view = new AddImage(this);
                    break;
                case 'video':
                    this.view = new AddVideo(this);
                    break;
                case 'audio':
                    this.view = new AddAudio(this);
                    break;
                case 'file':
                    this.view = new AddFile(this);
                    break;
                case 'slideshow':
                    this.view = new AddSlideshow(this);
                    break;
                case 'map':
                    this.view = new AddMap(this);
                    break;
            }
            
            this.view.setElement('#story-add-'+type+' .add-new-content .bindAdd');
            this.view.render();
        },
        showBrowses: function(e) {
            $('.story-add-type .add-new-content').addClass('hide');
            $('.story-add-type .add-existing-content').removeClass('hide');
            $('.add-new').removeClass('is-active');
            $('.add-existing').addClass('is-active');
            var type = $(e.currentTarget).attr('data-type');
            if(this.view){ 
                this.view.remove();
            }
            var items = Mediakron.items.filter(function(item) {
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
            var view = this, name = this.guidGenerator();
            var feature = $(item.getFeature('alignCol'));
            feature.attr('name', name);
            feature.addClass('mk-' + name);
            this.selection.restoreRange(false);
            this.selection.replaceFocus(feature);
            feature.mouseenter(function(e){ view.hoverOverFigure(e); });
            if (feature.is(':last-child')) {
                feature.after('<p>');
            }else{

            }
            this.story.renderFeatures('edit');
            this.story.renderCitations();
            window.DragonDrop = new DRAGON_DROP({
                draggables: $('figure'),
                dropzones: $('.story-body[contenteditable]'),
                noDrags: $('figure img')
            });
            Mediakron.App.Events.trigger('story:structure:change');
        },
        guidGenerator: function() {
            return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
        }
    };
    
   
    
    var AddContent = Backbone.View.extend({
        model: false,
        type: false,
        title: false,
        global: false,
        initialize: function(view){
            // new model
            $target = $('#story-add-' + this.type);
            this.model = new Mediakron.Models.Item();
            this.model.set('type',this.type);
            this.global = view;
        },
        render: function(){
            this.$el.html(this.template());
        },
        throwError: function(el, message){
            Mediakron.message({
                text: message,
                type: 'danger',
                timeout: 4000,
                layout: 'top'
            });
            $(el, this.$el).css({'background-color':'#ffcccc'});
        },
        events: {
            'click button.save-add': 'save',
            'dragenter .add-dropzone': "dragEnter",
            'dragover .add-dropzone': "dragOver",
            'drop .add-dropzone': "dropFile",
            'change #file-file': "addFile",
            'change #image-file': "addFile",
            'click #upload-image': "triggerImageUpload",
            'click #upload-file': "triggerFileUpload",
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
                    view.model.set({
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
                    view.model.set({
                        text: {
                            uri: response.file,
                            url: response.file,
                            mime: e.target.files[0].type,
                            type: 'pdf'
                        }
                    });
                }
                $('#remove-image').removeClass('hide');
                $('#upload-image').html('<span class="mk-icon mk-upload"> </span> Upload Image');/* restore upload button text */
                $('.field-alt').removeClass('hide');
            }).fail(function(response) {
                // yarg failed. TODO FIGURE OUT FAILURE
            });
        },
        validate: function(){
            // validate based on rules.  
            // Each implimnetation should do its own validation
        },
        prepare: function(e){
            // do the prep work.
            
            this.save();
        },
        save: function() {
            this.prepare();
            var valid = this.validate(), view = this;
            if(!valid) return false;
            this.global.selection.restoreRange();
            this.model.save({}, {
                success: function(model) {
                    model.addToCollection();
                    Mediakron.createUrlMap();
                    view.global.insertFeature(model);
                    $('.add-items').removeClass('is-visible');
                    $('.story-add-bg').removeClass('is-visible');
                },
                error: function(status) {}
            });
        }
    });
    
     var AddImage = AddContent.extend({
        template: _.template(imageTemplate),
        type: 'image',
        image: false,
        prepare: function(){
            this.title = $('input.title-field', this.$el).val();
            this.image = this.model.get('image');
            this.model.set({
                'title': this.title
            });
        },
        validate: function(){
            var pass = true;
            if(!this.title){ this.throwError('input.title-field', 'You must provide a title'); pass = false; }
            if(!this.image.uri){ this.throwError('.add-dropzone', 'You must upload an image'); pass = false; }
            return pass;
        }
    });
    var AddFile = AddContent.extend({
        template: _.template(fileTemplate),
        type: 'file',
        file: false,
        prepare: function(){
            this.title = $('input.title-field', this.$el).val();
            this.file = this.model.get('text');
            this.model.set({
                'title': this.title
            });
        },
        validate: function(){
            var pass = true;
            if(!this.title){ this.throwError('input.title-field', 'You must provide a title'); pass = false; }
            if(!this.file.uri){ this.throwError('.add-dropzone', 'You must upload an image'); pass = false; }
            return pass;
        }
    });
    var AddVideo = AddContent.extend({
        template: _.template(videoTemplate),
        type: 'video',
        video: false,
        url: false,
        prepare: function(){
            this.title = $('input.title-field', this.$el).val();
            this.video = $('select.select-video',this.$el).val();
            this.url = $('input.file-url-field',this.$el).val();
            this.model.set({
                'title': this.title,
                'video': {
                    'type': this.video,
                    'url': this.url
                }
            });
        },
        validate: function(){
            var pass = true;
            if(!this.title){ this.throwError('input.title-field', 'You must provide a title'); pass = false; }
            if(!this.video){ this.throwError('select.select-video', 'Please choose a video type'); pass = false; }
            if(!this.url){ this.throwError('input.file-url-field', 'Please provide a video url'); pass = false; }
            return pass;
        }
    });
    var AddAudio = AddContent.extend({
        template: _.template(audioTemplate),
        type: 'audio',
        video: false,
        url: false,
        prepare: function(){
            this.title = $('input.title-field', this.$el).val();
            this.audio = $('select.select-audio',this.$el).val();
            this.url = $('input.file-url-field',this.$el).val();
            this.model.set({
                'title': this.title,
                'audio': {
                    'type': this.audio,
                    'url': this.url
                }
            });
        },
        validate: function(){
            var pass = true;
            if(!this.title){ this.throwError('input.title-field', 'You must provide a title'); pass = false; }
            if(!this.audio){ this.throwError('select.select-audio', 'Please choose an audio type'); pass = false; }
            if(!this.url){ this.throwError('input.file-url-field', 'Please provide an audio url'); pass = false; }
            return pass;
        }
    });
    
    return features;
});