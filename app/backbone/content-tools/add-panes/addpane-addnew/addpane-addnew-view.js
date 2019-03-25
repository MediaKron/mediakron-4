import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./content-tools/add-panes/addpane-addnew/addpane-addnew.html";

var view = false;

export default class AddPaneNew extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'classname',
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
      if(data.callback) this.callback = data.callback;
      if(data.cancelCallback) this.cancelCallback = data.cancelCallback;
    }

    /**
     * Render the view
     */
    render() {
      this.$el.html(this.template());
    }

    get events() {
        return {
          'click .add-item li a': 'openEdit',
          'click .add-collection li a': 'openEdit',
          'click #cancel-editing': 'cancel',
          'click #close-settings-context': 'cancel',
          'click .close-button': 'cancel',
          'click .overlay-bg': 'cancel',
          'click .fade-screen-sidebar ': 'cancel'
        }
    }

    openEdit(e){
      var $target = $('.btn', $(e.currentTarget)),
        type = $target.attr('item-attr'),
        build = this;
        var view = new Mediakron.Admin.AddContentPage({
          type: type,
          edit: false,
          callback: build.callback
        });
        view.setElement(this.el);
        view.render().afterRender();
    }

       /**
     * Cancel
     * @param {object} 
     */
    cancel() {
      Mediakron.ContentBrowser.filter.skip = [];
      this.cancelCallback();
      Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
      return false;
    }

}

// @REVIEW then, delete. Original view below

// Mediakron.ContentBrowser.AddPage = Mediakron.Extensions.View.extend({
//   template: JST['compontents.add-panes.content.addnew'],
//   callback: false,
//   initialize: function(data){
//     if(data.callback) this.callback = data.callback;
//     if(data.cancelCallback) this.cancelCallback = data.cancelCallback;
//   },
//   render:function(){
//     this.$el.html(this.template());
//   },
//   afterRender:function(){
    
//   },
//   events: {
//     'click .add-item li a': 'openEdit',
//     'click .add-collection li a': 'openEdit',
//     'click #cancel-editing': 'cancel',
//     'click #close-settings-context': 'cancel',
//     'click .close-button': 'cancel',
//     'click .overlay-bg': 'cancel',
//     'click .fade-screen-sidebar ': 'cancel'
//   },
//   openEdit:function(e){
//     var $target = $('.btn', $(e.currentTarget)),
//       type = $target.attr('item-attr'),
//       build = this;
//       console.log(type);
//       var view = new Mediakron.Admin.AddContentPage({
//         type: type,
//         edit: false,
//         callback: build.callback
//       });
//       view.setElement(this.el);
//       view.render().afterRender();
//   },
//   cancel: function() {
//     Mediakron.ContentBrowser.filter.skip = [];
//     this.cancelCallback();
//     Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
//     return false;
//   }
// });

