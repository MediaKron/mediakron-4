import $ from "jquery";

/**
 * This is a singleton pattern
 */
class ClassManagement{
    constructor(){
        this.body = 'body';
        this.$body = false;
        this.current = '';
        this.next = '';
        this.stat = '';
        this.$body = $(this.body);
    }

    /**
     * 
     * @param {*} item 
     */
    add(item) {
        console.log('adding data')
        console.log(item);
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
     * Set the body class
     * @param {User} user 
     */
    setAdmin(user){
        if(user.isAdmin()){
            this.setStatic("not-administer");
        }else{
            this.setStatic("not-administer");
        }
    }

    /**
     * 
     * @param {string} stat 
     */
    setStatic(stat) {
        this.$body.addClass(stat);
        this.stat = this.stat + ' ' + stat;
    }

    /**
     * 
     * @param {string} remove 
     * @param {string} add 
     */
    swap(remove, add) {
        this.$body.removeClass(remove).addClass(add);
    }
    /**
     * 
     * @param {string} toggle 
     */
    toggle(toggle) {
        this.$body.toggleClass(toggle);
    }

    /**
     * Reset the classes
     */
    reset() {
        this.$body.removeClass(this.current).addClass(this.next);
        this.current = this.next;
        this.next = '';
    }

    /**
     * Update the classes
     */
    update() {
        this.$body.addClass(this.next);
        this.current = this.current + ' ' + this.next;
        this.next = '';
    }
    /**
     * 
     * @param {string} add 
     */
    queue(add) {
        this.next = this.next + ' ' + add;
        return this.next;
    }
    /**
     * 
     * @param {Item} item 
     */
    item(item) {
        var template = item.get('template'),
            type = item.getNormalType();
        this.queue(' type-' + type + ' item-' + type);
        this.queue(type + '-' + template);
        if (Mediakron.Templates[type]) {
            if (Mediakron.Templates[type][template]) {
                if (Mediakron.Templates[type][template].classes) this.queue(Mediakron.Templates[type][template].classes);
            }
        }
    }
}

// Create an instance
const instance = new ClassManagement();

// Freeze the instance
Object.freeze(instance);

// Export the instance
export default instance;