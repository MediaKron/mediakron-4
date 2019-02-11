import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./quick-folder.html";

var view = false;

export default class QuickFolder extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'QuickFolder',
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
            'click a': Mediakron.linkHandle,
            'click .cancel': 'cancel',
            'click .save': 'save',
            'click #remove-folder': 'removeFolder'
        }
    }

    afterrender() {

    }

    cancel() {
        this.$el.empty();
    },
    removeFolder(){
        console.log('removing');
        this.$el.empty();
    },
    save() {
        Mediakron.message.pending('Creating Folder');
        var view = this;
        var category = new Mediakron.Models.Item({
            'title': $('.title', this.$el).val(),
            'type': 'folder'
        });
        category.color(this.color);
        category.save({}, {
            success() {
                Mediakron.message.success('Folder Created');
                view.$el.empty();
                view.callback(category);
            }
        });

    }
}

// @REVIEW then, delete. Original view below
// Mediakron.ContentManager.QuickFolderAdd = Mediakron.Extensions.View.extend({
//     template: JST['widgets.quick.folder'],
//     el: '#folder-quick-add',
//     callback: false,
//     color: '#000000',
//     initialize(data) {
//         this.callback = data.callback;
//         this.$el.empty();
//         this.render();
//         var view = this;
//         $('.new-color', this.$el).spectrum({
//             showPaletteOnly: true,
//             hideAfterPaletteSelect: true,
//             togglePaletteOnly: true,
//             togglePaletteMoreText: 'more',
//             togglePaletteLessText: 'less',
//             clickoutFiresChange: true,
//             preferredFormat: "hex",
//             showInput: true,
//             palette: [
//                 ["#030303", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
//                 ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
//                 ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
//                 ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
//                 ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
//                 ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
//                 ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
//                 ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
//             ],
//             change(color) {
//                 view.color = color.toHexString();
//             }
//         });
//     },
//     afterInit(data) {},
//     render() {
//         this.$el.html(this.template(this.renderData));
//         console.log($('#remove-folder'));
//     },
//     events: {
//         'click a': Mediakron.linkHandle,
//         'click .cancel': 'cancel',
//         'click .save': 'save',
//         'click #remove-folder': 'removeFolder'
//     },
//     cancel() {
//         this.$el.empty();
//     },
//     removeFolder(){
//         console.log('removing');
//         this.$el.empty();
//     },
//     save() {
//         Mediakron.message.pending('Creating Folder');
//         var view = this;
//         var category = new Mediakron.Models.Item({
//             'title': $('.title', this.$el).val(),
//             'type': 'folder'
//         });
//         category.color(this.color);
//         category.save({}, {
//             success() {
//                 Mediakron.message.success('Folder Created');
//                 view.$el.empty();
//                 view.callback(category);
//             }
//         });
//
//     }
//
// });
