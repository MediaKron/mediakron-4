/**
 * Build the basic edit funtions that need to get reused
 */
Mediakron.Edit = {};
/**
 * Can this user edit this item. If not throw some help text
 */
Mediakron.Edit.setCanEditStatus = function(stat) {
    if (stat) {
        $('#canedit').text('Editing enabled for this item.');
        $('body').addClass('edit-allowed').removeClass('edit-disabled');
    } else {
        $('#canedit').text('Sorry, you cannot edit this item.');
        $('body').removeClass('edit-allowed').addClass('edit-disabled');
    }
};

/**
 * 
 */
Mediakron.Edit.cancelEdit = function(e) {
    e.preventDefault();
    if (Mediakron.Status.formChanged) {
        text = "You have unsaved changes on this form.  Are you sure you want to cancel?";
        accept = function(request) { Mediakron.Status.formChanged = false;
            window.history.back(); };
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
        reject = function(request) {};
        Mediakron.message({
            text: text,
            type: 'warning',
            timeout: 3000,
            layout: 'center',
            confirm: true,
            callback: function() { accept(); },
            cancel: function() { reject(); }
        });
    } else {
        window.history.back();
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
    }
    return false;
};

/**
 * 
 */
Mediakron.Edit.saveSettingsForm = function(e) {
    e.preventDefault();
    Mediakron.Status.formChanged = false;

    Mediakron.Settings = this.changes;
    Mediakron.App.load();
    $.ajax(
        Mediakron.Data.settings, {
            type: "POST",
            data: { data: JSON.stringify(Mediakron.Settings) },
            dataType: 'json'
        }
    );
    Mediakron.App.load();
    Mediakron.message({
        type: 'success',
        text: '<span class="mk-icon mk-save"> </span> Changes saved.',
        timeout: 4000,
        layout: 'bottom',
        confirm: false,
        dismiss: true
    });
    window.history.back();
    return false;
};

Mediakron.Edit.fileUpload = function(e, scope) {
    var deferred = $.Deferred();
    Mediakron.Status.uploadInProgress = true;
    //    Mediakron.message({
    //                    type: 'info',
    //                    text: 'Uploading File.',
    //                    timeout:    2000,
    //                    layout:     'top',
    //                    confirm:     false,
    //                    dismiss:    false  
    //                });
    $('#file-progress-bar').show();
    var files = e.target.files; // FileList objectId
    // files is a FileList of File objects. List some properties.
    file = files[0];
    var reader = new FileReader(),
        changes = this.changes,
        percent = 0;

    reader.onload = function(e) {
        if (Mediakron.Settings.MimeTypes.images.indexOf(file.type) > -1) {
            Mediakron.Upload.image(deferred, file, e, scope);
        } else if (Mediakron.Settings.MimeTypes.text.indexOf(file.type) > -1) {
            Mediakron.Upload.text(deferred, file, e, scope);
        } else if (Mediakron.Settings.MimeTypes.audio.indexOf(file.type) > -1) {
            Mediakron.Upload.video(deferred, file, e, scope);
        } else if (Mediakron.Settings.MimeTypes.video.indexOf(file.type) > -1) {
            Mediakron.Upload.audio(deferred, file, e, scope);
        } else {
            Mediakron.messages.message('We don\'t recognize this file type.  Please check to make sure you uploaded a valid file');
        }
    };
    reader.readAsDataURL(file);
    return deferred.promise();
};

Mediakron.Upload = {};
Mediakron.Upload.text = function(deferred, file, e) {
    Mediakron.Upload.upload(deferred, file, e);
};

Mediakron.Upload.audio = function(deferred, file, e) {
    Mediakron.Upload.upload(deferred, file, e);
};

Mediakron.Upload.video = function(deferred, file, e) {
    Mediakron.Upload.upload(deferred, file, e);
};

Mediakron.Upload.image = function(deferred, file, e, scope) {
    if (scope) {
        $('.edit-thumbnail', scope).html('<img class="thumb" src="' + e.target.result + '" title="' + escape(file.name) + '"/>');
    } else {
        $('.edit-thumbnail').html('<img class="thumb" src="' + e.target.result + '" title="' + escape(file.name) + '"/>');
    }
    Mediakron.Upload.upload(deferred, file, e);
};

Mediakron.Upload.upload = function(deferred, file, e, scope) {
    $.ajax({
        url: Mediakron.Data.upload,
        data: { uploadfilename: encodeURIComponent(file.name), file: e.target.result },
        type: "post",
        cache: false,
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
            //Upload progress
            xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = Math.floor((evt.loaded / evt.total) * 100);
                    //Do something with upload progress
                    $('#file-progress-bar .progress-bar', scope).width(percentComplete + '%');
                    $('#file-progress-text', scope).text("Progress: " + percentComplete + '%');
                    $('#upload-image').html('<span class="mk-icon mk-upload"> </span> Uploading... '); /* In-button loading message  */
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
        success: function(event, message, response) {

            Mediakron.Status.uploadInProgress = false;
            $('#file-progress-bar', scope).hide();
            $('#upload-image').html('<span class="mk-icon mk-save"> </span> Upload Finished');
            //            Mediakron.message({
            //                type: 'success',
            //                text: 'Upload successful.',
            //                timeout:    4000,
            //                layout:     'bottom',
            //                confirm:     false,
            //                dismiss:    true   
            //            });
            var data = JSON.parse(event);
            deferred.resolve(data);
        },
        error: function(request) {
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

Mediakron.Edit.saveTags = function(tags, item) {

    var array = tags.split(','),
        count = array.length,
        i = 0,
        tag, objects = [],
        located;
    if (count > 0) {
        for (i; i < count; i++) {
            tag = array[i];
            located = Mediakron.Edit.addToTag(tag, item);
        }
    }

    //item.save();
};

Mediakron.Edit.addToTag = function(source, item) {
    // find tags from title
    var title, type, found = false,
        search = source.toLowerCase();
    var tag = Mediakron.items.filter(function(item) {
        type = item.get('type');
        if (type != 'tag') { return false; }
        title = item.get('title');
        if (title.toLowerCase() === search) { return true; }
        return false;
    });

    if (tag[0]) {
        found = tag[0];
    } else {
        found = new Mediakron.Models.Item();
        found.set('type', 'tag');
        found.set('title', source);
    }
    found.add(item, false, true);
    found.save({}, {
        success: function(model) {
            item.add(model, false, true);
        },
        error: function(model) {

        }
    });
};

Mediakron.Edit.ValidateContent = function(model, changes, e) {

    var id = model.get('id'),
        type = model.getNormalType(),
        valid = true,
        json = model.toJSON();

    changes = _.merge(json, changes);

    // validate that the user provided a title.  ITems need titles
    if (!changes.title) {
        valid = throwValidationError('You must provide a title', '.title-field');
    }
    if (type == 'timeline') {

    }
    if (type == 'map') {
        if (!changes.type || changes.type == 'map') {
            valid = throwValidationError('Please select a base layer for this map', '#map-type');
        }
    }
    if (type == 'image') {
        if (!changes.image) {
            valid = throwValidationError('Please upload an image', '.edit-image');
        }
    }
    // validate video
    if (type == 'video') {
        // require both a video type and a video url
        if (!changes.video) {
            valid = throwValidationError('You must provide a video type', '.video-type-field');
            valid = throwValidationError('You must provide a video url', '.video-url-field');
        } else {
            if (!changes.video.type) {
                valid = throwValidationError('You must provide a video type', '.video-type-field');
            }
            if (!changes.video.url) {
                valid = throwValidationError('You must provide a video url', '.video-url-field');
            }
            if (changes.video.type == 'youtube') {}
        }
    }

    // validate video
    if (type == 'audio') {
        // require both a video type and a video url
        if (!changes.audio) {
            valid = throwValidationError('You must provide a audio type', '.audio-type-field');
            valid = throwValidationError('You must provide a audio url', '.audio-url-field');
        } else {
            if (!changes.audio.type) {
                valid = throwValidationError('You must provide a audio type', '.audio-type-field');
            }
            if (!changes.audio.url) {
                valid = throwValidationError('You must provide a audio url', '.audio-url-field');
            }
        }
    }
    return valid;
};

var throwValidationError = function(error, id) {
    Mediakron.message({
        type: 'danger',
        timeout: 40000,
        layout: 'top',
        confirm: false,
        dismiss: true,
        text: error
    });
    $(id).addClass('has-error');
    return false;
};

Mediakron.Edit.Changes = function(changes, attribute, change, id, model) {
    switch (attribute) {
        case 'image':
            if (!changes.image) { changes.image = model.get('image'); }
            if (!changes.image) { changes.image = {}; }
            changes.image[id] = change;
            break;
        case 'metadata':
            if (!changes.metadata) { changes.metadata = model.get('metadata'); }
            changes.metadata[id] = change;
            break;
        case 'video':
            if (!changes.video) { changes.video = model.get('video'); }
            changes.video.url = change;
            break;
        case 'video.start':
            if (!changes.video) { changes.video = model.get('video'); }
            changes.video.start = change;
            break;
        case 'video.end':
            if (!changes.video) { changes.video = model.get('video'); }
            changes.video.end = change;
            break;
        case 'audio':
            if (!changes.audio) { changes.audio = model.get('audio'); }
            changes.audio.url = change;
            break;
        case 'timeline':
            if (!changes.timeline) { changes.timeline = model.get('timeline'); }
            changes.timeline[id] = change;
            break;
        default:
            changes[attribute] = change;
            break;
    }
    return changes;
};

Mediakron.Edit.TemplateChange = function(change, model) {
    // if its a topic and you chose a sequence, lets bind the sequence editor
    if (change == 'sequence') {
        var sequenceEditor = new Mediakron.Admin.sequenceEditor(model);
        sequenceEditor.render();
    }
};