<template>

  <div>

    <div id="TopPanel">
      <div class="MenuBar">
        <router-link to="/home">Home</router-link>
        <router-link to="/auctions">View Auctions</router-link>
        <router-link to="/loginLogout">Login/logout</router-link>
        <router-link to="/manageAuctions">Manage Auctions</router-link>
        <router-link to="/manageProfile">Manage Profile</router-link>



      </div>

      <h2>Your Profile</h2>
    </div>

    <div v-if="this.$cookie.get('token')">

      <div id="manageProfile">


        <h4>Username:
          {{this.currentUser.username}}</h4>


        <h4>Given name:
          {{this.currentUser.givenName}}</h4>


        <h4>Family name:
          {{this.currentUser.familyName}}</h4>


        <h4>Email:
          {{this.currentUser.email}}</h4>


        <h4>Account balance:
          {{this.currentUser.accountBalance}}</h4>



        <td><router-link :to="{ name: 'editProfile', params: { profileIdEdit: this.$cookie.get('userId') }}">Update your information</router-link></td>


        <div v-if="$route.params.profileIdEdit">
          <div id="editProfile">

            Given Name
            <div><input name="givenName" type="text" :placeholder=this.currentUser.givenName maxlength="30" v-model="givenNameEdit"></div>
            Family Name
            <div><input name="familyName" type="text" :placeholder=this.currentUser.familyName maxlength="30" v-model="familyNameEdit"></div>

            <button type="button" class = "btn btn-primary" data-toggle="modal"
                    v-on:click="editProfile($route.params.profileIdEdit)">
              Save changes
            </button>
            (may need to refresh page to reflect changes)

          </div>


        </div>



      </div>

    </div>


    <div v-else>


      {{this.$router.push("/loginLogout")}}


    </div>


  </div>
</template>




<script>



  export default {



    data() {
      return {
        error: "",
        errorFlag: false,

        givenNameEdit: "",
        familyNameEdit: "",

        currentUser: "",
        token: ""
      }
    },

    beforeMount: function () {
      //console.log(this.$cookie.get('userId'));
      //console.log(this.$cookie.get('token'));

      this.token = this.$cookie.get('token');
      this.getUser(this.$cookie.get('userId'));                //TODO make sure this executes first and isn't undefined

      //console.log(this.currentUser);
    },

    methods: {
      getUser: function (id) {

        var creds = {
          "X-Authorization": this.$cookie.get('token')
        };
        console.log(creds);


        this.$http.get("http://localhost:4941/api/v1/users/" + id, {headers:creds}, {headers:creds})
          .then(function (response) {
            this.currentUser = response.data;
            console.log(3)
          }, function (error) {
            console.log(error);
            console.log("3 error")
            //this.error = error;
            //this.errorFlag = true;
          });
      },
      editProfile: function (id) {

        var givenName = this.givenNameEdit;
        var familyName = this.familyNameEdit;



        var errorMessage = "";
        var creds = { };


        if (givenName  != "") {
          creds['givenName'] = givenName;
          if (givenName .length < 2) {
            errorMessage += "Enter a longer given name! ";
          }
        }

        if (familyName  != "") {2
          creds['familyName'] = familyName;
          if (familyName.length < 2) {
            errorMessage += "Enter a longer family name! ";
          }
        }



        var authCreds = {
          'X-Authorization':this.token
        };

        console.log(creds);
        console.log(authCreds);


        if (errorMessage.length > 1) {
          window.alert(errorMessage);
          console.log(errorMessage);
          return;
        }


        this.$http.patch("http://localhost:4941/api/v1/users/" + id, creds, {headers:authCreds})
          .then(function (response) {

            if (response.status == 200) {
              //create popup with successful creation message
              this.$router.push("/manageProfile");
              window.alert("Successful profile edit! ");
            }

          }, function (error) {

            this.$router.push("/manageProfile");

            //display error message
            window.alert("Malformed profile attributes! Try again");
            console.log("Malformed profile attributes! Try again")

            //this.error = error;
            //this.errorFlag = true;
          });

      }
    }
  }
</script>

<style>
  #TopPanel {
    min-height: 7em;
    background-color: plum;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
</style>
