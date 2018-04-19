
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
window.Mediakron = {};
require('./bootstrap');
console.log('debug');
Mediakron.App = require('./mediakron');

Mediakron.Router = require('./router');
Mediakron.ClassManagement = require('./util/class.management');
Mediakron.BreadCrumb = require('./util/breadcrumb');
Mediakron.Controller = require('./views/controller');

Mediakron.Models.User = require('./models/user');
/**
 * Define Mediakron controller.
 *
 * Its interesting when you think about it, no?
 */

(function ($) {
    $(document).ready(function () {
        console.log(Mediakron)
        Mediakron.App.Events = _.extend({}, Backbone.Events);
        Mediakron.classes = new Mediakron.ClassManagement();
        Mediakron.controller = new Mediakron.Controller();
        Mediakron.controller.afterRender();
        Mediakron.breadcrumb = new Mediakron.BreadCrumb();
        Mediakron.App.auth();
    });
})(jQuery);