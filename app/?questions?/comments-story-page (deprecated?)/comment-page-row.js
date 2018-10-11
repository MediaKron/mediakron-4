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