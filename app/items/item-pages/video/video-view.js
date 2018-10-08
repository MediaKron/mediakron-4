import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./templates/default.html";

var view = false;

export default class Video extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'item-page',
            layout: false,
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
    initialize(model) {
        this.model = model;
    }

    /**
     * Render the view
     */
    render() {
        if (this.layout) {
            this.template = JST['pages.video.' + this.layout];
        } else if (this.model.get('template')) {
            this.template = JST['pages.video.' + this.model.get('template')];
        }
        var content = this.model.toJSON();
        content.renderedVideo = this.model.getVideo();
        if (this.model.comparison) content.comparison = this.model.comparison;
        content.model = this.model;
        content.item = this.model;
        this.$el.html(this.template(content));
        return this;
    }

    /**
     * Remove
     */
    remove() {
        // custom cleanup or closing code, here
        $('video, audio').each(function() {
            if ($(this)[0]) {
                if ($(this)[0].player) {
                    $(this)[0].player.pause();
                }
            }
        });
        // call the base class remove method 
        Backbone.View.prototype.remove.apply(this, arguments);
    },

    get events() {
        return {
            'click a': Mediakron.linkHandle,
            'click .panel-heading': Mediakron.sidebarPanelOpen,
            'click .panel-body a': Mediakron.linkHandle,
            'click #toggleSidebar': Mediakron.sidebarHandle,
            'click .remove': 'removeFromComparison',
            'click .comparison-description-button': 'showCompareDescription',
            'click .js-expandmore': 'showHideHelp'
        }
    }

    afterrender() {
        this.model.getSidebar(this.$el);
        $(".annotate img", this.$el).annotateImage({
            editable: true,
            model: this.model,
            notes: this.model.getRelationship('annotations')
        });
        var video = this.model.get('video');
        if (video.type == 'bc') {
            var $iframe = $('iframe#iframe-for-' + this.model.get('uri')),
                height = $iframe.height(),
                width = $iframe.width(),
                url = video.url;
            if (url.indexOf('?') != -1) {
                url = url + '&height=' + height + '&width=' + width;
            } else {
                url = url + '?height=' + height + '&width=' + width;
            }
            $iframe.attr('src', url);
        }
        this.model.loadVideo();
        
        /* Load accessible dropdown menu plugin  */
        accessibleNav();
    }

    /**
     * showCompareDescription
     * @param {object} something 
     */
    showCompareDescription() {
        $('.comparison-description', this.$el).toggleClass('hidden');
      }

    /**
     * showHideHelp
     * @param {object} something 
     */
    showHideHelp() {
    $('.js-to_expand').toggleClass('hidden');
    }

    /**
     * removeFromComparison
     * @param {object} something 
     */
    removeFromComparison() {
        this.model.comparison.remove(this.model, false);
        this.model.comparison.save();
    }
}

// @REVIEW then, delete. Original view below


// Mediakron.Pages.video = Mediakron.Extensions.View.extend({
//     template: JST['pages.video.default'],
//     className: 'item-page',
//     layout: false,
//     initialize: function(model) {
//         this.model = model;
//     },
//     render: function() {
//         if (this.layout) {
//             this.template = JST['pages.video.' + this.layout];
//         } else if (this.model.get('template')) {
//             this.template = JST['pages.video.' + this.model.get('template')];
//         }
//         var content = this.model.toJSON();
//         content.renderedVideo = this.model.getVideo();
//         if (this.model.comparison) content.comparison = this.model.comparison;
//         content.model = this.model;
//         content.item = this.model;
//         this.$el.html(this.template(content));
//         return this;
//     },
//     remove: function() {
//         // custom cleanup or closing code, here
//         $('video, audio').each(function() {
//             if ($(this)[0]) {
//                 if ($(this)[0].player) {
//                     $(this)[0].player.pause();
//                 }
//             }
//         });
//         // call the base class remove method 
//         Backbone.View.prototype.remove.apply(this, arguments);
//     },
//     afterRender: function() {
//         this.model.getSidebar(this.$el);
//         $(".annotate img", this.$el).annotateImage({
//             editable: true,
//             model: this.model,
//             notes: this.model.getRelationship('annotations')
//         });
//         var video = this.model.get('video');
//         if (video.type == 'bc') {
//             var $iframe = $('iframe#iframe-for-' + this.model.get('uri')),
//                 height = $iframe.height(),
//                 width = $iframe.width(),
//                 url = video.url;
//             if (url.indexOf('?') != -1) {
//                 url = url + '&height=' + height + '&width=' + width;
//             } else {
//                 url = url + '?height=' + height + '&width=' + width;
//             }
//             $iframe.attr('src', url);
//         }
//         this.model.loadVideo();
        
//         /* Load accessible dropdown menu plugin  */
//         accessibleNav();
//     },
//     events: {
//         'click a': Mediakron.linkHandle,
//         'click .panel-heading': Mediakron.sidebarPanelOpen,
//         'click .panel-body a': Mediakron.linkHandle,
//         'click #toggleSidebar': Mediakron.sidebarHandle,
//         'click .remove': 'removeFromComparison',
//         'click .comparison-description-button': 'showCompareDescription',
//         'click .js-expandmore': 'showHideHelp'
//     },
//     showCompareDescription: function() {
//       $('.comparison-description', this.$el).toggleClass('hidden');
//     },
//     showHideHelp: function() {
//       $('.js-to_expand').toggleClass('hidden');
//     },
//     removeFromComparison: function() {
//         this.model.comparison.remove(this.model, false);
//         this.model.comparison.save();
//     }
// });