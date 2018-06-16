Mediakron.Import = {};

Mediakron.Import.Initial = Mediakron.Extensions.View.extend({
    template: JST['settings.import'],
    rows: [],
    plugins:[],
    initialize: function () {
        this.plugins = [
            {
                url:"settings/import/images",
                require: ["plugins/import/images/images"],
                title:"Files"
            },
            {
                url:"settings/import/csv",
                require: ["plugins/import/csv/csv"],
                title:"CSV"
            },
            {
                url:"settings/import/xml",
                require: ["plugins/import/xml/xml"],
                title:"XML"
            },
            /*{
                url:"settings/import/omeka",
                require: ["plugins/import/omeka/omeka"],
                title:"Omeka"
            },
            {
                url:"settings/import/json",
                require: ["plugins/import/json/json"],
                title:"Json"
            },

            {
                url:"settings/import/rss",
                require: ["plugins/import/rss"],
                title:"RSS"
            },*/
            {
                url:"settings/import/mediakron2",
                require: ["plugins/import/mediakron2/mediakron2"],
                title:"Mediakron2",
            }
            
        ];
    }, 
    render: function () {
        this.$el.html(this.template(
            { plugins:this.plugins }
        ));
        $('.plugin:first').addClass('is-active'); /* Make the first tab active */
        return this;
    },
    afterRender: function(){
    },
    events: {
        'click .plugin': 'loadPlugin',
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
                console.log($('#page-content-wrapper'));
                plugin.render($('#page-content-wrapper'));
            });
        $('.plugin').removeClass('is-active');
        $(e.currentTarget).addClass('is-active');
        }
        return false;
        
    }
});
