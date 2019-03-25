


import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./browser-archived.html";

var view = false;

export default class BrowserArchived extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'BrowserArchived',
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
Mediakron.ContentBrowser.Archived = Mediakron.ContentBrowser.View.extend({
    template: JST['components.browsers.content'],
    title: 'Archived Content',
    context: 'default',
    help: ''
});
*/