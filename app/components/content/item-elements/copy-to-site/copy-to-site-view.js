Mediakron.Admin.Transmit = Mediakron.Extensions.View.extend({
    template: JST['settings.copy-to-site'],
    item: false,
    initialize: function(data) {
        this.item = data.item;
        this.type = this.item.getNormalType();
    },
    render: function() {
        var view = this;
        var content = this.item.toJSON();
        content.model = this.item;
        content.sites = Mediakron.user.get('sites');
        view.$el.html(view.template(content));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #cancel-editing': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click #transmit': 'triggerTransmit'
    },
    triggerTransmit: function() {
        var remote = $('#choose-site').val(),
            children = [],
            i = 0,
            count = 0,
            child, childItem, newitem;
        var data = this.item.toJSON();
        delete data._id;
        newitem = new Mediakron.Models.Item();
        newitem.set(data);
        var image = newitem.get('image');
        if (image.uri) {
            image = {
                'local': true,
                'remote': image.uri,
                'site': Mediakron.Settings.uri
            };
            newitem.set('image', image);
        }
        if (this.type == 'file') {
            var text = newitem.get('text');
            if (text.uri) {
                text.local = true;
                text.remote = text.uri;
                text.site = Mediakron.Settings.uri;
                newitem.set('text', text);
            }
        }
        if (this.type == 'video') {
            var video = newitem.get('video');
            if (video.uri) {
                video.local = true;
                video.remote = video.uri;
                video.site = Mediakron.Settings.uri;
                newitem.set('video', video);
            }
        }
        if (this.type == 'audio') {
            var audio = newitem.get('audio');
            if (audio.uri) {
                audio.local = true;
                audio.remote = audio.uri;
                audio.site = Mediakron.Settings.uri;
                newitem.set('audio', audio);
            }
        }
        
        newitem.url = remote;
        newitem.save({}, { // options
            type: 'post',
            success: function(model){
              Mediakron.messages.message('Item copied to site', 'success', 5000, 'bottom');
              
            },
            error: function(){
              Mediakron.message({
                'timeout': 5000,
                'type': 'danger',
                'text': 'Item could not be copied',
                'layout': 'top',
                'confirm': false,
                'dismiss': true
            });
            }         
        });
    }
});