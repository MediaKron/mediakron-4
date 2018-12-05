import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./templatename.html";

var view = false;

export default class SearchSettings extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'SearchSettings',
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
            'click #close-settings-context': Mediakron.Edit.cancelEdit,
            'click .close-button': Mediakron.Edit.cancelEdit,
            'click #index': 'index',
            'click #query': 'runQuery'
        }
    }

    afterrender() {
        var titles = Mediakron.items.map(function(item){ return item.get('title'); }), view = this;
    }

    /**
     * Description
     * @param {object} something
     */
    index(e){
        var items = Mediakron.items, number = items.length, eachPercent = 100/number, percent = 0, view = this;
        $.get( Mediakron.Data.search.initialize, function( data ) {
            items.each(function(item){
                $.post( Mediakron.Data.search.index+item.get('uri'), function( data ) {
                    percent = percent+eachPercent;
                    $('#index-list .progress-bar').width(percent+'%').attr('aria-valuenow',percent);
                    //$( "#response" ).append( view.syntaxHighlight(JSON.stringify(data, undefined, 2)) );
                });
            });
        });
    }

    syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
}

// @REVIEW then, delete. Original view below

// Mediakron.Search.settings = Mediakron.Extensions.View.extend({
//     template: JST['settings.search'],
//     courses: false,
//     popup: false,
//     initialize: function () {
//
//     },
//     substringMatcher: function(strs) {
//         return function findMatches(q, cb) {
//             var matches, substrRegex;
//
//             // an array that will be populated with substring matches
//             matches = [];
//
//             // regex used to determine if a string contains the substring `q`
//             substrRegex = new RegExp(q, 'i');
//
//             // iterate through the pool of strings and for any string that
//             // contains the substring `q`, add it to the `matches` array
//             $.each(strs, function(i, str) {
//                 if (substrRegex.test(str)) {
//                     // the typeahead jQuery plugin expects suggestions to a
//                     // JavaScript object, refer to typeahead docs for more info
//                     matches.push({ value: str });
//                 }
//             });
//
//             cb(matches);
//         };
//     },
//
//     render: function () {
//         this.$el.html(this.template(Mediakron.user.toJSON()));
//         return this;
//     },
//     afterRender:function(){
//         var titles = Mediakron.items.map(function(item){ return item.get('title'); }), view = this;
//     },
//     events: {
//         'click a':                         Mediakron.linkHandle,
//         'click #close-settings-context':   Mediakron.Edit.cancelEdit,
//         'click .close-button':              Mediakron.Edit.cancelEdit,
//         'click #index':                'index',
//         'click #query':                'runQuery'
//     },
//     index: function(e){
//         var items = Mediakron.items, number = items.length, eachPercent = 100/number, percent = 0, view = this;
//         $.get( Mediakron.Data.search.initialize, function( data ) {
//             items.each(function(item){
//                 $.post( Mediakron.Data.search.index+item.get('uri'), function( data ) {
//                     percent = percent+eachPercent;
//                     $('#index-list .progress-bar').width(percent+'%').attr('aria-valuenow',percent);
//                     //$( "#response" ).append( view.syntaxHighlight(JSON.stringify(data, undefined, 2)) );
//                 });
//             });
//         });
//     },
//     syntaxHighlight: function (json) {
//         if (typeof json != 'string') {
//              json = JSON.stringify(json, undefined, 2);
//         }
//         json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
//         return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
//             var cls = 'number';
//             if (/^"/.test(match)) {
//                 if (/:$/.test(match)) {
//                     cls = 'key';
//                 } else {
//                     cls = 'string';
//                 }
//             } else if (/true|false/.test(match)) {
//                 cls = 'boolean';
//             } else if (/null/.test(match)) {
//                 cls = 'null';
//             }
//             return '<span class="' + cls + '">' + match + '</span>';
//         });
//     }
// });