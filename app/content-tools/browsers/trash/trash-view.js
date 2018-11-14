import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./trash.html";

var view = false;

export default class Trash extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'Trash',
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
            'click .close-button': Mediakron.Edit.cancelEdit,
            'click #cancel-editing': Mediakron.Edit.cancelEdit,
            'click .overlay-bg': Mediakron.Edit.cancelEdit,
            'click .restore': 'restore'
        }
    }

    afterrender() {

    }

    /**
     * Description
     * @param {object} something
     */
    restore(e) {
        Mediakron.message({
            text: 'Restoring item',
            type: 'success',
            timeout: 4000,
            layout: 'bottom'
        });
        var uri = $(e.currentTarget).attr('uri');
        $.ajax({
            url: Mediakron.Data.models.items + '/' + uri + '?trash=1',
            type: 'PUT',
            success: function(data) {
                Mediakron.router.navigate('browse', {
                    trigger: true
                });
                window.location.reload();
            }
        });
    }

}

// @REVIEW then, delete. Original view below

// Mediakron.Admin.Trashcan = Mediakron.Extensions.View.extend({
//     template: JST['settings.trash'],
//     initialize: function(data) {
//       console.log(data);
//       this.data = data.trash;
//     },
//     render: function() {
//         var view = this;
//         console.log(this.data);
//         view.$el.html(view.template({
//           trash: this.data
//         }));
//         return this;
//     },
//     afterRender: function() {},
//     events: {
//         'click a': Mediakron.linkHandle,
//         'click .close-button': Mediakron.Edit.cancelEdit,
//         'click #cancel-editing': Mediakron.Edit.cancelEdit,
//         'click .overlay-bg': Mediakron.Edit.cancelEdit,
//         'click .restore': 'restore'
//     },
//     restore: function(e) {
//         Mediakron.message({
//             text: 'Restoring item',
//             type: 'success',
//             timeout: 4000,
//             layout: 'bottom'
//         });
//         var uri = $(e.currentTarget).attr('uri');
//         $.ajax({
//           url: Mediakron.Data.models.items + '/' + uri + '?trash=1',
//           type: 'PUT',
//           success: function(data) {
//             Mediakron.router.navigate('browse', {
//                 trigger: true
//             });
//             window.location.reload();
//           }
//         });
//     }
// });