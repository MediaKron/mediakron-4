/**
 * Define our models
 */
Mediakron.Models = {};

/**
 * 
 */
Mediakron.Models.Model = Backbone.Model.extend({
    folders: {},
    layers: {},
    tags: {},

    initialize: function() {},

    cacheFilters: function() {
        var model = this;
        this.folders = {};
        this.tags = {};
        var topics = this.getRelationship('topics'),
            t = 0,
            l = topics.length,
            loadtopic, topic, type;
        for (t; t < l; t++) {
            topic = topics[t];
            loadtopic = Mediakron.getItemFromURI(topic.uri);
            if (loadtopic) {
                type = topic.get('type');
                if (type == 'tag') {
                    this.tags[topic.uri] = loadtopic;
                } else if (type == 'folder') {
                    this.folders[topic.uri] = loadtopic;
                }
            }
        }
    },

    published: true, // is the model published.  false indicates unpublished

    publish: function() {
        if (this.canPublish()) {
            this.publish = true;
        }
    },

    unpublish: function() {
        if (this.canUnpublish()) {
            this.publish = false;
        }
    },

    archived: false, // is the model published.  false indicates unpublished

    archive: function() {
        if (this.canArchive()) {
            this.archived = true;
        }
    },

    restore: function() {
        if (this.canArchive()) {
            this.archived = false;
        }
    },

    // what access does this user have

    canView: function(hideAlert) {
        var user = this.get('user');
        if (!this.get('published') && user.id == Mediakron.user.get('id') && Mediakron.Access.check('can view own unpublished content')) {
            return true;
        }
        if (!this.get('published') && !Mediakron.Access.check('can view unpublished content')) {
            if (!hideAlert) Mediakron.Access.denied('Sorry, you must login to view that page');
            return false;
        }
        if (Mediakron.Settings.public) { return true; }
        if (!Mediakron.Access.check('can access site')) {
            if (!hideAlert) Mediakron.Access.denied('Sorry, you must login to view that page');
            return false;
        }

        return true;
    },

    canTransmit: function(alert) {
        if (!Mediakron.Access.check('can administer site')) {
            if (alert) Mediakron.Access.denied('Sorry, you must login to send content');
            return false;
        }
        var type = this.getNormalType();
        if (type == 'image' || type == 'file' || type == 'video' || type == 'audio') {
            return true;
        }
        return false;
    },

    canDuplicate: function(alert) {
        if (!Mediakron.Access.check('can create content')) {
            if (alert) Mediakron.Access.denied('Sorry, you must login to duplicate');
            return false;
        }
        return true;
    },

    canDownload: function(alert) {
        if (!Mediakron.Settings.download) {
            if (alert) Mediakron.Access.denied('Sorry, files cannot be downloaded.');
            return true;
        }
        if (!Mediakron.Access.check('can download')) {
            if (alert) Mediakron.Access.denied('Sorry, you must login to view that page');
            return false;
        }

        if (!this.get('published') && !Mediakron.Access.check('can view unpublished content')) {
            if (alert) Mediakron.Access.denied('Sorry, you must login to view that page');
            return false;
        }
        return true;
    },

    canEdit: function(alert) {
        if (!Mediakron.Access.check('can access site')) {
            if (alert) Mediakron.Access.denied('Sorry, you must login to view that page');
            return false;
        }
        var user = this.get('user');
        if (this.get('locked') === true) {
            if (Mediakron.Access.check('can edit any locked content')) {
                return true;
            }
            if (user.id == Mediakron.user.get('id')) {
                return true;
            }
            //          if(alert) Mediakron.Access.denied('This item is locked.  Please contact the author or an administrator to unlock.');
            //          return false;
        }

        if (Mediakron.Access.check('can edit any content')) {
            return true;
        }
        if (Mediakron.Access.check('can edit own content') && user.id == Mediakron.user.get('id')) {
            return true;
        }
        if (alert) Mediakron.Access.denied('Sorry, you must login to view that page');
        return false;
    },
    canLock: function(alert) {
        var user = this.get('user');
        if (this.canEdit(alert)) {
            if (user.id == Mediakron.user.get('id')) return true;
            if (Mediakron.Access.check('can edit any locked content')) { return true; }
        }
        return false;
    },

    canManage: function(alert) {
        var user = this.get('user');
        if (!Mediakron.Access.check('can access site')) {
            if (alert) Mediakron.Access.denied('Sorry, you must login to view that page');
            return false;
        }
        var type = this.get('type');

        if (type == 'image' || type == 'video' || type == 'audio' || type == 'story' || type == 'file' || type == 'text') {
            if (alert) Mediakron.Access.denied('Items cannot be added to this item');
            return false;
        }
        if (this.get('locked') === true) {
            if (Mediakron.Access.check('can edit any locked content')) {
                return true;
            }
            if (user.id == Mediakron.user.get('id')) {
                return true;
            }
            if (alert) Mediakron.Access.denied('This item is locked.  Please contact the author or an administrator to unlock.');
            return false;
        }
        if (Mediakron.Access.check('can edit any content')) {
            return true;
        }
        if (Mediakron.Access.check('can edit own content') && user.id == Mediakron.user.get('id')) {
            return true;
        }
        if (alert) Mediakron.Access.denied('Sorry, you must login to view that page');
        return false;
    },
    canAddTo: function(alert) {
        var user = this.get('user');
        if (!Mediakron.Access.check('can access site')) {
            if (alert) Mediakron.Access.denied('Sorry, you must login to view that page');
            return false;
        }
        var type = this.get('type');

        if (type == 'image' || type == 'video' || type == 'audio' || type == 'story' || type == 'file' || type == 'text') {
            if (alert) Mediakron.Access.denied('Items cannot be added to this item');
            return false;
        }
        if (this.get('locked') === true) {
            if (Mediakron.Access.check('can edit any locked content')) {
                return true;
            }
            if (user.id == Mediakron.user.get('id')) {
                return true;
            }
            if (alert) Mediakron.Access.denied('This item is locked.  Please contact the author or an administrator to unlock.');
            return false;
        }
        if (Mediakron.Access.check('can edit any content')) {
            return true;
        }
        if (Mediakron.Access.check('can add to any collection')) {
            return true;
        }
        if (Mediakron.Access.check('can edit own content') && user.id == Mediakron.user.get('id')) {
            return true;
        }

        if (alert) Mediakron.Access.denied('Sorry, you must login to view that page');
        return false;
    },

    canRemoveFrom: function(alert) {
        var user = this.get('user');
        if (!Mediakron.Access.check('can access site')) {
            if (alert) Mediakron.Access.denied('Sorry, you must login to view that page');
            return false;
        }
        var type = this.get('type');

        if (type == 'image' || type == 'video' || type == 'audio' || type == 'story' || type == 'file' || type == 'text') {
            if (alert) Mediakron.Access.denied('Items cannot be added to this item');
            return false;
        }
        if (this.get('locked') === true) {
            if (Mediakron.Access.check('can edit any locked content')) {
                return true;
            }
            if (user.id == Mediakron.user.get('id')) {
                return true;
            }
            if (alert) Mediakron.Access.denied('This item is locked.  Please contact the author or an administrator to unlock.');
            return false;
        }

        if (Mediakron.Access.check('can edit any content')) {
            return true;
        }
        if (Mediakron.Access.check('can remove from any collection')) {
            return true;
        }
        if (Mediakron.Access.check('can edit own content') && user.id == Mediakron.user.get('id')) {
            return true;
        }

        if (alert) Mediakron.Access.denied('Sorry, you must login to view that page');
        return false;
    },

    canPublish: function(alert) {
        var user = this.get('user');
        if (Mediakron.Access.check('can publish content')) {
            return true;
        }
        if (alert) Mediakron.Access.denied('Sorry, you are not allowed to publish content');
        return false;
    },
    canArchive: function(alert) {
        var user = this.get('user');
        if (Mediakron.Access.check('can archive content')) {
            return true;
        }
        if (alert) Mediakron.Access.denied('Sorry, you are not allowed to archive content');
        return false;
    },
    canUnpublish: function(alert) {
        var user = this.get('user');
        if (this.get('locked') === true) {
            if (Mediakron.Access.check('can edit any locked content')) {
                return true;
            }
            if (user.id == Mediakron.user.get('id')) {
                return true;
            }
            if (alert) Mediakron.Access.denied('This item is locked.  Please contact the author or an administrator to unlock.');
            return false;
        }
        if (Mediakron.Access.check('can unpublish content')) {
            return true;
        }
        if (alert) Mediakron.Access.denied('Sorry, you are not allowed to unpublish content');
        return false;
    },
    canDestroy: function(alert) {
        var user = this.get('user');
        if (this.get('locked') === true) {
            if (Mediakron.Access.check('can edit any locked content')) {
                return true;
            }
            if (user.id == Mediakron.user.get('id')) {
                return true;
            }
            if (alert) Mediakron.Access.denied('This item is locked.  Please contact the author or an administrator to unlock.');
            return false;
        }
        if (Mediakron.Access.check('can delete content')) {
            return true;
        }
        if (alert) Mediakron.Access.denied('Sorry, you are not allowed to delete content');
        return false;
    },

    downloadable: function() {
        if (!Mediakron.Settings.download) { return false; }
        var type = this.getNormalType();

        switch (type) {
            case 'image':
            case 'file':
            case 'text':
            case 'story':
                return true;
            default:
                return false;
        }
    },

    canOrganize: function() {
        var type = this.getNormalType();

        switch (type) {
            case 'map':
            case 'timeline':
            case 'slideshow':
            case 'tag':
            case 'narrative':
            case 'comparison':
            case 'progression':
            case 'folder':
            case 'walkingmap':
                return true;
            default:
                return false;
        }
    },
    cartoDB: function() {
        var map = this.get('map'),
            type = this.get('type');
        if (type != 'cartodb') return '';
        if (map.url) {
            return map.url;
        }
        return '';
    },
    duplicate: function() {
        var data = this.toJSON();
        delete data.id;
        delete data.uri;
        var newitem = new Mediakron.Models.Item();
        newitem.save(data, {
            success: function(model) {
                model.addToCollection();
                Mediakron.createUrlMap();
                Mediakron.messages.message('Item Duplicated', 'success', 5000, 'bottom');
                Mediakron.router.navigate('browse', {
                    trigger: true
                });
            }
        });
    },

    metadata: function(id) {
        var metadata = this.get('metadata');
        if (metadata[id]) {
            return metadata[id];
        } else {
            return "";
        }
    },
    getClasses: function() {
        var classes = '';
        if (this.get('published')) {
            classes = classes + ' published';
        } else {
            classes = classes + ' unpublished';
        }
        if (this.get('archived')) {
            classes = classes + ' archived';
        }
        return classes;
    },

    getStatus: function() {
        var status = '';
        if (!this.get('published')) {
            status = status + ' <span class="unpublished-append"><span class="mk-icon mk-unpublish"></span><span class="status-text">Unpublished</span></span>';
        }
        if (this.get('archived')) {
            status = status + ' <span class="archived-append"> <span class="mk-icon mk-archive"></span><span class="status-text">Archived</span></span>';
        }
        if (this.get('locked') && this.canEdit(false)) {
            status = status + ' <span class="locked-append tooltip--w" data-tooltip="This item is locked"> <span class="mk-icon mk-lock"></span><span class="status-text">Locked</span></span>';
        }

        return status;
    },

    getStoryTeaser: function() {
        teaser = '';
        if (this.get('type') == 'story') {
            var body = this.get('body'),
                i = 0,
                length = body.length;
            if (length > 0) {
                for (i; i < length; i++) {
                    if (body[i].tag == 'p') {
                        if (body[i].content) {
                            teaser += body[i].content;
                        }
                    }
                    if (teaser.length > 300) break;
                }
            }
        }

        return teaser.substring(0, 300);
    },

    getPopup: function(template, options) {
        if (!options) options = {};
        var jst = JST['popup.default'];
        if (template) {
            if (JST['popup.' + template]) {
                jst = JST['popup.' + template];
            }
        }
        options.item = this;
        return jst(options);
    },

    getLTIEmbed: function() {
        var url = '',
            type = this.get('type'),
            id = this.id,
            uri = this.get('uri');
        return Mediakron.Settings.url + '/lti/' + uri;
    },

    getFullUrl: function() {
        var url = '',
            type = this.get('type'),
            id = this.id,
            uri = this.get('uri');
        return Mediakron.Settings.url + '/' + uri;
    },

    /* Get a link to this topic */
    getLink: function() {
        var url = this.getURL(),
            title = this.get('title');
        return Mediakron.Theme.link(title, url);
    },


    getContextPopover: function(context, go) {
        var url = this.getURL(),
            title = this.get('title');
        if (context) {
            url = context + '/' + url;
        } else if (Mediakron.context && Mediakron.context.item) {
            url = Mediakron.context.item.get('uri') + '/' + url;
        } else {
            url = url;
        }
        if (go) {
            url = url;
        }
        return '<a href="' + url + '" data-toggle="popover" title="' + title + '" >' + title + '</a><div class="popover-content">' + this.getPopup() + '</div>';
    },

    getContextLink: function(context, go, urlOnly) {
        var url = this.getURL(),
            title = this.get('title');
        if (context) {
            var breadcrumb = Mediakron.controller.breadcrumb,
                length = breadcrumb.length,
                i = 0,
                item, uri, newurl = '';
            if (length > 0) {
                for (i; i < length; i++) {
                    uri = breadcrumb[i].get('uri');
                    newurl = newurl + breadcrumb[i].get('uri') + '/';
                    if (uri == context) {
                        break;
                    }
                }
                url = newurl + url;
            } else {
                url = context + '/' + url;
            }
        } else if (Mediakron.context && Mediakron.context.item) {
            url = Mediakron.context.item.get('uri') + '/' + url;
        } else {
            url = url;
        }
        if (go) {
            url = url;
        }
        if (urlOnly) return url;
        return Mediakron.Theme.link(title, url);
    },
    overlayType: function(type) {
        var overlay = this.getMapOverlay();
        if (overlay.type) {
            return overlay.type;
        }
        return false;
    },
    overlayTitle: function(title) {
        var overlay = this.getMapOverlay();
        if (overlay.title) {
            return overlay.title;
        }
        return '';
    },
    overlayUrl: function(url) {
        var overlay = this.getMapOverlay();
        if (overlay.url) {
            return overlay.url;
        }
        return '';
    },
    overlayFile: function(url) {
        var overlay = this.getMapOverlay();
        if (overlay.file) {
            return Mediakron.Settings.filepath + overlay.file;
        }
        return false;
    },
    overlayFileName: function(url) {
        var overlay = this.getMapOverlay();
        if (overlay.name) {
            return overlay.name;
        }
        return false;
    },
    getMapOverlay: function() {
        var overlay = this.get('overlay');
        return overlay;
    },
    getContextLinkTo: function(context) {
        var url = this.getURL(),
            title = this.get('title');
        if (typeof(context) == 'string') {
            url = context + '/' + url;
            title = Mediakron.getItemFromURI(context).get('title');
        } else if (typeof(context) == 'object') {
            url = context.get('uri') + '/' + url;
            title = context.get('title');
        } else if (Mediakron.context) {
            url = Mediakron.context.item.get('uri') + '/' + url;
            title = Mediakron.context.item.get('title');
        } else {
            url = url;
        }
        return Mediakron.Theme.link(title, url);
    },

    getCrumbLink: function(t) {
        var length = Mediakron.controller.uri.length,
            i = 0,
            uri = this.get('uri'),
            url = '',
            title = this.get('title');
        for (i; i < length; i++) {
            if (i == t) {
                break;
            }
            url = url + Mediakron.controller.uri[i] + '/';
        }
        url = url.replace(/\/+$/, "");
        return Mediakron.Theme.link(title, url);
    },

    getCurrentUrl: function() {
        var i = 0,
            uri = this.get('uri'),
            length = Mediakron.controller.uri.indexOf(uri),
            url = '',
            title = this.get('title');

        for (i; i <= length; i++) {
            url = url + Mediakron.controller.uri[i] + '/';
        }
        url = url.replace(/\/+$/, "");
        return url;
    },
    editURL: function() {
        var type = this.getNormalType(),
            uri = this.get('uri');

        switch (type) {
            case 'image':
            case 'video':
            case 'story':
            case 'file':
            case 'text':
            case 'audio':
                if (this.get('uri') + '/' == Mediakron.controller.getEditPath(uri)) {
                    return "settings/content/edit/" + this.get('uri');
                }
                return "settings/content/edit/" + Mediakron.controller.getEditPath(uri) + this.get('uri');
            default:
                return "settings/manage/edit/" + Mediakron.controller.getEditPath(uri) + this.get('uri');
        }

    },
    editLink: function() {
        return Mediakron.Theme.link("<span title=\"Edit\" class=\"mk-icon mk-edit\"></span>&nbsp;<span class=\"button-text\">Edit</span>", this.editURL());
    },
    downloadUrl: function() {
        return Mediakron.Settings.basepath + "download/" + this.get('uri');
    },

    revisionUrl: function() {
        return "settings/revisions/" + this.get('uri');
    },

    transmitUrl: function() {
        return "settings/transmit/" + this.get('uri');
    },

    transmitLink: function() {
        return Mediakron.Theme.link("<span class=\"mk-icon mk-export transmit\" title=\"Copy to Site\" ></span>&nbsp;<span class=\"button-text\">Copy to Site</span>", this.transmitUrl());
    },

    duplicateUrl: function() {
        return "settings/duplicate/" + this.get('uri');
    },

    duplicateLink: function() {
        return Mediakron.Theme.link("<span class=\"mk-icon mk-duplicate duplicate\" title=\"Duplicate\" ></span>&nbsp;<span class=\"button-text\">Duplicate</span>", this.duplicateUrl());
    },

    publishURL: function() {
        return "settings/content/publish/" + this.get('uri');
    },

    publishLink: function() {
        if (this.canPublish(false)) return Mediakron.Theme.link("<span class=\"mk-icon mk-save publish\" title=\"Publish\" ></span>&nbsp;<span class=\"button-text\">Publish</span>", this.publishURL());
        return '';
    },

    unpublishURL: function() {
        return "settings/content/unpublish/" + this.get('uri');
    },

    unpublishLink: function() {
        if (this.canUnpublish(false)) return Mediakron.Theme.link("<span title=\"Unpublish\" class=\"mk-icon mk-unpublish unpublish\"></span>&nbsp;<span class=\"button-text\">Unpublish</span>", this.unpublishURL());
        return '';
    },

    archiveUrl: function() {
        return "settings/content/archive/" + this.get('uri');
    },

    archiveLink: function() {
        if (this.canArchive(false)) return Mediakron.Theme.link("<span class=\"mk-icon mk-archive unpublish\" title=\"Archive\" ></span>&nbsp;<span class=\"button-text\">Archive</span>", this.archiveUrl());
        return '';
    },
    restoreUrl: function() {
        return "settings/content/restore/" + this.get('uri');
    },

    restoreLink: function() {
        if (this.canArchive(false)) return Mediakron.Theme.link("<span title=\"Unarchive\" class=\"mk-icon mk-undo restore\"></span>&nbsp;<span class=\"button-text\">Unarchive</span>", this.restoreUrl());
        return '';
    },

    lockUrl: function() {
        return "settings/content/lock/" + this.get('uri');
    },

    lockLink: function() {
        if (this.canLock(false)) return Mediakron.Theme.link("<span class=\"mk-icon mk-lock\" title=\"Lock\" ></span>&nbsp;<span class=\"button-text\">Lock</span>", this.lockUrl());
        return '';
    },
    unlockUrl: function() {
        return "settings/content/unlock/" + this.get('uri');
    },

    unlockLink: function() {
        if (this.canLock(false)) return Mediakron.Theme.link("<span title=\"Unlock\" class=\"mk-icon mk-unlocked\"></span>&nbsp;<span class=\"button-text\">Unlock</span>", this.unlockUrl());
        return '';
    },

    deleteURL: function() {
        return "settings/content/delete/" + this.get('uri');
    },

    deleteLink: function() {
        return Mediakron.Theme.link("<span title=\"Delete\" class=\"mk-icon mk-delete\"></span>&nbsp;<span class=\"button-text\">Delete</span>", this.deleteURL());
    },


    // return this item as the url to its image styled with a certian theme
    getStyledImage: function(style) {
        var image = this.get('image'),
            path = '';
        if (this.get('type') !== 'file' && this.get('type') !== 'text') {
            if (image.uri) {
                path = image.uri;
            }
            if (!path) return '';
            return Mediakron.Image.style(path, style);
        } else if (this.get('type') == 'file' || this.get('type') == 'text') {
            image = this.get('text');
            if (image.type == 'image') {
                if (image.url) {
                    path = image.url;
                }
                if (image.uri) {
                    path = image.uri;
                }
            }
            if (!path) {
                image = this.get('image');
                if (image.uri) {
                    path = image.uri;
                }
            }
            if (!path) return '';
            return Mediakron.Image.style(path, style);
        }

    },

    // get the themed image for this item, for a particular style
    getImage: function(style, addClass) {
        var styled, image, alt;
        if (this.get('type') !== 'file' && this.get('type') !== 'text') {
            image = this.get('image');
            alt = this.get('title');
            if (image.alt) {
                alt = image.alt;
            }
            styled = this.getStyledImage(style);

            if (styled === '') return '';
            return Mediakron.Image.theme(styled, this.get('title'), alt, 'img-responsive ' + addClass);
        } else if (this.get('type') == 'file' || this.get('type') == 'text') {
            image = this.get('text');
            alt = this.get('title');
            if (image.alt) {
                alt = image.alt;
            }
            styled = this.getStyledImage(style);

            if (styled === '') return '';
            return Mediakron.Image.theme(styled, this.get('title'), alt, 'img-responsive ' + addClass);
        } else {
            return '';
        }

    },
    inTopic: function(uri) {
        var relationships = this.get('relationships');
        var topics = relationships.topics,
            t = 0,
            len = topics.length,
            topic;

        for (t; t < len; t++) {
            topic = topics[t];
            if (topic.uri == uri) return true;
        }
        return false;
    },

    hasParent: function() {
        var relationships = this.get('relationships');
        if (relationships.topics.length > 0 ||
            relationships.tags.length > 0 ||
            relationships.maps.length > 0 ||
            relationships.timelines.length > 0) {
            return true;
        }
        return false;
    },
    hasMetadata: function() { /* "Other Metadata" Fields */
        var metadata = this.get('metadata');
        if (!metadata.description &&
            !metadata.published &&
            !metadata.creator &&
            !metadata.publisher &&
            !metadata.contributor &&
            !metadata.format &&
            !metadata.identifier &&
            !metadata.language &&
            !metadata.relation &&
            !metadata.coverage &&
            !metadata.medium &&
            !metadata.provenance &&
            !metadata.SizeOrDuration &&
            !metadata.subject &&
            !metadata.location &&
            !metadata.rights) {
            return false;
        }
        return true;
    },
    hasSource: function() { /* "Source" fields */
        var metadata = this.get('metadata');
        if (metadata.source !== "" ||
            metadata.citation !== "") {
            return true;
        }
        return false;
    },
    hasTags: function() {
        var topics = this.getRelationship('topics'),
            i = 0,
            count = topics.length,
            tag, found = false;
        for (i; i < count; i++) {
            if (topics[i]) {
                tag = Mediakron.getItemFromURI(topics[i].uri);
                if (tag) {
                    if (tag.get('type') == 'tag') {
                        return true;
                    }
                }
            }
        }

        return false;
    },
    getNormalType: function() {
        var type = this.get('type');
        switch (type) {
            case 'map':
            case 'image-map':
            case 'Esri_WorldStreetMap':
            case 'Esri_DeLorme':
            case 'Esri_NatGeoWorldMap':
            case 'Esri_WorldImagery':
            case 'stamen-lite':
            case 'physical':
            case 'stamen-light':
            case 'stamen-watercolor':
            case 'osm':
            case 'cartodb':
                return 'map';
            default:
                return type;
        }
    },
    getOption: function(opt) {
        var options = this.get('options');
        if (options[opt]) {
            return options[opt];
        }
        return false;
    },
    getColor: function() {
        var type = this.getNormalType('type'),
            val = false;
        if (type == 'layer') {
            var filteropts = this.get('options');
            if (filteropts.icon) {
                val = filteropts.color;
            }
        }
        return val;
    },
    // get the themed image for this item, for a particular style
    getSquareImage: function(style, width, height, link) {
        if (!width) width = 200;
        if (!height) height = 200;
        var type = this.getNormalType('type'),
            iconclass = '',
            text = this.get('text'),
            alt = this.get('title');
        var image = this.get('image');
        if (image && (type != 'file' || this.get('type') !== 'text')) {
            if (image.uri) {
                if (image.alt) {
                    alt = image.alt;
                }

                if (link) {
                    return '<a href="' + this.getURL() + '">' + Mediakron.Image.themeSquare(this.getStyledImage(style), this.get('title'), alt, 'img-responsive', width, height) + '</a>';
                } else {
                    return Mediakron.Image.themeSquare(this.getStyledImage(style), this.get('title'), alt, 'img-responsive', width, height);
                }
            }
        } else if (text && text.type == 'image' && text.url) {
            if (link) {
                return '<a href="' + this.getURL() + '">' + Mediakron.Image.themeSquare(Mediakron.Image.style(text.url, style), this.get('title'), this.get('title'), 'img-responsive', width, height) + '</a>';
            } else {
                return Mediakron.Image.themeSquare(Mediakron.Image.style(text.url, style), this.get('title'), this.get('title'), 'img-responsive', width, height);
            }
        }
        switch (type) {
            case 'map':
                iconclass = 'mk-map';
                break;
            case 'layer':
                var filteropts = this.get('options'),
                    defaultOpt = 'mk-map';
                if (filteropts.icon) {
                    defaultOpt = filteropts.icon;
                }
                iconclass = defaultOpt;
                break;
            case 'timeline':
                iconclass = 'mk-timeline';
                break;
            case 'video':
                iconclass = 'mk-video';
                break;
            case 'story':
                iconclass = 'mk-story';
                break;
            case 'text':
                iconclass = 'mk-text';
                break;
            case 'file':
                iconclass = 'mk-file';
                break;
            case 'audio':
                iconclass = 'mk-audio';
                break;
            case 'narrative':
                iconclass = 'mk-narrative';
                break;
            case 'progression':
                iconclass = 'mk-progression';
                break;
            case 'comparison':
                iconclass = 'mk-comparison';
                break;
            case 'folder':
                iconclass = 'mk-folder';
                break;
            case 'slideshow':
                iconclass = 'mk-slideshow';
                break;
            case 'tag':
                iconclass = 'mk-tag';
                break;
        }
        if (link) {
            return '<a href="' + this.getURL() + '"><div class="item-square-icon" style="width:' + width + 'px;height:' + height + 'px;font-size:' + width * 0.9 + 'px;"><span class="mk-icon ' + iconclass + '"></span><span class="sr-only">' + type + '</span></div></a>';
        } else {
            return '<div class="item-square-icon" style="width:' + width + 'px;height:' + height + 'px;font-size:' + width * 0.9 + 'px;"><span class="mk-icon ' + iconclass + '"></span><span class="sr-only">' + type + '</span></div>';
        }
    },
    // get the themed image for this item, for a particular style
    getMosaicImage: function(style, width, height, link) {
        if (!width) width = 200;
        if (!height) height = 200;
        var type = this.getNormalType('type'),
            iconclass = '',
            text = this.get('text'),
            alt = this.get('title');
        var image = this.get('image');
        if (image && (type != 'file' || this.get('type') !== 'text')) {
            if (image.uri) {
                if (image.alt) {
                    alt = image.alt;
                }

                if (link) {
                    return '<a href="' + this.getURL() + '">' + Mediakron.Image.theme(this.getStyledImage(style), this.get('title'), alt, '', width, height) + '</a>';
                } else {
                    return Mediakron.Image.theme(this.getStyledImage(style), this.get('title'), alt, '', width, height);
                }
            }
        } else if (text && text.type == 'image' && text.url) {
            if (link) {
                return '<a href="' + this.getURL() + '">' + Mediakron.Image.theme(Mediakron.Image.style(text.url, style), this.get('title'), this.get('title'), '', width, height) + '</a>';
            } else {
                return Mediakron.Image.theme(Mediakron.Image.style(text.url, style), this.get('title'), this.get('title'), '', width, height);
            }
        }
        switch (type) {
            case 'map':
                iconclass = 'mk-map';
                break;
            case 'layer':
                var filteropts = this.get('options'),
                    defaultOpt = 'mk-map';
                if (filteropts.icon) {
                    defaultOpt = filteropts.icon;
                }
                iconclass = defaultOpt;
                break;
            case 'timeline':
                iconclass = 'mk-timeline';
                break;
            case 'video':
                iconclass = 'mk-video';
                break;
            case 'story':
                iconclass = 'mk-text';
                break;
            case 'text':
                iconclass = 'mk-text';
                break;
            case 'file':
                iconclass = 'mk-text';
                break;
            case 'audio':
                iconclass = 'mk-audio';
                break;
            case 'narrative':
                iconclass = 'mk-narrative';
                break;
            case 'progression':
                iconclass = 'mk-progression';
                break;
            case 'comparison':
                iconclass = 'mk-comparison';
                break;
            case 'folder':
                iconclass = 'mk-folder';
                break;
            case 'slideshow':
                iconclass = 'mk-slideshow';
                break;
            case 'tag':
                iconclass = 'mk-tag';
                break;
        }
        if (link) {
            return '<a href="' + this.getURL() + '"><div class="item-square-icon" style="width:' + width + 'px;height:' + height + 'px;font-size:' + width * 0.9 + 'px;"><span class="mk-icon ' + iconclass + '"></span><span class="sr-only">' + type + '</span></div></a>';
        } else {
            return '<div class="item-square-icon" style="width:' + width + 'px;height:' + height + 'px;font-size:' + width * 0.9 + 'px;"><span class="mk-icon ' + iconclass + '"></span><span class="sr-only">' + type + '</span></div>';
        }
    },

    getRelationship: function(relationship) {
        var relationships = this.get('relationships');
        if (!relationships[relationship]) return [];
        return relationships[relationship];
    },
    getRelationshipByURI: function(uri, relationship) {
        var children = this.getRelationship(relationship),
            length = children.length,
            i = 0;
        if (length === 0) return false;
        for (i; i < length; i++) {
            if (children[i].uri == uri) {
                return true;
            }
        }
        return false;
    },
    fetchRelationship: function(uri, relationship) {
        var children = this.getRelationship(relationship),
            length = children.length,
            i = 0;
        if (length === 0) return false;
        for (i; i < length; i++) {
            if (children[i].uri == uri) {
                return children[i];
            }
        }
        return false;
    },
    setRelationship: function(relationship, data) {
        var relationships = this.get('relationships');
        relationships[relationship] = data;
        this.set('relationships', relationships);
    },
    getMetadata: function(attribute) {
        var metadata = this.get('metadata');
        return metadata[attribute];
    },
    getRelationalForm: function(relationship) {
        var rendered = '',
            relationships = this.get('relationships'),
            relate = relationships[relationship],
            length = relate.length,
            i = 0,
            template = JST['settings.section.add.to.' + relationship];

        for (i; i < length; i++) {
            rendered = template(relate[i]);
        }
        return rendered;
    },
    getSidebar: function(parent) {
        this.parent = parent;
        var sidebar = new Mediakron.Sidebar.Init(this);
        sidebar.render();
        //        $('.page-options a').tooltip();

        return sidebar;
    },
    renderMaps: function() {

        var m, map, maps = this.get('maps');
        for (m in maps) {
            map = Mediakron.getItemFromURI(maps[m]);
            Mediakron.Maps.Theme(map, 'map-sidebar-' + this.get('uri'));
        }
    },
    metadataForm: function() {
        var metadata = this.get('metadata'),
            template = JST['settings.section.metadata.form'],
            html;
        var keys = ['source', 'citation', 'description', 'published', 'creator', 'publisher', 'contributor', 'format', 'identifier', 'language', 'relation', 'coverage', 'medium', 'provenance', 'SizeOrDuration', 'subject', 'location', 'rights'];
        if (_.size(metadata) === 0) {
            metadata = {
                source: "",
                citation: "",
                description: "",
                published: "",
                creator: "",
                publisher: "",
                contributor: "",
                format: "",
                identifier: "",
                language: "",
                relation: "",
                coverage: "",
                medium: "",
                provenance: "",
                SizeOrDuration: "",
                subject: "",
                location: "",
                rights: ""
            };
        }
        for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!metadata[key]) {
                metadata[key] = "";
            }
        }
        html = template(metadata);
        return html;
    },
    wysiwygForm: function() {
        var template = JST['settings.section.wysiwyg'],
            html = template();
        return html;
    },
    defaultData: function() {
        var type = this.get('type');
        switch (type) {
            case 'folder':
            case 'slideshow':
            case 'tag':
            case 'narrative':
            case 'walkingmap':
            case 'comparison':
                return false;
            case 'progression':
                return false;
            case 'map':
            case 'stamen-lite':
            case 'Esri_WorldStreetMap':
            case 'Esri_DeLorme':
            case 'Esri_NatGeoWorldMap':
            case 'Esri_WorldImagery':
            case 'stamen-light':
            case 'stamen-watercolor':
            case 'osm':
            case 'cartodb':
                var map = Mediakron.Status.CurrentMap;
                return {
                    type: 'point',
                    coordinate: map.getCenter()
                };
            case 'timeline':
                return {
                    'start': {
                        'year': 1000
                    }
                };
        }
    },
    getTagsComma: function() {
        var tags = this.getRelationship('tags'),
            tag, number = tags.length,
            i = 0,
            output = '';
        for (i; i < number; i++) {
            if (tags[i]) {
                tag = Mediakron.getItemFromURI(tags[i].uri);
                if (tag) {
                    output = output + tag.get('title') + ', ';
                }
            }
        }
        return output.substring(0, output.length - 2);
    },
    formatEvent: function(uri, which) {
        if (!which) which = 'start';
        var time = this.getRelationship('timeline');
        _.each(time, function(time) {

        });
    },
    addComment: function(html) {
        var comments = this.getRelationship('comments'),
            time = new Date().getTime(),
            uri = 'comment:' + Mediakron.user.get('id') + ':' + time;
        var comment = {
            'uri': uri,
            'data': {
                'body': html,
                'author': Mediakron.user.get('id'),
                'name': Mediakron.user.get('name'),
                'date': Mediakron.formatUnixDateStamp(time / 1000)
            }
        };
        comments.push(comment);
        this.setRelationship('comments', comments);

    },
    getFeature: function(addClass) {
        if (!addClass) addClass = '';
        return '<figure id="feature-' + this.get('uri') + '-' + Date.now().toString(16) + '" uri="' + this.get('uri') + '" contenteditable="false" class="feature type-' + this.getNormalType() + ' ' + addClass + '" type="' + this.getNormalType() + '" />';
    },
    getChild: function(uri, type) {
        if (!type) type = 'children';
        var children = this.getRelationship(type),
            count = children.length,
            i = 0,
            child;
        for (i; i < count; i++) {
            child = children[i];
            if (child.uri == uri) return child;
        }
        return false;
    },
    getChildByUri: function(uri) {
        var type = 'children';
        switch (this.getNormalType()) {
            case 'folder':
            case 'slideshow':
            case 'tag':
            case 'narrative':
            case 'story':
            case 'walkingmap':
            case 'progression':
            case 'comparison':
            case 'layer':
            case 'story':
                type = 'children';
                break;
            case 'map':
            case 'image-map':
            case 'stamen-lite':
            case 'Esri_WorldStreetMap':
            case 'Esri_DeLorme':
            case 'Esri_NatGeoWorldMap':
            case 'Esri_WorldImagery':
            case 'stamen-light':
            case 'stamen-watercolor':
            case 'osm':
            case 'cartodb':
                type = 'layers';
                break;
            case 'timeline':
                type = 'events';
                break;
        }
        return this.getChild(uri, type);
    },
    podcastDate:function(){
        return Mediakron.formatUnixDateStamp(this.get('storedDate'), 'small');
    },
    start: function() {
        if (!this.get('date')) return false;
        if (this.get('date').start) return this.get('date').start;
        return false;
    },
    end: function() {
        if (!this.get('date')) return false;
        if (this.get('date').end) return this.get('date').end;
        return false;
    },
    add: function(child, data, skipSave) {
        var parent = this,
            type = this.get('type'),
            relationships,
            relateTo,
            relateFrom,
            children = [],
            parents = [],
            i = 0,
            length,
            uri = this.get('uri'),
            childURI = child.get('uri'),
            found = false;

        if (uri == childURI) { return this; }
        switch (type) {
            case 'folder':
            case 'slideshow':
            case 'tag':
            case 'narrative':
            case 'story':
            case 'walkingmap':
            case 'progression':
            case 'comparison':
            case 'layer':
            case 'story':
                relateTo = 'children';
                relateFrom = 'topics';
                break;
            case 'map':
            case 'image-map':
            case 'stamen-lite':
            case 'Esri_WorldStreetMap':
            case 'Esri_DeLorme':
            case 'Esri_NatGeoWorldMap':
            case 'Esri_WorldImagery':
            case 'stamen-light':
            case 'stamen-watercolor':
            case 'osm':
            case 'cartodb':
                relateTo = 'layers';
                relateFrom = 'maps';
                break;
            case 'timeline':
                relateTo = 'events';
                relateFrom = 'timelines';
                break;
        }

        children = this.getRelationship(relateTo);
        if (children) {
            length = children.length;
            for (i; i < length; i++) {
                if (children[i].uri == childURI) {
                    found = i;
                    break;
                }
            }
            if (found) { children[found] = { 'uri': childURI, 'data': data, 'changed': true }; } else { children.push({ 'uri': childURI, 'data': data, 'changed': true }); }
            parent.setRelationship(relateTo, children);
            if (!skipSave) {
                this.save();
            }
        }


        parents = child.getRelationship(relateFrom);
        if (parents) {
            length = parents.length;
            for (i; i < length; i++) {
                if (parents[i]) {
                    if (parents[i].uri) {
                        if (parents[i].uri == uri) {
                            found = i;
                            break;
                        }
                    }
                }

            }
            if (found) { parents[found] = { 'uri': uri, 'data': data, 'changed': true }; } else { parents.push({ 'uri': uri, 'data': data, 'changed': true }); }
            child.setRelationship(relateFrom, parents);
        }

        return this;
    },
    remove: function(child, callback) {
        var parent = this,
            type = this.get('type'),
            relateTo, relateFrom,
            children = [],
            parents = [],
            i = 0,
            length, uri = this.get('uri'),
            found = [];
        if (typeof(child) == 'string') {
            childURI = child;
        } else {
            childURI = child.get('uri');
        }
        switch (type) {
            case 'folder':
            case 'slideshow':
            case 'tag':
            case 'narrative':
            case 'walkingmap':
            case 'progression':
            case 'comparison':
            case 'layer':
            case 'story':
                relateTo = 'children';
                relateFrom = 'topics';
                break;
            case 'map':
            case 'Esri_WorldStreetMap':
            case 'Esri_DeLorme':
            case 'Esri_NatGeoWorldMap':
            case 'Esri_WorldImagery':
            case 'stamen-lite':
            case 'stamen-light':
            case 'stamen-watercolor':
            case 'osm':
            case 'cartodb':
                relateTo = 'layers';
                relateFrom = 'maps';
                break;
            case 'timeline':
                relateTo = 'events';
                relateFrom = 'timelines';
                break;
        }
        children = this.getRelationship(relateTo);
        if (children) {
            length = children.length;
            for (i; i < length; i++) {
                if (children[i].uri == childURI) {
                    children[i].remove = true;
                }
                found.push(children[i]);
            }
            this.setRelationship(relateTo, found);
            this.save({}, {
                success: function(model) {
                    if (callback) {
                        callback(model);
                    }
                }
            });
        }
        found = [];
        if (typeof(child) != 'string') {
            parents = child.getRelationship(relateFrom);

            if (parents) {
                length = parents.length;
                for (i; i < length; i++) {
                    if (parents[i].uri == uri) {
                        parents[i].remove = true;
                    }
                    found.push(parents[i]);
                }
                if (found) {
                    child.setRelationship(relateFrom, found);
                    child.save();
                }
            }
        }

        return this;
    },
    skips: function() {
        var skip = [],
            children, items, length, i = 0;
        switch (this.get('type')) {
            case 'folder':
            case 'slideshow':
            case 'tag':
            case 'narrative':
            case 'story':
            case 'walkingmap':
            case 'progression':
            case 'layer':
            case 'comparison':
                children = 'children';
                break;
            case 'map':
            case 'image-map':
            case 'Esri_WorldStreetMap':
            case 'Esri_DeLorme':
            case 'Esri_NatGeoWorldMap':
            case 'Esri_WorldImagery':
            case 'stamen-lite':
            case 'stamen-light':
            case 'stamen-watercolor':
            case 'osm':
            case 'cartodb':
                children = 'layers';
                break;
            case 'timeline':
                children = 'events';
                break;
        }
        items = this.getRelationship(children);
        length = items.length;
        for (i; i < length; i++) {
            skip.push(items[i].uri);
        }
        skip.push(this.get('uri'));
        return skip;
    },

    hasDate: function() {
        var date = this.get('date');
        var validate = Mediakron.validateTimeline(date);
        if (!validate) {
            return true;
        } else {
            return false;
        }
    },
    validateTimeline: function(changes) {
        var date = this.get('date');
        if (changes) {
            date = changes;
        }
        return Mediakron.validateTimeline(date);
    },

    updateAnnotationRelationship: function() {
        var saveAnnotations = [],
            annotations = this.get('annotations'),
            attachments = [];
        _.each(annotations, function(annotation, id) {
            if (annotation.attachment) {
                attachments.push(annotation.attachment);
            }
            saveAnnotations.push(annotation);
        });
        var i = 0,
            length = attachments.length,
            item,
            citations, c, clen, found;
        for (i; i < length; i++) {
            item = Mediakron.getItemFromURI(attachments[i]);
            if(item){
                citations = item.getRelationship('citations');
                if (!citations) citations = [];
                c = 0;
                clen = citations.length;
                found = false;
                for (c; c < clen; c++) {
                    if (citations.uri == this.get('uri')) {
                        found = true;
                    }
                }
                if (!found) {
                    citations.push({
                        uri: this.get('uri'),
                        data: false
                    });
                }
                item.setRelationship('citations', citations);
            }
        }
        this.setRelationship('annotations', saveAnnotations);
    },
    
    getCreated: function() {
        return Mediakron.formatUnixDateStamp(this.get('created'), 'small');
    },

    getCreatedShort: function() {
        return Mediakron.formatUnixDateStamp(this.get('created'));
    },

    getChanged: function() {
        return Mediakron.formatUnixDateStamp(this.get('changed'), 'small');
    },
    getRow: function(context, callback, thumbnails, extra) {
        var view,
            data = { 'item': this, 'context': context, 'callback': callback, 'thumbnails': thumbnails, 'data': extra };
        if (context == 'lti') {
            view = new Mediakron.ContentBrowser.rowLTI(data);
        } else if (context == 'selectormap') {
            view = new Mediakron.ContentBrowser.rowSelectorMap(data);
        } else if (context == 'timeline') {
            view = new Mediakron.ContentBrowser.rowTimeline(data);
        } else if (context == 'narrative') {
            view = new Mediakron.ContentBrowser.rowNarrative(data);
        } else if (context == 'selector') {
            view = new Mediakron.ContentBrowser.rowSelector(data);
        } else if (context == 'elasticsearch') {
            view = new Mediakron.Search.rowElasticSearch(data);
        } else {
            view = new Mediakron.ContentBrowser.Row(data);
        }

        return view;
    }
});

Mediakron.Models.createUrl = function(url, id) {
    if (!url) { return false; }
    return url.replace('{id}', id);
};
/**
 * 
 *
 *
 */

Mediakron.Models.Item = Mediakron.Models.Model.extend({
    id: null,
    version: 0,
    created: 0,
    changed: 0,
    published: true,
    archived: false,
    user: {},
    template: 'default',
    options: {},
    uri: false,
    type: '',
    title: '',
    description: '',
    body: '',
    caption: '',
    transcript: '',
    image: '',
    time: false,
    audio: { /* Not empty if audio.  Contains the actual audio data */
        type: "",
        /* type of file.  See settings for supported audio */
        url: "" /* the url of the audio.  Could be local, in theory.  Could also be remote */
    },
    video: { /* Not empty if video.  Contains the actual video data */
        type: "",
        /* type of file.  See settings for supported video */
        url: "" /* the url of the video.  Could be local, in theory.  Could also be remote */

    },
    text: { /* Not empty if text.  Contains the actual text data */
        type: "",
        /* type of file.  See settings for supported text */
        url: "" /* the url of the text.  Could be local, in theory.  Could also be remote. Could also be empty if text is just in the body field. */

    },
    overlay: {},
    size: {},
    height: 0,
    width: 0,
    center: [0, 0],
    zoom: 2,
    projection: 'EPSG:3857',
    storedDate: 0,
    map: {
        url: ''
    },
    timeline: {
        scope: '',
        granularity: '',
        start: '',
        end: '',
    },

    date: {
        start: false,
        end: false,
    },

    relationships: {
        topics: [],
        tags: [],
        maps: [],
        timelines: [],
        comparisons: [],


        children: [],
        layers: [],
        events: [],
        comments: [],
        annotations: [],
        citations: [],
    },

    metadata: {
        source: "",
        citation: "",
        description: "",
        published: "",
        creator: "",
        publisher: "",
        contributor: "",
        format: "",
        identifier: "",
        language: "",
        relation: "",
        coverage: "",
        medium: "",
        provenance: "",
        SizeOrDuration: "",
        subject: "",
        location: "",
        rights: ""
    },
    viewObject: false,
    /* Render the default version of this topic */
    getView: function(template) {
        var view;
        switch (this.get('type')) {
            case 'story':
                view = new Mediakron.Pages.story(this);
                break;
            case 'audio':
                view = new Mediakron.Pages.audio(this);
                break;
            case 'image':
                view = new Mediakron.Pages.image(this);
                break;
            case 'video':
                view = new Mediakron.Pages.video(this);
                break;
            case 'text':
                view = new Mediakron.Pages.text(this);
                break;
            case 'file':
                view = new Mediakron.Pages.file(this);
                break;
            case 'narrative':
                view = new Mediakron.Pages.narrative(this);
                break;
            case 'slideshow':
                view = new Mediakron.Pages.slideshow(this);
                break;
            case 'tag':
                view = new Mediakron.Pages.tag(this);
                break;
            case 'layer':
                view = new Mediakron.Pages.layer(this);
                break;
            case 'topic':
                view = new Mediakron.Pages.topic(this);
                break;
            case 'comparison':
                view = new Mediakron.Pages.comparison(this);
                break;
            case 'folder':
                view = new Mediakron.Pages.folder(this);
                break;
            case 'progression':
                view = new Mediakron.Pages.progression(this);
                break;
            case 'map':
            case 'osm':
            case 'Esri_WorldStreetMap':
            case 'Esri_DeLorme':
            case 'Esri_NatGeoWorldMap':
            case 'Esri_WorldImagery':
            case 'stamen-light':
            case 'stamen':
            case 'stamen-watercolor':
            case 'image-map':
            case 'cartodb':
                view = new Mediakron.Pages.map(this);
                break;
            case 'timeline':
                view = new Mediakron.Pages.timeline(this);
                break;
        }
        if (template) {
            view.layout = template;
            view.full = false;
        }
        return view;
    },

    changedSince: function(time) {
        // get changed
        var changed = this.get('changed');
        if (!time) time = Mediakron.user.lastVisit();
        if (time < changed) return true;
        return false;
    },

    newSince: function(time) {
        var created = this.get('created');
        if (!time) time = Mediakron.user.lastVisit();
        if (time < created) return true;
        return false;
    },

    isUpdated: function(time) {
        // get changed
        var changed = this.get('changed');
        if (Mediakron.user.lastVisit() < changed) return true;
        return false;
    },
    isCreated: function() {
        var created = this.get('created');
        if (Mediakron.user.lastVisit() < created) return true;
        return false;
    },

    addToCollection: function() {
        Mediakron.items.add(this);
    },

    // The fetch url for this model, dervived from the id
    urlRoot: Mediakron.Data.models.items,

    defaults: function() {
        return {
            id: null,
            created: 0,
            changed: 0,
            version: 0,
            published: true,
            archived: false,
            user: Mediakron.user,
            editor: false,
            template: 'default',
            options: {},
            uri: false,
            time: false,
            type: '',
            title: '',
            description: '',
            transcript: '',
            body: '',
            caption: '',
            image: '',
            audio: {},
            video: {},
            text: {},
            height: 0,
            width: 0,
            center: [0, 0],
            size: {},
            zoom: 2,
            projection: 'EPSG:3857',
            storedDate: '',
            date: {
                start: false,
                end: false,
            },
            map: {
                url: ''
            },
            timeline: {
                scope: '',
                granularity: '',
                start: '',
                end: '',
            },
            overlay: {},
            relationships: {
                topics: [],
                tags: [],
                maps: [],
                timelines: [],
                comparisons: [],

                events: [],
                layers: [],
                children: [],
                comments: [],
                annotations: [],
                citations: [],
            },

            metadata: {
                source: "",
                citation: "",
                description: "",
                published: "",
                creator: "",
                publisher: "",
                contributor: "",
                format: "",
                identifier: "",
                language: "",
                relation: "",
                coverage: "",
                medium: "",
                provenance: "",
                SizeOrDuration: "",
                subject: "",
                location: "",
                rights: ""
            }
        };
    },

    editor: function() {
        var editor = this.get('editor');
        if (editor) {
            if (editor.name) return editor.name;
        }
        return '';
    },

    // get the proper url to this item.  Either type/uri, item/uri, type/id, item/id in that order
    getURL: function() {
        var url = '',
            type = this.get('type'),
            id = this.id,
            uri = this.get('uri');
        if (uri) {
            return uri;
        }
    },
    goTo: function() {
        Mediakron.controller.gotoLast();
    },

    timeToSeconds: function(time) {
        if (time) {
            if (time !== '') {
                if (time.indexOf(':') > -1) {
                    var split = time.split(':'),
                        hour = 0,
                        min = 0,
                        sec = 0,
                        timecode = 0;

                    if (split.length == 3) {
                        hour = parseInt(split[0], 10);
                        min = parseInt(split[1], 10);
                        sec = parseInt(split[2], 10);
                    } else if (split.length == 2) {
                        min = parseInt(split[0], 10);
                        sec = parseInt(split[1], 10);
                    }
                    timecode = (hour * 60 * 60) + (min * 60) + sec;
                    return timecode;
                } else {
                    return parseInt(time, 10);
                }
            }
        }
        return false;
    },

    getVideo: function() {
        if (this.get('type') != 'video') { return false; }

        var video = this.get('video'),
            template = JST['regions.item.video.' + video.type];
        video.item = this;
        video.image = this.getStyledImage("full");
        video.item = this;
        if (!template) { return ''; }
        return template(video);
    },

    icon: function() {
        var icon = '',
            options = this.get('options');
        if (options.icon) icon = options.icon;
        return icon;
    },

    color: function(set) {

        var color = '',
            options = this.get('options');
        if (set) {
            options.color = set;
        }
        if (options.color) color = options.color;

        if (color === '') color = '#000000';
        return color;
    },

    getYouTubeUrl: function() {
        var video = this.get('video'),
            url = video.url,
            youtube = '//www.youtube.com/embed/';

        if (url) {
            url = url.replace("https://", '');
            url = url.replace("http://", '');
            url = url.replace("//", '');
            url = url.replace("www.", '');
            url = url.replace("youtu.be/", '');
            url = url.replace("youtube.com/embed/", '');
            url = url.replace("youtube.com/watch?v=", '');
            url = url.replace("&feature=youtu.be", '');
            url = url.replace("&feature=plcp", '');
            url = youtube + url;

            var start = this.timeToSeconds(video.start);
            var end = this.timeToSeconds(video.end);

            if (start !== false) {
                url = url + '?start=' + start;
                if (end !== false) url = url + '&end=' + end;
            }
            return url;
        } else {
            return '';
        }

    },
    //https://drive.google.com/file/d/0B36LdKxiyL7fSW9FMkhNQ2JKQnc/view?usp=sharing
    //https://drive.google.com/open?id=0B36LdKxiyL7fSW9FMkhNQ2JKQnc&authuser=0
    //https://drive.google.com/a/bu.edu/file/d/0B36LdKxiyL7fSW9FMkhNQ2JKQnc/edit
    getGoogleUrl: function() {
        var video = this.get('video'),
            url = video.url,
            google = 'https://docs.google.com/';
        if (url) {
            url = url.replace("https://", '');
            url = url.replace("http://", '');
            url = url.replace("//", '');
            url = url.replace("/preview", '');
            url = url.replace("/view", '');
            url = url.replace("/edit", '');
            url = url.replace('?usp=sharing', '');
            url = url.replace('/a/bu', '');
            url = url.replace("&authuser=0", '');
            url = url.replace('open?id=', 'file/d/');
            url = url.replace("docs.google.com/", '');
            url = url.replace("drive.google.com/", '');

            url = google + url + '/preview';

            var start = this.timeToSeconds(video.start);
            var end = this.timeToSeconds(video.end);

            if (start !== false) {
                url = url + '?start=' + start;
                if (end !== false) url = url + '&end=' + end;
            }
            return url;
        } else {
            return '';
        }

    },
    getVimeoUrl: function() {
        var video = this.get('video'),
            url = video.url,
            vimeo = '//player.vimeo.com/video/';
        url = url.replace("player.vimeo.com/video/", '');
        url = url.replace("https://", '');
        url = url.replace("http://", '');
        url = url.replace("//", '');
        url = url.replace("www.", '');
        url = url.replace("vimeo.com/", '');


        return vimeo + url + '?title=0&byline=0&portrait=0';
    },

    getPanoptoUrl: function() {
        var video = this.get('video'),
            url = video.url;
        url = url.replace("http://", 'https://');

        var start = this.timeToSeconds(video.start);
        var end = this.timeToSeconds(video.end);

        if (start !== false) { /* if video has start/stop timecodes  */
            url = url.replace(".mp4", '');
            url = url.replace("bc.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=", 'bc.hosted.panopto.com/Panopto/Podcast/Stream/');
            url = url + '.mp4';

            url = url + '#t=' + start;
            if (end !== false) url = url + ',' + end;

            return '<video class="panopto-video" src="' + url + ' " controls>Sorry, you will need to update your browser to view this video. </video>';
        } else {

            url = url.replace("bc.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=", 'bc.hosted.panopto.com/Panopto/Pages/Embed.aspx?id=');

            return '<div class="panopto-container"><iframe src="' + url + '" width="100%" height="100%" style="padding: 0px; border: 1px solid #464646;" frameborder="0"></iframe></div>';
        }


    },

    getKanopyUrl: function() {
        var video = this.get('video'),
            url = video.url;
        url = url.replace("http://", 'https://');
        url = url.replace("bc-kanopystreaming-com.proxy.bu.edu/playlist/", 'bc.kanopystreaming.com/embed/');
        return url;
    },
    
    getPanoptoAudioUrl: function() {
            var audio = this.get('audio'),
                url = audio.url;
            url = url.replace("http://", 'https://');
    
            var start = this.timeToSeconds(audio.start);
            var end = this.timeToSeconds(audio.end);
    
            if (start !== false) { /* if video has start/stop timecodes  */
                url = url.replace(".mp4", '');
                url = url.replace("bc.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=", 'bc.hosted.panopto.com/Panopto/Podcast/Stream/');
                url = url + '.mp4';
    
                url = url + '#t=' + start;
                if (end !== false) url = url + ',' + end;
    
                return '<audio class="panopto-audio" src="' + url + ' " controls>Sorry, you will need to update your browser to view this video. </audio>';
            } else {
    
                url = url.replace("bc.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=", 'bc.hosted.panopto.com/Panopto/Pages/Embed.aspx?id=');
    
                return '<div class="panopto-container"><iframe src="' + url + '" width="100%" height="100%" style="padding: 0px; border: 1px solid #464646;" frameborder="0"></iframe></div>';
            }
        },

    getGoogleUrlAudio: function() {
        var audio = this.get('audio'),
            url = audio.url,
            google = 'https://docs.google.com/';
        if (url) {
            url = url.replace("https://", '');
            url = url.replace("http://", '');
            url = url.replace("//", '');
            url = url.replace("/preview", '');
            url = url.replace("/view", '');
            url = url.replace("/edit", '');
            url = url.replace('?usp=sharing', '');
            url = url.replace('/a/bu.edu', '');
            url = url.replace("&authuser=0", '');
            url = url.replace('open?id=', 'file/d/');
            url = url.replace("docs.google.com/", '');
            url = url.replace("drive.google.com/", '');

            return google + url + '/preview';
        } else {
            return '';
        }
    },

    getSoundCloudUrl: function() {

        //get the Sound Cloud url from the form
        var audio = this.get('audio'),
        url = audio.url;
        
        if (url) {
            // strip down the URL 
            url = url.replace("https://", '');
            url = url.replace("http://", '');
            url = url.replace("//", '');

            // construct URL format required by Sound Cloud oEmbed
            var soundcloud = 'https://soundcloud.com/oembed?format=json&url=https%3A//';
            var soundcloudURL = soundcloud + url + "&color=666666";
            console.log(soundcloudURL);

            // extract the iframe embed snippet from the oembed JSON
            var soundcloudEmbed = false;
            return $.getJSON(soundcloudURL, function (json) {
                // Set the variables from the results array
                soundcloudEmbed = json.html;
                return soundcloudEmbed;
            });

        } else {
            return '';
        }
    },

    getBCurl: function(scale) {
        var video = this.get('video'),
            url = video.url,
            width = $('iframe').width(),
            height = $('iframe').height();

        url = url.replace("http://", 'https://');
        var start = this.timeToSeconds(video.start);
        var end = this.timeToSeconds(video.end);

        var duration = end - start;

        if (start !== false) {
            url = url + '?start=' + start;
            if (end !== false) url = url + '&stop=' + duration;
        }
        return url;
    },
   getArchiveorgVideo: function() {
       var video = this.get('video'),
           url = video.url;
       
       url = url.replace("archive.org/details", 'archive.org/embed');
       url = url.replace("/start/", '?start=');
       url = url.replace("/end/", '&end=');
           
       return url;
   },
    getBCAudioUrl: function() {
        var audio = this.get('audio'),
            url = audio.url;
        return url;
    },

    getAudioUrl: function() {
        var audio = this.get('audio'),
            url = audio.url;
        return url;
    },
    
    getArchiveorgAudio: function() {
        var audio = this.get('audio'),
            url = audio.url;
        
        url = url.replace("archive.org/details", 'archive.org/embed');
        url = url.replace("/start/", '?start=');
        url = url.replace("/end/", '&end=');
            
        return url;
    },
    
    getVideoUrl: function() {
        var audio = this.get('video'),
            url = audio.url;
        return url;
    },

    loadVideo: function() {
        var video = this.get('video'),
            type = video.type;

        switch (type) {
            case 'mp4':
                $('audio,video').mediaelementplayer({
                    videoWidth: -1,
                    videoHeight: -1,
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'm4v':
                $('audio,video').mediaelementplayer({
                    videoWidth: -1,
                    videoHeight: -1,
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'flv':
                $('audio,video').mediaelementplayer({
                    videoWidth: -1,
                    videoHeight: -1,
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'rtmp':
                $('audio,video').mediaelementplayer({
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            default:
                break;
        }
    },

    getAudio: function() {
        if (this.get('type') != 'audio') { return false; }
        var audio = this.get('audio'),
            template = JST['regions.item.audio.' + audio.type];
        audio.image = this.getStyledImage("full");
        audio.item = this;
        if (!template) { return ''; }
        return template(audio);
        
    },

    loadAudio: function() {
        var audio = this.get('audio'),
            type = audio.type,
            player;

        switch (type) {
            case 'mp3':
                player = $('audio,video').mediaelementplayer({
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'rtmp':
                player = $('audio,video').mediaelementplayer({
                    mode: 'shim',
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'm4a':
                player = $('audio,video').mediaelementplayer({
                    mode: 'shim',
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'mp4':
                player = $('audio,video').mediaelementplayer({
                    mode: 'shim',
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            default:
                break;
        }
        return player;
    },

    startSerial: false,
    endSerial: false,
    items: false,
    sorted: false,
    weight: 0,
    // Check to see if this item has a particular topic or tag
    hasTopicOrTag: function(top, tag) {
        var tid = this.get('tid'),
            tags = this.get('tags'),
            topicPassed = false,
            tagPassed = false;
        if (top) {
            if (Mediakron.Settings.filterByTopics[tid]) {
                topicPassed = true;
            }
        } else {
            topicPassed = true;
        }
        if (tag) {
            var any = _.intersection(_.keys(Mediakron.Settings.filterByTags), _.keys(tags));
            if (any.length > 0) {
                tagPassed = true;
            }
        } else {
            tagPassed = true;
        }
        if (tagPassed && topicPassed) {
            return true;
        }
        return false;
    }
});

// User Class
Mediakron.Models.Group = Mediakron.Models.Model.extend({
    id: 0,
    name: '',
    role: 'guest',
    urlRoot: Mediakron.Data.models.group,

    roleSelect: function(role) {
        if (this.get('role') == role) {
            return 'selected';
        }
        return '';
    },

    defaults: function() {
        return {
            id: 0,
            name: '',
            role: 'guest',
        };
    }
});


// User Class
Mediakron.Models.User = Mediakron.Models.Model.extend({
    id: 0,
    email: '',
    name: 'Guest',
    role: 'guest',
    bc: false,
    canvas: false,
    compare: {},
    history: {},
    urlRoot: Mediakron.Data.models.user,

    defaults: function() {
        return {
            id: 0,
            email: '',
            name: 'guest',
            role: 'guest',
            bc: false,
            canvas: false
        };
    },

    guest: function() {
        this.set('id', 0);
        this.set('name', 'Guest');
        this.set('role', 'guest');
    },

    isGuest: function() {
        if (this.id === 0) {
            return true;
        }
        return false;
    },

    isMember: function() {
        if (this.get('role') == 'member') {
            return true;
        }
        return false;
    },

    roleSelect: function(role) {
        if (this.get('role') == role) {
            return 'selected';
        }
        return '';
    },

    lastVisit: function() {
        var localStorage = window.localStorage;
        var key = Mediakron.Settings.uri + '_lastvisit';
        var visit = this.get('visit');
        if (visit) visit = parseInt(visit, 10);
        var now = Math.floor(+new Date() / 1000);
        var item = localStorage.getItem(key);
        if (item) {
            item = JSON.parse(item);
            if (item.last < now) {
                item.last = now + 3600;
                item.visit = visit;
            } else {
                return item.visit;
            }
        } else {
            item = {
                last: now + 3600,
                visit: visit
            };
        }
        item = JSON.stringify(item);
        localStorage.setItem(key, item);
        return visit;
    },

    newContent: function() {

    },

    changedContent: function() {

    },

    canEditItem: function(type, item) {
        if (Mediakron.Settings.editEnabled) {
            var canedit = this.get('canedit'),
                administrator = this.get('administrator'),
                id = this.get('id');
            if (administrator === true) {
                Mediakron.Edit.setCanEditStatus(true);
                return true;
            }

            if (canedit === true && type == 'topic') {
                Mediakron.Settings.setCanEditStatus(true);
                return true;
            }
            var author = item.get('author');
            if (canedit === true && type == 'item' && author == id) {
                Mediakron.Edit.setCanEditStatus(true);
                return true;
            }
            Mediakron.Edit.setCanEditStatus(false);
            return false;
        }
        Mediakron.Edit.setCanEditStatus(false);
        return false;
    }
});

// This is the comment model
Mediakron.Models.Comment = Mediakron.Models.Model.extend({
  initialize: function(data) {
    this.uri = data.uri;
  },
  id: 0,
  start: 0,
  end: 0,
  user: false,
  snippet: "",
  comment: "",
  created: 0,
  changed: 0,
  private: "public",
  uri: "",
  urlRoot: function() {
    return Mediakron.Data.models.comments + "/" + this.get("uri");
  },
  defaults: function() {
    return {
      start: 0,
      end: 0,
      user: false,
      archive: false,
      snippet: "",
      comment: "",
      private: "public",
      created: 0,
      changed: 0
    };
  },
  getUsername: function() {
    var userid = this.get("user_id");
    var user = Mediakron.users.get(userid);
    if (user) {
      return user.get("name");
    }
    return "Guest";
  },

  archived: function() {
    if (this.get("archive")) {
      return true;
    }
    return false;
  },
  privateInt: function() {
    if (!isNaN(this.get("private"))) {
      return this.get("private");
    }
    switch (this.get("private")) {
      case "public":
        return 0;
      case "private":
        return 1;
      case "personal":
        return 2;
    }
    return 0;
  },
  story: function() {
    return Mediakron.getItemFromURI(this.get("uri"));
  },
  canAccess: function() {
    var uid = this.get("user_id");
    var user = false;
    if (Mediakron.user) {
      user = Mediakron.user.get("id");
    }
    var story = this.story();
    if (this.archived()) {
      if (uid == user || Mediakron.Access.check("can administer site")) {
        return true;
      } else {
        return false;
      }
    }
    if (this.privateInt() === 0) {
      return true;
    } else if (
      (this.privateInt() == 1 &&
        (uid == user || user == story.get("user").id)) ||
      Mediakron.Access.check("can administer site")
    ) {
      return true;
    } else if (this.privateInt() == 2 && uid == user) {
      return true;
    }
    return false;
  },
  canAct: function() {
    var uid = this.get("user_id");
    var user = false;
    if (Mediakron.user) {
      user = Mediakron.user.get("id");
    }
    var story = this.story();
    if (
      (this.privateInt() === 0 &&
        (uid == user || user == story.get("user").id)) ||
      Mediakron.Access.check("can administer site")
    ) {
      return true;
    } else if (
      (this.privateInt() == 1 &&
        (uid == user || user == story.get("user").id)) ||
      Mediakron.Access.check("can administer site")
    ) {
      return true;
    } else if (this.privateInt() == 2 && uid == user) {
      return false;
    }
    return false;
  },
  canArchive: function() {
    var uid = this.get("user_id");
    var user = false;
    if (Mediakron.user) {
      user = Mediakron.user.get("id");
    }
    var story = this.story();
    if (
      (this.privateInt() === 0 &&
        (uid == user || user == story.get("user").id)) ||
      Mediakron.Access.check("can administer site")
    ) {
      return true;
    } else if (
      (this.privateInt() == 1 &&
        (uid == user || user == story.get("user").id)) ||
      Mediakron.Access.check("can administer site")
    ) {
      return true;
    } else if (this.privateInt() == 2 && uid == user) {
      return false;
    }
    return false;
  },
  canEdit: function() {
    var uid = this.get("user_id");
    var user = false;
    if (Mediakron.user) {
      user = Mediakron.user.get("id");
    }
    var story = this.story();
    if (uid == user) {
      return true;
    }
    return false;
  },
  canDelete: function() {
    var uid = this.get("user_id");
    var user = false;
    if (Mediakron.user) {
      user = Mediakron.user.get("id");
    }
    var story = this.story();
    if ((this.privateInt() === 0 && uid == user) ||  Mediakron.Access.check("can administer site")) {
      return true;
    } else if ((this.privateInt() === 1 && uid == user) || Mediakron.Access.check("can administer site")) {
        return true;
    } else if ((this.privateInt() == 2 || uid == user) || Mediakron.Access.check("can administer site")) {
        return true;
    }
    return false;
  }
});