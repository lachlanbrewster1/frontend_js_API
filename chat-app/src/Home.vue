<template>

  <div id="homePage">
      <div class="MenuBar">
      <router-link to="/home">Home</router-link>
      <router-link to="/auctions">View Auctions</router-link>
      <router-link to="/loginLogout">Login/logout</router-link>
        <router-link to="/manageAuctions">Manage Auctions</router-link>
        <router-link to="/manageProfile">Manage Profile</router-link>



      </div>

    <h1>Home Page</h1>

    <p>Welcome to Russia Auction site, В России продаст вам аукцион</p>



    <div v-if="this.$cookie.get('token')">
      You are logged in, enjoy our services comrade

    </div>

    <div v-else>

      You are logged out, log in to enjoy our fine services comrade

    </div>

  </div>
</template>


<style>
  #homePage {
    min-height: 40em;
    background-color: plum;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
</style>

<script>

  import VueRouter from 'vue-router';
  import LoginLogout from './LoginLogout.vue';


  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
      }
    },

    mounted: function () {
    },



    methods: {

    }
  }




</script>
