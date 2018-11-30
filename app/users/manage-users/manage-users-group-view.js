import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./manage-users-group.html";

var view = false;

export default class ManageUsersGroup extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'ManageUsersGroup',
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
            'change .change-role': 'promoteGroup',
            'click .remove-group': 'removeGroup'
        }
    }

    afterrender() {

    }

    promoteGroup(e) {
        var target = $(e.currentTarget),
            role = target.val(),
            id = target.attr('group'),
            group = Mediakron.groups.get(id),
            username = false;
        if (group) {
            groupname = group.get('name');
        }
        $.ajax({
            'url': Mediakron.Data.models.group,
            'type': 'post',
            'data': JSON.stringify({
                group: groupname,
                role: role
            }),
            'success': function(data) {
                Mediakron.messages.message('Group role saved', 'success', 5000, 'bottom');
            },
            'dataType': 'json'
        });
    },
    removeGroup(e) {
        var target = $(e.currentTarget),
            role = target.val(),
            id = target.attr('group'),
            group = Mediakron.groups.get(id),
            username = false,
            view = this;
        if (group) {
            groupname = group.get('name');
        }
        $.ajax({
            'url': Mediakron.Data.models.group + '/' + group.get('id'),
            'type': 'delete',
            'success': function(data) {
                Mediakron.messages.message('Group removed from site', 'success', 5000, 'bottom');
                view.remove();
            },
            'dataType': 'json'
        });
    }

}
// @REVIEW then, delete. Original view below

// Mediakron.Admin.GroupRow = Mediakron.Extensions.View.extend({
//     template: JST['settings.group.row'],
//     tagName: 'tr',
//     initialize: function(data) {
//         this.group = data.group;
//     },
//     render: function() {
//         var content = this.group.toJSON();
//         content.group = this.group;
//         this.$el.html(this.template(content));
//         $('.groups-table tbody').append(this.$el);
//         $('.groups-table select').chosen({
//             allow_single_deselect: true,
//             disable_search: true
//         });
//         return this;
//     },
//     events: {
//         'change .change-role': 'promoteGroup',
//         'click .remove-group': 'removeGroup'
//     },
//     promoteGroup: function(e) {
//         var target = $(e.currentTarget),
//             role = target.val(),
//             id = target.attr('group'),
//             group = Mediakron.groups.get(id),
//             username = false;
//         if (group) {
//             groupname = group.get('name');
//         }
//         $.ajax({
//             'url': Mediakron.Data.models.group,
//             'type': 'post',
//             'data': JSON.stringify({
//                 group: groupname,
//                 role: role
//             }),
//             'success': function(data) {
//                 Mediakron.messages.message('Group role saved', 'success', 5000, 'bottom');
//             },
//             'dataType': 'json'
//         });
//     },
//     removeGroup: function(e) {
//         var target = $(e.currentTarget),
//             role = target.val(),
//             id = target.attr('group'),
//             group = Mediakron.groups.get(id),
//             username = false,
//             view = this;
//         if (group) {
//             groupname = group.get('name');
//         }
//         $.ajax({
//             'url': Mediakron.Data.models.group + '/' + group.get('id'),
//             'type': 'delete',
//             'success': function(data) {
//                 Mediakron.messages.message('Group removed from site', 'success', 5000, 'bottom');
//                 view.remove();
//             },
//             'dataType': 'json'
//         });
//     }
// });
