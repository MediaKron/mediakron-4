/**
 * @file story/wysiwyg/parse.js
 *
 */
define("/mediakron/js/src/story/wysiwyg/parse.js", [], function() {
    var parser = function() {
        this.domRepresentation = {};
        this.tags = ['p', 'blockquote', 'breadcrumb', 'cite', 'figure', 'h1', 'h2', 'h3', 'ol', 'ul', 'li', 'a', 'strong', 'i', 'b', 'i', 'em', 'br', 'sup'];
        this.blocks = ['p', 'blockquote', 'figure', 'h1', 'h2', 'h3', 'ol', 'ul', 'li'];
        this.formatting = ['a', 'strong', 'i', 'b', 'i', 'em', 'br', 'cite', 'sup', 'breadcrumb'];
        this.workingObject = false;
        this.order = [];
        this.initialize();
    };
    parser.prototype = {
        initialize: function(){
          // subscribe to the needs cleaning event
          
        },
        getObjectAndMakeHTML: function(data) {
            if (!data) {
              
            } else if (typeof(data) == 'object') {
              if(data.order){
                this.workingObject = data;
                return this.jsonToHtml(data);
              }else{
                return this.mdJsonToHtml(data);
              }
            } else {
                var html = this.cleanHTML(data);
                var object = this.readToObject(html);
                return this.mdJsonToHtml(this.workingObject);
            }
        },
        mdJsonToHtml: function(obj){
            var div = document.createElement('div'),
                element, count, i, view = this,
                isLi = false,
                liAdd = '',
                order, length = 0,
                i = 0,
                el, id;
                length = obj.length;
              for(i; i<length; i++){
                id = false;
                el = obj[i];
                if(el){
                  if(el.tag == 'li'){
                    isLi = true;
                    if(el.content != ''){
                      var cleaned = el.content.replace('<li>', '');
                      cleaned = cleaned.replace('</li>', '');
                      liAdd = liAdd + '<li>' + cleaned + '</li>';
                    }
                    continue;
                  }else{
                    if(isLi){
                      element = document.createElement('ul');
                      element.innerHTML = liAdd;
                      if(element){
                        if(!id) id = this.guidGenerator();
                        element.className = 'mk-'+id+' '+element.className;
                        element.setAttribute('name', id);
                        div.appendChild(element);
                      }
                      isLi = false;
                      liAdd = '';
                    }
                  }

                  switch(el.tag){
                    
                    case 'figure':
                      var item = Mediakron.getItemFromURI(el.uri),
                        type;
                      if(item){
                        type = item.get('type');
                        if(!el.align) el.align = 'alignCol';
                        element = document.createElement(el.tag);
                        element.setAttribute('uri', el.uri);
                        element.setAttribute('type', type);
                        element.setAttribute('align', el.align);
                        element.setAttribute('render', false);
                        element.className = el.align+" type-"+type;
                      }
                      break;
                    case 'ol':
                    case 'ul':
                      element = document.createElement(el.tag);
                      element.innerHTML = el.content;
                    break;
                    default:
            
                      element = document.createElement(el.tag);
                      if(el.align){
                        if(el.align == 'center'){
                          element.setAttribute('align', el.align);
                        }else{
                          element.setAttribute('align', el.align);
                        }
                      }
                      element.innerHTML = el.content;
                    break;
                  }
                  if(element){
                    
                    if(!id) id = this.guidGenerator();
                    element.className = 'mk-'+id+' '+element.className;
                    element.setAttribute('name', id);
                    div.appendChild(element);
                  }
                }
              }
            return div.innerHTML;
        },
        jsonToHtml: function(obj) {
            var div = document.createElement('div'),
                element, count, i, view = this,
                order, length = 0,
                i = 0,
                el, id;
            if (obj.order) {
                order = obj.order;
            } else {
                order = this.order;
            }
            length = order.length;
            for (i; i < length; i++) {
                id = order[i];
                el = obj[id];
                if(el){
                    switch(el.tag){
                        
                        case 'figure':
                                var item = Mediakron.getItemFromURI(el.uri),
                                    type;
                                if(item){
                                    type = item.get('type');
                                    if(!el.align) el.align = 'alignCol';
                                    element = document.createElement(el.tag);
                                    element.setAttribute('uri', el.uri);
                                    element.setAttribute('type', type);
                                    element.setAttribute('align', el.align);
                                    element.setAttribute('render', false);
                                    element.className = el.align+" type-"+type;
                                }
                            break;
                        case 'ol':
                        case 'ul':
                                element = document.createElement(el.tag);
                            break;
                        default:
                            
                                element = document.createElement(el.tag);
                                if(el.align){
                                    if(el.align == 'center'){
                                        element.setAttribute('align', el.align);
                                    }else{
                                        element.setAttribute('align', el.align);
                                    }
                                    
                                }
                            break;
                    }
                    if (el.children.length > 0) {
                        element = view.childrenToHTML(element, el.children);
                    }
                    if(element){
                        if(!id) id = this.guidGenerator();
                        element.className = 'mk-'+id+' '+element.className;
                        element.setAttribute('name', id);
                        div.appendChild(element);
                    }
                }
            }
            return div.innerHTML;
        },

        childrenToHTML: function(element, children) {

            if(!children[0].tag) children = children[0];
            var count = children.length,
                child, attachTo = element, save, node;
            var i = 0;
            if (count > 0) {
                for (i; i < count; i++) {
                    child = children[i];
                    node = false;
                    if (this.isBlock(child.tag)) {
                        node = document.createElement(child.tag);
                    } else if (child.tag == 'a') {
                        node = document.createElement(child.tag);
                        node.href = child.href;
                    } else if (this.isFormatting(child.tag)) {
                        node = document.createElement(child.tag);
                    } else if (child.tag == 'text') {
                        node = document.createTextNode(child.text);
                    }
                    if(node){
                        if (child.children) {
                            if (child.children.length > 0) {
                                node = this.childrenToHTML(node, child.children);
                            }
                        }
                        attachTo.appendChild(node);
                    }
                }
            }
            return attachTo;
        },
        isBlock: function(name) {
            return this.blocks.indexOf(name) > -1;
        },
        isSpan: function(name) {
            return name == 'span';
        },
        isFormatting: function(name) {
            return this.formatting.indexOf(name) > -1;
        },
        
        domBlocksToJson: function(dom){
          this.readToObject(dom);
        },
        
        readToObject: function(html){
          //this.saveSelection();
          html = this.cleanHTML(html);
          var obj = [],
              dom = this.strToDom(html).body,
              nodes = this.flatten(dom),
              i = 0, length = nodes.length,
              node = false, parent = false,
              rendered = false;
      
          for (var i = nodes.length - 1; i >= 0; i--) {
            this.process(nodes[i]);
          }
          this.workingObject = this.getObjects(dom);
        },
        getObjects: function(node){
          var obj = [], child = false, tag = false, content, align, id;
          for (var i = 0; i < node.childNodes.length; i++) {
            child = node.childNodes[i];
            tag = child.nodeName.toLowerCase();

            if(tag == 'br') continue;
            if(!this.allowedBlockTags(tag)) tag = 'p';
            
            content = child._output;
            if (node.childNodes[i].nodeType === 1) {
              
              id = child.getAttribute('name');
              if(!id) id = this.guidGenerator();
              if(tag == 'figure'){
                obj.push({
                  id: id,
                  tag: tag,
                  uri: child.getAttribute('uri'),
                  align: this.getAlignment(child, true)
                });
              }else{

                align = this.getAlignment(child);
                obj.push({
                  id: id,
                  tag: tag,
                  content: content,
                  align: this.getAlignment(child)
                });
              }
            }else if (node.childNodes[i].nodeType === 3) {
              // annoyingly, not an element, lets make it one
              if(child.textContent.match(/\S+/g)){
                obj.push({
                  id: id,
                  tag: 'p',
                  content: child.textContent,
                  align: 'left'
                });
              }
              
            }
          }
          return obj;
        },
        
        // parse the html to a dom object
        strToDom: function(string) {
          var tree = new window.DOMParser().parseFromString(string, 'text/html');
          return tree;
        },
        
        // formatting replacements
        format: function(tag, node){
          var format = false;
      
          switch (tag){
            case "b":
              format = function(content,node){ return '<b>' + content + '</b>'; }
              break;
            case "cite":
              var annotationid = node.getAttribute('annotation-id'),
                  classid = node.getAttribute('class');
              format = function(content,node){ return '<cite annotation-id="'+annotationid+'">' + content + '</cite>'; }
              break;
            case "i":
              format = function(content,node){ return '<i>' + content + '</i>'; }
              break;
            case "sup":
              format = function(content,node){ return '<sup>' + content + '</sup>'; }
              break;
            case "br":
              format = function(content,node){ return content + "<br>"; }
              break;
            case "li":
              format = function(content,node){ return '<li>' + content + '</li>'; }
              break;
            case "a":
              format = function(content,node){
                var titlePart = node.title ? ' "'+ node.title +'"' : '';
                return '<a href="' + node.getAttribute('href') + '">' + content + '</a>';
              }
            break;
          }
          return format;
        },
        
        process: function(node){
          var text = '', content = this.getContent(node),
              tag = node.tagName.toLowerCase();
              format = this.format(tag, node);
          if(format){
            text += format(content, node);
          }else{
            text += content;
          }
          
          node._output = text;
        },
        
        getContent: function(node) {
    
          var text = '';
          for (var i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeType === 1) {
              text += node.childNodes[i]._output;
            }
            else if (node.childNodes[i].nodeType === 3) {
              text += node.childNodes[i].data;
            }
            else { continue; }
          }
          return text;
        },
        
        // This should flatten the dom object out
        flatten: function(node) {
          var inqueue = [node],
              outqueue = [],
              elem, children, i;
        
          while (inqueue.length > 0) {
            elem = inqueue.shift();
            outqueue.push(elem);
            children = elem.childNodes;
            for (i = 0 ; i < children.length; i++) {
              if (children[i].nodeType === 1) { inqueue.push(children[i]); }
            }
          }
          outqueue.shift();
          return outqueue;
        },
        
        allowedBlockTags: function(tag){
          if(this.blocks.indexOf(tag) > -1) return tag;
          return false;
        },
        
        removeBlanks: function(parsed){
            var order = parsed.order, i = 0, length = order.length, item, id;
            for(i;i<length;i++){
                id = order[i];
                item = parsed[item];
            }
        },
        getAlignment: function(element, figure) {
            var alignment = element.getAttribute('mkalign');
            if (alignment) return alignment;
            alignment = element.getAttribute('alignment');
            if (alignment) return alignment;
            alignment = element.getAttribute('align');
            if (alignment) return alignment;

            var style = $(element).attr('style');
            if(style){
              return $(element).css('text-align');
            }
            
            /*if(figure){
                if(figure.indexOf('alignLeft') > -1) return 'alignLeft';
                if(figure.indexOf('alignRight') > -1) return 'alignRight';
                if(figure.indexOf('alignFull') > -1) return 'alignFull';
            }*/
            return false;
            
        },
        guidGenerator: function() {
            return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
        },
        getBlocks: function(dom){

          return dom;
        },
        // clean lists
        cleanLists: function(html){
          return html;
        },
        
        isBulletList: function(text) {
          return /^[\s\u00a0]*[\u2022\u00b7\u006f\u00a7\u25CF]\s*/.test(text)
        },
        isNumericList: function(text) {
            var found, patterns;
            patterns = [/^[IVXLMCD]{1,2}\./, // Roman upper case
            /^[ivxlmcd]{1,2}\./, // Roman lower case
            /^[a-z]{1,2}[\.\)]/, // Alphabetical a-z
            /^[A-Z]{1,2}[\.\)]/, // Alphabetical A-Z
            /^[0-9]+\./, // Numeric lists
            /^[\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d]+\./, // Japanese
            /^[\u58f1\u5f10\u53c2\u56db\u4f0d\u516d\u4e03\u516b\u4e5d\u62fe]+\./ // Chinese
            ];
            text = text.replace(/^[\u00a0 ]+/, '');
            $.each(patterns, function(i, pattern) {
                if (pattern.test(text)) {
                    found = true;
                    return false;
                }
            });
            return found;
        },
        
        makeElementLi: function(el, name, newname){
         el.outerHTML = el.outerHTML.replace(/p/g,"li");

        },
        fixCitation: function($el){
          $('cite', $el).each(function(el){
            var $cite = $(this);
            if(!$cite.attr('annotation-id')){
              // try to get the annotation id from the class
              // because the content editable paste doesn't preserve it
              $cite.removeClass('annotation-undefined');
              var classes = $cite.attr('class').split(/\s+/);;
              
              for(i = 0;i<classes.length;i++){
                if(classes[i].indexOf('annotation-') > -1 && classes[i] != 'annoation-undefined'){
                  var id = classes[i].replace('annotation-','');
                  $cite.attr('annotation-id', id);
                }
              }
            }
          });
        },
         // wrap the html clean function in our custom handler 
        cleanHTML: function(html, stripFigures, cleanParagraphs){
          //return html;
          // TODO: Rewrite this function to work right
          var tags = this.tags;
          var replace = [
              [["strong", "big"], "b"],
              [["em"], "i"]
            ];
          var attributes = [
              ["id"], 
              ["name", this.blocks],
              ["uri", ["figure"]], 
              ["align", ["p", "figure", "h2", "h3"]],
              ["class", ["cite", "figure", 'breadcrumb']],
              ["annotation-id", ["cite"]],
              ['comment-id', ["breadcrumb"]],
              ['unique-id', ['breadcrumb']],
              ["type", ["figure"]],
              ["draggable", ["figure"]],
              ["render", ["figure"]]
            ];
            
        var empty = ["p", 'breadcrumb'];
          if(stripFigures){
            tags = ['p', 'blockquote', 'br', 'figure', 'breadcrumb', 'h1', 'h2', 'h3', 'ol', 'cite', 'ul', 'li', 'a', 'strong', 'i', 'b', 'i', 'em', 'span'];
            replace.push([['h1', 'h4','h5','h6'], 'h2']);
            replace.push([['td'],'p']);
            empty = ["p", 'breadcrumb'];
            attributes = [
              ["uri", ["figure"]], 
              ["id", ["span", 'breadcrumb']],
              ["align", ["p", "figure", "h2", "h3"]],
              ["class", ["cite", "figure", "span", 'breadcrumb']],
              ["annotation-id", ["cite"]],
              ['comment-id', ["breadcrumb"]],
              ['unique-id', ['breadcrumb']],
              ["type", ["figure"]],
              ["draggable", ["figure"]],
              ["render", ["figure"]]
            ];
          }

            if (cleanParagraphs){
                tags = ['p', 'blockquote', 'br', 'breadcrumb', 'figure', 'h1', 'h2', 'h3', 'ol', 'cite', 'ul', 'li', 'a', 'strong', 'i', 'b', 'i', 'em', 'span'];
                empty = ['breadcrumb'];
            }

          var newhtml = $.htmlClean(html,{
            bodyOnly: false,
            allowedTags: tags,
            allowedAttributes: attributes,
            removeAttrs: false,
            allowComments: false,
            allowEmpty:empty,
            replace: replace,
            replaceStyles: [
              [/font-weight:\s*bold/i, "strong"],
              [/font-style:\s*italic/i, "em"],
              [/vertical-align:\s*super/i, "sup"],
              [/vertical-align:\s*sub/i, "sub"],
              
              [/font-weight:\s*bold/i, "b"],
              [/font-weight:\s*700/i, "b"],
              [/font-style:\s*italic/i, "i"],
              [/margin-left:\s*36pt/i, "blockquote"],
              [/text-align:\s*left/i, 'p', 'align','"left"'],
              [/text-align:\s*right/i, 'p', 'align','"right"'],
              [/text-align:\s*center/i, 'p', 'align','"center"']
            ]
          });

          if(stripFigures){
            newhtml = newhtml.replace(new RegExp('<p></p>', 'g'), '');
            newhtml = newhtml.replace(new RegExp('<p>&nbsp;</p>', 'g'), '');
            newhtml = newhtml.replace(new RegExp('<p><i>&nbsp;</i></p> ', 'g'), '');
            newhtml = this.cleanLists(newhtml);
            // try to clean citations
            
          }      
          return newhtml;
        }
    };
    
    return parser;
});
/*
HTML Clean for jQuery   
Anthony Johnston
http://www.antix.co.uk    
    
version 1.4.1

$Revision$

requires jQuery http://jquery.com   

Use and distibution http://www.opensource.org/licenses/bsd-license.php

2010-04-02 allowedTags/removeTags added (white/black list) thanks to David Wartian (Dwartian)
2010-06-30 replaceStyles added for replacement of bold, italic, super and sub styles on a tag
2012-04-30 allowedAttributes added, an array of attributed allowed on the elements
2013-02-25 now will push non-inline elements up the stack if nested in an inline element
2013-02-25 comment element support added, removed by default, see AllowComments in options
2013-08-22 removeTagsAndContent added, an array of tag names to do just that
2016-03-11 allowBreakAsLastChild added, 
*/
(function ($) {
    $.fn.htmlClean = function (options) {
        // iterate and html clean each matched element
        return this.each(function () {
            if (this.value) {
                this.value = $.htmlClean(this.value, options);
            } else {
                this.innerHTML = $.htmlClean(this.innerHTML, options);
            }
        });
    };
    
    // clean the passed html
    $.htmlClean = function (html, options) {
        options = $.extend({}, $.htmlClean.defaults, options);
        options.allowEmpty = tagAllowEmpty.concat(options.allowEmpty);

        var tagsRE = /(<(\/)?(\w+:)?([\w]+)([^>]*)>)|<!--(.*?--)>/gi;
        var attrsRE = /([\w\-]+)\s*=\s*(".*?"|'.*?'|[^\s>\/]*)/gi;
        var tagMatch;
        var root = new Element();
        var stack = [root];
        var container = root;
        var containsOL = false;
        var containsUL = false;
        
        var inOL = false;
        var inUL = false;

        if (options.bodyOnly) {
            // check for body tag
            if (tagMatch = /<body[^>]*>((\n|.)*)<\/body>/i.exec(html)) {
                html = tagMatch[1];
            }
        }
        html = html.concat("<xxx>"); // ensure last element/text is found
        var lastIndex;

        while (tagMatch = tagsRE.exec(html)) {
            var tag = tagMatch[6]
                ? new Tag("--", null, tagMatch[6], options)
                : new Tag(tagMatch[4], tagMatch[2], tagMatch[5], options);

            // add the text
            var text = html.substring(lastIndex, tagMatch.index);
            if (text.length > 0) {
                var child = container.children[container.children.length - 1];
                if (container.children.length > 0
                        && isText(child = container.children[container.children.length - 1])) {
                    // merge text
                    container.children[container.children.length - 1] = child.concat(text);
                } else {
                    container.children.push(text);
                }
            }
            lastIndex = tagsRE.lastIndex;

            if (tag.isClosing) {
                // find matching container
                if (popToTagName(stack, [tag.name])) {
                    stack.pop();
                    container = stack[stack.length - 1];
                }
            } else {
                // create a new element
                var element = new Element(tag);

                // add attributes
                var attrMatch;
                while (attrMatch = attrsRE.exec(tag.rawAttributes)) {

                    // check style attribute and do replacements
                    if (attrMatch[1].toLowerCase() == "style"
                        && options.replaceStyles) {

                        var renderParent = !tag.isInline;
                        for (var i = 0; i < options.replaceStyles.length; i++) {
                            if (options.replaceStyles[i][0].test(attrMatch[2])) {
                                var replaceWith = options.replaceStyles[i][1];
                                if (tag.name == 'h2' || tag.name == 'h3') {
                                    replaceWith = tag.name;
                                }
                                if(options.replaceStyles[i][2]){
                                  tag = new Tag(replaceWith, "", "", options);
                                  element = new Element(tag);
                                  var newatt = new Attribute(options.replaceStyles[i][2], options.replaceStyles[i][3]);
                                  element.attributes.push(newatt);
                                } else {
                                  if (!renderParent) {
                                      tag.render = false;
                                      renderParent = true;
                                  }
                                  container.children.push(element); // assumes not replaced
                                  stack.push(element);
                                  container = element; // assumes replacement is a container
                                  // create new tag and element
                                  tag = new Tag(replaceWith, "", "", options);
                                  element = new Element(tag);
                                }
                            }
                        }
                    }

                    if (tag.allowedAttributes != null
                            && (tag.allowedAttributes.length == 0
                            || $.inArray(attrMatch[1], tag.allowedAttributes) > -1)) {
                        element.attributes.push(new Attribute(attrMatch[1], attrMatch[2]));
                    }
                    
                }

                // add required empty ones
                $.each(tag.requiredAttributes, function () {
                    var name = this.toString();
                    if (!element.hasAttribute(name)) element.attributes.push(new Attribute(name, ""));
                });

                // check for replacements
                for (var repIndex = 0; repIndex < options.replace.length; repIndex++) {
                    for (var tagIndex = 0; tagIndex < options.replace[repIndex][0].length; tagIndex++) {
                        var byName = typeof (options.replace[repIndex][0][tagIndex]) == "string";
                        if ((byName && options.replace[repIndex][0][tagIndex] == tag.name)
                                || (!byName && options.replace[repIndex][0][tagIndex].test(tagMatch))) {

                            // set the name to the replacement
                            tag.rename(options.replace[repIndex][1]);

                            repIndex = options.replace.length; // break out of both loops
                            break;
                        }
                    }
                }
                
          
                // check container rules
                var add = true;
                if (!container.isRoot) {
                    if (container.tag.isInline && !tag.isInline) {
                        if (add = popToContainer(stack)) {
                            container = stack[stack.length - 1];
                        }
                    } else if (container.tag.name == 'p' && tag.name == 'ol'){
                      container = stack[stack.length - 1];
                    } else if (container.tag.name == 'p' && tag.name == 'ul'){
                      container = stack[stack.length - 1];
                    } else if (container.tag.disallowNest && tag.disallowNest
                                && !tag.requiredParent) {
                        add = false;
                    } else if (tag.requiredParent) {
                        if (add = popToTagName(stack, tag.requiredParent)) {
                            container = stack[stack.length - 1];
                        }
                    }
                }

                if (add) {
                    container.children.push(element);

                    if (tag.toProtect) {
                        // skip to closing tag
                        var tagMatch2;
                        while (tagMatch2 = tagsRE.exec(html)) {
                            var tag2 = new Tag(tagMatch2[4], tagMatch2[1], tagMatch2[5], options);
                            if (tag2.isClosing && tag2.name == tag.name) {
                                element.children.push(RegExp.leftContext.substring(lastIndex));
                                lastIndex = tagsRE.lastIndex;
                                break;
                            }
                        }
                    } else {
                        // set as current container element
                        if (!tag.isSelfClosing && !tag.isNonClosing) {
                            stack.push(element);
                            container = element;
                        }
                    }
                }
            }
        }

        // render doc
        return render(root, options).join("");
    };
    
    $.htmlClean.isWhitespace = function (c) { return $.inArray(c, whitespace) != -1; };
    // defaults
    $.htmlClean.defaults = {
        // only clean the body tagbody
        bodyOnly: true,
        // only allow tags in this array, (white list), contents still rendered
        allowedTags: [],
        // remove tags in this array, (black list), contents still rendered
        removeTags: ["basefont", "center", "dir", "font", "frame", "frameset", "iframe", "isindex", "menu", "noframes", "s", "strike", "u"],
        // remove tags and content
        removeTagsAndContent: [],
        // array of [attributeName], [optional array of allowed on elements] e.g. [["id"], ["style", ["p", "dl"]]] // allow all elements to have id and allow style on 'p' and 'dl'
        allowedAttributes: [],
        // array of attribute names to remove on all elements in addition to those not in tagAttributes e.g ["width", "height"]
        removeAttrs: [],
        // array of [className], [optional array of allowed on elements] e.g. [["aClass"], ["anotherClass", ["p", "dl"]]]
        allowedClasses: [],
        // format the result
        format: false,
        // format indent to start on
        formatIndent: 0,
        // tags to replace, and what to replace with, tag name or regex to match the tag and attributes 
        replace: [
            [["b", "big"], "strong"],
            [["i"], "em"]
        ],
        // styles to replace with tags, multiple style matches supported, inline tags are replaced by the first match blocks are retained
        replaceStyles: [
            [/font-weight:\s*bold/i, "strong"],
            [/font-style:\s*italic/i, "em"],
            [/vertical-align:\s*super/i, "sup"],
            [/vertical-align:\s*sub/i, "sub"]
        ],
        allowComments: false,
        allowEmpty: [],
        allowBreakAsLastChild: false
    };
    
    
    function applyFormat(element, options, output, indent) {
        if (element.tag.format && output.length > 0) {
            output.push("\n");
            for (var i = 0; i < indent; i++) output.push("\t");
        }
    }

    function render(element, options) {
        var output = [], empty = true, indent = 0;
      
        if (element.tag.isComment) {
            if (options.allowComments) {
                output.push("<!--");
                output.push(element.tag.rawAttributes);
                output.push(">");

                if (options.format) applyFormat(element, options, output, indent - 1);
            }
        } else {

            // don't render if not in allowedTags or in removeTags
            var renderChildren
                = (options.removeTagsAndContent.length == 0 || $.inArray(element.tag.name, options.removeTagsAndContent) == -1);
            var renderTag
                = renderChildren && element.tag.render
                    && (options.allowedTags.length == 0 || $.inArray(element.tag.name, options.allowedTags) > -1)
                    && (options.removeTags.length == 0 || $.inArray(element.tag.name, options.removeTags) == -1);

            if (!element.isRoot && renderTag) {

                output.push("<");
                output.push(element.tag.name);
                
                $.each(element.attributes, function () {
                    if ($.inArray(this.name, options.removeAttrs) == -1) {
                        var m = RegExp(/^(['"]?)(.*?)['"]?$/).exec(this.value);
                        var value = m[2];
                        var valueQuote = m[1] || "'";

                        // check for classes allowed                    
                        if (this.name == "class" && options.allowedClasses.length > 0) {
                            value =
                            $.grep(value.split(" "), function (c) {
                                return $.grep(options.allowedClasses, function (a) {
                                    return a == c
                                        || (a[0] == c && (a.length == 1 || $.inArray(element.tag.name, a[1]) > -1));
                                }).length > 0;
                            })
                            .join(" ");
                        }

                        if (value != null && (value.length > 0 || $.inArray(this.name, element.tag.requiredAttributes) > -1)) {
                            output.push(" ");
                            output.push(this.name);
                            output.push("=");
                            output.push(valueQuote);
                            output.push(value);
                            output.push(valueQuote);
                        }
                    }
                });
            }

            if (element.tag.isSelfClosing) {
                // self closing 
                if (renderTag) output.push(" />");
                empty = false;
            } else if (element.tag.isNonClosing) {
                empty = false;
            } else if (renderChildren) {
                if (!element.isRoot && renderTag) {
                    // close
                    output.push(">");
                }

                indent = options.formatIndent++;
                var replaceLines = new RegExp(/\n/g);
                // render children
                if (element.tag.toProtect) {
                    outputChildren = element.children.join("").replace(/<br>/ig, "\n");
                    output.push(outputChildren);
                    empty = outputChildren.length == 0;
                } else {
                    var outputChildren = [];
                    for (var i = 0; i < element.children.length; i++) {
                        var child = element.children[i];
                        var text = textClean(isText(child) ? child : child.childrenToString());
                        if (isInline(child)) {
                            if (i > 0 && text.length > 0
                        && (startsWithWhitespace(child) || endsWithWhitespace(element.children[i - 1]))) {
                                outputChildren.push("");
                            }
                        }
                        if (isText(child)) {
                            if (text.length > 0) {
                                text = text.replace(new RegExp(/\n/g), ' ');
                                outputChildren.push(text);
                            }
                        } else {
                            // only allow break as last child if allowBreakAsLastChild option is set
                            if (i !== element.children.length - 1 || child.tag.name !== "br" || (options.allowBreakAsLastChild && child.tag.name === "br")) {
                                if (options.format) applyFormat(child, options, outputChildren, indent);
                                outputChildren = outputChildren.concat(render(child, options));
                            }
                        }
                    }
                    options.formatIndent--;
                    
                    
                    if (outputChildren.length > 0) {
                        if (options.format && outputChildren[0] != "\n") applyFormat(element, options, output, indent);
                        output = output.concat(outputChildren);
                        
                        empty = false;
                    }
                }
                if (!element.isRoot && renderTag) {
                    // render the closing tag
                    if (options.format) applyFormat(element, options, output, indent - 1);
                    output.push("</");
                    output.push(element.tag.name);
                    output.push(">");

                }
            }

            // check for empty tags
            if (!element.tag.allowEmpty && empty) { return []; }
        }

        return output;
    }

    // find a matching tag, and pop to it, if not do nothing
    function popToTagName(stack, tagNameArray) {
        return pop(
            stack,
            function (element) {
                return $.inArray(element.tag.nameOriginal, tagNameArray) > -1;
            });
    }

    function popToContainer(stack) {
        return pop(
            stack,
            function (element) {
                return element.isRoot || !element.tag.isInline;
            });
    }

    function pop(stack, test, index) {
        index = index || 1;
        var element = stack[stack.length - index];
        if (test(element)) {
            return true;
        } else if (stack.length - index > 0
                && pop(stack, test, index + 1)) {
            stack.pop();
            return true;
        }
        return false;
    }

    // Element Object
    function Element(tag) {
        if (tag) {
            this.tag = tag;
            this.isRoot = false;
        } else {
            this.tag = new Tag("root");
            this.isRoot = true;
        }
        this.attributes = [];
        this.children = [];

        this.hasAttribute = function (name) {
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].name == name) return true;
            }
            return false;
        };

        this.childrenToString = function () {
            return this.children.join("");
        };

        return this;
    }

    // Attribute Object
    function Attribute(name, value) {
        this.name = name;
        this.value = value;

        return this;
    }

    // Tag object
    function Tag(name, close, rawAttributes, options) {
      
        this.name = name.toLowerCase();
        this.nameOriginal = this.name;
        this.render = true;
        this.inOL = false;
        this.inUL = false;

        this.init = function () {
            if (this.name == "--") {
                this.isComment = true;
                this.isSelfClosing = true;
                this.format = true;
            } else {
                this.isComment = false;
                this.isSelfClosing = $.inArray(this.name, tagSelfClosing) > -1;
                this.isNonClosing = $.inArray(this.name, tagNonClosing) > -1;
                this.isClosing = (close != undefined && close.length > 0);

                this.isInline = $.inArray(this.name, tagInline) > -1;
                this.disallowNest = $.inArray(this.name, tagDisallowNest) > -1;
                this.requiredParent = tagRequiredParent[$.inArray(this.name, tagRequiredParent) + 1];
                this.allowEmpty = options && $.inArray(this.name, options.allowEmpty) > -1;

                this.toProtect = $.inArray(this.name, tagProtect) > -1;

                this.format = $.inArray(this.name, tagFormat) > -1 || !this.isInline;
            }
            this.rawAttributes = rawAttributes;
            this.requiredAttributes = tagAttributesRequired[$.inArray(this.name, tagAttributesRequired) + 1];

            if (options) {
                if (!options.tagAttributesCache) options.tagAttributesCache = [];
                if ($.inArray(this.name, options.tagAttributesCache) == -1) {
                    var cacheItem = tagAttributes[$.inArray(this.name, tagAttributes) + 1].slice(0);

                    // add extra ones from options
                    for (var i = 0; i < options.allowedAttributes.length; i++) {
                        var attrName = options.allowedAttributes[i][0];
                        if ((
                            options.allowedAttributes[i].length == 1
                                || $.inArray(this.name, options.allowedAttributes[i][1]) > -1
                        ) && $.inArray(attrName, cacheItem) == -1) {
                            cacheItem.push(attrName);
                        }
                    }

                    options.tagAttributesCache.push(this.name);
                    options.tagAttributesCache.push(cacheItem);
                }

                this.allowedAttributes = options.tagAttributesCache[$.inArray(this.name, options.tagAttributesCache) + 1];
            }
        };

        this.init();

        this.rename = function (newName) {
            this.name = newName;
            this.init();
        };

        return this;
    }

    function startsWithWhitespace(item) {
        while (isElement(item) && item.children.length > 0) {
            item = item.children[0];
        }
        if (!isText(item)) return false;
        var text = textClean(item);
        return text.length > 0 && $.htmlClean.isWhitespace(text.charAt(0));
    }
    function endsWithWhitespace(item) {
        while (isElement(item) && item.children.length > 0) {
            item = item.children[item.children.length - 1];
        }
        if (!isText(item)) return false;
        var text = textClean(item);
        return text.length > 0 && $.htmlClean.isWhitespace(text.charAt(text.length - 1));
    }
    function isText(item) { return item.constructor == String; }
    function isInline(item) { return isText(item) || item.tag.isInline; }
    function isElement(item) { return item.constructor == Element; }
    function textClean(text) {
        return text;
           //.replace(/&nbsp;|\n/g, " ")
           //.replace(/\s\s+/g, " ");
    }

    // trim off white space, doesn't use regex
        // tags which are inline
    var tagInline = [
        "a", "abbr", "acronym", "address", "b", "big", "br", "button",
        "caption", "cite", "code", "del", "em", "font", 'breadcrumb',
        "hr", "i", "input", "img", "ins", "label", "legend", "map", "q",
        "s", "samp", "select", "option", "param", "small", "span", "strike", "strong", "sub", "sup",
        "tt", "u", "var"];
    var tagFormat = ["address", "button", "caption", "code", "input", "label", "legend", "select", "option", "param"];
    var tagDisallowNest = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "th", "td", "object", "ul", "ol"];
    var tagAllowEmpty = ["th", "td"];
    var tagRequiredParent = [
        null,
        "li", ["ul", "ol"],
        "dt", ["dl"],
        "dd", ["dl"],
        "td", ["tr"],
        "th", ["tr"],
        "tr", ["table", "thead", "tbody", "tfoot"],
        "thead", ["table"],
        "tbody", ["table"],
        "tfoot", ["table"],
        "param", ["object"]
    ];
    var tagProtect = ["script", "style", "pre", "code"];
    // tags which self close e.g. <br />
    var tagSelfClosing = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];
    // tags which do not close
    var tagNonClosing = ["!doctype", "?xml"];
    // attributes allowed on tags
    var tagAttributes = [
            ["class"],  // default, for all tags not mentioned
            "?xml", [],
            "!doctype", [],
            "cite", ["class", "annotation-id"],
            "a", ["accesskey", "class", "href", "name", "title", "rel", "rev", "type", "tabindex"],
            "abbr", ["class", "title"],
            "acronym", ["class", "title"],
            "blockquote", ["cite", "class"],
            "button", ["class", "disabled", "name", "type", "value"],
            "del", ["cite", "class", "datetime"],
            "form", ["accept", "action", "class", "enctype", "method", "name"],
            "iframe", ["class", "height", "name", "sandbox", "seamless", "src", "srcdoc", "width"],
            "input", ["accept", "accesskey", "alt", "checked", "class", "disabled", "ismap", "maxlength", "name", "size", "readonly", "src", "tabindex", "type", "usemap", "value"],
            "img", ["alt", "class", "height", "src", "width"],
            "ins", ["cite", "class", "datetime"],
            "label", ["accesskey", "class", "for"],
            "legend", ["accesskey", "class"],
            "link", ["href", "rel", "type"],
            "meta", ["content", "http-equiv", "name", "scheme", "charset"],
            "map", ["name"],
            "optgroup", ["class", "disabled", "label"],
            "option", ["class", "disabled", "label", "selected", "value"],
            "q", ["class", "cite"],
            "script", ["src", "type"],
            "select", ["class", "disabled", "multiple", "name", "size", "tabindex"],
            "style", ["type"],
            "table", ["class", "summary"],
            "th", ["class", "colspan", "rowspan"],
            "td", ["class", "colspan", "rowspan"],
            "textarea", ["accesskey", "class", "cols", "disabled", "name", "readonly", "rows", "tabindex"],
            "param", ["name", "value"],
            "embed", ["height", "src", "type", "width"]
    ];
    var tagAttributesRequired = [[], "img", ["alt"]];
    // white space chars
    var whitespace = [" ", " ", "\t", "\n", "\r", "\f"];

})(jQuery);
