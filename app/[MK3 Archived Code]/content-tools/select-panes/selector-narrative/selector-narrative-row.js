Mediakron.ContentBrowser.rowNarrative = Mediakron.ContentBrowser.Row.extend({
    events: {
        'click a.btn-add': 'linkCallback',
        'click .bulk-action': 'toggleSelect'
    },
    linkCallback: function(e) {
        this.remove();
        var data = {};
        itemTemplate = $('.narrative-template-select', this.$el).val();
        if (itemTemplate) {
            if (!data) {
                data = {};
            }
            data.template = itemTemplate;
        }
        data.hideTitle = $('.hide-title', this.$el).prop('checked');
        data.hideSidebar = $('.hide-sidebar', this.$el).prop('checked');
        if (this.callback) this.callback(this.item, data);
        return false;
    }
});