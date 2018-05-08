define("/mediakron/js/src/story/wysiwyg/selection.js", [], function() {
    var Selection = {
        range: false,
        selection: false,
        getSelection: function(refresh) {
            if (refresh || !this.selection) {
                if (window.getSelection) {
                    this.selection = window.getSelection();
                } else if (document.selection && document.selection.createRange) {
                    this.selection = document.selection;
                }
            }
            return this.selection;
        },
        getRange: function() {
            this.getSelection();
            if (this.selection.rangeCount > 0) {
                this.range = this.selection.getRangeAt(0);
                return this.range;
            } else if (this.selection && this.selection.createRange) {
                return this.selection.createRange();
            } else {
                this.range = false;
                return false;
            }
        },
        saveRange: function(local) {
            var range = this.getRange();
            if (range) {
                if (local) this.saved = range;
                return range;
            }
            return null;
        },
        replaceFocus: function(node) {
            selection = this.getSelection(), focus = $(selection.focusNode);
            if (selection.focusNode.nodeType == 3) {
                focus = $(selection.focusNode.parentNode).prev();
            }
            if (focus.prop('tagName') != 'P' && focus.prop('tagName') != 'H2' && focus.prop('tagName') != 'H3') {
                focus = focus.parent();
            }
            if (focus.length > 0) {
                focus.replaceWith(node);
            }
        },
        restoreRange: function(range) {
            if (range) {
                this.getSelection();
                this.selection.removeAllRanges();
                this.selection.addRange(range);
            } else if (this.saved) {
                this.getSelection();
                this.selection.removeAllRanges();
                this.selection.addRange(this.saved);
            }
        },
        getRangeText: function() {
            this.getRange();
            if (this.range) {
                return this.range.toString();
            } else {
                return '';
            }
        },
        getRangeText: function() {
            this.getRange();
            if (this.range) {
                return this.range.toString();
            } else {
                return '';
            }
        },
        getRangeHtml: function() {
            this.getRange();
            if (this.range) {
                return this.range.cloneContents();;
            } else {
                return '';
            }
        },
        isSomethingSelected: function() {
            this.getSelection();
            if (this.selection) {
                return !this.selection.isCollapsed;
            }
            return false;
        },
        getBoundry: function() {
            this.getRange();
            return this.range.getBoundingClientRect();
        },
        insertTextAtCursor: function(text) {
            var sel, range, html;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(text));
                    range.collapse();
                }
            } else if (document.selection && document.selection.createRange) {
                document.selection.createRange().text = text;
            }
        },
        insertHTMLAtCursor: function(html) {
            var sel, range;
            if (window.getSelection) {
                // IE9 and non-IE
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    // Range.createContextualFragment() would be useful here but is
                    // only relatively recently standardized and is not supported in
                    // some browsers (IE9, for one)
                    var el = document.createElement("div");
                    el.innerHTML = html;
                    var frag = document.createDocumentFragment(),
                        node, lastNode;
                    while ((node = el.firstChild)) {
                        lastNode = frag.appendChild(node);
                    }
                    range.insertNode(frag);
                    // Preserve the selection
                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            } else if (document.selection && document.selection.type != "Control") {
                // IE < 9
                document.selection.createRange().pasteHTML(html);
            }
        },
        splitNode: function() {
            var range = this.getRange();
            if (range) {
                // Create a copy of the selection range to work with
                var range = range.cloneRange();
                // Get the containing paragraph
                var p = range.commonAncestorContainer;
                while (p && (p.nodeType != 1 || p.tagName != "P")) {
                    p = p.parentNode;
                }
                if (p) {
                    // Place the end of the range after the paragraph
                    range.setEndAfter(p);
                    // Extract the contents of the paragraph after the caret into a fragment
                    var contentAfterRangeStart = range.extractContents();
                    // Collapse the range immediately after the paragraph
                    range.collapse(true);
                    // Insert the content
                    range.insertNode(contentAfterRangeStart);
                    // Move the caret to the insertion point
                    range.collapse(true);
                    $(p).next().selectionToBegin();
                }
            }
            return p;
        }
    }
    return Selection;
});
// jQuery Manipulation
jQuery.fn.extend({
    selectionToEnd: function() {
        this.focus();
        if (this[0]) {
            if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(this[0]);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(this[0]);
                textRange.collapse(false);
            }
        }
        return this;
    },
    selectionToBegin: function() {
        this.focus();
        if (this[0]) {
            if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(this[0]);
                range.collapse(true);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(this[0]);
                textRange.collapse(true);
            }
        }
        return this;
    },
    unwrapUntilClass: function(search) {
        var found = false,
            parent;
        if (this.hasClass(search)) return this;
        while (!found) {
            parent = this.parent();
            if (parent.hasClass(search)) {
                found = true;
                return this;
            } else {
                this.unwrap();
            }
        }
        return this;
    }
});
jQuery.fn.reverse = [].reverse;
jQuery.fn.changeTag = function(newTag) {
    var q = this;
    this.each(function(i, el) {
        var h = "<" + el.outerHTML.replace(/(^<\w+|\w+>$)/g, newTag) + " test>";
        try {
            el.outerHTML = h;
        } catch (e) { //elem not in dom
            q[i] = jQuery(h)[0];
        }
    });
    return this;
};
jQuery.fn.extend({
    insertAtCaret: function(myValue) {
        return this.each(function(i) {
            if (document.selection) {
                this.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            } else if (this.selectionStart || this.selectionStart == '0') {
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
            } else {
                this.value += myValue;
                this.focus();
            }
        })
    }
});