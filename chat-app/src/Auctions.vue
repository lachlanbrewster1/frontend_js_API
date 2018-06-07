  <template>
    <div id="auctionPage">
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


      <div v-if="$route.params.auctionId">

        <div id="auction">

          {{getSingleAuction($route.params.auctionId)}}


          <h3>{{ (this.currentAuction).title }}</h3>

          <div>
            <td><img :src = getPhoto($route.params.auctionId) width = 500> </td>
          </div>

          <h4>Description</h4>
          <div>
            <td>{{ (this.currentAuction).description }}</td>
          </div>

          <h4>Category</h4>
          <div>
            <td>{{ (this.currentAuction).categoryTitle }}</td>
          </div>

          <h4>Auction ID</h4>
          <div>
            <td>{{ $route.params.auctionId }}</td>
          </div>

          <h4>Seller</h4>
          <div>
            <td>{{ (this.currentAuction).seller.username }}</td>
          </div>

          <h4>Starting Bid</h4>
          <div>
            <td>{{ (this.currentAuction).startingBid }}</td>
          </div>

          <h4>Current Bid</h4>
          <div>
            <td>{{ (this.currentAuction).currentBid }}</td>
          </div>


          <h4>Start Date</h4>
          <div>
            <td>{{ new Date(this.currentAuction.startDateTime).toDateString() }}</td>
          </div>

          <h4>End Date</h4>
          <div>
            <td>{{ new Date(this.currentAuction.endDateTime).toDateString() }}</td>
          </div>

          <h4>Bids</h4>
          <div>
            <td>{{ (this.currentAuction).bids }}</td>
          </div>


          <div v-if="this.$cookie.get('token') && Date.now() < this.currentAuction.endDateTime && Date.now() > this.currentAuction.startDateTime">
            <input name="bidAmountField" type="text" placeholder="Bid Amount.." maxlength="30" v-model="bidAmount">
            <button type="button" class = "btn btn-primary" data-toggle="modal"
                     v-on:click="placeBid($route.params.auctionId)">
              Place bid
            </button>

          </div>



          <div v-if="this.currentAuction.seller.id == this.$cookie.get('userId') && this.$cookie.get('token') && this.currentAuction.bids.length == 0 && Date.now() < this.currentAuction.startDateTime && Date.now() < this.currentAuction.endDateTime ">

            <h3><router-link :to="{ name: 'editAuction', params: { auctionIdEdit: $route.params.auctionId }}">Edit Auction</router-link></h3>

          </div>



        </div>

      </div>




      <div v-else>

        <input name="searchField" type="text" placeholder="Search.." maxlength="30" v-model="search">

        <select name="categoryDropdown" v-model="category">
          <option value="" selected>All categories</option>
          <option value="1">Apparel</option>
          <option value="2" >Equipment</option>
          <option value="3">Vehicle</option>
          <option value="4">Property</option>
          <option value="5">Other</option>
        </select>

        <select name="statusDropdown" v-model="status">
          <option value="all" selected>All</option>
          <option value="active" >Active</option>
          <option value="expired">Expired</option>
          <option value="won">Won</option>
          <option value="upcoming">Upcoming</option>
        </select>

        <button type="button" class = "btn btn-primary" data-toggle="modal"
                data-target="#searchModal" v-on:click="getAuctions()">
          Search
        </button>


        <h1>Auctions</h1>
        дай мне свои деньги

        <div id="auctions">
          <table>

            <tr v-for="auction in auctions">
              <div>
                <div><router-link :to="{ name: 'auction', params: { auctionId: auction.id }}">{{ auction.title }}</router-link></div>
                <td><img :src = getPhoto(auction.id) width = 200> </td>
              </div>

            </tr>
          </table>


        </div>

      </div>

      <div v-if="$route.params.auctionIdEdit">
        <div id="editAuction">

          Title
          <div><input name="title" type="text" :placeholder=this.currentAuction.title maxlength="30" v-model="titleEdit"></div>

          Start Date
          <div><input name="startDate" type="text" :placeholder=this.currentAuction.startDateTime maxlength="30" v-model="startDateEdit"></div>

          End Date
          <div><input name="endDate" type="text" :placeholder=this.currentAuction.endDateTime maxlength="30" v-model="endDateEdit"></div>
          Date format (YYYY-MM-DD)
          <div></div>

          Description
          <div><input name="description" type="text" :placeholder=this.currentAuction.description maxlength="100" v-model="descriptionEdit" width=100></div>

          Category
          <div>
            <select name="categoryDropdown" v-model="categoryEdit">
              <option value="1">Apparel</option>
              <option value="2" >Equipment</option>
              <option value="3">Vehicle</option>
              <option value="4">Property</option>
              <option value="5">Other</option>
            </select>
          </div>


          Start Price
          <div><input name="startPrice" type="text" :placeholder=this.currentAuction.startingBid maxlength="30" v-model="startingBidEdit"></div>

          Reserve Price
          <div><input name="reservePrice" type="text" :placeholder=this.currentAuction.reservePrice maxlength="30" v-model="reservePriceEdit"></div>

          <button type="button" class = "btn btn-primary" data-toggle="modal"
                  v-on:click="editAuction($route.params.auctionIdEdit)">
            Save changes
          </button> (may need to refresh page to reflect changes)

        </div>


      </div>



    </div>
  </template>

<style>

  #auctionPage {
    min-height: 40em;
    background-color: plum;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

</style>

  <script>


    import LoginLogout from './LoginLogout.vue';


    export default {

      //TODO: convert dates to readable dates



      data() {
        return {
          error: "",
          errorFlag: false,
          auctions: [],
          auctionsDetailed: [],
          search: "",
          category: "",
          status:"",
          bidAmount: "",
          currentAuction: "",
          token: "",
          titleEdit: "",
          startDateEdit: "",
          endDateEdit: "",
          descriptionEdit: "",
          categoryEdit: "",
          reservePriceEdit: "",
          startingBidEdit: ""
        }
      },

      beforeMount: function () {
        this.getAuctions();
        this.token = this.$cookie.get('token');
        },
      mounted: function () {
        this.getAuctions();
        this.token = this.$cookie.get('token');
      },


      methods: {
        getPhoto: function (id) {
        return "http://localhost:4941/api/v1/auctions/" + id + "/photos";

    },
        getAuctions: function () {

          var url = "http://localhost:4941/api/v1/auctions";

          var query = this.search;
          if (query != "" && query != undefined) {
            url += "?q=" + query;
          }

          var category = this.category;
          if (category != "" && category != undefined) {
              if (query == "") {
                url += "?category-id=" + category;
              } else {
                url += "&category-id=" + category;
              }
          }

          var status = this.status;
          if (status != "" && status != undefined) {

            if (category == "" && query == "") {
              url += "?status=" + status;
            } else {
              url += "&status=" + status;
            }

          }
          console.log(url);
          this.$http.get(url)
            .then(function (response) {
              this.auctions = response.data;
              return response.data;
            }, function (error) {
              window.alert(error);
              //this.error = error;
              //this.errorFlag = true;
            });
        },
        getSingleAuction: function (id) {
            var url = "http://localhost:4941/api/v1/auctions/" + id;

            this.$http.get(url)
                .then(function (response) {
                  //console.log(response.data);
                  this.currentAuction = response.data;
                  return response.data;
                }, function (error) {
                  window.alert(error);
                  console.log(error);
                    //this.error = error;
                    //this.errorFlag = true;
                });
        },
        deleteAuction: function(auction_id) {
          this.$http.delete('http://localhost:4941/api/v1/auctions/' + auction_id).then(function(response) {
            for (var i = 0; i <= this.auctions.length; i++) {
              if (auction_id === this.auctions[i].id) {
                this.auctions.splice(i, 1);
              }
            }
            this.$router.push('/auctions');
          }, function(error){
            this.error = error;
            this.errorFlag = true;
          });
        },
        placeBid: function(id) {
          var auctionId = id;
          var bidAmount = this.bidAmount;
          var errorMessage = "";


          if (bidAmount <= this.currentAuction.currentBid) {
            errorMessage = "Bid must be greater than current bid!";
            window.alert(errorMessage);
            console.log(errorMessage);
            return;

          } else if (bidAmount < this.currentAuction.startingBid) {
            errorMessage = "Bid must be greater than starting bid!";
            window.alert(errorMessage);
            console.log(errorMessage);
            return;

          }  else {

            var creds = {
              "X-Authorization": this.$cookie.get('token')
            };

            console.log(creds);


            this.$http.post("http://localhost:4941/api/v1/auctions/" + auctionId + "/bids?amount=" + bidAmount, {}, {headers:creds})
              .then(function (response) {

              }, function (error) {
                if (error.status == 400) {errorMessage = "Bad bid request!"}
                if (error.status == 401) {errorMessage = "Unauthorized bid!"}

                //display error message
                window.alert(errorMessage);
                console.log(errorMessage);

                //this.error = error;
                //this.errorFlag = true;
              });

          }

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

        },
        editAuction: function (id) {

          var titleEdit = this.titleEdit;
          var startDateEdit = this.startDateEdit;
          var endDateEdit = this.endDateEdit;
          var descriptionEdit = this.descriptionEdit;
          var categoryEdit = this.categoryEdit;
          var reservePriceEdit = this.reservePriceEdit;
          var startingBidEdit = this.startingBidEdit;


          var errorMessage = "";
          var creds = { };


          if (titleEdit  != "") {
              creds['title'] = titleEdit;
              if (titleEdit .length < 2) {
                errorMessage += "Enter a longer title! ";
            }
          }

          if (startDateEdit  != "") {
            creds['startDate'] = Date.parse(new Date(startDateEdit));
            if (isNaN(new Date(startDateEdit))) {
              errorMessage += "Enter a valid start date! "
            }
            else if(isNaN(Date.parse(startDateEdit))) {
              errorMessage += "Enter a valid start date! "
            }
            else if (new Date(startDateEdit)  < Date.now()) {
              errorMessage += "Start date cannot be in the past! ";
            }
          }


          if (endDateEdit  != "") {
            creds['endDate'] = Date.parse(new Date(endDateEdit));

            if (isNaN(new Date(endDateEdit))) {
              errorMessage += "Enter a valid end date! "
            }
            else if(isNaN(Date.parse(endDateEdit))) {
              errorMessage += "Enter a valid end date! "
            }
            else if (new Date(endDateEdit)  < Date.now()) {
              errorMessage += "End date cannot be in the past! ";
            }

          }

          if (descriptionEdit  != "") {
            creds['description'] = descriptionEdit;
          }

          if (reservePriceEdit  != "") {
            creds['reservePrice'] = parseInt(reservePriceEdit);
            if (isNaN(parseInt(reservePriceEdit))) {
              errorMessage += "Enter a valid reserve price! "
            }
          }

          if (startingBidEdit  != "") {
            creds['startingBid'] = parseInt(startingBidEdit);
            if (isNaN(parseInt(startingBidEdit))) {
              errorMessage += "Enter a valid start price! "
            }
          }

          if (categoryEdit  != "") {
            creds['categoryId'] = parseInt(categoryEdit);
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



          this.$http.patch("http://localhost:4941/api/v1/auctions/" + id, creds, {headers:authCreds})
            .then(function (response) {

              if (response.status == 200) {
                //create popup with successful creation message
                this.$router.push("/manageAuction");
                window.alert("Successful auction edit! ");
              }

            }, function (error) {
              this.$router.push("/manageAuction");

              //display error message
              window.alert("Malformed auction creation attributes! Try again");
              console.log("Malformed auction creation attributes! Try again")

              //this.error = error;
              //this.errorFlag = true;
            });

        }
      }
    }
  </script>

