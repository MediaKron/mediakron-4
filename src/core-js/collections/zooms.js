

Mediakron.Collections.ZoomLevels = Backbone.Collection.extend({
    model: Mediakron.ZoomLevel,
    next: function (model) {
        var i = this.at(this.indexOf(model));
        if (undefined === i || i < 0) return false;
        return this.at(this.indexOf(model) + 1);
    },
    prev: function (model) {
        if (undefined === i || i < 1) return false;
        return this.at(this.indexOf(model) - 1);
    }
});

