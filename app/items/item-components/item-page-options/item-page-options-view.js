import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./item-page-options.html";

var view = false;

export default class ItemPageOptions extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'ItemPageOptions',
            data: false,
            item: false,
        })
        this.data = {};
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
            //        'mouseenter .option-edit': 'expandEdit',
            //        'mouseleave .option-edit': 'collapseEdit',
            //        'mouseenter .option-add-to': 'expandAdd',
            //        'mouseleave .option-add-to': 'expandAdd',
            //        'mouseenter #secondary-options': 'expandSecondaryoptions',
            //        'mouseleave #secondary-options': 'collapseSecondaryoptions'
        }
    }

    afterrender() {

    }

    expandEdit() {
        $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'false' });
        $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.button-secondary-options').removeClass('open');
        $('.edit-button').addClass('open');
    },
    collapseEdit() {
        $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.edit-button').removeClass('open');
        $('.button-secondary-options').removeClass('open');
    },
    expandAdd() {
        $('.option-add-to .dropdown-container').attr({ 'data-visually-hidden': 'false' });
        $('.add-to-button').addClass('open');
    },
    collapseAdd() {
        $('.option-add-to .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.edit-button').removeClass('open');
    },
    expandSecondaryoptions() {
        $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'false' });
        $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.button-secondary-options').addClass('open');
        $('.edit-button').removeClass('open');
    },
    collapseSecondaryoptions() {
        $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.button-secondary-options').removeClass('open');
        $('.edit-button').removeClass('open');
    },

}

// @REVIEW then, delete. Original view below
// Mediakron.Sidebar.Edit = Backbone.View.extend({
//     template: JST['widgets.item-page-options'],
//     el: false,
//     model: false,
//     initialize(model) {
//         this.model = model;
//         this.el = '.page-options-' + model.get('uri');
//         this.$el = $(this.el);
//         this.render();
//         return this;
//     },
//     render() {
//         var content = this.model.toJSON(),
//             options = this.model.get('options');
//         content.item = this.model;
//         content.context = false;
//         content.collections = this.collections;
//
//         if (Mediakron.context) {
//             if (Mediakron.context.item) {
//                 content.context = Mediakron.context.item;
//             }
//         }
//         this.$el.html(this.template(content));
//         return this;
//     },
//     events: {
//         'click a': Mediakron.linkHandle,
//         //        'mouseenter .option-edit': 'expandEdit',
//         //        'mouseleave .option-edit': 'collapseEdit',
//         //        'mouseenter .option-add-to': 'expandAdd',
//         //        'mouseleave .option-add-to': 'expandAdd',
//         //        'mouseenter #secondary-options': 'expandSecondaryoptions',
//         //        'mouseleave #secondary-options': 'collapseSecondaryoptions'
//     },
//     expandEdit() {
//         $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'false' });
//         $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'true' });
//         $('.button-secondary-options').removeClass('open');
//         $('.edit-button').addClass('open');
//     },
//     collapseEdit() {
//         $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'true' });
//         $('.edit-button').removeClass('open');
//         $('.button-secondary-options').removeClass('open');
//     },
//     expandAdd() {
//         $('.option-add-to .dropdown-container').attr({ 'data-visually-hidden': 'false' });
//         $('.add-to-button').addClass('open');
//     },
//     collapseAdd() {
//         $('.option-add-to .dropdown-container').attr({ 'data-visually-hidden': 'true' });
//         $('.edit-button').removeClass('open');
//     },
//     expandSecondaryoptions() {
//         $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'false' });
//         $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'true' });
//         $('.button-secondary-options').addClass('open');
//         $('.edit-button').removeClass('open');
//     },
//     collapseSecondaryoptions() {
//         $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'true' });
//         $('.button-secondary-options').removeClass('open');
//         $('.edit-button').removeClass('open');
//     },
// });
