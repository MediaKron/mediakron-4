import $ from "jquery";
import User from "~/core-js/models/user"

import Login from "~/utilities/login/login-view";
import ClassManager from "~/core-js/util/class.management"
import Controller from "~/core-js/views/controller";

var user, view;

/**
 * Check auth Status and get login
 * or allow redirect
 * @param {function} callback 
 */
class Auth{

    constructor(){
        view = this;
    }

    static init(){
        
        $.ajaxSetup({
            beforeSend: function (xhr) {
                var auth = new Auth().getSession();
                if(auth.access_token){
                    xhr.setRequestHeader("Authorization", "Bearer " + auth.access_token);
                }
            }
        });
    }

    getSession(){
        return {
            access_token: localStorage.getItem('access_token', false),
            token_type: localStorage.getItem('token_type', false),
            expires_in: localStorage.getItem('expires_in', false)
        }
    }

    setSession(auth) {
        // Set the time that the Access Token will expire at
        var expiresAt = JSON.stringify(
            auth.expires_in * 1000 + new Date().getTime()
        );
        console.log('setting session ' + auth.access_token)
        localStorage.setItem('access_token', auth.access_token);
        localStorage.setItem("token_type", auth.token_type);
        localStorage.setItem('expires_in', expiresAt);
    }

    static login(credentials, Success, Failure){
        var auth = new Auth();
        $.ajax({
            type: "post",
            cache: false,
            dataType: "json",
            url: "/api/auth/login",
            data: {
                email: credentials.email,
                password: credentials.password
            }
        })
            .done(function(data){
                console.log(data);
                auth.setSession(data);
                Success(data);
            })
            .fail(function(xhr){
                Failure(xhr);
            });
    }


    /**
     * 
     */
    static check(callback){
        console.log('checking')
        $.ajax({ url: "/api/auth/check", method: "GET", dataType: "json" })
            .done(function(xhr, data){
                user = new User(data.user);
                ClassManager.setAdmin(user);
            })
            .fail(function(xhr, message){
                var data = JSON.parse(xhr.responseText);

                if (Mediakron.Settings.public) {
                    user = new User();
                    user.guest();
                    setGlobalUser(user);
                    return callback();
                } else {
                    Controller.gotoView(new Login(data));
                }
            });
    }

    /**
     * 
     */
    static renew() {
        $.ajax({ url: "/api/auth/renew", method: "GET", dataType: "json" })
            .done(function (xhr, data) {
                user = new User(data.user);
                ClassManager.setAdmin(user);
            })
            .fail(function (xhr, message) {
                var data = JSON.parse(xhr.responseText);

                if (Mediakron.Settings.public) {
                    console.log('ublic')
                    user = new User();
                    user.guest();
                    setGlobalUser(user);
                    return callback();
                } else {
                    console.log('private')
                    Controller.gotoView(new Login(data));
                }
            });
    }


}

/**
 * 
 * @param {*} user 
 */
function setGlobalUser(user) {
    Mediakron.user = user;
}

export default Auth;