var template = require('../../templates/navigation/breadcrumb.html')
module.exports = Backbone.View.extend({
    template: template,
    el: '#breadcrumb',
    items: [],
    initialize: function () {
        this.$el.hide();
        return this;
    },
    setBreadcrumb: function (items) {
        this.items = items;
    },
    getBreadcrumb: function () {
        return this.template({ items: this.items });
    }
});