import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./privacy.html";

var view = false;

export default class PrivacySettings extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({

        })
    }

    // Cast the html template 
    get template() { 
        return _.template(tpl); 
    }

    /**
     * 
     * @param {object} data 
     */
    initialize(data) {
        if (!this.changes) {
            this.changes = Mediakron.Settings;
        }
    }

    /**
     * Render the view
     */
    render() {
        var content = {};
        $(this.el).html(this.template(content));
        return this;
    }

    get events() {
        return {
            'click a': Mediakron.linkHandle,
            'click #done-editing': Mediakron.Edit.saveSettingsForm,
            'click .close-button': Mediakron.Edit.cancelEdit,
            'click #close-settings-context': Mediakron.Edit.cancelEdit,
            'blur .settings-field': "bindSettings",
            'change .settings-field': "bindSettings",
            'change .toggle-field': "bindToggleSettings"
        }
    }

    /**
     * Bind Settings
     * @param {object} e
     */
    bindSettings(e) {
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
    }

    /**
     * Bind Toggle Settings
     * @param {object} e 
     */
    bindToggleSettings(se) {
        var property = $(e.currentTarget).attr('settings-attr'),
            checked = $(e.currentTarget).is(':checked');
        this.changes[property] = checked;
        Mediakron.Status.formChanged = true;
    }

}

// @REVIEW then, delete. Original view below

// Mediakron.Admin.PrivacyPage = Mediakron.Extensions.View.extend({
//     template: JST['settings.privacy'],
//     initialize: function(type) {
//         if (!this.changes) {
//             this.changes = Mediakron.Settings;
//         }
//     },
//     render: function() {
//         var content = {};
//         $(this.el).html(this.template(content));
//         return this;
//     },
//     afterRender: function() {},
//     events: {
//         'click a': Mediakron.linkHandle,
//         'click #done-editing': Mediakron.Edit.saveSettingsForm,
//         'click .close-button': Mediakron.Edit.cancelEdit,
//         'click #close-settings-context': Mediakron.Edit.cancelEdit,
//         'blur .settings-field': "bindSettings",
//         'change .settings-field': "bindSettings",
//         'change .toggle-field': "bindToggleSettings"
//     },
//     bindSettings: function(e) {
//         var val = $(e.currentTarget).val(),
//             property = $(e.currentTarget).attr('settings-attr'),
//             checked = $(e.currentTarget).is(':checked');
//         if (val == 'true') {
//             val = true;
//         }
//         if (val == 'false') {
//             val = false;
//         }
//         this.changes[property] = val;
//         Mediakron.Status.formChanged = true;
//     },
//     bindToggleSettings: function(e) {
//         var property = $(e.currentTarget).attr('settings-attr'),
//             checked = $(e.currentTarget).is(':checked');
//         this.changes[property] = checked;
//         Mediakron.Status.formChanged = true;
//     }
// });