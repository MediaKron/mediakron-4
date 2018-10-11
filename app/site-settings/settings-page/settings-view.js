import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./settings.html";

var view = false;

export default class Settings extends MediakronView {

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
        return this;
    }

    /**
     * Render the view
     */
    render() {
        $(this.el).html(this.template());
        return this;
    }

    get events() {
        return {
            'click a': Mediakron.linkHandle,
            'click .close-button': Mediakron.Edit.cancelEdit,
            'click .overlay-bg': Mediakron.Edit.cancelEdit,
            'click #cancel-editing': Mediakron.Edit.cancelEdit
        }
    }

    afterrender() {
        
    }

    /**
     * Description
     * @param {object} something 
     */
    newName(something) {
       
    }

}

// @REVIEW then, delete. Original view below

// Mediakron.Admin.SettingsPage = Mediakron.Extensions.View.extend({
//     template: JST['settings.settings'],
//     initialize: function() {},
//     render: function() {
//         $(this.el).html(this.template());
//         return this;
//     },
//     afterRender: function() {},
//     events: {
//         'click a': Mediakron.linkHandle,
//         'click .close-button': Mediakron.Edit.cancelEdit,
//         'click .overlay-bg': Mediakron.Edit.cancelEdit,
//         'click #cancel-editing': Mediakron.Edit.cancelEdit
//     }
// });

