<template>
  <div id="loginPage">
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <div class="MenuBar">
      <router-link to="/home">Home</router-link>
      <router-link to="/auctions">View Auctions</router-link>
      <router-link to="/loginLogout">Login/logout</router-link>
      <router-link to="/manageAuctions">Manage Auctions</router-link>
      <router-link to="/manageProfile">Manage Profile</router-link>



    </div>


    <div v-if="this.$cookie.get('token')">

      <div id="logout">

        <h3>You are logged in, congratulation!</h3>

        <button type="button" class = "btn btn-primary" data-toggle="modal"
                data-target="#logoutModal" v-on:click="logout()">
          Logout
        </button>

      </div>


    </div>



    <div v-else>

      <div id="loginCreate">

        <div id="login">
          <h3>Login to an existing account</h3>

          <input name="usernameLoginField" type="text" placeholder="Username.." maxlength="30" v-model="usernameLogin">
          <input name="emailLoginField" type="text" placeholder="Email.." maxlength="30" v-model="emailLogin">
          <input name="passwordLoginField" type="text" placeholder="Password.." maxlength="30" v-model="passwordLogin">

          <button type="button" class = "btn btn-primary" data-toggle="modal"
                  data-target="#loginModal" v-on:click="login()">
            Login
          </button>


        </div>


        <div id="create">

          <h2 style="color: red">JOIN US, BECOME COMRADE</h2>

          <input name="usernameCreateField" type="text" placeholder="Username.." maxlength="30" v-model="usernameCreate">
          <input name="givennameCreateField" type="text" placeholder="Given name.." maxlength="30" v-model="givennameCreate">
          <input name="familynameCreateField" type="text" placeholder="Family name.." maxlength="30" v-model="familynameCreate">
          <input name="passwordCreateField" type="password" placeholder="Password.." maxlength="30" v-model="passwordCreate">
          <input name="emailCreateField" type="text" placeholder="Email.." maxlength="30" v-model="emailCreate">

          <button type="button" class = "btn btn-primary" data-toggle="modal"
                  data-target="#createAccountModal" v-on:click="createAccount()">
            Create account
          </button>


        </div>

      </div>

    </div>

  </div>
</template>

<style>

  #loginPage {
    min-height: 40em;
    background-color: plum;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

</style>



<script>

  import VueRouter from 'vue-router';


  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        usernameLogin: "",
        emailLogin: "",
        passwordLogin: "",
        usernameCreate: "",
        givennameCreate: "",
        familynameCreate: "",
        emailCreate: "",
        passwordCreate: "",
        token: ""
      }
    },

    mounted: function () {
    },

    //TODO add some feedback when a account is created or user is logged in
    //auto login after account creation, fix why login wont work even when correct dets provided
    //add error checking for account creation input
    //logout feedback, takes to home page after login

    methods: {
      login: function() {

        var username = this.usernameLogin;
        var password = this.passwordLogin;
        var email = this.emailLogin;

        var errorMessage = "";

        if (email == undefined && username == undefined) {
          errorMessage += "No email or username entered! ";
        }

        if (password == undefined) {
          errorMessage += "No password entered! ";
        }


        if (errorMessage.length > 1) {
          window.alert(errorMessage);
          console.log(errorMessage);         //display this on page
          return;
        }

        var creds = {
          username: username,
          email: email,
          password: password
        };

        console.log(creds);

        this.$http.post("http://localhost:4941/api/v1/users/login", creds, {})
          .then(function (response) {
            if (response.status == 200) {
              this.$router.push("/home");
              this.token = response.data.token;
              this.$cookie.set('token', this.token, 1);
              this.$cookie.set('username', this.usernameLogin, 1);
              this.$cookie.set('userId', response.data.id, 1);

              console.log(this.$cookie.get('token'));
              console.log(this.$cookie.get('userId'));

            }

          }, function (error) {
            console.log(error.status);

            if (error.status == 400) {errorMessage += "Incorrect username or password!";}              //username
            if (error.status == 401) {errorMessage += "Incorrect username or password!";}

            window.alert(errorMessage);
            console.log(errorMessage);                //display this on page
            //this.error = error;
            //this.errorFlag = true;
          });

      },
      logout: function() {
        console.log("logout");

        var errorMessage = "";
        var creds = {
          "X-Authorization": this.$cookie.get('token')
        };
        console.log(creds);


        this.$http.post("http://localhost:4941/api/v1/users/logout", {}, {headers:creds})
          .then(function (response) {
            this.token = "";
            this.$cookie.delete('token');
            this.$cookie.delete('username');
            this.$router.push("/home");
          }, function (error) {
            console.log(error);

            if (error.status == 400) {errorMessage += "Bad request!";}
            if (error.status == 401) {errorMessage += "Unauthorized";}

            //window.alert(errorMessage);
            console.log(errorMessage);      //display this on page

            //this.$router.push("/home");
            this.token = "";
            this.$cookie.delete('token');
            this.$cookie.delete('username');
            this.$cookie.delete('userId');


            //this.error = error;
            //this.errorFlag = true;
          });
      },
      createAccount: function() {
        var username = this.usernameCreate;
        var givenname = this.givennameCreate;
        var familyname = this.familynameCreate;
        var email = this.emailCreate;
        var password = this.passwordCreate;

        var errorMessage = "";


        if (username == undefined) {
          errorMessage += "No username entered! ";
        } else {
          if (username.length < 2) {
            errorMessage += "Enter a longer username! ";
          }creds
        }

        if (givenname  == undefined) {
          errorMessage += "No given name entered! ";
        } else {
          if (givenname.length < 2) {
            errorMessage += "Enter a longer given name! ";
          }
        }

        if (familyname == undefined) {
          errorMessage += "No family name entered! ";creds
        } else {
          if (familyname.length < 2) {
            errorMessage += "Enter a longer family name! ";
          }
        }

        if (email == undefined) {
          errorMessage += "No email entered! ";
        } else {
          if (!this.validateEmail(email)) {                             //external library??
            errorMessage += "Enter a valid email! ";
          }
        }

        if (password == undefined) {
          errorMessage += "No password entered! ";
        } else {
          if (password.length < 2) {
            errorMessage += "Enter a longer password! ";
          }
        }



        if (errorMessage.length > 1) {
          window.alert(errorMessage);
          console.log(errorMessage);         //display this on page
          return;
        }


        var creds = {
          username: username,
          email: email,
          password: password,
          givenName: givenname,
          familyName: familyname
        };


        this.$http.post("http://localhost:4941/api/v1/users", creds)
          .then(function (response) {

            if (response.status == 201) {
              //create popup with successful creation message
              window.alert("Succesful profile creation! Logging you in, your unique id is " + response.data.id);
              this.usernameLogin = username;
              this.passwordLogin = password;
              this.emailLogin = email;
              this.login()
            }

          }, function (error) {

            //display error message
            window.alert("Malformed profile creation attributes! Try again, email address must be unique!");
            console.log("Malformed profile creation attributes! Try again, email address must be unique!")

            //this.error = error;
            //this.errorFlag = true;
          });
      },
      validateEmail: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
  }


    }
  }
</script>

