Mediakron.Sidebar.Edit = Backbone.View.extend({
    template: JST['widgets.item-page-options'],
    el: false,
    model: false,
    initialize: function(model) {
        this.model = model;
        this.el = '.page-options-' + model.get('uri');
        this.$el = $(this.el);
        this.render();
        return this;
    },
    render: function() {
        var content = this.model.toJSON(),
            options = this.model.get('options');
        content.item = this.model;
        content.context = false;
        content.collections = this.collections;

        if (Mediakron.context) {
            if (Mediakron.context.item) {
                content.context = Mediakron.context.item;
            }
        }
        this.$el.html(this.template(content));
        return this;
    },
    events: {
        'click a': Mediakron.linkHandle,
        //        'mouseenter .option-edit': 'expandEdit',
        //        'mouseleave .option-edit': 'collapseEdit',
        //        'mouseenter .option-add-to': 'expandAdd',
        //        'mouseleave .option-add-to': 'expandAdd',
        //        'mouseenter #secondary-options': 'expandSecondaryoptions',
        //        'mouseleave #secondary-options': 'collapseSecondaryoptions'   
    },
    expandEdit: function() {
        $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'false' });
        $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.button-secondary-options').removeClass('open');
        $('.edit-button').addClass('open');
    },
    collapseEdit: function() {
        $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.edit-button').removeClass('open');
        $('.button-secondary-options').removeClass('open');
    },
    expandAdd: function() {
        $('.option-add-to .dropdown-container').attr({ 'data-visually-hidden': 'false' });
        $('.add-to-button').addClass('open');
    },
    collapseAdd: function() {
        $('.option-add-to .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.edit-button').removeClass('open');
    },
    expandSecondaryoptions: function() {
        $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'false' });
        $('.option-edit .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.button-secondary-options').addClass('open');
        $('.edit-button').removeClass('open');
    },
    collapseSecondaryoptions: function() {
        $('#secondary-options .dropdown-container').attr({ 'data-visually-hidden': 'true' });
        $('.button-secondary-options').removeClass('open');
        $('.edit-button').removeClass('open');
    },
});