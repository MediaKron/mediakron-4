/*jshint scripturl:true*/
/**
 * Useful functions
 */
Mediakron.idMap = {};
Mediakron.urlMap = {};
Mediakron.setPollQuery = function(item, status) {
    if (!status) status = 'view';
    if (item) {
        Mediakron.Status.PollQuery = '?item=' + item.id + '&uri=' + item.get('uri') + '&status=' + status;
    } else {
        Mediakron.Status.PollQuery = '';
    }
};
Mediakron.closeOverlay = function(e) {
    e.preventDefault();
    if (Mediakron.Status.formChanged) {
        text = "You have unsaved changes on this form.  Are you sure you want to cancel?";
        accept = function(request) {
            Mediakron.Status.formChanged = false;
            Mediakron.controller.gotoLast();
        };
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay  */
        reject = function(request) {};
        Mediakron.message({
            text: text,
            type: 'warning',
            timeout: 3000,
            layout: 'center',
            confirm: true,
            callback: function() {
                accept();
            },
            cancel: function() {
                reject();
            }
        });
    } else {
        Mediakron.controller.gotoLast();
        Mediakron.closeFadeScreen(); /* close the fade-screen overlay if it's visible  */
    }
    return false;
};
Mediakron.back = function() {
    window.history.back();
};
Mediakron.typeCanSelect = function(type, context) {
    if (!context) return true;
    var normal = context.getNormalType();
    if (Mediakron.Contexts[normal].children.indexOf(type) > -1) return true;
    return false;
};
// allow us to look up ids by url
Mediakron.createUrlMap = function() {
    var urls = {},
        ids = {
            'topics': {},
            'timelines': {},
            'maps': {},
            'comparisons': {},
            'items': {}
        },
        id, url,
        annotations, annotation,
        i = 0,
        length;

    Mediakron.items.each(function(item) {
        url = item.get('uri');
        if (url) {
            id = item.get('id');
            if (urls[url]) {
                url = Mediakron.uniquify(url, urls);
                item.set('uri', url);
            }
            urls[url] = {
                id: id,
                type: 'items',
                entity: item.get('type')
            };
            ids.items[id] = item.getURL();

        }
    });
    Mediakron.idMap = ids;
    Mediakron.urlMap = urls;
};
Mediakron.availableTags = function(list) {
    var tags = Mediakron.items.where({
            type: "tag"
        }),
        number = tags.length,
        i = 0,
        title;
    if (list) {
        var output = [];
        for (i; i < number; i++) {
            output.push(tags[i].get('title'));
        }
        return output;
    } else {
        return tags;
    }
};
Mediakron.split = function(val) {
    return val.split(/,\s*/);
};
Mediakron.extractLast = function(term) {
    return Mediakron.split(term).pop();
};
Mediakron.goFullScreen = function(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
    var height = 100;
    if (Mediakron.Settings.Appearance.navigation == 'left') {
        height = height - 40;
    }
    $('#main').height(Mediakron.Status.Height - height);
};
Mediakron.exitFullScreen = function(element) {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};
Mediakron.getItemFromURI = function(uri) {
    var id, collection;
    if (!uri) return false;
    if (typeof(uri) == 'object') uri = uri.uri;
    if (!Mediakron.urlMap[uri]) {
        return false;
    }
    id = Mediakron.urlMap[uri];
    collection = Mediakron[id.type];
    return collection.get(id.id);
};
Mediakron.getInfoFromURI = function(uri) {
    var id, collection;
    id = Mediakron.urlMap[uri];
    return id;
};
Mediakron.Theme = {};
Mediakron.RequestsCompleted = (function() {
    var numRequestToComplete, requestsCompleted, callBacks, singleCallBack, percent, percentComplete = 0;
    return function(options) {
        if (!options) options = {};
        numRequestToComplete = options.numRequest || 0;
        requestsCompleted = options.requestsCompleted || 0;
        percent = 100 / numRequestToComplete;
        callBacks = [];
        var fireCallbacks = function() {
            for (var i = 0; i < callBacks.length; i++) callBacks[i]();
        };
        if (options.singleCallback) callBacks.push(options.singleCallback);
        this.addCallbackToQueue = function(isComplete, callback) {
            if (isComplete) requestsCompleted++;
            if (callback) callBacks.push(callback);
            if (requestsCompleted == numRequestToComplete) fireCallbacks();
        };
        this.requestComplete = function(isComplete, eventLabel) {
            percentComplete = percentComplete + percent;
            //Mediakron.messages.progress(eventLabel, Math.round(percentComplete));
            if (isComplete) requestsCompleted++;
            if (requestsCompleted == numRequestToComplete) fireCallbacks();
        };
        this.setCallback = function(callback) {
            callBacks.push(callBack);
        };
    };
})();
Mediakron.themeLink = function(contents, url, html) {
    return Mediakron.Theme.link(contents, url, html);
};
Mediakron.Theme.link = function(contents, url, html) {
    var basepath = Mediakron.Settings.baseurl;
    return '<a href="' + basepath + url + '" class="link">' + contents + '</a>';
};
Mediakron.nextInTopic = function() {
    var found = false;
    var next = false;
    $.each(Mediakron.Status.itemsInTopic, function(id, item) {
        if (found) {
            next = item.get('id');
            return false;
        }
        if (item.get('id') == Mediakron.Status.CurrentItem) {
            found = true;
        }
    });
    return next;
};
Mediakron.previousInTopic = function() {
    var found = false,
        holder = false,
        previous = false;
    $.each(Mediakron.Status.itemsInTopic, function(id, item) {
        if (item.get('id') == Mediakron.Status.CurrentItem && holder) {
            previous = holder.get('id');
            return false;
        }
        holder = item;
    });
    return previous;
};
Mediakron.displayFilterInfo = function(tags, id) {
    var show = '',
        size = _.size(tags),
        currLength = 0,
        length, display;
    if (size === 0) {
        $(id).text('None Selected');
        return false;
    }
    if (tags.all == 'all') {
        $(id).text('All Selected');
        return false;
    }
    _.each(tags, function(tag) {
        if (size == 1) {
            show = tag;
            return false;
        }
        length = tag.length;
        show = show + tag + ', ';
        currLength = currLength + length;
    });
    if (show.length > 38) {
        display = show.substring(0, 35).replace(/, $/, "") + ' ... ';
    } else {
        display = show.replace(/, $/, "");
    }
    $(id).text(display);
};
Mediakron.constructFilter = function(filter) {
    var i = 0,
        id;
    if (filter.topics) {
        Mediakron.Status.filterByTopics = {};
        var topics = filter.topics.split(',');
        for (i; i < topics.length; i++) {
            if (topics[i] === 0) {
                continue;
            }
            id = parseInt(topics[i], 10);
            topic = Mediakron.topics.get(id);
            if (topic) {
                Mediakron.Status.filterByTopics[id] = topic.get('title');
            }
        }
    }
    if (filter.tags) {
        Mediakron.Status.filterByTags = {};
        var tags = filter.tags.split(',');
        i = 0;
        for (i; i < tags.length; i++) {
            if (tags[i] === 0) {
                continue;
            }
            id = parseInt(tags[i], 10);
            tag = Mediakron.tags.get(id);
            if (tag) {
                Mediakron.Status.filterByTags[id] = tag.get('title');
            }
        }
    }
};
Mediakron.getPathFromObject = function(object) {
    if (!object.mode || object.mode == 'default') {
        return object.view + '/' + object.args.join('/');
    } else {
        return object.mode + '/' + object.view + '/' + object.args.join('/');
    }
};
Mediakron.goToBrowse = function() {
    Mediakron.router.navigate('browse', {
        trigger: true
    });
};
Mediakron.serializeDate = function(dateObj) {
    var seconds = 0,
        leap = false,
        reference = {
            normalFourYear: 126230400,
            nonLeapFourYear: 126144000,
            nonLeapCentury: 3155673600,
            leapCentury: 3155760000,
            fourHundredYears: 12622780800,
            year: 31536000,
            leap: 31622400,
            month: 2678400,
            shortMonth: 2592000,
            febuary: 2419200,
            leapFebuary: 2505600,
            day: 86400,
            hour: 3600,
            minute: 60
        },
        bce = false;
    calculateYear = function() {
        var year = dateObj.year.trim();
        // Years can have a couple of forms.  
        if (isNaN(year)) {
            var parts = year.split(' ');
            if (!parts[0]) return false;
            if (!parts[1]) return false;
            var number = parseFloat(parts[0]),
                str = parts[1].toLowerCase();
            if (parts[2]) str += ' ' + parts[2].toLowerCase();
            if (parts[3]) str += ' ' + parts[3].toLowerCase();
            if (parts[3]) str += ' ' + parts[3].toLowerCase();

            switch (str) {
                case 'billion':
                case 'billions':
                    year = number * 1000000000;
                    break;
                case 'bya':
                    year = number * 1000000000 * -1;
                    break;

                case 'million':
                case 'millions':
                    year = number * 1000000;
                    break;
                case 'mya':
                    year = number * 1000000 * -1;
                    break;
            }
        }

        year = Math.abs(parseInt(year, 10));

        // get the number of seconds in the year
        var seconds = 0,
            modulo4 = year % 4,
            closest4 = year - modulo4,
            modulo100 = year % 100,
            closestCentury = year - modulo100,
            modulo400 = year % 400,
            closestFourHundred = year - modulo400,
            additonalCenturies = closestCentury - closestFourHundred,
            additionalYears = year - closestCentury,
            tracker = 0;
        // is this a leap year
        if (modulo400 === 0) leap = true;
        if (modulo4 === 0 && modulo100 !== 0) leap = true;
        seconds = (closestFourHundred / 400) * reference.fourHundredYears;
        tracker += closestFourHundred;
        if (additonalCenturies > 0) {
            seconds += (additonalCenturies / 100) * reference.nonLeapCentury;
            tracker += additonalCenturies;
        }
        if (additionalYears > 0) {
            seconds += ((closest4 - tracker) / 4) * reference.normalFourYear;
            var additional = year - closest4;
            seconds += additional * reference.leap;
        }
        if (this.timelineType != 'generic') {
            seconds = seconds - reference.leap;
        }
        if (modulo4 === 0 && modulo100 === 0) {
            seconds += reference.day;
        }
        if (parseInt(dateObj.year, 10) < 0) {
            bce = true;
        }
        return seconds;
    };
    calculateMonth = function() {
        var month = parseFloat(dateObj.month),
            seconds = 0;
        if (month === 0) return 0; // Jan
        if (month > 0) seconds += reference.month; // Feb
        if (month > 1 && this.leap) seconds += reference.leapFebuary; // leap march
        if (month > 1 && !this.leap) seconds += reference.febuary; // non leap march
        if (month > 2) seconds += reference.month; // apri
        if (month > 3) seconds += reference.shortMonth; // may
        if (month > 4) seconds += reference.month; // june
        if (month > 5) seconds += reference.shortMonth; // june
        if (month > 6) seconds += reference.month; // july
        if (month > 7) seconds += reference.month; // august
        if (month > 8) seconds += reference.shortMonth; // sept
        if (month > 9) seconds += reference.month; // october
        if (month > 10) seconds += reference.shortMonth; // nov
        return seconds;
    };
    if (dateObj.year) {
        seconds += calculateYear();
    }
    if (dateObj.month) {
        seconds += calculateMonth();
    }
    if (dateObj.day) {
        seconds += (parseInt(dateObj.day, 10) - 1) * reference.day;
    }
    if (dateObj.hour) {
        seconds += (parseInt(dateObj.hour, 10) - 1) * reference.hour;
    }
    if (dateObj.minute) {
        seconds += (parseInt(dateObj.minute, 10) - 1) * reference.minute;
    }
    if (dateObj.second) {
        seconds += parseInt(dateObj.second, 10);
    }
    if (bce) {
        seconds = seconds * -1;
    }
    if (seconds === 0) return false;
    return seconds;
};

Mediakron.validateTimeline = function(date) {
    if (!date) return "Please provide at least a start date.";
    if (!date.start) return "Please provide at least a start date.";
    var serialStart = Mediakron.serializeDate(date.start);
    if (!serialStart) return "The start date seems to be invalid.";
    if (date.end) {
        // TODO Validate if start is later than end.  Serialize
        var serialEnd = Mediakron.serializeDate(date.end);
        if (!serialEnd) return "The end date seems to be invalid.";
        if (serialStart > serialEnd) return "The end date must be after the start date.";
    }
    return false;
};


Mediakron.linkHandle = function(event) {
    $('#main').scrollTop(0);
    $('#add-content-links').slideUp('fast');
    $('#configure-menu').slideUp('fast');
    $('body').removeClass('leftnav-toggled');
    $('#navbar').removeClass('is-visible');
    $('.fade-screen').removeClass('is-visible');
    if ($('#main-container').hasClass('content-push-mobile')) {
        $('#navbar').removeClass('is-visible');
        $('.fade-screen').removeClass('is-visible');
        $('#main-container').removeClass('content-push-mobile');
    }
    if ($(event.currentTarget).hasClass('open-overlay')) {
        Mediakron.Status.OpenOverlay = true;
    }
    var href = $(event.currentTarget).attr('href'),
        target = $(event.currentTarget).attr('target'),
        url = '';
    if (href) {
        url = href.replace(window.location.origin, '').replace(Mediakron.Settings.basepath, '#').replace(/^\//, '').replace('#!/', '');
    }
    if (url.indexOf('#help') === 0) {
        var helps = url.split('/');
        if (!helps[1]) {
            Mediakron.controller.gotoView(new Mediakron.HelpPage(helps[1]));
        } else {
            Mediakron.controller.gotoHelp(new Mediakron.HelpPage(helps[1]));
        }
        return false;
    }
    if (Mediakron.Status.linkDisable) return false;
    if (href == 'javascript:void(0);') return false;
    if (href == 'javascript:void(0)') return false;
    if (href) {
        var passThrough = (href.indexOf('sign_out') >= 0);
        var external = false;
        var match = href.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
        if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) {
            external = true;
        }
        if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":(" + {
                "http:": 80,
                "https:": 443
            }[location.protocol] + ")?$"), "") !== location.host) {
            external = true;
        }
        if (target == '_blank') {
            external = true;
        }
        if (match[0] && match[1]) {
            if (match[3]) {
                var uri = match[3].split('/');
                i = 0;
                if (uri[i] === '') i++;
                if (uri[i] === 'app_dev.php') i++;
                if (Mediakron.Settings.uri != uri[i]) {
                    external = true;
                }
            }
        }
        if (external) {
            window.open(href, '_blank');
        } else {
            if (!passThrough && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
                event.preventDefault();
            }
            if (Mediakron.Status.formChanged) {
                request = {};
                text = "You have unsaved changes on this form.  Are you sure you want to navigate away?";
                accept = function(request) {
                    Mediakron.Status.formChanged = false;
                    Mediakron.router.navigate(url, {
                        trigger: true
                    });
                };
                reject = function(request) {
                    return false;
                };
                Mediakron.message({
                    text: text,
                    type: 'warning',
                    timeout: 0,
                    layout: 'center',
                    confirm: true,
                    callback: function() {
                        accept();
                    },
                    cancel: function() {
                        reject();
                    }
                });
            } else if (Mediakron.loading) {
                Mediakron.message({
                    text: 'One moment - the site is still loading',
                    type: 'warning',
                    timeout: 3000,
                    layout: 'center'
                });
            } else {
                Mediakron.router.navigate(url, {
                    trigger: true
                });
            }
        }
    }
    return false;
};
Mediakron.helpHandle = function(e) {
    var target = $(e.currentTarget);
    target.nextAll('.help').first().toggle();
};
Mediakron.closehelpHandle = function(e) {
    var target = $(e.currentTarget);
    target.closest("div").hide();
};
Mediakron.uniquify = function(url, urls) {
    var i = 0,
        urla;
    for (i; i < 10; i++) {
        urla = url + '-' + i;
        if (!urls[urla]) {
            return urla;
        }
    }
};
Mediakron.formatUnixDateStamp = function(time, small) {
    var a = new Date(time * 1000);
    var months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    if (min < 10) {
        min = "0" + min;
    }
    if (small) {
        return month + ' ' + date + ', ' + year + ' ' + hour + ':' + min;
    }
    return month + ' ' + date + ', ' + year;
};

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
Mediakron.Wysiwyg = {};
Mediakron.Wysiwyg.form = function() {
    var template = JST['settings.section.wysiwyg'],
        html = template();
    return html;
};
Mediakron.Wysiwyg.showBubble = function(target) {
    Mediakron.Wysiwyg.updateBubblePosition(target);
    var parent = $(target).parent();
    $('.wysiwyg', parent).show();
};
Mediakron.Wysiwyg.updateBubblePosition = function(target) {
    console.log(target);
    var selection = window.getSelection(),
        range = selection.getRangeAt(0),
        boundary = range.getBoundingClientRect(),
        position = $(target).offset();
    if (position) {
        var parent = $(target).parent(),
            left = ((boundary.left + boundary.right) / 2) - position.left - 230,
            before = 230;
        if (left < 0) {
            before = before + left;
            left = 0;
        }
        $('.wysiwyg', parent).css({
            'top': boundary.top - position.top - 50 + "px",
            'left': left + "px"
        });
        $('.wysiwyg-arrow', parent).css({
            'left': before + "px"
        });
    }
};
Mediakron.Wysiwyg.apply = function(e) {
    e.preventDefault();
    var action = $(e.currentTarget),
        view = this,
        execute = action.attr('data-tag');
    if (execute == 'submitLink') {
        this.restoreRange();
    }
    var edit = $('.rich-text #description'),
        selection = window.getSelection(),
        oRange = selection.getRangeAt(0),
        text = selection.toString(),
        ancestor = $(oRange.commonAncestorContainer),
        nodename = selection.focusNode.parentElement.nodeName,
        parentEditor = ancestor.closest("div[contenteditable='true']"),
        navView = this;
    console.log(execute);
    switch (execute) {
        case 'h1':
        case 'h2':
        case 'h3':
            if (nodename == 'H1' || nodename == 'H2' || nodename == 'H3') {
                if (execute.toUpperCase() == nodename) {
                    document.execCommand("formatBlock", false, 'p');
                } else {
                    document.execCommand("formatBlock", false, execute);
                }
            } else {
                document.execCommand("formatBlock", false, execute);
            }
            break;
        case 'createLink':
            $('.normal-wysiwyg').addClass('hide');
            $('.wlink-tool').removeClass('hide');
            break;
        case 'submitLink':
            var url = $('#wlink-external-field', action.parent()).val();
            console.log(url);
            if (url === "") return false;
            if (!url.match("^(http://|https://|mailto:)")) url = "http://" + url;
            console.log(url);
            navView.restoreRange();
            document.execCommand('createLink', false, url);
            $('.normal-wysiwyg').removeClass('hide');
            $('.wlink-tool').addClass('hide');
            if (findinselection('a', parentEditor[0])) {
                $('.wysiwyg-link').addClass('hide');
                $('.wysiwyg-unlink').removeClass('hide');
            } else {
                $('.wysiwyg-link').removeClass('hide');
                $('.wysiwyg-unlink').addClass('hide');
            }
            $('#wlink-external-field', action.parent()).val('');
            break;
        case 'cancelLink':
            var top = $('#settings-context').scrollTop();
            $('.normal-wysiwyg').removeClass('hide');
            $('.wlink-tool').addClass('hide');
            $('#wlink-external-field', action.parent()).val('');
            break;
        case 'removeLink':
            $('.wysiwyg-link').addClass('hide');
            $('.wysiwyg-unlink').removeClass('hide');
            document.execCommand("unlink", false, false);
            $('#wlink-external-field', action.parent()).val('');
            break;
        case 'indent':
            $('.wysiwyg-indent').addClass('hide');
            $('.wysiwyg-outdent').removeClass('hide');
            document.execCommand(execute);
            break;
        case 'outdent':
            $('.wysiwyg-indent').removeClass('hide');
            $('.wysiwyg-outdent').addClass('hide');
            document.execCommand(execute);
            break;
        default:
            document.execCommand(execute);
            break;
    }
    Mediakron.Wysiwyg.updateBubblePosition(parentEditor);
    return false;
};
Mediakron.sidebarPanelOpen = function(event) {
    event.preventDefault();
    var target = event.currentTarget,
        parent = $(target).parent().parent();
    $('.collapse', parent).removeClass('in');
    $(target).next().addClass('in');
    return false;
};
Mediakron.sidebarHandle = function(event) {
    var target = event.currentTarget,
        parent = $(target).parent().parent();
    if ($('.main-item-content', parent).hasClass("sidebar-active")) { /* Close sidebar */
        $('.sidebar-close-button', parent).hide();
        $('.main-item-content', parent).removeClass('col-md-8 sidebar-active');
        $('.main-item-content', parent).addClass('col-md-11 no-sidebar');
        $('.sidebar', parent).removeClass(' col-md-4');
        $('.sidebar', parent).addClass('col-md-1');
        $('.sidebar-inner', parent).hide();
        $('.sidebar-open-button', parent).show();
    } else { /* Open sidebar */
        $('.main-item-content', parent).removeClass('col-md-11 no-sidebar');
        $('.main-item-content', parent).addClass('col-md-8 sidebar-active');
        $('.sidebar', parent).removeClass('col-md-1');
        $('.sidebar', parent).addClass('col-md-4');
        $('.sidebar-inner', parent).show();
        $('.sidebar-open-button', parent).hide();
        $('.sidebar-close-button', parent).show();
    }
    if (Mediakron.Status.CurrentMap) {
        Mediakron.Status.CurrentMap.updateSize();
    }
};
Mediakron.colorToHex = function(color) {
    if (!color) return '#000000';
    if (color.substr(0, 1) === '#') {
        return color;
    }
    console.log(color);
    if (color == 'transparent') return '#000000';
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
    if (!digits) {
        digits = /(.*?)rgba\((\d+), (\d+), (\d+), (\d+)\)/.exec(color);
    }
    var red = parseInt(digits[2], 10);
    var green = parseInt(digits[3], 10);
    var blue = parseInt(digits[4], 10);
    var rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + rgb.toString(16);
};
Mediakron.Checked = function(source, value) {
    if (source == value) {
        return 'checked';
    }
    return '';
};
Mediakron.Selected = function(source, value) {
    if (source == value) {
        return 'selected';
    }
    return '';
};
Mediakron.validateURL = function(value) {
    var r = new RegExp("^" +
        // protocol identifier
        "(?:(?:https?|ftp)://)" +
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" + "(?:" +
        // IP address exclusion
        // private & local networks
        "(?!(?:10|127)(?:\\.\\d{1,3}){3})" + "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" + "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broacast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" + "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" + "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" + "|" +
        // host name
        "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
        // domain name
        "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
        // TLD identifier
        "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" + ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:/\\S*)?" + "$", "i");
    return r.test(value);
};
Mediakron.CleanHighlight = function(input, allowHeaders) {
    var tagStripper = new RegExp('<(/)*(h1|h2|br|a|p|b|strong|hr|h3|h4|h5|h6|div|table|td|th|tr|thead|tbody|img|meta|link|span|\\?xml:|st1:|o:|font)(.*?)>', 'gi');
    // 3. remove tags leave content if any
    return input.replace(tagStripper, '');
};
// removes MS Office generated guff
Mediakron.cleanHTML = function(input, allowHeaders) {
    // 1. remove line breaks / Mso classes
    var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g,
        output = input.replace(stringStripper, ' '),
        i = 0;
    // 2. strip Word generated HTML comments
    var commentSripper = new RegExp('<!--(.*?)-->', 'g');
    output = output.replace(commentSripper, '');
    var divReplacer = new RegExp('<(div|article)(.*?)>', 'gi');
    // 3. remove tags leave content if any
    output = output.replace(divReplacer, '<p>');
    var divReplacer2 = new RegExp('<(/div|/article)(.*?)>', 'gi');
    // 3. remove tags leave content if any
    output = output.replace(divReplacer2, '</p>');
    var tagStripper;
    if (allowHeaders) {
        tagStripper = new RegExp('<(/)*(h1|h4|h5|h6|div|table|td|th|tr|thead|tbody|img|meta|link|span|\\?xml:|st1:|o:|font)(.*?)>', 'gi');
        // 3. remove tags leave content if any
        output = output.replace(tagStripper, '');
    } else {
        tagStripper = new RegExp('<(/)*(h1|h2|h3|h4|h5|h6|div|table|td|th|tr|thead|tbody|img|meta|link|span|\\?xml:|st1:|o:|font)(.*?)>', 'gi');
        // 3. remove tags leave content if any
        output = output.replace(tagStripper, '');
    }
    // 4. Remove everything in between and including tags '<style(.)style(.)>'
    var badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];
    i = 0;
    for (i; i < badTags.length; i++) {
        tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi');
        output = output.replace(tagStripper, '');
    }
    // 5. remove attributes ' style="..."'
    var badAttributes = ['style', 'start', 'dir'];
    i = 0;
    for (i; i < badAttributes.length; i++) {
        var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi');
        output = output.replace(attributeStripper, '');
    }
    return output;
};
// @Tim 02-28-2015 - http://www.davidhalford.com/thoughts/2013/auto-contrasting-text/

function getContrastColor(hex) {
    threshold = 130;
    hRed = hexToR(hex);
    hGreen = hexToG(hex);
    hBlue = hexToB(hex);

    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0, 2), 16);
    }

    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2, 4), 16);
    }

    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4, 6), 16);
    }

    function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
    }
    cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    if (cBrightness > threshold) {
        return "#000000";
    } else {
        return "#ffffff";
    }
}




function getContrastOnWhite(hex) {
    var original = hex;
    threshold = 200;
    hRed = hexToR(hex);
    hGreen = hexToG(hex);
    hBlue = hexToB(hex);

    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0, 2), 16);
    }

    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2, 4), 16);
    }

    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4, 6), 16);
    }

    function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
    }
    cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    if (cBrightness > threshold) {
        return "#000000";
    } else {
        return original; /* if it's dark enough on white, return original color  */
    }
}

// use color if it's dark enough on white background; otherwise, use black
function getContrastOnWhiteColor(hex) {
    var original = hex;
    threshold = 200;
    hRed = hexToR(hex);
    hGreen = hexToG(hex);
    hBlue = hexToB(hex);

    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0, 2), 16);
    }

    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2, 4), 16);
    }

    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4, 6), 16);
    }

    function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
    }
    cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    if (cBrightness > threshold) {
        return "background: #000000; color:#fff";
    } else {
        return "background:" + original + "; color: #fff"; /* if it's dark enough on white, return original color  */
    }
}

function getContrastTintLight(hex) {
    threshold = 130;
    hRed = hexToR(hex);
    hGreen = hexToG(hex);
    hBlue = hexToB(hex);

    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0, 2), 16);
    }

    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2, 4), 16);
    }

    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4, 6), 16);
    }

    function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
    }
    cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    if (cBrightness > threshold) {
        return "rgba(0, 0, 0, 0.5)";
    } else {
        return "rgba(250, 250, 250, 0.5)";
    }
}

function getContrastTint(hex) {
    threshold = 130;
    hRed = hexToR(hex);
    hGreen = hexToG(hex);
    hBlue = hexToB(hex);

    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0, 2), 16);
    }

    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2, 4), 16);
    }

    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4, 6), 16);
    }

    function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
    }
    cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    if (cBrightness > threshold) {
        return "rgba(0, 0, 0, 0.1)";
    } else {
        return "rgba(250, 250, 250, 0.2)";
    }
} /* http://jsfiddle.net/subodhghulaxe/t568u/  */


// https://css-tricks.com/snippets/javascript/lighten-darken-color/
function LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    var g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}


function getTint(hex) {
    threshold = 130;
    hRed = hexToR(hex);
    hGreen = hexToG(hex);
    hBlue = hexToB(hex);

    var Lighter = LightenDarkenColor(hex, 80);
    var Darker = LightenDarkenColor(hex, -40);

    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0, 2), 16);
    }

    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2, 4), 16);
    }

    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4, 6), 16);
    }

    function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
    }
    cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    if (cBrightness > threshold) {
        return Darker;
    } else {
        return Lighter;
    }
}




function convertHex(hex, opacity) {
    hex = hex.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    return result;
}



function toggleAttr(attr, attr1, attr2) {
    return this.each(function() {
        var self = $(this);
        if (self.attr(attr) == attr1)
            self.attr(attr, attr2);
        else
            self.attr(attr, attr1);
    });
}




jQuery.fn.inlineOffset = function() {
    var el = $('<i>&nbsp;</i>').css('display', 'inline').insertBefore(this[0]);
    var pos = el.position();
    el.remove();
    return pos;
};
var findinselection = function(tagname, container) {
    var i, len, el, rng = getrange(),
        comprng, selparent;
    if (rng) {
        selparent = rng.commonAncestorContainer || rng.parentElement();
        // Look for an element *around* the selected range
        if (rng.collapsed) return false;
        if (selparent !== null) {
            for (el = selparent; el !== container; el = el.parentNode) {
                if (el !== null) {
                    if (el.tagName && el.tagName.toLowerCase() === tagname) {
                        return el;
                    }
                }
            }
        }
        // Look for an element *within* the selected range
        if (!rng.collapsed && (rng.text === undefined || rng.text) && selparent.getElementsByTagName) {
            el = selparent.getElementsByTagName(tagname);
            comprng = document.createRange ? document.createRange() : document.body.createTextRange();
            for (i = 0, len = el.length; i < len; i++) {
                // determine if element el[i] is within the range
                if (document.createRange) { // w3c
                    comprng.selectNodeContents(el[i]);
                    if (rng.compareBoundaryPoints(Range.END_TO_START, comprng) < 0 && rng.compareBoundaryPoints(Range.START_TO_END, comprng) > 0) {
                        return el[i];
                    }
                } else { // microsoft
                    comprng.moveToElementText(el[i]);
                    if (rng.compareEndPoints("StartToEnd", comprng) < 0 && rng.compareEndPoints("EndToStart", comprng) > 0) {
                        return el[i];
                    }
                }
            }
        }
    }
};
var getrange = function() {
    var selection = document.getSelection();
    if (selection) return selection.getRangeAt(0);
};
Mediakron.closeFadeScreen = function(event) {
    $('.fade-screen').removeClass('is-visible-sidebar');
    $('.fade-screen-sidebar').removeClass('is-visible');
};
Mediakron.hideNextPrev = function(event) {
    $('.folder-navigation').hide();
    $('.slideshow-navigation').hide();
};

function accessibleNav() {

    /*
     * jQuery accessible and keyboard-enhanced navigation with dropdown
     * Website: http://a11y.nicolas-hoffmann.net/subnav-dropdown/
     * License MIT: https://github.com/nico3333fr/jquery-accessible-subnav-dropdown/blob/master/LICENSE
     */
    // loading expand paragraphs
    var $nav_system = $('.js-nav-system'),
        $body = $('body');
    if ($nav_system.length) { // if there is at least one :)

        // initialization
        var $nav_system_link = $('.js-nav-system__link');

        $nav_system_link.each(function(index_to_expand) {
            var $this = $(this),
                index_lisible = index_to_expand + 1,
                $subnav = $this.next('.js-nav-system__subnav');

            // if there is a subnav adjacent to the link
            if ($subnav.length === 1) {
                $subnav.attr({
                    'data-visually-hidden': 'true'
                });
            }
        });

    }

    // events on main menu
    // mouse !
    $body.on('mouseenter', '.js-nav-system__item', function(event) {
            var $this = $(this),
                $subnav_link = $this.children('.js-nav-system__link'),
                $subnav = $this.children('.js-nav-system__subnav');

            $this.attr({
                'data-show-sub': 'true'
            });

            // show submenu
            if ($subnav.length === 1) {
                $subnav.attr({
                    'data-visually-hidden': 'false'
                });
            }

        })
        .on('mouseleave', '.js-nav-system__item', function(event) {
            var $this = $(this),
                $subnav_link = $this.children('.js-nav-system__link'),
                $subnav = $this.children('.js-nav-system__subnav');

            $this.attr({
                'data-show-sub': 'false'
            });
            // show submenu
            if ($subnav.length === 1) {
                $subnav.attr({
                    'data-visually-hidden': 'true'
                });
            }

        })
        // keyboard
        .on('focus', '.js-nav-system__link', function(event) {
            var $this = $(this),
                $parent = $this.parents('.js-nav-system'),
                $parent_item = $this.parents('.js-nav-system__item'),
                $subnav = $this.next('.js-nav-system__subnav');

            $parent_item.attr({
                'data-show-sub': 'true'
            });

            // hide other menus and show submenu activated
            $parent.find('.js-nav-system__subnav').attr({
                'data-visually-hidden': 'true'
            });

            if ($subnav.length === 1) {
                $subnav.attr({
                    'data-visually-hidden': 'false'
                });
            }

        })
        .on('focusout', '.js-nav-system__link', function(event) {
            var $this = $(this),
                $parent = $this.parents('.js-nav-system'),
                $parent_item = $this.parents('.js-nav-system__item');

            $parent_item.attr({
                'data-show-sub': 'false'
            });
        })
        .on('keydown', '.js-nav-system__link', function(event) {
            var $this = $(this),
                $parent = $this.parents('.js-nav-system'),
                $parent_item = $this.parents('.js-nav-system__item'),
                $subnav = $this.next('.js-nav-system__subnav');

            // event keyboard left
            if (event.keyCode == 37) {
                // select previous nav-system__link

                // if we are on first => activate last
                if ($parent_item.is(".js-nav-system__item:first-child")) {
                    $parent.find(" .js-nav-system__item:last-child ").children(".js-nav-system__link").focus();
                }
                // else activate previous
                else {
                    $parent_item.prev().children(".js-nav-system__link").focus();
                }
                event.preventDefault();
            }

            // event keyboard right
            if (event.keyCode == 39) {
                // select previous nav-system__link

                // if we are on last => activate first
                if ($parent_item.is(".js-nav-system__item:last-child")) {
                    $parent.find(" .js-nav-system__item:first-child ").children(".js-nav-system__link").focus();
                }
                // else activate next
                else {
                    $parent_item.next().children(".js-nav-system__link").focus();
                }
                event.preventDefault();
            }

            // event keyboard bottom
            if (event.keyCode == 40) {
                // select first nav-system__subnav__link
                if ($subnav.length === 1) {
                    // if submenu has been closed => reopen
                    $subnav.attr({
                        'data-visually-hidden': 'false'
                    });
                    // and select first item
                    $subnav.find(" .js-nav-system__subnav__item:first-child ").children(".js-nav-system__subnav__link").focus();
                }
                event.preventDefault();
            }

            // event shift + tab 
            if (event.shiftKey && event.keyCode == 9) {
                if ($parent_item.is(".js-nav-system__item:first-child")) {
                    $subnav.attr({
                        'data-visually-hidden': 'true'
                    });
                } else {

                    var $prev_nav_link = $parent_item.prev('.js-nav-system__item').children(".js-nav-system__link");
                    $subnav_prev = $prev_nav_link.next('.js-nav-system__subnav');
                    if ($subnav_prev.length === 1) { // hide current subnav, show previous and select last element
                        $subnav.attr({
                            'data-visually-hidden': 'true'
                        });
                        $subnav_prev.attr({
                            'data-visually-hidden': 'false'
                        });
                        $subnav_prev.find(" .js-nav-system__subnav__item:last-child ").children(".js-nav-system__subnav__link").focus();
                        event.preventDefault();
                    }
                }
            }

        });

    // events on submenu item
    $body.on('keydown', '.js-nav-system__subnav__link', function(event) {
            var $this = $(this),
                $subnav = $this.parents('.js-nav-system__subnav'),
                $subnav_item = $this.parents('.js-nav-system__subnav__item'),
                $nav_link = $subnav.prev('.js-nav-system__link'),
                $nav_item = $nav_link.parents('.js-nav-system__item'),
                $nav = $nav_link.parents('.js-nav-system');

            // event keyboard bottom
            if (event.keyCode == 40) {
                // if we are on last => activate first
                if ($subnav_item.is(".js-nav-system__subnav__item:last-child")) {
                    $subnav.find(".js-nav-system__subnav__item:first-child ").children(".js-nav-system__subnav__link").focus();
                }
                // else activate next
                else {
                    $subnav_item.next().children(".js-nav-system__subnav__link").focus();
                }
                event.preventDefault();
            }
            // event keyboard top
            if (event.keyCode == 38) {
                // if we are on first => activate last
                if ($subnav_item.is(".js-nav-system__subnav__item:first-child")) {
                    $subnav.find(" .js-nav-system__subnav__item:last-child ").children(".js-nav-system__subnav__link").focus();
                }
                // else activate previous
                else {
                    $subnav_item.prev().children(".js-nav-system__subnav__link").focus();
                }
                event.preventDefault();
            }
            // event keyboard Esc
            if (event.keyCode == 27) {
                // close the menu
                $nav_link.focus();
                $subnav.attr({
                    'data-visually-hidden': 'true'
                });
                event.preventDefault();
            }
            // event keyboard right
            if (event.keyCode == 39) {
                // select next nav-system__link
                $subnav.attr({
                    'data-visually-hidden': 'true'
                });

                // if we are on last => activate first and choose first item
                if ($nav_item.is(".js-nav-system__item:last-child")) {
                    $next = $nav.find(" .js-nav-system__item:first-child ").children(".js-nav-system__link");
                    $next.focus();
                    $subnav_next = $next.next('.js-nav-system__subnav');
                    if ($subnav_next.length === 1) {
                        $subnav_next.find(" .js-nav-system__subnav__item:first-child ").children(".js-nav-system__subnav__link").focus();
                    }
                }
                // else activate next
                else {
                    $next = $nav_item.next().children(".js-nav-system__link");
                    $next.focus();
                    $subnav_next = $next.next('.js-nav-system__subnav');
                    if ($subnav_next.length === 1) {
                        $subnav_next.find(" .js-nav-system__subnav__item:first-child ").children(".js-nav-system__subnav__link").focus();
                    }
                }
                event.preventDefault();
            }
            // event keyboard left
            if (event.keyCode == 37) {
                // select prev nav-system__link
                $subnav.attr({
                    'data-visually-hidden': 'true'
                });

                // if we are on first => activate last and choose first item
                if ($nav_item.is(".js-nav-system__item:first-child")) {
                    $prev = $nav.find(" .js-nav-system__item:last-child ").children(".js-nav-system__link");
                    $prev.focus();
                    $subnav_prev = $prev.next('.js-nav-system__subnav');
                    if ($subnav_prev.length === 1) {
                        $subnav_prev.find(".js-nav-system__subnav__item:first-child ").children(".js-nav-system__subnav__link").focus();
                    }
                }
                // else activate prev
                else {
                    $prev = $nav_item.prev().children(".js-nav-system__link");
                    $prev.focus();
                    $subnav_prev = $prev.next('.js-nav-system__subnav');
                    if ($subnav_prev.length === 1) {
                        $subnav_prev.find(".js-nav-system__subnav__item:first-child ").children(".js-nav-system__subnav__link").focus();
                    }
                }
                event.preventDefault();
            }
            // event tab 
            if (event.keyCode == 9 && !event.shiftKey) { // if we are on last subnav of last item and we go forward => hide subnav 
                if ($nav_item.is(".js-nav-system__item:last-child") && $subnav_item.is(".js-nav-system__subnav__item:last-child")) {
                    $subnav.attr({
                        'data-visually-hidden': 'true'
                    });
                }
            }

        })
        .on('focus', '.js-nav-system__subnav__link', function(event) {
            var $this = $(this),
                $subnav = $this.parents('.js-nav-system__subnav'),
                $subnav_item = $this.parents('.js-nav-system__subnav__item'),
                $nav_link = $subnav.prev('.js-nav-system__link'),
                $nav_item = $nav_link.parents('.js-nav-system__item'),
                $nav = $nav_link.parents('.js-nav-system__item');

            $nav_item.attr({
                'data-show-sub': 'true'
            });
        })
        .on('focusout', '.js-nav-system__subnav__link', function(event) {
            var $this = $(this),
                $subnav = $this.parents('.js-nav-system__subnav'),
                $subnav_item = $this.parents('.js-nav-system__subnav__item'),
                $nav_link = $subnav.prev('.js-nav-system__link'),
                $nav_item = $nav_link.parents('.js-nav-system__item'),
                $nav = $nav_link.parents('.js-nav-system__item');

            $nav_item.attr({
                'data-show-sub': 'false'
            });
        });

}



function accessibleExpand($parent) {

    /*
     * jQuery simple and accessible hide-show system (collapsible regions), using ARIA
     * @version v1.7.0   
     * Website: https://a11y.nicolas-hoffmann.net/hide-show/
     * License MIT: https://github.com/nico3333fr/jquery-accessible-hide-show-aria/blob/master/LICENSE
     */
    // loading expand paragraphs
    // these are recommended settings by a11y experts. You may update to fulfill your needs, but be sure of what you’re doing.
    var attr_control = 'data-controls',
        attr_expanded = 'aria-expanded',
        attr_labelledby = 'data-labelledby',
        attr_hidden = 'data-hidden',
        $expandmore = $('.js-expandmore'),
        $body = $parent,
        delay = 1500,
        hash = window.location.hash.replace("#", ""),
        multiexpandable = true,
        expand_all_text = 'Expand All',
        collapse_all_text = 'Collapse All';


    if ($expandmore.length) { // if there are at least one :)
        $expandmore.each(function(index_to_expand) {
            var $this = $(this),
                index_lisible = index_to_expand + 1,
                options = $this.data(),
                $hideshow_prefix_classes = typeof options.hideshowPrefixClass !== 'undefined' ? options.hideshowPrefixClass + '-' : '',
                $to_expand = $this.next(".js-to_expand"),
                $expandmore_text = $this.html();

            $this.html('<button type="button" class="' + $hideshow_prefix_classes + 'expandmore__button js-expandmore-button">' + $expandmore_text + '</button>');
            var $button = $this.children('.js-expandmore-button');

            $to_expand.addClass($hideshow_prefix_classes + 'expandmore__to_expand').stop().delay(delay).queue(function() {
                var $this = $(this);
                if ($this.hasClass('js-first_load')) {
                    $this.removeClass('js-first_load');
                }
            });

            $button.attr('id', 'label_expand_' + index_lisible);
            $button.attr(attr_control, 'expand_' + index_lisible);
            $button.attr(attr_expanded, 'false');

            $to_expand.attr('id', 'expand_' + index_lisible);
            $to_expand.attr(attr_hidden, 'true');
            $to_expand.attr(attr_labelledby, 'label_expand_' + index_lisible);

            // quick tip to open (if it has class is-opened or if hash is in expand)
            if ($to_expand.hasClass('is-opened') || (hash !== "" && $to_expand.find($("#" + hash)).length)) {
                $button.addClass('is-opened').attr(attr_expanded, 'true');
                $to_expand.removeClass('is-opened').removeAttr(attr_hidden);
            }


        });


    }


    $body.on('click', '.js-expandmore-button', function(event) {
        var $this = $(this),
            $destination = $('#' + $this.attr(attr_control));

        if ($this.attr(attr_expanded) === 'false') {

            if (multiexpandable === false) {
                $('.js-expandmore-button').removeClass('is-opened').attr(attr_expanded, 'false');
                $('.js-to_expand').attr(attr_hidden, 'true');
            }

            $this.addClass('is-opened').attr(attr_expanded, 'true');
            $destination.removeAttr(attr_hidden);
        } else {
            $this.removeClass('is-opened').attr(attr_expanded, 'false');
            $destination.attr(attr_hidden, 'true');
        }

        event.preventDefault();

    });

    $body.on('click keydown', '.js-expandmore', function(event) {
        var $this = $(this),
            $target = $(event.target),
            $button_in = $this.find('.js-expandmore-button');

        if (!$target.is($button_in) && !$target.closest($button_in).length) {

            if (event.type === 'click') {
                $button_in.trigger('click');
                return false;
            }
            if (event.type === 'keydown' && (event.keyCode === 13 || event.keyCode === 32)) {
                $button_in.trigger('click');
                return false;
            }

        }


    });

    $body.on('click keydown', '.js-expandmore-all', function(event) {
        var $this = $(this),
            is_expanded = $this.attr('data-expand'),
            $all_buttons = $('.js-expandmore-button'),
            $all_destinations = $('.js-to_expand');

        if (
            event.type === 'click' ||
            (event.type === 'keydown' && (event.keyCode === 13 || event.keyCode === 32))
        ) {
            if (is_expanded === 'true') {

                $all_buttons.addClass('is-opened').attr(attr_expanded, 'true');
                $all_destinations.removeAttr(attr_hidden);
                $this.attr('data-expand', 'false').html(collapse_all_text);
            } else {
                $all_buttons.removeClass('is-opened').attr(attr_expanded, 'false');
                $all_destinations.attr(attr_hidden, 'true');
                $this.attr('data-expand', 'true').html(expand_all_text);
            }

        }


    });

}