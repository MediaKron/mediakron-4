/**
 * 
 */
function form() {
    var template = JST['settings.section.wysiwyg'],
        html = template();
    return html;
}

function showBubble(target) {
    function updateBubblePosition(target);
    var parent = $(target).parent();
    $('.wysiwyg', parent).show();
}

function updateBubblePosition(target) {
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
}

function apply(e) {
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
    function updateBubblePosition(parentEditor);
    return false;
};