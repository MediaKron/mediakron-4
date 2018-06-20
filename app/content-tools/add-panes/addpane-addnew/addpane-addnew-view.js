Mediakron.ContentBrowser.AddPage = Mediakron.Extensions.View.extend({
  template: JST['compontents.add-panes.content.addnew'],
  callback: false,
  initialize: function(data){
    if(data.callback) this.callback = data.callback;
    if(data.cancelCallback) this.cancelCallback = data.cancelCallback;
  },
  render:function(){
    this.$el.html(this.template());
  },
  afterRender:function(){
    
  },
  events: {
    'click .add-item li a': 'openEdit',
    'click .add-collection li a': 'openEdit',
    'click #cancel-editing': 'cancel',
    'click #close-settings-context': 'cancel',
    'click .close-button': 'cancel',
    'click .overlay-bg': 'cancel',
    'click .fade-screen-sidebar ': 'cancel'
  },
  openEdit:function(e){
    var $target = $('.btn', $(e.currentTarget)),
      type = $target.attr('item-attr'),
      build = this;
      console.log(type);
      var view = new Mediakron.Admin.AddContentPage({
        type: type,
        edit: false,
        callback: build.callback
      });
      view.setElement(this.el);
      view.render().afterRender();
  },
  cancel: function() {
    Mediakron.ContentBrowser.filter.skip = [];
    this.cancelCallback();
    Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
    return false;
  }
});

