import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./browser-mycontent.html";

var view = false;

export default class BrowserMycontent extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'BrowserMycontent',
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

/*

Mediakron.ContentBrowser.MyContent = Mediakron.ContentBrowser.View.extend({
    className: 'mycontent',
    template: JST['components.browsers.content.mycontent'],
    title: 'My Content',
    context: 'default',
    help: ''
});

*/