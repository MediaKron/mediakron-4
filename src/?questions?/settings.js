
//@question not sure what to do with this now that the view are broken out
Mediakron.Admin = {
    Organize: {}
};


// @question not sure this got used

Mediakron.Admin.InlineAddPage = Mediakron.Admin.AddPage.extend({
    template: JST['settings.add'],
    initialize: function(data) {
      
    },
    render: function() {
        $(this.el).html(this.template({ 
          inline: true,
          allowed: []
        }));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': 'internalHandle',
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit
    },
    internalHandle: function(event){
      //var $(event.currentTarget)
    }
});