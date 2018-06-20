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


