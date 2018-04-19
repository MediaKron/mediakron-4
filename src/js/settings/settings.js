Mediakron.Admin = {
    Organize: {}
};
Mediakron.Admin.Landing = Mediakron.Extensions.View.extend({
    template: JST['settings.settings'],
    type: false,
    changes: false,
    initialize: function() {},
    render: function() {
        var content = {};
        $(this.el).html(this.template(content));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click .intro-tour': 'guidedTour'
    },
    guidedTour: function() {
        require(["tours/intro"], function(tour) {
            tour.start();
        });
    }
});
Mediakron.Admin.AdminPage = Mediakron.Extensions.View.extend({
    template: JST['settings.index'],
    type: false,
    changes: false,
    initialize: function(type) {
        if (!this.changes) {
            this.changes = Mediakron.Settings;
        }
    },
    render: function() {
        var content = {};
        $(this.el).html(this.template(content));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click #done-editing': Mediakron.Edit.saveSettingsForm,
        'click #clear-cache': 'clearCache',
        'click #cancel-editing': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'blur .settings-field': "bindSettings",
        'change .settings-field': "bindSettings",
        'change .toggle-field': "bindToggleSettings"
    },
    bindSettings: function(e) {
        var val = $(e.currentTarget).val(),
            property = $(e.currentTarget).attr('settings-attr'),
            checked = $(e.currentTarget).is(':checked');
        if (val == 'true') {
            val = true;
        }
        if (val == 'false') {
            val = false;
        }
        this.changes[property] = val;
        Mediakron.Status.formChanged = true;
    },
    bindToggleSettings: function(e) {
        var property = $(e.currentTarget).attr('settings-attr'),
            checked = $(e.currentTarget).is(':checked');
        this.changes[property] = checked;
        Mediakron.Status.formChanged = true;
    }
});
Mediakron.Admin.PerformancePage = Mediakron.Extensions.View.extend({
    template: JST['settings.performance'],
    type: false,
    changes: false,
    initialize: function(type) {
        if (!this.changes) {
            this.changes = Mediakron.Settings;
        }
    },
    render: function() {
        var content = {};
        $(this.el).html(this.template(content));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click #done-editing': Mediakron.Edit.saveSettingsForm,
        'click #clear-cache': 'clearCache',
        'click #cancel-editing': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click .close-button': Mediakron.Edit.cancelEdit
    },
    clearCache: function() {
        $.getJSON(Mediakron.Settings.basepath + 'cache/generate', function(data) {
            Mediakron.message({
                'type': 'success',
                'timeout': 4000,
                'layout': 'bottom',
                'text': 'Cache Regenerated'
            });
        });
    }
});
// Marker Management
Mediakron.Admin.Marker = Mediakron.Extensions.View.extend({
  template: JST['settings.map.marker'],
  type: false,
  map: false,
  item: false,
  uri: false,
  latitude: '',
  longitude: '',
  isItem: false,
  changes: {},
  startWidget: false,
  endWidget: false,
  filter: false,
  zoom: 0,
  center: { lat: false, lon: false },
  
  initialize: function(data) {
    var view = this;
    this.uri = data.marker;
    this.oldURI = data.marker;
    this.changes = {};
    this.mapItem = data.map;
    this.map = Mediakron.Status.CurrentMap;
    
    if(this.map === 0 || !this.map){ Mediakron.router.navigate(data.map.get('uri'), {  trigger: true }); return false; }
    
    this.map.drawMarkers();
    $('.timeline-slider').slider('values', 0, 0);
    $('.timeline-slider').slider('values', 1, 100);
    if(!this.map || this.map === 0){
      Mediakron.router.navigate(data.map.get('uri'), {
        trigger: true
      });
      return false;
    }
    this.marker =  false;

    _.each(this.map.markers, function(marker, uri) {
      if(view.uri == uri){
        view.marker = marker;
      }
    });

    if(!this.marker.options) this.marker.options = { editing: {} };
    if(!this.marker.options.editing) this.marker.options.editing = {};
    this.marker.editing.enable();
    // get layer
    this.layer = this.map.model.getChild(this.uri, 'layers');
    
    if(this.layer.data.type == 'point'){
      this.latitude = this.layer.data.coordinate.lat;
      this.longitude = this.layer.data.coordinate.lng;
    }
    if(this.layer.data.layer){
      this.filter = this.layer.data.layer;
    }
    if(this.layer.data.zoom){
        this.zoom = this.layer.data.zoom;
    }
    if(this.layer.data.center){
        this.center = this.layer.data.center;
    }
  },
  
  render: function() {
    var view = this;
    if(this.layout){
      this.template = JST['pages.map.'+this.layout];
    }
    if(!this.layer){
      Mediakron.router.navigate(this.mapItem.get('uri'), {
        trigger: true
      });

    }else{
      var label = '';
      if(this.layer.data.label){
        label = this.layer.data.label;
      }
      var filter = false;
      if( this.filter ){
        filter = Mediakron.getItemFromURI(this.filter);
      }else if(this.layer.data.layer){
        filter = Mediakron.getItemFromURI(this.layer.data.layer);
      }
      var content = {
        map: this.map,
        item: Mediakron.getItemFromURI(this.uri),
        type: this.layer.data.type,
        uri: this.uri,
        label: label,
        latitude: this.latitude,
        longitude: this.longitude,
        address: this.layer.data.address,
        layer: filter,
        zoom: this.zoom,
        center: this.center
      };
  
      $(this.el).html(this.template(content));
      $(this.el).append('<div id="admin-link-content" class="marker-add-pane" />');
      this.marker.on('edit',function(e){
        if(view.layer.data.type == 'point'){
          Mediakron.Status.formChanged = true;
          var lnglat = e.target.getLatLng();
          $('#mark-longitude').val(lnglat.lng);
          $('#mark-latitude').val(lnglat.lat);
        }
      });
    }
//     $('.map-template').addClass('content-push-sidebar'); 
     /* setTimeout(function(){ Mediakron.Status.CurrentMap.invalidateSize(); }, 400);  Refresh map width */
    
    return this;
  },
  
  afterRender: function() {
    var start = false, end = false;
    if(!this.layer) this.layer = { 'data': {} };
    if(this.layer.data.start) start = this.layer.data.start;
    if(this.layer.data.end) end = this.layer.data.end;
    this.startWidget = new Mediakron.Timeline.selectWidget({
        parent: this,
        $parent: $('.start-date-fields'),
        date: start,
        map: true
    });
    this.startWidget.render();
    this.endWidget = new Mediakron.Timeline.selectWidget({
        parent: this,
        $parent: $('.end-date-fields'),
        date: end,
        map: true
    });
    this.endWidget.render();
  },
  events: {
    'click a': Mediakron.linkHandle,
    'click .close-button': 'cancel',
    'click #cancel-editing': 'cancel',
    'click .overlay-bg': 'cancel',
    'click #done-editing': 'save',
    'click #attach-existing': "getContentBrowser",
    'click .remove-item .mk-remove': "removeItem",
    'click .remove-layer .mk-remove': "removeLayer",
    'click #add-label': 'addLabel',
    'click .remove-label .mk-remove': "removeLabel",
    'click #attach-existing-layer': "getLayerContentBrowser",
    'click #attach-new-layer': "addLayer",
    'click .remove-layer': "removeLayer",
    'click .layer-options-edit': "showLayerEdit",
    'click .layer-edit-button': "editLayer",
    'change #mark-longitude': 'drawPoint',
    'change #mark-latitude': 'drawPoint',
    'blur #mark-address': 'geocode',
    'click #save-zoom': 'savezoom'
    
  },
  savezoom: function(){
    var view = this;
    this.zoom = Mediakron.Status.CurrentMap.getZoom();
    this.center = Mediakron.Status.CurrentMap.getCenter();
    view.layer.data.zoom = this.zoom;
    view.layer.data.center = this.center;
    $('#edit-zoom').text(this.zoom);
    $('#edit-center').text(this.center.lat + ', ' + this.center.lng);
  },
  geocode: function(e){
    var address = $('#mark-address').val(),
        geocode = 'https://nominatim.openstreetmap.org/search/'+encodeURIComponent(address)+'?format=json', view = this;
    if(address !== ''){
      Mediakron.message({
          text: 'Attempting to locate that address',
          type: 'info',
          timeout: 3000,
          layout: 'bottom'
      });
      $.get(geocode, function(data){
        console.log(data);
        if(data){
          if(data.length > 0){
            if(data[0].lat){
              Mediakron.message({
                  text: 'Address has been located.',
                  type: 'success',
                  timeout: 3000,
                  layout: 'bottom'
              });
              $('#mark-latitude').val(data[0].lat);
              $('#mark-longitude').val(data[0].lon);
              view.drawPoint();
              view.layer.data.address = address;
            }
          }else{
            Mediakron.message({
                text: 'Sorry, We could not find the address you entered',
                type: 'danger',
                timeout: 3000,
                layout: 'bottom'
            });
          }
        }
      }).fail(function(){
        Mediakron.message({
            text: 'Sorry, We could not find the address you entered',
            type: 'danger',
            timeout: 3000,
            layout: 'bottom'
        });
      });
    }else{
      view.layer.data.address = '';
    }
  },
  cancel: function(e){
    if(!this.marker.options.editing) this.marker.options.editing = {};
    this.marker.editing.disable();
    Mediakron.Edit.cancelEdit(e);
  },
  drawPoint: function(){
    var lng = $('#mark-longitude').val(),
        lat = $('#mark-latitude').val();
    var newLatLng = new L.LatLng(lat, lng);
    this.marker.setLatLng(newLatLng); 
    this.map.panTo(newLatLng);
  },
  save: function(e) {
    
    var children =  this.map.model.getRelationship('layers'),
        count = children.length, i = 0, child, extract;
        
    if(this.changes){
      if(this.changes.uri){
        this.layer.uri = this.changes.uri;
      }
    }
    
    this.marker.editing.disable();
    var label = $('#simple-label').val();
    this.layer.data.label = label.replace(/'/g, '&#39;');
    
    if(this.map.model.get('template') == 'timemap'){
      var start = this.startWidget.validate(false),
        end = this.endWidget.validate('end');
      this.layer.data.start = start;
      this.layer.data.end = end;
    }
    
    this.layer.data.layer = this.filter;
    
    this.layer.data.zoom = this.zoom;
    this.layer.data.center = this.center;
      
    
    if(this.layer.data.type == 'point'){
      this.layer.data.coordinate = this.marker.getLatLng();
    }else{
      this.layer.data.coordinate = this.marker.getLatLngs();
    }

    for(i;i<count;i++){
      child = children[i];

      if(child.uri == this.oldURI){
        
        if(this.uri !== this.oldURI){
          extract = child;
          delete children[i];
          extract = {
            uri: this.oldURI,
            data: false,
            remove: true
          };
          
          if(extract.uri){
            children.push(extract);
          }else{
            this.nochild = true;
          }
          this.layer.data.nochild = this.nochild;
          children[i] = this.layer;
        }else{
          children[i] = this.layer;
        }
        
      }
    }
    this.map.model.setRelationship('layers',children);
    this.map.model.save({}, {
      'success': function(){
        Mediakron.Status.CurrentMap.removeMarkers();
        Mediakron.Status.CurrentMap.drawMarkers();
        
        Mediakron.App.Events.trigger('marker:edit');
      }
    });
    Mediakron.Status.formChanged = false;
    Mediakron.Edit.cancelEdit(e);
  },
  getContentBrowser: function() {
        $('.organize-marker').hide();
        $('#admin-link-content').show();
        var data, callback, view, lightbox, markerPane = this;
        data = {
            'context': false,
            'filters': false,
            'skip': markerPane.mapItem.skips(),
            'disabled':[
              "image", 
              "video",
              "story",
              "file",
              "audio",
              "narrative",
              "slideshow",
              "folder",
              "progression",
              "comparison",
              "map",
              "maptimeline",
              "timeline"
            ],
            'callback': function(item) {
                markerPane.changes.uri = item.get('uri');
                Mediakron.Status.formChanged = true;
                markerPane.item = item;
                markerPane.oldURI = markerPane.uri;
                markerPane.uri = markerPane.changes.uri;
                markerPane.nochild = false;
                markerPane.render();
                markerPane.afterRender();
                $('#admin-link-content').hide().empty();
                $('#organize-marker').show();
                $('#simple-label').val('');
                $('#map-label').addClass('hide');  
                Mediakron.ContentBrowser.filter.filter = false;
            },
            'cancelCallback': function(){
              $('#admin-link-content').hide().empty();
              $('.organize-marker').show();
              markerPane.render();
              markerPane.afterRender();
              Mediakron.ContentBrowser.filter.filter = false;
            }
        };
        view = new Mediakron.ContentBrowser.Selector(data);
        view.setElement('#admin-link-content');
        html = view.render();
        view.afterRender();
    },
    removeItem: function(){
      $('#selected-map').remove();
      $('.marker-content-options').removeClass('hide');
      this.oldURI = this.uri;
      this.uri = 'map-unassigned-'+ Math.floor(Math.random()*90000) + 10000;
      this.nochild = true;
      this.changes.uri = this.uri;
    },
    addLabel: function(){
      $('#map-label').removeClass('hide');
      $('.marker-content-options').addClass('hide');
    },
    removeLabel: function(){
      $('#simple-label').val('');
      $('#map-label').addClass('hide');
      $('.marker-content-options').removeClass('hide');
    },
    getLayerContentBrowser: function() {
        $('.organize-marker').hide();
        $('#admin-link-content').show();
        var data, callback, view, lightbox, markerPane = this;
        data = {
            'context': false,
            'filters': [ 'layer' ],
            'disabled':[ 'layer' ],
            'callback': function(filter) {
                markerPane.changes.filter = filter.get('uri');
                markerPane.filter = markerPane.changes.filter;
                Mediakron.Status.formChanged = true;
                markerPane.render();
                markerPane.afterRender();
                $('#admin-link-content').hide().empty();
                $('.organize-marker').show();
                Mediakron.ContentBrowser.filter.filter = false;
            },
            'cancelCallback': function(){
              $('#admin-link-content').hide().empty();
              $('.organize-marker').show();
              markerPane.render();
              markerPane.afterRender();
              Mediakron.ContentBrowser.filter.filter = false;
            }
        };
        view = new Mediakron.ContentBrowser.Selector(data);
        view.setElement('#admin-link-content');
        html = view.render();
        view.afterRender();
    },
    addLayer: function(){
      var view, data, callback, markerPane = this;
      data = {
        'type': 'layer',
        'callback': function(item){
          markerPane.changes.filter = item.get('uri');
          markerPane.filter = markerPane.changes.filter;
          Mediakron.Status.formChanged = true;
          markerPane.render();
          markerPane.afterRender();
          $('.add-layer').addClass('hide').empty();
          $('.organize-marker').removeClass('hide');
        }
      };
      view = new Mediakron.Admin.AddContentPage(data);
      view.setElement('.add-layer');
      $('.add-layer').removeClass('hide');
      $('.organize-marker').addClass('hide');
      view.render();
      view.afterRender();
    },
    showLayerEdit: function() {
      $('.layer-options, .layer-edit-button').removeClass('hide');
    },
    editLayer: function(){
      var layerItem = Mediakron.getItemFromURI(this.filter);
      var view, data, callback, markerPane = this;
      data = {
        'type': 'layer',
        'edit': true,
        'item': layerItem,
        'callback': function(item){
          markerPane.changes.filter = item.get('uri');
          markerPane.filter = markerPane.changes.filter;
          Mediakron.Status.formChanged = true;
          markerPane.render();
          markerPane.afterRender();
          $('.add-layer').addClass('hide').empty();
          $('.organize-marker').removeClass('hide');
        }
      };
      view = new Mediakron.Admin.AddContentPage(data);
      view.setElement('.add-layer');
      $('.add-layer').removeClass('hide');
      $('.organize-marker').addClass('hide');
      view.render();
      view.afterRender();
    },
    removeLayer: function() {
        $('#selected-layer').remove();
        $('.layer-options').removeClass('hide');
        $('.layer-edit-button').addClass('hide');
        this.changes.filter = false;
        this.filter = false;
        Mediakron.Status.formChanged = true;
    }
});
Mediakron.Admin.sequenceEditor = Backbone.View.extend({
    template: JST['settings.section.sequence.editor'],
    el: '#order-items',
    model: false,
    initialize: function(model) {
        this.model = model;
    },
    render: function() {
        $('#sequence-editor').remove();
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    },
    events: {}
});
Mediakron.Admin.AppearancePage = Mediakron.Extensions.View.extend({
    template: JST['settings.appearance'],
    changes: false,
    settings: false,
    initialize: function() {
        this.settings = Mediakron.Settings;
        this.changes = Mediakron.Settings;
    },
    render: function() {
        $(this.el).html(this.template());
        return this;
    },
    updateAppearance: function() {
        Mediakron.App.InitializeAppearance();
    },
    afterRender: function() {
        $('#site-skin').chosen();
        $('#select-font').chosen();
        var changes = this.changes;
        $('#link-color').spectrum({
            showPaletteOnly: true,
            hideAfterPaletteSelect: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'more',
            togglePaletteLessText: 'less',
            clickoutFiresChange: true,
            preferredFormat: "hex",
            showInput: true,
            palette: [
                ["#030303", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            change: function(color) {
                Mediakron.Status.formChanged = true;
                changes.Appearance.colors.links = color.toHexString();
            }
        });
        $('#banner-link-color').spectrum({
            showPaletteOnly: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'more',
            togglePaletteLessText: 'less',
            hideAfterPaletteSelect: true,
            preferredFormat: "hex",
            clickoutFiresChange: true,
            showInput: true,
            palette: [
                ["#030303", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            change: function(color) {
                Mediakron.Status.formChanged = true;
                changes.Appearance.colors.bannerlink = color.toHexString();
            }
        });
        $('#banner-color').spectrum({
            showPaletteOnly: true,
            hideAfterPaletteSelect: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'more',
            togglePaletteLessText: 'less',
            preferredFormat: "hex",
            clickoutFiresChange: true,
            showInput: true,
            palette: [
                ["#030303", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            change: function(color) {
                Mediakron.Status.formChanged = true;
                changes.Appearance.colors.banner = color.toHexString();
            }
        });
    },
    events: {
        'click a': Mediakron.linkHandle,
        'change #select-font': 'fonts',
        'change #site-skin': 'skin',
        'click #done-editing': Mediakron.Edit.saveSettingsForm,
        'click #cancel-editing': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'blur .settings-field': 'bindSettings',
        'change .navigation-select': 'navigation',
        'change #image-file': "logo",
        'click #remove-image': "removeFile",
        'click #upload-image': "triggerImage",
        'change #institional-file': "institionalLogo",
        'click #remove-institional': "removeInstitional",
        'click #upload-institional': "triggerInstitional",
        'click .menu-options-container input': "navigation"
    },
    removeFile: function(e) {
        e.preventDefault();
        $('#remove-image').addClass('hide');
        $('.edit-thumbnail').empty();
        $('#upload-image').html('<span class="mk-icon mk-upload"> </span> Upload Image'); /* restore upload button text */
        this.changes.Appearance.logo = '';
        Mediakron.Status.formChanged = true;
        return false;
    },
    triggerImage: function(e) {
        e.preventDefault();
        $('#image-file').click();
        return false;
    },
    removeInstitional: function(e) {
        e.preventDefault();
        $('#remove-institional').addClass('hide');
        $('.institional-thumbnail').empty();
        this.changes.Appearance.institutional = '';
        Mediakron.Status.formChanged = true;
        return false;
    },
    triggerInstitional: function(e) {
        e.preventDefault();
        $('#institional-file').click();
        return false;
    },
    navigation: function(e) {
        var val = $('.menu-options-container input:checked').val();
        this.changes.Appearance.navigation = val;
    },
    bindSettings: function(e) {
        var val = $(e.currentTarget).val(),
            property = $(e.currentTarget).attr('settings-attr');
        this.changes[property] = val;
        Mediakron.Status.formChanged = true;
    },
    skin: function(e) {
        var val = $(e.currentTarget).val(),
            skin = Mediakron.skins[val];
        if (skin) {
            this.changes.Appearance.skin = val;
            this.changes.Appearance.colors.links = skin.links;
            $("#link-color").spectrum("set", skin.links);
            this.changes.Appearance.colors.banner = skin.banner;
            $("#banner-color").spectrum("set", skin.banner);
            this.changes.Appearance.colors.bannerlink = skin.bannerlink;
            $("#banner-link-color").spectrum("set", skin.bannerlink);
        }
        Mediakron.Status.formChanged = true;
    },
    logo: function(e) {
        var upload = Mediakron.Edit.fileUpload(e, $('.site-logo')),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            changes.Appearance.logo = response.file;
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    institionalLogo: function(e) {
        var upload = Mediakron.Edit.fileUpload(e, $('.institutional-logo')),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            changes.Appearance.institutional = response.file;
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    fonts: function(e) {
        var val = $(e.currentTarget).val();
        this.changes.Appearance.font = val;
    }
});
Mediakron.Admin.HomePage = Mediakron.Extensions.View.extend({
    template: JST['settings.homepage'],
    changes: false,
    settings: false,
    initialize: function() {
        this.settings = Mediakron.Settings;
        this.changes = Mediakron.Settings;
    },
    render: function() {
        var template = JST['settings.section.wysiwyg'],
            html = template(),
            content = {
                wysiwyg: html
            };
        this.$el.html(this.template(content));
        this.$el.append('<div id="admin-link-content" />');
        return this;
    },
    updateAppearance: function() {
        Mediakron.App.InitializeAppearance();
    },
    afterRender: function() {
        var changes = this.changes;
    },
    events: {
        'click a.link-to-settings': Mediakron.linkHandle,
        'click #done-editing': Mediakron.Edit.saveSettingsForm,
        'click #cancel-editing': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'blur #description': 'description',
        'blur #alt': 'alt',
        'blur #site-name': 'name',
        'blur #site-subtitle': 'subtitle',
        'change #image-file': "addFile",
        'change .homepage-layout': "layout",
        'click #homepage-add-content': "getContentBrowser",
        'click #homepage-remove-item': "removeHome",
        // wysiwyg
        'mousedown .wysiwyg-button': Mediakron.Wysiwyg.apply,
        'mousedown .enable-wysiwyg': "bindWysiwygListner",
        'mouseup .enable-wysiwyg': "openWysiwyg",
        'keyup .enable-wysiwyg': "openWysiwyg",
        'paste .enable-wysiwyg': "cleanPaste",
        'blur .enable-wysiwyg': "blurWysiwyg",
        'focus .enable-wysiwyg': "focusWysiwyg",
        'click #remove-image': "removeFile",
        'click #upload-image': "triggerImage",
        'click .wlink-internal': 'showWysiwgyInternal',
        
    },
    showWysiwgyInternal: function() {
        var data, callback, navView = this;
        $('#linkbrowser-contents').scrollTop(0);
        data = {
            'context': false,
            'el': '#linkbrowser-contents',
            'callback': function(menu) {
                navView.restoreRange();
                var selection = window.getSelection(),
                    oRange = selection.getRangeAt(0),
                    ancestor = $(oRange.commonAncestorContainer),
                    parentEditor = ancestor.closest("div[contenteditable='true']");
                document.execCommand('createLink', false, basepath + menu.get('uri'));
                Mediakron.controller.closeLinkBrowser();
                $('.normal-wysiwyg').removeClass('hide');
                $('.wlink-tool').addClass('hide');
                if (findinselection('a', parentEditor[0])) {
                    $('.wysiwyg-link').addClass('hide');
                    $('.wysiwyg-unlink').removeClass('hide');
                } else {
                    $('.wysiwyg-link').removeClass('hide');
                    $('.wysiwyg-unlink').addClass('hide');
                }
            },
            'cancelCallback': function() {
                navView.restoreRange();
                Mediakron.controller.closeLinkBrowser();
                $('.normal-wysiwyg').removeClass('hide');
                $('.wlink-tool').addClass('hide');
            }
        };
        Mediakron.controller.openLinkBrowser();
        view = new Mediakron.ContentBrowser.LinkSelector(data);
        html = view.render();
        view.afterRender();
    },
    removeFile: function(e) {
        e.preventDefault();
        $('#remove-image').addClass('hide');
        $('#upload-image').html('<span class="mk-icon mk-upload"> </span> Upload Image'); /* restore upload button text */
        $('#alt').addClass('hide');
        $('.edit-thumbnail').empty();
        this.changes.HomePage.image = '';
        Mediakron.Status.formChanged = true;
        return false;
    },
    triggerImage: function(e) {
        e.preventDefault();
        $('#image-file').click();
        return false;
    },
    cleanPaste: function(e) {
        var target = $(e.currentTarget);
        target.attr('disabled', true);
        setTimeout(function() {
            html = Mediakron.cleanHTML(target.html());
            target.html(html);
            target.attr('disabled', false);
        }, 20);
    },
    blurWysiwyg: function(e) {
        var target = $(e.currentTarget),
            text = target.text(),
            placeholder = target.attr('data-placeholder');
        if (text === '') {
            target.html('');
        }
    },
    focusWysiwyg: function(e) {
        var target = $(e.currentTarget),
            text = target.text(),
            placeholder = target.attr('data-placeholder');
        this.focusElement = target;
        if (text == placeholder || text === '') {
            target.html('<p></p>');
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart(target.children()[0], 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    },
    range: false,
    selection: false,
    restoreRange: function() {
        this.focusElement.focus();
        if (this.range) {
            if (window.getSelection()) {
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(this.range);
                this.range = false;
            } else if (document.selection && this.range.select) {
                this.range.select();
                this.range = false;
            }
        }
    },
    getSelectionStartNode: function() {},
    bindWysiwygListner: function(e) {
        var target = $(e.currentTarget),
            form = this;
        $('body').one('mouseup', function(event) {
            form.openWysiwyg(e);
        });
    },
    openWysiwyg: function(e) {
        // this might work!
        if (e.keyCode == '13') {
            if (!e.shiftKey) {
                document.execCommand('formatBlock', false, 'p');
            }
        }
        var selection = window.getSelection(),
            oRange = selection.getRangeAt(0),
            ancestor = $(oRange.commonAncestorContainer),
            parentEditor = ancestor.closest("div[contenteditable='true']"),
            text = selection.toString();
        if (text.length > 0) {
            this.range = oRange.cloneRange();
            this.selection = selection;
            Mediakron.Wysiwyg.showBubble(e.currentTarget);
            var $node = $(this.getSelectionStartNode());
            if (ancestor.closest('blockquote').length > 0) {
                $('.wysiwyg-indent').addClass('hide');
                $('.wysiwyg-outdent').removeClass('hide');
            } else {
                $('.wysiwyg-indent').removeClass('hide');
                $('.wysiwyg-outdent').addClass('hide');
            }
            if (findinselection('a', parentEditor[0])) {
                $('.wysiwyg-link').addClass('hide');
                $('.wysiwyg-unlink').removeClass('hide');
            } else {
                $('.wysiwyg-link').removeClass('hide');
                $('.wysiwyg-unlink').addClass('hide');
            }
        } else {
            $('.wysiwyg').hide();
        }
    },
    description: function(e) {
        var val = $(e.currentTarget).html(),
            text = $(e.currentTarget).text();
        if (text === '') val = '';
        this.changes.HomePage.description = val;
        Mediakron.Status.formChanged = true;
    },
    alt: function(e) {
        var val = $(e.currentTarget).val();
        this.changes.HomePage.alt = val;
        Mediakron.Status.formChanged = true;
    },
    name: function(e) {
        var val = $(e.currentTarget).val();
        this.changes.Settings.name = val;
        Mediakron.Status.formChanged = true;
    },
    subtitle: function(e) {
        var val = $(e.currentTarget).val();
        this.changes.Settings.subtitle = val;
        Mediakron.Status.formChanged = true;
    },
    layout: function(e) {
        var val = $(e.currentTarget).val();
        this.changes.HomePage.layout = val;
        Mediakron.Status.formChanged = true;
    },
    addFile: function(e) {
        var upload = Mediakron.Edit.fileUpload(e),
            changes = this.changes,
            model = this.model;
        upload.done(function(response) {
            changes.HomePage.image = response.file;
            $('#remove-image').removeClass('hide');
            $('#upload-image').html('<span class="mk-icon mk-upload"> </span> Upload Image'); /* restore upload button text */
            $('#alt').removeClass('hide');
            Mediakron.Status.formChanged = true;
        }).fail(function(response) {
            // yarg failed. TODO FIGURE OUT FAILURE
        });
    },
    getContentBrowser: function() {
        $('#admin-homepage').hide();
        $('#admin-link-content').show();
        var data, callback, view, lightbox, homePage = this;
        data = {
            'context': false,
            'callback': function(menu) {
                homePage.changes.HomePage.item = menu.get('uri');
                Mediakron.Status.formChanged = true;
                homePage.render();
                $('#admin-link-content').hide().empty();
                $('#admin-homepage').show();
            }
        };
        view = new Mediakron.ContentBrowser.Selector(data);
        view.setElement('#admin-link-content');
        html = view.render();
        view.afterRender();
    },
    removeHome: function() {
        this.changes.HomePage.item = false;
        Mediakron.Status.formChanged = true;
        this.render();
    }
});
Mediakron.Admin.ExportPage = Mediakron.Extensions.View.extend({
    template: JST['settings.export'],
    initialize: function() {},
    render: function() {
        $(this.el).html(this.template());
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle
    }
});
Mediakron.Admin.StatisticsPage = Mediakron.Extensions.View.extend({
    template: JST['settings.statistics'],
    rows: JST['settings.statistics.tbody'],
    statistics: false,
    tbody: false,
    attr: false,
    initialize: function() {},
    render: function() {
        var view = this;
        view.$el.html(view.template());
        view.tbody = $('tbody', view.$el);
        $.getJSON(Mediakron.Data.stats, function(data) {
            view.statistics = data.users;
            view.tbody.append(view.rows({
                users: data.users
            }));
            require(["datatables"], function(plugin) {
                $('#admin-site-settings table').dataTable({
                    paginate: false
                });
            });
        });
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit
    }
});
Mediakron.Admin.ActivityPage = Mediakron.Extensions.View.extend({
    template: JST['settings.activity'],
    rows: JST['settings.statistics.tbody'],
    statistics: false,
    tbody: false,
    attr: false,
    initialize: function() {},
    render: function() {
        var view = this;
        view.$el.html(view.template());
        view.tbody = $('tbody', view.$el);
        $.getJSON(Mediakron.Data.stats, function(data) {
            view.statistics = data.users;
            view.tbody.append(view.rows({
                users: data.users
            }));
        });
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click .sort': 'sort'
    },
    sort: function(e) {
        var attr = $(e.currentTarget).attr('sort'),
            dir = $(e.currentTarget).attr('dir');
        this.attr = attr;
        if (!dir) dir = 'desc';
        if (dir == 'asc') {
            dir = 'desc';
        } else if (dir == 'desc') {
            dir = 'asc';
        }
        $(e.currentTarget).attr('dir', dir).removeClass('sort-asc sort-desc').addClass('sort-' + dir);
        this.tbody.empty();
        var data;
        if (dir == 'asc') {
            data = this.statistics.sort(

            function(a, b) {
                if (a[attr] < b[attr]) return -1;
                if (a[attr] > b[attr]) return 1;
                return 0;
            });
        } else {
            data = this.statistics.sort(

            function(a, b) {
                if (a[attr] > b[attr]) return -1;
                if (a[attr] < b[attr]) return 1;
                return 0;
            });
        }
        this.tbody.append(this.rows({
            users: data
        }));
    }
});
Mediakron.Admin.Poll = Mediakron.Extensions.View.extend({
    el: '#poll',
    template: JST['settings.poll'],
    initialize: function() {
        if (!Mediakron.Status.lastPoll) {
            Mediakron.Status.lastPoll = 1;
        }
        this.updated = Mediakron.items.filter(function(item){
          return item.changedSince();
        });
        this.created = Mediakron.items.filter(function(item){
          return item.newSince();
        });
    },
    render: function() {
        var view = this;
        setInterval(function() {
            view.poll();
        }, 10000);
        return this;
    },
    afterRender: function() {},
    events: {
        "mouseover #status-indicator": "show",
        "mouseout #status-indicator": "hide",
    },
    show: function() {
        $('#current-editors').removeClass('hide');
    },
    hide: function() {
        $('#current-editors').addClass('hide');
    },
    poll: function() {
        if (!Mediakron.DontPoll) {
            var view = this;
            $.ajax({
                dataType: "json",
                url: Mediakron.Data.poll + '/' + Mediakron.Status.lastPoll + Mediakron.Status.PollQuery,
                success: function(data) {
                    Mediakron.Status.lastPoll = data.time;
                    Mediakron.Status.currentEditors = data.users;
                    Mediakron.Status.currentEditing = data.editing;
                    Mediakron.Status.online = true;
                    var toUpdate;
                    _.each(data.items, function(item) {
                        toUpdate = Mediakron.items.get(item.id);
                        if(toUpdate){
                          if (item.version != toUpdate.get('version')) {
                            toUpdate.set(item);
                            Mediakron.App.Events.trigger('update_content', {});
                          }
                        }else{
                          var model = new Mediakron.Models.Item(item);
                          model.addToCollection();
                          Mediakron.createUrlMap();
                          Mediakron.App.Events.trigger('new_content', {});
                          Mediakron.App.Events.trigger('update_content', {});
                        }
                        
                    });
                    view.$el.html(view.template(data));
                    Mediakron.App.Events.trigger('poll', {});
                    if (Mediakron.Settings.version != data.mediakron_version) {
                        Mediakron.message({
                            text: '<strong>There are some updates to MediaKron.</strong> Please save your work and click <a href="javascript:void window.location.reload()">here</a> to load the new features',
                            type: 'danger',
                            timeout: 0,
                            dismiss: true,
                            layout: 'top'
                        });
                    }
                },
/* Hiding until we have a way to remove message when internet connection has been reestablished */
//                error: function() {
//                    Mediakron.Status.online = false;
//                    Mediakron.message({
//                        text: '<strong>There appears to be a connection issue.</strong> Please check to be sure you are connected to internet.',
//                        type: 'danger',
//                        timeout: 0,
//                        dismiss: true,
//                        layout: 'top'
//                    });
//                }
            });
        }
    }
});
Mediakron.Admin.Revisions = Mediakron.Extensions.View.extend({
    template: JST['settings.revisions'],
    rows: JST['settings.revisions.tbody'],
    statistics: false,
    tbody: false,
    attr: false,
    item: false,
    initialize: function(data) {
        this.item = data.item;
    },
    render: function() {
        var view = this;
        view.$el.html(view.template());
        view.tbody = $('tbody', view.$el);
        $.getJSON(Mediakron.Data.revisions + '/' + this.item.get('uri'), function(data) {
            var bind = $('#rev-preview');
            data.reverse();
            var revisions = {},
                rev;
            for (var i = 0; i < data.length; i++) {
                rev = data[i];
                revisions[rev.version] = rev.document;
            }
            view.tbody.append(view.rows({
                revisions: data
            }));
            $('.preview-rev', view.tbody).click(function(e) {
                e.preventDefault();
                var target = $(e.currentTarget),
                    version = target.attr('revision'),
                    document = revisions[version],
                    obj = JSON.parse(document),
                    model = new Mediakron.Models.Item(obj),
                    thisview = model.getView();
                view.restoremodel = obj;
                $('.rev-preview-window').removeClass('hide');
                $('#rev-preview').empty();
                thisview.setElement('#rev-preview');
                thisview.render();
                thisview.afterRender();
                return false;
            });
            $('.revert-rev', view.tbody).click(function(e) {
                e.preventDefault();
                var target = $(e.currentTarget),
                    version = target.attr('revision'),
                    document = revisions[version],
                    obj = JSON.parse(document);
                delete obj.uri;
                view.item.set(obj);
                view.item.save();
                Mediakron.message({
                    text: 'Reverted to revision',
                    type: 'success',
                    timeout: 4000,
                    layout: 'bottom'
                });
                Mediakron.router.navigate(view.item.get('uri'), {
                    trigger: true
                });
                return false;
            });
            $('.rev-preview-close').click(function() {
                $('.rev-preview-window').addClass('hide');
            });
        });
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #cancel-editing': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click .rev-preview-revert': 'triggerRevert'
    },
    triggerRevert: function() {
        uri = this.item.get('uri');
        var obj = this.restoremodel;
        delete obj.uri;
        this.item.set(obj);
        this.item.save();
        Mediakron.message({
            text: 'Reverted to revision',
            type: 'success',
            timeout: 4000,
            layout: 'bottom'
        });
        Mediakron.router.navigate(uri, {
            trigger: true
        });
    }
});

Mediakron.Admin.Trashcan = Mediakron.Extensions.View.extend({
    template: JST['settings.trash'],
    initialize: function(data) { 
      console.log(data);
      this.data = data.trash;
    },
    render: function() {
        var view = this;
        console.log(this.data);
        view.$el.html(view.template({
          trash: this.data
        }));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #cancel-editing': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click .restore': 'restore'
    },
    restore: function(e) {
        Mediakron.message({
            text: 'Restoring item',
            type: 'success',
            timeout: 4000,
            layout: 'bottom'
        });
        var uri = $(e.currentTarget).attr('uri');
        $.ajax({
          url: Mediakron.Data.models.items + '/' + uri + '?trash=1',
          type: 'PUT',
          success: function(data) {
            Mediakron.router.navigate('browse', {
                trigger: true
            });
            window.location.reload();
          }
        });
    }
});
Mediakron.Admin.Transmit = Mediakron.Extensions.View.extend({
    template: JST['settings.transmit'],
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
Mediakron.Admin.AddPage = Mediakron.Extensions.View.extend({
    template: JST['settings.add'],
    initialize: function() {},
    render: function() {
        $(this.el).html(this.template());
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit
    }
});

Mediakron.Admin.InlineAddPage = Mediakron.Admin.AddPage.extend({
    template: JST['settings.add'],
    initialize: function(data) {
      
    },
    render: function() {
        $(this.el).html(this.template({ 
          inline: true,
          allowed: []
        }));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': 'internalHandle',
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit
    },
    internalHandle: function(event){
      //var $(event.currentTarget)
    }
});
Mediakron.Admin.SettingsPage = Mediakron.Extensions.View.extend({
    template: JST['settings.settings'],
    initialize: function() {},
    render: function() {
        $(this.el).html(this.template());
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click #cancel-editing': Mediakron.Edit.cancelEdit
    }
});
Mediakron.Admin.UsersRow = Mediakron.Extensions.View.extend({
    template: JST['settings.user.row'],
    tagName: 'tr',
    initialize: function(data) {
        this.user = data.user;
    },
    render: function() {
        var content = this.user.toJSON();
        content.user = this.user;
        this.$el.html(this.template(content));
        $('.user-table tbody').append(this.$el);
        $('.user-table select').chosen({
            allow_single_deselect: true,
            disable_search: true
        });
        return this;
    },
    events: {
        'change .change-role': 'promoteUser',
        'click .remove-user': 'removeUser',
        'change .activatebc': 'toggleLdap',
    },
    toggleLdap: function(e) {
        var user = this.user,
            view = this,
            target = $(e.currentTarget),
            checked = target.prop('checked');

        $.ajax({
            'url': Mediakron.Data.models.user,
            'type': 'post',
            'data': JSON.stringify({
                username: user.get('username'),
                role: user.get('role'),
                ldap: checked
            }),
            'success': function(data) {
                Mediakron.messages.message('User updated', 'success', 5000, 'bottom');
            },
            'dataType': 'json'
        });
    },
    promoteUser: function(e) {
        var target = $(e.currentTarget),
            role = target.val(),
            id = target.attr('user'),
            user = Mediakron.users.get(id),
            username = false;
        if (user) {
            username = user.get('email');
        }
        $.ajax({
            'url': Mediakron.Data.models.user,
            'type': 'post',
            'data': JSON.stringify({
                username: username,
                role: role
            }),
            'success': function(data) {
                Mediakron.messages.message('User role saved', 'success', 5000, 'bottom');
            },
            'dataType': 'json'
        });
    },
    removeUser: function(e) {
        var target = $(e.currentTarget),
            role = target.val(),
            id = target.attr('user'),
            user = Mediakron.users.get(id),
            username = false,
            view = this;
        if (user) {
            username = user.get('name');
        }
        $.ajax({
            'url': Mediakron.Data.models.user + '/' + user.get('id'),
            'type': 'delete',
            'success': function(data) {
                Mediakron.messages.message('User removed from site', 'success', 5000, 'bottom');
                view.remove();
            },
            'dataType': 'json'
        });
    }
});
Mediakron.Admin.GroupRow = Mediakron.Extensions.View.extend({
    template: JST['settings.group.row'],
    tagName: 'tr',
    initialize: function(data) {
        this.group = data.group;
    },
    render: function() {
        var content = this.group.toJSON();
        content.group = this.group;
        this.$el.html(this.template(content));
        $('.groups-table tbody').append(this.$el);
        $('.groups-table select').chosen({
            allow_single_deselect: true,
            disable_search: true
        });
        return this;
    },
    events: {
        'change .change-role': 'promoteGroup',
        'click .remove-group': 'removeGroup'
    },
    promoteGroup: function(e) {
        var target = $(e.currentTarget),
            role = target.val(),
            id = target.attr('group'),
            group = Mediakron.groups.get(id),
            username = false;
        if (group) {
            groupname = group.get('name');
        }
        $.ajax({
            'url': Mediakron.Data.models.group,
            'type': 'post',
            'data': JSON.stringify({
                group: groupname,
                role: role
            }),
            'success': function(data) {
                Mediakron.messages.message('Group role saved', 'success', 5000, 'bottom');
            },
            'dataType': 'json'
        });
    },
    removeGroup: function(e) {
        var target = $(e.currentTarget),
            role = target.val(),
            id = target.attr('group'),
            group = Mediakron.groups.get(id),
            username = false,
            view = this;
        if (group) {
            groupname = group.get('name');
        }
        $.ajax({
            'url': Mediakron.Data.models.group + '/' + group.get('id'),
            'type': 'delete',
            'success': function(data) {
                Mediakron.messages.message('Group removed from site', 'success', 5000, 'bottom');
                view.remove();
            },
            'dataType': 'json'
        });
    }
});
Mediakron.Admin.UsersPage = Mediakron.Extensions.View.extend({
    template: JST['settings.users'],
    initialize: function() {
        var view = this;
        Mediakron.users.fetch({
            success: function(collection, data) {
                Mediakron.groups.fetch({
                    success: function(collection, data) {
                        view.whenReady();
                    }
                });
            }
        });
    },
    render: function() {
        $(this.el).html(this.template());
        return this;
    },
    afterRender: function() {
        $('#manage-users select').chosen({
            allow_single_deselect: true,
            disable_search: true
        });
    },
    whenReady: function() {
        var row;
        $('.groups-table tbody').empty();
        $('.user-table tbody').empty();
        Mediakron.users.each(function(user) {
            row = new Mediakron.Admin.UsersRow({
                user: user
            });
            row.render();
        });
        Mediakron.groups.each(function(group) {
            row = new Mediakron.Admin.GroupRow({
                group: group
            });
            row.render();
        });
    },
    events: {
        'click a': Mediakron.linkHandle,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click .overlay-bg': Mediakron.Edit.cancelEdit,
        'click .tab-link': 'tab',
        'click #btn-add-new-user': 'addUsers',
        'click #btn-add-group': 'addGroup',
        'click .expander-trigger': 'expand'
    },
    expand: function(e) {
        $(e.currentTarget).toggleClass("expander-hidden");
        $('.expander .chosen-container-single-nosearch').css('width,7em');
    },
    addGroup: function() {
        var group = $('#group-id').val(),
            role = $('#group-role').val(),
            view = this;
        $.ajax({
            'url': Mediakron.Data.models.group,
            'type': 'post',
            'data': JSON.stringify({
                group: group,
                role: role
            }),
            'success': function(data) {
                Mediakron.messages.message('Group Saved', 'success', 5000, 'bottom');
                Mediakron.groups.fetch({
                    success: function() {
                        view.whenReady();
                        $('#group-id').val('');
                    }
                });
            },
            'dataType': 'json'
        });
    },
    addUsers: function() {
        var userlist = $('#addUsers').val().split("\n"),
            count = userlist.length,
            u = 0,
            users = [],
            role = $('#addUsersRole').val(),
            saved = 0,
            view = this,
            errored = false,
            username;
        var success = function(data) {
                saved++;
            };
        var fail = function(data) {
                saved++;
                errored = true;
                Mediakron.messages.message(username + " might not be a valid bc user email. Please use the form bcuserid@bc.edu", 'success', 10000, 'bottom');
            };
        for (u; u < count; u++) {
            username = userlist[u];
            $.ajax({
                'url': Mediakron.Data.models.user,
                'type': 'post',
                'data': JSON.stringify({
                    username: username,
                    role: role
                }),
                'success': success,
                'dataType': 'json'
            }).fail(fail);
        }
        var check = setInterval(function() {
            if (saved == count) {
                if (!errored) {
                    Mediakron.messages.message('All users saved', 'success', 5000, 'bottom');
                    Mediakron.users.fetch({
                        success: function() {
                            view.whenReady();
                            $('#addUsers').val('');
                        }
                    });
                } else {
                    Mediakron.messages.message('We encountered an error.  Please check the email addresses', 'warning', 10000, 'bottom');
                }
                clearInterval(check);
            }
        }, 100);
    },
    tab: function(e) {
        e.preventDefault();
        var target = $(e.currentTarget),
            open = $('.tab-content.is-open'),
            closed = $('.tab-content:not(.is-open)');
        if (target.hasClass('is-active')) {} else {
            open.removeClass('is-open').hide();
            closed.addClass('is-open').show();
            $('.tab-link.is-active').removeClass('is-active');
            target.addClass('is-active');
        }
        return false;
    },
});

Mediakron.Admin.CommentsPage = Mediakron.Extensions.View.extend({
    template: JST['settings.comments'],
    initialize: function() {},
    changes: {},
    render: function() {
        this.changes = Mediakron.Settings;
        $(this.el).html(this.template());
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click #done-editing': Mediakron.Edit.saveSettingsForm,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'blur .settings-field': "bindSettings",
        'change .settings-field': "bindSettings",
        'change .toggle-field': "bindToggleSettings"
    },
    bindSettings: function (e) {

        var val = $(e.currentTarget).val(),
            property = $(e.currentTarget).attr('settings-attr'),
            checked = $(e.currentTarget).is(':checked');
        if (val == 'true') {
            val = true;
        }
        if (val == 'false') {
            val = false;
        }
        this.changes[property] = val;
        Mediakron.Status.formChanged = true;
    },
    bindToggleSettings: function (e) {
        var property = $(e.currentTarget).attr('settings-attr'),
            checked = $(e.currentTarget).is(':checked');
        this.changes[property] = checked;
        Mediakron.Status.formChanged = true;
    }
});

Mediakron.Admin.PrivacyPage = Mediakron.Extensions.View.extend({
    template: JST['settings.privacy'],
    initialize: function(type) {
        if (!this.changes) {
            this.changes = Mediakron.Settings;
        }
    },
    render: function() {
        var content = {};
        $(this.el).html(this.template(content));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click #done-editing': Mediakron.Edit.saveSettingsForm,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'blur .settings-field': "bindSettings",
        'change .settings-field': "bindSettings",
        'change .toggle-field': "bindToggleSettings"
    },
    bindSettings: function(e) {
        var val = $(e.currentTarget).val(),
            property = $(e.currentTarget).attr('settings-attr'),
            checked = $(e.currentTarget).is(':checked');
        if (val == 'true') {
            val = true;
        }
        if (val == 'false') {
            val = false;
        }
        this.changes[property] = val;
        Mediakron.Status.formChanged = true;
    },
    bindToggleSettings: function(e) {
        var property = $(e.currentTarget).attr('settings-attr'),
            checked = $(e.currentTarget).is(':checked');
        this.changes[property] = checked;
        Mediakron.Status.formChanged = true;
    }
});

Mediakron.Admin.GoogleAnalyticsPage = Mediakron.Extensions.View.extend({
    template: JST['settings.googleanalytics'],
    type: false,
    changes: false,
    initialize: function(type) {
        if (!this.changes) {
            this.changes = Mediakron.Settings;
        }
    },
    render: function() {
        var content = {};
        $(this.el).html(this.template(content));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click #done-editing': Mediakron.Edit.saveSettingsForm,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'blur .settings-field': "bindSettings",
        'change .settings-field': "bindSettings",
        'change .toggle-field': "bindToggleSettings"
    },
    bindSettings: function(e) {
        var val = $(e.currentTarget).val(),
            property = $(e.currentTarget).attr('settings-attr'),
            checked = $(e.currentTarget).is(':checked');
        if (val == 'true') {
            val = true;
        }
        if (val == 'false') {
            val = false;
        }
        this.changes[property] = val;
        Mediakron.Status.formChanged = true;
    },
    bindToggleSettings: function(e) {
        var property = $(e.currentTarget).attr('settings-attr'),
            checked = $(e.currentTarget).is(':checked');
        this.changes[property] = checked;
        Mediakron.Status.formChanged = true;
    }
});

Mediakron.Admin.ItemOptionsPage = Mediakron.Extensions.View.extend({
    template: JST['settings.itemoptions'],
    type: false,
    changes: false,
    initialize: function(type) {
        if (!this.changes) {
            this.changes = Mediakron.Settings;
        }
    },
    render: function() {
        var content = {};
        $(this.el).html(this.template(content));
        return this;
    },
    afterRender: function() {},
    events: {
        'click a': Mediakron.linkHandle,
        'click #done-editing': Mediakron.Edit.saveSettingsForm,
        'click .close-button': Mediakron.Edit.cancelEdit,
        'click #close-settings-context': Mediakron.Edit.cancelEdit,
        'blur .settings-field': "bindSettings",
        'change .settings-field': "bindSettings",
        'change .toggle-field': "bindToggleSettings"
      },
      bindSettings: function(e) {
          var val = $(e.currentTarget).val(),
              property = $(e.currentTarget).attr('settings-attr'),
              checked = $(e.currentTarget).is(':checked');
          if (val == 'true') {
              val = true;
          }
          if (val == 'false') {
              val = false;
          }
          this.changes[property] = val;
          Mediakron.Status.formChanged = true;
      },
      bindToggleSettings: function(e) {
          var property = $(e.currentTarget).attr('settings-attr'),
              checked = $(e.currentTarget).is(':checked');
          this.changes[property] = checked;
          Mediakron.Status.formChanged = true;
      } 
});