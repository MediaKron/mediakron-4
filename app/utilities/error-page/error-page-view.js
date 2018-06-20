Mediakron.Pages.ErrorPage = Mediakron.Extensions.View.extend({
    template: JST['pages.error'],
    errorCode: "404",
    initialize: function (errorCode) {
        this.errorCode = errorCode;
    },
    render: function () {
        var el = $(this.el).html(this.template({ errorCode: this.errorCode }));
        return this;
    }
});