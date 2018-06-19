Mediakron.Admin.PerformancePage = Mediakron.Extensions.View.extend({
    template: JST['settings.performance'],
    type: false,
    changes: false,
    initialize: function(type) {
        if (!this.changes) {
            this.changes = Mediakron.Settings;
        }
    },
    render: function() {
        var content = {};
        $(this.el).html(this.template(content));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click #done-editing': Mediakron.Edit.saveSettingsForm,
        'click #clear-cache': 'clearCache',
        'click #cancel-editing': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click .close-button': Mediakron.Edit.cancelEdit
    },
    clearCache: function() {
        $.getJSON(Mediakron.Settings.basepath + 'cache/generate', function(data) {
            Mediakron.message({
                'type': 'success',
                'timeout': 4000,
                'layout': 'bottom',
                'text': 'Cache Regenerated'
            });
        });
    }
});