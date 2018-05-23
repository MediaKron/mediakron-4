Mediakron.Pages.comments = Mediakron.Extensions.View.extend({
    template: JST['pages.comments'],
    tags: {},
    initialize: function () {
        var view = this;
        this.comments =  new Mediakron.Collections.Comments({
            uri: false
        })
        view.render();
        return this;
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },
    afterRender: function () {
        var row, view = this;
        $('.commentlist').html("Loading ...");
        this.comments.fetch({
            'success' : function (data) {
                view.comments.sort();
                view.comments.each(function (comment) {
                    row = new Mediakron.Pages.commentRow(comment);
                });
            }
        });
    },

    events: {
        'click a': Mediakron.linkHandle
    }

});

Mediakron.Pages.commentRow = Mediakron.Extensions.View.extend({
    template: JST['pages.comment.row'],
    el: '.commentlist',
    initialize: function (model) {
        this.model = model;
        this.render();
        return this;
    },

    render: function () {
        var content = this.model.toJSON();
        content.model = this.model;
        this.$el.append(this.template(content));
        return this;
    },

    events: {
        'click a': Mediakron.linkHandle
    }

});
