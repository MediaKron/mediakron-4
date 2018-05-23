Mediakron.Navigation = {};

Mediakron.Navigation.Form = Mediakron.Extensions.View.extend({
    template: JST['settings.navigation'],
    primary: [],
    secondary: [],
    changes: false,
    
    initialize: function () {
        this.changes = Mediakron.Settings;
        var primary = this.primary;
        this.primary = primary;
        if(!Mediakron.Settings.Navigation.secondary){ Mediakron.Settings.Navigation.secondary = {}; }
        this.secondary = Mediakron.Settings.Navigation.secondary;
    },
    render: function () {
        $(this.el).html(this.template({'primary': this.primary, 'secondary': this.secondary, 'navigation': Mediakron.Settings.Appearance.navigation }));
        
        return this;
    },
    afterRender: function(){
        var item, changes = this.changes;
        if(this.changes.Navigation.secondary.constructor === Array){
            this.changes.Navigation.secondary = {};
        }
        $('#edit-primary-menus').sortable({
            placeholder: "ui-state-highlight",
            handle: ".nav-item",
            stop: function(event,ui){
                var uri, type, title;
                changes.Navigation.primary = [];
                $('#edit-primary-menus li').each(function(){
                    item = $(this);
                    uri = item.attr('uri');
                    type = item.attr('type');
                    title = item.attr('title');
                    if(type == 'external'){
                        changes.Navigation.primary.push({'uri':uri,'title':title,'type':'external'});
                    }else{
                        changes.Navigation.primary.push(uri);
                    }
                });
            }
        });
        _.each(Mediakron.Settings.Navigation.primary, function(menu){
            if(typeof(menu) == 'object'){
                item = menu;
            }else{
                item = Mediakron.getItemFromURI(menu);
            }
            if(item) Mediakron.Navigation.Render(item);
        });
    },
    events: {
        'click a':                         Mediakron.linkHandle,
        'click #menu-add-content':         'getContentBrowser',
        'click #menu-add-external':        'getExternalLink',
        'click #done-editing':             Mediakron.Edit.saveSettingsForm,
        'click #cancel-editing':           Mediakron.Edit.cancelEdit,
        'click #close-settings-context':   Mediakron.Edit.cancelEdit,
        'click .close-button':            Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click #external-add':             'addExternalLink',
        'change .toggle-field':             "bindToggleSettings",
        'click .menu-options-container input':    "navigation"
    },
    navigation: function(e){
        var val = $('.menu-options-container input:checked').val();
        this.changes.Appearance.navigation = val;
    },
    bindToggleSettings: function(e){
        var value = $(e.currentTarget).is(':checked'),
            name = $(e.currentTarget).attr('name');
        this.changes.Navigation.secondary[name] = value;
        console.log(this.changes.Navigation.secondary);
    },
    getExternalLink: function(){
        $('#external-url-form').toggleClass('hide');
    },
    addExternalLink:function(){
        var url = $('#external-url').val(), title = $('#external-title').val();
        if(!Mediakron.validateURL(url)){ 
            url = 'http://'+url;
            
            if(!Mediakron.validateURL(url)){ 
                Mediakron.message({
                    type: 'danger',
                    text: 'This url does not appear to be valid.  Make sure it starts with http or https.'    ,
                    timeout:1500,
                    confirm:     false,
                    dismiss:    true
                });
                return false;
            } 
        }
        if(!Mediakron.Settings.Navigation.primary){ Mediakron.Settings.Navigation.primary = []; }
        Mediakron.Settings.Navigation.primary.push({'uri': url, 'title': title,'type':'external'});
        Mediakron.Navigation.Render({'uri': url, 'title': title,'type':'external'});
    },
    getContentBrowser: function(){
        $('#admin-navigation').hide();
        $('#admin-navigation-content').removeClass('hide');
        var data, callback, view, navView = this;
        data = {
            'context': false,
            'callback': function(menu){
                if(!Mediakron.Settings.Navigation.primary){ Mediakron.Settings.Navigation.primary = []; }
                Mediakron.Settings.Navigation.primary.push(menu.get('uri'));
                Mediakron.Navigation.Render(menu);
                $('#admin-navigation-content').addClass('hide').empty();
                $('#admin-navigation').show();
            }
        };
        view = new Mediakron.ContentBrowser.Selector(data);
        view.setElement('#admin-navigation-content');
        view.render();
        view.afterRender();
        
    }
});


Mediakron.Navigation.Item = Mediakron.Extensions.View.extend({
    template: JST['settings.navigation.item'],
    item: false,
    type: 'internal',
    initialize: function (item) {
        this.item = item;
    },
    render: function () {
        console.log(this.item);
        if(this.item.type && this.item.type == 'external'){
            this.type = 'external';
            $(this.el).html(this.template(this.item));
        }else{
            $(this.el).html(this.template(this.item.toJSON()));
        }
        
        return this;
    },
    events: {
        'click .remove-menu': 'removeMenu'
    },
    removeMenu: function(e){
        
        var uri, index;
        if(this.type == 'external'){
            index = Mediakron.Settings.Navigation.primary.indexOf(this.item);
            delete Mediakron.Settings.Navigation.primary[index];
        }else{
            uri = this.item.get('uri');
            index = Mediakron.Settings.Navigation.primary.indexOf(uri);
            delete Mediakron.Settings.Navigation.primary[index];
        }
        this.remove();
    }
});

Mediakron.Navigation.Render = function(model){
    var item = new Mediakron.Navigation.Item(model);
    $('#edit-primary-menus').append(item.render().$el);
    $('#edit-primary-menus').sortable('refresh');
};