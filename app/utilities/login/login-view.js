import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";

import tpl from "./login.html";

import Messages from "~/utilities/messages/messages-view";

export default class Login extends MediakronView {
    /**
     * The constructor for the backbone class
     * @param {object} options 
     */
    constructor(options) {
        // execute the parent options first
        super({
            className: 'login login-layout',
            fromRoute: false,
        })
        this.data = {};
        this.data = options;
        if (options.fromRoute) {
          this.fromRoute = true;
        }
    }

    // Cast the html template 
    get template() { 
        return _.template(tpl); }
    
    /**
     * 
     * @param {object} data 
     */
    initialize(data) {
        return this;
    }
    /**
     * Render the view
     */
    render() {
        console.log('rendering')
        this.$el.html(this.template(this.data)).addClass(this.className);
        return this;
    }

    get events() {
        return {
            'submit': 'tryLogin'
        }
    }

    tryLogin(e) {
        e.preventDefault();
        $('#login-submit').attr('disabled', true).val('Logging in...');
        var username = $('#username').val(),
            password = $('#password').val(),
            login = this;
        $.ajax({
          type: "post",
          cache: false,
          dataType: "json",
          url: "/api/auth/login",
          data: JSON.stringify({
            email: username,
            password: password
          })
        })
          .done(this.Success)
          .fail(this.Failure);
    }

    Success(xhr, data) {
        if (data.success) {
            $('#login-submit').attr('disabled', true).val('Hey, Welcome Back!');
            $('#login').addClass('logincorrect');

            Messages.success("Login Successful");

            login.remove();
            if (login.fromRoute) {
                Mediakron.router.navigate('/', { trigger: true });
            }
            Auth();
        } else {
            $('#login').addClass('loginincorrect');
            $('#login-submit').attr('disabled', false).val('Log in');
            Messages.danger(data.message, "top");
            setTimeout(function () {
                $('#login').removeClass('loginincorrect');
            }, 5000);
        }

    }
    Failure(request) {
        $('#login').addClass('loginincorrect');
        $('#login-submit').attr('disabled', false).val('Log in');
        var message = JSON.parse(request.responseText);
        Messages.danger(message.error, "top");
    }

}