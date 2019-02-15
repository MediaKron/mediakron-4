import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./active-editors.html";

var view = false;
export default class AdminPoll extends MediakronView {
    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            el: '#poll',
        })
    }

    // Cast the html template 
    get template() { 
        return _.template(tpl); 
    }

    /**
     * 
     * @param {object}  
     */
    initialize() {
        if (!Mediakron.Status.lastPoll) {
            Mediakron.Status.lastPoll = 1;
        }
        this.updated = Mediakron.items.filter(function(item){
          return item.changedSince();
        });
        this.created = Mediakron.items.filter(function(item){
          return item.newSince();
        });
    }

    /**
     * Render the view
     */
    render() {
        var view = this;
        setInterval(function() {
            view.poll();
        }, 10000);
        return this;
    }

    get events() {
        return {
            "mouseover #status-indicator": "show",
             "mouseout #status-indicator": "hide",
        }
    }

    afterrender() {
        
    }

    /**
     * Show
     * @param {object} something 
     */
    show() {
        $('#current-editors').removeClass('hide');
    }

    /**
     * Hide
     * @param {object} something 
     */
    hide() {
        $('#current-editors').addClass('hide');
    }

    /**
     * Poll
     * @param {object} something 
     */
    poll() {
        if (!Mediakron.DontPoll) {
            var view = this;
            $.ajax({
                dataType: "json",
                url: Mediakron.Data.poll + '/' + Mediakron.Status.lastPoll + Mediakron.Status.PollQuery,
                success: function(data) {
                    Mediakron.Status.lastPoll = data.time;
                    Mediakron.Status.currentEditors = data.users;
                    Mediakron.Status.currentEditing = data.editing;
                    Mediakron.Status.online = true;
                    var toUpdate;
                    _.each(data.items, function(item) {
                        toUpdate = Mediakron.items.get(item.id);
                        if(toUpdate){
                          if (item.version != toUpdate.get('version')) {
                            toUpdate.set(item);
                            Mediakron.App.Events.trigger('update_content', {});
                          }
                        }else{
                          var model = new Mediakron.Models.Item(item);
                          model.addToCollection();
                          Mediakron.createUrlMap();
                          Mediakron.App.Events.trigger('new_content', {});
                          Mediakron.App.Events.trigger('update_content', {});
                        }
                        
                    });
                    view.$el.html(view.template(data));
                    Mediakron.App.Events.trigger('poll', {});
                    if (Mediakron.Settings.version != data.mediakron_version) {
                        Mediakron.message({
                            text: '<strong>There are some updates to MediaKron.</strong> Please save your work and click <a href="javascript:void window.location.reload()">here</a> to load the new features',
                            type: 'danger',
                            timeout: 0,
                            dismiss: true,
                            layout: 'top'
                        });
                    }
                },
/* Hiding until we have a way to remove message when internet connection has been reestablished */
//                error: function() {
//                    Mediakron.Status.online = false;
//                    Mediakron.message({
//                        text: '<strong>There appears to be a connection issue.</strong> Please check to be sure you are connected to internet.',
//                        type: 'danger',
//                        timeout: 0,
//                        dismiss: true,
//                        layout: 'top'
//                    });
//                }
            });
        }
    }
}

// @REVIEW then, delete. Original view below

// Mediakron.Admin.Poll = Mediakron.Extensions.View.extend({
//     el: '#poll',
//     template: JST['settings.poll'],
//     initialize: function() {
//         if (!Mediakron.Status.lastPoll) {
//             Mediakron.Status.lastPoll = 1;
//         }
//         this.updated = Mediakron.items.filter(function(item){
//           return item.changedSince();
//         });
//         this.created = Mediakron.items.filter(function(item){
//           return item.newSince();
//         });
//     },
//     render: function() {
//         var view = this;
//         setInterval(function() {
//             view.poll();
//         }, 10000);
//         return this;
//     },
//     afterRender: function() {},
//     events: {
//         "mouseover #status-indicator": "show",
//         "mouseout #status-indicator": "hide",
//     },
//     show: function() {
//         $('#current-editors').removeClass('hide');
//     },
//     hide: function() {
//         $('#current-editors').addClass('hide');
//     },
//     poll: function() {
//         if (!Mediakron.DontPoll) {
//             var view = this;
//             $.ajax({
//                 dataType: "json",
//                 url: Mediakron.Data.poll + '/' + Mediakron.Status.lastPoll + Mediakron.Status.PollQuery,
//                 success: function(data) {
//                     Mediakron.Status.lastPoll = data.time;
//                     Mediakron.Status.currentEditors = data.users;
//                     Mediakron.Status.currentEditing = data.editing;
//                     Mediakron.Status.online = true;
//                     var toUpdate;
//                     _.each(data.items, function(item) {
//                         toUpdate = Mediakron.items.get(item.id);
//                         if(toUpdate){
//                           if (item.version != toUpdate.get('version')) {
//                             toUpdate.set(item);
//                             Mediakron.App.Events.trigger('update_content', {});
//                           }
//                         }else{
//                           var model = new Mediakron.Models.Item(item);
//                           model.addToCollection();
//                           Mediakron.createUrlMap();
//                           Mediakron.App.Events.trigger('new_content', {});
//                           Mediakron.App.Events.trigger('update_content', {});
//                         }
                        
//                     });
//                     view.$el.html(view.template(data));
//                     Mediakron.App.Events.trigger('poll', {});
//                     if (Mediakron.Settings.version != data.mediakron_version) {
//                         Mediakron.message({
//                             text: '<strong>There are some updates to MediaKron.</strong> Please save your work and click <a href="javascript:void window.location.reload()">here</a> to load the new features',
//                             type: 'danger',
//                             timeout: 0,
//                             dismiss: true,
//                             layout: 'top'
//                         });
//                     }
//                 },
// /* Hiding until we have a way to remove message when internet connection has been reestablished */
// //                error: function() {
// //                    Mediakron.Status.online = false;
// //                    Mediakron.message({
// //                        text: '<strong>There appears to be a connection issue.</strong> Please check to be sure you are connected to internet.',
// //                        type: 'danger',
// //                        timeout: 0,
// //                        dismiss: true,
// //                        layout: 'top'
// //                    });
// //                }
//             });
//         }
//     }
// });