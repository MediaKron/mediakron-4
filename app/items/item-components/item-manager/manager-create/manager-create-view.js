import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./manager-create.html";

var view = false;

export default class ManagerCreate extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'ManagerCreate',
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
            'click .add-link': 'addType',
            'click .close-button': 'cancel',
            'click #cancel-editing': 'cancel',
            'click .overlay-bg': 'cancel',
            'click #done-editing': 'save'
        }
    }

    afterrender() {

    }

    addType(e) {
        e.preventDefault();
        var target = $(e.currentTarget),
            type = target.attr('data-type'),
            view = this;
        $('.add-show').hide();
        this.bindpoint.removeClass('hide');
        var addPane = new Mediakron.Admin.AddContentPage({
            callback(model) {
                // Validate
                view.model = model;
                view.child = model;
                var valid = view.validate(model, {});
                if (valid) {
                    view.save();
                }
            },
            validate(model, changes) {
                view.child = model;
                return view.validate(model, changes, true);
            },
            type: type
        });
        addPane.setElement(this.bindpoint);
        addPane.render();
        addPane.afterRender();
        return false;
    }

}

// @REVIEW then, delete. Original view below
// Mediakron.ContentManager.Create = Mediakron.ContentManager.Default.extend({
//     template: JST['settings.content.manager.create'],
//     bindpoint: '.add-bind',
//     afterInit(data) {},
//     events: {
//         'click .add-link': 'addType',
//         'click .close-button': 'cancel',
//         'click #cancel-editing': 'cancel',
//         'click .overlay-bg': 'cancel',
//         'click #done-editing': 'save'
//
//     },
//     addType(e) {
//         e.preventDefault();
//         var target = $(e.currentTarget),
//             type = target.attr('data-type'),
//             view = this;
//         $('.add-show').hide();
//         this.bindpoint.removeClass('hide');
//         var addPane = new Mediakron.Admin.AddContentPage({
//             callback(model) {
//                 // Validate
//                 view.model = model;
//                 view.child = model;
//                 var valid = view.validate(model, {});
//                 if (valid) {
//                     view.save();
//                 }
//             },
//             validate(model, changes) {
//                 view.child = model;
//                 return view.validate(model, changes, true);
//             },
//             type: type
//         });
//         addPane.setElement(this.bindpoint);
//         addPane.render();
//         addPane.afterRender();
//         return false;
//     }
// });
