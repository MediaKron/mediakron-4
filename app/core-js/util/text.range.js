/**
 * Find a tag in a selected text, within a container object
 * @param {string} tagname 
 * @param {object} container 
 */
var findinselection = function (tagname, container) {
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
/**
 * Helper function for getting range
 */
function getrange() {
    var selection = document.getSelection();
    if (selection) return selection.getRangeAt(0);
};

export {
    getrange,
    findinselection
}