Mediakron.Admin.HomePage = Mediakron.Extensions.View.extend({
    template: JST['settings.homepage'],
    changes: false,
    settings: false,
    initialize: function() {
        this.settings = Mediakron.Settings;
        this.changes = Mediakron.Settings;
    },
    render: function() {
        var template = JST['settings.section.wysiwyg'],
            html = template(),
            content = {
                wysiwyg: html
            };
        this.$el.html(this.template(content));
        this.$el.append('<div id="admin-link-content" />');
        return this;
    },
    updateAppearance: function() {
        Mediakron.App.InitializeAppearance();
    },
    afterRender: function() {
        var changes = this.changes;
    },
    events: {
        'click a.link-to-settings': Mediakron.linkHandle,
        'click #done-editing': Mediakron.Edit.saveSettingsForm,
        'click #cancel-editing': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'blur #description': 'description',
        'blur #alt': 'alt',
        'blur #site-name': 'name',
        'blur #site-subtitle': 'subtitle',
        'change #image-file': "addFile",
        'change .homepage-layout': "layout",
        'click #homepage-add-content': "getContentBrowser",
        'click #homepage-remove-item': "removeHome",
        // wysiwyg
        'mousedown .wysiwyg-button': Mediakron.Wysiwyg.apply,
        'mousedown .enable-wysiwyg': "bindWysiwygListner",
        'mouseup .enable-wysiwyg': "openWysiwyg",
        'keyup .enable-wysiwyg': "openWysiwyg",
        'paste .enable-wysiwyg': "cleanPaste",
        'blur .enable-wysiwyg': "blurWysiwyg",
        'focus .enable-wysiwyg': "focusWysiwyg",
        'click #remove-image': "removeFile",
        'click #upload-image': "triggerImage",
        'click .wlink-internal': 'showWysiwgyInternal',
        
    },
    showWysiwgyInternal: function() {
        var data, callback, navView = this;
        $('#linkbrowser-contents').scrollTop(0);
        data = {
            'context': false,
            'el': '#linkbrowser-contents',
            'callback': function(menu) {
                navView.restoreRange();
                var selection = window.getSelection(),
                    oRange = selection.getRangeAt(0),
                    ancestor = $(oRange.commonAncestorContainer),
                    parentEditor = ancestor.closest("div[contenteditable='true']");
                document.execCommand('createLink', false, basepath + menu.get('uri'));
                Mediakron.controller.closeLinkBrowser();
                $('.normal-wysiwyg').removeClass('hide');
                $('.wlink-tool').addClass('hide');
                if (findinselection('a', parentEditor[0])) {
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
    removeFile: function(e) {
        e.preventDefault();
        $('#remove-image').addClass('hide');
        $('#upload-image').html('<span class="mk-icon mk-upload"> </span> Upload Image'); /* restore upload button text */
        $('#alt').addClass('hide');
        $('.edit-thumbnail').empty();
        this.changes.HomePage.image = '';
        Mediakron.Status.formChanged = true;
        return false;
    },
    triggerImage: function(e) {
        e.preventDefault();
        $('#image-file').click();
        return false;
    },
    cleanPaste: function(e) {
        var target = $(e.currentTarget);
        target.attr('disabled', true);
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
            if (ancestor.closest('blockquote').length > 0) {
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
            $('.wysiwyg').hide();
        }
    },
    description: function(e) {
        var val = $(e.currentTarget).html(),
            text = $(e.currentTarget).text();
        if (text === '') val = '';
        this.changes.HomePage.description = val;
        Mediakron.Status.formChanged = true;
    },
    alt: function(e) {
        var val = $(e.currentTarget).val();
        this.changes.HomePage.alt = val;
        Mediakron.Status.formChanged = true;
    },
    name: function(e) {
        var val = $(e.currentTarget).val();
        this.changes.Settings.name = val;
        Mediakron.Status.formChanged = true;
    },
    subtitle: function(e) {
        var val = $(e.currentTarget).val();
        this.changes.Settings.subtitle = val;
        Mediakron.Status.formChanged = true;
    },
    layout: function(e) {
        var val = $(e.currentTarget).val();
        this.changes.HomePage.layout = val;
        Mediakron.Status.formChanged = true;
    },
    addFile: function(e) {
        var upload = Mediakron.Edit.fileUpload(e),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            changes.HomePage.image = response.file;
            $('#remove-image').removeClass('hide');
            $('#upload-image').html('<span class="mk-icon mk-upload"> </span> Upload Image'); /* restore upload button text */
            $('#alt').removeClass('hide');
            Mediakron.Status.formChanged = true;
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    getContentBrowser: function() {
        $('#admin-homepage').hide();
        $('#admin-link-content').show();
        var data, callback, view, lightbox, homePage = this;
        data = {
            'context': false,
            'callback': function(menu) {
                homePage.changes.HomePage.item = menu.get('uri');
                Mediakron.Status.formChanged = true;
                homePage.render();
                $('#admin-link-content').hide().empty();
                $('#admin-homepage').show();
            }
        };
        view = new Mediakron.ContentBrowser.Selector(data);
        view.setElement('#admin-link-content');
        html = view.render();
        view.afterRender();
    },
    removeHome: function() {
        this.changes.HomePage.item = false;
        Mediakron.Status.formChanged = true;
        this.render();
    }
});