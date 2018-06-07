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

      <h2> Manage Auctions Page</h2>

    </div>

    <div v-if="this.$cookie.get('token')">

      <div id="create">

        <h4>Create an auction</h4>

        <input name="title" type="text" placeholder="Title.." maxlength="30" v-model="title">
        <input name="description" type="text" placeholder="Description.." maxlength="30" v-model="description">
        <select name="categoryDropdown" v-model="categoryCreate">
          <option value="1">Apparel</option>
          <option value="2" >Equipment</option>
          <option value="3">Vehicle</option>
          <option value="4">Property</option>
          <option value="5">Other</option>
        </select>

        <div>
          <input name="startDate" type="text" placeholder="Start date.." maxlength="30" v-model="startDate">
          <input name="endDate" type="text" placeholder="End date.." maxlength="30" v-model="endDate">
          (YYYY-MM-DD)

        </div>

        <div>
          <input name="startPrice" type="text" placeholder="Start price.." maxlength="30" v-model="startingBid">
          <input name="reservePrice" type="text" placeholder="Reserve price.." maxlength="30" v-model="reservePrice">
        </div>

        <div>

        </div>


        <div>
          <button type="button" class = "btn btn-primary" data-toggle="modal"
                  data-target="#createAuctionModal" v-on:click="createAuction()">
            Create auction
          </button>
        </div>

      </div>

      <div id="manage">

        <div id="auctions">

          <h4> Your active auctions:</h4>
          <tr v-for="auction in this.yourCurrentAuctions">

            <div v-if="true">
              <div>
                <div><router-link :to="{ name: 'auction', params: { auctionId: auction.id, auctionTitle: auction.title }}">{{ auction.title }}</router-link></div>
                <td><img :src = getPhoto(auction.id) width = 100> </td>
              </div>
            </div>

          </tr>

          <h4> Your completed auctions with a winner: </h4>
          <tr v-for="auction in this.yourAuctionsCompletedWon">

            <div v-if="true ">
              <div>
                <div><router-link :to="{ name: 'auction', params: { auctionId: auction.id, auctionTitle: auction.title }}">{{ auction.title }}</router-link></div>
                <td><img :src = getPhoto(auction.id) width = 100> </td>
              </div>
            </div>

          </tr>

          <h4> Your completed auctions with no winner: </h4>
          <tr v-for="auction in this.yourAuctionsCompletedNotWon">

            <div v-if="true ">
              <div>
                <div><router-link :to="{ name: 'auction', params: { auctionId: auction.id, auctionTitle: auction.title }}">{{ auction.title }}</router-link></div>
                <td><img :src = getPhoto(auction.id) width = 100> </td>
              </div>
            </div>

          </tr>


          <h4> Auctions you have bid on:</h4>
          <table>
            <tr v-for="auction in this.auctionsDetailed">

              <a v-for="bid in auction.bids">

                <div v-if="bid.buyerId == $cookie.get('userId')">
                  <div>
                    <div><router-link :to="{ name: 'auction', params: { auctionId: auction.id, auctionTitle: auction.title }}">{{ auction.title }}</router-link></div>
                    <td><img :src = getPhoto(auction.id) width = 100> </td>
                  </div>
                </div>

              </a>

            </tr>
          </table>

          <h4> Auctions you have won:</h4>
          <table>
            <tr v-for="auction in this.auctionsYouWon">

              <div v-if="true">
                <div>
                  <div><router-link :to="{ name: 'auction', params: { auctionId: auction.id, auctionTitle: auction.title }}">{{ auction.title }}</router-link></div>
                  <td><img :src = getPhoto(auction.id) width = 100> </td>
                </div>
              </div>

            </tr>
          </table>


          <h4> All your auctions, ever (links may be dead):</h4>
          <tr v-for="auction in this.auctionsDetailed">

            <div v-if="auction.seller.id == $cookie.get('userId')">
              <div>
                <div><router-link :to="{ name: 'auction', params: { auctionId: auction.id, auctionTitle: auction.title }}">{{ auction.title }}</router-link></div>
              </div>
            </div>

          </tr>

        </div>



      </div>


    </div>

    <div v-else>


      {{this.$router.push("/loginLogout")}}


    </div>


  </div>
</template>




<script>

  import VueRouter from 'vue-router';
  import Auctions from './Auctions.vue';


  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        categoryCreate: "",
        reservePrice: "",
        startingBid: "",
        auctions: [],
        yourCurrentAuctions: [],
        auctionsYouBidOn: [],
        auctionsYouWon: [],
        auctionsDetailed: [],
        yourAuctionsCompletedWon: [],
        yourAuctionsCompletedNotWon: [],
        currentAuction: "",
        token: "",
        userId: ""

      }
    },

    beforeMount: function () {
      this.getAuctions();                                        //TODO make sure this executes first


      this.token = this.$cookie.get('token');
      this.userId = this.$cookie.get('userId');

      //console.log(this.auctionsDetailed);
      //console.log(this.auctions);


      var authCreds = {
        "X-Authorization":this.$cookie.get('token')
      };

      this.$http.get("http://localhost:4941/api/v1/my_won_auctions", {headers:authCreds}, {headers:authCreds})
        .then(function (response) {
          this.auctionsYouWon = response.data;
        }, function (error) {
          console.log(error);
        });


      this.$http.get("http://localhost:4941/api/v1/auctions/?status=won&seller=" + this.$cookie.get('userId'), {headers:authCreds}, {headers:authCreds})
        .then(function (response) {
          this.yourAuctionsCompletedWon = response.data;
        }, function (error) {
          console.log(error);
        });

      this.$http.get("http://localhost:4941/api/v1/auctions/?status=expired&seller=" + this.$cookie.get('userId'), {headers:authCreds}, {headers:authCreds})
        .then(function (response) {
          this.yourAuctionsCompletedNotWon = response.data;
        }, function (error) {
          console.log(error);
        });



      this.$http.get("http://localhost:4941/api/v1/auctions/?status=active&seller=" + this.$cookie.get('userId'), {headers:authCreds}, {headers:authCreds})
        .then(function (response) {
          this.yourCurrentAuctions = response.data;
        }, function (error) {
          console.log(error);
        });


      // for (var i = 0; i< this.auctionsDetailed.length; i++) {
      //   if (this.auctionsDetailed[i].seller.id == this.$cookie.get('userId')) {
      //     this.auctionsYouBidOn.push(this.auctionsDetailed[i]);
      //   }
      // }


      //
      // for (var i = 0; i< this.auctionsDetailed.length; i++) {
      //   this.yourCurrentAuctions.push(this.auctionsDetailed[i]);
      //
      // }



      // for (var i = 0; i< this.auctions.length; i++) {
      //
      //   if (this.auctionsDetailed[i].bids.contains(userId)) {             //TODO
      //     this.auctionsYouBidOn.push(this.auctions[i]);
      //
      //   }
      // }
      //


    },



    methods: {
      getPhoto: function (id) {
        return "http://localhost:4941/api/v1/auctions/" + id + "/photos";

      },
      createAuction: function () {


        var title = this.title;
        var startDate = this.startDate;
        var endDate = this.endDate;
        var description = this.description;
        var categoryCreate = this.categoryCreate;
        var reservePrice = this.reservePrice;
        var startingBid = this.startingBid;
        var startDateUnformatted;
        var endDateUnformatted;


        var errorMessage = "";


        if (title == undefined) {
          errorMessage += "No title entered! ";
        } else if (title.length < 2) {
            errorMessage += "Enter a longer title! ";
          }


        if (startDate == undefined) {
          errorMessage += "No start date entered! ";
        } else {

          startDateUnformatted = new Date(startDate);
          if (isNaN(startDateUnformatted)) {
            errorMessage += "Enter a valid start date! "
          }
          else if(isNaN(Date.parse(startDate))) {
            errorMessage += "Enter a valid start date! "
          }
          else if (startDateUnformatted < Date.now()) {
            errorMessage += "Start date cannot be in the past! ";
          }

        }

        if (endDate == undefined) {
          errorMessage += "No end date entered! ";
        } else {

          endDateUnformatted = new Date(endDate);
          if (isNaN(endDateUnformatted)) {
            errorMessage += "Enter a valid end date! "
          } else if(isNaN(Date.parse(endDate))) {
            errorMessage += "Enter a valid end date! "
          }else if (endDateUnformatted < Date.now()) {
            errorMessage += "End date cannot be in the past! ";
          }

        }

        if (description == undefined) {
          errorMessage += "No description entered! ";
        }


        if (categoryCreate == undefined) {
          errorMessage += "No category entered! ";
        }

        if (startingBid == undefined) {
          errorMessage += "No starting bid entered! ";
        } else if (isNaN(parseInt(startingBid))) {
          errorMessage += "Starting bid must be a number!"
        }


        if (reservePrice == undefined) {
          errorMessage += "No reserve price entered! ";
        } else if (isNaN(parseInt(reservePrice))) {
          errorMessage += "Reserve price must be a number!"
        }



        var creds = {
          title: this.title,
          startDateTime: Date.parse(startDateUnformatted),
          endDateTime: Date.parse(endDateUnformatted),
          description: this.description,
          categoryId: parseInt(this.categoryCreate),
          reservePrice: parseInt(this.reservePrice),
          startingBid: parseInt(this.startingBid)
        };


        var authCreds = {
          "X-Authorization":this.token
        };

        console.log(creds);
        console.log(authCreds);


        if (errorMessage.length > 1) {
          window.alert(errorMessage);
          console.log(errorMessage);
          return;
        }


        this.$http.post("http://localhost:4941/api/v1/auctions", creds, {headers:authCreds})
          .then(function (response) {






            if (response.status == 201) {
              //create popup with successful creation message
              window.alert("Successful auction creation! Your unique auction id is " + response.data.id);
            }

          }, function (error) {
            //display error message
            window.alert("Malformed auction creation attributes! Try again");
            console.log("Malformed auction creation attributes! Try again")

            //this.error = error;
            //this.errorFlag = true;
          });

      },
      getAuctions: function () {

        console.log("getAuctions");

        var urlAll = "http://localhost:4941/api/v1/auctions";
        var auctionsNotDetailed = [];
        var auctionsDetailed = [];
        var id;


        this.$http.get(urlAll)
          .then(function (response) {
            auctionsNotDetailed = response.data;

          }, function (error) {
            window.alert(error);
            //this.error = error;
            //this.errorFlag = true;
          }).then(function () {

          var url = "";
          for (var i = 0; i < auctionsNotDetailed.length; i++) {

            id = auctionsNotDetailed[i].id;
            url = "http://localhost:4941/api/v1/auctions/" + id;

            //console.log(url);
            //console.log(auctionsNotDetailed.length);


            this.$http.get(url)
              .then(function (response) {
                //console.log(response.data);
                auctionsDetailed.push(response.data);
              }, function (error) {
                console.log(error);
              });

          }

        }).then(function () {

          this.auctions = auctionsNotDetailed;
          this.auctionsDetailed = auctionsDetailed;

          for (var i = 0; i< this.auctions.length; i++) {

            //auctionsDetailed[i]['id'] = i;
            //console.log(auctionsDetailed);

            //console.log(this.auctions[i].id);
            //console.log(this.auctionsDetailed[i]);
          }

        });

        //this.userId = this.$cookie.get('userId');
        //console.log(this.userId);



        },
      getSingleAuction: function (id) {
        var url = "http://localhost:4941/api/v1/auctions/" + id;
        console.log(url);

        this.$http.get(url)
          .then(function (response) {
            console.log(response.data);
            this.currentAuction = response.data;
            return response.data;
          }, function (error) {
            //window.alert(error);
            console.log(error);
            this.error = error;
            this.errorFlag = true;
          });
      },
      isAuthorized: function (id) {
        var url = "http://localhost:4941/api/v1/auctions/" + id;

        var creds = {
          "X-Authorization": this.$cookie.get('token')
        };

        this.$http.patch(url, {}, {headers:creds})
          .then(function (response) {

            if (response.status == 401) {
              return false;

            } else {
              return true;
            }
            }, function (error) {

            if (error.status == 401) {
              return false;
              console.log('unauthorized');

            } else {
              return true;
            }

            // this.error = error;
            // this.errorFlag = true;
          });

      }

    }
  }


</script>

<style>

  #create {
    width: 500px;
    height: 0px;
    margin: 0px auto 0px auto;
    padding: 0px 0px 0px 0px
  }

  #manage {
    width: 6000px;
    height: 0px;
    margin: 0px auto 0px auto;
    padding: 0px 0px 0px 0px
  }

  #auctions {
    min-height: 100em;
    background-color: white;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  #TopPanel {
    min-height: 7em;
    background-color: plum;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }



</style>
