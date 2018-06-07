import Vue from 'vue';
import App from './App.vue';
import Home from './Home.vue';
import Users from './Users.vue';
import Auctions from './Auctions.vue';
import LoginLogout from './LoginLogout.vue';
import ManageAuctions from './ManageAuctions.vue';
import ManageProfile from './ManageProfile.vue';




//import BootstrapVue from 'bootstrap-vue';
//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap-vue/dist/bootstrap-vue.css';

// Require dependencies
var VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
Vue.use(VueCookie);

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.http.options.emulateJson = true;

//Vue.use(BootstrapVue);

const routes= [
  {
    path: '/',
    component: Home
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/users/:userId',
    name: 'user',
    component: Users
  },
  {
    path:'/users',
    name: 'users',
    component: Users
  },
  {
    path:'/auctions',
    name: 'auctions',
    component: Auctions
  },
  {
    path:'/auctions/:auctionId',
    name: 'auction',
    component: Auctions
  },
  {
    path:'/auctions/:auctionId/edit',
    name: 'editAuction',
    component: Auctions
  },
  {
    path:'/loginLogout',
    name: 'loginLogout',
    component: LoginLogout
  },
  {
    path: '/manageAuctions',
    name: 'manageAuctions',
    component: ManageAuctions
  },
  {
    path: '/manageProfile',
    name: 'manageProfile',
    component: ManageProfile
  },

  {
    path: '/manageProfile/edit',
    name: 'editProfile',
    component: ManageProfile
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});



new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});


