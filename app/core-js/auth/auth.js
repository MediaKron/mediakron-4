import $ from "jquery";
import User from "~/core-js/models/user"

import Login from "~/utilities/login/login-view";
import ClassManager from "~/core-js/util/class.management"
import Controller from "~/core-js/views/controller";

var user;

/**
 * Check auth Status and get login
 * or allow redirect
 * @param {function} callback 
 */
function Auth(callback){
    $.ajax({ url: "/api/auth/check", method: "GET", dataType: "json" })
      .done(Success)
      .fail(Failure);
}

/**
 * 
 * @param {*} xhr 
 * @param {*} data 
 */
function Success(xhr, data){
    user = new User(data.user);
    ClassManager.setAdmin(user);
}

/**
 * 
 * @param {*} xhr 
 * @param {*} message 
 */
function Failure(xhr, message) {
    var data = JSON.parse(xhr.responseText); 

    if (Mediakron.Settings.public) {
        console.log('ublic')
        user = new User();
        user.guest();
        setGlobalUser(user);
        return callback();
    }else{
        console.log('private')
        Controller.gotoView(new Login(data));
    }
}

//function 

/**
 * 
 * @param {*} user 
 */
function setGlobalUser(user) {
    Mediakron.user = user;
}

function oldAuth() {
  var user;
  user = new User();
  setGlobalUser(user);
  user.fetch({
    data: {
      token: Mediakron.Settings.token
    },
    processData: true,
    success: function(model, response) {
      if (
        model.get("role") == "manager" ||
        model.get("role") == "instructor" ||
        model.get("role") == "administrator" ||
        model.get("role") == "ia"
      ) {
        ClassManager.setStatic("can-administer");
      } else {
        ClassManager.setStatic("not-administer");
      }

      // Set last visit to now
      user.lastVisit();

      // bind the unload handler to attach it to a parent action
      // TODO: consider moving this to an observable pattern
      $(window).unload(function() {
        $.ajax({
          type: "POST",
          url: Mediakron.Data.stats,
          async: false,
          data: {
            views: Mediakron.Status.views
          }
        });
      });
      //
      return callback();
    },
    error: function(model, response) {
      Mediakron.AuthResponse = response.responseJSON;
      if (Mediakron.Settings.public) {
        user = new User();
        user.guest();
        setGlobalUser(user);
        return callback();
      } else {
        var login = new Login(response.responseJSON);
        gotoView(login);
      }
    }
  });
}
export default Auth;