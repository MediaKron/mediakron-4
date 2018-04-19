/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


// Item List render view
Mediakron.Regions = {};

// Item render view
Mediakron.Regions.ItemView = Backbone.View.extend({
    template: JST['regions.item.view'],
    render: function () {
        this.pane = this.template(this.model.toJSON());
        return this;
    }
});

// Item List render view
Mediakron.Regions.ItemList = Backbone.View.extend({
    template: JST['regions.item.list'],
    render: function () {
        var content = {
            items: Mediakron.Status.itemsInTopic
        };
        this.pane = this.template(content);
        return this;
    }
});

// Splash Image render view
Mediakron.Regions.SplashImage = Backbone.View.extend({
    template: JST['regions.splash.image'], 
    render: function () {
        this.pane = this.template(this.model.toJSON());
        return this;
    }
});

// Slideshow render view
Mediakron.Regions.SlideshowView = Backbone.View.extend({
    template: JST['regions.item.slideshow'],

    render: function () {
        var content = {
            items: Mediakron.Status.itemsInTopic
        };
        this.pane = this.template(content);
        return this;
    }
});

// Comment render view
Mediakron.Regions.CommentView = Backbone.View.extend({
    template: JST['render-functions-comments'],

    render: function () {
        this.pane = this.template({
            comments: this.model.comments
        });
        return this;
    }
});

// Item render view
Mediakron.Regions.TopicView = Backbone.View.extend({
    template: JST['regions.topic.view'],
    render: function () {
        this.pane = this.template(this.model.toJSON());
        return this;
    } 
});

// Small Timeline render view
    Mediakron.TimelineSmallView = Backbone.View.extend({
        //el: $('#mediakron-content-wrapper'), // el attaches to existing element
        template: JST['render-functions-timeline'],

        render: function () {
            var topic_id = this.model.id,
            filteredItems = Mediakron.items.filter(function (item) {
                return item.get("topics") === topic_id;
            }),
            content = {
                items: filteredItems
            };
            this.pane = this.template(content);
            return this;
        }
    });
    
    //TODO: Clean this stuff up

Mediakron.Regions.MapView = Backbone.View.extend({
    template: JST['regions.map'],

    render: function() {
        var topic_id = this.model.id;
        var filteredItems = Mediakron.items.filter(function(item){
            return item.get("topics") === topic_id;
        });
        var cur = Mediakron.Status.CurrentItem;
        console.log(cur);
        var curItem = Mediakron.items.get(cur);
        var onMap = curItem.get('onMap');
        if(onMap){
            var links = '',
                itemMaps = curItem.get('maps');
            if(Mediakron.Status.OverrideMap){
                Mediakron.Status.DefaultMap = Mediakron.Status.OverrideMap;
            }else{
                var defaultMap = _.filter(itemMaps,function(map){
                    if(map.defaultmap == '1'){
                        return true;
                    }
                    return false;
                });
                var dMap;
                if(defaultMap.length === 0){
                    Mediakron.Settings.DefaultMap = 0;
                }else{
                    Mediakron.Settings.DefaultMap = defaultMap[0].map_id;
                }
            }
            Mediakron.maps.sort();

            var related = "";
            var other = false, 
                mapTitle,
                idx,
                map_title;

            for (idx in Mediakron.maps.models) {
                var map_item = Mediakron.maps.models[idx];
                var map_id = map_item.get("id");
                var markers = map_item.get('markers');
                if(markers[cur]){
                    addClass = ' onMap';
                    map_title = map_item.get("title");
                    related = related+'<li><a mapid="'+map_id+'" class="swap-map-'+map_id+' swap-map'+addClass+'">'+map_title+'</a></li>';
                }else{
                    addClass = ' notOnMap';
                    map_title = map_item.get("title");
                    if(!other){
                        other = "<strong>Other Maps</strong>";
                    }
                    other = other+'<li><a mapid="'+map_id+'" class="swap-map-'+map_id+' swap-map'+addClass+'">'+map_title+'</a></li>';
                }
            }
            if(!other){
                other = '';
            }
            links = '<ul>'+links+related+other+'</ul>';

            if(Mediakron.Status.DefaultMap !== 0){
                Mediakron.Status.CurrentMap = Mediakron.Status.DefaultMap;
                mapTitle = Mediakron.maps.get(Mediakron.Status.CurrentMap).get('title');
            }else if(Mediakron.maps.first()){
                mapTitle = Mediakron.maps.first().get('title');
            }else{
                mapTitle = '';
            }
            var content = {
                items: filteredItems,
                maplinks: links,
                currentMapTitle: mapTitle
            };
            this.pane = this.template(content);
        }else{
            this.pane = '<div id="mediakron_item_nomap"></div';
        }
        return this;
    }
});

Mediakron.HistoryView = Backbone.View.extend({
    template: JST['render-history'],
    render: function () {

        if (!Mediakron.history) {
            Mediakron.history = new Mediakron.History();
        }else{
            Mediakron.history.initialize();
        }
        var content = {
            items: Mediakron.history
        };
        $('#mediakron-history-event-list').remove();
        $('#mediakron-history-events').empty();

        var el = $(this.el).html(this.template(content));
        $('<div/>', {
            'id': 'mediakron-history-event-list'
        }).html(el).appendTo('#mediakron-history-events');
        this.delegateEvents();
        return this;
    },
    events: {
        "click a.mediakron-event": "doHandle"
    },
    doHandle: function (e) {
        e.preventDefault();
        var target = e.currentTarget;
        $('#mediakron-history-main').hide();
        Mediakron.historyView.close();
        $("#mediakron-history-link").text('History');
        Mediakron.Settings.history = 0;
        var query = Mediakron.Events.Parse(target);
        Mediakron.Events.Handle(query, false);
    }
});
