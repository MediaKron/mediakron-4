import $ from "jquery";

class Controller{
    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        this.className = "login login-layout";

        // This object holds the current views
        this.current = {
            primary: false,
            secondary: {
                previous: false,
                current: false,
                next: false
            },
            overlay: false,
            admin: false
        };
        // This hol;ds the elements that will be bound
        this.elements = { 
            admin: $("#admin"), 
            overlay: $("#overlay"), primary: $("#primary"), 
            secondary:{
                'current': $('#secondary'),
                'previous': $('#previous'),
                'next': $('#next')
            } 
        };
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

    /**
     * Load the view
     * 
     * The root method for taking a view, removing the old
     * view in container, and then loading new view into 
     * the container
     * 
     * @param {*} view 
     * @param {*} target 
     * @param {*} previous 
     */
    loadView(view, target = 'primary', previous = false){
        var el = this.elements[target],
          next = view;
        if (previous) {
            previous.remove();
            previous.close();
            $("#main").removeClass(previous.classes);
        }
        // Creqate a wrapper element
        var $el = $('<div id="' + view.cid + '"></div>');
        el.append($el);
        next.setElement("#" + view.cid);
        
        // Render the view
        next.render();
        next.afterRender();
        return next;
    }

    /**
     * Go to the primary view
     * @param {*} view 
     */
    gotoView(view){
        // Singleton controller
        var mk = Mediakron.controller;
        console.log('going to view')
        // Shunt the current view into a previous object
        var previous = mk.current.primary || null,
          next = view;
        mk.current.primary = mk.loadView(view, "primary", previous);
    }

    /**
     * Load a view into the admin pane and open the admin
     * This is a Singleton method
     * @param {*} view 
     */
    gotoAdmin(view) {
        // Singleton controller
        var mk = Mediakron.controller;
        // Shun the current view into a previous object
        var previous = mk.current.admin || null,
          next = view;
        mk.current.primary = mk.loadView(view, "admin", previous);
        mk.openAdmin();
    }

    /**
     * Load a view into the overlay and open the overlay
     * Singleton Method
     * @param {*} view 
     */
    gotoOverlay(view) {
        // Singleton controller
        var mk = Mediakron.controller;
        // Shun the current view into a previous object
        var previous = mk.current.overlay || null,
          next = view;
        mk.current.primary = mk.loadView(view, "overlay", previous);
        mk.openOverlay();
    }

    /**
     * Open the admin
     */
    openAdmin(){
        var el = this.elements.admin;
        el.addClass('open');
    }

    /**
     * Close the admin
     */
    closeAdmin() {
        var el = this.elements.admin;
        el.removeClass('open');
    }

    /**
     * Open the overlay
     */
    openOverlay() {
        var el = this.elements.admin;
        el.addClass('open');
    }

    /**
     * Close the overlay
     */
    closeOverlay() {
        var el = this.elements.admin;
        el.removeClass('open');
    }

}


// Create an instance
const instance = new Controller();

// Freeze the instance
Object.freeze(instance);

// Export the instance
export default instance;