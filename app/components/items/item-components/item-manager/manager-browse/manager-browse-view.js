/**
 * Build the browse interface for the content manager
 */
Mediakron.ContentManager.Browse = Mediakron.ContentManager.Default.extend({
    template: JST['settings.content.manager.browse'],
    bindpoint: '.browser-bind',
    afterRender: function(data) {
        var view = this;
        var viewdata = {
            'context': false,
            'filters': false,
            'skip': this.parent.skips(),
            'disabled': [
                "image",
                "video",
                "story",
                "file",
                "audio",
                "narrative",
                "slideshow",
                "folder",
                "progression",
                "comparison",
                "map",
                "maptimeline",
                "timeline"
            ],
            'callback': function(model) {
                view.child = model;
                view.model = model;
                var valid = view.validate(model, {});
                if (valid) {
                    view.save();
                }
            },
            'cancelCallback': function(item) {
                view.cancel();
            }
        };
        selector = new Mediakron.ContentBrowser.Selector(viewdata);
        selector.setElement(this.bindpoint);
        selector.render();
        selector.afterRender();
    }
});