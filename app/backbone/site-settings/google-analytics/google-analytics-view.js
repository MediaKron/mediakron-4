import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl from "./googleanalytics.html";
var view = false;
export default class GoogleAnalytics extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            type: false,
            changes: false,
        })
        this.data = {};
        this.data = options;
        if (!this.changes) {
            this.changes = Mediakron.Settings;
        }
        view = this;
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
        return this;
    }

    /**
     * Render the view
     */
    render() {
        this.$el.html(this.template(this.data)).addClass(this.className);
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
     * Settings
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
     * Toggle Settings
     * @param {object} e 
     */
    bindToggleSettings(e) {
        var property = $(e.currentTarget).attr('settings-attr'),
        checked = $(e.currentTarget).is(':checked');
        this.changes[property] = checked;
        Mediakron.Status.formChanged = true;
    }
    
}

// @REVIEW
// Mediakron.Admin.GoogleAnalyticsPage = Mediakron.Extensions.View.extend({
//     template: JST['settings.googleanalytics'],
//     type: false,
//     changes: false,
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