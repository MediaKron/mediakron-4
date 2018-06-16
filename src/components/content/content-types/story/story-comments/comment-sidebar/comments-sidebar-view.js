/**
 * 
 */
Mediakron.Comments.Sidebar = Mediakron.Extensions.View.extend({
    template: JST['comment.sidebar'],
    renderData: {},
    el: '.comment-sidebar',
    archived: false,
    initialize: function(data){
        this.renderData.comments = data.comments;
    },
    render: function(){
        this.$el.html(this.template(this.renderData));
    },
    events: {
        'click .close-comment-sidebar': 'closeComments',
        'click .comment-item': 'scrollBodyTo',
        'mouseover .comment-item': 'highlightComment',
        'mouseout .comment-item': 'removeCommentHighlight',
        'click .toggle-archive': 'toggleArchive'
    },
    toggleArchive: function(){
        if(!this.archived){
            $('h2', this.$el).html('<span class="mk-icon mk-archive"></span> Archived Comments');
            $('.toggle-archive .tool', this.$el).text('show active');
            $('#comments', this.$el).addClass('hide');
            $('#archived', this.$el).removeClass('hide');
            this.archived = true;
        }else{
            $('h2', this.$el).html('<span class="mk-icon mk-comment"></span> Comments');
            $('.toggle-archive .tool', this.$el).text('show archived');
            $('#comments', this.$el).removeClass('hide');
            $('#archived', this.$el).addClass('hide');
            this.archived = false;
        }
        
    },
    scrollBodyTo: function(event){
        var $this = $(event.currentTarget),
            id = $this.attr('comment-id');
        $('#main-container').animate({
            scrollTop: $('#main-container').scrollTop() + $('.comment-id-' + id).offset().top - 100
        }, '700');
        $('.comment').removeClass('highlight').removeClass('commentHighlightFade');
        $('.comment-id-' + id).addClass('highlight');
    },
    highlightComment: function (event) {
        var $this = $(event.currentTarget),
            id = $this.attr('comment-id');
        $('.comment').removeClass('highlight');
        $('.comment-item-' + id).addClass('highlight');
        $('.comment-id-' + id).addClass('highlight');
    },
    removeCommentHighlight: function (event) {
        var $this = $(event.currentTarget),
            id = $this.attr('comment-id');
        $('.comment-item-' + id).removeClass('highlight');
        $('.comment-id-' + id).removeClass('highlight');
    },
    closeComments: function(){
        $('.story-template').removeClass('comment-sidebar-open');
    }
});