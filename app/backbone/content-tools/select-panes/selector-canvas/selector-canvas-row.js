Mediakron.ContentBrowser.rowLTI = Mediakron.ContentBrowser.Row.extend({
    events: {
        'click a.embed': 'embedLTI',
        'click a.add-link': 'linkLTI',
        'click .bulk-action': 'toggleSelect',
        'click a': Mediakron.linkHandle
    },
    embedLTI: function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var base = Mediakron.Status.ltiReturnUrl;
        var target = $(e.currentTarget).attr('embed');
        if (!target) target = $(e.currentTarget).attr('link');
        if (Mediakron.Status.ltiIntendedUse != 'navigation') {
            location.href = base + '?return_type=iframe&url=' + encodeURIComponent(target) + '&height=600&width=1000';
        } else {
            var title = $(e.currentTarget).attr('title');
            location.href = base + '?return_type=lti_launch_url&url=' + encodeURIComponent(target) + '&target=_blank&text=' + title;
        }
        return false;
    },
    linkLTI: function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var base = Mediakron.Status.ltiReturnUrl;
        var target = $(e.currentTarget).attr('link'),
            title = $(e.currentTarget).attr('title');
        if (Mediakron.Status.ltiIntendedUse != 'navigation') {
            location.href = base + '?return_type=url&url=' + encodeURIComponent(target) + '&target=_blank&text=' + title;
        } else {
            location.href = base + '?return_type=lti_launch_url&url=' + encodeURIComponent(target) + '&target=_blank&text=' + title;
        }
        return false;
    }
});