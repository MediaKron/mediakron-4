import $ from "jquery";

class ClassManagement{
    constructor(){
        this.body = 'body';
        this.$body = false;
        this.current = '';
        this.next = '';
        this.stat = '';
        this.$body = $(this.body);

    }
    setStatic(stat) {
        this.$body.addClass(stat);
        this.stat = this.stat + ' ' + stat;
    }
    swap(remove, add) {
        this.$body.removeClass(remove).addClass(add);
    }
    toggle(toggle) {
        this.$body.toggleClass(toggle);
    }
    reset() {
        this.$body.removeClass(this.current).addClass(this.next);
        this.current = this.next;
        this.next = '';
    }
    update() {
        this.$body.addClass(this.next);
        this.current = this.current + ' ' + this.next;
        this.next = '';
    }
    queue(add) {
        this.next = this.next + ' ' + add;
        return this.next;
    }
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
export default ClassManagement;