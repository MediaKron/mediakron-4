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