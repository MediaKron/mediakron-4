import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./search-page.html";

var view = false;

export default class SearchPage extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'SearchPage',
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
            'click .search-submit':'doSearch'
        }
    }

    afterrender() {

    }

    /**
     * Description
     * @param {object} something
     */
    doSearch(evt){
        var search = $('#search-field').val();
        var Search = new Mediakron.Search.elasticSearch({}).render();
        Search.search(search,function(){
            console.log('search complete');
        });
        return false;
    }
}

// @REVIEW then, delete. Original view below

// Mediakron.Search.initial =  Backbone.View.extend({
//     template: JST['navigation.search'],
//     el: 'body',
//     initialize: function(){
//         var view = this;
//         view.render();
//         var bestPictures = new Bloodhound({
//           datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
//           queryTokenizer: Bloodhound.tokenizers.whitespace,
//           limit:10,
//           prefetch: {
//               cache: false,
//               url: Mediakron.Data.search.terms
//             }
//         });
//         var typeahead = $('#search-field').typeahead({
//           hint: true,
//           highlight: true,
//           minLength: 1
//         },
//         {
//           name: 'value',
//           display: 'value',
//           source: bestPictures,
//           templates: {
//             header: '<div class="typeahead-header">Common Words:</div>',
//             suggestion: _.compile('<div><strong><%= value %></strong> (<%= count %>)</div>')
//           }
//
//         });
//         $('#search-field').bind('typeahead:selected', function(obj, datum, name) {
//             view.doSearch();
//         });
//
//
//     },
//     render: function(){
//         this.$el.append(this.template());
//         return this;
//     },
//     events: {
//         'click .search-submit':                     'doSearch'
//     },
//     doSearch:function(evt){
//         var search = $('#search-field').val();
//         var Search = new Mediakron.Search.elasticSearch({}).render();
//         Search.search(search,function(){
//             console.log('search complete');
//         });
//         return false;
//     }
// });