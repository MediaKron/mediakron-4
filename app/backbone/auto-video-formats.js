// get the proper url to this item.  Either type/uri, item/uri, type/id, item/id in that order
    getURL: function() {
        var url = '',
            type = this.get('type'),
            id = this.id,
            uri = this.get('uri');
        if (uri) {
            return uri;
        }
    },
    goTo: function() {
        Mediakron.controller.gotoLast();
    },

    timeToSeconds: function(time) {
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
    },

    getVideo: function() {
        if (this.get('type') != 'video') { return false; }

        var video = this.get('video'),
            template = JST['regions.item.video.' + video.type];
        video.item = this;
        video.image = this.getStyledImage("full");
        video.item = this;
        if (!template) { return ''; }
        return template(video);
    },

    icon: function() {
        var icon = '',
            options = this.get('options');
        if (options.icon) icon = options.icon;
        return icon;
    },

    color: function(set) {

        var color = '',
            options = this.get('options');
        if (set) {
            options.color = set;
        }
        if (options.color) color = options.color;

        if (color === '') color = '#000000';
        return color;
    },

    getYouTubeUrl: function() {
        var video = this.get('video'),
            url = video.url,
            youtube = '//www.youtube.com/embed/';

        if (url) {
            url = url.replace("https://", '');
            url = url.replace("http://", '');
            url = url.replace("//", '');
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

    },
    //https://drive.google.com/file/d/0B36LdKxiyL7fSW9FMkhNQ2JKQnc/view?usp=sharing
    //https://drive.google.com/open?id=0B36LdKxiyL7fSW9FMkhNQ2JKQnc&authuser=0
    //https://drive.google.com/a/bu.edu/file/d/0B36LdKxiyL7fSW9FMkhNQ2JKQnc/edit
    getGoogleUrl: function() {
        var video = this.get('video'),
            url = video.url,
            google = 'https://docs.google.com/';
        if (url) {
            url = url.replace("https://", '');
            url = url.replace("http://", '');
            url = url.replace("//", '');
            url = url.replace("/preview", '');
            url = url.replace("/view", '');
            url = url.replace("/edit", '');
            url = url.replace('?usp=sharing', '');
            url = url.replace('/a/bu.edu', '');
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

    },
    getVimeoUrl: function() {
        var video = this.get('video'),
            url = video.url,
            vimeo = '//player.vimeo.com/video/';
        url = url.replace("player.vimeo.com/video/", '');
        url = url.replace("https://", '');
        url = url.replace("http://", '');
        url = url.replace("//", '');
        url = url.replace("www.", '');
        url = url.replace("vimeo.com/", '');


        return vimeo + url + '?title=0&byline=0&portrait=0';
    },

    getPanoptoUrl: function() {
        var video = this.get('video'),
            url = video.url;
        url = url.replace("http://", 'https://');

        var start = this.timeToSeconds(video.start);
        var end = this.timeToSeconds(video.end);

        if (start !== false) { /* if video has start/stop timecodes  */
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


    },

    getKanopyUrl: function() {
        var video = this.get('video'),
            url = video.url;
        url = url.replace("http://", 'https://');
        url = url.replace("bc-kanopystreaming-com.proxy.bu.edu/playlist/", 'bc.kanopystreaming.com/embed/');
        return url;
    },
    
    getPanoptoAudioUrl: function() {
            var audio = this.get('audio'),
                url = audio.url;
            url = url.replace("http://", 'https://');
    
            var start = this.timeToSeconds(audio.start);
            var end = this.timeToSeconds(audio.end);
    
            if (start !== false) { /* if video has start/stop timecodes  */
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
        },

    getGoogleUrlAudio: function() {
        var audio = this.get('audio'),
            url = audio.url,
            google = 'https://docs.google.com/';
        if (url) {
            url = url.replace("https://", '');
            url = url.replace("http://", '');
            url = url.replace("//", '');
            url = url.replace("/preview", '');
            url = url.replace("/view", '');
            url = url.replace("/edit", '');
            url = url.replace('?usp=sharing', '');
            url = url.replace('/a/bu.edu', '');
            url = url.replace("&authuser=0", '');
            url = url.replace('open?id=', 'file/d/');
            url = url.replace("docs.google.com/", '');
            url = url.replace("drive.google.com/", '');

            return google + url + '/preview';
        } else {
            return '';
        }
    },

    getSoundCloudUrl: function() {

        //get the Sound Cloud url from the form
        var audio = this.get('audio'),
        url = audio.url;
        
        if (url) {
            // strip down the URL 
            url = url.replace("https://", '');
            url = url.replace("http://", '');
            url = url.replace("//", '');

            // construct URL format required by Sound Cloud oEmbed
            var soundcloud = 'https://soundcloud.com/oembed?format=json&url=https%3A//';
            var soundcloudURL = soundcloud + url + "&color=666666";

            // extract the iframe embed snippet from the oembed JSON
            var soundcloudEmbed = false;
            return $.getJSON(soundcloudURL, function (json) {
                // Set the variables from the results array
                soundcloudEmbed = json.html;
                return soundcloudEmbed;
            });

        } else {
            return '';
        }
    },

    getBCurl: function(scale) {
        var video = this.get('video'),
            url = video.url,
            width = $('iframe').width(),
            height = $('iframe').height();

        url = url.replace("http://", 'https://');
        var start = this.timeToSeconds(video.start);
        var end = this.timeToSeconds(video.end);

        var duration = end - start;

        if (start !== false) {
            url = url + '?start=' + start;
            if (end !== false) url = url + '&stop=' + duration;
        }
        return url;
    },
   getArchiveorgVideo: function() {
       var video = this.get('video'),
           url = video.url;
       
       url = url.replace("archive.org/details", 'archive.org/embed');
       url = url.replace("/start/", '?start=');
       url = url.replace("/end/", '&end=');
           
       return url;
   },
    getBCAudioUrl: function() {
        var audio = this.get('audio'),
            url = audio.url;
        return url;
    },

    getAudioUrl: function() {
        var audio = this.get('audio'),
            url = audio.url;
        return url;
    },
    
    getArchiveorgAudio: function() {
        var audio = this.get('audio'),
            url = audio.url;
        
        url = url.replace("archive.org/details", 'archive.org/embed');
        url = url.replace("/start/", '?start=');
        url = url.replace("/end/", '&end=');
            
        return url;
    },
    
    getVideoUrl: function() {
        var audio = this.get('video'),
            url = audio.url;
        return url;
    },

    loadVideo: function() {
        var video = this.get('video'),
            type = video.type;

        switch (type) {
            case 'mp4':
                $('audio,video').mediaelementplayer({
                    videoWidth: -1,
                    videoHeight: -1,
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'm4v':
                $('audio,video').mediaelementplayer({
                    videoWidth: -1,
                    videoHeight: -1,
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'flv':
                $('audio,video').mediaelementplayer({
                    videoWidth: -1,
                    videoHeight: -1,
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'rtmp':
                $('audio,video').mediaelementplayer({
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            default:
                break;
        }
    },

    getAudio: function() {
        if (this.get('type') != 'audio') { return false; }
        var audio = this.get('audio'),
            template = JST['regions.item.audio.' + audio.type];
        audio.image = this.getStyledImage("full");
        audio.item = this;
        if (!template) { return ''; }
        return template(audio);
        
    },

    loadAudio: function() {
        var audio = this.get('audio'),
            type = audio.type,
            player;

        switch (type) {
            case 'mp3':
                player = $('audio,video').mediaelementplayer({
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'rtmp':
                player = $('audio,video').mediaelementplayer({
                    mode: 'shim',
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'm4a':
                player = $('audio,video').mediaelementplayer({
                    mode: 'shim',
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            case 'mp4':
                player = $('audio,video').mediaelementplayer({
                    mode: 'shim',
                    success: function(player, node) {
                        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    }
                });
                break;
            default:
                break;
        }
        return player;
    },

    startSerial: false,
    endSerial: false,
    items: false,
    sorted: false,
    weight: 0,
    // Check to see if this item has a particular topic or tag
    hasTopicOrTag: function(top, tag) {
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
    }