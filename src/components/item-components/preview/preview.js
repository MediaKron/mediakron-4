/**
 * @file preview/preview.js
 *
 */
define("/mediakron/js/src/preview/preview.js", 
    [   'text!src/preview/preview.html' ], 
    function(previewTemplate) {
        var DEFAULT_SCALE_DELTA = 1.1;
        var MIN_SCALE = 0.25;
        var MAX_SCALE = 10.0;
        
        //PDFJS.workerSrc = '/mediakron/js/src/preview/pdfjs/build/pdf.worker.js';
        
        var docPreview = function(element, uri) {
            if (!PDFJS.PDFViewer || !PDFJS.getDocument) {
              alert('Please build the library and components using\n' +
                    '`node make generic components`');
            }
            
            this.$el = element;
            this.uri = uri;
            this.scale = 1;
            this.currentScale = false;
            this.pageContents = [];
            this.item = Mediakron.getItemFromURI(uri);
            if(!this.item) return false;
            var file = this.file = this.item.get('text');
            this.filename = this.file.url;
            var type = this.filetype = this.file.type;
            var split = this.filename.split('.'),
                last = split.length - 1,
                ext = split[last];
            this.extension = ext;
            
            this.charactersToNormalize = {
              '\u2018': '\'', // Left single quotation mark
              '\u2019': '\'', // Right single quotation mark
              '\u201A': '\'', // Single low-9 quotation mark
              '\u201B': '\'', // Single high-reversed-9 quotation mark
              '\u201C': '"', // Left double quotation mark
              '\u201D': '"', // Right double quotation mark
              '\u201E': '"', // Double low-9 quotation mark
              '\u201F': '"', // Double high-reversed-9 quotation mark
              '\u00BC': '1/4', // Vulgar fraction one quarter
              '\u00BD': '1/2', // Vulgar fraction one half
              '\u00BE': '3/4' // Vulgar fraction three quarters
            };
            var replace = Object.keys(this.charactersToNormalize).join('');
            this.normalizationRegex = new RegExp('[' + replace + ']', 'g');
            
            this.previewFilename = this.filename.replace(ext,'pdf');
            
            this.template = _.template(previewTemplate);

            this.$el.html(this.template({uri: this.uri}));
            
            this.totalPages = $('.totalPages', this.$el);
            this.currentPage = $('.currentPage', this.$el);
            this.searchField = $('.searchPdf', this.$el);
            this.searchButton = $('.doSearch', this.$el);
            this.prevSearch = $('.prevSearch', this.$el);
            this.nextSearch = $('.nextSearch', this.$el);
            
            var view = this;
            
            this.prevSearch.click(function(){
                view.currentResult--;
                if(view.currentResult < 0) view.currentResult = view.searchResults.length - 1;
                view.goToResult();
            });
            this.nextSearch.click(function(){
                view.currentResult++;
                if(view.currentResult > (view.searchResults.length - 1)) view.currentResult = 0;
                view.goToResult();
            });
            
            this.zoomInButton = $('.pdfZoomIn', this.$el);
            
            this.zoomInButton.click(function(){ view.zoomIn() });
            this.zoomOutButton = $('.pdfZoomOut', this.$el);
            this.zoomOutButton.click(function(){ view.zoomOut() });
            
            
            this.searchButton.click(function(){
                var val = view.searchField.val();
                view.search(val);
            });
            
            this.$canvas = $('#canvas-' + this.uri, this.$el);
    
            if(type == 'pdf'){
                // handle pdf 
                this.previewPath = Mediakron.Settings.filepath + this.filename;
            }else if(type == 'doc' || type == 'ppt' || type == 'xls'){
                this.previewPath = Mediakron.Settings.filepath + 'preview/' + this.previewFilename + '?ext=' + ext;
            }

            this.render();
            return this;
        };
    docPreview.prototype = {
        render: function(){
            var view = this,
                container = document.getElementById('canvas-'+view.uri);

            PDFJS.getDocument(view.previewPath).then(function (pdfDocument) {
                view.numPages = pdfDocument.numPages;
                var i=1;
                view.currentPage.text(i);
                view.totalPages.text(view.numPages);

                view.canvas = document.getElementById('canvas-'+view.uri);
                view.pdf = pdfDocument;
                view.loadPage(1);
                
            });
        },
        pages: {},
        loadPage: function(number){
            var view = this, i = 0, page;
            if(number > this.numPages){

                if(!view.thumbnails){
                    for(i;i<=view.numPages;i++){
                        page = view.pages[i];
                        if(page){
                            view.getThumbnail(page);
                        }
                        
                        if(i == view.numPages){
                            view.thumbnails = true;
                        }
                    }
                }
                return false;
            }
            
            var view = this;
            this.page = number;
            //view.currentPage.text(number);
            //this.hideNextPrev(number);
            
            this.pdf.getPage(number).then(function (pdfPage) {
              if(view.canvas){
                if(!view.currentScale){
                    view.currentScale = scale = (view.canvas.offsetWidth*.7) / pdfPage.getViewport(view.scale).width;
                }else{
                    view.currentScale = scale = view.currentScale;
                }
                
                viewport = pdfPage.getViewport(scale);
                // Creating the page view with default parameters.
                // only render the thumbnails once
                
                var pdfPageView = new PDFJS.PDFPageView({
                  container: view.canvas,
                  id: number,
                  scale: scale,
                  defaultViewport: viewport,
                  // We can enable text/annotations layers, if needed
                  textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
                  annotationsLayerFactory: new PDFJS.DefaultAnnotationsLayerFactory()
                });
                pdfPageView.setPdfPage(pdfPage);
                
                pdfPageView.draw();
                view.pages[number] = pdfPage;
                view.loadPage(number+1);
              }
            });
            
        },
        hideNextPrev: function(current){
            if(current == 1){
                this.prevPage.hide();
            }else if(current > 1){
                this.prevPage.show();
            }
            
            if(current == this.numPages){
                this.nextPage.hide();
            }else if(current < this.numPages){
                this.nextPage.show();
            }
        },
        zoomIn: function pdfViewZoomIn(ticks) {
            this.$canvas.empty();
            var newScale = this.currentScale;
            do {
              newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
              newScale = Math.ceil(newScale * 10) / 10;
              newScale = Math.min(MAX_SCALE, newScale);
            } while (--ticks > 0 && newScale < MAX_SCALE);

            this.currentScale = newScale;
            this.loadPage(1);
        },
        
        zoomOut: function pdfViewZoomOut(ticks) {
            this.$canvas.empty();
            var newScale = this.currentScale;
            do {
              newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
              newScale = Math.floor(newScale * 10) / 10;
              newScale = Math.max(MIN_SCALE, newScale);
            } while (--ticks > 0 && newScale > MIN_SCALE);
            this.currentScale = newScale;
            this.loadPage(1);
        },
        searchResults: false,
        currentResult: 0,
        search: function(search){
            $('.pdf-viewer').removeHighlight().highlight(search);
            this.searchResults = $('.highlight',this.$el);
            if($('.highlight').length == 0){
                Mediakron.message({
                text: "Sorry, no results found",
                type: 'warning',
                timeout: 4000,
                layout: 'bottom',
                confirm: false
                });
                this.searchField.val('');
            }
            this.currentResult = 0;
            this.goToResult();
        },
        
        highlightCurrent: function(){
            $('.current-highlight').removeClass('current-highlight');
            $('.highlight').eq(this.currentResult).addClass('current-highlight');
        },
        
        goToResult: function(){
            var offset = this.$canvas.offset().top;
            var $current = $('.highlight').eq(this.currentResult);
            scroll = (($('#pageContainer1').offset().top - offset)*-1) + ($current.offset().top - offset - 20);
            this.$canvas.scrollTop(scroll);
            this.highlightCurrent();
        },
        
        
        extractText: function(callback) {
            var self = this;
            function getTextContentPage(i){
                self.pdf.getPage(i).then(function(page) {
                    page.getTextContent().then(function(textContent){
                        var textItems = textContent.items;
                        var str = [];
            
                        for (var j = 0, len = textItems.length; j < len; j++) {
                            str.push(textItems[j].str);
                        }
                        
            
                        // Store the pageContent as a string.
                        self.pageContents.push(str.join(''));
                        i++;

                        if(i <= self.numPages){
                            getTextContentPage(i);
                        }else{

                        }
                        
                    });
                });
            }
            getTextContentPage(1);
        },
        normalize: function (text) {
          var self = this;
          return text.replace(this.normalizationRegex, function (ch) {
            return self.charactersToNormalize[ch];
          });
        },
        getThumbnail: function(page){
            var viewport = page.getViewport(0.5), view = this;
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
    
            var renderContext = {
                  canvasContext: ctx,
                  viewport: viewport
            };
    
            page.render(renderContext).then(function(){
            //set to draw behind current content
                ctx.globalCompositeOperation = "destination-over";
        
                //set background color
                ctx.fillStyle = "#ffffff";
        
                //draw background / rect on entire canvas
                ctx.fillRect(0,0,canvas.width,canvas.height);
                var img = canvas.toDataURL();
                var index = page.pageIndex+1;
                var image = $('<div class="thumbnail-'+index+'"><img page="'+index+'" src="'+img+'"/><span class="thumbnail-label">Page '+index+'</span></div>');
                var currentPage = page;
                image.click(function(e){
                    var scroll = ($('#pageContainer1').position().top*-1) + $('#pageContainer'+index).position().top;
                    view.$canvas.animate({scrollTop: scroll });
                });
                $(".pdfThumbnails").append(image);
            });
        }
    };
    return docPreview;
});

/*

highlight v5

Highlights arbitrary terms.

<http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>

MIT license.

Johann Burkard
<http://johannburkard.de>
<mailto:jb@eaio.com>

*/

jQuery.fn.highlight = function(pat) {
 function innerHighlight(node, pat) {
  var skip = 0;
  if (node.nodeType == 3) {
   var pos = node.data.toUpperCase().indexOf(pat);
   pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
   if (pos >= 0) {
    var spannode = document.createElement('span');
    spannode.className = 'highlight';
    var middlebit = node.splitText(pos);
    var endbit = middlebit.splitText(pat.length);
    var middleclone = middlebit.cloneNode(true);
    spannode.appendChild(middleclone);
    middlebit.parentNode.replaceChild(spannode, middlebit);
    skip = 1;
   }
  }
  else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
   for (var i = 0; i < node.childNodes.length; ++i) {
    i += innerHighlight(node.childNodes[i], pat);
   }
  }
  return skip;
 }
 return this.length && pat && pat.length ? this.each(function() {
  innerHighlight(this, pat.toUpperCase());
 }) : this;
};

jQuery.fn.removeHighlight = function() {
 return this.find("span.highlight").each(function() {
  this.parentNode.firstChild.nodeName;
  with (this.parentNode) {
   replaceChild(this.firstChild, this);
   normalize();
  }
 }).end();
};