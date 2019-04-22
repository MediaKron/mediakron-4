import Model from "@/store/utils/model";
import config from '@/config';

import ImageIcon from "@/assets/item-icons/image.svg";
import FileIcon from "@/assets/item-icons/file.svg";
import AudioIcon from "@/assets/item-icons/audio.svg";
import VideoIcon from "@/assets/item-icons/video.svg";
import MapIcon from "@/assets/item-icons/map.svg";
import StoryIcon from "@/assets/item-icons/story.svg";
class Item extends Model {
    
    /**
     * 
     * @param {*} data 
     * @param {*} site 
     */
    constructor(data, site) {
        super(data)
        this.site = site
        console.log(this)
        return this;
    }

    /**
     * Get the url to this item
     * @return string
     */
    url(){
        return '/' + this.site.uri + '/' + this.uri;
    }

    /**
     * Defining allowed types of uploadable files
     * @return string
     */
    allowedTypes(){
        switch(this.type){
            case 'text':
            case 'file':
                return '.pdf, .xls, .xlsx, .txt, .ppt, .pptx, .doc, .docx, .jpg, .png, .gif';
            case 'video':
                return '.wmv, .mp4, .m4v, .mov';
            case 'audio':
                return '.mp3, .m4a';
            default:
                return '.jpg, .png, .gif';
        }
    }
    
    imageUrl(style){
        if(!this.thumbnail || this.thumnbail == ''){
            // TODO: Insert thumbnails here
            //global assetPath=''
            switch(this.type){
                case 'image':
                    // return 'https://picsum.photos/50/50/?image=56';
                    return ImageIcon;
                case 'text':
                case 'file':
                   // return 'https://picsum.photos/50/50/?image=54';
                    return FileIcon;
                case 'video':
                // return 'https://picsum.photos/50/50/?image=55';
                    return VideoIcon;
                case 'audio':
                    // return 'https://picsum.photos/50/50/?image=56';
                    return AudioIcon;
                case 'story':
                    // return 'https://picsum.photos/50/50/?image=55';
                    return StoryIcon;
                case 'map':
                    // return 'https://picsum.photos/50/50/?image=56';
                    return MapIcon;
                default:
                   // return 'https://picsum.photos/50/50/?image=57';
                    return ImageIcon;
            }
            //return 'https://picsum.photos/50/50/?image=54';
        } 
        var url = config.STORAGE_PUBLIC + '/' + this.site.uri;
        if(style){
            url += '/styles/' + style; 
        }
        return url + '/' + this.thumbnail;
    }

    color(){
        if(!this.color){
            return this.site.banner_color;
        }
        return this.color;
    }

    zoom(){
        return 1;
    }
    maxZoom(){
        return 1;
    }
    minZoom(){
        return 1;
    }
    center(){
        return { lat: 51.505, lng: -0.09 };
    }
    tiles(){
        return 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png';
    }
    attribution(){
      return 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.';
    }


    defaults(){
        return {
            id: null,
            created: 0,
            changed: 0,
            version: 0,
            published: true,
            archived: false,
            user: 0,
            editor: false,
            template: 'default',
            options: {},
            uri: false,
            time: false,
            type: '',
            title: '',
            description: '',
            transcript: '',
            body: '',
            caption: '',
            image: '',
            audio: {},
            video: {},
            text: {},
            height: 0,
            width: 0,
            center: [0, 0],
            size: {},
            zoom: 2,
            thumbnail: false,
            projection: 'EPSG:3857',
            date: {
                start: false,
                end: false,
            },
            map: {
                url: ''
            },
            timeline: {
                scope: '',
                granularity: '',
                start: '',
                end: '',
            },
            overlay: {},
            tags: [],
            relationships: {
                topics: [],
                tags: [],
                maps: [],
                timelines: [],
                comparisons: [],

                events: [],
                layers: [],
                children: [],
                comments: [],
                annotations: [],
                citations: [],
            },

            metadata: {
                source: "source",
                citation: "",
                description: "",
                published: "",
                creator: "",
                publisher: "",
                contributor: "",
                format: "",
                identifier: "",
                language: "",
                relation: "",
                coverage: "",
                medium: "",
                provenance: "",
                SizeOrDuration: "",
                subject: "",
                location: "",
                rights: ""
            },
        }
    }
    /* Render the default version of this topic */
    /*getView(template) {
        var view;
        switch (this.get('type')) {
            case 'story':
                view = new Mediakron.Pages.story(this);
                break;
            case 'audio':
                view = new Mediakron.Pages.audio(this);
                break;
            case 'image':
                view = new Mediakron.Pages.image(this);
                break;
            case 'video':
                view = new Mediakron.Pages.video(this);
                break;
            case 'text':
                view = new Mediakron.Pages.text(this);
                break;
            case 'file':
                view = new Mediakron.Pages.file(this);
                break;
            case 'narrative':
                view = new Mediakron.Pages.narrative(this);
                break;
            case 'slideshow':
                view = new Mediakron.Pages.slideshow(this);
                break;
            case 'tag':
                view = new Mediakron.Pages.tag(this);
                break;
            case 'layer':
                view = new Mediakron.Pages.layer(this);
                break;
            case 'topic':
                view = new Mediakron.Pages.topic(this);
                break;
            case 'comparison':
                view = new Mediakron.Pages.comparison(this);
                break;
            case 'folder':
                view = new Mediakron.Pages.folder(this);
                break;
            case 'progression':
                view = new Mediakron.Pages.progression(this);
                break;
            case 'map':
            case 'osm':
            case 'carto-voyager':
            case 'stamen-light':
            case 'stamen':
            case 'stamen-watercolor':
            case 'image-map':
            case 'cartodb':
                view = new Mediakron.Pages.map(this);
                break;
            case 'timeline':
                view = new Mediakron.Pages.timeline(this);
                break;
        }
        if (template) {
            view.layout = template;
            view.full = false;
        }
        return view;
    }

    changedSince(time) {
         get changed
        var changed = this.get('changed');
        if (!time) time = Mediakron.user.lastVisit();
        if (time < changed) return true;
        return false;
    }

    newSince(time) {
        var created = this.get('created');
        if (!time) time = Mediakron.user.lastVisit();
        if (time < created) return true;
        return false;
    }

    isUpdated(time) {
         get changed
        var changed = this.get('changed');
        if (Mediakron.user.lastVisit() < changed) return true;
        return false;
    }
    isCreated() {
        var created = this.get('created');
        if (Mediakron.user.lastVisit() < created) return true;
        return false;
    }

    addToCollection() {
        Mediakron.items.add(this);
    }



     defaults() {
         return {
             id: null,
             created: 0,
             changed: 0,
             version: 0,
             published: true,
             archived: false,
             user: Mediakron.user,
             editor: false,
             template: 'default',
             options: {},
             uri: false,
             time: false,
             type: '',
             title: '',
             description: '',
             transcript: '',
             body: '',
             caption: '',
             image: '',
             audio: {},
             video: {},
             text: {},
             height: 0,
             width: 0,
             center: [0, 0],
             size: {},
             zoom: 2,
             projection: 'EPSG:3857',
             date: {
                 start: false,
                 end: false,
             },
             map: {
                 url: ''
             },
             timeline: {
                 scope: '',
                 granularity: '',
                 start: '',
                 end: '',
             },
             overlay: {},
             relationships: {
                 topics: [],
                 tags: [],
                 maps: [],
                 timelines: [],
                 comparisons: [],

                 events: [],
                 layers: [],
                 children: [],
                 comments: [],
                 annotations: [],
                 citations: [],
             },

             metadata: {
                 source: "",
                 citation: "",
                 description: "",
                 published: "",
                 creator: "",
                 publisher: "",
                 contributor: "",
                 format: "",
                 identifier: "",
                 language: "",
                 relation: "",
                 coverage: "",
                 medium: "",
                 provenance: "",
                 SizeOrDuration: "",
                 subject: "",
                 location: "",
                 rights: ""
             }
         };
     }

    editor() {
        var editor = this.get('editor');
        if (editor) {
            if (editor.name) return editor.name;
        }
        return '';
    }

     get the proper url to this item.  Either type/uri, item/uri, type/id, item/id in that order
    getURL() {
        var url = '',
            type = this.get('type'),
            id = this.id,
            uri = this.get('uri');
        if (uri) {
            return uri;
        }
    }
    goTo() {
        Mediakron.controller.gotoLast();
    }

    timeToSeconds(time) {
        if (time) {
            if (time !== '') {
                if (time.indexOf(':') > -1) {
                    var split = time.split(':'),
                        hour = 0,
                        min = 0,
                        sec = 0,
                        timecode = 0;

                    if (split.length == 3) {
                        hour = parseInt(split[0], 10);
                        min = parseInt(split[1], 10);
                        sec = parseInt(split[2], 10);
                    } else if (split.length == 2) {
                        min = parseInt(split[0], 10);
                        sec = parseInt(split[1], 10);
                    }
                    timecode = (hour * 60 * 60) + (min * 60) + sec;
                    return timecode;
                } else {
                    return parseInt(time, 10);
                }
            }
        }
        return false;
    }

    getVideo() {
        if (this.get('type') != 'video') { return false; }

        var video = this.get('video'),
            template = JST['regions.item.video.' + video.type];
        video.item = this;
        video.image = this.getStyledImage("full");
        video.item = this;
        if (!template) { return ''; }
        return template(video);
    }

    icon() {
        var icon = '',
            options = this.get('options');
        if (options.icon) icon = options.icon;
        return icon;
    }

    color(set) {

        var color = '',
            options = this.get('options');
        if (set) {
            options.color = set;
        }
        if (options.color) color = options.color;

        if (color === '') color = '#000000';
        return color;
    }

    getYouTubeUrl() {
        var video = this.get('video'),
            url = video.url,
            youtube = 'www.youtube.com/embed/';

        if (url) {
            url = url.replace("https:", '');
            url = url.replace("http:", '');
            url = url.replace("", '');
            url = url.replace("www.", '');
            url = url.replace("youtu.be/", '');
            url = url.replace("youtube.com/embed/", '');
            url = url.replace("youtube.com/watch?v=", '');
            url = url.replace("&feature=youtu.be", '');
            url = url.replace("&feature=plcp", '');
            url = youtube + url;

            var start = this.timeToSeconds(video.start);
            var end = this.timeToSeconds(video.end);

            if (start !== false) {
                url = url + '?start=' + start;
                if (end !== false) url = url + '&end=' + end;
            }
            return url;
        } else {
            return '';
        }

    }
    https:drive.google.com/file/d/0B36LdKxiyL7fSW9FMkhNQ2JKQnc/view?usp=sharing
    https:drive.google.com/open?id=0B36LdKxiyL7fSW9FMkhNQ2JKQnc&authuser=0
    https:drive.google.com/a/bc.edu/file/d/0B36LdKxiyL7fSW9FMkhNQ2JKQnc/edit
    getGoogleUrl() {
        var video = this.get('video'),
            url = video.url,
            google = 'https:docs.google.com/';
        if (url) {
            url = url.replace("https:", '');
            url = url.replace("http:", '');
            url = url.replace("", '');
            url = url.replace("/preview", '');
            url = url.replace("/view", '');
            url = url.replace("/edit", '');
            url = url.replace('?usp=sharing', '');
            url = url.replace('/a/bc.edu', '');
            url = url.replace("&authuser=0", '');
            url = url.replace('open?id=', 'file/d/');
            url = url.replace("docs.google.com/", '');
            url = url.replace("drive.google.com/", '');

            url = google + url + '/preview';

            var start = this.timeToSeconds(video.start);
            var end = this.timeToSeconds(video.end);

            if (start !== false) {
                url = url + '?start=' + start;
                if (end !== false) url = url + '&end=' + end;
            }
            return url;
        } else {
            return '';
        }

    }

    getVimeoUrl() {
        var video = this.get('video'),
            url = video.url,
            vimeo = 'player.vimeo.com/video/';
        url = url.replace("player.vimeo.com/video/", '');
        url = url.replace("https:", '');
        url = url.replace("http:", '');
        url = url.replace("", '');
        url = url.replace("www.", '');
        url = url.replace("vimeo.com/", '');


        return vimeo + url + '?title=0&byline=0&portrait=0';
    }

    getPanoptoUrl() {
        var video = this.get('video'),
            url = video.url;
        url = url.replace("http:", 'https:');

        var start = this.timeToSeconds(video.start);
        var end = this.timeToSeconds(video.end);

        if (start !== false) {  if video has start/stop timecodes
            url = url.replace(".mp4", '');
            url = url.replace("bc.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=", 'bc.hosted.panopto.com/Panopto/Podcast/Stream/');
            url = url + '.mp4';

            url = url + '#t=' + start;
            if (end !== false) url = url + ',' + end;

            return '<video class="panopto-video" src="' + url + ' " controls>Sorry, you will need to update your browser to view this video. </video>';
        } else {

            url = url.replace("bc.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=", 'bc.hosted.panopto.com/Panopto/Pages/Embed.aspx?id=');

            return '<div class="panopto-container"><iframe src="' + url + '" width="100%" height="100%" style="padding: 0px; border: 1px solid #464646;" frameborder="0"></iframe></div>';
        }


    }

    getKanopyUrl() {
        var video = this.get('video'),
            url = video.url;
        url = url.replace("http:", 'https:');
        url = url.replace("bc-kanopystreaming-com.proxy.bc.edu/playlist/", 'bc.kanopystreaming.com/embed/');
        return url;
    }

    getPanoptoAudioUrl() {
        var audio = this.get('audio'),
            url = audio.url;
        url = url.replace("http:", 'https:');

        var start = this.timeToSeconds(audio.start);
        var end = this.timeToSeconds(audio.end);

        if (start !== false) {  if video has start/stop timecodes  
            url = url.replace(".mp4", '');
            url = url.replace("bc.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=", 'bc.hosted.panopto.com/Panopto/Podcast/Stream/');
            url = url + '.mp4';

            url = url + '#t=' + start;
            if (end !== false) url = url + ',' + end;

            return '<audio class="panopto-audio" src="' + url + ' " controls>Sorry, you will need to update your browser to view this video. </audio>';
        } else {

            url = url.replace("bc.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=", 'bc.hosted.panopto.com/Panopto/Pages/Embed.aspx?id=');

            return '<div class="panopto-container"><iframe src="' + url + '" width="100%" height="100%" style="padding: 0px; border: 1px solid #464646;" frameborder="0"></iframe></div>';
        }
    }

    getGoogleUrlAudio() {
        var audio = this.get('audio'),
            url = audio.url,
            google = 'https:docs.google.com/';
        if (url) {
            url = url.replace("https:", '');
            url = url.replace("http:", '');
            url = url.replace("", '');
            url = url.replace("/preview", '');
            url = url.replace("/view", '');
            url = url.replace("/edit", '');
            url = url.replace('?usp=sharing', '');
            url = url.replace('/a/bc.edu', '');
            url = url.replace("&authuser=0", '');
            url = url.replace('open?id=', 'file/d/');
            url = url.replace("docs.google.com/", '');
            url = url.replace("drive.google.com/", '');

            return google + url + '/preview';
        } else {
            return '';
        }
    }

    getBCurl(scale) {
        var video = this.get('video'),
            url = video.url,
            width = $('iframe').width(),
            height = $('iframe').height();

        url = url.replace("http:", 'https:');
        var start = this.timeToSeconds(video.start);
        var end = this.timeToSeconds(video.end);

        var duration = end - start;

        if (start !== false) {
            url = url + '?start=' + start;
            if (end !== false) url = url + '&stop=' + duration;
        }
        return url;
    }

    getArchiveorgVideo() {
        var video = this.get('video'),
            url = video.url;

        url = url.replace("archive.org/details", 'archive.org/embed');
        url = url.replace("/start/", '?start=');
        url = url.replace("/end/", '&end=');

        return url;
    }

    getBCAudioUrl() {
        var audio = this.get('audio'),
            url = audio.url;
        return url;
    }

    getAudioUrl() {
        var audio = this.get('audio'),
            url = audio.url;
        return url;
    }

    getArchiveorgAudio() {
        var audio = this.get('audio'),
            url = audio.url;

        url = url.replace("archive.org/details", 'archive.org/embed');
        url = url.replace("/start/", '?start=');
        url = url.replace("/end/", '&end=');

        return url;
    }

    getVideoUrl() {
        var audio = this.get('video'),
            url = audio.url;
        return url;
    }

    loadVideo() {
        var video = this.get('video'),
            type = video.type;

        switch (type) {
            case 'mp4':
                $('audio,video').mediaelementplayer({
                    videoWidth: -1,
                    videoHeight: -1,
                    success(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'm4v':
                $('audio,video').mediaelementplayer({
                    videoWidth: -1,
                    videoHeight: -1,
                    success(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'flv':
                $('audio,video').mediaelementplayer({
                    videoWidth: -1,
                    videoHeight: -1,
                    success(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'rtmp':
                $('audio,video').mediaelementplayer({
                    success(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            default:
                break;
        }
    }

    getAudio() {
        if (this.get('type') != 'audio') { return false; }
        var audio = this.get('audio'),
            template = JST['regions.item.audio.' + audio.type];
        audio.image = this.getStyledImage("full");
        audio.item = this;
        if (!template) { return ''; }
        return template(audio);
    }

    loadAudio() {
        var audio = this.get('audio'),
            type = audio.type,
            player;

        switch (type) {
            case 'mp3':
                player = $('audio,video').mediaelementplayer({
                    success(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'rtmp':
                player = $('audio,video').mediaelementplayer({
                    mode: 'shim',
                    success(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'm4a':
                player = $('audio,video').mediaelementplayer({
                    mode: 'shim',
                    success(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'mp4':
                player = $('audio,video').mediaelementplayer({
                    mode: 'shim',
                    success(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            default:
                break;
        }
        return player;
    }

    
     Check to see if this item has a particular topic or tag
    hasTopicOrTag(top, tag) {
        var tid = this.get('tid'),
            tags = this.get('tags'),
            topicPassed = false,
            tagPassed = false;
        if (top) {
            if (Mediakron.Settings.filterByTopics[tid]) {
                topicPassed = true;
            }
        } else {
            topicPassed = true;
        }
        if (tag) {
            var any = _.intersection(_.keys(Mediakron.Settings.filterByTags), _.keys(tags));
            if (any.length > 0) {
                tagPassed = true;
            }
        } else {
            tagPassed = true;
        }
        if (tagPassed && topicPassed) {
            return true;
        }
        return false;
    }*/
}
export default Item;