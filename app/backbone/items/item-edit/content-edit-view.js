import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./content-edit.html";

var view = false;

export default class ContentEdit extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'ContentEdit',
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
            // Depricate this?
            'submit form': 'cancelLinkHandle',
            'click a.help-link': Mediakron.linkHandle,
            'click .metadata-toggle': "openMetadata",
            'click #metadata .close': "closeMetadata",
            // wysiwyg
            'mousedown .wysiwyg-button': Mediakron.Wysiwyg.apply,
            'mousedown .enable-wysiwyg': "bindWysiwygListner",
            'mouseup .enable-wysiwyg': "openWysiwyg",
            'keyup .enable-wysiwyg': "openWysiwyg",
            'paste div.model-field': "cleanPaste",
            'paste .enable-wysiwyg': "cleanPaste",
            'blur .enable-wysiwyg': "blurWysiwyg",
            'focus .enable-wysiwyg': "focusWysiwyg",
            'click .all-tags .choose-tag': "showTags",
            // validate uri
            'keyup #uri': "checkURI",
            // prevent accidential link clicking in wysiwyg
            'click .enable-wysiwyg a': "preventLinks",
            //
            'blur .model-field': "changeModel",
            'change .template-field': "changeModel",
            'change .model-select': "changeModel",
            'change .sidebar-field': "setSidebarDefault",
            'click .options': "setOptions",
            'click #upload-image': "triggerImage",
            'click #upload-file': "triggerFile",
            'click #upload-audio': "triggerAudio",
            'click #upload-video': "triggerVideo",
            'click #remove-image': "removeFile",
            'click #remove-file': "removeFile",
            'change #image-file': "addImage",
            'change #text-file': "addText",
            'change #audio-file': "addAudio",
            'change #video-file': "addVideo",
            'change #text-type': "setTextType",
            'change #video-type': "setVideoType",
            'change #audio-type': "setAudioType",
            'click .section-title': "toggleSection",
            'dragenter #file-upload': "dragEnter",
            'dragover #file-upload': "dragOver",
            'drop #file-upload': "dropFile",
            'change #map-type': "changeMapType",
            'change #scope': "changeScope",
            'click #done-editing': 'save',
            'click #unpublish': 'unpublish',
            'click #publish': 'publish',
            'click #delete-item': 'deleteItem',
            'click #cancel-editing': 'cancel',
            'click #close-settings-context': 'cancel',
            'click .close-settings-top': 'cancel',
            'click .close-button': 'cancel',
            'click .overlay-bg': 'cancel',
            'click .add-field-tag': 'checkTagField',
            'click .remove-tag': 'removeTag',
            'click .add-tag': 'addTag',
            'click .tab-link': 'tab',
            'click .accordion-link': 'accordion',
            'click .wlink-internal': 'showWysiwgyInternal',
            'change .filter-field': "setFilterOptions",
            'click .select-icon': "selectIcon",
            'click .close-icon, .icon-item': 'closeIcon',
            'change #overlay-type': 'changeOverlay',
            'click #upload-geojson': 'triggerGeojon',
            'change #image-geojson': 'uploadGeojson',
            'click #remove-geojson': 'removeGeojson'
        }
    }

    afterrender() {

    }

    // hide the loading interface.
    hideLoad() {
        $('#edit-loading').hide();
    },
    // After Render
    afterRender() {
        // Initialize variables
        var model = this.model,
            changes = this.changes,
            children = this.model.getRelationship('children'),
            view = this,
            map;
        // Initialize the chosen variables
        $('select#map-type').chosen();
        $('select#choose-tag').chosen().change(function(evt, params) {
            view.addTag(evt, params);
        });



        // If there is a model (its unclear how its possible that this isn't set)
        if (model) {
            // If its a map, render the map view
            if (model.getNormalType() == 'map') {
                // Get the map type
                var mapType = model.get('type');
                $('.map-image').hide();
                $('.map-tiles').show();
                $('.map-create').empty().hide();

                // If its a map image, just show the image upload (with thumbnail)
                if (mapType == 'map') {} else if (mapType == 'image-map') {
                    $('.map-image').show();
                    // If its a carto map, hide the map tiles and show the carto url field
                } else if (mapType == 'cartodb') {
                    $('.cartodb-url').removeClass('hide');
                    $('.map-tiles').hide();
                    // Show the map create interface via leaflet
                } else {
                    $('.map-create').show();
                    // render the map
                    map = Mediakron.Maps.Theme(model, 'map-' + this.randomID, mapType, '500px', model.get('zoom'), true);
                    // track map changes and attach them to the map data
                    map.on('moveend', function(evt) {
                        var center = evt.target.getCenter(),
                            zoom = evt.target.getZoom();
                        // Save center and zoom
                        changes.center = center;
                        changes.zoom = zoom;
                    });
                }
                // if its a video
            } else if (model.getNormalType() == 'video') {
                var video = model.get('video');
                // Show the video field if the url is a meaningful field
                if (video.type == 'youtube' || video.type == 'vimeo' || video.type == 'bc' || video.type == 'panopto') {
                    $('#video-start-field').removeClass('hide');
                    $('#video-end-field').removeClass('hide');
                }
            }
            // if its a timemap, we need to attach timeline data to the map field
            if (model.get('template') == 'timemap') this.bindTimeMap();
        }
        this.$el.after('<div id="admin-link-content" />');
        view.checkPoll();
        if (this.edit) {
            this.$el.append('<div id="edit-loading" >Loading</div>');
            // listen for someone else editing this item
            Mediakron.App.Events.on('poll', function(object) {
                // the poll just ran.  Lets check to see if anyone is editing this
                view.checkPoll();
            });
        }
        $('select#audio-type').chosen();
        $('select#text-type').chosen();
        if (map) {
            map.invalidateSize();
        }
        if (model.get('type') == 'layer' || model.get('type') == 'folder') {
            $('#layer-color').spectrum({
                showPaletteOnly: true,
                hideAfterPaletteSelect: true,
                togglePaletteOnly: true,
                togglePaletteMoreText: 'more',
                togglePaletteLessText: 'less',
                clickoutFiresChange: true,
                preferredFormat: "hex",
                showInput: true,
                // Default color pallets
                palette: [
                    ["#030303", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                    ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                    ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                    ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                    ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                    ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                    ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                    ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
                ],
                change(color) {
                    Mediakron.Status.formChanged = true;
                    changes.options.color = color.toHexString();
                }
            });
            require(["src/filters"], function(initialize) {
                initialize(function(icon) {
                    Mediakron.Status.formChanged = true;
                    changes.options.icon = icon;
                    var curicon = $('.current-icon');
                    curicon.removeClass();
                    curicon.addClass('current-icon');
                    curicon.addClass(icon);
                });
            });
        }
        if (model.getNormalType() == 'map' && this.edit) {
            //this.initializeMapVisibility(this.model.get('type'));
        }

        /* Load accessible accordion plugin */
        //$('.js-accordion').accordion();

        /* Add a class to the last panel to provide enough padding */
        $('.js-accordion__panel').last().addClass('last');


        /* Load accessible expand/collapse plugin
        https://github.com/nico3333fr/jquery-accessible-hide-show-aria
        */

        accessibleExpand(this.$el);

        // Set the various openings and closings according to the model parameters
        $('.author-date .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
        $('.author-date .js-to_expand').attr('data-hidden', 'false');

        // If it has a description
        if (model.get('description')) {
            $('#description-field .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('#description-field .js-to_expand').attr('data-hidden', 'false');
        }

        // If it has a transscript
        if (model.get('transcript')) {
            $('#transript-field .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('#transript-field .js-to_expand').attr('data-hidden', 'false');
        }

        // If it has a source
        if (model.hasSource()) {
            $('#source-fields .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('#source-fields .js-to_expand').attr('data-hidden', 'false');
        }

        // If it has a date
        if (model.hasDate()) {
            $('#date-fields .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('#date-fields .js-to_expand').attr('data-hidden', 'false');
        }

        // If it has metadata
        if (model.hasMetadata()) {
            $('#metadata-fields .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('#metadata-fields .js-to_expand').attr('data-hidden', 'false');
        }

        // If we have tags
        if (model.hasTags()) {
            $('.field-group-tags .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('.field-group-tags .js-to_expand').attr('data-hidden', 'false');
        }

        if (model.get('image')) {
            $('.field-group-thumbnail .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('.field-group-thumbnail .js-to_expand').attr('data-hidden', 'false');
        }

        /* If there's a folder color, expand the fieldset */
        if (model.getOption('color')) {
            $('#folder-styles .js-expandmore button').addClass('is-opened has-data').attr('aria-expanded', 'true');
            $('#folder-styles .js-to_expand').attr('data-hidden', 'false');
        }

        /* If there's featured info , expand the fieldset */
        if (model.getOption('defaultSidebar')) {
            var featured = model.getOption('defaultSidebar');
            if (featured != 'none') {
                $('#featured-information .js-expandmore button').addClass('is-opened has-data').attr('aria-expanded', 'true');
                $('#featured-information .js-to_expand').attr('data-hidden', 'false');
            }
        }

        /* If there are map sidebar options checked , expand the fieldset */
        if (model.getOption('hideSidebar') || model.getOption('layersHidden') || model.getOption('filtersHidden')) {
            $('.filters-layers .js-expandmore button').addClass('is-opened has-data').attr('aria-expanded', 'true');
            $('.filters-layers .js-to_expand').attr('data-hidden', 'false');
        }
        return this;
    },
    /**
     * Poll the server, both to let the server know we are editing this
     * and to detect others editing.  This also does some stat work
     */
    checkPoll() {
        if (this.edit && this.model) {
            var uri = this.model.get('uri'),
                check = false;
            if (Mediakron.Status.currentEditing[uri]) {
                check = Mediakron.Status.currentEditing[uri];
                if (check == 2) {
                    $('#editors').removeClass('hide').text("Someone else is editing this page. If you save now, you may over-write the other person's changes.");
                } else if (check > 2) {
                    $('#editors').removeClass('hide').text("There are a couple editors working on this page right now. If you save now, you may over-write changes made elsewhere.");
                } else {
                    $('#editors').text("").addClass('hide');
                }
            }
        }
    },
    /**
     * Bound events
     */
    events: {
        // Depricate this?
        'submit form': 'cancelLinkHandle',
        'click a.help-link': Mediakron.linkHandle,
        'click .metadata-toggle': "openMetadata",
        'click #metadata .close': "closeMetadata",
        // wysiwyg
        'mousedown .wysiwyg-button': Mediakron.Wysiwyg.apply,
        'mousedown .enable-wysiwyg': "bindWysiwygListner",
        'mouseup .enable-wysiwyg': "openWysiwyg",
        'keyup .enable-wysiwyg': "openWysiwyg",
        'paste div.model-field': "cleanPaste",
        'paste .enable-wysiwyg': "cleanPaste",
        'blur .enable-wysiwyg': "blurWysiwyg",
        'focus .enable-wysiwyg': "focusWysiwyg",
        'click .all-tags .choose-tag': "showTags",
        // validate uri
        'keyup #uri': "checkURI",
        // prevent accidential link clicking in wysiwyg
        'click .enable-wysiwyg a': "preventLinks",
        //
        'blur .model-field': "changeModel",
        'change .template-field': "changeModel",
        'change .model-select': "changeModel",
        'change .sidebar-field': "setSidebarDefault",
        'click .options': "setOptions",
        'click #upload-image': "triggerImage",
        'click #upload-file': "triggerFile",
        'click #upload-audio': "triggerAudio",
        'click #upload-video': "triggerVideo",
        'click #remove-image': "removeFile",
        'click #remove-file': "removeFile",
        'change #image-file': "addImage",
        'change #text-file': "addText",
        'change #audio-file': "addAudio",
        'change #video-file': "addVideo",
        'change #text-type': "setTextType",
        'change #video-type': "setVideoType",
        'change #audio-type': "setAudioType",
        'click .section-title': "toggleSection",
        'dragenter #file-upload': "dragEnter",
        'dragover #file-upload': "dragOver",
        'drop #file-upload': "dropFile",
        'change #map-type': "changeMapType",
        'change #scope': "changeScope",
        'click #done-editing': 'save',
        'click #unpublish': 'unpublish',
        'click #publish': 'publish',
        'click #delete-item': 'deleteItem',
        'click #cancel-editing': 'cancel',
        'click #close-settings-context': 'cancel',
        'click .close-settings-top': 'cancel',
        'click .close-button': 'cancel',
        'click .overlay-bg': 'cancel',
        'click .add-field-tag': 'checkTagField',
        'click .remove-tag': 'removeTag',
        'click .add-tag': 'addTag',
        'click .tab-link': 'tab',
        'click .accordion-link': 'accordion',
        'click .wlink-internal': 'showWysiwgyInternal',
        'change .filter-field': "setFilterOptions",
        'click .select-icon': "selectIcon",
        'click .close-icon, .icon-item': 'closeIcon',
        'change #overlay-type': 'changeOverlay',
        'click #upload-geojson': 'triggerGeojon',
        'change #image-geojson': 'uploadGeojson',
        'click #remove-geojson': 'removeGeojson'
    },
    /**
     * Fire the geojson upload button
     */
    triggerGeojon() {
        $('#image-geojson').click();
    },

    /**
     * Fire the geojson upload button
     */
    removeGeojson() {
        this.changes.overlay = {
            type: 'geojson'
        };
        $('.overlay-file').addClass('hide');
        $('#remove-geojson').addClass('hide');
        $('.overlay-file').text('');
        $('#upload-geojson').removeClass('hide');
    },

    /**
     * Upload a geojson file
     */
    uploadGeojson(e) {
        var deferred = $.Deferred();
        var view = this;
        var reader = new FileReader();
        var files = e.target.files; // FileList objectId
        // files is a FileList of File objects. List some properties.
        file = files[0];
        if (file.type != 'application/json' && file.type != 'application/vnd.geo+json') {
            Mediakron.message.error('File is not GeoJSON');
            return false;
        }
        /**
         * Listen for the onload event
         */
        reader.onload = function(e) {
            Mediakron.messages.progressMessage('Uploading File', 0);
            Mediakron.Status.uploadInProgress = true;
            $.ajax({
                url: Mediakron.Data.upload, // Upload to the
                data: {
                    uploadfilename: encodeURIComponent(file.name),
                    file: e.target.result
                },
                type: "post",
                cache: false,
                xhr() {
                    var xhr = new window.XMLHttpRequest();
                    //Upload progress
                    xhr.upload.addEventListener("progress", function(evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = Math.floor((evt.loaded / evt.total) * 100);
                            Mediakron.messages.progressUpdate(percentComplete);
                            //Do something with upload progress

                        }
                    }, false);
                    //Download progress
                    xhr.addEventListener("progress", function(evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                        }
                    }, false);
                    return xhr;
                },
                success(event, message, response) {
                    Mediakron.Status.uploadInProgress = false;
                    Mediakron.messages.progressClose();
                    var data = JSON.parse(event);
                    view.changes.overlay = {
                        type: 'geojson',
                        file: data.file,
                        name: data.name
                    };
                    $('.overlay-file').removeClass('hide');
                    $('#remove-geojson').removeClass('hide');
                    $('.overlay-file').text(data.name);
                    $('#upload-geojson').addClass('hide');
                    deferred.resolve(data);
                },
                error(request) {
                    Mediakron.Status.uploadInProgress = false;
                    Mediakron.message({
                        'type': 'danger',
                        text: 'Your upload has failed',
                        timeout: 3000,
                        layout: 'center',
                        confirm: false,
                        dismiss: true
                    });
                    deferred.failed(request);
                }
            });
        };
        reader.readAsDataURL(file);
        return deferred.promise();
    },
    /**
     * Bind to the overlay select and show the overlay
     * type
     */
    changeOverlay(e) {
        var val = $(e.currentTarget).val();
        if (val) {
            $('.overlay-setting').addClass('hide');
            $('.overlay-' + val).removeClass('hide');
        }
    },
    /**
     * Show the internal wysiwyg bind
     */
    showWysiwgyInternal() {
        var data, callback, navView = this;
        $('#linkbrowser-contents').scrollTop(0);
        data = {
            'context': false,
            'el': '#linkbrowser-contents',
            'callback'(menu) {
                navView.restoreRange();
                var selection = window.getSelection(),
                    oRange = selection.getRangeAt(0),
                    ancestor = $(oRange.commonAncestorContainer),
                    parentEditor = ancestor.closest("div[contenteditable='true']");
                document.execCommand('createLink', false, basepath + menu.get('uri'));
                Mediakron.controller.closeLinkBrowser();
                $('.normal-wysiwyg').removeClass('hide');
                $('.wlink-tool').addClass('hide');
                if (findinselection('a', parentEditor[0])) {
                    $('.wysiwyg-link').addClass('hide');
                    $('.wysiwyg-unlink').removeClass('hide');
                } else {
                    $('.wysiwyg-link').removeClass('hide');
                    $('.wysiwyg-unlink').addClass('hide');
                }
            },
            'cancelCallback'() {
                navView.restoreRange();
                Mediakron.controller.closeLinkBrowser();
                $('.normal-wysiwyg').removeClass('hide');
                $('.wlink-tool').addClass('hide');
            }
        };
        Mediakron.controller.openLinkBrowser();
        view = new Mediakron.ContentBrowser.LinkSelector(data);
        html = view.render();
        view.afterRender();
    },
    /**
     * Handle the cancel event
     */
    cancelLinkHandle(e) {
        e.preventDefault();
        return false;
    },
    /**
     * Show the tags
     */
    showTags() {
        $('.all-tags ul').slideToggle('fast');
    },
    /**
     * Get the date from the form and load it into the change object
     * with some validation
     */
    updateDate() {
        var date = this.model.get('date');
        if (!date) {
            date = {
                start: false,
                end: false
            };
        }
        date.start = this.getDate($('.datewidget-start', this.$el));
        date.end = this.getDate($('.datewidget-end', this.$el));
        if (this.model.getNormalType() == 'timeline') {
            if (!date.start || !date.end) {
                Mediakron.message.error("You must provide a start and end date for a timeline.");
                return false;
            }
        }
        if (date.start) {
            if (date.end) {
                if (Mediakron.serializeDate(date.start) > Mediakron.serializeDate(date.end)) {
                    Mediakron.message.error("The start date must be beore the end date.");
                    return false;
                }
            }
        }
        this.changes.date = date;
        return true;
    },

    /**
     * Read the date object within a scope
     */
    getDate(scope) {
        var date = {};
        if (!scope) return false;
        if (scope.length === 0) return false;
        if ($(".year input", scope).val().length > 0) date.year = $(".year input", scope).val();
        if ($("[date='month']", scope).val().length > 0) date.month = $("[date='month']", scope).val();
        if ($(".day input", scope).val().length > 0) date.day = $(".day input", scope).val();
        if ($(".hour input", scope).val().length > 0) date.hour = $(".hour input", scope).val();
        if ($(".minute input", scope).val().length > 0) date.minute = $(".minute input", scope).val();
        if ($(".second input", scope).val().length > 0) date.second = $(".second input", scope).val();
        if (_.size(date) > 0) return date;
        return false;
    },
    /**
     * Issue the save
     */
    save(e, a) {
        e.preventDefault();
        Mediakron.Status.formChanged = false;
        $('#done-editing').html('<span class="mk-icon mk-save"> </span> Saving...');
        if (Mediakron.Status.uploadInProgress) {
            Mediakron.message({
                'type': 'warning',
                'dismiss': true,
                'layout': 'center',
                'confirm': false,
                'text': 'There is an upload in progress. One moment please...'
            });
            return false;
        }

        var valid = this.updateDate();
        if (!valid) {
            return false;
        }
        var model = this.model,
            callback, changes = this.changes,
            contentForm = this;
        if (this.callback) {
            callback = this.callback;
        }
        if (this.validate) {
            if (!this.validate(model, this.changes)) {
                return false;
            }
        }
        if (!Mediakron.Edit.ValidateContent(model, this.changes, e)) {
            return false;
        }
        if (model.getNormalType() == 'map') {

            this.changes.map = {
                url: $('#cartodb-url').val()
            };

            var overlayType = $('#overlay-type').val();
            if (overlayType == 'geojson') {

            } else if (overlayType == 'tilemap') {
                this.changes.overlay = {
                    type: overlayType,
                    title: $('#overlay-title').val(),
                    url: $('#overlay-url').val(),
                };
            }
        }

        model.set(this.changes);
        if (model.get('template') == 'timemap') {
            var start = this.startWidget.validate('start'),
                end = this.endWidget.validate('end');
            if (!start || !end) {
                Mediakron.message({
                    text: "You have provided an invalid value for one of the date entries.  Please check the highlighted box and try again.",
                    type: 'warning',
                    'timeout': 3000,
                    'dismiss': true,
                    layout: 'center'
                });
                return false;
            }
            this.changes.options.start = start;
            this.changes.options.end = end;
        }
        model.save(this.changes, {
            success() {
                model.addToCollection();
                Mediakron.createUrlMap();
                _.each(contentForm.tags, function(tag) {
                    tag.add(model, {});
                });
                if (contentForm.edit) {
                    Mediakron.App.Events.trigger('content:update:save', {
                        model: model
                    });
                } else {
                    Mediakron.App.Events.trigger('content:create:save', {
                        model: model
                    });
                }
                if (callback) {
                    callback(model);
                } else {
                    Mediakron.message({
                        'timeout': 4000,
                        'type': 'success',
                        'text': '<span class="mk-icon mk-save"></span> Changes saved',
                        'layout': 'bottom',
                        'confirm': false,
                        'dismiss': true
                    });
                    if (contentForm.edit) {
                        Mediakron.controller.gotoLast();
                        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
                    } else {
                        Mediakron.router.navigate('/' + model.get('uri'), {
                            trigger: true
                        });
                        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
                    }
                }
            },
            error() {}
        });
        return false;
    },
    removeTag(e) {
        var field = $(e.currentTarget),
            uri = field.parent().attr('uri'),
            tag = Mediakron.getItemFromURI(uri);
        field.parent().remove();
        if (this.edit && this.tags[uri]) {
            this.tags[uri].remove(this.model);
        }
        delete this.tags[uri];
    },
    addTag(e, params) {
        var uri;
        e.preventDefault();
        if (params.selected) {
            uri = params.selected;
            tag = Mediakron.getItemFromURI(uri);
            this.tags[uri] = tag;
            $('#tag-list').append('<li uri="' + uri + '">' + tag.get('title') + '<button class="remove-tag btn submit btn-no-style"><span class="mk-icon mk-remove"> </span> <span class="sr-only">Remove Tag</span></button></li>');
            return true;
        } else if (params.deselected) {
            uri = params.deselected;
            tag = Mediakron.getItemFromURI(uri);
            if (this.edit && this.tags[uri]) {
                this.tags[uri].remove(this.model);
            }
            delete this.tags[uri];
            $('li[uri=' + uri + ']', $('#tag-list')).remove();
            return true;
        }
    },
    checkTagField(e) {
        e.preventDefault();
        var field = $('#tag-field'),
            curValue = field.val(),
            tags = curValue.split(','),
            count = tags.length,
            i = 0,
            list = $('#tag-list'),
            model, divs = {},
            models = {},
            view = this;
        _.each(tags, function(tag) {
            i++;
            var id = i;
            divs[id] = $('<li></li>').text('Adding Tag: ' + tag);
            list.append(divs[i]);
            $.get(Mediakron.Data.addTags + '/' + tag, {}, function(data) {
                model = new Mediakron.Models.Item(JSON.parse(data));
                divs[id].html(model.get('title') + '<button type="submit" class="remove-tag btn submit btn-no-style"><span class="mk-icon mk-remove"> </span> <span class="sr-only">Remove Tag</span></button>').attr('uri', model.get('uri'));
                $('.remove-tag', divs[id]).click(function() {
                    divs[id].remove();
                    delete view.tags[model.get('uri')];
                });
                model.addToCollection();
                Mediakron.createUrlMap();
                view.tags[model.get('uri')] = model;
                if (id == count) {
                    field.text('');
                }
            });
        });
        return false;
    },
    triggerImage(e) {
        e.preventDefault();
        $('#image-file').click();
        return false;
    },
    triggerFile(e) {
        e.preventDefault();
        $('#text-file').click();
        return false;
    },
    triggerAudio(e) {
        e.preventDefault();
        $('#audio-file').click();
        return false;
    },
    triggerVideo(e) {
        e.preventDefault();
        $('#video-file').click();
        return false;
    },
    removeFile(e) {
        e.preventDefault();
        $('#remove-image').addClass('hide');
        $('#remove-file').addClass('hide');
        $('.field-alt').addClass('hide');
        $('.edit-thumbnail').empty();
        $('#upload-image').html('<span class="mk-icon mk-upload"> </span> Upload Image'); /* restore upload button text */
        this.changes.image = {};
        this.changes.audio = {};
        this.changes.video = {};
        this.changes.text = this.model.get('text');
        delete this.changes.text.url;
        delete this.changes.text.mime;
        this.changes.size = {};
        return false;
    },
    unpublish(e) {
        e.preventDefault();
        this.changes.published = '0';
        this.save(e);
        return false;
    },
    publish(e) {
        e.preventDefault();
        this.changes.published = '1';
        this.save(e);
        return false;
    },
    deleteItem(e) {
        e.preventDefault();
        Mediakron.router.SettingsContentConfirm('delete', this.model.get('uri'));
        return false;
    },
    cancel(e) {
        e.preventDefault();
        if (this.edit) {
            var model = this.model;
        }
        if (Mediakron.Status.formChanged) {
            if (this.edit) {
                var uri = this.model.get('uri');
                text = "You have unsaved changes on this form.  Are you sure you want to cancel?";
                accept = function(request) {
                    Mediakron.Status.formChanged = false;
                    Mediakron.App.Events.trigger('content:edit:cancel', {
                        model: this.model
                    });
                    Mediakron.controller.gotoLast();
                };
                reject = function(request) {};
                Mediakron.message({
                    text: text,
                    type: 'warning',
                    timeout: 0,
                    layout: 'center',
                    confirm: true,
                    callback() {
                        accept();
                    },
                    cancel() {
                        reject();
                    }
                });
            } else {
                text = "You have unsaved changes on this form.  Are you sure you want to cancel?";
                accept = function(request) {
                    Mediakron.Status.formChanged = false;
                    Mediakron.App.Events.trigger('content:create:cancel');
                    Mediakron.controller.gotoLast();
                };
                reject = function(request) {};
                Mediakron.message({
                    text: text,
                    type: 'warning',
                    timeout: 0,
                    layout: 'center',
                    confirm: true,
                    callback() {
                        accept();
                    },
                    cancel() {
                        reject();
                    }
                });
            }
        } else {
            if (this.edit) {
                Mediakron.App.Events.trigger('content:edit:cancel', {
                    model: this.model
                });
                Mediakron.controller.gotoLast();
                Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
            } else {
                Mediakron.App.Events.trigger('content:create:cancel');
                Mediakron.router.back();
                Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
            }
        }
        return false;
    },
    close(e) {
        e.preventDefault();
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
        return false;
    },
    setSidebarDefault(e) {
        var defaultVal = $(e.currentTarget).val();
        if (!this.changes.options) {
            this.changes.options = this.model.get('options');
        }
        if (this.changes.options.length < 1) this.changes.options = {};
        this.changes.options.defaultSidebar = defaultVal;
        Mediakron.Status.formChanged = true;
    },
    setFilterOptions(e) {
        var defaultVal = $(e.currentTarget).val(),
            param = $(e.currentTarget).attr('option-attr'),
            checked = $(e.currentTarget).prop('checked');
        if (!this.changes.options) {
            this.changes.options = this.model.get('options');
        }
        if (this.changes.options.length < 1) this.changes.options = {};
        if (!checked) {
            this.changes.options[param] = false;
        } else {
            this.changes.options[param] = defaultVal;
        }
        Mediakron.Status.formChanged = true;
    },
    setOptions() {
        var option, checked, view = this;
        if (!this.changes.options) {
            this.changes.options = this.model.get('options');
        }
        if ($.isArray(this.changes.options)) {
            this.changes.options = {};
        }
        $('.options').each(function(item, div) {
            option = $(div).val();
            checked = $(div).prop('checked');
            view.changes.options[option] = checked;
        });
        Mediakron.Status.formChanged = true;
    },
    setTextType(e) {
        var type = $(e.currentTarget).val();
        if (type == 'image' || type == 'pdf' || type == 'word' || type == 'ppt') {
            $('.body-field').addClass('hide');
            $('.transcript-field').removeClass('hide');
        } else if (type == 'html' || type == 'text' || type == 'tei') {
            $('.body-field').removeClass('hide');
            $('.transcript-field').addClass('hide');
        } else {
            $('.body-field').addClass('hide');
            $('.transcript-field').addClass('hide');
        }
        if (!this.changes.text) {
            this.changes.text = this.model.get('text');
        }
        if ($.isArray(this.changes.text)) {
            this.changes.text = {};
        }
        Mediakron.Status.formChanged = true;
        this.changes.text.type = type;
    },
    setVideoType(e) {
        var type = $(e.currentTarget).val();
        switch (type) {
            case 'mp4':
                $('#video-upload').removeClass('hide');
                $('.video-message-unsupported').addClass('unsupported-video');
                $('#video-url-field').addClass('hide');
                $('#video-timecodes').addClass('hide');
                break;
            case 'youtube':
            case 'vimeo':
            case 'panopto':
            case 'bc':
                $('#video-upload').addClass('hide');
                $('.video-message-unsupported').removeClass('unsupported-video');
                $('.video-message-select').addClass('hide');
                $('#video-url-field').removeClass('hide');
                $('#video-timecodes').removeClass('hide');
                break;
            default:
                $('#video-upload').addClass('hide');
                $('#video-url-field').removeClass('hide');
                $('#video-timecodes').addClass('hide');
                $('.video-message-select').addClass('hide');
                $('.video-message-unsupported').addClass('unsupported-video');
                break;
        }
        //        $('#video-url').prop('disabled', false);
        //        $('#video-start').prop('disabled', false);
        //        $('#video-end').prop('disabled', false);
        Mediakron.Status.formChanged = true;
        if (!this.changes.video) {
            this.changes.video = this.model.get('video');
        }
        if ($.isArray(this.changes.video)) {
            this.changes.text = {};
        }
        this.changes.video.type = type;
    },
    setAudioFieldVisibility(type) {
        if (type == 'mp3') {
            $('#audio-upload').removeClass('hide');
            $('#audio-url-field').addClass('hide');
        } else {
            $('#audio-upload').addClass('hide');
            $('#audio-url-field').removeClass('hide');
        }
    },
    setAudioType(e) {
        var type = $(e.currentTarget).val();
        this.setAudioFieldVisibility(type);
        Mediakron.Status.formChanged = true;
        if (!this.changes.audio) {
            this.changes.audio = this.model.get('audio');
        }
        if ($.isArray(this.changes.audio)) {
            this.changes.audio = {};
        }
        this.changes.audio.type = type;
    },
    changeMapType(e) {
        var type = $(e.currentTarget).val(),
            model = this.model,
            changes = this.changes;
        $('.map-image').hide();
        $('.map-create').remove();
        $('.map-tiles').show();
        changes.type = type;
        Mediakron.Status.formChanged = true;
        var mapHolder = $('<div id="map-' + this.randomID + '" class="field map-create map" style="display: none;"></div>');
        $(e.currentTarget).before(mapHolder);
        this.initializeMapVisibility(type);
    },

    initializeMapVisibility(type) {
        var model = this.model,
            changes = this.changes;
        $('.cartodb-url').addClass('hide');
        $('.map-tiles').addClass('hide');
        if (type == 'image-map') {
            $('.map-image').show();
            $('.map-tiles').addClass('hide');

        } else if (type == 'cartodb') {
            $('.cartodb-url').removeClass('hide');
            $('.map-tiles').addClass('hide');
        } else {
            $('.map-create').show();
            $('.map-tiles').removeClass('hide');

            if (model.overlayType() == 'tilemap') {
                $('.overlay-geojson').addClass('hide');
                $('.overlay-tilemap').removeClass('hide');
            } else if (model.overlayType() == 'geojson') {
                $('.overlay-geojson').removeClass('hide');
                $('.overlay-tilemap').addClass('hide');
            } else {
                $('.overlay-geojson').addClass('hide');
                $('.overlay-tilemap').addClass('hide');
            }
            var map = Mediakron.Maps.Theme(false, 'map-' + this.randomID, type, '500px', 3, true);
            map.on('moveend', function(evt) {
                var center = evt.target.getCenter(),
                    zoom = evt.target.getZoom();
                changes.center = center;
                changes.zoom = zoom;
            });
        }

    },
    changeScope(e) {
        var type = $(e.currentTarget).val(),
            label = Mediakron.Timeline.zoom.Conversions[type];
        if (label) {
            if (label.label) {
                $('.start-date-label').text('Timeline Scope: Start ' + label.label);
                $('.end-date-label').text('Timeline Scope: End ' + label.label);
            }
        }
    },
    toggleSection(e) {
        var target = $(e.currentTarget);
        target.next().slideToggle();
    },
    dragEnter(e) {
        target = $(e.currentTarget);
        e.stopPropagation();
        e.preventDefault();
        target.css('border', '2px solid #0B85A1');
    },
    dragOver(e) {
        e.stopPropagation();
        e.preventDefault();
    },
    dropFile(e) {
        $(this).css('border', '2px dotted #0B85A1');
        e.preventDefault();
        var upload = Mediakron.Edit.fileUpload(e.originalEvent.drop),
            changes = this.changes;
        upload.done(function(response) {
            Mediakron.Status.formChanged = true;
            changes.image = response.file;
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    addImage(e) {
        if (e.target.files[0].type != 'image/jpg' && e.target.files[0].type != 'image/jpeg' && e.target.files[0].type != 'image/png' && e.target.files[0].type != 'image/gif') {
            Mediakron.message({
                text: "That doesn't appear to be an image.  Please upload images (jpg,jpeg,png or gif).",
                type: 'warning',
                'timeout': 0,
                'dismiss': true,
                layout: 'center'
            });
            return false;
        }
        var upload = Mediakron.Edit.fileUpload(e),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            Mediakron.Status.formChanged = true;
            if (!changes.image) changes.image = {};
            if (changes.image.remote) delete changes.image.remote;
            if (changes.image.local) delete changes.image.local;
            changes.image.uri = response.file;
            changes.size = {
                'width': $('.edit-thumbnail img').width(),
                'height': $('.edit-thumbnail img').height()
            };
            changes.zoom = 2;
            $('#remove-image').removeClass('hide');
            $('.field-alt').removeClass('hide');
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    addText(e) {
        if (!this.changes.text) this.changes.text = this.model.get('text');
        if (jQuery.type(this.changes.text) === 'array') this.changes.text = {};
        if (!this.changes.text.type) this.changes.text.type = 'pdf';
        if (this.changes.text.type == 'pdf') {
            if (e.target.files[0].type != 'application/pdf') {
                Mediakron.message({
                    text: "That file doesn't look like a pdf.  Upload a pdf or change the types above",
                    type: 'warning',
                    'timeout': 3000,
                    'dismiss': true,
                    layout: 'center'
                });
                return false;
            }
        } else {
            if (e.target.files[0].type == 'application/pdf') {
                Mediakron.message({
                    text: "It looks like you uploaded a PDF, but you didn't select PDF as the type.",
                    type: 'warning',
                    'timeout': 3000,
                    'dismiss': true,
                    layout: 'center'
                });
                return false;
            }
        }
        var upload = Mediakron.Edit.fileUpload(e),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            Mediakron.Status.formChanged = true;
            if (!changes.text) changes.text = model.get('text');
            if (changes.text.remote) delete changes.text.remote;
            if (changes.text.local) delete changes.text.local;
            if (jQuery.type(changes.text) === 'array') changes.text = {};
            changes.text.mime = response.mime;
            changes.text.url = response.file;
            if (Mediakron.Settings.MimeTypes.images.indexOf(response.mime) > -1) {
                if (!changes.image) changes.image = {};
                changes.image.uri = response.file;
                changes.image.mime = response.mime;
            }
            $('#remove-file').removeClass('hide');
            $('.field-alt').removeClass('hide');
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    addAudio(e) {
        if (!this.changes.audio) this.changes.audio = this.model.get('audio');
        if (jQuery.type(this.changes.audio) === 'array') this.changes.audio = {};
        if (!this.changes.audio.type) this.changes.audio.type = 'mp3';
        if (this.changes.audio.type == 'mp3') {
            if (e.target.files[0].type != 'audio/mpeg' && e.target.files[0].type != 'audio/mp3' && e.target.files[0].type != 'audio/m4a' && e.target.files[0].type != 'audio/x-m4a' && e.target.files[0].type != 'audio/x-mp3') {
                Mediakron.message({
                    text: "That file doesn't look like an mpeg.  Upload a mp3, mp4, or m4a or change the types above",
                    type: 'warning',
                    'timeout': 3000,
                    'dismiss': true,
                    layout: 'center'
                });
                return false;
            }
        }
        var upload = Mediakron.Edit.fileUpload(e),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            Mediakron.Status.formChanged = true;
            if (!changes.audio) changes.audio = model.get('audio');
            if (jQuery.type(changes.audio) === 'array') changes.audio = {};
            var path = Mediakron.Settings.filepath + response.file;
            changes.audio.mime = response.mime;
            changes.audio.url = path;
            $('#remove-file').removeClass('hide');
            $('.field-alt').removeClass('hide');
            $('#audio-url').text(path);
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    addVideo(e) {
        if (!this.changes.video) this.changes.video = this.model.get('video');
        if (jQuery.type(this.changes.video) === 'array') this.changes.video = {};
        if (!this.changes.video.type) this.changes.video.type = 'm4v';
        if (this.changes.video.type == 'm4v') {
            if (e.target.files[0].type != 'video/mpeg' && e.target.files[0].type != 'video/mp4' && e.target.files[0].type != 'video/m4v' && e.target.files[0].type != 'video/x-m4v' && e.target.files[0].type != 'video/x-mp4') {
                Mediakron.message({
                    text: "That file doesn't look like an mpeg.  Upload a mp4, or m4v or change the types above",
                    type: 'warning',
                    'timeout': 3000,
                    'dismiss': true,
                    layout: 'center'
                });
                return false;
            }
        }
        var upload = Mediakron.Edit.fileUpload(e),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            Mediakron.Status.formChanged = true;
            if (!changes.video) changes.video = model.get('video');
            if (jQuery.type(changes.video) === 'array') changes.video = {};
            var path = Mediakron.Settings.filepath + response.file;
            changes.video.mime = response.mime;
            changes.video.url = path;
            $('#remove-file').removeClass('hide');
            $('.field-alt').removeClass('hide');
            $('#audio-url').text(path);
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    cleanPaste(e) {
        console.log('cleanpaste');
        var target = $(e.currentTarget);
        target.attr('disabled', true);
        setTimeout(function() {
            html = Mediakron.cleanHTML(target.html());
            target.html(html);
            target.attr('disabled', false);
        }, 20);
    },
    blurWysiwyg(e) {
        var target = $(e.currentTarget),
            text = target.text(),
            placeholder = target.attr('data-placeholder');
        if (text === '') {
            target.html('');
        }
    },
    focusWysiwyg(e) {
        var target = $(e.currentTarget),
            text = target.text(),
            placeholder = target.attr('data-placeholder');
        this.focusElement = target;
        if (text == placeholder || text === '') {
            target.html('<p></p>');
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart(target.children()[0], 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    },
    range: false,
    selection: false,
    restoreRange() {
        this.focusElement.focus();
        if (this.range) {
            if (window.getSelection()) {
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(this.range);
                this.range = false;
            } else if (document.selection && this.range.select) {
                this.range.select();
                this.range = false;
            }
        }
    },
    getSelectionStartNode() {},
    bindWysiwygListner(e) {
        var target = $(e.currentTarget),
            form = this;
        $('body').one('mouseup', function(event) {
            form.openWysiwyg(e);
        });
    },
    openWysiwyg(e) {
        // this might work!
        if (e.keyCode == '13') {
            if (!e.shiftKey) {
                document.execCommand('formatBlock', false, 'p');
            }
        }
        var selection = window.getSelection(),
            oRange = selection.getRangeAt(0),
            ancestor = $(oRange.commonAncestorContainer),
            parentEditor = ancestor.closest("div[contenteditable='true']"),
            text = selection.toString();
        if (text.length > 0) {
            this.range = oRange.cloneRange();
            this.selection = selection;
            Mediakron.Wysiwyg.showBubble(e.currentTarget);
            var $node = $(this.getSelectionStartNode());
            if (ancestor.closest('blockquote').length > 0) {
                $('.wysiwyg-indent').addClass('hide');
                $('.wysiwyg-outdent').removeClass('hide');
            } else {
                $('.wysiwyg-indent').removeClass('hide');
                $('.wysiwyg-outdent').addClass('hide');
            }
            if (findinselection('a', parentEditor[0])) {
                $('.wysiwyg-link').addClass('hide');
                $('.wysiwyg-unlink').removeClass('hide');
            } else {
                $('.wysiwyg-link').removeClass('hide');
                $('.wysiwyg-unlink').addClass('hide');
            }
        } else {
            $('.wysiwyg').hide();
        }
    },
    changeModel(e) {
        Mediakron.Status.formChanged = true;
        e.preventDefault();
        var change = false,
            target = $(e.currentTarget);
        if (target.hasClass('enable-wysiwyg')) {
            target.linkify({
                target: "_blank"
            });
        }
        var attribute = target.attr('model-attr'),
            editable = target.attr('contenteditable'),
            type = target.attr('edit-type'),
            id = target.attr('id'),
            value = target.val(),
            html = target.html().trim(),
            text = target.text().trim(),
            metadata = this.model.get('metadata');
        if (!metadata) metadata = {};
        if ($.isArray(metadata)) metadata = {};
        if (!this.changes.metadata) {
            this.changes.metadata = metadata;
        }
        if (!editable) {
            change = value;
        } else if (type == 'html') {
            change = html;
        } else {
            change = text;
        }
        // sometimes a form needs to change depending on the template chosen. bind here
        if (attribute == 'template') {
            Mediakron.Edit.TemplateChange(change, this.model);
            if (change == 'timemap') this.bindTimeMap();
            if (change != 'timemap') {
                $('.timemap-fields').addClass('hide');
            }
        }
        this.changes = Mediakron.Edit.Changes(this.changes, attribute, change, id, this.model);
    },
    bindTimeMap() {
        $('.timemap-fields').removeClass('hide').appendTo($('.layout-option.timemap'));
        var start = false,
            end = false,
            options = this.model.get('options');
        if (options.start) start = options.start;
        if (options.end) end = options.end;
        this.startWidget = new Mediakron.Timeline.selectWidget({
            parent: this,
            $parent: $('.start-date-fields'),
            date: start,
            map: true
        });
        this.startWidget.render();
        this.endWidget = new Mediakron.Timeline.selectWidget({
            parent: this,
            $parent: $('.end-date-fields'),
            date: end,
            map: true
        });
        this.endWidget.render();

    },
    preventLinks(e) {
        e.preventDefault();
        return false;
    },
    openMetadata(e) {
        e.preventDefault();
        $('#metadata-form').addClass('is-visible');
        return false;
    },
    closeMetadata(e) {
        e.preventDefault();
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $('#metadata-form').addClass('closing').one(animationEnd, function() {
            $('#metadata-form').removeClass('closing');
            $('#metadata-form').removeClass('is-visible');
        });
        return false;
    },
    tab(e) {
        e.preventDefault();
        var target = $(e.currentTarget),
            open = $('.tab-content.is-open'),
            closed = $('.tab-content:not(.is-open)');
        if (target.hasClass('is-active')) {} else {
            open.removeClass('is-open').hide();
            closed.addClass('is-open').show();
            $('.tab-link.is-active').removeClass('is-active');
            target.addClass('is-active');
        }
        return false;
    },
    accordion(e) {
        e.preventDefault();
        var target = $(e.currentTarget);
        if (target.hasClass('is-active')) {
            target.parent().removeClass('is-open');
            target.removeClass('is-active');
        } else {
            $('.accordion-panel.is-open').removeClass('is-open');
            target.parent().addClass('is-open');
            $('.accordion-link.is-active').removeClass('is-active');
            target.addClass('is-active');
        }
        return false;
    },
    selectIcon(e) {
        e.preventDefault();
        $('.icons').addClass('open');
    },
    closeIcon(e) {
        e.preventDefault();
        $('.icons').removeClass('open');
    },

}

// @REVIEW then, delete. Original view below

/**
 * View handler for the Add Content pages
 */
Mediakron.Admin.AddContentPage = Mediakron.Extensions.View.extend({
    template: JST['settings.content.form'], // Template
    type: false, // Type
    model: false,
    edit: false,
    modeltype: false,
    label: false,
    canSave: false,
    uploadInProgress: false,
    className: 'content-form',
    callback: false,
    validation: false,
    shifted: false,
    randomID: Math.floor(Math.random() * 1000),
    changes: {},
    focusElement: false,
    tags: {},
    startWidget: false,
    endWidget: false,

    // Initialize the view
    initialize(request) {
        this.type = request.type;
        this.template = JST['settings.content.form.' + this.type];
        this.edit = request.edit;
        this.modeltype = 'item';
        if (request.callback) {
            this.callback = request.callback;
        }
        if (request.validation) {
            this.validation = request.validation;
        }
        this.tags = {};

        // If we're editing this
        if (this.edit) {
            this.model = request.item;
            var topics = this.model.getRelationship('topics'),
                top, contentForm = this;

            // get all of the tags for this item
            _.each(topics, function(topic) {
                top = Mediakron.getItemFromURI(topic.uri);
                if (top) {
                    if (top.get('type') == 'tag') {
                        contentForm.tags[topic.uri] = top;
                    }
                }
            });
            // Dispath an edit event so other functions can subscribe
            Mediakron.App.Events.trigger('content:edit:start', {
                model: this.model
            });
            this.label = '<span class="mk-icon mk-edit"></span> Edit ' + this.type.capitalize();
            // new item
        } else {
            // Initialize an item
            this.model = new Mediakron.Models.Item();
            // and set the type
            this.model.set('type', this.type);

            // if its a timeline, set some sane defaults
            if (this.type == 'timeline') {
                var timeline = this.model.get('timeline');
                timeline.type = 'traditional';
                this.model.set('timeline', timeline);
            }
            // dispatch an event
            Mediakron.App.Events.trigger('content:create:start');
            this.label = '<span class="mk-icon mk-add"></span> Add ' + this.type.capitalize();
        }
    },
    // Render the view
    render() {
        // must clear changes cache
        var options = this.model.get('options');
        if (!options) options = {};
        if ($.isArray(options)) options = {};
        this.changes = {
            'options': options
        };

        // convert the model to json
        var content = this.model.toJSON();
        content.metadataForm = this.model.metadataForm();
        content.wysiwyg = this.model.wysiwygForm();
        content.model = this.model;
        content.edit = this.edit;
        content.label = this.label;
        content.type = this.model.getNormalType();
        // go get the savebar from its widget
        content.savebar = JST['settings.savebar'](content);
        // get the sidebar options
        content.sidebarOpts = JST['settings.sidebar.options'](content);
        // get the date widget for setting a data for this item
        content.dateWidget = JST['settings.content.form.date.widget']({
            start: this.model.start(),
            end: this.model.end(),
            type: 'traditional'
        });
        // We created a random id earlier.  helpful for certian types (maps especially)
        content.randomID = this.randomID;
        // A list of tags on the item if possible
        content.tags = this.tags;
        // Not sure why we are doing this.  seems like a weird place for this.  consider depricating
        Mediakron.items.sortItems('title', 'asc');
        // Render into the element
        this.$el.html(this.template(content));
        // Check the polling.  This will mark this doc with a soft checkout to notify
        // other users that it is currently being edited
        this.checkPoll();
        return this;
    },
    // hide the loading interface.
    hideLoad() {
        $('#edit-loading').hide();
    },
    // After Render
    afterRender() {
        // Initialize variables
        var model = this.model,
            changes = this.changes,
            children = this.model.getRelationship('children'),
            view = this,
            map;
        // Initialize the chosen variables
        $('select#map-type').chosen();
        $('select#choose-tag').chosen().change(function(evt, params) {
            view.addTag(evt, params);
        });



        // If there is a model (its unclear how its possible that this isn't set)
        if (model) {
            // If its a map, render the map view
            if (model.getNormalType() == 'map') {
                // Get the map type
                var mapType = model.get('type');
                $('.map-image').hide();
                $('.map-tiles').show();
                $('.map-create').empty().hide();

                // If its a map image, just show the image upload (with thumbnail)
                if (mapType == 'map') {} else if (mapType == 'image-map') {
                    $('.map-image').show();
                    // If its a carto map, hide the map tiles and show the carto url field
                } else if (mapType == 'cartodb') {
                    $('.cartodb-url').removeClass('hide');
                    $('.map-tiles').hide();
                    // Show the map create interface via leaflet
                } else {
                    $('.map-create').show();
                    // render the map
                    map = Mediakron.Maps.Theme(model, 'map-' + this.randomID, mapType, '500px', model.get('zoom'), true);
                    // track map changes and attach them to the map data
                    map.on('moveend', function(evt) {
                        var center = evt.target.getCenter(),
                            zoom = evt.target.getZoom();
                        // Save center and zoom
                        changes.center = center;
                        changes.zoom = zoom;
                    });
                }
                // if its a video
            } else if (model.getNormalType() == 'video') {
                var video = model.get('video');
                // Show the video field if the url is a meaningful field
                if (video.type == 'youtube' || video.type == 'vimeo' || video.type == 'bc' || video.type == 'panopto') {
                    $('#video-start-field').removeClass('hide');
                    $('#video-end-field').removeClass('hide');
                }
            }
            // if its a timemap, we need to attach timeline data to the map field
            if (model.get('template') == 'timemap') this.bindTimeMap();
        }
        this.$el.after('<div id="admin-link-content" />');
        view.checkPoll();
        if (this.edit) {
            this.$el.append('<div id="edit-loading" >Loading</div>');
            // listen for someone else editing this item
            Mediakron.App.Events.on('poll', function(object) {
                // the poll just ran.  Lets check to see if anyone is editing this
                view.checkPoll();
            });
        }
        $('select#audio-type').chosen();
        $('select#text-type').chosen();
        if (map) {
            map.invalidateSize();
        }
        if (model.get('type') == 'layer' || model.get('type') == 'folder') {
            $('#layer-color').spectrum({
                showPaletteOnly: true,
                hideAfterPaletteSelect: true,
                togglePaletteOnly: true,
                togglePaletteMoreText: 'more',
                togglePaletteLessText: 'less',
                clickoutFiresChange: true,
                preferredFormat: "hex",
                showInput: true,
                // Default color pallets
                palette: [
                    ["#030303", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                    ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                    ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                    ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                    ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                    ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                    ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                    ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
                ],
                change(color) {
                    Mediakron.Status.formChanged = true;
                    changes.options.color = color.toHexString();
                }
            });
            require(["src/filters"], function(initialize) {
                initialize(function(icon) {
                    Mediakron.Status.formChanged = true;
                    changes.options.icon = icon;
                    var curicon = $('.current-icon');
                    curicon.removeClass();
                    curicon.addClass('current-icon');
                    curicon.addClass(icon);
                });
            });
        }
        if (model.getNormalType() == 'map' && this.edit) {
            //this.initializeMapVisibility(this.model.get('type'));
        }

        /* Load accessible accordion plugin */
        //$('.js-accordion').accordion();

        /* Add a class to the last panel to provide enough padding */
        $('.js-accordion__panel').last().addClass('last');


        /* Load accessible expand/collapse plugin
        https://github.com/nico3333fr/jquery-accessible-hide-show-aria
        */

        accessibleExpand(this.$el);

        // Set the various openings and closings according to the model parameters
        $('.author-date .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
        $('.author-date .js-to_expand').attr('data-hidden', 'false');

        // If it has a description
        if (model.get('description')) {
            $('#description-field .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('#description-field .js-to_expand').attr('data-hidden', 'false');
        }

        // If it has a transscript
        if (model.get('transcript')) {
            $('#transript-field .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('#transript-field .js-to_expand').attr('data-hidden', 'false');
        }

        // If it has a source
        if (model.hasSource()) {
            $('#source-fields .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('#source-fields .js-to_expand').attr('data-hidden', 'false');
        }

        // If it has a date
        if (model.hasDate()) {
            $('#date-fields .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('#date-fields .js-to_expand').attr('data-hidden', 'false');
        }

        // If it has metadata
        if (model.hasMetadata()) {
            $('#metadata-fields .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('#metadata-fields .js-to_expand').attr('data-hidden', 'false');
        }

        // If we have tags
        if (model.hasTags()) {
            $('.field-group-tags .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('.field-group-tags .js-to_expand').attr('data-hidden', 'false');
        }

        if (model.get('image')) {
            $('.field-group-thumbnail .js-expandmore button').addClass('is-opened').attr('aria-expanded', 'true');
            $('.field-group-thumbnail .js-to_expand').attr('data-hidden', 'false');
        }

        /* If there's a folder color, expand the fieldset */
        if (model.getOption('color')) {
            $('#folder-styles .js-expandmore button').addClass('is-opened has-data').attr('aria-expanded', 'true');
            $('#folder-styles .js-to_expand').attr('data-hidden', 'false');
        }

        /* If there's featured info , expand the fieldset */
        if (model.getOption('defaultSidebar')) {
            var featured = model.getOption('defaultSidebar');
            if (featured != 'none') {
                $('#featured-information .js-expandmore button').addClass('is-opened has-data').attr('aria-expanded', 'true');
                $('#featured-information .js-to_expand').attr('data-hidden', 'false');
            }
        }

        /* If there are map sidebar options checked , expand the fieldset */
        if (model.getOption('hideSidebar') || model.getOption('layersHidden') || model.getOption('filtersHidden')) {
            $('.filters-layers .js-expandmore button').addClass('is-opened has-data').attr('aria-expanded', 'true');
            $('.filters-layers .js-to_expand').attr('data-hidden', 'false');
        }
        return this;
    },
    /**
     * Poll the server, both to let the server know we are editing this
     * and to detect others editing.  This also does some stat work
     */
    checkPoll() {
        if (this.edit && this.model) {
            var uri = this.model.get('uri'),
                check = false;
            if (Mediakron.Status.currentEditing[uri]) {
                check = Mediakron.Status.currentEditing[uri];
                if (check == 2) {
                    $('#editors').removeClass('hide').text("Someone else is editing this page. If you save now, you may over-write the other person's changes.");
                } else if (check > 2) {
                    $('#editors').removeClass('hide').text("There are a couple editors working on this page right now. If you save now, you may over-write changes made elsewhere.");
                } else {
                    $('#editors').text("").addClass('hide');
                }
            }
        }
    },
    /**
     * Bound events
     */
    events: {
        // Depricate this?
        'submit form': 'cancelLinkHandle',
        'click a.help-link': Mediakron.linkHandle,
        'click .metadata-toggle': "openMetadata",
        'click #metadata .close': "closeMetadata",
        // wysiwyg
        'mousedown .wysiwyg-button': Mediakron.Wysiwyg.apply,
        'mousedown .enable-wysiwyg': "bindWysiwygListner",
        'mouseup .enable-wysiwyg': "openWysiwyg",
        'keyup .enable-wysiwyg': "openWysiwyg",
        'paste div.model-field': "cleanPaste",
        'paste .enable-wysiwyg': "cleanPaste",
        'blur .enable-wysiwyg': "blurWysiwyg",
        'focus .enable-wysiwyg': "focusWysiwyg",
        'click .all-tags .choose-tag': "showTags",
        // validate uri
        'keyup #uri': "checkURI",
        // prevent accidential link clicking in wysiwyg
        'click .enable-wysiwyg a': "preventLinks",
        //
        'blur .model-field': "changeModel",
        'change .template-field': "changeModel",
        'change .model-select': "changeModel",
        'change .sidebar-field': "setSidebarDefault",
        'click .options': "setOptions",
        'click #upload-image': "triggerImage",
        'click #upload-file': "triggerFile",
        'click #upload-audio': "triggerAudio",
        'click #upload-video': "triggerVideo",
        'click #remove-image': "removeFile",
        'click #remove-file': "removeFile",
        'change #image-file': "addImage",
        'change #text-file': "addText",
        'change #audio-file': "addAudio",
        'change #video-file': "addVideo",
        'change #text-type': "setTextType",
        'change #video-type': "setVideoType",
        'change #audio-type': "setAudioType",
        'click .section-title': "toggleSection",
        'dragenter #file-upload': "dragEnter",
        'dragover #file-upload': "dragOver",
        'drop #file-upload': "dropFile",
        'change #map-type': "changeMapType",
        'change #scope': "changeScope",
        'click #done-editing': 'save',
        'click #unpublish': 'unpublish',
        'click #publish': 'publish',
        'click #delete-item': 'deleteItem',
        'click #cancel-editing': 'cancel',
        'click #close-settings-context': 'cancel',
        'click .close-settings-top': 'cancel',
        'click .close-button': 'cancel',
        'click .overlay-bg': 'cancel',
        'click .add-field-tag': 'checkTagField',
        'click .remove-tag': 'removeTag',
        'click .add-tag': 'addTag',
        'click .tab-link': 'tab',
        'click .accordion-link': 'accordion',
        'click .wlink-internal': 'showWysiwgyInternal',
        'change .filter-field': "setFilterOptions",
        'click .select-icon': "selectIcon",
        'click .close-icon, .icon-item': 'closeIcon',
        'change #overlay-type': 'changeOverlay',
        'click #upload-geojson': 'triggerGeojon',
        'change #image-geojson': 'uploadGeojson',
        'click #remove-geojson': 'removeGeojson'
    },
    /**
     * Fire the geojson upload button
     */
    triggerGeojon() {
        $('#image-geojson').click();
    },

    /**
     * Fire the geojson upload button
     */
    removeGeojson() {
        this.changes.overlay = {
            type: 'geojson'
        };
        $('.overlay-file').addClass('hide');
        $('#remove-geojson').addClass('hide');
        $('.overlay-file').text('');
        $('#upload-geojson').removeClass('hide');
    },

    /**
     * Upload a geojson file
     */
    uploadGeojson(e) {
        var deferred = $.Deferred();
        var view = this;
        var reader = new FileReader();
        var files = e.target.files; // FileList objectId
        // files is a FileList of File objects. List some properties.
        file = files[0];
        if (file.type != 'application/json' && file.type != 'application/vnd.geo+json') {
            Mediakron.message.error('File is not GeoJSON');
            return false;
        }
        /**
         * Listen for the onload event
         */
        reader.onload = function(e) {
            Mediakron.messages.progressMessage('Uploading File', 0);
            Mediakron.Status.uploadInProgress = true;
            $.ajax({
                url: Mediakron.Data.upload, // Upload to the
                data: {
                    uploadfilename: encodeURIComponent(file.name),
                    file: e.target.result
                },
                type: "post",
                cache: false,
                xhr() {
                    var xhr = new window.XMLHttpRequest();
                    //Upload progress
                    xhr.upload.addEventListener("progress", function(evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = Math.floor((evt.loaded / evt.total) * 100);
                            Mediakron.messages.progressUpdate(percentComplete);
                            //Do something with upload progress

                        }
                    }, false);
                    //Download progress
                    xhr.addEventListener("progress", function(evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                        }
                    }, false);
                    return xhr;
                },
                success(event, message, response) {
                    Mediakron.Status.uploadInProgress = false;
                    Mediakron.messages.progressClose();
                    var data = JSON.parse(event);
                    view.changes.overlay = {
                        type: 'geojson',
                        file: data.file,
                        name: data.name
                    };
                    $('.overlay-file').removeClass('hide');
                    $('#remove-geojson').removeClass('hide');
                    $('.overlay-file').text(data.name);
                    $('#upload-geojson').addClass('hide');
                    deferred.resolve(data);
                },
                error(request) {
                    Mediakron.Status.uploadInProgress = false;
                    Mediakron.message({
                        'type': 'danger',
                        text: 'Your upload has failed',
                        timeout: 3000,
                        layout: 'center',
                        confirm: false,
                        dismiss: true
                    });
                    deferred.failed(request);
                }
            });
        };
        reader.readAsDataURL(file);
        return deferred.promise();
    },
    /**
     * Bind to the overlay select and show the overlay
     * type
     */
    changeOverlay(e) {
        var val = $(e.currentTarget).val();
        if (val) {
            $('.overlay-setting').addClass('hide');
            $('.overlay-' + val).removeClass('hide');
        }
    },
    /**
     * Show the internal wysiwyg bind
     */
    showWysiwgyInternal() {
        var data, callback, navView = this;
        $('#linkbrowser-contents').scrollTop(0);
        data = {
            'context': false,
            'el': '#linkbrowser-contents',
            'callback'(menu) {
                navView.restoreRange();
                var selection = window.getSelection(),
                    oRange = selection.getRangeAt(0),
                    ancestor = $(oRange.commonAncestorContainer),
                    parentEditor = ancestor.closest("div[contenteditable='true']");
                document.execCommand('createLink', false, basepath + menu.get('uri'));
                Mediakron.controller.closeLinkBrowser();
                $('.normal-wysiwyg').removeClass('hide');
                $('.wlink-tool').addClass('hide');
                if (findinselection('a', parentEditor[0])) {
                    $('.wysiwyg-link').addClass('hide');
                    $('.wysiwyg-unlink').removeClass('hide');
                } else {
                    $('.wysiwyg-link').removeClass('hide');
                    $('.wysiwyg-unlink').addClass('hide');
                }
            },
            'cancelCallback'() {
                navView.restoreRange();
                Mediakron.controller.closeLinkBrowser();
                $('.normal-wysiwyg').removeClass('hide');
                $('.wlink-tool').addClass('hide');
            }
        };
        Mediakron.controller.openLinkBrowser();
        view = new Mediakron.ContentBrowser.LinkSelector(data);
        html = view.render();
        view.afterRender();
    },
    /**
     * Handle the cancel event
     */
    cancelLinkHandle(e) {
        e.preventDefault();
        return false;
    },
    /**
     * Show the tags
     */
    showTags() {
        $('.all-tags ul').slideToggle('fast');
    },
    /**
     * Get the date from the form and load it into the change object
     * with some validation
     */
    updateDate() {
        var date = this.model.get('date');
        if (!date) {
            date = {
                start: false,
                end: false
            };
        }
        date.start = this.getDate($('.datewidget-start', this.$el));
        date.end = this.getDate($('.datewidget-end', this.$el));
        if (this.model.getNormalType() == 'timeline') {
            if (!date.start || !date.end) {
                Mediakron.message.error("You must provide a start and end date for a timeline.");
                return false;
            }
        }
        if (date.start) {
            if (date.end) {
                if (Mediakron.serializeDate(date.start) > Mediakron.serializeDate(date.end)) {
                    Mediakron.message.error("The start date must be beore the end date.");
                    return false;
                }
            }
        }
        this.changes.date = date;
        return true;
    },

    /**
     * Read the date object within a scope
     */
    getDate(scope) {
        var date = {};
        if (!scope) return false;
        if (scope.length === 0) return false;
        if ($(".year input", scope).val().length > 0) date.year = $(".year input", scope).val();
        if ($("[date='month']", scope).val().length > 0) date.month = $("[date='month']", scope).val();
        if ($(".day input", scope).val().length > 0) date.day = $(".day input", scope).val();
        if ($(".hour input", scope).val().length > 0) date.hour = $(".hour input", scope).val();
        if ($(".minute input", scope).val().length > 0) date.minute = $(".minute input", scope).val();
        if ($(".second input", scope).val().length > 0) date.second = $(".second input", scope).val();
        if (_.size(date) > 0) return date;
        return false;
    },
    /**
     * Issue the save
     */
    save(e, a) {
        e.preventDefault();
        Mediakron.Status.formChanged = false;
        $('#done-editing').html('<span class="mk-icon mk-save"> </span> Saving...');
        if (Mediakron.Status.uploadInProgress) {
            Mediakron.message({
                'type': 'warning',
                'dismiss': true,
                'layout': 'center',
                'confirm': false,
                'text': 'There is an upload in progress. One moment please...'
            });
            return false;
        }

        var valid = this.updateDate();
        if (!valid) {
            return false;
        }
        var model = this.model,
            callback, changes = this.changes,
            contentForm = this;
        if (this.callback) {
            callback = this.callback;
        }
        if (this.validate) {
            if (!this.validate(model, this.changes)) {
                return false;
            }
        }
        if (!Mediakron.Edit.ValidateContent(model, this.changes, e)) {
            return false;
        }
        if (model.getNormalType() == 'map') {

            this.changes.map = {
                url: $('#cartodb-url').val()
            };

            var overlayType = $('#overlay-type').val();
            if (overlayType == 'geojson') {

            } else if (overlayType == 'tilemap') {
                this.changes.overlay = {
                    type: overlayType,
                    title: $('#overlay-title').val(),
                    url: $('#overlay-url').val(),
                };
            }
        }

        model.set(this.changes);
        if (model.get('template') == 'timemap') {
            var start = this.startWidget.validate('start'),
                end = this.endWidget.validate('end');
            if (!start || !end) {
                Mediakron.message({
                    text: "You have provided an invalid value for one of the date entries.  Please check the highlighted box and try again.",
                    type: 'warning',
                    'timeout': 3000,
                    'dismiss': true,
                    layout: 'center'
                });
                return false;
            }
            this.changes.options.start = start;
            this.changes.options.end = end;
        }
        model.save(this.changes, {
            success() {
                model.addToCollection();
                Mediakron.createUrlMap();
                _.each(contentForm.tags, function(tag) {
                    tag.add(model, {});
                });
                if (contentForm.edit) {
                    Mediakron.App.Events.trigger('content:update:save', {
                        model: model
                    });
                } else {
                    Mediakron.App.Events.trigger('content:create:save', {
                        model: model
                    });
                }
                if (callback) {
                    callback(model);
                } else {
                    Mediakron.message({
                        'timeout': 4000,
                        'type': 'success',
                        'text': '<span class="mk-icon mk-save"></span> Changes saved',
                        'layout': 'bottom',
                        'confirm': false,
                        'dismiss': true
                    });
                    if (contentForm.edit) {
                        Mediakron.controller.gotoLast();
                        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
                    } else {
                        Mediakron.router.navigate('/' + model.get('uri'), {
                            trigger: true
                        });
                        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
                    }
                }
            },
            error() {}
        });
        return false;
    },
    removeTag(e) {
        var field = $(e.currentTarget),
            uri = field.parent().attr('uri'),
            tag = Mediakron.getItemFromURI(uri);
        field.parent().remove();
        if (this.edit && this.tags[uri]) {
            this.tags[uri].remove(this.model);
        }
        delete this.tags[uri];
    },
    addTag(e, params) {
        var uri;
        e.preventDefault();
        if (params.selected) {
            uri = params.selected;
            tag = Mediakron.getItemFromURI(uri);
            this.tags[uri] = tag;
            $('#tag-list').append('<li uri="' + uri + '">' + tag.get('title') + '<button class="remove-tag btn submit btn-no-style"><span class="mk-icon mk-remove"> </span> <span class="sr-only">Remove Tag</span></button></li>');
            return true;
        } else if (params.deselected) {
            uri = params.deselected;
            tag = Mediakron.getItemFromURI(uri);
            if (this.edit && this.tags[uri]) {
                this.tags[uri].remove(this.model);
            }
            delete this.tags[uri];
            $('li[uri=' + uri + ']', $('#tag-list')).remove();
            return true;
        }
    },
    checkTagField(e) {
        e.preventDefault();
        var field = $('#tag-field'),
            curValue = field.val(),
            tags = curValue.split(','),
            count = tags.length,
            i = 0,
            list = $('#tag-list'),
            model, divs = {},
            models = {},
            view = this;
        _.each(tags, function(tag) {
            i++;
            var id = i;
            divs[id] = $('<li></li>').text('Adding Tag: ' + tag);
            list.append(divs[i]);
            $.get(Mediakron.Data.addTags + '/' + tag, {}, function(data) {
                model = new Mediakron.Models.Item(JSON.parse(data));
                divs[id].html(model.get('title') + '<button type="submit" class="remove-tag btn submit btn-no-style"><span class="mk-icon mk-remove"> </span> <span class="sr-only">Remove Tag</span></button>').attr('uri', model.get('uri'));
                $('.remove-tag', divs[id]).click(function() {
                    divs[id].remove();
                    delete view.tags[model.get('uri')];
                });
                model.addToCollection();
                Mediakron.createUrlMap();
                view.tags[model.get('uri')] = model;
                if (id == count) {
                    field.text('');
                }
            });
        });
        return false;
    },
    triggerImage(e) {
        e.preventDefault();
        $('#image-file').click();
        return false;
    },
    triggerFile(e) {
        e.preventDefault();
        $('#text-file').click();
        return false;
    },
    triggerAudio(e) {
        e.preventDefault();
        $('#audio-file').click();
        return false;
    },
    triggerVideo(e) {
        e.preventDefault();
        $('#video-file').click();
        return false;
    },
    removeFile(e) {
        e.preventDefault();
        $('#remove-image').addClass('hide');
        $('#remove-file').addClass('hide');
        $('.field-alt').addClass('hide');
        $('.edit-thumbnail').empty();
        $('#upload-image').html('<span class="mk-icon mk-upload"> </span> Upload Image'); /* restore upload button text */
        this.changes.image = {};
        this.changes.audio = {};
        this.changes.video = {};
        this.changes.text = this.model.get('text');
        delete this.changes.text.url;
        delete this.changes.text.mime;
        this.changes.size = {};
        return false;
    },
    unpublish(e) {
        e.preventDefault();
        this.changes.published = '0';
        this.save(e);
        return false;
    },
    publish(e) {
        e.preventDefault();
        this.changes.published = '1';
        this.save(e);
        return false;
    },
    deleteItem(e) {
        e.preventDefault();
        Mediakron.router.SettingsContentConfirm('delete', this.model.get('uri'));
        return false;
    },
    cancel(e) {
        e.preventDefault();
        if (this.edit) {
            var model = this.model;
        }
        if (Mediakron.Status.formChanged) {
            if (this.edit) {
                var uri = this.model.get('uri');
                text = "You have unsaved changes on this form.  Are you sure you want to cancel?";
                accept = function(request) {
                    Mediakron.Status.formChanged = false;
                    Mediakron.App.Events.trigger('content:edit:cancel', {
                        model: this.model
                    });
                    Mediakron.controller.gotoLast();
                };
                reject = function(request) {};
                Mediakron.message({
                    text: text,
                    type: 'warning',
                    timeout: 0,
                    layout: 'center',
                    confirm: true,
                    callback() {
                        accept();
                    },
                    cancel() {
                        reject();
                    }
                });
            } else {
                text = "You have unsaved changes on this form.  Are you sure you want to cancel?";
                accept = function(request) {
                    Mediakron.Status.formChanged = false;
                    Mediakron.App.Events.trigger('content:create:cancel');
                    Mediakron.controller.gotoLast();
                };
                reject = function(request) {};
                Mediakron.message({
                    text: text,
                    type: 'warning',
                    timeout: 0,
                    layout: 'center',
                    confirm: true,
                    callback() {
                        accept();
                    },
                    cancel() {
                        reject();
                    }
                });
            }
        } else {
            if (this.edit) {
                Mediakron.App.Events.trigger('content:edit:cancel', {
                    model: this.model
                });
                Mediakron.controller.gotoLast();
                Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
            } else {
                Mediakron.App.Events.trigger('content:create:cancel');
                Mediakron.router.back();
                Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
            }
        }
        return false;
    },
    close(e) {
        e.preventDefault();
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
        return false;
    },
    setSidebarDefault(e) {
        var defaultVal = $(e.currentTarget).val();
        if (!this.changes.options) {
            this.changes.options = this.model.get('options');
        }
        if (this.changes.options.length < 1) this.changes.options = {};
        this.changes.options.defaultSidebar = defaultVal;
        Mediakron.Status.formChanged = true;
    },
    setFilterOptions(e) {
        var defaultVal = $(e.currentTarget).val(),
            param = $(e.currentTarget).attr('option-attr'),
            checked = $(e.currentTarget).prop('checked');
        if (!this.changes.options) {
            this.changes.options = this.model.get('options');
        }
        if (this.changes.options.length < 1) this.changes.options = {};
        if (!checked) {
            this.changes.options[param] = false;
        } else {
            this.changes.options[param] = defaultVal;
        }
        Mediakron.Status.formChanged = true;
    },
    setOptions() {
        var option, checked, view = this;
        if (!this.changes.options) {
            this.changes.options = this.model.get('options');
        }
        if ($.isArray(this.changes.options)) {
            this.changes.options = {};
        }
        $('.options').each(function(item, div) {
            option = $(div).val();
            checked = $(div).prop('checked');
            view.changes.options[option] = checked;
        });
        Mediakron.Status.formChanged = true;
    },
    setTextType(e) {
        var type = $(e.currentTarget).val();
        if (type == 'image' || type == 'pdf' || type == 'word' || type == 'ppt') {
            $('.body-field').addClass('hide');
            $('.transcript-field').removeClass('hide');
        } else if (type == 'html' || type == 'text' || type == 'tei') {
            $('.body-field').removeClass('hide');
            $('.transcript-field').addClass('hide');
        } else {
            $('.body-field').addClass('hide');
            $('.transcript-field').addClass('hide');
        }
        if (!this.changes.text) {
            this.changes.text = this.model.get('text');
        }
        if ($.isArray(this.changes.text)) {
            this.changes.text = {};
        }
        Mediakron.Status.formChanged = true;
        this.changes.text.type = type;
    },
    setVideoType(e) {
        var type = $(e.currentTarget).val();
        switch (type) {
            case 'mp4':
                $('#video-upload').removeClass('hide');
                $('.video-message-unsupported').addClass('unsupported-video');
                $('#video-url-field').addClass('hide');
                $('#video-timecodes').addClass('hide');
                break;
            case 'youtube':
            case 'vimeo':
            case 'panopto':
            case 'bc':
                $('#video-upload').addClass('hide');
                $('.video-message-unsupported').removeClass('unsupported-video');
                $('.video-message-select').addClass('hide');
                $('#video-url-field').removeClass('hide');
                $('#video-timecodes').removeClass('hide');
                break;
            default:
                $('#video-upload').addClass('hide');
                $('#video-url-field').removeClass('hide');
                $('#video-timecodes').addClass('hide');
                $('.video-message-select').addClass('hide');
                $('.video-message-unsupported').addClass('unsupported-video');
                break;
        }
        //        $('#video-url').prop('disabled', false);
        //        $('#video-start').prop('disabled', false);
        //        $('#video-end').prop('disabled', false);
        Mediakron.Status.formChanged = true;
        if (!this.changes.video) {
            this.changes.video = this.model.get('video');
        }
        if ($.isArray(this.changes.video)) {
            this.changes.text = {};
        }
        this.changes.video.type = type;
    },
    setAudioFieldVisibility(type) {
        if (type == 'mp3') {
            $('#audio-upload').removeClass('hide');
            $('#audio-url-field').addClass('hide');
        } else {
            $('#audio-upload').addClass('hide');
            $('#audio-url-field').removeClass('hide');
        }
    },
    setAudioType(e) {
        var type = $(e.currentTarget).val();
        this.setAudioFieldVisibility(type);
        Mediakron.Status.formChanged = true;
        if (!this.changes.audio) {
            this.changes.audio = this.model.get('audio');
        }
        if ($.isArray(this.changes.audio)) {
            this.changes.audio = {};
        }
        this.changes.audio.type = type;
    },
    changeMapType(e) {
        var type = $(e.currentTarget).val(),
            model = this.model,
            changes = this.changes;
        $('.map-image').hide();
        $('.map-create').remove();
        $('.map-tiles').show();
        changes.type = type;
        Mediakron.Status.formChanged = true;
        var mapHolder = $('<div id="map-' + this.randomID + '" class="field map-create map" style="display: none;"></div>');
        $(e.currentTarget).before(mapHolder);
        this.initializeMapVisibility(type);
    },

    initializeMapVisibility(type) {
        var model = this.model,
            changes = this.changes;
        $('.cartodb-url').addClass('hide');
        $('.map-tiles').addClass('hide');
        if (type == 'image-map') {
            $('.map-image').show();
            $('.map-tiles').addClass('hide');

        } else if (type == 'cartodb') {
            $('.cartodb-url').removeClass('hide');
            $('.map-tiles').addClass('hide');
        } else {
            $('.map-create').show();
            $('.map-tiles').removeClass('hide');

            if (model.overlayType() == 'tilemap') {
                $('.overlay-geojson').addClass('hide');
                $('.overlay-tilemap').removeClass('hide');
            } else if (model.overlayType() == 'geojson') {
                $('.overlay-geojson').removeClass('hide');
                $('.overlay-tilemap').addClass('hide');
            } else {
                $('.overlay-geojson').addClass('hide');
                $('.overlay-tilemap').addClass('hide');
            }
            var map = Mediakron.Maps.Theme(false, 'map-' + this.randomID, type, '500px', 3, true);
            map.on('moveend', function(evt) {
                var center = evt.target.getCenter(),
                    zoom = evt.target.getZoom();
                changes.center = center;
                changes.zoom = zoom;
            });
        }

    },
    changeScope(e) {
        var type = $(e.currentTarget).val(),
            label = Mediakron.Timeline.zoom.Conversions[type];
        if (label) {
            if (label.label) {
                $('.start-date-label').text('Timeline Scope: Start ' + label.label);
                $('.end-date-label').text('Timeline Scope: End ' + label.label);
            }
        }
    },
    toggleSection(e) {
        var target = $(e.currentTarget);
        target.next().slideToggle();
    },
    dragEnter(e) {
        target = $(e.currentTarget);
        e.stopPropagation();
        e.preventDefault();
        target.css('border', '2px solid #0B85A1');
    },
    dragOver(e) {
        e.stopPropagation();
        e.preventDefault();
    },
    dropFile(e) {
        $(this).css('border', '2px dotted #0B85A1');
        e.preventDefault();
        var upload = Mediakron.Edit.fileUpload(e.originalEvent.drop),
            changes = this.changes;
        upload.done(function(response) {
            Mediakron.Status.formChanged = true;
            changes.image = response.file;
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    addImage(e) {
        if (e.target.files[0].type != 'image/jpg' && e.target.files[0].type != 'image/jpeg' && e.target.files[0].type != 'image/png' && e.target.files[0].type != 'image/gif') {
            Mediakron.message({
                text: "That doesn't appear to be an image.  Please upload images (jpg,jpeg,png or gif).",
                type: 'warning',
                'timeout': 0,
                'dismiss': true,
                layout: 'center'
            });
            return false;
        }
        var upload = Mediakron.Edit.fileUpload(e),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            Mediakron.Status.formChanged = true;
            if (!changes.image) changes.image = {};
            if (changes.image.remote) delete changes.image.remote;
            if (changes.image.local) delete changes.image.local;
            changes.image.uri = response.file;
            changes.size = {
                'width': $('.edit-thumbnail img').width(),
                'height': $('.edit-thumbnail img').height()
            };
            changes.zoom = 2;
            $('#remove-image').removeClass('hide');
            $('.field-alt').removeClass('hide');
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    addText(e) {
        if (!this.changes.text) this.changes.text = this.model.get('text');
        if (jQuery.type(this.changes.text) === 'array') this.changes.text = {};
        if (!this.changes.text.type) this.changes.text.type = 'pdf';
        if (this.changes.text.type == 'pdf') {
            if (e.target.files[0].type != 'application/pdf') {
                Mediakron.message({
                    text: "That file doesn't look like a pdf.  Upload a pdf or change the types above",
                    type: 'warning',
                    'timeout': 3000,
                    'dismiss': true,
                    layout: 'center'
                });
                return false;
            }
        } else {
            if (e.target.files[0].type == 'application/pdf') {
                Mediakron.message({
                    text: "It looks like you uploaded a PDF, but you didn't select PDF as the type.",
                    type: 'warning',
                    'timeout': 3000,
                    'dismiss': true,
                    layout: 'center'
                });
                return false;
            }
        }
        var upload = Mediakron.Edit.fileUpload(e),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            Mediakron.Status.formChanged = true;
            if (!changes.text) changes.text = model.get('text');
            if (changes.text.remote) delete changes.text.remote;
            if (changes.text.local) delete changes.text.local;
            if (jQuery.type(changes.text) === 'array') changes.text = {};
            changes.text.mime = response.mime;
            changes.text.url = response.file;
            if (Mediakron.Settings.MimeTypes.images.indexOf(response.mime) > -1) {
                if (!changes.image) changes.image = {};
                changes.image.uri = response.file;
                changes.image.mime = response.mime;
            }
            $('#remove-file').removeClass('hide');
            $('.field-alt').removeClass('hide');
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    addAudio(e) {
        if (!this.changes.audio) this.changes.audio = this.model.get('audio');
        if (jQuery.type(this.changes.audio) === 'array') this.changes.audio = {};
        if (!this.changes.audio.type) this.changes.audio.type = 'mp3';
        if (this.changes.audio.type == 'mp3') {
            if (e.target.files[0].type != 'audio/mpeg' && e.target.files[0].type != 'audio/mp3' && e.target.files[0].type != 'audio/m4a' && e.target.files[0].type != 'audio/x-m4a' && e.target.files[0].type != 'audio/x-mp3') {
                Mediakron.message({
                    text: "That file doesn't look like an mpeg.  Upload a mp3, mp4, or m4a or change the types above",
                    type: 'warning',
                    'timeout': 3000,
                    'dismiss': true,
                    layout: 'center'
                });
                return false;
            }
        }
        var upload = Mediakron.Edit.fileUpload(e),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            Mediakron.Status.formChanged = true;
            if (!changes.audio) changes.audio = model.get('audio');
            if (jQuery.type(changes.audio) === 'array') changes.audio = {};
            var path = Mediakron.Settings.filepath + response.file;
            changes.audio.mime = response.mime;
            changes.audio.url = path;
            $('#remove-file').removeClass('hide');
            $('.field-alt').removeClass('hide');
            $('#audio-url').text(path);
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    addVideo(e) {
        if (!this.changes.video) this.changes.video = this.model.get('video');
        if (jQuery.type(this.changes.video) === 'array') this.changes.video = {};
        if (!this.changes.video.type) this.changes.video.type = 'm4v';
        if (this.changes.video.type == 'm4v') {
            if (e.target.files[0].type != 'video/mpeg' && e.target.files[0].type != 'video/mp4' && e.target.files[0].type != 'video/m4v' && e.target.files[0].type != 'video/x-m4v' && e.target.files[0].type != 'video/x-mp4') {
                Mediakron.message({
                    text: "That file doesn't look like an mpeg.  Upload a mp4, or m4v or change the types above",
                    type: 'warning',
                    'timeout': 3000,
                    'dismiss': true,
                    layout: 'center'
                });
                return false;
            }
        }
        var upload = Mediakron.Edit.fileUpload(e),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            Mediakron.Status.formChanged = true;
            if (!changes.video) changes.video = model.get('video');
            if (jQuery.type(changes.video) === 'array') changes.video = {};
            var path = Mediakron.Settings.filepath + response.file;
            changes.video.mime = response.mime;
            changes.video.url = path;
            $('#remove-file').removeClass('hide');
            $('.field-alt').removeClass('hide');
            $('#audio-url').text(path);
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    cleanPaste(e) {
        console.log('cleanpaste');
        var target = $(e.currentTarget);
        target.attr('disabled', true);
        setTimeout(function() {
            html = Mediakron.cleanHTML(target.html());
            target.html(html);
            target.attr('disabled', false);
        }, 20);
    },
    blurWysiwyg(e) {
        var target = $(e.currentTarget),
            text = target.text(),
            placeholder = target.attr('data-placeholder');
        if (text === '') {
            target.html('');
        }
    },
    focusWysiwyg(e) {
        var target = $(e.currentTarget),
            text = target.text(),
            placeholder = target.attr('data-placeholder');
        this.focusElement = target;
        if (text == placeholder || text === '') {
            target.html('<p></p>');
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart(target.children()[0], 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    },
    range: false,
    selection: false,
    restoreRange() {
        this.focusElement.focus();
        if (this.range) {
            if (window.getSelection()) {
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(this.range);
                this.range = false;
            } else if (document.selection && this.range.select) {
                this.range.select();
                this.range = false;
            }
        }
    },
    getSelectionStartNode() {},
    bindWysiwygListner(e) {
        var target = $(e.currentTarget),
            form = this;
        $('body').one('mouseup', function(event) {
            form.openWysiwyg(e);
        });
    },
    openWysiwyg(e) {
        // this might work!
        if (e.keyCode == '13') {
            if (!e.shiftKey) {
                document.execCommand('formatBlock', false, 'p');
            }
        }
        var selection = window.getSelection(),
            oRange = selection.getRangeAt(0),
            ancestor = $(oRange.commonAncestorContainer),
            parentEditor = ancestor.closest("div[contenteditable='true']"),
            text = selection.toString();
        if (text.length > 0) {
            this.range = oRange.cloneRange();
            this.selection = selection;
            Mediakron.Wysiwyg.showBubble(e.currentTarget);
            var $node = $(this.getSelectionStartNode());
            if (ancestor.closest('blockquote').length > 0) {
                $('.wysiwyg-indent').addClass('hide');
                $('.wysiwyg-outdent').removeClass('hide');
            } else {
                $('.wysiwyg-indent').removeClass('hide');
                $('.wysiwyg-outdent').addClass('hide');
            }
            if (findinselection('a', parentEditor[0])) {
                $('.wysiwyg-link').addClass('hide');
                $('.wysiwyg-unlink').removeClass('hide');
            } else {
                $('.wysiwyg-link').removeClass('hide');
                $('.wysiwyg-unlink').addClass('hide');
            }
        } else {
            $('.wysiwyg').hide();
        }
    },
    changeModel(e) {
        Mediakron.Status.formChanged = true;
        e.preventDefault();
        var change = false,
            target = $(e.currentTarget);
        if (target.hasClass('enable-wysiwyg')) {
            target.linkify({
                target: "_blank"
            });
        }
        var attribute = target.attr('model-attr'),
            editable = target.attr('contenteditable'),
            type = target.attr('edit-type'),
            id = target.attr('id'),
            value = target.val(),
            html = target.html().trim(),
            text = target.text().trim(),
            metadata = this.model.get('metadata');
        if (!metadata) metadata = {};
        if ($.isArray(metadata)) metadata = {};
        if (!this.changes.metadata) {
            this.changes.metadata = metadata;
        }
        if (!editable) {
            change = value;
        } else if (type == 'html') {
            change = html;
        } else {
            change = text;
        }
        // sometimes a form needs to change depending on the template chosen. bind here
        if (attribute == 'template') {
            Mediakron.Edit.TemplateChange(change, this.model);
            if (change == 'timemap') this.bindTimeMap();
            if (change != 'timemap') {
                $('.timemap-fields').addClass('hide');
            }
        }
        this.changes = Mediakron.Edit.Changes(this.changes, attribute, change, id, this.model);
    },
    bindTimeMap() {
        $('.timemap-fields').removeClass('hide').appendTo($('.layout-option.timemap'));
        var start = false,
            end = false,
            options = this.model.get('options');
        if (options.start) start = options.start;
        if (options.end) end = options.end;
        this.startWidget = new Mediakron.Timeline.selectWidget({
            parent: this,
            $parent: $('.start-date-fields'),
            date: start,
            map: true
        });
        this.startWidget.render();
        this.endWidget = new Mediakron.Timeline.selectWidget({
            parent: this,
            $parent: $('.end-date-fields'),
            date: end,
            map: true
        });
        this.endWidget.render();

    },
    preventLinks(e) {
        e.preventDefault();
        return false;
    },
    openMetadata(e) {
        e.preventDefault();
        $('#metadata-form').addClass('is-visible');
        return false;
    },
    closeMetadata(e) {
        e.preventDefault();
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $('#metadata-form').addClass('closing').one(animationEnd, function() {
            $('#metadata-form').removeClass('closing');
            $('#metadata-form').removeClass('is-visible');
        });
        return false;
    },
    tab(e) {
        e.preventDefault();
        var target = $(e.currentTarget),
            open = $('.tab-content.is-open'),
            closed = $('.tab-content:not(.is-open)');
        if (target.hasClass('is-active')) {} else {
            open.removeClass('is-open').hide();
            closed.addClass('is-open').show();
            $('.tab-link.is-active').removeClass('is-active');
            target.addClass('is-active');
        }
        return false;
    },
    accordion(e) {
        e.preventDefault();
        var target = $(e.currentTarget);
        if (target.hasClass('is-active')) {
            target.parent().removeClass('is-open');
            target.removeClass('is-active');
        } else {
            $('.accordion-panel.is-open').removeClass('is-open');
            target.parent().addClass('is-open');
            $('.accordion-link.is-active').removeClass('is-active');
            target.addClass('is-active');
        }
        return false;
    },
    selectIcon(e) {
        e.preventDefault();
        $('.icons').addClass('open');
    },
    closeIcon(e) {
        e.preventDefault();
        $('.icons').removeClass('open');
    },
});
