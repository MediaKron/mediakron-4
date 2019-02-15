import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./manager-browse.html";

var view = false;

export default class ManagerBrowse extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'ManagerBrowse',
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
            'event target': 'callback'
        }
    }

    afterrender() {

    }

    /**
     * Description
     * @param {object} something
     */
    newName(something) {

    }

}

// @REVIEW then, delete. Original view below


/**
 * Build the browse interface for the content manager
 */
// Mediakron.ContentManager.Browse = Mediakron.ContentManager.Default.extend({
//     template: JST['settings.content.manager.browse'],
//     bindpoint: '.browser-bind',
//     afterRender(data) {
//         var view = this;
//         var viewdata = {
//             'context': false,
//             'filters': false,
//             'skip': this.parent.skips(),
//             'disabled': [
//                 "image",
//                 "video",
//                 "story",
//                 "file",
//                 "audio",
//                 "narrative",
//                 "slideshow",
//                 "folder",
//                 "progression",
//                 "comparison",
//                 "map",
//                 "maptimeline",
//                 "timeline"
//             ],
//             'callback'(model) {
//                 view.child = model;
//                 view.model = model;
//                 var valid = view.validate(model, {});
//                 if (valid) {
//                     view.save();
//                 }
//             },
//             'cancelCallback'(item) {
//                 view.cancel();
//             }
//         };
//         selector = new Mediakron.ContentBrowser.Selector(viewdata);
//         selector.setElement(this.bindpoint);
//         selector.render();
//         selector.afterRender();
//     }
// });
