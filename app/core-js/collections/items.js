import Item from "../models/item"
import { base_path, uri } from "../util/url";

export default class Items extends Backbone.Collection{
    constructor(options) {
        super(options);
        this.model = Item;
        this.url = function(){
            return base_path() + '/api/' + uri() +'/item';
        } 
        this.parse = function(response) {
            return response.data;
        }
        this.sortAttribute = "title";
        this.sortDirection = 'asc';
        this.i = 0;
    }

    processSort(sort) {
        var request = sort.split('_');
        if (!request[1]) { this.sortAttribute = sort; }
        else {
            this.sortAttribute = request[0];
            this.sortDirection = request[1];
        }
        return this;
    }

    sortItems(attr, direction) {
        if (!direction) direction = 'asc';
        this.sortAttribute = attr;
        this.sortDirection = direction;
        this.sort();
    }

    updatedItems() {
        var time = Mediakron.user.lastVisit();
        var id = Mediakron.user.get('id');
        var type;
        var items = this.filter(function (item) {
            type = item.getNormalType();
            if (type == 'tag') return false;
            if (item.get('user').id == id) return false; // don't show my items
            if (parseInt(item.get('changed'), 10) > time) {
                // the item has changed since last visit, but only show it here
                // if it was created before last visit
                return parseInt(item.get('created'), 10) < time;
            }
            return false;
        });
        return _.sortBy(items, function (item) {
            return parseInt(item.get('changed'), 10) * -1;
        });
    }


    newItems() {
        var time = Mediakron.user.lastVisit();
        var id = Mediakron.user.get('id');
        var type;
        var items = this.filter(function (item) {
            type = item.getNormalType();
            if (type == 'tag') return false;
            if (item.get('user').id == id) return false; // don't show my items
            return parseInt(item.get('created'), 10) > time;
        });
        return _.sortBy(items, function (item) {
            return parseInt(item.get('created'), 10) * -1;
        });
    }


    changeCount() {
        var time = Mediakron.user.lastVisit();
        var id = Mediakron.user.get('id');
        var type;
        var items = this.filter(function (item) {
            type = item.getNormalType();
            if (type == 'tag') return false;
            if (item.get('user').id == id) return false; // don't show my items
            return parseInt(item.get('changed'), 10) > time;
        });
        return items.length;
    }


    comparator(a, b) {
        a = a.get(this.sortAttribute);
        b = b.get(this.sortAttribute);

        if (a == b) return 0;

        if (this.sortDirection == 'asc') {
            return a > b ? 1 : -1;
        } else {
            return a < b ? 1 : -1;
        }
    }


    loadedSuccess(success) {
        success();
    }


    progressiveFetch(success) {
        var collection = this;
        console.log('progressive');
        this.fetch({
            remove: false,
            data: { start: collection.i * 3000, limit: (collection.i + 1) * 3000 },
            processData: true,
            xhr: Mediakron.Events.xhrProgress,
            success(model, response) {
                collection.i = collection.i + 1;
                console.log(response.length);
                if (response.length != 3000) {
                    collection.loadedSuccess(success);
                } else {
                    collection.progressiveFetch(success);
                }
            }
        });
    }
}