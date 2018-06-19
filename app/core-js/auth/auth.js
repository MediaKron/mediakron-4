
import User from "~/core-js/models/user"
import ClassManager from "~/core-js/util/class.management"

function setGlobalUser(user){
    Mediakron.user = user;
}


function Auth(callback){
    var user;
    user = new User();
    setGlobalUser(user);
    user.fetch({
        data: {
            token: Mediakron.Settings.token
        },
        processData: true,
        success: function (model, response) {
            if (
                model.get('role') == 'manager' || 
                model.get('role') == 'instructor' || 
                model.get('role') == 'administrator' || 
                model.get('role') == 'ia') {

                    ClassManager.setStatic("can-administer");

            } else {

                ClassManager.setStatic("not-administer");

            }

            // Set last visit to now
            user.lastVisit();

            // bind the unload handler to attach it to a parent action
            // TODO: consider moving this to an observable pattern
            $(window).unload(function () {
                $.ajax({
                    type: 'POST',
                    url: Mediakron.Data.stats,
                    async: false,
                    data: {
                        'views': Mediakron.Status.views
                    }
                });
            });
            //
            return callback();
        },
        error: function (model, response) {
            Mediakron.AuthResponse = response.responseJSON;
            if (Mediakron.Settings.public) {
                user = new Mediakron.Models.User();
                user.guest();
                setGlobalUser(user);
                return callback();
            } else {
                var login = new Mediakron.Login(response.responseJSON);
                Mediakron.controller.gotoView(login);
            }
        }
    });
}
export default Auth;