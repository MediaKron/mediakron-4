/**
 * Create a pub sub and have a general system for throwing
 * errors and managing events
 */

 import ErrorPage from '../utilities/error-page/error-page-view';
 import Controller from './views/controller';

export default class Events{
    /**
     * Initialize
     */
    constructor(){
        this.topics = {};
        this.subUid = -1;
    }

    /**
     * Polyfill for legacy mediakron. 
     * Listen to a topic and call back
     * @param {string} topic 
     * @param {function} callback 
     */
    listen(topic, callback){
        return this.subscribe(topic, callback);
    }

    /**
     * Subscribe to a topic and bind the call back event
     * @param {string} topic 
     * @param {function} func 
     */
    subscribe (topic, callback) {
        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }
        var token = (++this.subUid).toString();
        this.topics[topic].push({
            token: token,
            callback: callback
        });
        return token;
    };

    /**
     * Polyfill the event bus for legacy code
     * @param {string} topic 
     * @param {object} args 
     */
    trigger(topic, args){
        return this.publish(topic, args);
    }

    /**
     * Publish an event to a topic
     * @param {string} topic 
     * @param {object} args 
     */
    publish (topic, args) {
        if (!this.topics[topic]) {
            return false;
        }
        setTimeout(function () {
            var subscribers = this.topics[topic],
                len = subscribers ? subscribers.length : 0;

            while (len--) {
                subscribers[len].callback(topic, args);
            }
        }, 0);
        return true;
    };

    /**
     * Break a particular subscription
     * @param {string} token 
     */
    unsubscribe (token) {
        for (var m in this.topics) {
            if (this.topics[m]) {
                for (var i = 0, j = this.topics[m].length; i < j; i++) {
                    if (this.topics[m][i].token === token) {
                        this.topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return false;
    }
    
    /**
     * Throw a failure in the event of an error
     * @param {intger} code 
     */
    ThrowError(code){
        var view = new ErrorPage(code);
        Controller.gotoView(view);
    };

    AccessDenied(){
        var view = new Mediakron.Pages.ErrorPage();
        Controller.gotoView(view);
    };

    xhrProgress(){
        var xhr = $.ajaxSettings.xhr();
        xhr.onprogress = Mediakron.Events.xhrHandleProgress;
        return xhr;
    };

    xhrHandleProgress(evt){
        var percentComplete = 0;
        percentComplete = evt.loaded / evt.total;
        Messages.loadProgress("Loading", Math.round(percentComplete * 100));
    }

}