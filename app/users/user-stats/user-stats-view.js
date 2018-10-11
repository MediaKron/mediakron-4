import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./user-stats.html";

var view = false;

export default class StatisticsPage extends MediakronView {
    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            statistics: false,
            tbody: false,
            attr: false,
        })
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
        var view = this;
        view.$el.html(view.template());
        view.tbody = $('tbody', view.$el);
        $.getJSON(Mediakron.Data.stats, function(data) {
            view.statistics = data.users;
            view.tbody.append(view.rows({
                users: data.users
            }));
            require(["datatables"], function(plugin) {
                $('#admin-site-settings table').dataTable({
                    paginate: false
                });
            });
        });
        return this;
    }

    get events() {
        return {
            'click a': Mediakron.linkHandle,
            'click .close-button': Mediakron.Edit.cancelEdit,
            'click #close-settings-context': Mediakron.Edit.cancelEdit,
            'click .overlay-bg': Mediakron.Edit.cancelEdit
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

// @brad - not sure how to handle rows: JST['settings.statistics.tbody'], 

// @REVIEW then, delete. Original view below

// Mediakron.Admin.StatisticsPage = Mediakron.Extensions.View.extend({
//     template: JST['settings.statistics'],
//     rows: JST['settings.statistics.tbody'], 
//     statistics: false,
//     tbody: false,
//     attr: false,
//     initialize: function() {},
//     render: function() {
//         var view = this;
//         view.$el.html(view.template());
//         view.tbody = $('tbody', view.$el);
//         $.getJSON(Mediakron.Data.stats, function(data) {
//             view.statistics = data.users;
//             view.tbody.append(view.rows({
//                 users: data.users
//             }));
//             require(["datatables"], function(plugin) {
//                 $('#admin-site-settings table').dataTable({
//                     paginate: false
//                 });
//             });
//         });
//         return this;
//     },
//     afterRender: function() {},
//     events: {
//         'click a': Mediakron.linkHandle,
//         'click .close-button': Mediakron.Edit.cancelEdit,
//         'click #close-settings-context': Mediakron.Edit.cancelEdit,
//         'click .overlay-bg': Mediakron.Edit.cancelEdit
//     }
// });