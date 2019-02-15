import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";
import tpl  from "./marker.html";

var view = false;

export default class MapMarkerEdit extends MediakronView {

    /**
     * The constructor for the backbone class
     * @param {object} options
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'MapMarkerEdit',
            data: false,
            item: false,
        })
        this.data = {};
            if (!this.changes) {
                this.changes = Mediakron.Settings;
            }
        view = this;
    }

    // Cast the html template
    get template() {
        return _.template(tpl);
    }

    /**
     *
     * @param {object} data
     */
    initialize(data) {
        return this;
    }

    /**
     * Render the view
     */
    render() {
        this.$el.html(this.template(this.data)).addClass(this.className);
        return this;
    }

    get events() {
        return {
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
        }
    }

    afterrender() {

    }

    savezoom(){
      var view = this;
      this.zoom = Mediakron.Status.CurrentMap.getZoom();
      this.center = Mediakron.Status.CurrentMap.getCenter();
      view.layer.data.zoom = this.zoom;
      view.layer.data.center = this.center;
      $('#edit-zoom').text(this.zoom);
      $('#edit-center').text(this.center.lat + ', ' + this.center.lng);
    },
    geocode(e){
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
    cancel(e){
      if(!this.marker.options.editing) this.marker.options.editing = {};
      this.marker.editing.disable();
      Mediakron.Edit.cancelEdit(e);
    },
    drawPoint(){
      var lng = $('#mark-longitude').val(),
          lat = $('#mark-latitude').val();
      var newLatLng = new L.LatLng(lat, lng);
      this.marker.setLatLng(newLatLng);
      this.map.panTo(newLatLng);
    },
    save(e) {

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
        'success'(){
          Mediakron.Status.CurrentMap.removeMarkers();
          Mediakron.Status.CurrentMap.drawMarkers();

          Mediakron.App.Events.trigger('marker:edit');
        }
      });
      Mediakron.Status.formChanged = false;
      Mediakron.Edit.cancelEdit(e);
    },
    getContentBrowser() {
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
              'callback'(item) {
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
              'cancelCallback'(){
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
      removeItem(){
        $('#selected-map').remove();
        $('.marker-content-options').removeClass('hide');
        this.oldURI = this.uri;
        this.uri = 'map-unassigned-'+ Math.floor(Math.random()*90000) + 10000;
        this.nochild = true;
        this.changes.uri = this.uri;
      },
      addLabel(){
        $('#map-label').removeClass('hide');
        $('.marker-content-options').addClass('hide');
      },
      removeLabel(){
        $('#simple-label').val('');
        $('#map-label').addClass('hide');
        $('.marker-content-options').removeClass('hide');
      },
      getLayerContentBrowser() {
          $('.organize-marker').hide();
          $('#admin-link-content').show();
          var data, callback, view, lightbox, markerPane = this;
          data = {
              'context': false,
              'filters': [ 'layer' ],
              'disabled':[ 'layer' ],
              'callback'(filter) {
                  markerPane.changes.filter = filter.get('uri');
                  markerPane.filter = markerPane.changes.filter;
                  Mediakron.Status.formChanged = true;
                  markerPane.render();
                  markerPane.afterRender();
                  $('#admin-link-content').hide().empty();
                  $('.organize-marker').show();
                  Mediakron.ContentBrowser.filter.filter = false;
              },
              'cancelCallback'(){
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
      addLayer(){
        var view, data, callback, markerPane = this;
        data = {
          'type': 'layer',
          'callback'(item){
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
      showLayerEdit() {
        $('.layer-options, .layer-edit-button').removeClass('hide');
      },
      editLayer(){
        var layerItem = Mediakron.getItemFromURI(this.filter);
        var view, data, callback, markerPane = this;
        data = {
          'type': 'layer',
          'edit': true,
          'item': layerItem,
          'callback'(item){
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
      removeLayer() {
          $('#selected-layer').remove();
          $('.layer-options').removeClass('hide');
          $('.layer-edit-button').addClass('hide');
          this.changes.filter = false;
          this.filter = false;
          Mediakron.Status.formChanged = true;
      }
}

// @REVIEW then, delete. Original view below

// Marker Management
// Mediakron.Admin.Marker = Mediakron.Extensions.View.extend({
//     template: JST['settings.map.marker'],
//     type: false,
//     map: false,
//     item: false,
//     uri: false,
//     latitude: '',
//     longitude: '',
//     isItem: false,
//     changes: {},
//     startWidget: false,
//     endWidget: false,
//     filter: false,
//     zoom: 0,
//     center: { lat: false, lon: false },
//
//     initialize(data) {
//       var view = this;
//       this.uri = data.marker;
//       this.oldURI = data.marker;
//       this.changes = {};
//       this.mapItem = data.map;
//       this.map = Mediakron.Status.CurrentMap;
//
//       if(this.map === 0 || !this.map){ Mediakron.router.navigate(data.map.get('uri'), {  trigger: true }); return false; }
//
//       this.map.drawMarkers();
//       $('.timeline-slider').slider('values', 0, 0);
//       $('.timeline-slider').slider('values', 1, 100);
//       if(!this.map || this.map === 0){
//         Mediakron.router.navigate(data.map.get('uri'), {
//           trigger: true
//         });
//         return false;
//       }
//       this.marker =  false;
//
//       _.each(this.map.markers, function(marker, uri) {
//         if(view.uri == uri){
//           view.marker = marker;
//         }
//       });
//
//       if(!this.marker.options) this.marker.options = { editing: {} };
//       if(!this.marker.options.editing) this.marker.options.editing = {};
//       this.marker.editing.enable();
//       // get layer
//       this.layer = this.map.model.getChild(this.uri, 'layers');
//
//       if(this.layer.data.type == 'point'){
//         this.latitude = this.layer.data.coordinate.lat;
//         this.longitude = this.layer.data.coordinate.lng;
//       }
//       if(this.layer.data.layer){
//         this.filter = this.layer.data.layer;
//       }
//       if(this.layer.data.zoom){
//           this.zoom = this.layer.data.zoom;
//       }
//       if(this.layer.data.center){
//           this.center = this.layer.data.center;
//       }
//     },
//
//     render() {
//       var view = this;
//       if(this.layout){
//         this.template = JST['pages.map.'+this.layout];
//       }
//       if(!this.layer){
//         Mediakron.router.navigate(this.mapItem.get('uri'), {
//           trigger: true
//         });
//
//       }else{
//         var label = '';
//         if(this.layer.data.label){
//           label = this.layer.data.label;
//         }
//         var filter = false;
//         if( this.filter ){
//           filter = Mediakron.getItemFromURI(this.filter);
//         }else if(this.layer.data.layer){
//           filter = Mediakron.getItemFromURI(this.layer.data.layer);
//         }
//         var content = {
//           map: this.map,
//           item: Mediakron.getItemFromURI(this.uri),
//           type: this.layer.data.type,
//           uri: this.uri,
//           label: label,
//           latitude: this.latitude,
//           longitude: this.longitude,
//           address: this.layer.data.address,
//           layer: filter,
//           zoom: this.zoom,
//           center: this.center
//         };
//
//         $(this.el).html(this.template(content));
//         $(this.el).append('<div id="admin-link-content" class="marker-add-pane" />');
//         this.marker.on('edit',function(e){
//           if(view.layer.data.type == 'point'){
//             Mediakron.Status.formChanged = true;
//             var lnglat = e.target.getLatLng();
//             $('#mark-longitude').val(lnglat.lng);
//             $('#mark-latitude').val(lnglat.lat);
//           }
//         });
//       }
//   //     $('.map-template').addClass('content-push-sidebar');
//        /* setTimeout(function(){ Mediakron.Status.CurrentMap.invalidateSize(); }, 400);  Refresh map width */
//
//       return this;
//     },
//
//     afterRender() {
//       var start = false, end = false;
//       if(!this.layer) this.layer = { 'data': {} };
//       if(this.layer.data.start) start = this.layer.data.start;
//       if(this.layer.data.end) end = this.layer.data.end;
//       this.startWidget = new Mediakron.Timeline.selectWidget({
//           parent: this,
//           $parent: $('.start-date-fields'),
//           date: start,
//           map: true
//       });
//       this.startWidget.render();
//       this.endWidget = new Mediakron.Timeline.selectWidget({
//           parent: this,
//           $parent: $('.end-date-fields'),
//           date: end,
//           map: true
//       });
//       this.endWidget.render();
//     },
//     events: {
//       'click a': Mediakron.linkHandle,
//       'click .close-button': 'cancel',
//       'click #cancel-editing': 'cancel',
//       'click .overlay-bg': 'cancel',
//       'click #done-editing': 'save',
//       'click #attach-existing': "getContentBrowser",
//       'click .remove-item .mk-remove': "removeItem",
//       'click .remove-layer .mk-remove': "removeLayer",
//       'click #add-label': 'addLabel',
//       'click .remove-label .mk-remove': "removeLabel",
//       'click #attach-existing-layer': "getLayerContentBrowser",
//       'click #attach-new-layer': "addLayer",
//       'click .remove-layer': "removeLayer",
//       'click .layer-options-edit': "showLayerEdit",
//       'click .layer-edit-button': "editLayer",
//       'change #mark-longitude': 'drawPoint',
//       'change #mark-latitude': 'drawPoint',
//       'blur #mark-address': 'geocode',
//       'click #save-zoom': 'savezoom'
//
//     },
//     savezoom(){
//       var view = this;
//       this.zoom = Mediakron.Status.CurrentMap.getZoom();
//       this.center = Mediakron.Status.CurrentMap.getCenter();
//       view.layer.data.zoom = this.zoom;
//       view.layer.data.center = this.center;
//       $('#edit-zoom').text(this.zoom);
//       $('#edit-center').text(this.center.lat + ', ' + this.center.lng);
//     },
//     geocode(e){
//       var address = $('#mark-address').val(),
//           geocode = 'https://nominatim.openstreetmap.org/search/'+encodeURIComponent(address)+'?format=json', view = this;
//       if(address !== ''){
//         Mediakron.message({
//             text: 'Attempting to locate that address',
//             type: 'info',
//             timeout: 3000,
//             layout: 'bottom'
//         });
//         $.get(geocode, function(data){
//           console.log(data);
//           if(data){
//             if(data.length > 0){
//               if(data[0].lat){
//                 Mediakron.message({
//                     text: 'Address has been located.',
//                     type: 'success',
//                     timeout: 3000,
//                     layout: 'bottom'
//                 });
//                 $('#mark-latitude').val(data[0].lat);
//                 $('#mark-longitude').val(data[0].lon);
//                 view.drawPoint();
//                 view.layer.data.address = address;
//               }
//             }else{
//               Mediakron.message({
//                   text: 'Sorry, We could not find the address you entered',
//                   type: 'danger',
//                   timeout: 3000,
//                   layout: 'bottom'
//               });
//             }
//           }
//         }).fail(function(){
//           Mediakron.message({
//               text: 'Sorry, We could not find the address you entered',
//               type: 'danger',
//               timeout: 3000,
//               layout: 'bottom'
//           });
//         });
//       }else{
//         view.layer.data.address = '';
//       }
//     },
//     cancel(e){
//       if(!this.marker.options.editing) this.marker.options.editing = {};
//       this.marker.editing.disable();
//       Mediakron.Edit.cancelEdit(e);
//     },
//     drawPoint(){
//       var lng = $('#mark-longitude').val(),
//           lat = $('#mark-latitude').val();
//       var newLatLng = new L.LatLng(lat, lng);
//       this.marker.setLatLng(newLatLng);
//       this.map.panTo(newLatLng);
//     },
//     save(e) {
//
//       var children =  this.map.model.getRelationship('layers'),
//           count = children.length, i = 0, child, extract;
//
//       if(this.changes){
//         if(this.changes.uri){
//           this.layer.uri = this.changes.uri;
//         }
//       }
//
//       this.marker.editing.disable();
//       var label = $('#simple-label').val();
//       this.layer.data.label = label.replace(/'/g, '&#39;');
//
//       if(this.map.model.get('template') == 'timemap'){
//         var start = this.startWidget.validate(false),
//           end = this.endWidget.validate('end');
//         this.layer.data.start = start;
//         this.layer.data.end = end;
//       }
//
//       this.layer.data.layer = this.filter;
//
//       this.layer.data.zoom = this.zoom;
//       this.layer.data.center = this.center;
//
//
//       if(this.layer.data.type == 'point'){
//         this.layer.data.coordinate = this.marker.getLatLng();
//       }else{
//         this.layer.data.coordinate = this.marker.getLatLngs();
//       }
//
//       for(i;i<count;i++){
//         child = children[i];
//
//         if(child.uri == this.oldURI){
//
//           if(this.uri !== this.oldURI){
//             extract = child;
//             delete children[i];
//             extract = {
//               uri: this.oldURI,
//               data: false,
//               remove: true
//             };
//
//             if(extract.uri){
//               children.push(extract);
//             }else{
//               this.nochild = true;
//             }
//             this.layer.data.nochild = this.nochild;
//             children[i] = this.layer;
//           }else{
//             children[i] = this.layer;
//           }
//
//         }
//       }
//       this.map.model.setRelationship('layers',children);
//       this.map.model.save({}, {
//         'success'(){
//           Mediakron.Status.CurrentMap.removeMarkers();
//           Mediakron.Status.CurrentMap.drawMarkers();
//
//           Mediakron.App.Events.trigger('marker:edit');
//         }
//       });
//       Mediakron.Status.formChanged = false;
//       Mediakron.Edit.cancelEdit(e);
//     },
//     getContentBrowser() {
//           $('.organize-marker').hide();
//           $('#admin-link-content').show();
//           var data, callback, view, lightbox, markerPane = this;
//           data = {
//               'context': false,
//               'filters': false,
//               'skip': markerPane.mapItem.skips(),
//               'disabled':[
//                 "image",
//                 "video",
//                 "story",
//                 "file",
//                 "audio",
//                 "narrative",
//                 "slideshow",
//                 "folder",
//                 "progression",
//                 "comparison",
//                 "map",
//                 "maptimeline",
//                 "timeline"
//               ],
//               'callback'(item) {
//                   markerPane.changes.uri = item.get('uri');
//                   Mediakron.Status.formChanged = true;
//                   markerPane.item = item;
//                   markerPane.oldURI = markerPane.uri;
//                   markerPane.uri = markerPane.changes.uri;
//                   markerPane.nochild = false;
//                   markerPane.render();
//                   markerPane.afterRender();
//                   $('#admin-link-content').hide().empty();
//                   $('#organize-marker').show();
//                   $('#simple-label').val('');
//                   $('#map-label').addClass('hide');
//                   Mediakron.ContentBrowser.filter.filter = false;
//               },
//               'cancelCallback'(){
//                 $('#admin-link-content').hide().empty();
//                 $('.organize-marker').show();
//                 markerPane.render();
//                 markerPane.afterRender();
//                 Mediakron.ContentBrowser.filter.filter = false;
//               }
//           };
//           view = new Mediakron.ContentBrowser.Selector(data);
//           view.setElement('#admin-link-content');
//           html = view.render();
//           view.afterRender();
//       },
//       removeItem(){
//         $('#selected-map').remove();
//         $('.marker-content-options').removeClass('hide');
//         this.oldURI = this.uri;
//         this.uri = 'map-unassigned-'+ Math.floor(Math.random()*90000) + 10000;
//         this.nochild = true;
//         this.changes.uri = this.uri;
//       },
//       addLabel(){
//         $('#map-label').removeClass('hide');
//         $('.marker-content-options').addClass('hide');
//       },
//       removeLabel(){
//         $('#simple-label').val('');
//         $('#map-label').addClass('hide');
//         $('.marker-content-options').removeClass('hide');
//       },
//       getLayerContentBrowser() {
//           $('.organize-marker').hide();
//           $('#admin-link-content').show();
//           var data, callback, view, lightbox, markerPane = this;
//           data = {
//               'context': false,
//               'filters': [ 'layer' ],
//               'disabled':[ 'layer' ],
//               'callback'(filter) {
//                   markerPane.changes.filter = filter.get('uri');
//                   markerPane.filter = markerPane.changes.filter;
//                   Mediakron.Status.formChanged = true;
//                   markerPane.render();
//                   markerPane.afterRender();
//                   $('#admin-link-content').hide().empty();
//                   $('.organize-marker').show();
//                   Mediakron.ContentBrowser.filter.filter = false;
//               },
//               'cancelCallback'(){
//                 $('#admin-link-content').hide().empty();
//                 $('.organize-marker').show();
//                 markerPane.render();
//                 markerPane.afterRender();
//                 Mediakron.ContentBrowser.filter.filter = false;
//               }
//           };
//           view = new Mediakron.ContentBrowser.Selector(data);
//           view.setElement('#admin-link-content');
//           html = view.render();
//           view.afterRender();
//       },
//       addLayer(){
//         var view, data, callback, markerPane = this;
//         data = {
//           'type': 'layer',
//           'callback'(item){
//             markerPane.changes.filter = item.get('uri');
//             markerPane.filter = markerPane.changes.filter;
//             Mediakron.Status.formChanged = true;
//             markerPane.render();
//             markerPane.afterRender();
//             $('.add-layer').addClass('hide').empty();
//             $('.organize-marker').removeClass('hide');
//           }
//         };
//         view = new Mediakron.Admin.AddContentPage(data);
//         view.setElement('.add-layer');
//         $('.add-layer').removeClass('hide');
//         $('.organize-marker').addClass('hide');
//         view.render();
//         view.afterRender();
//       },
//       showLayerEdit() {
//         $('.layer-options, .layer-edit-button').removeClass('hide');
//       },
//       editLayer(){
//         var layerItem = Mediakron.getItemFromURI(this.filter);
//         var view, data, callback, markerPane = this;
//         data = {
//           'type': 'layer',
//           'edit': true,
//           'item': layerItem,
//           'callback'(item){
//             markerPane.changes.filter = item.get('uri');
//             markerPane.filter = markerPane.changes.filter;
//             Mediakron.Status.formChanged = true;
//             markerPane.render();
//             markerPane.afterRender();
//             $('.add-layer').addClass('hide').empty();
//             $('.organize-marker').removeClass('hide');
//           }
//         };
//         view = new Mediakron.Admin.AddContentPage(data);
//         view.setElement('.add-layer');
//         $('.add-layer').removeClass('hide');
//         $('.organize-marker').addClass('hide');
//         view.render();
//         view.afterRender();
//       },
//       removeLayer() {
//           $('#selected-layer').remove();
//           $('.layer-options').removeClass('hide');
//           $('.layer-edit-button').addClass('hide');
//           this.changes.filter = false;
//           this.filter = false;
//           Mediakron.Status.formChanged = true;
//       }
//   });
//   Mediakron.Admin.sequenceEditor = Backbone.View.extend({
//       template: JST['settings.section.sequence.editor'],
//       el: '#order-items',
//       model: false,
//       initialize(model) {
//           this.model = model;
//       },
//       render() {
//           $('#sequence-editor').remove();
//           this.$el.append(this.template(this.model.toJSON()));
//           return this;
//       },
//       events: {}
//   });
