// Much of this code is borrowed from TinyMCE. 
// We may need to rewrite this if we ever try to resell the content
/**
 * Read heavily from
 * WordFilter.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */
define("/mediakron/js/src/story/wysiwyg/paste.js", ["/mediakron/js/src/story/wysiwyg/selection.js", "/mediakron/js/src/story/wysiwyg/parse.js"], function(Selection, Parser) {
    var Paste = function(element) {
            this.currentListNode = false;
            this.prevListNode = false;
            this.lastLevel = 1;
            this.parser = new Parser();
            var $element = $(element),
                $helper = $('<div id="pastehelper"  contenteditable="true">');
            $('body').append($helper);
            this.$helper = $helper;
            return this;
        };
    Paste.prototype = {
        remove: function() {
            this.$helper.remove();
        },
        /**
         * Checks if the specified content is from any of the following sources: MS Word/Office 365/Google docs.
         */
        isWordContent: function(content) {
            return ((/<font face="Times New Roman"|class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i).test(content) || (/class="OutlineElement/).test(content) || (/id="?docs\-internal\-guid\-/.test(content)));
        },
        isHtmlContent: function(content) {
            return /<[a-z][\s\S]*>/i.test(content);
        },
        /**
         * Checks if the specified text starts with "1. " or "a. " etc.
         */
        isNumericList: function(text) {
            var found, patterns;
            patterns = [/^[IVXLMCD]{1,2}\.[ \u00a0]/, // Roman upper case
            /^[ivxlmcd]{1,2}\.[ \u00a0]/, // Roman lower case
            /^[a-z]{1,2}[\.\)][ \u00a0]/, // Alphabetical a-z
            /^[A-Z]{1,2}[\.\)][ \u00a0]/, // Alphabetical A-Z
            /^[0-9]+\.[ \u00a0]/, // Numeric lists
            /^[\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d]+\.[ \u00a0]/, // Japanese
            /^[\u58f1\u5f10\u53c2\u56db\u4f0d\u516d\u4e03\u516b\u4e5d\u62fe]+\.[ \u00a0]/ // Chinese
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
        isBulletList: function(text) {
            return /^[\s\u00a0]*[\u2022\u00b7\u006f\u00a7\u25CF]\s*/.test(text)
        },
        // removes MS Office generated stuff
        cleanHTML: function(input) {
            // 1. remove line breaks / Mso classes
            var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
            var output = input.replace(stringStripper, ' ');
            // 2. strip Word generated HTML comments
            var commentSripper = new RegExp('<!--(.*?)-->', 'g');
            var output = output.replace(commentSripper, '');
            var tagStripper = new RegExp('<(/)*(meta|img|figure|div|table|tbody|td|tr|th|thead|link|\\?xml:|st1:|o:|font)(.*?)>', 'gi');
            // 3. remove tags leave content if any
            output = output.replace(tagStripper, '');
            // 4. Remove everything in between and including tags '<style(.)style(.)>'
            var badTags = ['script', 'applet', 'embed', 'noframes', 'noscript'];
            for (var i = 0; i < badTags.length; i++) {
                tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi');
                output = output.replace(tagStripper, '');
            }
            // 5. remove attributes ' style="..."'
            var badAttributes = ['start', 'dir'];
            for (var i = 0; i < badAttributes.length; i++) {
                var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi');
                output = output.replace(attributeStripper, '');
            }
            return output;
        },
        convertParagraphToLi: function(paragraphNode, listName, start) {
            var level = paragraphNode._listLevel || this.lastLevel;
            if (!this.currentListNode || this.currentListNode.prop("tagName").toLowerCase() != listName) {
                this.prevListNode = this.prevListNode || this.currentListNode;
                this.currentListNode = $('<' + listName + '>');
            }

            var listItem = $('<li>' + this.cleanListStuff(paragraphNode.text()) + '</li>');
            this.currentListNode.append(listItem);
            paragraphNode.remove();
        },
        cleanListStuff: function(text) {
            patterns = [/^[IVXLMCD]{1,2}\.[ \u00a0]/, // Roman upper case
            /^[ivxlmcd]{1,2}\.[ \u00a0]/, // Roman lower case
            /^[a-z]{1,2}[\.\)][ \u00a0]/, // Alphabetical a-z
            /^[A-Z]{1,2}[\.\)][ \u00a0]/, // Alphabetical A-Z
            /^[0-9]+\.[ \u00a0]/, // Numeric lists
            /^[\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d]+\.[ \u00a0]/, // Japanese
            /^[\u58f1\u5f10\u53c2\u56db\u4f0d\u516d\u4e03\u516b\u4e5d\u62fe]+\.[ \u00a0]/ // Chinese
            ];
            $.each(patterns, function(i, pattern) {
                text = text.replace(pattern, '');
            });
            return text.replace(/^\u00a0+/, '').replace(/^[\s\u00a0]*[\u2022\u00b7\u00a7\u25CF]\s*/, '').replace(/^\u00a0+/, '');
        },
        changeTag: function(e, tag) {
            var d = document.createElement(tag);
            d.innerHTML = e.innerHTML;
            if (e.parentNode) {
                e.parentNode.insertBefore(d, e);
                e.parentNode.removeChild(e);
            }
        },
        wrapContent: function(e, tag) {
            var contents = e.innerHTML;
            contents = "<" + tag + ">" + contents + "</" + tag + ">";
            e.innerHTML = contents;
        },
        removeTag: function(element) {
            var d, parent = element.parentNode;
            if (parent) {
                while (element.firstChild) parent.insertBefore(element.firstChild, element);
                parent.removeChild(element);
            } else {
                var d = document.createElement(tag);
                d.innerHTML = element.innerHTML;
            }
        },
        transformFormatting: function(element) {
            var name = element.nodeName.toLowerCase();
            if (name == 'b') {
                this.changeTag(element, 'strong')
            }
            if (name == 'i') {
                this.changeTag(element, 'em')
            }
            if (name == 'span') {
                if (element.style.fontWeight == 'bold' || element.style.fontWeight == '600' || element.style.fontWeight == '700') {
                    this.wrapContent(element, 'strong');
                }
                if (element.style.fontStyle == 'italic') {
                    this.wrapContent(element, 'em');
                }
                this.removeTag(element);
            }
            return element;
        },
        cleanBlock: function(element, wrapper) {
            var name = element.nodeName.toLowerCase();
            if(name == 'h1'){
                this.changeTag(element, 'h2');
            }
            if (name == 'p') {
                var html = element.innerHTML,
                    test = /\S/.test(html);
                if (html == '&nbsp;' || !html || !test) {
                    this.changeTag(element, 'span');
                } else {
                    if(element.parentNode){
                        if(element.parentNode.nodeName == 'strong'){
                        }
                    }
                    if (element.style.fontWeight == 'bold' || element.style.fontWeight == '600' || element.style.fontWeight == '700') {
                        this.wrapContent(element, 'strong');
                    }
                    if (element.style.fontStyle == 'italic') {
                        this.wrapContent(element, 'em');
                    }
                    if (element.style.textAlign == 'right') {
                        element.setAttribute('align', 'right');
                    } else if (element.style.textAlign == 'center') {
                        element.setAttribute('align', 'center');
                    }
                }
            }
            while (element.attributes.length > 0) {
                if (element.attributes[0].name == 'align') return true;
                element.removeAttribute(element.attributes[0].name);
            }
            return element;
        },
        walkThroughNode: function(node, initial) {
            var count = node.length,
                i = 0,
                children, current, name;
            for (i; i < count; i++) {
                current = node[i];
                if(current){
                    name = current.nodeName.toLowerCase();
                    item = current;
                    if (this.parser.isFormatting(name) || this.parser.isSpan(name)) {
                        this.transformFormatting(item);
                    }
                    if (this.parser.isBlock(name)) {
                        this.cleanBlock(item);
                    }
                    if (current) {
                        children = current.childNodes;
                        if (children.length > 0) {
                            this.walkThroughNode(children, false);
                        }
                    }
                }

            }
            return node;
        },
        containsBlocks: function(nodes){
            nodes = nodes.childNodes;
            var i = 0, count = nodes.length, item;
            for(i;i<count;i++){
                if(this.parser.isBlock(nodes[i].nodeName.toLowerCase())){
                    return true;
                }
            }
            return false;
        },
        cleanPaste: function(element) {
          
            var html = this.cleanHTML(element.html()),
                isWord = this.isWordContent(html),
                isHtml = this.isHtmlContent(html),
                view = this;

            var bind = $('<div />'),
                container = $('<div />');
            container.html(html);
            var nodes = container[0].childNodes;
            if(this.parser.isFormatting(nodes[0].nodeName.toLowerCase()) || this.parser.isSpan(nodes[0].nodeName.toLowerCase()) ) {
                if(this.parser.isBlock(nodes[0].firstChild.nodeName.toLowerCase())){
                    nodes = nodes[0].childNodes;
                }
            }
            
            var html = this.walkThroughNode(nodes, true);

            bind.html(html);

            
            
            var islist = false;
            // first remove disallowed
            $('*', bind).css({
                'font-family': '',
                'margin': '',
                'text-indent': '',
                'font-size': '',
                'line-height': ''
            });
            //
            var prev = false,
                inBullet = false,
                inNumber = false,
                numberList = 1,
                list = false,
                lists = [];
            var pTags = $("p", bind);
            if (pTags.first().parent().is('b')) {
                pTags.unwrap();
            }
            var olist = false,
                ulist = false,
                list;

            $("> *", bind).each(function(i, tag) {
                var $el = $(tag),
                    text = $el.text();
                if (view.isNumericList(text)) {
                    view.convertParagraphToLi($el, 'ol');
                    olist = true;
                } else if (view.isBulletList(text)) {
                    view.convertParagraphToLi($el, 'ul');
                    ulist = true;
                } else if (olist || ulist) {
                    var insert = view.currentListNode;
                    view.currentListNode = false;
                    $el.before(insert);
                    olist = false;
                    ulist = false;
                }
            });
            if (olist || ulist){

                 var insert = view.currentListNode;
                    view.currentListNode = false;
                    if($('*:last',bind).length > 0){
                        $('*:last',bind).after(insert);
                    }else{
                        bind.html(insert);
                    }
                    
                    olist = false;
                    ulist = false;
            }

            $('*', bind).removeAttr('class').removeAttr('name').removeAttr('style');
            $('*', bind).filter(function() {
                return !$.trim($(this).text());
            });

            return bind;
        }
    };
    return Paste;
});