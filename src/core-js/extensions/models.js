
module.exports = function(){
    /**
     * 
     */
    return Backbone.Model.extend({
        folders: {},
        layers: {},
        tags: {},

        initialize: function () { },

        cacheFilters: function () {
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

        publish: function () {
            if (this.canPublish()) {
                this.publish = true;
            }
        },

        unpublish: function () {
            if (this.canUnpublish()) {
                this.publish = false;
            }
        },

        archived: false, // is the model published.  false indicates unpublished

        archive: function () {
            if (this.canArchive()) {
                this.archived = true;
            }
        },

        restore: function () {
            if (this.canArchive()) {
                this.archived = false;
            }
        },

        // what access does this user have

        canView: function (hideAlert) {
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

        canTransmit: function (alert) {
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

        canDuplicate: function (alert) {
            if (!Mediakron.Access.check('can create content')) {
                if (alert) Mediakron.Access.denied('Sorry, you must login to duplicate');
                return false;
            }
            return true;
        },

        canDownload: function (alert) {
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

        canEdit: function (alert) {
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
        canLock: function (alert) {
            var user = this.get('user');
            if (this.canEdit(alert)) {
                if (user.id == Mediakron.user.get('id')) return true;
                if (Mediakron.Access.check('can edit any locked content')) { return true; }
            }
            return false;
        },

        canManage: function (alert) {
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
        canAddTo: function (alert) {
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

        canRemoveFrom: function (alert) {
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

        canPublish: function (alert) {
            var user = this.get('user');
            if (Mediakron.Access.check('can publish content')) {
                return true;
            }
            if (alert) Mediakron.Access.denied('Sorry, you are not allowed to publish content');
            return false;
        },
        canArchive: function (alert) {
            var user = this.get('user');
            if (Mediakron.Access.check('can archive content')) {
                return true;
            }
            if (alert) Mediakron.Access.denied('Sorry, you are not allowed to archive content');
            return false;
        },
        canUnpublish: function (alert) {
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
        canDestroy: function (alert) {
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

        downloadable: function () {
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

        canOrganize: function () {
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
        cartoDB: function () {
            var map = this.get('map'),
                type = this.get('type');
            if (type != 'cartodb') return '';
            if (map.url) {
                return map.url;
            }
            return '';
        },
        duplicate: function () {
            var data = this.toJSON();
            delete data.id;
            delete data.uri;
            var newitem = new Mediakron.Models.Item();
            newitem.save(data, {
                success: function (model) {
                    model.addToCollection();
                    Mediakron.createUrlMap();
                    Mediakron.messages.message('Item Duplicated', 'success', 5000, 'bottom');
                    Mediakron.router.navigate('browse', {
                        trigger: true
                    });
                }
            });
        },

        metadata: function (id) {
            var metadata = this.get('metadata');
            if (metadata[id]) {
                return metadata[id];
            } else {
                return "";
            }
        },
        getClasses: function () {
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

        getStatus: function () {
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

        getStoryTeaser: function () {
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

        getPopup: function (template, options) {
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

        getLTIEmbed: function () {
            var url = '',
                type = this.get('type'),
                id = this.id,
                uri = this.get('uri');
            return Mediakron.Settings.url + '/lti/' + uri;
        },

        getFullUrl: function () {
            var url = '',
                type = this.get('type'),
                id = this.id,
                uri = this.get('uri');
            return Mediakron.Settings.url + '/' + uri;
        },

        /* Get a link to this topic */
        getLink: function () {
            var url = this.getURL(),
                title = this.get('title');
            return Mediakron.Theme.link(title, url);
        },


        getContextPopover: function (context, go) {
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

        getContextLink: function (context, go, urlOnly) {
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
        overlayType: function (type) {
            var overlay = this.getMapOverlay();
            if (overlay.type) {
                return overlay.type;
            }
            return false;
        },
        overlayTitle: function (title) {
            var overlay = this.getMapOverlay();
            if (overlay.title) {
                return overlay.title;
            }
            return '';
        },
        overlayUrl: function (url) {
            var overlay = this.getMapOverlay();
            if (overlay.url) {
                return overlay.url;
            }
            return '';
        },
        overlayFile: function (url) {
            var overlay = this.getMapOverlay();
            if (overlay.file) {
                return Mediakron.Settings.filepath + overlay.file;
            }
            return false;
        },
        overlayFileName: function (url) {
            var overlay = this.getMapOverlay();
            if (overlay.name) {
                return overlay.name;
            }
            return false;
        },
        getMapOverlay: function () {
            var overlay = this.get('overlay');
            return overlay;
        },
        getContextLinkTo: function (context) {
            var url = this.getURL(),
                title = this.get('title');
            if (typeof (context) == 'string') {
                url = context + '/' + url;
                title = Mediakron.getItemFromURI(context).get('title');
            } else if (typeof (context) == 'object') {
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

        getCrumbLink: function (t) {
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

        getCurrentUrl: function () {
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
        editURL: function () {
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
        editLink: function () {
            return Mediakron.Theme.link("<span title=\"Edit\" class=\"mk-icon mk-edit\"></span>&nbsp;<span class=\"button-text\">Edit</span>", this.editURL());
        },
        downloadUrl: function () {
            return Mediakron.Settings.basepath + "download/" + this.get('uri');
        },

        revisionUrl: function () {
            return "settings/revisions/" + this.get('uri');
        },

        transmitUrl: function () {
            return "settings/transmit/" + this.get('uri');
        },

        transmitLink: function () {
            return Mediakron.Theme.link("<span class=\"mk-icon mk-export transmit\" title=\"Copy to Site\" ></span>&nbsp;<span class=\"button-text\">Copy to Site</span>", this.transmitUrl());
        },

        duplicateUrl: function () {
            return "settings/duplicate/" + this.get('uri');
        },

        duplicateLink: function () {
            return Mediakron.Theme.link("<span class=\"mk-icon mk-duplicate duplicate\" title=\"Duplicate\" ></span>&nbsp;<span class=\"button-text\">Duplicate</span>", this.duplicateUrl());
        },

        publishURL: function () {
            return "settings/content/publish/" + this.get('uri');
        },

        publishLink: function () {
            if (this.canPublish(false)) return Mediakron.Theme.link("<span class=\"mk-icon mk-save publish\" title=\"Publish\" ></span>&nbsp;<span class=\"button-text\">Publish</span>", this.publishURL());
            return '';
        },

        unpublishURL: function () {
            return "settings/content/unpublish/" + this.get('uri');
        },

        unpublishLink: function () {
            if (this.canUnpublish(false)) return Mediakron.Theme.link("<span title=\"Unpublish\" class=\"mk-icon mk-unpublish unpublish\"></span>&nbsp;<span class=\"button-text\">Unpublish</span>", this.unpublishURL());
            return '';
        },

        archiveUrl: function () {
            return "settings/content/archive/" + this.get('uri');
        },

        archiveLink: function () {
            if (this.canArchive(false)) return Mediakron.Theme.link("<span class=\"mk-icon mk-archive unpublish\" title=\"Archive\" ></span>&nbsp;<span class=\"button-text\">Archive</span>", this.archiveUrl());
            return '';
        },
        restoreUrl: function () {
            return "settings/content/restore/" + this.get('uri');
        },

        restoreLink: function () {
            if (this.canArchive(false)) return Mediakron.Theme.link("<span title=\"Unarchive\" class=\"mk-icon mk-undo restore\"></span>&nbsp;<span class=\"button-text\">Unarchive</span>", this.restoreUrl());
            return '';
        },

        lockUrl: function () {
            return "settings/content/lock/" + this.get('uri');
        },

        lockLink: function () {
            if (this.canLock(false)) return Mediakron.Theme.link("<span class=\"mk-icon mk-lock\" title=\"Lock\" ></span>&nbsp;<span class=\"button-text\">Lock</span>", this.lockUrl());
            return '';
        },
        unlockUrl: function () {
            return "settings/content/unlock/" + this.get('uri');
        },

        unlockLink: function () {
            if (this.canLock(false)) return Mediakron.Theme.link("<span title=\"Unlock\" class=\"mk-icon mk-unlocked\"></span>&nbsp;<span class=\"button-text\">Unlock</span>", this.unlockUrl());
            return '';
        },

        deleteURL: function () {
            return "settings/content/delete/" + this.get('uri');
        },

        deleteLink: function () {
            return Mediakron.Theme.link("<span title=\"Delete\" class=\"mk-icon mk-delete\"></span>&nbsp;<span class=\"button-text\">Delete</span>", this.deleteURL());
        },


        // return this item as the url to its image styled with a certian theme
        getStyledImage: function (style) {
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
        getImage: function (style, addClass) {
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
        inTopic: function (uri) {
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

        hasParent: function () {
            var relationships = this.get('relationships');
            if (relationships.topics.length > 0 ||
                relationships.tags.length > 0 ||
                relationships.maps.length > 0 ||
                relationships.timelines.length > 0) {
                return true;
            }
            return false;
        },
        hasMetadata: function () { /* "Other Metadata" Fields */
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
        hasSource: function () { /* "Source" fields */
            var metadata = this.get('metadata');
            if (metadata.source !== "" ||
                metadata.citation !== "") {
                return true;
            }
            return false;
        },
        hasTags: function () {
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
        getNormalType: function () {
            var type = this.get('type');
            switch (type) {
                case 'map':
                case 'image-map':
                case 'carto-voyager':
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
        getOption: function (opt) {
            var options = this.get('options');
            if (options[opt]) {
                return options[opt];
            }
            return false;
        },
        getColor: function () {
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
        getSquareImage: function (style, width, height, link) {
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
        getMosaicImage: function (style, width, height, link) {
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

        getRelationship: function (relationship) {
            var relationships = this.get('relationships');
            if (!relationships[relationship]) return [];
            return relationships[relationship];
        },
        getRelationshipByURI: function (uri, relationship) {
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
        fetchRelationship: function (uri, relationship) {
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
        setRelationship: function (relationship, data) {
            var relationships = this.get('relationships');
            relationships[relationship] = data;
            this.set('relationships', relationships);
        },
        getMetadata: function (attribute) {
            var metadata = this.get('metadata');
            return metadata[attribute];
        },
        getRelationalForm: function (relationship) {
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
        getSidebar: function (parent) {
            this.parent = parent;
            var sidebar = new Mediakron.Sidebar.Init(this);
            sidebar.render();
            //        $('.page-options a').tooltip();

            return sidebar;
        },
        renderMaps: function () {

            var m, map, maps = this.get('maps');
            for (m in maps) {
                map = Mediakron.getItemFromURI(maps[m]);
                Mediakron.Maps.Theme(map, 'map-sidebar-' + this.get('uri'));
            }
        },
        metadataForm: function () {
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
        wysiwygForm: function () {
            var template = JST['settings.section.wysiwyg'],
                html = template();
            return html;
        },
        defaultData: function () {
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
                case 'carto-voyager':
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
        getTagsComma: function () {
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
        formatEvent: function (uri, which) {
            if (!which) which = 'start';
            var time = this.getRelationship('timeline');
            _.each(time, function (time) {

            });
        },
        addComment: function (html) {
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
        getFeature: function (addClass) {
            if (!addClass) addClass = '';
            return '<figure id="feature-' + this.get('uri') + '-' + Date.now().toString(16) + '" uri="' + this.get('uri') + '" contenteditable="false" class="feature type-' + this.getNormalType() + ' ' + addClass + '" type="' + this.getNormalType() + '" />';
        },
        getChild: function (uri, type) {
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
        getChildByUri: function (uri) {
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
                case 'carto-voyager':
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
        start: function () {
            if (!this.get('date')) return false;
            if (this.get('date').start) return this.get('date').start;
            return false;
        },
        end: function () {
            if (!this.get('date')) return false;
            if (this.get('date').end) return this.get('date').end;
            return false;
        },
        add: function (child, data, skipSave) {
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
                case 'carto-voyager':
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
        remove: function (child, callback) {
            var parent = this,
                type = this.get('type'),
                relateTo, relateFrom,
                children = [],
                parents = [],
                i = 0,
                length, uri = this.get('uri'),
                found = [];
            if (typeof (child) == 'string') {
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
                case 'carto-voyager':
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
                    success: function (model) {
                        if (callback) {
                            callback(model);
                        }
                    }
                });
            }
            found = [];
            if (typeof (child) != 'string') {
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
        skips: function () {
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
                case 'carto-voyager':
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

        hasDate: function () {
            var date = this.get('date');
            var validate = Mediakron.validateTimeline(date);
            if (!validate) {
                return true;
            } else {
                return false;
            }
        },
        validateTimeline: function (changes) {
            var date = this.get('date');
            if (changes) {
                date = changes;
            }
            return Mediakron.validateTimeline(date);
        },

        updateAnnotationRelationship: function () {
            var saveAnnotations = [],
                annotations = this.get('annotations'),
                attachments = [];
            _.each(annotations, function (annotation, id) {
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
                if (item) {
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
        getCreated: function () {
            return Mediakron.formatUnixDateStamp(this.get('created'), 'small');
        },
        getChanged: function () {
            return Mediakron.formatUnixDateStamp(this.get('changed'), 'small');
        },
        getRow: function (context, callback, thumbnails, extra) {
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
}