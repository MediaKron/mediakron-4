import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./templates/defult.html";

var view = false;

export default class Audio extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'item-page',
            layout: false,
            annotate: 'full',
            onClose: function() {},
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
            this.template = JST['pages.audio.' + this.layout];
            if (this.layout == 'comparison') {
                this.annotate = 'minimal';
            }
        } else if (this.model.get('template')) {
            this.template = JST['pages.audio.' + this.model.get('template')];
        }
        var content = this.model.toJSON();
        content.renderedAudio = this.model.getAudio();
        if (this.model.comparison) content.comparison = this.model.comparison;
        content.model = this.model;
        content.item = this.model;
        this.$el.html(this.template(content));
        return this;
    }

    get events() {
        return {
            'click a': Mediakron.linkHandle,
            'click .panel-heading': Mediakron.sidebarPanelOpen,
            'click .panel-body a': Mediakron.linkHandle,
            'click #toggleSidebar': Mediakron.sidebarHandle,
            'click .remove': 'removeFromComparison',
            'click .comparison-description-button': 'showCompareDescription'
        }
    }

    afterrender() {
        this.model.getSidebar(this.$el);
        this.player = this.model.loadAudio();
        $(".annotate img", this.$el).annotateImage({
            editable: true,
            model: this.model,
            zoomType: this.annotate,
            notes: this.model.getRelationship('annotations')
        });
        
        /* Load accessible dropdown menu plugin  */
        accessibleNav(); 
    }

    /**
     * remove
     * @param {object} something 
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
    }

    /**
     * shore compare description
     * @param {object} something 
     */
    showCompareDescription() {
        $('.comparison-description', this.$el).toggleClass('hidden');
    }

    /**
     * remove from comparison
     * @param {object} something 
     */
    removeFromComparison() {
        this.model.comparison.remove(this.model, false);
        this.model.comparison.save();
    }
}

// @REVIEW then, delete. Original view below

// Mediakron.Pages.audio = Mediakron.Extensions.View.extend({
//     template: JST['pages.audio.default'],
//     className: 'item-page',
//     layout: false,
//     annotate: 'full',
//     onClose: function() {},
//     initialize: function(model) {
//         this.model = model;
//     },
//     render: function() {
//         if (this.layout) {
//             this.template = JST['pages.audio.' + this.layout];
//             if (this.layout == 'comparison') {
//                 this.annotate = 'minimal';
//             }
//         } else if (this.model.get('template')) {
//             this.template = JST['pages.audio.' + this.model.get('template')];
//         }
//         var content = this.model.toJSON();
//         content.renderedAudio = this.model.getAudio();
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
//         this.player = this.model.loadAudio();
//         $(".annotate img", this.$el).annotateImage({
//             editable: true,
//             model: this.model,
//             zoomType: this.annotate,
//             notes: this.model.getRelationship('annotations')
//         });
        
//         /* Load accessible dropdown menu plugin  */
//         accessibleNav();
//     },
//     events: {
//         'click a': Mediakron.linkHandle,
//         'click .panel-heading': Mediakron.sidebarPanelOpen,
//         'click .panel-body a': Mediakron.linkHandle,
//         'click #toggleSidebar': Mediakron.sidebarHandle,
//         'click .remove': 'removeFromComparison',
//         'click .comparison-description-button': 'showCompareDescription'
//     },
//     showCompareDescription: function() {
//         $('.comparison-description', this.$el).toggleClass('hidden');
//     },
//     removeFromComparison: function() {
//         this.model.comparison.remove(this.model, false);
//         this.model.comparison.save();
//     }
// });