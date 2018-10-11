import MediakronView from '~/core-js/extensions/views';
import _ from "lodash";
var template = require("./error.html");

/**
 * 
 */
export default class ErrorPage extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super();
        this.errorCode = '404';
    }

    /**
     * 
     */
    get template() { return _.template(template); }

    /**
     * Initialize this with a errorCode integer
     * @param {string} errorCode 
     */
    initialize(errorCode) {
        this.errorCode = errorCode;
        return this;
    }

    /**
     * 
     */
    render() {
        var el = $(this.el).html(this.template({ errorCode: this.errorCode }));
        return this;
    }
}