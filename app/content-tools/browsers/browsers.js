Mediakron.ContentBrowser.Public = Mediakron.ContentBrowser.View.extend({
    className: 'public-browser',
    template: JST['components.browsers.content.public'],
    title: 'Browse',
    context: 'public',
    help: ''
});

Mediakron.ContentBrowser.rowPublic = Mediakron.ContentBrowser.Row.extend({
    events: {}
});