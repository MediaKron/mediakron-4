/*
 * The View handling for Mediakron
 *
 * We're going to add a couple of methods to the backbone view
 * Specifically, we're oing to give ourself an after render function
 * that will only get called once the transition in effects are complete
 * We're also going to provide a transition in and a transition out function to be called by our main app view
 * super spiffy transition stuff going on here.
 *
 * This was an awesome idea, that came in part from mike fowler.   http://mikefowler.me/2013/11/18/page-transitions-in-backbone/
 * Credit where credit due, right?
 *
 */
import * as $ from 'jquery';
import * as Backbone from 'backbone';
import * as _ from 'underscore';


    //Mediakron.TemplateCache = {};
    //Mediakron.RenderedCache = {};
    //Mediakron.Pages = {};



/**
 * We start by creating our own custom view classes.  This is an extension of the base backbone view, that will allow
 * dynamic transitions between views. All of the Page views should extend this function, so that they have the awesome
 * transitions.  If they don't bad things might happen.  It'll do its best to check to make sure you haven't done
 * stupid things with transition handlers, so ha!
 */
class MediakronView extend Backbone.View{

    constructor() {
        super({
            className: false,
            current: false,
            bodyClass: '',
        })
    }

    afterRender() { // make sure you return this at the end of an afterRender function
        return this;
    }

    afterTransition() { // make sure you return this at the end of an afterRender function
        return this;
    }

    getTemplate(id) {
        var template = Mediakron.TemplateCache[id],
            rendered = false;
        if (template && typeof (template) === 'function') { return template; }
        rendered = _.template(id);
        Mediakron.TemplateCache[id] = rendered;
        return rendered;
    }
    loadViewFromCache() {

    }

    close() {
        if (this.onClose) {
            this.onClose();
        }
        this.remove();
        this.unbind();
    }

    closeChildren() { }

    gotoView() { }

    editAttach() {
        if (Mediakron.user.canEditItem(this.type, this.model)) {
            Mediakron.Status.canEditThis = true;
            Mediakron.bindEditor();
        } else {
            Mediakron.Status.canEditThis = false;
        }
        return this;
    }
    getCurrent() {
        if (this.model) {
            var uri = this.model.get('uri'),
                index = Mediakron.controller.tempLoop.indexOf(uri),
                next = index + 1;
            if (index > -1) {
                if (Mediakron.controller.items[next]) {
                    this.current = Mediakron.controller.items[next];
                } else {
                    this.current = this.model;
                }
                Mediakron.controller.tempLoop[index] = false;
            } else {
                this.current = this.model;
            }
        }
    }
}
export default TodoView;