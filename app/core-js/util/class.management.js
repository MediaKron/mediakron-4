var ClassManagement = function (options) {
    if (!options) options = {};
    this.initialize.apply(this, arguments);
};
_.extend(ClassManagement.prototype, ClassManagement, {
    body: 'body',
    $body: false,
    current: '',
    next: '',
    stat: '',
    initialize: function () {
        this.$body = $(this.body);
    },
    setStatic: function (stat) {
        this.$body.addClass(stat);
        this.stat = this.stat + ' ' + stat;
    },
    swap: function (remove, add) {
        this.$body.removeClass(remove).addClass(add);
    },
    toggle: function (toggle) {
        this.$body.toggleClass(toggle);
    },
    reset: function () {
        this.$body.removeClass(this.current).addClass(this.next);
        this.current = this.next;
        this.next = '';
    },
    update: function () {
        this.$body.addClass(this.next);
        this.current = this.current + ' ' + this.next;
        this.next = '';
    },
    queue: function (add) {
        this.next = this.next + ' ' + add;
        return this.next;
    },
    item: function (item) {
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
});

module.exports = ClassManagement;