import $ from "jquery";
import _ from "lodash";

import wrapper from "./messages-templates/wrapper.html"
import template from "./messages-templates/default.html"
import progress from "./messages-templates/progress.html"

class Message {
  constructor() {
    $("#wrapper-main").append(this.wrapper());
    // Sane defaults
    this.type = "warning";
    this.layout = "top";
    this.text = "";
    this.dismiss = false;
    this.timeout = 2000;
    this.request = {};
    this.bindTo = false;
    this.confirm = false;
    this.callback = false;
    this.cancel = false;
    this.bindHelper = false;
    this.progress = false;

    this.percentEl = false;
    this.siteLoaded = 0;
  }

    /**
       * 
       * @param {*} item 
       */
    add(item) {
        this._data.push(item);
    }

    /**
     * 
     * @param {*} id 
     */
    get(id) {
        return this._data.find(d => d.id === id);
    }


  get wrapper() {
    return _.template(wrapper);
  }

  get template() {
    if (this.progress) {
      return _.template(progress);
    } else {
      return _.template(template);
    }
  }

  message(request) {
      console.log(request);
    this.request = request;

    this.$el = false;

    // Default overrides
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
    // We should be able to get a layout
    if (!request.el) {
      this.bindTo = $("#message-" + this.layout);
    } else {
      this.bindTo = $(request.el);
    }
    console.log(this.request)
    this.render();
  }

  /**
   * 
   */
  remove(){
    this.$el.remove();
  }

  /**
   *
   */
  render() {
    this.$el = $(this.template(this.request));
    this.bindTo.append(this.$el);
    if (this.request.timeout && this.request.timeout > 0 && !this.confirm) {
      var view = this;
      setTimeout(function() {
        view.remove();
      }, this.timeout);
    }
    if (this.bindHelper) this.bindHelper(this);
    if (this.progress) {
      $("#message-progressbar").progressbar();
    }
    return this;
  }

  loadProgress(eventLabel, percentComplete) {
    Mediakron.siteLoaded = Math.round(percentComplete);
    Mediakron.messages.progress(eventLabel, Mediakron.siteLoaded);
  }
  
  // Basic wrapper for normal boring messages
  progress(message, percent) {
    if (!Mediakron.messages.inProgress) {
      Mediakron.messages.inProgress = true;
      if (!Mediakron.preload) $("#progress-bar").fadeIn("fast");
    }
    if (percent > 100) percent = 100;
    $(".progress-bar").width(percent + "%");
    $("#progress-text").text(message + "... " + percent + "%");
    if (percent == 100) {
      Mediakron.messages.progressComplete();
    }
  }
  progressComplete() {
    Mediakron.messages.inProgress = false;
    $("#progress-bar")
      .delay(500)
      .fadeOut("slow");
  }

  progressMessage(message, percent) {
    if (!Mediakron.messages.percentEl) {
      Mediakron.messages.percentEl = new Mediakron.messages.View({
        text: message,
        type: "warning",
        timeout: 0,
        layout: "bottom",
        confirm: false,
        dismiss: true,
        progress: true
      });
      Mediakron.messages.percentEl.render();
    }

    $("#message-progressbar").progressbar("value", percent);
  }

  progressUpdate(percent) {
    $("#message-progressbar").progressbar("value", percent);
  }

  progressClose() {
    Mediakron.messages.percentEl.close();
  }

  // A wrapper function for all messages that require confirmation and callbacks
  confirm(
    message,
    acceptCallback,
    acceptMessage,
    rejectCallaback,
    rejectMessage,
    data
  ) {
    return new Mediakron.messages.View({
      text: message,
      type: status,
      timeout: 0,
      layout: "top",
      confirm: true,
      callback: function() {
        acceptCallback(data);
      },
      cancel: function() {
        rejectCallaback(data);
      }
    }).render();
  }

    danger(text, position = "bottom") {
        return this.message({
            type: "danger",
            timeout: 3000,
            dismiss: true,
            layout: position,
            text: text
        });
    }

  error(text, position = "bottom") {
    return this.message({
      type: "warning",
      timeout: 3000,
      dismiss: true,
      layout: position,
      text: text
    });
  }
  pending(text) {
    return this.message({
      type: "warning",
      timeout: 3000,
      dismiss: true,
      layout: "bottom",
      text: text
    });
  }

  success(text, position = "bottom") {
    return this.message({
      type: "warning",
      timeout: 3000,
      dismiss: true,
      layout: position,
      text: text
    });
  }
}

// Create an instance
const instance = new Message();

// Freeze the instance
//Object.freeze(instance);

// Export the instance
export default instance;
