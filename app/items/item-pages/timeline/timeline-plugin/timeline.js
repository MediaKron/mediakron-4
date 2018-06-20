/*!
 * Mediakron Timeline plugin
 * Author: @bradmering
 * Licensed under the MIT license
 */
(function($, window, document, undefined) {
    // Define widgetcd 
    $.widget("mk.timeline", {
        //Options to be used as defaults
        options: {
            model: false,
            zoom: 0,
            start: false,
            end: false
        },
        start: false, // Hold the start date
        end: false, // Hold the end date
        scope: false, // Scope is the largest meaningful range
        granularity: false, // Granularity is the smallest meaningful range
        serialStart: false, // Holds the serialized start time
        serialEnd: false, // Holds the Serialized End Time
        events: false, // 
        serialRange: false, //
        serialMid: false, //
        viewPortWidth: false, //
        secondsPerPixel: false, //
        timelineType: 'default', //
        grouping: 50, //
        groupInc: false, //
        groupValues: [], //
        groupMax: 0, //
        map: false, //
        key: false, //
        sortedEvents: [], //
        filterBy: {}, //
        $markers: {}, //
        rows: {}, //
        minimumBlockWidth: 50, //
        maximumBlockWidth: 300, // 

        /**
         * Get grouped items in this zoom level
         */
        getGroups: function() {
            this.groupValues = [];
            this.grouping = $(window).width() / 20;
            var i = 0;
            for (i; i < this.grouping; i++) {
                this.groupValues.push(0);
            }
        },
        /**
         * Initializes the widget
         */
        _create: function() {
            if (this.options.map) {
                this.initializeMap();
            } else {
                this.initializeFull();
            }
        },
        /**
         * Initialize the map component for the timemap
         */
        initializeMap: function() {
            var element = this.element,
                timeline = this.options.model.get('timeline'),
                options = this.options.model.get('options'),
                start = options.start,
                end = options.end,
                view = this;
            this.map = Mediakron.Status.CurrentMap;
            this.timelineType = 'traditional';
            this.events = this.options.model.getRelationship('layers');

            this.sortedEvents = Mediakron.Status.CurrentMap.timeEvents = this.serializeEvents(true, start, end);
            var startPercent = 0,
                endPercent = 100,
                range = this.serialRange,
                startSerial, endSerial;
            this.element.slider({
                range: true,
                min: 0,
                max: 100,
                values: [0, 1],
                slide: function(event, ui) {
                    startPercent = ui.values[0];
                    endPercent = ui.values[1];
                    startSerial = view.serialStart + ((startPercent / 100) * range);
                    endSerial = view.serialStart + ((endPercent / 100) * range);
                    start = view.formatLabel(startSerial);
                    end = view.formatLabel(endSerial);
                    $(".start-date").text(start).removeClass('hide');
                    $(".end-date").text(end).removeClass('help-text');
                    view.map.drawMarkers({
                        'start': startSerial,
                        'end': endSerial
                    });
                }
            });
            $('.ui-slider-handle').eq(0).append('<div class="start-date hide time-handle"></div>');
            $('.ui-slider-handle').eq(1).append('<div class="end-date help-text time-handle">Drag to Change Dates</div>');
            this.baseZoom = this.baseZoom(this.serialRange);
            if (this.options.zoom > 0) {
                var zoomInt = this.baseZoom.level - this.zoom;
                this.currentZoom = Mediakron.Timeline.zoom.Levels[zoomInt];
                this.currentZoom.level = zoomInt;
            } else {
                this.currentZoom = this.baseZoom;
            }
            $(".timeline-start").text(this.formatLabel(this.serialStart));
            $(".timeline-end").text(this.formatLabel(this.serialEnd));
            view.map.drawMarkers({
                'start': this.serialStart,
                'end': this.serialStart + ((1 / 100) * range)
            });
        },
        /**
         * Initialize the full map
         */
        mapTimeShowFull: function() {
            var view = this;
            // Set the start and end position of the sliders
            this.element.slider('values', 0, 0);
            this.element.slider('values', 1, 100);

            // Format the start and end time of the timline
            $(".timeline-start").text(this.formatLabel(this.serialStart));
            $(".timeline-end").text(this.formatLabel(this.serialEnd));
            // Draw the markers
            view.map.drawMarkers({
                'start': this.serialStart,
                'end': this.serialEnd
            });
        },
        /**
         * Initialize the full timeline
         */
        initializeFull: function() {
            var element = this.element,
                timeline = this.options.model.get('timeline'),
                start = {},
                end = {},
                view = this;

            Mediakron.CurrentTimeline = this;
            // events are bound as relationships
            this.events = this.options.model.getRelationship('events');
            this.timelineType = timeline.type;
            // if there are no events, don't bind
            //if (!this.events[0]) {
            //    return false;
            //}
            // Get the groups initialized
            this.getGroups();
            // Blank the element
            this.element.empty();
            // Get the base saved zoom
            this.zoom = this.options.zoom;

            // Bind the html elements into properties
            var $dragHandle = this.$dragHandle = $('<div class="dragHandle"></div>');
            var $markerWrapper = this.$markerWrapper = $('<div class="markerWrapper"></div>');
            var $ticBar = this.$ticBar = $('<div class="ticBar"></div>');
            var $timelineControls = this.$timelineControls = $('<div class="timeline-controls"></div>');
            var $zoom = this.$zoom = $('<div class="leaflet-control-zoom leaflet-bar leaflet-control"><a class="leaflet-control-zoom-in zoomin" title="Zoom in"><span class="mk-icon mk-zoomin"></span></a><a class="leaflet-control-zoom-out zoomout" title="Zoom out"><span class="mk-icon mk-zoomout"></span></a><a class="leaflet-control-zoom-out zoomhome" title="Zoom Home" style="display: none;"><span class="mk-icon mk-home"></span></a></div>');
            var $tour = this.$tour = $(JST['widgets.timeline.tour']());

            // Add the tour to the element
            this.element.after($tour);

            // Capture the tour event into an attribute
            var $tourBind = this.$tourBind = $('.timeline-tour', $tour);
            this.element.append(this.$timelineControls);
            this.$timelineControls.append($zoom);
            $dragHandle.append($markerWrapper);
            $dragHandle.append($ticBar);
            this.element.append($dragHandle);

            // Go across every event and serialize them 
            this.sortedEvents = this.serializeEvents(true);
            // Base zoom is determined by the range
            this.baseZoom = this.baseZoom(this.serialRange);

            // Render at a certian zoom level
            if (this.options.zoom > 0) {
                var zoomInt = this.baseZoom.level - this.zoom;
                this.currentZoom = Mediakron.Timeline.zoom.Levels[zoomInt];
                this.currentZoom.level = zoomInt;
            } else { // Or set the base zoom
                this.currentZoom = this.baseZoom;
            }

            // This should be the start midpoint
            this.serialMid = this.serialRange / 2;
            this.updateCenter(this.serialMid);
            $('.center-time').text(this.formatLabel(this.serialStart + this.currentMid));
            this.viewPortWidth = this.element.width() - 25;
            this.viewPortHeight = this.element.height();
            this.secondsPerPixel = this.serialRange / this.viewPortWidth;
            this.viewWidth = this.serialRange / this.secondsPerPixel;
            $dragHandle.width(this.viewWidth);
            this.drawChart();
            this.placeMarkers();
            this.drawTics();
            this.timelineStart(); /* add the start date to opening view */
            this.timelineEnd(); /* add the end date to opening view */

            $('.zoomin', $zoom).on('click', function() {
                view.zoomIn();
                //                $('.timeline-template').removeClass('timeline-tour-open'); /* close tour panel if open */

            });

            $('.markerWrapper', $dragHandle).on('dblclick', function() {
                view.zoomIn();
            });
            $('.zoomout', $zoom).on('click', function() {
                view.zoomOut();
                //                $('.timeline-template').removeClass('timeline-tour-open'); /* close tour panel if open */
            });

            $('.zoomhome', $zoom).on('click', function() { /* Zoom back out to starting view  */
                view.zoomHome();
                //                $('.timeline-template').removeClass('timeline-tour-open'); /* close tour panel if open */
            });

            $dragHandle.draggable({
                axis: "x",
                stop: function(event, ui) {
                    var viewWidth = view.serialRange / view.secondsPerPixel,
                        rightLimit = view.viewPortWidth - viewWidth;
                    if (ui.position.left > 0) {
                        ui.helper.animate({
                            left: 0
                        });
                        view.updateCenter((view.viewPortWidth * view.secondsPerPixel) / 2);
                        view.renderChart();
                    }
                    if (ui.position.left < rightLimit) {
                        ui.helper.animate({
                            left: rightLimit
                        });
                        view.updateCenter((view.viewPortWidth * view.secondsPerPixel) / 2);
                        view.renderChart();
                    }
                },
                drag: function(event, ui) {
                    view.updateCenter(view.serialMid - (ui.position.left * view.secondsPerPixel));
                    view.addTics();
                    view.renderChart();
                }
            });
        },
        filterUri: function(uri) {
            var categories = {};
            if (this.filterBy.categories) categories = this.filterBy.categories;
            if (!categories[uri]) {
                categories[uri] = true;
            } else {
                delete categories[uri];
            }
            this.filterBy.categories = categories;
            this.redraw();
        },

        filterTitle: function(title) {
            this.filterBy.title = title;
            this.redraw();
        },

        filters: function() {
            var $key = this.$key = $('.filter-by-layers');
            var view = this, group;

            if (_.size(this.sortedEvents) < 3) return true;

            _.each(this.sortedEvents.order, function(uri) {
                group = view.sortedEvents[uri];
                if (uri == '000-nocategory') {
                    $filter = $('<li uri="' + uri + '" style="background-color:black;color:' + getContrastColor('#000') + '"><span>Ungrouped Items</span><span class="filter-help filter-help-hide">click to hide</span><span class="filter-help filter-help-show">click to show</span></li>');
                    $filter.click(function() {
                        view.filterUri(uri);
                        $(this).toggleClass('inactive');
                        $('.tour-item.' + uri + '').toggleClass('hide');
                    });
                    view.$key.append($filter);
                }
                var category = Mediakron.getItemFromURI(uri);
                if (category) {
                    $filter = $('<li uri="' + uri + '" style="background-color:' + category.color() + ';color:' + getContrastColor(category.color()) + '"><span>' + category.get('title') + '</span><span class="filter-help filter-help-hide">click to hide</span><span class="filter-help filter-help-show">click to show</span></li>');
                    $filter.click(function() {
                        view.filterUri(uri);
                        $(this).toggleClass('inactive');
                        $('.tour-item.' + uri + '').toggleClass('hide');
                    });
                    view.$key.append($filter);
                }
            });
            $('#content-search #search-rows').keyup(function(e) {
                view.filterTitle($(this).val());
            });
            $('#content-search .empty-map-search').click(function(e) {
                view.filterTitle(false);
            });
        },

        timelineData: function() {
            var scope = 'year',
                basescope = this.baseZoom.scope;
            if (!basescope) {
                var start = '',
                    end = '';

                if (this.options.model.start()) {
                    start = this.options.model.start();
                }
                if (this.options.model.end()) {
                    end = this.options.model.end();
                }
                return {
                    start: '',
                    end: ''
                };
            }
            switch (basescope) {
                case 'billion':
                case 'million':
                case 'millenium':
                case 'year':
                    scope = 'year';
                    break;
                default:
                    scope = basescope;
                    break;
            }
            return {
                start: this.formatLabel(this.serialStart, scope),
                end: this.formatLabel(this.serialEnd, scope)
            };
        },

        renderTour: function() {
            var $tour = this.$tourBind;
            if (!$tour) return false;
            $tour.empty();
            this.tourEl = $tour;
            this.tourItems = [];
            var layers = this.sortedEvents.timeline_items,
                l = 0,
                layersNum = layers.length,
                layer, item, inlineEl, $inlineEl, viewtracking = this;
            currentTour = 0;
            var t = 1,
                h = 0;

            if (layers.length < 1) {
                $tour.append('<p class="tour-empty-message">This tour does not have any content yet</p>');
            } else {
                for (l; l < layersNum; l++) {
                    layer = layers[l];
                    item = false;

                    /* set a variable with the timeline group/folder URI. I'll then use this to hide tour items when timeline is filtered, and perhaps theme tour items by group*/
                    var filter_group = '[filter-group-uri-class]';

                    if (layer.uri) {
                        item = Mediakron.getItemFromURI(layer.uri);
                        if (item) {
                            inlineEl = 'timeline-tour-' + this.options.model.get('uri') + '-' + layer.uri;
                            $inlineEl = $('<div id=' + inlineEl + ' class="tour-item tour-item-' + item.getNormalType() + ' ' + filter_group + '" uri="' + layer.uri + '">');
                            $tour.append($inlineEl);
                            $inlineEl.uri = layer.uri;
                            this.tourItems.push($inlineEl);
                            view = item.getView('tour');
                            view.setElement('#' + inlineEl);
                            view.render();
                            // run after render as required
                            var itemType = item.getNormalType();
                            if (itemType != 'map') {
                                view.afterRender();
                            }
                        }
                    }
                }
            }
            $('.timeline-tour .tour-item').hover(function(e) {
                    var uri = $(this).attr('uri');
                    var marker = $('.timelineMarker-' + uri);
                    $('.timelineMarkerText', marker).closest('.timelineMarker').addClass('timeline-marker-active');

                },
                function(e) {
                    var uri = $(this).attr('uri');
                    var marker = $('.timelineMarker-' + uri);
                    $('.timelineMarkerText', marker).popover("hide");
                    $('.timelineMarkerText', marker).closest('.timelineMarker').removeClass('timeline-marker-active');
                });

            $('.timeline-tour .tour-item .item-date').click(function(e) {
                var uri = $(this).closest('.tour-item').attr('uri');
                var marker = $('.timelineMarker-' + uri);
                $('.timelineMarker', marker).popover("show");
                $('.timelineMarkerText', marker).closest('.timelineMarker').addClass('timeline-marker-active');

            });
        },
        drawChart: function() {
            var chart = this.$chart = $('<div id="timeline-chart"><div id="chart-start">' + this.formatLabel(this.serialStart) + '</div><div class="left-track"></div><div class="center-track"><span class="left-handle grippy"></span> <span class="current-view">Current View</span> <span class="right-handle grippy"></span></div><div class="right-track"></div><div id="chart-end">' + this.formatLabel(this.serialEnd) + '</div><div class="timeline-spark"></div></div>');
            this.$timelineControls.append(chart);
            var $spark = $('.timeline-spark', this.element),
                i = 0,
                marker, $bar, number = this.sortedEvents.timeline_items.length,
                view = this;
            for (i; i < number; i++) {
                marker = this.sortedEvents.timeline_items[i];
                $bar = document.createElement('div');
                $bar.className = 'timeline-dot';
                $bar.style.left = (marker.start - this.serialStart) / (this.secondsPerPixel * 2) + 'px';
                $spark.append($bar);
            }
            var trackwidth = this.trackwidth = $('.center-track').width(),
                dragbarWidth = chart.width();

            $('.center-track', view.$chart).draggable({
                axis: "x",
                containment: "parent",
                drag: function(event, ui) {
                    var ratio = ui.position.left / dragbarWidth,
                        left = ui.position.left,
                        calcLeft = -1 * (view.$dragHandle.width() * ratio);
                    $('.left-track').css({
                        width: ui.position.left + 'px'
                    });
                    $('.right-track').css({
                        width: dragbarWidth - (ui.position.left + view.trackwidth) + 'px'
                    });
                    view.$dragHandle.css({
                        left: calcLeft + 'px'
                    });
                    view.addTics();

                    view.currentMid = view.serialMid - (calcLeft * view.secondsPerPixel);
                }
            });
        },
        renderChart: function() {
            var position = this.$dragHandle.position(),
                width = this.$dragHandle.width(),
                viewport = this.viewPortWidth,
                left = position.left * -1,
                leftPercent = (left / width) * 100,
                right = width - (left + viewport),
                rightPercent = (right / width) * 100;
            if (leftPercent > -1) {
                $('.left-track').css({
                    width: leftPercent + '%'
                });
            } else {
                $('.left-track').css({
                    width: '0'
                });
            }
            if (leftPercent > -1 && rightPercent > -1) {
                $('.center-track').css({
                    width: (100 - leftPercent - rightPercent) + '%',
                    left: leftPercent + '%'
                });
            } else if (leftPercent > -1) {
                $('.center-track').css({
                    width: (100 - leftPercent) + '%',
                    left: leftPercent + '%'
                });
            } else if (rightPercent > -1) {
                $('.center-track').css({
                    width: (100 - rightPercent) + '%',
                    left: 0
                });
            } else {
                $('.left-track').css({
                    width: '100%',
                    left: 0
                });
            }
            if (rightPercent > -1) {
                $('.right-track').css({
                    width: rightPercent + '%'
                });
            } else {
                $('.left-track').css({
                    width: '0'
                });
            }
            if (rightPercent < 0) {
                return -1;
            }
            if (leftPercent < 0) {
                return 1;
            }
            this.trackwidth = $('.center-track').width();
            return false;
        },
        updateCenter: function(mid) {
            this.currentMid = mid;
            $('.center-time').text(this.formatLabel(this.serialStart + this.currentMid));
        },
        setCenter: function() {
            var pixelCenter = this.currentMid / this.secondsPerPixel,
                half = this.viewPortWidth / 2,
                left = (pixelCenter - half) * -1;
            if (left > 0) {
                left = 0;
            }
            this.$dragHandle.css({
                left: left + 'px'
            });
        },
        /**
         * A method to redraw the items
         */
        redraw: function() {
            this.serializeEvents(true);
            this.$markerWrapper.empty();
            this.$ticBar.empty();
            this.zoom = this.zoom;
            var zoomInt = this.baseZoom.level - this.zoom;
            if (this.zoom > 0) {
                $('.zoomout', this.$zoom).show();
                this.currentZoom = Mediakron.Timeline.zoom.Levels[zoomInt];
                this.currentZoom.level = zoomInt;
                this.secondsPerPixel = this.currentZoom.inc / this.viewPortWidth;
                this.serialMid = this.currentZoom.inc / 2;
            } else {
                this.updateCenter(this.serialMid);
                $('.center-time').text(this.formatLabel(this.serialStart + this.currentMid));
                this.viewPortWidth = this.element.width() - 25;
                this.viewPortHeight = this.element.height();
                this.secondsPerPixel = this.serialRange / this.viewPortWidth;
                this.viewWidth = this.serialRange / this.secondsPerPixel;
            }

            this.placeMarkers();
            this.setCenter();
            this.drawTics();
            this.viewWidth = this.serialRange / this.secondsPerPixel;
            this.$dragHandle.width(this.viewWidth);
            this.renderChart();
        },
        zoomIn: function() {
            this.$markerWrapper.empty();
            this.$ticBar.empty();
            this.zoom = this.zoom + 1;
            if (this.zoom > 0) $('.zoomout', this.$zoom).show();
            if (this.zoom > 0) $('.zoomhome', this.$zoom).show();
            if (this.zoom > 0) $('.dragHandle').addClass('zoomed');
            var zoomInt = this.baseZoom.level - this.zoom;
            this.currentZoom = Mediakron.Timeline.zoom.Levels[zoomInt];
            this.currentZoom.level = zoomInt;
            this.secondsPerPixel = this.currentZoom.inc / this.viewPortWidth;
            this.serialMid = this.currentZoom.inc / 2;
            this.placeMarkers();
            this.setCenter();
            this.drawTics();
            this.viewWidth = this.serialRange / this.secondsPerPixel;
            this.$dragHandle.width(this.viewWidth);
            this.renderChart();
        },
        zoomOut: function() {
            this.$markerWrapper.empty();
            this.$ticBar.empty();
            this.zoom = this.zoom - 1;
            if (this.zoom === 0) {
                $('.zoomout', this.$zoom).hide();
                $('.zoomhome', this.$zoom).hide();
                $('.dragHandle').removeClass('zoomed');
                this.currentZoom = this.baseZoom;
                this.secondsPerPixel = this.serialRange / this.viewPortWidth;
            } else {
                var zoomInt = this.baseZoom.level - this.zoom;
                this.currentZoom = Mediakron.Timeline.zoom.Levels[zoomInt];
                this.currentZoom.level = zoomInt;
                this.secondsPerPixel = this.currentZoom.inc / this.viewPortWidth;
            }
            this.viewWidth = this.serialRange / this.secondsPerPixel;
            this.placeMarkers();
            this.setCenter();
            this.drawTics();
            this.$dragHandle.width(this.viewWidth);
            this.renderChart();
        },
        zoomHome: function() {
            this.$markerWrapper.empty();
            this.$ticBar.empty();
            this.zoom = 0;
            $('.zoomhome', this.$zoom).hide();
            $('.zoomout', this.$zoom).hide();
            $('.dragHandle').removeClass('zoomed');
            this.currentZoom = this.baseZoom;
            this.secondsPerPixel = this.serialRange / this.viewPortWidth;
            this.viewWidth = this.serialRange / this.secondsPerPixel;
            this.placeMarkers();
            this.setCenter();
            this.drawTics();
            this.$dragHandle.width(this.viewWidth);
            this.renderChart();
        },

        timelineStart: function() {
            var timelinestart = this.$timelinestart = $('<div id="timelinestart">' + this.formatLabel(this.serialStart) + '</div>');
            this.$ticBar.before(timelinestart);
        },

        timelineEnd: function() {
            var timelineend = this.$timelineend = $('<div id="timelineend">' + this.formatLabel(this.serialEnd) + '</div>');
            this.$ticBar.after(timelineend);
        },

        getProp: function(prop) {},

        /**
         * Draw the ticks on the top bar
         */
        drawTics: function() {
            this.$ticBar.empty();
            this.firstTic = false;
            this.lastTic = false;
            var tics = this.currentZoom.tics,
                ticInc = this.currentZoom.inc / this.currentZoom.tics,
                i = 0,
                div;
            this.ticDuration = ticInc;
            this.ticWidth = this.ticDuration / this.secondsPerPixel;

            // tics should start from a round down to the mod
            var realStart = this.serialStart - (this.serialStart % 10);

            var startDiff = (this.serialStart - realStart) / this.secondsPerPixel,
                ticStart,
                leftstart = Math.abs(this.$dragHandle.position().left) - startDiff,
                time,
                visibleLeftTime = this.serialStart + (leftstart * this.secondsPerPixel);

            // add first tick, though first tic shouldn't necessairly be a full tic
            if (tics) {
                for (i; i <= tics; i++) {
                    left = leftstart + (this.ticWidth * i);
                    time = visibleLeftTime + (this.ticDuration * i);
                    if (time > 0) {
                        //time = time - 31557600;
                    } else if (time < 0) {
                        //time = time + 31557600;
                    } else {
                        time = time;
                    }
                    this.addTic(left, time, tics);
                    if (!this.firstTic) this.firstTic = time;
                }
                this.lastTic = time;
            }
        },
        /**
         * build the ticbar at the top
         */
        addTics: function() {
            var left = this.$dragHandle.position().left,
                leftTime = this.serialStart + (Math.abs(left) * this.secondsPerPixel),
                rightTime = leftTime + (this.viewPortWidth * this.secondsPerPixel),
                right, tics = this.currentZoom.tics,
                ticInc = this.currentZoom.inc / this.currentZoom.tics,
                time;

            // The first tick might not be a full tick.  The first
            // full tic should start with a number that's divisible by the inc
            if (leftTime < this.firstTic) {
                left = ((this.firstTic - this.serialStart) / this.secondsPerPixel) - this.ticWidth;
                time = this.firstTic - this.ticDuration;
                this.addTic(left, time, tics);
                this.firstTic = time;
            }
            if (rightTime > this.lastTic) {
                left = ((this.lastTic - this.serialStart) / this.secondsPerPixel) + this.ticWidth;
                time = this.lastTic + this.ticDuration;
                this.addTic(left, time, tics);
                this.lastTic = time;
            }
        },
        /**
         * Adding Tics to thebar a tthe top.  Each tic has label
         */
        addTic: function(left, time, tics) {
            div = document.createElement('div'); //output -> [object HTMLDivElement]
            div.className = 'timelineTic timelineTic-' + time;
            div.style.height = "20px";
            div.style.bottom = '0px';
            div.style.width = this.ticWidth + 'px';
            div.style.left = left + "px";
            div.innerHTML = '<span>' + this.formatLabel(time) + '</span>';
            this.$ticBar.append(div);
            var b = 0,
                subwidth = (this.ticWidth / tics);
            for (b; b <= tics; b++) {
                div = document.createElement('div'); //output -> [object HTMLDivElement]
                div.className = 'timelineTicSub';
                div.style.height = "5px";
                div.style.bottom = '0px';
                div.style.width = subwidth + 'px';
                div.style.left = left + (subwidth * b) + "px";
                this.$ticBar.append(div);
            }
        },
        formatLabel: function(seconds) {
            return this.format(seconds, this.currentZoom.scope);
        },
        // Place the markers on the page
        placeMarkers: function() {
            if (this.zoom > 0) {
                this.$chart.show();
            } else {
                this.$chart.hide();
            }
            var title = false,
                view = this,
                loadedCategory, groupHeight = 0,
                groupInc = 0,
                color, category;
            _.each(this.sortedEvents.order, function(uri) {
                category = view.sortedEvents[uri];
                if (uri == 'timeline_items') return true;
                if (uri == '000-nocategory') {
                    title = 'Ungrouped';
                    color = '#000';
                } else {
                    loadedCategory = Mediakron.getItemFromURI(uri);
                    if (!loadedCategory) return true;
                    title = loadedCategory.get('title');
                    groupUri = Mediakron.getItemFromURI(uri);
                    color = loadedCategory.color();
                }
                if (view.filterBy.categories) {
                    if (_.size(view.filterBy.categories) > 0) {
                        if (view.filterBy.categories[uri]) return true;
                    }
                }
                $groupWrapper = $('<div class="group-wrapper class="tooltip--n" data-tooltip="View/Edit Folder"" title="' + title + '" style="border-top: 1px solid ' + convertHex(color, 100) + ';background: linear-gradient(to top, ' + convertHex(color, 0) + ' 0%, ' + convertHex(color, 3) + ' 20%, ' + convertHex(color, 7) + ' 100%);"  uri="' + uri + '"/>');

                var number = category.length,
                    i = 0,
                    div, marker, ranges = {},
                    markers = {},
                    tracker = 0,
                    lastLevel = 0,
                    prev = false,
                    center = (view.viewPortHeight / 2) - 20,
                    bottom = center,
                    left = 0,
                    groupValues = {},
                    vertPlacement = 25,
                    highestStack = 0;
                view.rows = {};
                for (i; i < number; i++) {
                    marker = category[i];
                    if (!marker) {
                        continue;
                    }

                    if (view.filterBy.title) {
                        if (view.filterBy.title.length > 0) {
                            var re = new RegExp(view.filterBy.title, "gi");
                            if (marker.title.search(re)) continue;
                        }
                    }
                    group = parseInt(Math.round(marker.start - view.serialStart) / 50, 10);
                    groupValues[group] = groupValues[group] + 1;
                    marker.left = (marker.start - view.serialStart) / view.secondsPerPixel;
                    if (marker.end - marker.start > 0) { // This is a range
                        marker.rangeWidth = (marker.end - marker.start) / view.secondsPerPixel;
                        marker.rangeOpen = '<div class="markerRange" style="width:' + marker.rangeWidth + 'px; color:' + getContrastColor(color) + '">';
                        marker.rangeClose = '</div>';
                        if (marker.rangeWidth > 120) {
                            marker.rightTest = marker.left + marker.rangeWidth;
                        } else {
                            marker.rightTest = marker.left + marker.rangeWidth;
                            //marker.rightTest = marker.left + 120;
                        }
                        marker.color = color;
                    } else {
                        marker.rangeOpen = '<div class="timelinePoint" style="background-color:' + color + '"></div>';
                        marker.color = false;
                        marker.rangeClose = '';
                        marker.rightTest = marker.left + (marker.title.length * 6);
                        marker.rangeWidth = 0;
                    }
                    markers[i] = marker;
                }
                i = 0;

                var mouseEnter = function() {
                    var _this = this;
                    $(this).popover("show");
                    $('.popover a').click(function(e) {
                        e.preventDefault();
                        Mediakron.linkHandle(e);
                    });
                    $(".popover").on("mouseleave", function() {
                        $(_this).popover('hide');
                    });
                };

                var mouseExit = function() {
                    var _this = this;
                    setTimeout(function() {
                        if (!$(".popover:hover").length) {
                            $(_this).popover("hide");
                        }
                    }, 300);
                };

                var getContent = function(e) {
                    return $('.marker-popup', this).html();
                };

                for (i; i < number; i++) {
                    marker = markers[i];
                    if (!marker) {
                        continue;
                    }
                    left = marker.left;
                    rangeWidth = marker.rangeWidth;
                    rangeOpen = marker.rangeOpen;
                    rangeClose = marker.rangeClose;
                    rightTest = marker.rightTest;
                    if (rangeWidth > 0) {
                        rangeClass = ' rangeMarker';

                    } else {
                        rangeClass = ' pointMarker';
                    }
                    // get the first avaliable row
                    var r = 0,
                        q = 0,
                        row = false;
                    if (view.rows.length === 0) {
                        bottom = 0;
                        view.rows[0] = rightTest;
                    } else {
                        while (!row) {
                            if (left > view.rows[r] || (left >= view.rows[r] && rangeWidth > 0) || !view.rows[r]) {
                                bottom = r * vertPlacement;
                                row = true;
                                view.rows[r] = rightTest;
                                break;
                            }
                            r++;
                            if (r > highestStack) highestStack = r;
                        }
                    }
                    bottom = 5 + bottom;
                    div = document.createElement('div'); //output -> [object HTMLDivElement]
                    if (marker.uri === false) {
                        markerTypeClass = ' simpleMarker';
                    } else {
                        markerTypeClass = ' itemMarker';
                    }
                    div.className = 'timelineMarker timelineMarker-' + marker.id + rangeClass + markerTypeClass;
                    div.style.height = "20px";
                    div.style.top = bottom + 5 + 'px';
                    if (marker.uri) div.setAttribute('uri', marker.uri);
                    //                    div.style.width = '105px';
                    div.style.left = left + "px";
                    if (marker.color) div.style.backgroundColor = marker.color;
                    div.innerHTML = rangeOpen + '<div class="markerEdge"></div><span class="timelineMarkerText">' + marker.link + '</span><span class="click-to-view">Click to view</span>' + rangeClose + '<span class="hide marker-popup">' + marker.popup + '</span>';

                    $groupWrapper.append(div);
                    $marker = $(div);
                    $marker.popover({
                        'placement': 'bottom',
                        'html': true,
                        'title': '',
                        'trigger': 'click',
                        'container': 'body',
                        'content': getContent,
                    }).on("mouseenter", mouseEnter).on("mouseleave", mouseExit);
                    view.$markers[marker.id] = $(div);
                }
                groupHeight += ((highestStack + 1) * 35) + 15;
                $groupWrapper.height(((highestStack + 1) * 28) + 10 + 'px');
                
//                var basepath = Mediakron.Settings.baseurl;
//                $groupWrapper.prepend('<span class="group-title"> <a style="color:' + getContrastOnWhite(color) + '" href="' + basepath + uri + '">' + title + '</a></span>');
                $groupWrapper.prepend('<span class="group-title" style="color:' + getContrastOnWhite(color) + '">' + title + '</span>');
                view.$markerWrapper.append($groupWrapper);

            });
            timelineheight = ((groupHeight) + 200) + 'px';
            $('.timelineMarker').click(function(e) {
                $('.timelineMarker').removeClass('timeline-marker-active');
                e.preventDefault();
                e.stopPropagation();
                var uri = $(this).attr('uri');
                if (uri && uri != 'false') view.scrollTimelineToUri(uri);
                $(this).addClass('timeline-marker-active');
                $('.details-sidebar').addClass('details-closed tour-open').removeClass('details-open');
            });
            view.element.height(timelineheight);

        },
        scrollTimelineToUri: function(uri) {
            var $wrapper = $('.timeline-tour'),
                parent = this.options.model.get('uri'),
                $find = $('#timeline-tour-' + parent + '-' + uri);
            $('.tour-highlight').removeClass('tour-highlight');
            if ($find) {
                $wrapper.animate({
                    scrollLeft: $find.offset().left + $wrapper.scrollLeft() - 30
                }, 500);
                $('.tour-item').addClass('not-highlighted'); /* Dim other items */
                $find.addClass('tour-highlight');
                $('.timeline-template').addClass('timeline-tour-open'); /* open tour panel if not open */



            }
        },
        serializeEvent: function(object) {
            return Mediakron.Timeline.serialize.event(object, this.scope, this.granularity);
        },
        baseZoom: function(seconds) {
            var zooms = Mediakron.Timeline.zoom.Levels,
                length = zooms.length,
                i = 0,
                zoom;
            for (i; i < length; i++) {
                zoom = zooms[i];
                if (seconds < zoom.inc) {
                    zoom.level = i;
                    return zoom;
                }
            }
        },
        /**
         * 
         */
        serializeEvents: function(regenerate, fixStart, fixEnd) {

            var sorted = this.options.model.get('sorted');
            if (sorted && !regenerate && !Mediakron.controller.reloadTimeMarkers) {
                return sorted;
            }
            if (!this.map) {
                this.events = this.options.model.getRelationship('events');
            }

            var ev = 0,
                length = this.events.length,
                item, uri, start, id, end, items = [],
                keyedItems = {},
                groups = {
                    'timeline_items': [],
                    'keyed_items': {}
                },
                startSerial, endSerial, scope, group, itemDate, max = 0,
                type = 'item',
                category = false,
                loadedCategory = false,
                categoryLabel, eventItem;
            for (ev; ev < length; ev++) {
                event = this.events[ev];
                uri = this.events[ev].uri;
                if (this.events[ev].data.type) {
                    type = this.events[ev].type;
                } else {
                    type = 'item';
                }
                item = Mediakron.getItemFromURI(uri);
                if (!item && type == 'item') continue;
                start = false;
                if (item) {
                    if (item.start()) {
                        start = item.start();
                    }
                }
                if (!start) {
                    if (event.data.start) {
                        start = event.data.start;
                    }
                }
                if (start) {
                    id = event.uri;
                    end = false;
                    if (item) {
                        if (item.end()) {
                            end = item.end();
                        }
                    }
                    if (!end) {
                        if (event.data.end) {
                            end = event.data.end;
                        }
                    }
                    startSerial = this.serializeDate(start);
                    endSerial = startSerial;
                    if (end) {
                        endSerial = this.serializeDate(end);
                        if (endSerial === false) endSerial = startSerial;
                    }
                    if (this.serialStart === false) this.serialStart = startSerial;
                    if (this.serialStart > startSerial) this.serialStart = startSerial;
                    if (this.serialEnd === false) this.serialEnd = endSerial;
                    if (this.serialEnd < endSerial) this.serialEnd = endSerial;
                    var formated = this.format(startSerial, this.getMinScope(start));
                    if (endSerial > startSerial) {
                        formated = formated + ' - ' + this.format(endSerial, this.getMinScope(end));
                    }
                    category = false;
                    if (event.data.category) category = event.data.category;
                    categoryLabel = '000-nocategory';
                    if (category) categoryLabel = category;
                    if (!groups[categoryLabel]) groups[categoryLabel] = [];
                    if (item) {
                        title = item.get('title');
                        item.set('time', formated);
                        eventItem = {
                            'id': id,
                            'uri': id,
                            'title': title,
                            'start': startSerial,
                            'end': endSerial,
                            'category': category,
                            'popup': item.getPopup('timeline', {
                                'time': formated,
                                'uri': this.options.model.get('uri'),
                                'parent': this.options.model
                            }),
                            'link': item.getContextLink(this.options.model.get('uri'), true),
                            'formated': formated
                        };
                    } else {
                        eventItem = {
                            'id': id,
                            'uri': false,
                            'title': (event.data.title) ? event.data.title : '',
                            'start': startSerial,
                            'end': endSerial,
                            'category': category,
                            'popup': JST['popup.timeline.simple']({
                                'parent': this.options.model,
                                'uri': this.options.model.get('uri'),
                                'label': (event.data.title) ? event.data.title : '',
                                'time': formated,
                                'id': id
                            }),
                            'link': (event.data.title) ? '<span>' + event.data.title + '</span>' : '',
                            'formated': formated
                        };
                    }
                    groups[categoryLabel].push(eventItem);
                    groups.timeline_items.push(eventItem);
                    groups.keyed_items[id] = eventItem;
                }
            }
            _.each(groups, function(group, label) {
                if (group.length > 0) {
                    groups[label] = _.sortBy(group, function(item) {
                        return parseInt(item.start, 10);
                    });
                }
            });
            var map = _.map(groups, function(val, uri){ return uri; });
            groups.order = [];
            groups.order = _.sortBy(map, function(value) {
                var item = Mediakron.getItemFromURI(value), sort = 0;
                if(item){
                    sort = item.get('title');
                }else{
                    sort = value;
                }
                return sort;
            }); // [1, 2, 3]
 
            Mediakron.Timeline.items = sorted = groups;
            if (this.options.model.start()) this.serialStart = this.serializeDate(this.options.model.start());
            if (this.options.model.end()) this.serialEnd = this.serializeDate(this.options.model.end());
            if (this.map) {
                this.serialStart = this.serializeDate(fixStart);
                this.serialEnd = this.serializeDate(fixEnd);
            } else {
                if (this.options.model.end()) {
                    this.serialEnd = this.serialEnd;
                } else {
                    this.serialEnd = this.serialEnd + ((this.serialEnd - this.serialStart) / 8);
                }
            }
            this.serialRange = this.serialEnd - this.serialStart; // number of seconds

            if (this.map) this.options.model.set('timeLayers', groups);
            this.options.model.set('items', groups);
            this.options.model.set('sorted', groups);
            this.sortedEvents = sorted;
            return sorted;
        },
        serializeDate: function(dateObj) {
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
                // get the number of seconds in the year
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
        },
        scopes: {
            'year': 0,
            'month': 1,
            'day': 2,
            'hour': 3,
            'minute': 4,
            'second': 5
        },
        render: function(seconds) {
            var absoluteSeconds = Math.abs(seconds),
                leap = false,
                reference = {
                    normalFourYear: 126230400,
                    nonLeapFourYear: 126144000,
                    nonLeapCentury: 3155673600,
                    leapCentury: 3155760000,
                    fourHundredYears: 12622780800,
                    year: 31536000,
                    leap: 31622400,
                    months: 2678400,
                    shortMonth: 2592000,
                    febuary: 2419200,
                    leapFebuary: 2505600,
                    day: 86400,
                    hour: 3600,
                    minute: 60
                },
                bce = false,
                years = 0,
                month = false,
                day = false,
                hour = false,
                minute = false,
                second = false,
                tracker = absoluteSeconds;
            if (absoluteSeconds >= reference.fourHundredYears) { // figure out how many 400s
                years += Math.floor(absoluteSeconds / reference.fourHundredYears) * 400;
                tracker = absoluteSeconds % reference.fourHundredYears;
            }
            if (tracker >= reference.nonLeapCentury) { // figure out how many 400s
                years += Math.floor(tracker / reference.nonLeapCentury) * 100;
                tracker = tracker % reference.nonLeapCentury;
            }
            if (tracker >= reference.normalFourYear) { // figure out how many 400s
                years += Math.floor(tracker / reference.normalFourYear) * 4;
                tracker = tracker % reference.normalFourYear;
            }
            if (tracker > reference.year) {
                years += Math.floor(tracker / reference.year);
                tracker = tracker % reference.year;
            }
            if (years >= 0) years += 1; // Add the missing year back in to compensate for the lack of a year 0
            leap = this.isLeapYear(years);
            // Our algorithm seems to drift over non leap years.
            // I can't seem to figure out why
            // so this corrects the drift
            if (!leap) {
                if (this.isLeapYear(years - 1)) {
                    tracker -= 0; //
                } else if (this.isLeapYear(years - 2)) {
                    tracker -= 86400; //
                } else if (this.isLeapYear(years - 3)) {
                    tracker -= 86400 * 2; //
                }
            } else {}
            if (tracker > 0) {
                month = this.getMonth(tracker + 86400, leap);
                tracker = tracker - month.seconds;
            }
            if (tracker > 0) {
                day = Math.floor(tracker / reference.day) + 1;
                tracker = tracker % reference.day;
            }
            if (tracker > 0) {
                hour = Math.floor(tracker / reference.hour) + 1;
                tracker = tracker % reference.hour;
            }
            if (tracker > 0) {
                minute = Math.floor(tracker / reference.minute) + 1;
                tracker = tracker % reference.minute;
            }
            if (tracker > 0) {
                second = Math.floor(tracker);
            }
            return {
                years: years,
                month: month,
                day: day,
                hour: hour,
                minute: minute,
                second: second
            };
        },
        format: function(seconds, scope) {
            if (this.timelineType != 'generic') {
                return this.formatTraditional(seconds, scope);
            } else {
                return this.formatGeneric(seconds, scope);
            }
        },
        formatTraditional: function(seconds, scope) {
            var date = this.render(seconds),
                format = '';
            if (date.years > 999999999) {
                format += Math.ceil(date.years / 1000000000) + ' billion years';
            } else if (date.years > 999999) {
                format += Math.ceil(date.years / 1000000) + ' million years';
            } else if (date.years > 9999) format += Math.ceil(date.years / 1000) + ' thousand years';
            else {
                format += date.years;
            }
            if (seconds < 0) format += ' bce';
            scopeInt = 0;
            if (scope) {
                scopeInt = this.scopes[scope];
            }
            if (scopeInt > 1) {
                if (!date.day) date.day = 1;
                format = date.day + ', ' + format;
            }
            if (scopeInt > 0) {
                if (!date.month) date.month = {
                    abrv: 'Jan.'
                };
                format = date.month.abrv + ' ' + format;
            }
            if (date.hour && scopeInt > 2) format += ' ' + date.hour;
            if (date.minute && scopeInt > 3) format += ':' + date.minute;
            if (date.second && scopeInt > 4) format += ':' + date.second;
            return format;
        },
        formatGeneric: function(seconds, scope) {
            var date = this.render(seconds),
                format = '';
            date.years = date.years - 1;
            if (date.years > 0) {
                if (date.years > 999999999) {
                    format += Math.ceil(date.years / 1000000000) + ' billion years';
                } else if (date.years > 999999) {
                    format += Math.ceil(date.years / 1000000) + ' million years';
                } else if (date.years > 9999) format += Math.ceil(date.years / 1000) + ' thousand years';
                else {
                    format += date.years + ' years ';
                }
                if (seconds < 0) format = '-' + format;
            }
            scopeInt = 0;
            if (scope) {
                scopeInt = this.scopes[scope];
            }
            if (date.month) {
                date.month.integer = date.month.integer - 1;
                if (date.month.integer > 0) {
                    format = format + date.month.integer + ' months ';
                }
            }
            if (date.day) {
                format = format + date.day + ' days ';
            }
            if (date.hour && scopeInt > 2) format += ' ' + date.hour;
            if (date.minute && scopeInt > 3) format += ':' + date.minute;
            if (date.second && scopeInt > 4) format += ':' + date.second;
            return format;
        },
        numberWithCommas: function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        isLeapYear: function(year) {
            if (year % 400 === 0) {
                return true;
            } else if (year % 100 === 0) {
                return false;
            } else if (year % 4 === 0) {
                return true;
            } else {
                return false;
            }
        },
        getMonth: function(seconds, leap) {
            var counter = 0,
                febDays = 28,
                febSeconds;
            //2419200
            if (seconds < 2678401) {
                return {
                    integer: 1,
                    label: "January",
                    abrv: "Jan.",
                    days: 31,
                    seconds: 0
                };
            } // this is january
            counter += 2678399;
            if (leap) {
                counter += 2505600;
                febDays = 29;
                febSeconds = 2505600;
            } //29 days
            else {
                counter += 2419200;
                febSeconds = 2419200;
            } //28 days
            if (seconds < counter) {
                return {
                    integer: 2,
                    label: "Febuary",
                    abrv: "Feb.",
                    days: febDays,
                    seconds: counter - febSeconds
                };
            } // Febuary
            counter += 2678400; //31 days
            if (seconds < counter) {
                return {
                    integer: 3,
                    label: "March",
                    abrv: "Mar.",
                    days: 31,
                    seconds: counter - 2678400
                };
            } // march
            counter += 2592000; //30 days
            if (seconds < counter) {
                return {
                    integer: 4,
                    label: "April",
                    abrv: "Apr.",
                    days: 30,
                    seconds: counter - 2592000
                };
            } // april
            counter += 2678400; //31 days
            if (seconds < counter) {
                return {
                    integer: 5,
                    label: "May",
                    abrv: "May",
                    days: 31,
                    seconds: counter - 2678400
                };
            } // may
            counter += 2592000; //30 days
            if (seconds < counter) {
                return {
                    integer: 6,
                    label: "June",
                    abrv: "June",
                    days: 31,
                    seconds: counter - 2592000
                };
            } // june
            counter += 2678400; //31 days
            if (seconds < counter) {
                return {
                    integer: 7,
                    label: "July",
                    abrv: "July",
                    days: 31,
                    seconds: counter - 2678400
                };
            } // july
            counter += 2678400; //31 days
            if (seconds < counter) {
                return {
                    integer: 8,
                    label: "August",
                    abrv: "Aug.",
                    days: 31,
                    seconds: counter - 2678400
                };
            } // august
            counter += 2592000; //30 days
            if (seconds < counter) {
                return {
                    integer: 9,
                    label: "September",
                    abrv: "Sept.",
                    days: 31,
                    seconds: counter - 2592000
                };
            } // septemeber
            counter += 2678400; //31 days
            if (seconds < counter) {
                return {
                    integer: 10,
                    label: "October",
                    abrv: "Oct.",
                    days: 31,
                    seconds: counter - 2678400
                };
            } // October
            counter += 2592000; //30 days
            if (seconds < counter) {
                return {
                    integer: 11,
                    label: "November",
                    abrv: "Nov.",
                    days: 30,
                    seconds: counter - 2592000
                };
            } // November
            counter += 2678400; //31 days
            if (seconds < counter) {
                return {
                    integer: 12,
                    label: "December",
                    abrv: "Dec.",
                    days: 31,
                    seconds: counter - 2678400
                };
            } // December*/
            return false;
        },
        getScope: function(event) {
            if (event.billion) {
                return 'billion';
            } else if (event.million) {
                return 'million';
            } else if (event.millenium) {
                return 'millenium';
            } else if (event.year) {
                return 'year';
            } else if (event.month) {
                return 'month';
            } else if (event.week) {
                return 'week';
            } else if (event.day) {
                return 'day';
            } else if (event.hour) {
                return 'hour';
            } else if (event.minute) {
                return 'minute';
            } else if (event.second) {
                return 'second';
            }
        },
        getMinScope: function(event) {
            if (event.second) {
                return 'second';
            } else if (event.minute) {
                return 'minute';
            } else if (event.hour) {
                return 'hour';
            } else if (event.day) {
                return 'day';
            } else if (event.month) {
                return 'month';
            } else if (event.year) {
                return 'year';
            } else if (event.millenium) {
                return 'millenium';
            } else if (event.million) {
                return 'million';
            } else if (event.billion) {
                return 'billion';
            }
        },
        _setOption: function(key, value) {
            switch (key) {
                case "model":
                    this.model = value;
                    break;
                default:
                    this.options[key] = value;
                    break;
            }
            // For UI 1.8, _setOption must be manually invoked
            // from the base widget
            $.Widget.prototype._setOption.apply(this, arguments);
            // For UI 1.9 the _super method can be used instead
            // this._super( "_setOption", key, value );
        }
    });
})(jQuery, window, document);