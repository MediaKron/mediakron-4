import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./templatename.html";

var view = false;

export default class ClassName extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'item-page',
            data: false,
            item: false,
        })
        this.data = {};
        this.data = options;
        if (options.fromRoute) {
            this.fromRoute = true;
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

    /**
     * Description
     * @param {object} something 
     */
    newName(something) {
       
    }

}

// @REVIEW