import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./revisions.html";

var view = false;

export default class Revisions extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'Revisions',
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
            'click .close-button': Mediakron.Edit.cancelEdit,
            'click #cancel-editing': Mediakron.Edit.cancelEdit,
            'click .overlay-bg': Mediakron.Edit.cancelEdit,
            'click .rev-preview-revert': 'triggerRevert'
        }
    }

    afterrender() {

    }

    triggerRevert() {
        uri = this.item.get('uri');
        var obj = this.restoremodel;
        delete obj.uri;
        this.item.set(obj);
        this.item.save();
        Mediakron.message({
            text: 'Reverted to revision',
            type: 'success',
            timeout: 4000,
            layout: 'bottom'
        });
        Mediakron.router.navigate(uri, {
            trigger: true
        });
    }

}

// @REVIEW then, delete. Original view below

// Mediakron.Admin.Revisions = Mediakron.Extensions.View.extend({
//     template: JST['settings.revisions'],
//     rows: JST['settings.revisions.tbody'],
//     statistics: false,
//     tbody: false,
//     attr: false,
//     item: false,
//     initialize(data) {
//         this.item = data.item;
//     },
//     render() {
//         var view = this;
//         view.$el.html(view.template());
//         view.tbody = $('tbody', view.$el);
//         $.getJSON(Mediakron.Data.revisions + '/' + this.item.get('uri'), function(data) {
//             var bind = $('#rev-preview');
//             data.reverse();
//             var revisions = {},
//                 rev;
//             for (var i = 0; i < data.length; i++) {
//                 rev = data[i];
//                 revisions[rev.version] = rev.document;
//             }
//             view.tbody.append(view.rows({
//                 revisions: data
//             }));
//             $('.preview-rev', view.tbody).click(function(e) {
//                 e.preventDefault();
//                 var target = $(e.currentTarget),
//                     version = target.attr('revision'),
//                     document = revisions[version],
//                     obj = JSON.parse(document),
//                     model = new Mediakron.Models.Item(obj),
//                     thisview = model.getView();
//                 view.restoremodel = obj;
//                 $('.rev-preview-window').removeClass('hide');
//                 $('#rev-preview').empty();
//                 thisview.setElement('#rev-preview');
//                 thisview.render();
//                 thisview.afterRender();
//                 return false;
//             });
//             $('.revert-rev', view.tbody).click(function(e) {
//                 e.preventDefault();
//                 var target = $(e.currentTarget),
//                     version = target.attr('revision'),
//                     document = revisions[version],
//                     obj = JSON.parse(document);
//                 delete obj.uri;
//                 view.item.set(obj);
//                 view.item.save();
//                 Mediakron.message({
//                     text: 'Reverted to revision',
//                     type: 'success',
//                     timeout: 4000,
//                     layout: 'bottom'
//                 });
//                 Mediakron.router.navigate(view.item.get('uri'), {
//                     trigger: true
//                 });
//                 return false;
//             });
//             $('.rev-preview-close').click(function() {
//                 $('.rev-preview-window').addClass('hide');
//             });
//         });
//         return this;
//     },
//     afterRender() {},
//     events: {
//         'click a': Mediakron.linkHandle,
//         'click .close-button': Mediakron.Edit.cancelEdit,
//         'click #cancel-editing': Mediakron.Edit.cancelEdit,
//         'click .overlay-bg': Mediakron.Edit.cancelEdit,
//         'click .rev-preview-revert': 'triggerRevert'
//     },
//     triggerRevert() {
//         uri = this.item.get('uri');
//         var obj = this.restoremodel;
//         delete obj.uri;
//         this.item.set(obj);
//         this.item.save();
//         Mediakron.message({
//             text: 'Reverted to revision',
//             type: 'success',
//             timeout: 4000,
//             layout: 'bottom'
//         });
//         Mediakron.router.navigate(uri, {
//             trigger: true
//         });
//     }
// });
