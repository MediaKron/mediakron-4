Mediakron.Login = Mediakron.Extensions.View.extend({
    template: JST['navigation.login'],
    className: 'login login-layout',
    fromRoute: false,
    initialize: function (data) {
        this.data = {};
        this.data = data;
        if (data.fromRoute) {
            this.fromRoute = true;
        }
        return this;
    },
    render: function () {
        this.$el.html(this.template(this.data)).addClass(this.className);
        return this;
    },
    events: {
        'submit': 'tryLogin'
    },
    tryLogin: function (e) {
        e.preventDefault();
        $('#login-submit').attr('disabled', true).val('Logging in...');
        var username = $('#username').val(),
            password = $('#password').val(),
            login = this;
        $.ajax({
            type: "post",
            cache: false,
            url: Mediakron.Data.login,
            data: 'username=' + username + '&password=' + password + '&_username=' + username + '&_password=' + password,
            success: function (data) {
                if (data.success) {
                    $('#login-submit').attr('disabled', true).val('Hey, Welcome Back!');
                    $('#login').addClass('logincorrect');
                    Mediakron.message({
                        layout: 'bottom',
                        text: 'Login Successful',
                        type: 'success',
                        timeout: 4000,
                        dismiss: true
                    });
                    login.remove();
                    if (login.fromRoute) {
                        Mediakron.router.navigate('/', { trigger: true });
                    }
                    Mediakron.App.auth();
                } else {
                    $('#login').addClass('loginincorrect');
                    $('#login-submit').attr('disabled', false).val('Log in');
                    Mediakron.message({
                        layout: 'top',
                        text: data.message,
                        type: 'danger',
                        timeout: 5000
                    });
                    setTimeout(function () {
                        $('#login').removeClass('loginincorrect');
                    }, 5000);
                }

            },
            error: function (request) {
                $('#login').addClass('loginincorrect');
                $('#login-submit').attr('disabled', false).val('Log in');
                var message = JSON.parse(request.responseText);
                Mediakron.message({
                    layout: 'top',
                    text: message.error,
                    type: 'danger',
                    timeout: 5000
                });
            }
        });
        return false;
    }

});