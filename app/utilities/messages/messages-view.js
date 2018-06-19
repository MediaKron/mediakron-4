/**
 * Build Message handling
 */
Mediakron.messages = {};
Mediakron.messages.View = Backbone.View.extend({
    template: JST['messages.default'], //
    type: 'warning', //
    layout: 'top', //
    text: '', //
    dismiss: false, //
    timeout: 2000, //
    request: {}, //
    bindTo: false, //
    confirm: false, //
    callback: false, //
    cancel: false, //
    bindHelper: false, //
    progress: false,
    /**
     * Intialize the view
     */
    initialize: function(request) {
        this.request = request;

        if (request.layout) this.layout = request.layout;
        if (!this.request.type) this.request.type = this.type;
        if (!this.request.layout) this.request.layout = this.layout;
        if (!this.request.text) this.request.text = this.text;
        if (!this.request.dismiss) this.request.dismiss = this.dismiss;
        if (this.request.confirm) this.confirm = this.request.confirm;
        if (this.request.callback) this.callback = this.request.callback;
        if (this.request.cancel) this.cancel = this.request.cancel;
        if (this.request.progress) this.progress = this.request.progress;
        if (this.request.bindHelper) this.bindHelper = this.request.bindHelper;
        if (request.timeout) {
            this.timeout = request.timeout;
        }
        if (!request.el) {
            this.bindTo = $('#message-' + this.layout);
        } else {
            this.bindTo = $(request.el);
        }
        if (this.progress) {
            this.template = JST['messages.progress'];
        }
    },

    /**
     * 
     */
    render: function() {
        this.$el.html(this.template(this.request));
        this.bindTo.append(this.$el);
        if (this.request.timeout && this.request.timeout > 0 && !this.confirm) {
            var view = this;
            setTimeout(function() {
                view.remove();
            }, this.timeout);
        }
        if (this.bindHelper) this.bindHelper(this);
        if (this.progress) {
            $('#message-progressbar').progressbar();
        }
        return this;
    },

    /**
     * 
     */
    events: {
        'click .disable-archive': Mediakron.linkHandle,
        "click .confirm": 'execute',
        "click .cancel": 'escape',
        "click .close": 'close',
    },



    /**
     * 
     */
    execute: function() {
        this.callback();
        this.remove();
    },

    escape: function() {
        this.cancel();
        this.remove();
    },

    close: function() {
        this.remove();
    }
});
/**
 *  message view short stub
 */
Mediakron.message = function(request) {
    var message = new Mediakron.messages.View(request).render();
};
Mediakron.messages.inProgress = false;
// Basic wrapper for normal boring messages
Mediakron.messages.message = function(message, status, persist, position) {
    if (!status) {
        status = 'warning';
    }
    var timeout = 2000;
    if (persist === true) {
        timeout = false;
    }
    if (persist) {
        if (Number.isInteger(persist)) {
            timeout = persist;
        }
    }
    if (!position) {
        position = 'center';
    }
    confirm = false;
    dismiss = true;
    return new Mediakron.messages.View({
        text: message,
        type: status,
        timeout: timeout,
        layout: position,
        confirm: confirm,
        dismiss: dismiss
    }).render();
};
// Shorthand message format
var mkError = function(message, time) {
    if (!time) time = 8000;
    Mediakron.messages.message(message, 'danger', time, 'top');
};
var mkSuccess = function(message, time) {
    if (!time) time = 8000;
    Mediakron.messages.message(message, 'success', time, 'top');
};
Mediakron.siteLoaded = 0;
Mediakron.messages.loadProgress = function(eventLabel, percentComplete) {
    Mediakron.siteLoaded = Math.round(percentComplete);
    Mediakron.messages.progress(eventLabel, Mediakron.siteLoaded);
};
// Basic wrapper for normal boring messages
Mediakron.messages.progress = function(message, percent) {
    if (!Mediakron.messages.inProgress) {
        Mediakron.messages.inProgress = true;
        if (!Mediakron.preload) $('#progress-bar').fadeIn("fast");
    }
    if (percent > 100) percent = 100;
    $('.progress-bar').width(percent + '%');
    $('#progress-text').text(message + '... ' + percent + '%');
    if (percent == 100) {
        Mediakron.messages.progressComplete();
    }
};
Mediakron.messages.progressComplete = function() {
    Mediakron.messages.inProgress = false;
    $('#progress-bar').delay(500).fadeOut("slow");
};

Mediakron.messages.percentEl = false;

Mediakron.messages.progressMessage = function(message, percent) {
    if (!Mediakron.messages.percentEl) {
        Mediakron.messages.percentEl = new Mediakron.messages.View({
            text: message,
            type: 'warning',
            timeout: 0,
            layout: 'bottom',
            confirm: false,
            dismiss: true,
            progress: true,
        });
        Mediakron.messages.percentEl.render();

    }

    $('#message-progressbar').progressbar('value', percent);

};

Mediakron.messages.progressUpdate = function(percent) {
    $('#message-progressbar').progressbar('value', percent);
};

Mediakron.messages.progressClose = function() {
    Mediakron.messages.percentEl.close();
};


// A wrapper function for all messages that require confirmation and callbacks
Mediakron.messages.confirm = function(message, acceptCallback, acceptMessage, rejectCallaback, rejectMessage, data) {
    return new Mediakron.messages.View({
        text: message,
        type: status,
        timeout: 0,
        layout: 'top',
        confirm: true,
        callback: function() {
            acceptCallback(data);
        },
        cancel: function() {
            rejectCallaback(data);
        }
    }).render();
};
Mediakron.confirm = function(message, approve, reject, options, target) {
    return new Mediakron.messages.View({
        text: message,
        type: status,
        timeout: 0,
        layout: 'top',
        confirm: true,
        callback: function() {
            approve(options);
        },
        cancel: function() {
            reject(options);
        }
    }).render();
};
Mediakron.message.error = function(text) {
    return Mediakron.message({
        type: 'warning',
        'timeout': 3000,
        'dismiss': true,
        layout: 'center',
        'text': text
    });
};
Mediakron.message.pending = function(text) {
    return Mediakron.message({
        type: 'warning',
        'timeout': 3000,
        'dismiss': true,
        layout: 'bottom',
        'text': text
    });
};

Mediakron.message.success = function(text) {
    return Mediakron.message({
        type: 'warning',
        'timeout': 3000,
        'dismiss': true,
        layout: 'bottom',
        'text': text
    });
};