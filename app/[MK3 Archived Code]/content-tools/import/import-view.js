import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./import.html";

var view = false;

export default class Import extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'Import',
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
            'click .plugin': 'loadPlugin',
            'click .close-button':                      'closeOverlay',
            'click .overlay.opened .overlay-bg':        'closeOverlay'
        }
    }

    afterrender() {

    }

    /**
     * Description
     * @param {object} something
     */
    loadPlugin(e){
        e.preventDefault();
        var id = $(e.currentTarget).attr('plugin-id'),
            plugin = this.plugins[id];
        if(plugin){
            console.log(plugin.require);
            require(plugin.require,function(plugin){
                console.log($('#page-content-wrapper'));
                plugin.render($('#page-content-wrapper'));
            });
            $('.plugin').removeClass('is-active');
            $(e.currentTarget).addClass('is-active');
        }
        return false;

    }

}

// @REVIEW then, delete. Original view below


// Mediakron.Import = {};
//
// Mediakron.Import.Initial = Mediakron.Extensions.View.extend({
//     template: JST['settings.import'],
//     rows: [],
//     plugins:[],
//     initialize: function () {
//         this.plugins = [
//             {
//                 url:"settings/import/images",
//                 require: ["plugins/import/images/images"],
//                 title:"Files"
//             },
//             {
//                 url:"settings/import/csv",
//                 require: ["plugins/import/csv/csv"],
//                 title:"CSV"
//             },
//             {
//                 url:"settings/import/xml",
//                 require: ["plugins/import/xml/xml"],
//                 title:"XML"
//             },
//             /*{
//                 url:"settings/import/omeka",
//                 require: ["plugins/import/omeka/omeka"],
//                 title:"Omeka"
//             },
//             {
//                 url:"settings/import/json",
//                 require: ["plugins/import/json/json"],
//                 title:"Json"
//             },
//
//             {
//                 url:"settings/import/rss",
//                 require: ["plugins/import/rss"],
//                 title:"RSS"
//             },*/
//             {
//                 url:"settings/import/mediakron2",
//                 require: ["plugins/import/mediakron2/mediakron2"],
//                 title:"Mediakron2",
//             }
//
//         ];
//     },
//     render: function () {
//         this.$el.html(this.template(
//             { plugins:this.plugins }
//         ));
//         $('.plugin:first').addClass('is-active'); /* Make the first tab active */
//         return this;
//     },
//     afterRender: function(){
//     },
//     events: {
//         'click .plugin': 'loadPlugin',
//         'click .close-button':                      'closeOverlay',
//         'click .overlay.opened .overlay-bg':        'closeOverlay'
//     },
//     closeOverlay:function(e){
//         Mediakron.controller.closeOverlay();
//     },
//     loadPlugin:function(e){
//         e.preventDefault();
//         var id = $(e.currentTarget).attr('plugin-id'),
//             plugin = this.plugins[id];
//         if(plugin){
//             console.log(plugin.require);
//             require(plugin.require,function(plugin){
//                 console.log($('#page-content-wrapper'));
//                 plugin.render($('#page-content-wrapper'));
//             });
//         $('.plugin').removeClass('is-active');
//         $(e.currentTarget).addClass('is-active');
//         }
//         return false;
//
//     }
// });
