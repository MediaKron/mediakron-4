
Mediakron.Canvas.Courses = Mediakron.Extensions.View.extend({
    template: JST['settings.canvas.courses'],
    courses: false,
    el: '#site-list',
    initialize: function () {
        this.render();
    },
    render: function () {
        var courses = this.courses, view = this;
        $.ajax({
            type: "get",
            cache: false,
            url: Mediakron.Data.courses,
            success: function (data) {
                courses = JSON.parse(data);
                view.$el.html(view.template({ 'courses': courses }));
            },
            error: function (request) {
                var message = JSON.parse(request.responseText);
                Mediakron.message({
                    layout: 'top',
                    text: message.error,
                    type: 'danger',
                    confirm: false,
                    dismiss: true
                });
            }
        });


        return this;
    },
    events: {
        'click a': Mediakron.linkHandle,
        'click .connect': 'connect'
    },
    connect: function (e) {
        var target = $(e.currentTarget), courseId = target.attr('course'), view = this;
        $.ajax({
            type: "get",
            cache: false,
            url: Mediakron.Data.connectCourse + '/' + courseId,
            success: function (data) {
                view.render();
            },
            error: function (request) {
                var message = JSON.parse(request.responseText);
                Mediakron.message({
                    layout: 'top',
                    text: message.error,
                    type: 'danger'
                });
            }
        });
    }
});