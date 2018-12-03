
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
*/

import 'vue-svgicon/dist/polyfill';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import * as svgicon from 'vue-svgicon';
import './core-css/base.scss';
import VeeValidate from 'vee-validate';
import VueMoment from 'vue-moment';
import VueTransmit from 'vue-transmit';
import config from '@/config';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import api from '@/store/utils/api';
//import VueIntro from 'vue-introjs';
//import VueRouterMiddleware from 'vue-router-middleware';

//window.loader(true);

api.init();

Vue.config.productionTip = false;

Vue.use(svgicon, {
  tagName: 'svgicon',
  classPrefix: 'o-svg',
});

Vue.use(VeeValidate, { inject: false, delay: 700 });

Vue.use(VueMoment);

Vue.use(VueTransmit);

//Vue.use(VueIntro);
//import 'intro.js/introjs.css';

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');


/**
 * 
 */
if (process.env.VUE_APP_MODE !== 'development') {
  Raven.config('https://a33196655ca34c068578612debf5f473@sentry.io/1334871', {
        release: config.BUILD,
        environment: process.env.VUE_APP_MODE,
      })
      .addPlugin(RavenVue, Vue)
      .install();
}