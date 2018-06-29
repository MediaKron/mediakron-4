import MediakronView from '~/core-js/extensions/views';
import $ from "jquery";
import _ from "lodash";

import tpl from "./login.html";

import Messages from "~/utilities/messages/messages-view";

import Auth from "~/core-js/auth/auth";

var view = false;

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
        view = this;
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
        this.$el.html(this.template(this.data)).addClass(this.className);
        return this;
    }

    get events() {
        return {
            'submit': 'tryLogin'
        }
    }

    /**
     * Attempt Login
     * @param {object} e 
     */
    tryLogin(e) {
        e.preventDefault();
        $("#login-submit")
          .attr("disabled", true)
          .val("Logging in...");
        // Try the login
        Auth.login({
            email: $('#username').val(),
            password: $('#password').val()
        },this.Success, this.Failure)
    }

    /**
     * 
     * @param {object} data 
     */
    Success(data) {

        if (data.authenticated) {
            $('#login-submit').attr('disabled', true).val('Hey, Welcome Back!');
            $('#login').addClass('logincorrect');

            Messages.success("Login Successful");
            Mediakron.Settings.token = data.access_token;
            Mediakron.Settings.expiration = new Date().getTime() + data.expires_in;

            view.remove();
            if (view.fromRoute) {
                Mediakron.router.navigate('/', { trigger: true });
            }
            Mediakron.boot();
        } else {
            $('#login').addClass('loginincorrect');
            $('#login-submit').attr('disabled', false).val('Log in');
            Messages.danger(data.error, "top");
            setTimeout(function () {
                $('#login').removeClass('loginincorrect');
            }, 5000);
        }

    }

    /**
     * 
     * @param {object} request 
     */
    Failure(request) {
        $('#login').addClass('loginincorrect');
        $('#login-submit').attr('disabled', false).val('Log in');
        var message = JSON.parse(request.responseText);
        Messages.danger(message.error, "top");
    }

}