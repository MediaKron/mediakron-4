import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./after.html";

var view = false;

export default class ManagerView extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'ManagerView',
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
            'click .close-button': 'cancel',
            'click #cancel-editing': 'cancel',
            'click .overlay-bg': 'cancel',
            'click #done-editing': 'save',
        }
    }

    afterrender() {

    }

    cancel: function() {
        Mediakron.App.Events.trigger('content:create:cancel');
        Mediakron.controller.gotoLast();
    },
    validate: function(model, changes, message) {
        var validation = false,
            view = this;

        switch (this.type) {
            case 'timeline':
                validation = this.child.validateTimeline(changes);
                if (validation && message) {
                    Mediakron.message.error(validation);
                }
                var data = view.data;
                data.dateEntry = JST['settings.content.form.date.widget']({
                    start: false,
                    end: false,
                    type: 'traditional'
                });
                var contentview = new Mediakron.ContentManager.Edit({
                    parent: view.parent,
                    viewtype: view.type,
                    child: view.child,
                    data: data,
                    type: 'item'
                });
                Mediakron.controller.gotoAdmin(contentview);
                return false;
        }

        return true;
    },
    save: function() {
        this.parent.add(this.child, this.data);
        this.parent.save();
        Mediakron.controller.gotoLast();
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
    }

}

// @REVIEW then, delete. Original view below
// Mediakron.ContentManager = {};
//
// Mediakron.ContentManager.Default = Mediakron.Extensions.View.extend({
//     parent: false,
//     child: false,
//     data: false,
//     type: false,
//     label: false,
//
//     renderData: {},
//     bindpoint: false,
//     initialize: function(data) {
//         this.parent = data.parent;
//         this.type = this.parent.getNormalType();
//         this.child = data.child;
//         this.data = data.data;
//         this.renderData = data;
//         this.relationshipType = data.type;
//         this.afterInit(data);
//     },
//     afterInit: function(data) {},
//     render: function() {
//         this.$el.html(this.template(this.renderData));
//     },
//     afterRender: function(data) {
//         if (this.bindpoint) this.bindpoint = $(this.bindpoint);
//     },
//     afterSave: function() {
//
//     },
//     events: {
//         'click a': Mediakron.linkHandle,
//         'click .close-button': 'cancel',
//         'click #cancel-editing': 'cancel',
//         'click .overlay-bg': 'cancel',
//         'click #done-editing': 'save',
//     },
//     cancel: function() {
//         Mediakron.App.Events.trigger('content:create:cancel');
//         Mediakron.controller.gotoLast();
//     },
//     validate: function(model, changes, message) {
//         var validation = false,
//             view = this;
//
//         switch (this.type) {
//             case 'timeline':
//                 validation = this.child.validateTimeline(changes);
//                 if (validation && message) {
//                     Mediakron.message.error(validation);
//                 }
//                 var data = view.data;
//                 data.dateEntry = JST['settings.content.form.date.widget']({
//                     start: false,
//                     end: false,
//                     type: 'traditional'
//                 });
//                 var contentview = new Mediakron.ContentManager.Edit({
//                     parent: view.parent,
//                     viewtype: view.type,
//                     child: view.child,
//                     data: data,
//                     type: 'item'
//                 });
//                 Mediakron.controller.gotoAdmin(contentview);
//                 return false;
//         }
//
//         return true;
//     },
//     save: function() {
//         this.parent.add(this.child, this.data);
//         this.parent.save();
//         Mediakron.controller.gotoLast();
//         Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
//     }
// });
