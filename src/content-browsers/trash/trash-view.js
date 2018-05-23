Mediakron.Admin.Trashcan = Mediakron.Extensions.View.extend({
    template: JST['settings.trash'],
    initialize: function(data) { 
      console.log(data);
      this.data = data.trash;
    },
    render: function() {
        var view = this;
        console.log(this.data);
        view.$el.html(view.template({
          trash: this.data
        }));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #cancel-editing': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click .restore': 'restore'
    },
    restore: function(e) {
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
});