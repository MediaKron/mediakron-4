import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./index-templates/basic.html";

var view = false;

class Homepage extends MediakronView {
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
        this.$el.html(this.template(this.data));
        return this;
    }

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

    get events() {
        return {
            'click a': Mediakron.linkHandle
        }
    }
}

export default Index(){
    var item = Mediakron.getItemFromURI(uri);
    if (!Mediakron.Access.check('can restore from trash')) {
        Mediakron.Access.denied();
        return false;
    }
    $('#settings-context').removeClass('opened').addClass('closed');
    Mediakron.message({
        text: 'Retrieving Deleted Items',
        type: 'success',
        timeout: 4000,
        layout: 'bottom'
    });
    $.getJSON(Mediakron.Data.trash, function (data) {
        var ContentPage = new Mediakron.Admin.Trashcan({ 'trash': data });
        if (ContentPage) {
            Mediakron.controller.gotoAdmin(ContentPage);
        }
    });
}
}

// @REVIEW
// Mediakron.Pages.home = Mediakron.Extensions.View.extend({
//     template: JST['pages.welcome.full'],
//     className: 'item-page',
//     data: false,
//     item: false,
//     initialize: function (request) {
//         this.data = Mediakron.Settings.HomePage;
//         var view = this;
//         if (this.data.layout) {
//             if (JST['pages.welcome.' + this.data.layout]) {
//                 this.template = JST['pages.welcome.' + this.data.layout];
//             }

//         }
//         this.item = false;
//         if (request.item) {
//             this.item = request.item;
//         }

//     },
//     events: {
//         'click a': Mediakron.linkHandle
//     },
//     render: function () {
//         this.$el.html(this.template(this.data));
//         return this;
//     },
//     afterRender: function () {
//         if (this.item) {
//             var view = this.item.getView();
//             if (view) {
//                 view.setElement('#homepage-content');
//                 $('.home-template--nobanner').addClass('home-content-active');
//                 view.render();
//             }
//         }
//     }
// });