Mediakron.Export = {};

Mediakron.Export.Initial = Mediakron.Extensions.View.extend({
    template: JST['settings.export'],
    rows: [],
    plugins:[],
    initialize: function () {
        this.plugins = [
            {
                url:"settings/import/json",
                require: ["plugins/export/json/json"],
                title:"Json Exporter",
                //template: 
            },{
                url:"settings/import/xml",
                require: ["plugins/export/xml/xml"],
                title:"XML Exporter",
                //template: 
            }
        ];
    }, 
    render: function () {
        this.$el.html(this.template(
            { plugins:this.plugins }
        ));
        return this;
    },
    afterRender: function(){
    },
    events: {
        'click .plugin': 'loadPlugin',
        'click #cancel-editing':            'closeOverlay',
        'click .close-button':                      'closeOverlay',
        'click .overlay.opened .overlay-bg':        'closeOverlay'
    },
    closeOverlay:function(e){
        Mediakron.controller.closeOverlay();
    },
    loadPlugin:function(e){
        e.preventDefault();
        var id = $(e.currentTarget).attr('plugin-id'),
            plugin = this.plugins[id];
        if(plugin){
            console.log(plugin.require);
            require(plugin.require,function(plugin){
                console.log(plugin);
                plugin.render($('#page-content-wrapper'));
            });
        }
        return false;
        
    }
    
});