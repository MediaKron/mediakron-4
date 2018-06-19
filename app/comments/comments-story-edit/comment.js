/**
 * Define the comment js, for inserting comments
 */
define([], function() {
    var highlights = {}, popups = {}, popupTemplate = JST['comment.popup'],
        applier = false,
        scope = 'story-body',
        scopeSelector = '#story-body',
        comments, containerElement, $container,
        uri, currentComment, commentEl,
        sidebarOpen = false, countComments = 0;

    // Initialize Highlighter   
    var highlighter = false;
    
    // Handle the popup controller
    var popupTracker = $('<div class="popupTracker"></div>'),
        CommentControl = $('<div class="comment-controls"></div>'),

        headerCommentControl= $('<div class="comment-controls-header">Comment</div>'),
        createCommentControl = $('<button class="btn btn-no-style addCommentTools"><span class="mk-icon mk-add"></span><span class="tool" action="add">Add Comment</span></button>'),
        editCommentControl = $('<button class="btn btn-no-style editCommentTools tooltip--n" data-tooltip="Edit comment"><span class="mk-icon mk-edit"></span><span class="tool sr-only" action="edit">Edit</span></button>'),
        archiveCommentControl = $('<button class="btn btn-no-style archiveCommentTools tooltip--n" data-tooltip="Archive comment"><span class="mk-icon mk-archive"></span><span class="tool sr-only" action="edit">Archive</span></button>'),
        deleteCommentControl = $('<button class="btn btn-no-style deleteCommentTools tooltip--n" data-tooltip="Remove comment"><span class="mk-icon mk-remove"></span><span class="tool sr-only" action="delete">Delete</button></div>');


    /**
     * Helper functions for getting the character range
     */

    /**
     * Use the character range getter to get text
     */
    var getSelection = function() {
        var selection = rangy.getSelection().saveCharacterRanges(containerElement);
        return selection;
    };


    /**
     * Restore a selection via character range
     * @param {*} selected 
     */
    var restoreSelection = function(selected) {
        rangy.getSelection().restoreCharacterRanges(containerElement, selected);
    };


    /**
     * Create a popup
     */
    var createPopup = function() {
        $container.ap;
    };

    var hideActions = function(){
        headerCommentControl.hide();
        createCommentControl.hide();
        editCommentControl.hide();
        archiveCommentControl.hide();
        deleteCommentControl.hide();
    }

    /**
     * Open the add popup window
     */
    var openAddPopup = function() {
        hideActions();
        CommentControl.show();
        createCommentControl.show();
        var coordinates = getSelectionCoords();

        CommentControl.css({
            top: (coordinates.y - 100 + $('#main-container').scrollTop()) + 'px',
            left: (coordinates.x) + 'px'
        });
    };

    var openEditPopup = function (el) {
        // check comment
        // get the comment
        var com = currentComment;
        if (com.canEdit()){
            hideActions();
            CommentControl.show();
            headerCommentControl.show();
            editCommentControl.show();
            archiveCommentControl.show(); 
            deleteCommentControl.show();
            var left = el[0].offsetLeft,  
            coordinates = el.offset();

            CommentControl.css({
                top: (coordinates.top - 135 + $('#main-container').scrollTop()) + 'px',
                left: ($('.story-body').offset().left + left + 20) + 'px'
            });
        }
    };


    /**
     * Open the add popup window
     */
    var closeAddPopup = function() {
        CommentControl.hide();
    };


    /**
     * Get the selection coordinates
     * @param {*} win 
     */
    function getSelectionCoords(win) {
        win = win || window;
        var doc = win.document;
        var sel = doc.selection,
            range, rects, rect;
        var x = 0,
            y = 0;
        if (sel) {
            if (sel.type != "Control") {
                range = sel.createRange();
                range.collapse(true);
                x = range.boundingLeft;
                y = range.boundingTop;
            }
        } else if (win.getSelection) {
            sel = win.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0).cloneRange();
                if (range.getClientRects) {
                    range.collapse(true);
                    rects = range.getClientRects();
                    if (rects.length > 0) {
                        rect = rects[0];
                    }
                    x = rect.left;
                    y = rect.top;
                }
                // Fall back to inserting a temporary element
                if (x == 0 && y == 0) {
                    var span = doc.createElement("span");
                    if (span.getClientRects) {
                        // Ensure span has dimensions and position by
                        // adding a zero-width space character
                        span.appendChild(doc.createTextNode("\u200b"));
                        range.insertNode(span);
                        rect = span.getClientRects()[0];
                        x = rect.left;
                        y = rect.top;
                        var spanParent = span.parentNode;
                        spanParent.removeChild(span);

                        // Glue any broken text nodes back together
                        spanParent.normalize();
                    }
                }
            }
        }
        return { x: x, y: y };
    };

    /**
     * Helper function, is it selected
     */
    var isSelected = function() {
        return !rangy.getSelection(containerElement).isCollapsed;
    };

    /**
     * Generate a unique id
     * @param {*} id 
     * @param {*}  
     */
    var generateId = function(id, $user){
        if (!user) var user = Mediakron.user.id;
        if (!id) var id = Math.floor(Math.random() * 10000);
        var ts = Math.floor(Math.random() * 1000000);
        var id = user + '-' + ts.toString(16) + '-' + id;
        return id;
    }

    /**
     * Create a class applier from a user and optional id
     * @param {*} user 
     * @param {*} id 
     */
var createClassApplier = function(user, id, comment) {
    var id = generateId(user, id),
        classes = 'comment';
    var hidden = false;
    if(!comment.canAccess()){
        hidden = true;
        classes += ' hidden-comment';
    }
    var archived = false;
    if (comment.archived()){
        archived = true;
        classes += ' archived-comment';
    }

    var public = false;
    if (comment.privateInt() == 0) {
        public = true;
        classes += ' public-comment';
    } 

    var private = false;
    if (comment.privateInt() == 1) {
        private = true;
        classes += ' private-comment';
    } 

    var personal = false;
    if (comment.privateInt() == 2) {
        personal = true;
        classes += ' personal-comment';
    } 
    
    var applier = rangy.createClassApplier("comment-" + id, {
        ignoreWhiteSpace: true,
        tagNames: ["comment", "a"],
        onElementCreate: function(el, applier) {

            var package = comment.get('id');
            var $el = $(el).attr('unique-id', id)
                .attr('user-id', user)
                .attr('comment-id', comment.get('id'))
                .addClass(classes + ' comment-id-' + comment.get('id'));
            if(!archived && !hidden){
                $el.on('mouseover', function(e){
                    Mediakron.App.Events.trigger('comment:over', $(el), package)
                })
                .on('mouseout', function (e) {
                    Mediakron.App.Events.trigger('comment:out', $(el), package)
                })
                .on('click', function (e) {
                    Mediakron.App.Events.trigger('comment:click', $(el), package)
                });
            }
        }
    });
    return applier;
};

    /** */
    var cloneCurrentRange = function(){
        var sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            var range = sel.getRangeAt(0);
            return range.cloneRange();
        }
        return false;
    }

    /**
     * Insert a comment
     */
    var insertComments = function() {
        var commentsGroup = {};
        comments.each(function(comment) {
                var user = Mediakron.users.get(comment.get('user_id'));
                var name = '';
                if(user){
                    name = user.get('name');
                }
                popups[comment.id] = popupTemplate({
                    'comment': comment.get('comment'),
                    'name': comment.get('comment'),
                    'created': comment.get('created'),
                    'thiscomment': comment
                });
                //commentsGroup[comment.get('user_id')][comment.id] = comment;
                var applier = createClassApplier(comment.get('user_id'), comment.id, comment)
                var selection = [{
                    'backward': false,
                    'characterOptions': false,
                    'characterRange': {
                        end: comment.get('end'),
                        start: comment.get('start')
                    }
                }];
                var range = rangy.getSelection().restoreCharacterRanges(containerElement, selection);
                var toggled = applier.toggleSelection();
        });
        var sel = window.getSelection();
        if(!sel.isCollapsed){
            range = sel.getRangeAt(0);
            range.collapse(true);
        }
    };

    /**
     * Insert a comment
     */
    var renderSidebar = function () {
        var commentsGroup = {};
        var view = new Mediakron.Comments.Sidebar({
            comments: comments
        });
        view.render();
    };

    
    var switchCommentsToTrackers = function(){
        $('.comment').each(function(){
            var uid = $(this).attr('unique-id'),
                cid = $(this).attr('comment-id'),
                before = $('<breadcrumb id="ctracker-before-' + uid + '" class="ctracker-before ctracker-before-' + uid + ' ctracker-' + uid + '" unique-id="' + uid + '" comment-id="' + cid + '"></span>'),
                after = $('<breadcrumb id="ctracker-after-' + uid + '" class="ctracker-after ctracker-after-' + uid + ' ctracker-' + uid + '" unique-id="' + uid + '" comment-id="' + cid + '"></span>');
            $(this).before(before).after(after);
            $(this).replaceWith(function () { return $(this).html() })
        })
    }

    var updatePosition = function () {
        $('.ctracker-before').each(function(){
            var uid = $(this).attr('unique-id');
            var before = $('#ctracker-before-' + uid),
                after = $('#ctracker-after-' + uid),
                range = rangy.createRange(), comment, cid = $(this).attr('comment-id');
            if(before.length > 0 && after.length > 0){
                range.setStart(before[0]);
                range.setEnd(after[0]);
                range.select();
                selection = rangy.getSelection().saveCharacterRanges(containerElement);
                comment = comments.get(cid);
                if(comment){
                    comment.set({
                        start: selection[0].characterRange.start,
                        end: selection[0].characterRange.end,
                        snippet: rangy.getSelection().toString()
                    });
                    comment.save();
                }
                
            }
            
        })
    }

    /**
     * Create a comment
     */
    var createComment = function(callback) {
        var selection = rangy.getSelection().saveCharacterRanges(containerElement);
        var comment = new Mediakron.Models.Comment({ uri: uri });
        comment.set({
            start: selection[0].characterRange.start,
            end: selection[0].characterRange.end,
            uri: uri,
            comment: '',
            snippet: rangy.getSelection().toString()
        });

        comment.save({},{
            success: function(model){
                var applier = createClassApplier(comment.get('user_id'), comment.id, model)
                var selection = [{
                    'backward': false,
                    'characterOptions': false,
                    'characterRange': {
                        end: model.get('end'),
                        start: model.get('start')
                    }
                }];
                var range = rangy.getSelection().restoreCharacterRanges(containerElement, selection);
                var toggled = applier.toggleSelection();
                
                return callback(model)
            }
        })

        comments.add(comment);
    };

    /**
     * 
     * @param {*} el 
     * @param {*} id 
     */
    var showCommentPopup = function(el, id){

        if(popups[id]){
            var html = $(popups[id]);
            el.append(html);
            var offset = el.inlineOffset();
            $('.comment-popup', el).css({
                top: offset.top - 20 + 'px'
            });
            $('.comment-popup', el).show();
        }
    }
    /**
     * 
     * @param {*} el 
     * @param {*} id 
     */
    var removeCommentPopup = function(el, id){
        if (popups[id]) {
            $('.comment-popup', el).remove();
        }
    }

    checkCount = function(){
        $('.comment-count').text("(" + comments.length + ")");
    }

    /**
     * Initialize the comment module function
     * @param {*} model 
     */
    var init = function(model) {
        if (!Mediakron.Settings.commenting) return false;
        containerElement = document.getElementById(scope);
        $container = $(scopeSelector);

        CommentControl.append(headerCommentControl).append(createCommentControl).append(editCommentControl).append(archiveCommentControl).append(deleteCommentControl).hide();
        headerCommentControl.hide();
        createCommentControl.hide();
        editCommentControl.hide();
        archiveCommentControl.hide();
        deleteCommentControl.hide();
        $container.after(CommentControl);


        uri = model.get('uri');
        comments = new Mediakron.Collections.Comments({
            uri: model.get('uri')
        });
        // Fetch all comments
        comments.fetch({
            success: function() {
                insertComments();
                renderSidebar();
                checkCount();

                // show comment button
                $('.option-comments').removeClass('hide');
                
                $('.open-comments-sidebar').click(function () {
                    
                    // Show comment sidebar
                    $('.story-template').addClass('comment-sidebar-open');
                  
                    // Close notes sidebar if open 
                    $('.story-template').removeClass('annotation-sidebar-open');
                    localStorage.removeItem('annotation-sidebar', 'open');
                    sidebarOpen = true;

                    // show comments briefly in Story body when opening comment sidebar
                    $('.comment').addClass('commentHighlightFade');
                    setTimeout(function() {
                        $('.comment').removeClass('commentHighlightFade');    
                    }, 4000);
                })
            }
        });

        var trackRange = false;
        var inUtil = false;

        $container.mouseup(function(e) {
            trackRange = cloneCurrentRange();
            if (isSelected()) {
                openAddPopup();
            } else {
                closeAddPopup();
            }
            return false;
        })
        createCommentControl.mousedown(function(e) {
            e.preventDefault();
            createComment(function(comment){
                var AddComment = new Mediakron.Comments.Form({
                    comment: comment,
                    edit: false
                });
                Mediakron.controller.gotoAdmin(AddComment);
                $('#admin-edit-comment #comment').focus(); /* send focus to edit pane */
            });
            
            return false;
        });

        editCommentControl.mousedown(function(e){
            e.preventDefault();

            var EditComment = new Mediakron.Comments.Form({
                comment: currentComment,
                edit: true
            });
            Mediakron.controller.gotoAdmin(EditComment);
            $('#admin-edit-comment #comment').focus(); /* send focus to edit pane */
            return false;
        });

        deleteCommentControl.mousedown(function (e) {
            e.preventDefault();
            var id = commentEl.attr('unique-id');

            $('.comment-'+id).each(function(i, el){
                $(this).replaceWith(function () { return $(this).html() })
            });
            
            $('.comment-popup').remove();            
            currentComment.destroy();
            CommentControl.hide();
            editCommentControl.hide();
            archiveCommentControl.hide();
            deleteCommentControl.hide();
            checkCount();
            renderSidebar();
            return false;
        });

        archiveCommentControl.mousedown(function (e) {
            e.preventDefault();
            var id = commentEl.attr('unique-id');

            $('.comment-' + id).each(function (el) {
                $(this).replaceWith(function () { return $(this).html() })
            });
            checkCount();
            currentComment.set('archive', true);
            currentComment.save();
            CommentControl.hide();
            editCommentControl.hide();
            archiveCommentControl.hide();
            deleteCommentControl.hide();
            $('.comment-popup').remove();
            renderSidebar();
            return false;
        });

        Mediakron.App.Events.on('comment:delete', function (comment) {
            var id = $('.comment-id-'+comment.id).attr('unique-id');

            $('.comment-' + id).each(function (i, el) {
                $(this).replaceWith(function () { return $(this).html() })
            });

            $('.comment-popup').remove();
            currentComment.destroy();
            CommentControl.hide();
            editCommentControl.hide();
            archiveCommentControl.hide();
            deleteCommentControl.hide();
            checkCount();
            renderSidebar();
        });

        Mediakron.App.Events.on('comment:save', function (comment) {
            $('.comment-sidebar').empty();
            renderSidebar();
            CommentControl.hide(); 
            currentComment = comment;
            popups[comment.id] = popupTemplate({
                'comment': comment.get('comment'),
                'name': comment.get('comment'),
                'created': comment.get('created'),
                'thiscomment': comment
            });
            comments.add(comment);
            checkCount();
        })

        var commentOver = false;

        Mediakron.App.Events.on('comment:over', function(el, id){
          commentOver = true;
          currentComment = comments.get(id);
          commentEl = el;
          openEditPopup(el, id); 
          showCommentPopup(el, id);
        });
      
        Mediakron.App.Events.on('comment:out', function (el, id) {
         var _this = this;
         commentOver = false;
         setTimeout(function() {
             if (!$(".comment-controls:hover").length && !commentOver) {
                CommentControl.hide(); 
                removeCommentPopup(el, id);
             }
         }, 1000);

        });

        CommentControl.on('mouseover', function(){
            commentOver = true;
        })
        CommentControl.on('mouseout', function () {
            commentOver = false;
        })
        
        Mediakron.App.Events.on('comment:click', function (el, id) {
          
          // Open comment sidebar
          $('.story-template').addClass('comment-sidebar-open');

          $('.comment-sidebar .highlight').removeClass('highlight');
          $('.comment-item-' + id).addClass('highlight');

          $('.comment-sidebar h2').html('<span class="mk-icon mk-comment"></span> Comments');
          $('.toggle-archive .tool').text('show archived');
          $('#comments').removeClass('hide');
          $('#archived').addClass('hide');
          
          // Hide notes
          $('.story-template').removeClass('annotation-sidebar-open');
          localStorage.removeItem('annotation-sidebar', 'open');

          $('.comment-sidebar').scrollTop($('.comment-sidebar').scrollTop() + $('.comment-item-' + id).position().top - 40);
          sidebarOpen = true;
        })

        Mediakron.App.Events.on('comment:edit', function (el, id) {
            switchCommentsToTrackers();
        })

        Mediakron.App.Events.on('comment:updateposition', function (el, id) {
            updatePosition();
        })
        

    };

    return init;
});