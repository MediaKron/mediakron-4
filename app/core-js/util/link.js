export default class Link {

    /**
     * Helper passthrough
     * @param {*} contents 
     * @param {*} url 
     * @param {*} html 
     */
    static themeLink(contents, url, html) {
        return this.link(contents, url, html);
    }

    /**
     * 
     * @param {*} contents 
     * @param {*} url 
     * @param {*} html 
     */
    static link(contents, url, html) {
        var basepath = Mediakron.Settings.baseurl;
        return '<a href="' + basepath + url + '" class="link">' + contents + '</a>';
    }
}
