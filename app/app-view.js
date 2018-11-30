import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./index.html";

var view = false;

class AppView extends MediakronView {
    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'item-page',
        })
    }

    // Cast the html template 
    get template() { 

    return _.template(tpl); }

    /**
     * Intialize the view
     * @param {object} data 
     */
    initialize(data) {
        return this;
    }
    
    /**
     * Render the view
     */
    render() {
        this.$el.html(this.template(this.data));
        return this;
    }

    /**
     * After the render, invoke this function
     */
    afterrender() {
        if (this.item) {
            var view = this.item.getView();
            if (view) {
                view.setElement('#homepage-content');
                $('.home-template--nobanner').addClass('home-content-active');
                view.render();
            }
        }
    }

    /**
     * This must return an object of jQuery Events
     */
    get events() {
        return {
            'click a': Mediakron.linkHandle
        };
    }
};

/**
 * Controller function.  Pass this
 */
export default function Index(){
    var ContentPage = new IndexPage();
    if (ContentPage) {
        Mediakron.controller.goToPage(ContentPage);
    }
}
