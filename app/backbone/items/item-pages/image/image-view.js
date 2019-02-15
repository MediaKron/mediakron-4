import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./templates/default.html";

var view = false;

export default class Image extends MediakronView {

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
            this.template = JST['pages.image.' + this.layout];
            if (this.layout == 'comparison') {
                this.annotate = 'minimal';
            }
        } else if (this.model.get('template')) {
            this.template = JST['pages.image.' + this.model.get('template')];
        }
        var content = this.model.toJSON();
        if (this.model.comparison) {
            content.comparison = this.model.comparison;
        }
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
        $(".annotate img", this.$el).annotateImage({
            editable: true,
            zoomType: this.annotate,
            model: this.model,
            notes: this.model.getRelationship('annotations')
        });
        
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
     * removeFromComparison
     * @param {object} something 
     */
    removeFromComparison() {
        this.model.comparison.remove(this.model, false);
        this.model.comparison.save();
    }
}

}

// @REVIEW then, delete. Original view below

// Mediakron.Pages.image = Mediakron.Extensions.View.extend({
//     template: JST['pages.image.default'],
//     className: 'item-page',
//     layout: false,
//     annotate: 'full',
//     initialize: function(model) {
//         this.model = model;
//     },
//     render: function() {
//         if (this.layout) {
//             this.template = JST['pages.image.' + this.layout];
//             if (this.layout == 'comparison') {
//                 this.annotate = 'minimal';
//             }
//         } else if (this.model.get('template')) {
//             this.template = JST['pages.image.' + this.model.get('template')];
//         }
//         var content = this.model.toJSON();
//         if (this.model.comparison) {
//             content.comparison = this.model.comparison;
//         }
//         content.model = this.model;
//         content.item = this.model;
//         this.$el.html(this.template(content));
//         return this;
//     },
//     afterRender: function() {
//         this.model.getSidebar(this.$el);
//         $(".annotate img", this.$el).annotateImage({
//             editable: true,
//             zoomType: this.annotate,
//             model: this.model,
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



