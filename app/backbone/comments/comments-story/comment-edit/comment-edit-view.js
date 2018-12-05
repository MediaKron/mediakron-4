import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./comments/comments-story/comment-edit/comment-edit.html";

var view = false;

export default class CommentEdit extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            edit: false,
            comment: false,
            range: false,
            renderData: {},
            bindpoint: false,
        })
        this.data = {};
            if (!this.changes) {
                this.changes = Mediakron.Settings;
            }
        view = this;
    }

    // Cast the html template 
    get template() { 
        return _.template(tpl); 
    }

    /**
     * 
     * @param {object} data 
     */
    initialize(data) {
        this.renderData = {
            model: false,
            published: true,
        };
        if (data.edit) {
            this.comment = data.comment;
            this.range = data.range;
            this.renderData.edit = true;
            this.renderData.panetitle = 'Edit Comment';
            this.renderData.comment = this.comment.get('comment');
            this.renderData.visible = this.comment.privateInt();
        } else {
            this.comment = data.comment;
            this.renderData.edit = false;
            this.range = data.range;
            this.renderData.panetitle = 'Add Comment';
            this.renderData.comment = '';
            this.renderData.visible = 0;
        } 
        this.renderData.savebar = JST['settings.savebar']({
            edit: false
        });
        this.renderData.wysiwyg = Mediakron.controller.currentItem.wysiwygForm();
        this.afterInit(data);
    }

    /**
     * Render the view
     */
    render() {
        this.$el.html(this.template(this.renderData));
    }

    get events() {
        return {
            'click a': Mediakron.linkHandle,
            'click .close-button': 'cancel',
            'click #cancel-editing': 'cancel',
            'click #close-settings-context': 'cancel',
            'click .overlay-bg': 'cancel',
            'click #done-editing': 'save',
            'mousedown .wysiwyg-button': Mediakron.Wysiwyg.apply,
            'mousedown .enable-wysiwyg': "bindWysiwygListner",
            'mouseup .enable-wysiwyg': "openWysiwyg",
            'keyup .enable-wysiwyg': "openWysiwyg",
            'paste .enable-wysiwyg': "cleanPaste",
            'blur .enable-wysiwyg': "blurWysiwyg",
            'focus .enable-wysiwyg': "focusWysiwyg"
        }
    }

    afterrender(data) {
        if (this.bindpoint) this.bindpoint = $(this.bindpoint);
    }

    /**
     * Cancel
     * @param {object}  
     */
    cancel() {
        Mediakron.App.Events.trigger('comment:delete', this.comment);
        Mediakron.controller.closeAdmin();  /* close the fade-screen overlay  */
    } 

    /**
     * Save
     * @param {object}  
     */
    save() {
        this.comment.set('comment', $('#comment.model-field').html());
        this.comment.set('private', $('.comment-visiblity:checked').val());
        this.comment.save({},
        {
            'success': function(model){
                Mediakron.App.Events.trigger('comment:save', model);
            }
        });
        Mediakron.controller.closeAdmin(); /* close the fade-screen overlay  */
    }

     /**
     * Get Selection Start Node
     * @param {object}  
     */
    getSelectionStartNode() {}
    
     /**
     * bind Wysiwyg Listner
     * @param {object}  
     */
    bindWysiwygListner(e) {
        var target = $(e.currentTarget),
            form = this;
        $('body').one('mouseup', function(event) {
            form.openWysiwyg(e);
        });
    }

    /**
     * Open Wysiwyg
     * @param {object}  
     */
    openWysiwyg(e) {
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
    }

    /**
     * Clean Paste
     * @param {object} e 
     */
    cleanPaste(e) {
        var target = $(e.currentTarget);
        target.attr('disabled', true);
        setTimeout(function() {
            html = Mediakron.cleanHTML(target.html());
            target.html(html);
            target.attr('disabled', false);
        }, 20);
    }

    /**
     * Blue Wysiwyg
     * @param {object} e 
     */
    blurWysiwyg(e) {
        var target = $(e.currentTarget),
            text = target.text(),
            placeholder = target.attr('data-placeholder');
        if (text === '') {
            target.html('');
        }
    }

    /**
     * Focus WYSIWYG
     * @param {object} e 
     */
    focusWysiwyg(e) {
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
    }

}

// // @REVIEW then, delete. Original view below
// /**
//  * 
//  */
// Mediakron.Comments.Form = Mediakron.Extensions.View.extend({
//     template: JST['comment.form'],
//     edit: false,
//     comment: false,
//     range: false,
//     renderData: {},
//     bindpoint: false,
//     initialize: function(data) {
//         this.renderData = {
//             model: false,
//             published: true,
//         };
//         if (data.edit) {
//             this.comment = data.comment;
//             this.range = data.range;
//             this.renderData.edit = true;
//             this.renderData.panetitle = 'Edit Comment';
//             this.renderData.comment = this.comment.get('comment');
//             this.renderData.visible = this.comment.privateInt();
//         } else {
//             this.comment = data.comment;
//             this.renderData.edit = false;
//             this.range = data.range;
//             this.renderData.panetitle = 'Add Comment';
//             this.renderData.comment = '';
//             this.renderData.visible = 0;
//         } 
//         this.renderData.savebar = JST['settings.savebar']({
//             edit: false
//         });
//         this.renderData.wysiwyg = Mediakron.controller.currentItem.wysiwygForm();
//         this.afterInit(data);
//     },
//     afterInit: function(data) {},
//     render: function() {
//         this.$el.html(this.template(this.renderData));
//     },
//     afterRender: function(data) {
//         if (this.bindpoint) this.bindpoint = $(this.bindpoint);
//     },
//     afterSave: function() {

//     },
//     /**
//      * 
//      */
//     events: {
//         'click a': Mediakron.linkHandle,
//         'click .close-button': 'cancel',
//         'click #cancel-editing': 'cancel',
//         'click #close-settings-context': 'cancel',
//         'click .overlay-bg': 'cancel',
//         'click #done-editing': 'save',
//         'mousedown .wysiwyg-button': Mediakron.Wysiwyg.apply,
//         'mousedown .enable-wysiwyg': "bindWysiwygListner",
//         'mouseup .enable-wysiwyg': "openWysiwyg",
//         'keyup .enable-wysiwyg': "openWysiwyg",
//         'paste .enable-wysiwyg': "cleanPaste",
//         'blur .enable-wysiwyg': "blurWysiwyg",
//         'focus .enable-wysiwyg': "focusWysiwyg"
//     },
//     /**
//      * 
//      */
//     cancel: function() {
//         Mediakron.App.Events.trigger('comment:delete', this.comment);
//         Mediakron.controller.closeAdmin();  /* close the fade-screen overlay  */
//     },
//     /**
//      * 
//      */
//     save: function() {
//         this.comment.set('comment', $('#comment.model-field').html());
//         this.comment.set('private', $('.comment-visiblity:checked').val());
//         this.comment.save({},
//         {
//             'success': function(model){
//                 Mediakron.App.Events.trigger('comment:save', model);
//             }
//         });
//         Mediakron.controller.closeAdmin(); /* close the fade-screen overlay  */
//     },
//     getSelectionStartNode: function() {},
//     bindWysiwygListner: function(e) {
//         var target = $(e.currentTarget),
//             form = this;
//         $('body').one('mouseup', function(event) {
//             form.openWysiwyg(e);
//         });
//     },
//     openWysiwyg: function(e) {
//         // this might work!
//         if (e.keyCode == '13') {
//             if (!e.shiftKey) {
//                 document.execCommand('formatBlock', false, 'p');
//             }
//         }
//         var selection = window.getSelection(),
//             oRange = selection.getRangeAt(0),
//             ancestor = $(oRange.commonAncestorContainer),
//             parentEditor = ancestor.closest("div[contenteditable='true']"),
//             text = selection.toString();
//         if (text.length > 0) {
//             this.range = oRange.cloneRange();
//             this.selection = selection;
//             Mediakron.Wysiwyg.showBubble(e.currentTarget);
//             var $node = $(this.getSelectionStartNode());
//             if (ancestor.closest('blockquote').length > 0) {
//                 $('.wysiwyg-indent').addClass('hide');
//                 $('.wysiwyg-outdent').removeClass('hide');
//             } else {
//                 $('.wysiwyg-indent').removeClass('hide');
//                 $('.wysiwyg-outdent').addClass('hide');
//             }
//             if (findinselection('a', parentEditor[0])) {
//                 $('.wysiwyg-link').addClass('hide');
//                 $('.wysiwyg-unlink').removeClass('hide');
//             } else {
//                 $('.wysiwyg-link').removeClass('hide');
//                 $('.wysiwyg-unlink').addClass('hide');
//             }
//         } else {
//             $('.wysiwyg').hide();
//         }
//     },
//     cleanPaste: function(e) {
//         var target = $(e.currentTarget);
//         target.attr('disabled', true);
//         setTimeout(function() {
//             html = Mediakron.cleanHTML(target.html());
//             target.html(html);
//             target.attr('disabled', false);
//         }, 20);
//     },
//     blurWysiwyg: function(e) {
//         var target = $(e.currentTarget),
//             text = target.text(),
//             placeholder = target.attr('data-placeholder');
//         if (text === '') {
//             target.html('');
//         }
//     },
//     focusWysiwyg: function(e) {
//         var target = $(e.currentTarget),
//             text = target.text(),
//             placeholder = target.attr('data-placeholder');
//         this.focusElement = target;
//         if (text == placeholder || text === '') {
//             target.html('<p></p>');
//             var range = document.createRange();
//             var sel = window.getSelection();
//             range.setStart(target.children()[0], 0);
//             range.collapse(true);
//             sel.removeAllRanges();
//             sel.addRange(range);
//         }
//     }
// });