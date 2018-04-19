Mediakron.Import = {};

Mediakron.Import.Mappings = {};
Mediakron.Import.Timeline = false;
Mediakron.Import.Count = {
    topics: 0,
    tags:0,
    maps:0,
    items:0,
    progressions:0,
    timeline: 0
};

Mediakron.Import.Relationships = {
    topics:{},
    tags:{},
    maps:{},
    progressions:{},
    timeline:[]
};

Mediakron.Import.transformProjection = function(horizontal,vertical){
    var source = new proj4.Proj('GOOGLE');    
    var dest = new proj4.Proj('EPSG:4326');
    
    var testPt = new proj4.Point(horizontal,vertical);
    var result = proj4.transform(source, dest, testPt);
    return result;
};

Mediakron.Import.Mk2 = Mediakron.Extensions.View.extend({
    template: JST['settings.import.mk2'],
    topics:{},
    tags:{},
    maps:{},
    items:{},
    timeline:false,
    initialize: function () {
        
    }, 
    render: function () {
        this.$el.html(this.template());
        return this;
    },
    afterRender: function(){
    },
    events: {
        'click #gogetit': 'startImport',
        'click #save-parents': 'saveParents',
        'click #complete': 'complete',
        'click #save-items': 'saveItems',
        'click .tableheader': 'showBody',
        'click #create-timeline':'toggleTimeline',
        'click #create-users':'toggleUser'
    },
    toggleTimeline: function(){
        if(!Mediakron.Import.Timeline){
            var timeline = this.timeline = new Mediakron.Models.Item();
            this.timeline.set('title','Imported Timeline');
            this.timeline.set('type','timeline');
            Mediakron.Import.Timeline = timeline;
        }else{
            this.timeline = Mediakron.Import.Timeline = false;
        }
    },
    toggleUser: function(){
        if(!Mediakron.Import.UserNames){
            Mediakron.Import.UserNames = true;
        }else{
            Mediakron.Import.UserNames = false;
        }
    },
    showBody:function(e){
        var table = $(e.currentTarget).parent().parent().parent().parent();
        $('tbody',table).toggleClass('hide');
    },
    startImport:function(){
        var url = $('#mk2url').val(),
            topics, tags, 
            items, maps, 
            timeline, view = this;
        this.url = url;
        $.when(
            $.getJSON('https://tmkp.bc.edu/'+url+'/mediakron/fetch/collection/topic',{},function(data){
                view.topics = data;
            }),
            $.getJSON('https://tmkp.bc.edu/'+url+'/mediakron/fetch/collection/tag',{},function(data){
                view.tags = data;
            }),
            $.getJSON('https://tmkp.bc.edu/'+url+'/mediakron/fetch/collection/item',{},function(data){
                view.items = data;
            }),
            $.getJSON('https://tmkp.bc.edu/'+url+'/mediakron/fetch/collection/map',{},function(data){
                view.maps = data;
            })
        ).then(function() {
            $('.tables').removeClass('hide');
            view.importData();
        });
            
    },
    importData:function(){
        var row, url = this.url, $table = $('#mk-import-topics tbody'), view = this;
        $('#import-panel').remove();
        this.topicList = {};
        
        Mediakron.Import.Mappings.topicMap = {};
        _.each(this.topics, function(topic){
            if(!topic.title) return true;
            topic.url = url;
            topic.type = 'folder';
            row = new Mediakron.Import.topic(topic);
            row.render();
            view.topicList[topic.id] = row;
            Mediakron.Import.Mappings.topicMap[topic.id] = topic.title;
            $table.append(row.$el);
        });
        Mediakron.Import.Count.topics = _.size(Mediakron.Import.Mappings.topicMap);
        $('#mk-import-topics .count').html(Mediakron.Import.Count.topics);
        
        $table = $('#mk-import-tags tbody');
        
        this.tagList = {};
        Mediakron.Import.Mappings.tagMap = {};
        _.each(this.tags, function(tag){
            if(!tag.title) return true;
            tag.url = url;
            tag.type = 'tag';
            if(!tag.description || tag.description === null){
                tag.description = '';
            }
            row = new Mediakron.Import.tag(tag);
            row.render();
            view.tagList[tag.id] = row;
            Mediakron.Import.Mappings.tagMap[tag.id] = tag.title;
            $table.append(row.$el);
        });
        Mediakron.Import.Count.tags = _.size(Mediakron.Import.Mappings.tagMap);
        $('#mk-import-tags .count').html(Mediakron.Import.Count.tags);
        
        $table = $('#mk-import-items tbody');
        
        this.itemList = {};
        Mediakron.Import.Mappings.itemMap = {};
        _.each(this.items, function(item){
            if(!item.title) return true;
            item.url = url;
            row = new Mediakron.Import.item(item);
            row.render();
            view.itemList[item.id] = row;
            Mediakron.Import.Mappings.itemMap[item.id] = item.title;
            $table.append(row.$el);
        });
        Mediakron.Import.Count.items = _.size(Mediakron.Import.Mappings.itemMap);
        $('#mk-import-items .count').html(Mediakron.Import.Count.items);
        
        $table = $('#mk-import-maps tbody');
        
        this.mapList = {};
        Mediakron.Import.Mappings.mapMap = {};
        _.each(this.maps, function(map){
            if(!map.title) return true;
            map.url = url;
            row = new Mediakron.Import.map(map);
            row.render();
            view.mapList[map.id] = row;
            Mediakron.Import.Mappings.mapMap[map.id] = map.title;
            $table.append(row.$el);
        });
        Mediakron.Import.Count.maps = _.size(Mediakron.Import.Mappings.mapMap);
        $('#mk-import-maps .count').html(Mediakron.Import.Count.maps);
        
        
    },
    saveParents: function(e,second){
        $('#save-parents').prop('disabled',true).text('Importing records');
        Mediakron.messages.message("We are importing relationships.  Please stand by.");
        $('.timeline').remove();
        var topics = 0, topicPercent, 
            tags = 0, tagPercent, 
            maps = 0, mapPercent,
            items = 0, itemPercent, 
            timelines = 0, 
            topicsComplete = false, 
            tagsComplete = false, 
            mapsComplete = false, 
            itemsComplete = false, 
            timelineComplete = false,
            view = this;
        if(Mediakron.Import.Count.topics === 0){
            topicsComplete = true;
        }
        if(Mediakron.Import.Count.maps === 0){
            mapsComplete = true;
        }
        if(Mediakron.Import.Count.tags === 0){
            tagsComplete = true;
        }
        if(Mediakron.Import.Count.items === 0){
            itemsComplete = true;
        }
        Mediakron.App.Events.on('import:done',function(object){
            if(object.type == 'topic'){
                topics++;
                topicPercent = (topics/Mediakron.Import.Count.topics)*100;
                $('#mk-import-topics .progress-bar').width(topicPercent+'%').attr('aria-valuenow',topicPercent).text(Math.floor(topicPercent)+'% Complete');
                if(topics == Mediakron.Import.Count.topics){
                    topicsComplete = true;
                }
            }
            if(object.type == 'tag'){
                tags++;
                tagPercent = (tags/Mediakron.Import.Count.tags)*100;
                $('#mk-import-tags .progress-bar').width(tagPercent+'%').attr('aria-valuenow',tagPercent).text(Math.floor(tagPercent)+'% Complete');
                if(tags == Mediakron.Import.Count.tags){
                    tagsComplete = true;
                }
            }
            if(object.type == 'map'){
                maps++;
                mapPercent = (maps/Mediakron.Import.Count.maps)*100;
                $('#mk-import-maps .progress-bar').width(mapPercent+'%').attr('aria-valuenow',mapPercent).text(Math.floor(mapPercent)+'% Complete');
                if(maps == Mediakron.Import.Count.maps){
                    mapsComplete = true;
                }
            }
            if(object.type == 'item'){
                items++;
                itemPercent = (items/Mediakron.Import.Count.items)*100;
                $('#mk-import-items .progress-bar').width(itemPercent+'%').attr('aria-valuenow',itemPercent).text(Math.floor(itemPercent)+'% Complete');
                if(items == Mediakron.Import.Count.items){
                    itemsComplete = true;
                }
            }
            if(object.type == 'timeline'){
                timelineComplete = true;
            } 
            if(topicsComplete && tagsComplete && mapsComplete && timelineComplete && itemsComplete){
                $('#save-parents').hide();
                Mediakron.messages.message("All items are now imported");
                $('#complete').attr('disabled',false).removeClass('hide');
                Mediakron.App.Events.off('import:done');
                
            }
        });
        // save topics tags and maps first
        _.each(this.topicList,function(topic){
            topic.save();
        });
        _.each(this.tagList,function(tag){
            tag.save();
        });
        _.each(this.mapList,function(map){
            map.save();
        });
        if(this.timeline){
            Mediakron.Import.Count.timeline = 1;
            Mediakron.Import.Timeline = this.timeline;
            this.timeline.save({},{
                success:function(){
                    Mediakron.Import.Timeline.addToCollection();
                    Mediakron.createUrlMap();
                    Mediakron.App.Events.trigger('import:done',{'type':'timeline',model:Mediakron.Import.Timeline});
                }
            });
        }else{
            timelineComplete = true;
            Mediakron.Import.Count.timeline = 0;
        }
        _.each(this.itemList,function(item){
            item.save();
        });
    },
    
    
    
    complete: function(e,second){
        $('#execute').remove();
        Mediakron.messages.message("We're cleaning up all remaining items..");
        $('#mk-import-items').remove();
        if(Mediakron.Import.Count.progressions > 0){
            $('#mk-import-progressions').removeClass('hide');
            $('#mk-import-progressions .count').text(Mediakron.Import.Count.progressions);
        }
        var topics = 0, topicPercent, 
            tags = 0, tagPercent, 
            maps = 0, mapPercent, 
            progressions = 0, progressionPercent, 
            timelines = 0, 
            topicsComplete = false, 
            tagsComplete = false, 
            mapsComplete = false, 
            timelineComplete = false,
            progressionsComplete = false,
            view = this;
            if(Mediakron.Import.Count.topics === 0){
                topicsComplete = true;
            }
            if(Mediakron.Import.Count.maps === 0){
                mapsComplete = true;
            }
            if(Mediakron.Import.Count.tags === 0){
                tagsComplete = true;
            }
            if(Mediakron.Import.Count.progressions === 0){
                progressionsComplete = true;
            }
        $('.progress-bar').width('0%').attr('aria-valuenow',0).text('0% Complete');
        Mediakron.App.Events.on('import:done',function(object){
            if(object.type == 'topic'){
                topics++;
                topicPercent = (topics/Mediakron.Import.Count.topics)*100;
                $('#mk-import-topics .progress-bar').width(topicPercent+'%').attr('aria-valuenow',topicPercent).text(Math.floor(topicPercent)+'% Complete');
                if(topics == Mediakron.Import.Count.topics){
                    topicsComplete = true;
                }
            }
            if(object.type == 'tag'){
                tags++;
                tagPercent = (tags/Mediakron.Import.Count.tags)*100;
                $('#mk-import-tags .progress-bar').width(tagPercent+'%').attr('aria-valuenow',tagPercent).text(Math.floor(tagPercent)+'% Complete');
                if(tags == Mediakron.Import.Count.tags){
                    tagsComplete = true;
                }
            }
            if(object.type == 'map'){
                maps++;
                mapPercent = (maps/Mediakron.Import.Count.maps)*100;
                $('#mk-import-maps .progress-bar').width(mapPercent+'%').attr('aria-valuenow',mapPercent).text(Math.floor(mapPercent)+'% Complete');
                if(maps == Mediakron.Import.Count.maps){
                    mapsComplete = true;
                }
            }
            if(object.type == 'progression'){
                progressions++;
                progressionPercent = (progressions/Mediakron.Import.Count.progressions)*100;
                $('#mk-import-progressions .progress-bar').width(progressionPercent+'%').attr('aria-valuenow',progressionPercent).text(Math.floor(progressionPercent)+'% Complete');
                if(progressions == Mediakron.Import.Count.progressions){
                    progressionsComplete = true;
                }
            }
            if(object.type == 'timeline'){
                timelineComplete = true;
            } 
            if(topicsComplete && tagsComplete && mapsComplete && timelineComplete && progressionsComplete){
                Mediakron.messages.message("The import is now complete.  Please reload the site.",'success',true);
            }
        });
        // save topics tags and maps first
        _.each(Mediakron.Import.Mappings.topicMap,function(topic){
            var model =  Mediakron.getItemFromURI(topic.get('uri')),
                mk2id = model.get('mk2_id'), parent, uri = model.get('uri');
            if(Mediakron.Import.Relationships.topics[mk2id]){
                Mediakron.Import.Relationships.topics[mk2id].sort(function(a,b){
                    return a.weight-b.weight;
                });
                _.each(Mediakron.Import.Relationships.topics[mk2id],function(relationship){
                    child = Mediakron.getItemFromURI(relationship.uri);
                    if(child){
                        model.add(child,relationship.data,true);
                    }
                });
                model.save({},{
                    success:function(){
                        Mediakron.App.Events.trigger('import:done',{'type':'topic'});
                    },
                    error: function(){
                        Mediakron.App.Events.trigger('import:done',{'type':'topic'});
                    }
                });
            }else{
                Mediakron.App.Events.trigger('import:done',{'type':'topic'});
            }
            
        });
        _.each(Mediakron.Import.Mappings.tagMap,function(tag){
            var model =  Mediakron.getItemFromURI(tag.get('uri')),
                mk2id = model.get('mk2_id');
            if(Mediakron.Import.Relationships.tags[mk2id]){
                model.setRelationship('children',Mediakron.Import.Relationships.tags[mk2id]);
                model.save({},{
                    success:function(){
                        Mediakron.App.Events.trigger('import:done',{'type':'tag'});
                    },
                    error: function(){
                        Mediakron.App.Events.trigger('import:done',{'type':'tag'});
                    }
                });
            }else{
                Mediakron.App.Events.trigger('import:done',{'type':'tag'});
            }
        });
        _.each(Mediakron.Import.Mappings.mapMap,function(map){
            var model =  Mediakron.getItemFromURI(map.get('uri')),
                mk2id = model.get('mk2_id'),
                type = model.get('type');
            if(Mediakron.Import.Relationships.maps[mk2id]){
                _.each(Mediakron.Import.Relationships.maps[mk2id],function(relationship){
                    child = Mediakron.getItemFromURI(relationship.uri);
                    
                    if(child){
                        if(type == 'osm'){
                            var latlng = Mediakron.Import.transformProjection(relationship.data.coordinate.lat,relationship.data.coordinate.lng);
                            model.add(child,{
                                'type':'point',
                                'coordinate': {
                                    'lat':latlng.y,
                                    'lng':latlng.x
                                }
                            },true);
                        }else{
                            model.add(child,{
                                'type':'point',
                                'coordinate': {
                                    'lat':relationship.data.coordinate.lat,
                                    'lng':relationship.data.coordinate.lng
                                }
                            },true);
                        }
                    }
                });
                model.save({},{
                    success:function(){
                        Mediakron.App.Events.trigger('import:done',{'type':'map'});
                    },
                    error: function(){
                        Mediakron.App.Events.trigger('import:done',{'type':'map'});
                    }
                });
            }else{
                Mediakron.App.Events.trigger('import:done',{'type':'map'});
            }
        });
        _.each(Mediakron.Import.Mappings.progressionMap,function(progression){
            var model =  Mediakron.getItemFromURI(progression.get('uri')),
                mk2id = model.get('mk2_id');
            if(Mediakron.Import.Relationships.progressions[mk2id]){
                _.each(Mediakron.Import.Relationships.progressions[mk2id],function(relationship){
                    if(relationship){
                        if(relationship.uri){
                            child = Mediakron.getItemFromURI(relationship.uri);
                            if(child){
                                model.add(child,relationship.data,true);
                            }
                        }
                        
                    }
                });
                model.save({},{
                    success:function(){
                        Mediakron.App.Events.trigger('import:done',{'type':'progression'});
                    },
                    error: function(){
                        Mediakron.App.Events.trigger('import:done',{'type':'progression'});
                    }
                });
            }else{
                Mediakron.App.Events.trigger('import:done',{'type':'map'});
            }
        });
        if( Mediakron.Import.Timeline){
            Mediakron.Import.Count.timeline = 1;
            Mediakron.Import.Timeline.setRelationship('events',Mediakron.Import.Relationships.timeline);
             Mediakron.Import.Timeline.save({},{
                success:function(){
                    Mediakron.Import.Timeline.addToCollection();
                    Mediakron.createUrlMap();
                    Mediakron.App.Events.trigger('import:done',{'type':'timeline',model:Mediakron.Import.Timeline});
                }
            });
        }else{
            timelineComplete = true;
            Mediakron.Import.Count.timeline = 0;
        }
    }
});



Mediakron.Import.abstract = Backbone.View.extend({
    template: JST['settings.import.mk2'],
    file: false,
    promise: false,
    url: false,
    uri: false,
    mk2id: false,
    initialize: function (object) {
        
        this.url = object.url;
        this.model = new Mediakron.Models.Item();
        this.mk2id = object.id;
        this.model.set('mk2_id',object.id);
        this.model.set('mk2_topic',object.tid);
        this.model.set('mk2_tags',object.tags);
        this.model.set('mk2_type',object.type);


        if(object.authorname){
            this.model.set('mk2_authorname',"By: "+object.authorname);
        }

        this.model.set('mk2_filepath','https://tmkp.bc.edu/'+this.url+'/sites/tmkp.bc.edu.'+this.url+'/files/');
        if(object.document){
            this.model.set('mk2_pdf','https://tmkp.bc.edu/'+this.url+'/sites/tmkp.bc.edu.'+this.url+'/files/'+object.document);
        }else{
            this.model.set('mk2_pdf',false);
        }
        if(object.weight){
            this.model.set('mk2_weight',object.weight);
        }else{
            this.model.set('mk2_weight',false);
        }
        
        if(object.image){
            object.image = object.image.replace(/\+/g,' ');
            this.model.set('mk2_image','https://tmkp.bc.edu/'+this.url+'/sites/tmkp.bc.edu.'+this.url+'/files/'+object.image);
            if(object.imageDimensions){
                this.model.set('mk2_imageDimensions',object.imageDimensions);
            }
        }else{
            this.model.set('mk2_image',false);
        }
        this.model.set('title',object.title);
        this.model.set('type',this.translateType(object.type));
        if(object.body){
            this.model.set('description',object.body);
        }else if(object.description){
            this.model.set('description',object.description);
        }
        
        
        if(object.type == 'audio'){
            this.model.set('audio',{
                type:object.audio_type,
                url:object.audio
            });
        }
        if(object.type == 'video'){
            this.model.set('video',{
                type:object.video_type,
                url:object.video
            });
        }
        if(object.type == 'text'){
            this.model.set('text',{
                type:'plain'
            });
        }
        if(object.type == 'map'){
            var latlng = Mediakron.Import.transformProjection(object.lon,object.lat);
            this.model.set('center',[latlng.y,latlng.x]);
            this.model.set('zoom',object.zoom);
            if(object.maptype == 'google'){
                this.model.set('type','osm');
            }else{
                this.model.set('type','image-map');
            }
        }
        if(object.tags){
            if(object.tags.length > 0){
                this.model.set('mk2_tags',object.tags);
            }
        }
        if(object.maps){
            this.model.set('mk2_maps',object.maps);
        }
        if(object.width && object.height){
            var ratio = 1;
            if(object.width > object.height){
                ratio = 200/object.width;
                object.width = 200;
                object.height = object.height*ratio;
            }else if(object.width < object.height){
                ratio = 200/object.height;
                object.height = 200;
                object.width = object.width*ratio;
            }else{
                object.width = 200;
                object.height = 200;
            }
            this.model.set('size',{'width':object.width,'height':object.height});
        }
        if(object.start){
            this.model.set('mk2_start',object.start);
        }
        if(object.end){
            this.model.set('mk2_end',object.end);
        }
        if(object.notes){
            this.model.set('mk2_notes',object.notes);
        }
        if(object.images){
            this.model.set('mk2_images',object.images);
        }
        this.source = object;
        return this;
    },
    render: function () {
        var content = this.model.toJSON();
        content.url = this.url;
        html = this.template(content);
        this.setElement( $(html) );
        return this;
    },
    translateType: function(source){
        if(source == 'info'){
            source = 'text';
        }
        if(source == 'image_sequence'){
            source = 'progression';
        }
        return source;
    },
    uploadRemote:function(callback){
        var image  = this.model.get('mk2_image'),
            deferred = $.Deferred(),
            reader = new FileReader(),
            view = this;
            
        if(!image){
            callback();
            return this;
        }
        
        Mediakron.Status.uploadInProgress = true;
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', image, true);
        
        xhr.onerror = function(e){
            view.model.set({'image':false});
            console.log('failed to get image.  calling back '+view.model.get('title'));
            callback();
        };
        
        xhr.responseType = 'arraybuffer';
        
        xhr.onload = function(e) {
          if (this.status == 200) {
            var uInt8Array = new Uint8Array(this.response);
            var i = uInt8Array.length;
            var binaryString = new Array(i);
            while (i--)
            {
              binaryString[i] = String.fromCharCode(uInt8Array[i]);
            }
            var data = binaryString.join('');
            
            var base64 = window.btoa(data);
            if(!base64 || base64 === ''){
                view.model.set({'image':false});
                console.log('failed to import file.  calling back '+view.model.get('title'));
                callback();
                return this;
            }
            $.ajax({
                url:Mediakron.Data.upload,
                data: {uploadfilename: encodeURIComponent(view.source.image), file: "data:image/jpg;base64,"+base64},
                type: "post",
                cache: false, 
                success: function(event,message,response) {
                    console.log("returned from remote upload "+event);
                    var data = JSON.parse(event);
                    
                    deferred.resolve(data);
                },
                error: function(request) {
                    deferred.reject(request);
                }
            });
          }else{
              view.model.set({'image':false});
              console.log('server sent error '+ this.status);
              callback();
          }
        };
        
        xhr.send();
        deferred.done(function(data){
            view.model.set({'image':{'uri':data.file}});
            callback();
        });
        deferred.fail(function(data){
            view.model.set({'image':false});
            console.log('failed to import image.  calling back '+view.model.get('title'));
            callback();
        });
    },
    uploadDocument:function(callback){
        var pdf  = this.model.get('mk2_pdf'),
            deferred = $.Deferred(),
            reader = new FileReader(),
            view = this;
            
        if(!pdf){
            callback();
            return this;
        }
        
        Mediakron.Status.uploadInProgress = true;
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', pdf, true);
        
        xhr.onerror = function(e){
            view.model.set({'image':false});
            console.log('failed to get file.  calling back '+view.model.get('title'));
            callback();
        };
        
        xhr.responseType = 'arraybuffer';
        
        xhr.onload = function(e) {
          if (this.status == 200) {
            var uInt8Array = new Uint8Array(this.response);
            var i = uInt8Array.length;
            var binaryString = new Array(i);
            while (i--)
            {
              binaryString[i] = String.fromCharCode(uInt8Array[i]);
            }
            var data = binaryString.join('');
        
            var base64 = window.btoa(data);
            if(!base64 || base64 === ''){
                view.model.set({'image':false});
                console.log('failed to import file.  calling back '+view.model.get('title'));
                callback();
                return this;
            }
            $.ajax({
                url:Mediakron.Data.upload,
                data: {uploadfilename: encodeURIComponent(view.source.document), file: "data:application/pdf;base64,"+base64},
                type: "post",
                cache: false, 
                success: function(event,message,response) {
                    var data = JSON.parse(event);
                    deferred.resolve(data);
                },
                error: function(request) {
                    deferred.reject(request);
                }
            });
          }else{
              console.log('server sent error '+ this.status);
              view.model.set({'text':{'type':'plain'}});
              callback();
          }
        };
        
        xhr.send();
        deferred.done(function(data){
            text = {'type':'pdf','url':data.file};
            view.model.set('text',text);
            callback();
        });
        deferred.fail(function(data){
            view.model.set({'text':{'type':'plain'}});
            console.log('failed to import file.  calling back '+view.model.get('title'));
            callback();
        });
    }
});


Mediakron.Import.uploadRemote = function(path, image, callback){
    var deferred = $.Deferred(),
        reader = new FileReader();
        
    if(!image){
        callback();
        return false;
    }
    
    Mediakron.Status.uploadInProgress = true;
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    
    xhr.responseType = 'arraybuffer';
    
    xhr.onload = function(e) {
      if (this.status == 200) {
        var uInt8Array = new Uint8Array(this.response);
        var i = uInt8Array.length;
        var binaryString = new Array(i);
        while (i--)
        {
          binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }
        var data = binaryString.join('');
        
        var base64 = window.btoa(data);
        if(!base64 || base64 === ''){
            callback(false);
            return this;
        }
        $.ajax({
            url:Mediakron.Data.upload,
            data: {uploadfilename: encodeURIComponent(image), file: "data:image/jpg;base64,"+base64},
            type: "post",
            cache: false, 
            success: function(event,message,response) {
                console.log("returned from remote upload "+event);
                var data = JSON.parse(event);
                deferred.resolve(data);
            },
            error: function(request) {
                deferred.reject(request);
            }
        });
      }
    };
    
    xhr.send();
    deferred.done(function(data){
        callback(data.file);
    });
    deferred.fail(function(data){
        callback(false);
    });
};

Mediakron.Import.topic = Mediakron.Import.abstract.extend({
    template: JST['settings.import.mk2.topic'],
    save:function(){
        var view = this, model = this.model;
        this.uploadRemote(function(){
            model.save({},{
                success: function(){
                    model.addToCollection();
                    Mediakron.createUrlMap();
                    Mediakron.Import.Mappings.topicMap[view.mk2id] = model;
                    view.remove();
                    topicId = model.get('mk2_topic');
                    if(topicId){
                        var uri = model.get('uri');
                        if(!Mediakron.Import.Relationships.topics[topicId]) Mediakron.Import.Relationships.topics[topicId] = [];
                        Mediakron.Import.Relationships.topics[topicId].push({uri:uri,data:false,weight:-500});
                    }
                    Mediakron.App.Events.trigger('import:done',{type:'topic',model:model});
                },
                error:function(){}
            });
        });
    }
});

Mediakron.Import.item = Mediakron.Import.abstract.extend({
    template: JST['settings.import.mk2.item'],
    save:function(){
        var view = this, model = this.model, uri, topicId, tagId, weight, mapId, topicURI, tagURI, mapURI, timelineURI, topic, tags, tag, maps, map, timeline;
        this.uploadRemote(function(){
            view.uploadDocument(function(){
                // add the right tag and topic relationships
                // get right topic uri
                var notes = model.get('mk2_notes'), type = model.get('type'), annotations = [], annotation, imageDimensions = model.get('mk2_imageDimensions'), height, width;
                var authorname = model.get('mk2_authorname');
                if(!authorname) authorname = ' ';
                
                if(Mediakron.Import.UserNames){ 
                    model.set('caption',authorname); 
                }
                if(type == 'progression'){
                    var basewidth = 750, baseheight = 490,
                        images = model.get('mk2_images'), children = [],
                        title = model.get('title'), i = 1, filepath = model.get('mk2_filepath'),
                        mk2id = model.get('mk2_id');
                        Mediakron.Import.Count.progressions = Mediakron.Import.Count.progressions+1;
                    _.each(images, function(image){
                        var childid = i;
                        console.log('processing child ids for cid'+childid);
                        var newChild = new Mediakron.Models.Item();
                                newChild.set('title',image.title);
                                newChild.set('caption',image.caption);
                                newChild.set('type','image');
                                newChild.set('countid',childid);
                                if(!Mediakron.Import.Relationships.progressions[mk2id]) Mediakron.Import.Relationships.progressions[mk2id] = [];
                                Mediakron.Import.Relationships.progressions[mk2id][childid] = {'countid':childid};
                        Mediakron.Import.uploadRemote(filepath+image.path.replace(/\+/g,' '),image.path,function(result){
                            if(result){
                                newChild.set('image',{'uri': result});
                                newChild.save({},{
                                    success:function(){
                                        newChild.addToCollection();
                                        Mediakron.createUrlMap();
                                        var uri = newChild.get('uri'), k = newChild.get('countid');
                                            Mediakron.Import.Relationships.progressions[mk2id][k] = {
                                                'uri':uri,
                                                'data': {
                                                top: (image.y/baseheight)*100+'%',
                                                left: (image.x/basewidth)*100+'%',
                                                height: (image.height/baseheight)*100+'%',
                                                width: (image.width/basewidth)*100+'%'
                                            }
                                        };
                                    }
                                });
                                
                            }
                        });
                        i++;
                    });
                }
                
                
                if(notes){
                    
                    if(notes.length > 0 && imageDimensions){
                        height = imageDimensions.height;
                        width = imageDimensions.width;
                        _.each(notes,function(note){
                            annotation = {
                                'uri': 'annotation:'+Mediakron.user.get('id')+':'+$.now(),
                                'data': {
                                    'text': note.text,
                                    'width': (note.width/width)*100,
                                    'height': (note.height/height)*100,
                                    'left': (note.left/width)*100,
                                    'top': (note.top/height)*100,
                                }
                            };
                            if(annotations){
                                annotations.push(annotation);
                            }
                            
                        });
                        if(annotations){
                            model.setRelationship('annotations',annotations);
                        }
                    }
                }
                
                model.save({},{
                    success: function(){
                        model.addToCollection();
                        Mediakron.createUrlMap();
                        uri = model.get('uri');
                        Mediakron.Import.Mappings.itemMap[view.mk2id] = model;
                        if(type == 'progression'){
                            if(!Mediakron.Import.Mappings.progressionMap) Mediakron.Import.Mappings.progressionMap = {};
                            Mediakron.Import.Mappings.progressionMap[view.mk2id] = model;
                        }
                        topicId = model.get('mk2_topic');
                        weight = model.get('mk2_weight');
                        if(!weight){
                            weight = 0;
                        }
                        if(topicId){
                            if(!Mediakron.Import.Relationships.topics[topicId]) Mediakron.Import.Relationships.topics[topicId] = [];
                            Mediakron.Import.Relationships.topics[topicId].push({uri:uri,data:false,weight:weight});
                        }
                        tags = model.get('mk2_tags');
                        _.each(tags,function(tag){
                            if(!Mediakron.Import.Relationships.tags[tag]) Mediakron.Import.Relationships.tags[tag] = [];
                            Mediakron.Import.Relationships.tags[tag].push({uri:uri,data:false});
                        });
                        maps = model.get('mk2_maps');
                        _.each(maps,function(marker,id){
                            if(!Mediakron.Import.Relationships.maps[id]) Mediakron.Import.Relationships.maps[id] = [];
                            Mediakron.Import.Relationships.maps[id].push(
                                { 
                                    uri: uri,
                                    data:{
                                        'type':'point',
                                        'coordinate': {
                                            'lat':marker.horizontal,
                                            'lng':marker.vertical
                                        }
                                    }
                                }
                            );
                        });
                        var start = false, end = false;
                        start = model.get('mk2_start');
                        end = model.get('mk2_end');
                        if(Mediakron.Import.Timeline && start){
                            var data = {};
                            data.start = {};
                            data.end = {};
                            if(start.billion !== "0")                     data.start.billion = start.billion;
                            if(start.million !== "0")                     data.start.million = start.million;
                            if(start.millenium !== "0")                   data.start.millenium = start.millenium;
                            if(start.year !== "0")                        data.start.year = start.year;
                            if(start.year !== "0" && start.month !== "0") data.start.month = start.month;
                            if(start.day !== "0")                         data.start.day = start.day;
                            if(start.hour !== "0")                        data.start.hour = start.hour;
                            if(start.minute !== "0")                      data.start.minute = start.minute;
                            if(start.second !== "0")                      data.start.second = start.second;
                                if(end.billion !== "0")                     data.end.billion = end.billion;
                                if(end.million !== "0")                     data.end.million = end.million;
                                if(end.millenium !== "0")                   data.end.millenium = end.millenium;
                                if(end.year !== "0")                        data.end.year = end.year;
                                if(end.year !== "0" && end.month !== "0")   data.end.month = end.month;
                                if(end.day !== "0")                         data.end.day = end.day;
                                if(end.hour !== "0")                        data.end.hour = end.hour;
                                if(end.minute !== "0")                      data.end.minute = end.minute;
                                if(end.second !== "0")                      data.end.second = end.second;
                            Mediakron.Import.Relationships.timeline.push({
                                uri:uri,
                                data: data
                            });
                        }
                        Mediakron.App.Events.trigger('import:done',{type:'item',model:model});
                        view.remove();
                    },
                    error:function(){
                        Mediakron.App.Events.trigger('import:done',{type:'item',model:model});
                    }
                });
            });
        });
    }
});

Mediakron.Import.tag = Mediakron.Import.abstract.extend({
    template: JST['settings.import.mk2.tag'],
    save:function(){
        var view = this, model = this.model;
        model.save({},{
            success: function(){
                model.addToCollection();
                Mediakron.createUrlMap();
                Mediakron.Import.Mappings.tagMap[view.mk2id] = model;
                view.remove();
                Mediakron.App.Events.trigger('import:done',{type:'tag',model:model});
            },
            error:function(){}
        });
    }
});

Mediakron.Import.map = Mediakron.Import.abstract.extend({
    template: JST['settings.import.mk2.map'],
    save:function(){
        var view = this, model = this.model;
        this.uploadRemote(function(){
            model.save({},{
                success: function(){
                    model.addToCollection();
                    Mediakron.createUrlMap();
                    Mediakron.Import.Mappings.mapMap[view.mk2id] = model;
                    view.remove();
                    Mediakron.App.Events.trigger('import:done',{type:'map',model:model});
                },
                error:function(){}
            });
        });
    }
});





Mediakron.Import.Initial = Mediakron.Extensions.View.extend({
    template: JST['settings.import.default'],
    rows: [],
    initialize: function () {

    }, 
    render: function () {
        this.$el.html(this.template());
        return this;
    },
    afterRender: function(){
    },
    events: {
        'dragenter #import-drag-area' : 'highlightDropZone',
        'dragleave #import-drag-area' : 'unhighlightDropZone',
        'drop #import-drag-area' : 'drop',
        'click #import-drag-area' : 'dropTest',
        'click #upload-file-button': 'triggerFile',
        'change .import-file': 'upload',
        'click .save-all': 'saveall',
        'dragover #import-drag-area': function(ev) {
            ev.preventDefault();
        }
    },
    triggerFile:function(){
        $('.import-file').click();
    },
    saveall: function(){
        var i = 0, total = this.rows.length,row;
        for(i; i<total;i++){
            row = this.rows[i];
            row.save();
        }
    },
    upload:function(evt){
        var files = evt.target.files;
        // files is a FileList of File objects. List some properties.
        var output = [], i=0, f, row, number = files.length;

        for (i; i < number; i++) {
            f = files[i];
            console.log(f);
            row = new Mediakron.Import.Row({file:f,event:evt});
            row.render().uploadImage();
            output.push(row);
            this.rows.push(row);
            $('#import-table tbody').append(row.$el);
            
        }
        $('.save-all').removeClass('hide');
        $('#import-table thead').removeClass('hide');
        
    },
    highlightDropZone: function(ev){
        ev.preventDefault();
        //$('#import-drag-area .upload-text').text('Drop your images here.');
    },
    unhighlightDropZone: function(ev){
        ev.preventDefault();
        //$('#import-drag-area .upload-text').text('Drag images here to upload them.');
    },
    drop: function(evt){
        evt.stopPropagation();
        evt.preventDefault();
        var e = evt.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        var files = e.dataTransfer.files;

        // files is a FileList of File objects. List some properties.
        var output = [], i=0, f, row, number = files.length;
        
        for (i; i < number; i++) {
            f = files[i];

                row = new Mediakron.Import.Row({file:f,event:evt,orig:e});
                row.render().uploadImage();
                output.push(row);
                this.rows.push(row);
                $('#import-table').append(row.$el);
            
        }
        $('.save-all').removeClass('hide');
    }

});



Mediakron.Import.Row = Mediakron.Extensions.View.extend({
    template: JST['settings.import.row'],
    file: false,
    promise: false,
    scope: false,
    type: false,
    initialize: function (data) {
        this.file = data.file;
        this.event = data.event;
        this.id = Math.floor(Math.random()*1000);
        this.model = new Mediakron.Models.Item();
        this.model.set('type','image');
        return this;
    },
    render: function () {
        var content = {
            id: this.id,
            file: this.file
        },
        html = this.template(content);
        this.setElement( $(html) );
        return this;
    },
    uploadImage: function(){
        var deferred = $.Deferred(),
            reader = new FileReader(),
            view = this;
        
        Mediakron.Status.uploadInProgress = true;
        
        reader.onload = function(e) {
            if(Mediakron.Settings.FileTypes.images.indexOf(view.file.type) > -1){
                Mediakron.Import.upload(deferred,view.file,e,view.$el);
                $('#row-'+view.id+' .bulk-thumbnail').html('<img class="thumb" src="' + e.target.result +'" title="'+ escape(view.file.name) + '"/>');
                $('#row-'+view.id+' .title').val(escape(view.file.name));
                view.model.set({title:view.file.name});
                view.model.set({'text':{ 'type':'image'}});
                view.type = 'image';
            }else if(Mediakron.Settings.FileTypes.text.indexOf(view.file.type) > -1){
                Mediakron.Import.upload(deferred,view.file,e,view.$el);
                $('#row-'+view.id+' .bulk-thumbnail').html('<span class="mk-icon mk-text" title="text"></span>');
                $('#row-'+view.id+' .title').val(escape(view.file.name));
                $('#row-'+view.id+' .item-type').val('text');
                view.model.set('type','text');
                view.model.set({title:view.file.name});
                view.type = 'text';
            }else{
                view.remove();
                Mediakron.message({
                     text:'We don\'t recognize this file type.  Please check to make sure you uploaded a valid file',
                     type:'warning',
                     timeout:6000,
                     layout: 'center',
                     dismiss:true,
                     });
            }
        };
        deferred.done(function(data){
            var type = view.model.get('type');
            if(type == 'text'){
                view.model.set({'text':{ 'type':'pdf','url':data.file}});
            }else{
                view.model.set({'image':{'uri':data.file}});
                view.model.set({'text':{ 'type':'image','url':data.file}});
            }
            
        });
        
        reader.readAsDataURL(this.file);
    },
    
    afterRender: function(){
    },
    events: {
        'click a':                         Mediakron.linkHandle,
        'click .done-editing':             'save',
        'click .cancel-editing':           'remove',
        'change .item-type':               'selectType',
        'change .audio-type':              'selectAudio',
        'change .video-type':              'selectVideo',
        'change .text-type':               'selectText',
        'blur .title':                     'setTitle',
        'blur .audio':                     'setAudio',
        'blur .video':                     'setVideo'
    },
    setTitle: function(e){
        var val = $(e.currentTarget).val();
        if(val !== ''){
            this.model.set({title:val});
            $('.done-editing',this.$el).removeClass('hide');
        }else{
            $('.done-editing',this.$el).addClass('hide');
        }
        
    },
    setAudio: function(e){
        var target = $(e.currentTarget), val = target.val(), data = this.model.get('audio');
        if(val !== ''){
            data.url = val;
            this.model.set({audio:data});
        }
        
    },
    setVideo: function(e){
        var target = $(e.currentTarget), val = target.val(), data = this.model.get('video');
        if(val !== ''){
            data.url = val;
            this.model.set({video:data});
        }
    },
    selectType: function(e){
        var target = $(e.currentTarget), val = target.val();
        $('.type-specific',this.$el).addClass('hide');
        $('.'+val,this.$el).removeClass('hide');
        if(val == 'image' || val == 'text'){
            $('td.types').addClass('hide');
        }else{
            $('td.types').removeClass('hide');
        }
        
        this.model.set({type:val});
        this.model.set({audio:{}});
        $('.audio').val('');
        this.model.set({video:{}});
        $('.video').val('');
        
    },
    selectAudio: function(e){
        var target = $(e.currentTarget), val = target.val(), data = this.model.get('audio');
        data.type = val;
        this.model.set({audio:data});
    },
    selectVideo: function(e){
        var target = $(e.currentTarget), val = target.val(), data = this.model.get('video');
        data.type = val;
        this.model.set({video:data});
    },
    selectText: function(e){
        var target = $(e.currentTarget), val = target.val(), data = this.model.get('text');
        data.type = val;
        this.model.set({text:data});
    },
    save:function(){
        
        var view = this, valid = true,
            // Validate model
            type = this.model.get('type'),
            title = this.model.get('title');
            
            if(!title || title === ''){
                $('.title').addClass('error');
                valid = false;
            }
        this.$el.html('<tr><td colspan=3>Saving '+title+'</td></tr>');
        switch (type) {
            case 'image':
                
            break;
            case 'audio':
                var audio = this.model.get('audio');
                if(!audio){
                    $('.audio-type').addClass('error');
                    $('.audio').addClass('error');
                    valid = false;
                    break;
                }
                if(!audio.type || audio.type === '' || !audio.url || audio.url === ''){
                    $('.audio-type').addClass('error');
                    $('.audio').addClass('error');
                    valid = false;
                    break;
                }
            break;
            case 'video':
                var video = this.model.get('video');
                if(!video){
                    $('.video-type').addClass('error');
                    $('.video').addClass('error');
                    valid = false;
                    break;
                }
                if(!video.type || video.type === '' || !video.url || video.url === ''){
                    $('.video-type').addClass('error');
                    $('.video').addClass('error');
                    valid = false;
                    break;
                }
            break;
            case 'text':
                var text = this.model.get('text');
            break;
            default:
                valid = false;
            break;
        }
        
        if(!valid){
            
        }else{
            this.model.save({},{
                success: function(){
                    view.model.addToCollection();
                    Mediakron.createUrlMap();
                    view.$el.empty();
                    Mediakron.message({
                        text: 'Saved',
                        type: 'success',
                        timeout:5000
                    });
                    
                },
                error: function(){
                    alert('um something has gone wrong!');
                }
            });
        }
        
        
    },
    remove: function(){
        this.$el.remove();
    }

});

Mediakron.Import.upload = function(deferred,file,e,scope){
    $.ajax({
        url:Mediakron.Data.upload,
        data: {uploadfilename: encodeURIComponent(file.name), file: e.target.result},
        type: "post",
        cache: false, 
        xhr: function(){
            var xhr = new window.XMLHttpRequest();
            //Upload progress
            xhr.upload.addEventListener("progress", function(evt){
                if (evt.lengthComputable) {
                    var percentComplete = Math.floor((evt.loaded / evt.total)*100);
                    //Do something with upload progress
                    $('.file-progress-bar .progress-bar',scope).width(percentComplete+'%');
                    $('.file-progress-text',scope).text("Loading "+percentComplete+'%');
                }
           }, false);
           //Download progress
           xhr.addEventListener("progress", function(evt){
             if (evt.lengthComputable) {
               var percentComplete = evt.loaded / evt.total;
             }
           }, false);
           return xhr;
         },
        success: function(event,message,response) {

            $('.file-progress-bar',scope).hide('slow');
            Mediakron.message({
                type: 'success',
                text: 'We\'ve uploaded your image.',
                timeout: 1000
            });
            var data = JSON.parse(event);
            deferred.resolve(data);
        },
        error: function(request) {
            $('.file-progress-bar',scope).hide('slow');
            Mediakron.message({
                text: 'Your upload has failed' ,
                timeout: 1000   
            });
            deferred.reject(request);
        }
    });
};
