Mediakron.Admin.UsersPage = Mediakron.Extensions.View.extend({
    template: JST['settings.users'],
    initialize: function() {
        var view = this;
        Mediakron.users.fetch({
            success: function(collection, data) {
                Mediakron.groups.fetch({
                    success: function(collection, data) {
                        view.whenReady();
                    }
                });
            }
        });
    },
    render: function() {
        $(this.el).html(this.template());
        return this;
    },
    afterRender: function() {
        $('#manage-users select').chosen({
            allow_single_deselect: true,
            disable_search: true
        });
    },
    whenReady: function() {
        var row;
        $('.groups-table tbody').empty();
        $('.user-table tbody').empty();
        Mediakron.users.each(function(user) {
            row = new Mediakron.Admin.UsersRow({
                user: user
            });
            row.render();
        });
        Mediakron.groups.each(function(group) {
            row = new Mediakron.Admin.GroupRow({
                group: group
            });
            row.render();
        });
    },
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click .tab-link': 'tab',
        'click #btn-add-new-user': 'addUsers',
        'click #btn-add-group': 'addGroup',
        'click .expander-trigger': 'expand'
    },
    expand: function(e) {
        $(e.currentTarget).toggleClass("expander-hidden");
        $('.expander .chosen-container-single-nosearch').css('width,7em');
    },
    addGroup: function() {
        var group = $('#group-id').val(),
            role = $('#group-role').val(),
            view = this;
        $.ajax({
            'url': Mediakron.Data.models.group,
            'type': 'post',
            'data': JSON.stringify({
                group: group,
                role: role
            }),
            'success': function(data) {
                Mediakron.messages.message('Group Saved', 'success', 5000, 'bottom');
                Mediakron.groups.fetch({
                    success: function() {
                        view.whenReady();
                        $('#group-id').val('');
                    }
                });
            },
            'dataType': 'json'
        });
    },
    addUsers: function() {
        var userlist = $('#addUsers').val().split("\n"),
            count = userlist.length,
            u = 0,
            users = [],
            role = $('#addUsersRole').val(),
            saved = 0,
            view = this,
            errored = false,
            username;
        var success = function(data) {
                saved++;
            };
        var fail = function(data) {
                saved++;
                errored = true;
                Mediakron.messages.message(username + " might not be a valid bc user email. Please use the form bcuserid@bc.edu", 'success', 10000, 'bottom');
            };
        for (u; u < count; u++) {
            username = userlist[u];
            $.ajax({
                'url': Mediakron.Data.models.user,
                'type': 'post',
                'data': JSON.stringify({
                    username: username,
                    role: role
                }),
                'success': success,
                'dataType': 'json'
            }).fail(fail);
        }
        var check = setInterval(function() {
            if (saved == count) {
                if (!errored) {
                    Mediakron.messages.message('All users saved', 'success', 5000, 'bottom');
                    Mediakron.users.fetch({
                        success: function() {
                            view.whenReady();
                            $('#addUsers').val('');
                        }
                    });
                } else {
                    Mediakron.messages.message('We encountered an error.  Please check the email addresses', 'warning', 10000, 'bottom');
                }
                clearInterval(check);
            }
        }, 100);
    },
    tab: function(e) {
        e.preventDefault();
        var target = $(e.currentTarget),
            open = $('.tab-content.is-open'),
            closed = $('.tab-content:not(.is-open)');
        if (target.hasClass('is-active')) {} else {
            open.removeClass('is-open').hide();
            closed.addClass('is-open').show();
            $('.tab-link.is-active').removeClass('is-active');
            target.addClass('is-active');
        }
        return false;
    },
});

Mediakron.Admin.UsersRow = Mediakron.Extensions.View.extend({
    template: JST['settings.user.row'],
    tagName: 'tr',
    initialize: function(data) {
        this.user = data.user;
    },
    render: function() {
        var content = this.user.toJSON();
        content.user = this.user;
        this.$el.html(this.template(content));
        $('.user-table tbody').append(this.$el);
        $('.user-table select').chosen({
            allow_single_deselect: true,
            disable_search: true
        });
        return this;
    },
    events: {
        'change .change-role': 'promoteUser',
        'click .remove-user': 'removeUser',
        'change .activatebc': 'toggleLdap',
    },
    toggleLdap: function(e) {
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
    promoteUser: function(e) {
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
    removeUser: function(e) {
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
});
Mediakron.Admin.GroupRow = Mediakron.Extensions.View.extend({
    template: JST['settings.group.row'],
    tagName: 'tr',
    initialize: function(data) {
        this.group = data.group;
    },
    render: function() {
        var content = this.group.toJSON();
        content.group = this.group;
        this.$el.html(this.template(content));
        $('.groups-table tbody').append(this.$el);
        $('.groups-table select').chosen({
            allow_single_deselect: true,
            disable_search: true
        });
        return this;
    },
    events: {
        'change .change-role': 'promoteGroup',
        'click .remove-group': 'removeGroup'
    },
    promoteGroup: function(e) {
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
    removeGroup: function(e) {
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
});