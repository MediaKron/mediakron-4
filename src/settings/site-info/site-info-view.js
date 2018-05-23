Mediakron.Admin.AdminPage = Mediakron.Extensions.View.extend({
    template: JST['settings.index'],
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
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'blur .settings-field': "bindSettings",
        'change .settings-field': "bindSettings",
        'change .toggle-field': "bindToggleSettings"
    },
    bindSettings: function(e) {
        var val = $(e.currentTarget).val(),
            property = $(e.currentTarget).attr('settings-attr'),
            checked = $(e.currentTarget).is(':checked');
        if (val == 'true') {
            val = true;
        }
        if (val == 'false') {
            val = false;
        }
        this.changes[property] = val;
        Mediakron.Status.formChanged = true;
    },
    bindToggleSettings: function(e) {
        var property = $(e.currentTarget).attr('settings-attr'),
            checked = $(e.currentTarget).is(':checked');
        this.changes[property] = checked;
        Mediakron.Status.formChanged = true;
    }
});