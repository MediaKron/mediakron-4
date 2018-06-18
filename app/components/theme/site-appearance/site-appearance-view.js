Mediakron.Admin.AppearancePage = Mediakron.Extensions.View.extend({
    template: JST['settings.site-appearance'],
    changes: false,
    settings: false,
    initialize: function() {
        this.settings = Mediakron.Settings;
        this.changes = Mediakron.Settings;
    },
    render: function() {
        $(this.el).html(this.template());
        return this;
    },
    updateAppearance: function() {
        Mediakron.App.InitializeAppearance();
    },
    afterRender: function() {
        $('#site-skin').chosen();
        $('#select-font').chosen();
        var changes = this.changes;
        $('#link-color').spectrum({
            showPaletteOnly: true,
            hideAfterPaletteSelect: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'more',
            togglePaletteLessText: 'less',
            clickoutFiresChange: true,
            preferredFormat: "hex",
            showInput: true,
            palette: [
                ["#030303", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            change: function(color) {
                Mediakron.Status.formChanged = true;
                changes.Appearance.colors.links = color.toHexString();
            }
        });
        $('#banner-link-color').spectrum({
            showPaletteOnly: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'more',
            togglePaletteLessText: 'less',
            hideAfterPaletteSelect: true,
            preferredFormat: "hex",
            clickoutFiresChange: true,
            showInput: true,
            palette: [
                ["#030303", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            change: function(color) {
                Mediakron.Status.formChanged = true;
                changes.Appearance.colors.bannerlink = color.toHexString();
            }
        });
        $('#banner-color').spectrum({
            showPaletteOnly: true,
            hideAfterPaletteSelect: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'more',
            togglePaletteLessText: 'less',
            preferredFormat: "hex",
            clickoutFiresChange: true,
            showInput: true,
            palette: [
                ["#030303", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            change: function(color) {
                Mediakron.Status.formChanged = true;
                changes.Appearance.colors.banner = color.toHexString();
            }
        });
    },
    events: {
        'click a': Mediakron.linkHandle,
        'change #select-font': 'fonts',
        'change #site-skin': 'skin',
        'click #done-editing': Mediakron.Edit.saveSettingsForm,
        'click #cancel-editing': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'blur .settings-field': 'bindSettings',
        'change .navigation-select': 'navigation',
        'change #image-file': "logo",
        'click #remove-image': "removeFile",
        'click #upload-image': "triggerImage",
        'change #institional-file': "institionalLogo",
        'click #remove-institional': "removeInstitional",
        'click #upload-institional': "triggerInstitional",
        'click .menu-options-container input': "navigation"
    },
    removeFile: function(e) {
        e.preventDefault();
        $('#remove-image').addClass('hide');
        $('.edit-thumbnail').empty();
        $('#upload-image').html('<span class="mk-icon mk-upload"> </span> Upload Image'); /* restore upload button text */
        this.changes.Appearance.logo = '';
        Mediakron.Status.formChanged = true;
        return false;
    },
    triggerImage: function(e) {
        e.preventDefault();
        $('#image-file').click();
        return false;
    },
    removeInstitional: function(e) {
        e.preventDefault();
        $('#remove-institional').addClass('hide');
        $('.institional-thumbnail').empty();
        this.changes.Appearance.institutional = '';
        Mediakron.Status.formChanged = true;
        return false;
    },
    triggerInstitional: function(e) {
        e.preventDefault();
        $('#institional-file').click();
        return false;
    },
    navigation: function(e) {
        var val = $('.menu-options-container input:checked').val();
        this.changes.Appearance.navigation = val;
    },
    bindSettings: function(e) {
        var val = $(e.currentTarget).val(),
            property = $(e.currentTarget).attr('settings-attr');
        this.changes[property] = val;
        Mediakron.Status.formChanged = true;
    },
    skin: function(e) {
        var val = $(e.currentTarget).val(),
            skin = Mediakron.skins[val];
        if (skin) {
            this.changes.Appearance.skin = val;
            this.changes.Appearance.colors.links = skin.links;
            $("#link-color").spectrum("set", skin.links);
            this.changes.Appearance.colors.banner = skin.banner;
            $("#banner-color").spectrum("set", skin.banner);
            this.changes.Appearance.colors.bannerlink = skin.bannerlink;
            $("#banner-link-color").spectrum("set", skin.bannerlink);
        }
        Mediakron.Status.formChanged = true;
    },
    logo: function(e) {
        var upload = Mediakron.Edit.fileUpload(e, $('.site-logo')),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            changes.Appearance.logo = response.file;
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    institionalLogo: function(e) {
        var upload = Mediakron.Edit.fileUpload(e, $('.institutional-logo')),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            changes.Appearance.institutional = response.file;
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    fonts: function(e) {
        var val = $(e.currentTarget).val();
        this.changes.Appearance.font = val;
    }
});