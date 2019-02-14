import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./manage-users-row.html";

var view = false;

export default class ManageUsersRow extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'ManageUsersRow',
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
            'change .change-role': 'promoteUser',
            'click .remove-user': 'removeUser',
            'change .activatebc': 'toggleLdap',
        }
    }

    afterrender() {

    }

    toggleLdap(e) {
        var user = this.user,
            view = this,
            target = $(e.currentTarget),
            checked = target.prop('checked');

        $.ajax({
            'url': Mediakron.Data.models.user,
            'type': 'post',
            'data': JSON.stringify({
                username: user.get('username'),
                role: user.get('role'),
                ldap: checked
            }),
            'success': function(data) {
                Mediakron.messages.message('User updated', 'success', 5000, 'bottom');
            },
            'dataType': 'json'
        });
    },
    promoteUser(e) {
        var target = $(e.currentTarget),
            role = target.val(),
            id = target.attr('user'),
            user = Mediakron.users.get(id),
            username = false;
        if (user) {
            username = user.get('email');
        }
        $.ajax({
            'url': Mediakron.Data.models.user,
            'type': 'post',
            'data': JSON.stringify({
                username: username,
                role: role
            }),
            'success': function(data) {
                Mediakron.messages.message('User role saved', 'success', 5000, 'bottom');
            },
            'dataType': 'json'
        });
    },
    removeUser(e) {
        var target = $(e.currentTarget),
            role = target.val(),
            id = target.attr('user'),
            user = Mediakron.users.get(id),
            username = false,
            view = this;
        if (user) {
            username = user.get('name');
        }
        $.ajax({
            'url': Mediakron.Data.models.user + '/' + user.get('id'),
            'type': 'delete',
            'success': function(data) {
                Mediakron.messages.message('User removed from site', 'success', 5000, 'bottom');
                view.remove();
            },
            'dataType': 'json'
        });
    }


}

// @REVIEW then, delete. Original view below

// Mediakron.Admin.UsersRow = Mediakron.Extensions.View.extend({
//     template: JST['settings.user.row'],
//     tagName: 'tr',
//     initialize: function(data) {
//         this.user = data.user;
//     },
//     render: function() {
//         var content = this.user.toJSON();
//         content.user = this.user;
//         this.$el.html(this.template(content));
//         $('.user-table tbody').append(this.$el);
//         $('.user-table select').chosen({
//             allow_single_deselect: true,
//             disable_search: true
//         });
//         return this;
//     },
//     events: {
//         'change .change-role': 'promoteUser',
//         'click .remove-user': 'removeUser',
//         'change .activatebc': 'toggleLdap',
//     },
//     toggleLdap: function(e) {
//         var user = this.user,
//             view = this,
//             target = $(e.currentTarget),
//             checked = target.prop('checked');
//
//         $.ajax({
//             'url': Mediakron.Data.models.user,
//             'type': 'post',
//             'data': JSON.stringify({
//                 username: user.get('username'),
//                 role: user.get('role'),
//                 ldap: checked
//             }),
//             'success': function(data) {
//                 Mediakron.messages.message('User updated', 'success', 5000, 'bottom');
//             },
//             'dataType': 'json'
//         });
//     },
//     promoteUser: function(e) {
//         var target = $(e.currentTarget),
//             role = target.val(),
//             id = target.attr('user'),
//             user = Mediakron.users.get(id),
//             username = false;
//         if (user) {
//             username = user.get('email');
//         }
//         $.ajax({
//             'url': Mediakron.Data.models.user,
//             'type': 'post',
//             'data': JSON.stringify({
//                 username: username,
//                 role: role
//             }),
//             'success': function(data) {
//                 Mediakron.messages.message('User role saved', 'success', 5000, 'bottom');
//             },
//             'dataType': 'json'
//         });
//     },
//     removeUser: function(e) {
//         var target = $(e.currentTarget),
//             role = target.val(),
//             id = target.attr('user'),
//             user = Mediakron.users.get(id),
//             username = false,
//             view = this;
//         if (user) {
//             username = user.get('name');
//         }
//         $.ajax({
//             'url': Mediakron.Data.models.user + '/' + user.get('id'),
//             'type': 'delete',
//             'success': function(data) {
//                 Mediakron.messages.message('User removed from site', 'success', 5000, 'bottom');
//                 view.remove();
//             },
//             'dataType': 'json'
//         });
//     }
// });
