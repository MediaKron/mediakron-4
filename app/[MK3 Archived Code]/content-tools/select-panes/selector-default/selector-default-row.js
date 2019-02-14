Mediakron.ContentBrowser.rowSelector = Mediakron.ContentBrowser.Row.extend({
    events: {
        'click a.btn-add': 'linkCallback',
        'click .bulk-action': 'toggleSelect'
    },
    linkCallback: function(e) {
        this.remove();
        if (this.callback) this.callback(this.item);
        return false;
    }
});