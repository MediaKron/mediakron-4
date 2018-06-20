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