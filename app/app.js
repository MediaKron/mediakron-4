
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
import $ from "jquery";
import App from "~/core-js/init";
import Auth from "~/core-js/auth/auth";

var Mediakron;
$(document).ready(function(){
    Mediakron = new App();
    Mediakron.boot();
})
