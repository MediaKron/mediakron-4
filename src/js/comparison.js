Mediakron.Comparison = {};
Mediakron.Comparison.base = Backbone.View.extend({
    template: JST['navigation.main.right'],
    el: '#navbar-right',
    items: [],
    initialize: function(){
        
    },
    render: function(){
        this.$el.hide();
        this.$el.html(this.template({ secondary: Mediakron.Settings.Navigation.secondary }));
        
        this.$el.show().addClass('animated slideInDown');
        return this;
    },
    events: {
        'click #configure-site-menu': 'toggleConfig',
        'click #dev-site-menu': 'toggleDev',
        'click #search': 'toggleSearch',
        'click a': Mediakron.linkHandle
    },
    toggleConfig: function(){
        $('#configure-menu').slideToggle('fast');    
    },
    toggleSearch: function(){
        $('#search-form').slideToggle('fast');
    },
    toggleDev: function(){
        $('#dev-menu').slideToggle('fast');
    }
});