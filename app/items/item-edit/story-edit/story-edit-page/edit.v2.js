define(['/mediakron/js/src/story/wysiwyg/wysiwyg.js', // Get the Wysiwyg Editor
"/mediakron/js/src/story/wysiwyg/selection.js", // Selection manager
"/mediakron/js/src/story/wysiwyg/tracking.js", // Tracking Manager
"/mediakron/js/src/story/features/features.js", // Tracking Manager
"/mediakron/js/src/story/wysiwyg/storage.js", // Tracking Manager
'text!src/story/save.html', 'text!src/story/note.html'], function(Wysiwyg, Selection, Tracking, Features, Storage, saveTemplate, noteTemplate) {
    var control, editor, parser, storyParent, add = false,
        storage;
    var init = function(options) {
            model = false, view = this, storyview = this;
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
            } else {
                add = false;
            }
            if (Mediakron.Status.storyDebug){ 
              this.debug = $('#story-debug'); 
            }
            storage = new Storage();
            parser = options.parser;
            $el.addClass('edit-story');
            control = new Controls(model);
            control.setElement($('.story-edit-bar .save-bar-inner', $el));
            control.render();
            this.control = control;
            if (Mediakron.Status.storyDebug){ 
              Mediakron.App.Events.on('story:after:object:format', function() {
                  var str = JSON.stringify(parser.workingObject, null, '\t');
                  storyview.debug.text(str);
              });
            }
            Mediakron.App.Events.on('story:structure:change', function() {
                control.refreshAnnotationsFromBody();
            });
            return this;
        };
    var tracking;
    var Editor = Mediakron.Extensions.View.extend({
        template: _.template(saveTemplate),
        changed: false,
        unsavedLocal: false,
        title: '',
        body: '',
        lastSave: false,
        storage: false,
        saveInterval: false,
        initialize: function(model) {
            this.model = model;
        },
        render: function() {
            var content = {},
                view = this;
            this.$el.attr('contenteditable', true);
            $('h1.story-title').attr('contenteditable', true);
            $('h1.story-title').on('paste', function() {
                setTimeout(function() {
                    var text = $('h1.story-title').text();
                    $('h1.story-title').text(text);
                }, 10)
            });
            // set storage key
            if (!add) {
                this.storage = 'mk-story-' + model.get('uri');
            } else {
                this.storage = 'mk-new-story';
            }
            // load object from history
            var history = storage.getItem(this.storage);
            if (history) {
                history = JSON.parse(history);
                if (history) {
                    html = parser.mdJsonToHtml(history);
                    $('.discard-changes').removeClass('hide');
                    this.$el.html(html);
                    Mediakron.App.Events.trigger('story:render', {});
                    Mediakron.message({
                        text: '<strong>This page has unsaved changes.</strong> <span class="autosave-details">Click "Save" to keep them  or "Discard Changes" to delete them.</span>',
                        type: 'warning',
                        timeout: 0,
                        dismiss: true,
                        layout: 'top'
                    });
                }
            }
            this.wysiwyg = new Wysiwyg(this.$el);
            this.wysiwyg.setModel(this.model);
            tracking = this.tracking = new Tracking(this.$el, this.wysiwyg, parser);
            this.features = new Features(this.$el, this.tracking, storyParent);
            Mediakron.App.Events.on('story:change', function(data) {
                view.changed = true;
                Mediakron.Status.formChanged = true;
                view.unsavedLocal = true;
            });
            
            this.saveInterval = setInterval(function() {
                // listen for doc changes
                if (view.unsavedLocal) {
                    Mediakron.App.Events.trigger('story:structure:change');
                    storage.setItem(view.storage, JSON.stringify(parser.workingObject));
                    view.unsavedLocal = false;
                }
            }, 10000);
            window.DragonDrop = new DRAGON_DROP({
                draggables: $('figure'),
                dropzones: $('.story-body'),
                noDrags: $('figure img')
            });
            return this;
        },
        close: function() {},
        events: {
            'mousedown': 'mouseDown',
            'mouseup': 'mouseUp',
            'blur': 'blur',
            'focus': 'focus',
            'keydown': 'keyDown',
            'keyup': 'keyUp',
            'paste': 'paste'
        },
        mouseDown: function(e) {
            this.tracking.mouseDown(e);
        },
        mouseUp: function(e) {
            this.tracking.mouseUp(e);
        },
        keyDown: function(e) {
            this.tracking.keyDown(e);
        },
        keyUp: function(e) {
            this.tracking.keyUp(e);
        },
        focus: function(e) {
            this.tracking.focused(e);
        },
        blur: function(e) {
            this.tracking.blured(e);
        },
        paste: function(e) {
            this.tracking.pasted(e);
        }
    });
    var Controls = Mediakron.Extensions.View.extend({
        template: _.template(saveTemplate),
        changed: false,
        title: '',
        body: '',
        $body: false,
        lastSave: false,
        storage: false,
        editor: false,
        initialize: function(model) {
            this.model = model;
            this.title = model.get('title');
            this.body = model.get('body');
            this.$body = $('.story-body', $el);
            if (!add) {
                this.storage = 'mk-story-' + model.get('uri');
            } else {
                this.storage = 'mk-new-story';
            }
        },
        afterRender: function() {
            var view = this;
            $('.story-body', $el).keypress(this.change);
            $('.story-title', $el).keypress(this.change);
            $('.close-button').click(function() {
                view.discard();
            });
            this.editor = editor = new Editor(this.model);
            editor.setElement($('.story-body'));
            editor.render();
        },
        render: function() {
            var content = {};
            this.$el.html(this.template(content));
            this.afterRender();
            return this;
        },
        remove: function() {
            // Your processing code here
            this.editor.remove();
            Backbone.View.prototype.remove.apply(this, arguments);
        },
        events: {
            'click .save': 'saveStory',
            'click .save-exit': 'saveExit',
            'click .discard-changes': 'discardlocal',
            'click .discard': 'discard',
            'click .close-button': 'discard',
            'keypress .story-body': 'change'
        },
        saveStory: function() {
            this.save();
        },
        saveExit: function() {
            var parent = this;
            clearInterval(this.editor.saveInterval);
            this.save(function(model) {
                Mediakron.Status.linkDisable = false;
                var current = Backbone.history.fragment;
                $('.main-content').removeClass('editing-enabled');
                if (add) {
                    Mediakron.router.navigate('mkblank');
                    Mediakron.router.navigate(model.get('uri'), {
                        trigger: true
                    });
                } else {
                    Mediakron.router.navigate('mkblank');
                    Mediakron.router.navigate(current, {
                        trigger: true
                    });
                }
            });
        },
        refreshAnnotationsFromBody: function() {
            // This will remove annotations from the list that have been removed from the body
            var annotations = this.model.get('annotations'),
                newAnn = {};
            
            $('cite', this.$body).each(function(i, item) {
              var id = $(item).attr('annotation-id');
              if (annotations[id]) {
                newAnn[id] = annotations[id];
              }
            });
            // remove nonexistant annotations
            _.each(annotations, function(annotation, id){
              if(!newAnn[id]){
                newAnn[id] = annotations[id];
                newAnn[id].remove = true;
              }
            });
            this.model.set('annotations', newAnn);
        },
        save: function(callback) {
            var title = $('.story-title', $el).text();
            if (title === '') {
                Mediakron.message({
                    text: 'Your story must have a title',
                    type: 'danger',
                    timeout: 4000,
                    layout: 'top'
                });
                $('#main-container').scrollTop(0);
                $('h1.story-title').css({
                    'background-color': '#ffcccc'
                });
                return false;
            }
            this.$body.linkify({
                target: "_blank"
            });
            var view = this,
                bodyContent = this.$body.html(),
                uri;
            Mediakron.App.Events.trigger('story:structure:change');
            model.setRelationship('children', []);
            $('figure', this.$body).each(function(i, item) {
                uri = $(item).attr('uri');
                child = Mediakron.getItemFromURI(uri);
                if (child) {
                    caption = $('.figure-caption', $(item)).text();
                    model.add(child, {
                        'caption': caption
                    }, true);
                } else {
                    $(item).remove();
                }
            });
            this.refreshAnnotationsFromBody();
            model.updateAnnotationRelationship();
            $('#save-story, #save-done').hide();
            $('.save-bar-inner').append('<button id="saving-story" type="submit" class="btn btn-success submit btn-sm save"><span class="mk-icon mk-save"> </span> Saving...</button>');
            $('#message-top').empty(); /* Remove the autosave warning if present  */
            $('#discard-changes').addClass('hide'); /* Hide discard changes button after saving */
            Mediakron.App.Events.trigger('comment:updateposition');
            Mediakron.message({
                text: 'Saving Story',
                type: 'success',
                timeout: 1000,
                layout: 'bottom'
            });
            setTimeout(function () {
                view.model.save({
                    'title': title,
                    'body': tracking.parser.workingObject
                }, {
                    success: function(model) {
                        storage.removeItem(view.storage);
                        view.model = model;
                        model.addToCollection();
                        Mediakron.createUrlMap();
                        Mediakron.Status.formChanged = false;
                        storyParent.edit = false;
                        $('#saving-story').remove();
                        $('#save-story, #save-done').show();
                        Mediakron.message({
                            text: '<span class="mk-icon mk-save"></span>Changes saved',
                            type: 'success',
                            timeout: 4000,
                            layout: 'bottom'
                        });
                        if (callback) {
                            callback(model);
                        }
                    }
                });
            }, 1000);
        },
        discardlocal: function() {
            storage.removeItem(this.storage);
            if (add) {
                this.$body.html('');
            } else {
                var html = parser.getObjectAndMakeHTML(this.model.get('body'));
                this.$body.html(html);
            }
            $('.discard-changes').addClass('hide');
            $('#message-top').empty(); /* Remove the autosave warning if present  */
            Mediakron.App.Events.trigger('story:render', {});
        },
        discard: function() {
            var view = this;
            accept = function(request) {
                Mediakron.Status.formChanged = false;
                Mediakron.Status.linkDisable = false;
                $('.main-content').removeClass('editing-enabled');
                storyParent.edit = false;
                var prev = storage.getItem(view.storage);
                clearInterval(view.editor.saveInterval);
                storage.removeItem(view.storage);
                view.remove();
                if (add) {
                    if (prev) {
                        Backbone.history.loadUrl('settings/content/add/story');
                    } else {
                        Mediakron.back();
                    }
                } else {
                    Backbone.history.loadUrl(Backbone.history.fragment);
                }
            };
            if (Mediakron.Status.formChanged) {
                text = "You have unsaved changes on this form.  Are you sure you want to cancel?";
                reject = function(request) {};
                Mediakron.message({
                    text: text,
                    type: 'warning',
                    timeout: 3000,
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
                accept();
            }
        },
        change: function() {}
    });
    return init;
});

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
            Mediakron.App.Events.trigger('story:dragging', {});
            var e = event.originalEvent;
            $(e.target).removeAttr('dragged');
            $(e.target).attr('dragcopy', 'dragcopy');
            $('iframe', $(e.target)).remove();
            var dt = e.dataTransfer,
                content = e.target.outerHTML;
            var is_draggable = DD.$draggables.is(e.target);
            if (is_draggable) {
                dt.effectAllowed = 'copy';
                dt.setData('text/plain', ' ');
                DD.dropLoad = content;
                $(e.target).attr('dragged', 'dragged');
                $(e.target).removeAttr('dragcopy', 'dragcopy');
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
            if (!$(sel.anchorNode).parent().is('p') && !$(sel.anchorNode).parent().is('div') && $(sel.anchorNode).parent().length > 0) {
                range.setStartBefore($(sel.anchorNode).parent().get(0));
            }
            sel.removeAllRanges();
            sel.addRange(range);
            $(sel.anchorNode).closest(DD.$dropzones.selector).get(0).focus(); // essential
            document.execCommand('insertHTML', false, '<param name="dragonDropMarker" />' + DD.dropLoad);
            sel.removeAllRanges();
            // verification with dragonDropMarker
            var $DDM = $('param[name="dragonDropMarker"]');
            var insertSuccess = $DDM.length > 0;
            if (insertSuccess) {
                var findcopy = $(DD.$draggables.selector).filter('[dragcopy]');
                if (findcopy.parent().is('figure[dragged]')) {
                    // drag on itself
                } else {
                    $(DD.$draggables.selector).filter('[dragged]').remove();
                }
                $(DD.$draggables.selector).filter('[dragged]').removeAttr('dragged');
                $(DD.$draggables.selector).filter('[dragcopy]').removeAttr('dragcopy');
                $DDM.remove();
            }
            DD.dropLoad = null;
            DD.bindDraggables();
            e.preventDefault();
            Mediakron.App.Events.trigger('story:dropped', {
                figure: $(e.target)
            });
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