import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./copy-to-site.html";

var view = false;

export default class CopyToSite extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'CopyToSite',
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
            'click a': Mediakron.linkHandle,
            'click .close-button': Mediakron.Edit.cancelEdit,
            'click #cancel-editing': Mediakron.Edit.cancelEdit,
            'click .overlay-bg': Mediakron.Edit.cancelEdit,
            'click #transmit': 'triggerTransmit'
        }
    }

    afterrender() {

    }

    /**
     * Description
     * @param {object} something
     */
    triggerTransmit() {
        var remote = $('#choose-site').val(),
            children = [],
            i = 0,
            count = 0,
            child, childItem, newitem;
        var data = this.item.toJSON();
        delete data._id;
        newitem = new Mediakron.Models.Item();
        newitem.set(data);
        var image = newitem.get('image');
        if (image.uri) {
            image = {
                'local': true,
                'remote': image.uri,
                'site': Mediakron.Settings.uri
            };
            newitem.set('image', image);
        }
        if (this.type == 'file') {
            var text = newitem.get('text');
            if (text.uri) {
                text.local = true;
                text.remote = text.uri;
                text.site = Mediakron.Settings.uri;
                newitem.set('text', text);
            }
        }
        if (this.type == 'video') {
            var video = newitem.get('video');
            if (video.uri) {
                video.local = true;
                video.remote = video.uri;
                video.site = Mediakron.Settings.uri;
                newitem.set('video', video);
            }
        }
        if (this.type == 'audio') {
            var audio = newitem.get('audio');
            if (audio.uri) {
                audio.local = true;
                audio.remote = audio.uri;
                audio.site = Mediakron.Settings.uri;
                newitem.set('audio', audio);
            }
        }

        newitem.url = remote;
        newitem.save({}, { // options
            type: 'post',
            success: function(model){
                Mediakron.messages.message('Item copied to site', 'success', 5000, 'bottom');

            },
            error: function(){
                Mediakron.message({
                    'timeout': 5000,
                    'type': 'danger',
                    'text': 'Item could not be copied',
                    'layout': 'top',
                    'confirm': false,
                    'dismiss': true
                });
            }
        });
    }

}

// @REVIEW then, delete. Original view below

// Mediakron.Admin.Transmit = Mediakron.Extensions.View.extend({
//     template: JST['settings.copy-to-site'],
//     item: false,
//     initialize: function(data) {
//         this.item = data.item;
//         this.type = this.item.getNormalType();
//     },
//     render: function() {
//         var view = this;
//         var content = this.item.toJSON();
//         content.model = this.item;
//         content.sites = Mediakron.user.get('sites');
//         view.$el.html(view.template(content));
//         return this;
//     },
//     afterRender: function() {},
//     events: {
//         'click a': Mediakron.linkHandle,
//         'click .close-button': Mediakron.Edit.cancelEdit,
//         'click #cancel-editing': Mediakron.Edit.cancelEdit,
//         'click .overlay-bg': Mediakron.Edit.cancelEdit,
//         'click #transmit': 'triggerTransmit'
//     },
//     triggerTransmit: function() {
//         var remote = $('#choose-site').val(),
//             children = [],
//             i = 0,
//             count = 0,
//             child, childItem, newitem;
//         var data = this.item.toJSON();
//         delete data._id;
//         newitem = new Mediakron.Models.Item();
//         newitem.set(data);
//         var image = newitem.get('image');
//         if (image.uri) {
//             image = {
//                 'local': true,
//                 'remote': image.uri,
//                 'site': Mediakron.Settings.uri
//             };
//             newitem.set('image', image);
//         }
//         if (this.type == 'file') {
//             var text = newitem.get('text');
//             if (text.uri) {
//                 text.local = true;
//                 text.remote = text.uri;
//                 text.site = Mediakron.Settings.uri;
//                 newitem.set('text', text);
//             }
//         }
//         if (this.type == 'video') {
//             var video = newitem.get('video');
//             if (video.uri) {
//                 video.local = true;
//                 video.remote = video.uri;
//                 video.site = Mediakron.Settings.uri;
//                 newitem.set('video', video);
//             }
//         }
//         if (this.type == 'audio') {
//             var audio = newitem.get('audio');
//             if (audio.uri) {
//                 audio.local = true;
//                 audio.remote = audio.uri;
//                 audio.site = Mediakron.Settings.uri;
//                 newitem.set('audio', audio);
//             }
//         }
//
//         newitem.url = remote;
//         newitem.save({}, { // options
//             type: 'post',
//             success: function(model){
//               Mediakron.messages.message('Item copied to site', 'success', 5000, 'bottom');
//
//             },
//             error: function(){
//               Mediakron.message({
//                 'timeout': 5000,
//                 'type': 'danger',
//                 'text': 'Item could not be copied',
//                 'layout': 'top',
//                 'confirm': false,
//                 'dismiss': true
//             });
//             }
//         });
//     }
// });