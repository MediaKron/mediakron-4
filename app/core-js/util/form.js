/**
 * Utility functions for handling forms
 */

/**
 * A function for returing checked if the box should be checked
 * @param {string} source 
 * @param {string} value 
 */
function Checked(source, value) {
    if (source == value) {
        return 'checked';
    }
    return '';
};

/**
 * A function for returing selected if the field should be selected
 * @param {string} source 
 * @param {string} value 
 */
function Selected(source, value) {
    if (source == value) {
        return 'selected';
    }
    return '';
}


function toggleAttr(attr, attr1, attr2) {
    return this.each(function () {
        var self = $(this);
        if (self.attr(attr) == attr1)
            self.attr(attr, attr2);
        else
            self.attr(attr, attr1);
    });
}

export {
    toggleAttr,
    Checked,
    Selected
}