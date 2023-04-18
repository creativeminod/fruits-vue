<template>
  <div class="list row">
    <div class="col-md-8">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Search by name"
          v-model="searchTitle"
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="page = 1; searchAction();"
          >
            Search
          </button>
          <button v-if="this.searchTitle !=''" @click="refreshList();" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>        
      </div>

    <div class="errorMsg" v-if="this.errorMsg!=''">{{this.errorMsg}}</div>  
    </div>  
    <div class="col-md-12">
      <div class="filter-section">
        <h4 class="filter-heading">Fruits List</h4>
        <button class="filter-button-all"  :class="this.searchStatus=='all' ? 'active' : 'notactive'" @click="refreshList();">All</button>

        <button class="filter-button-fav" :class="this.searchStatus=='showfav' ? 'active' : 'notactive'"  @click="showfav();" >Favorite</button>
        
      </div>
      <div class="loading" v-if="this.spinner==true">Loading&#8230;</div>
      <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>FruitId</th>
          <th>Fruit Order</th>
          <th>genus</th>
          <th>calories</th>
          <th>carbohydrates</th>
          <th>fat</th>
          <th>protein</th>
          <th>sugar</th>
          <th>favourits status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in tutorials"
          :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.fruit_id }}</td>
          <td>{{ item.fruit_order }}</td>
          <td>{{ item.genus }}</td>
          <td>{{ item.nutritions.calories }}</td>
          <td>{{ item.nutritions.carbohydrates }}</td>
          <td>{{ item.nutritions.fat }}</td>
          <td>{{ item.nutritions.protein }}</td>
          <td>{{ item.nutritions.sugar }}</td>
          <td>
            <div v-if="item.favorite_status !='end'">
              <div v-if="item.favorite_status===true" @click="favuncheck(item.fruit_id);">
                <b-icon-heart-fill class="font-resize"></b-icon-heart-fill>
                </div>
              <div v-else @click="favcheck(item.fruit_id);">
                <b-icon-heart  class="font-resize"></b-icon-heart>
              </div>
            </div>
          </td>
        </tr>
        <tr v-if="tutorials==0" class="no-record-found">No Record Found</tr>
      </tbody>
    </table> 
    </div>
    <div class="col-md-12">
      <b-pagination
        v-if="count>10"
        v-model="page"
        :total-rows="count"
        :per-page="pageSize"
        prev-text="Prev"
        next-text="Next"
        @change="handlePageChange"
      ></b-pagination>
    </div>
    <div class="col-md-6">
      <div v-if="currentTutorial">
        <h4>Tutorial</h4>
        <div>
          <label><strong>Title:</strong></label> {{ currentTutorial.title }}
        </div>
        <div>
          <label><strong>Description:</strong></label>
          {{ currentTutorial.description }}
        </div>
        <div>
          <label><strong>Status:</strong></label>
          {{ currentTutorial.published ? "Published" : "Pending" }}
        </div>

        <a
          class="badge badge-warning"
          :href="'/tutorials/' + currentTutorial.id"
        >
          Edit
        </a>
      </div>
      <div v-else>
      
      </div>
    </div>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";

export default {
  name: "tutorials-list",
  data() {
    return {
      tutorials: [],
      currentTutorial: null,
      currentIndex: -1,
      searchTitle: "",
      spinner: true,
      searchStatus:'all',
      errorMsg:'',
      page: 1,
      count: 0,
      pageSize: 10,
    };
  },
  methods: {
    getRequestParams(searchTitle, page, pageSize) {
      let params = {};

      if (searchTitle) {
        params["title"] = searchTitle;
      }

      if (page) {
        params["page"] = page - 1;
      }

      if (pageSize) {
        params["size"] = pageSize;
      }

      return params;
    },
    favcheck(id) {
      this.errorMsg=''
      this.spinner=true
      var data = {
        'fruit_id': id
      };
      TutorialDataService.addToFav(data)
      .then((res) => {
        if(res.data !='done'){
          this.errorMsg=res.data
        }
        this.retrieveTutorials();
        this.spinner=false
      })
    },
    favuncheck(id) {
      this.errorMsg=''
      this.spinner=true
      var data = {
        'fruit_id': id
      };
      TutorialDataService.removeToFav(data)
      .then(() => {
        this.retrieveTutorials();
        this.spinner=false
      })
    },
    searchAction(){
      if(this.searchTitle.trim() !=""){
        this.retrieveTutorials();
      }
    },
    showfav(){ 
      this.errorMsg=''
      this.searchTitle=''
      this.searchStatus='showfav'
      TutorialDataService.showfav()
      .then((response) => {
          const { items, totalItems } = response.data;
          this.tutorials = items;
          this.count = totalItems;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
        console.log(this.searchStatus)
    },
    retrieveTutorials() {          
      const params = this.getRequestParams(
        this.searchTitle,
        this.page,
        this.pageSize
      );

      TutorialDataService.getAll(this.searchStatus,params)
        .then((response) => {
          const { items, totalItems } = response.data;
          this.tutorials = items;
          this.count = totalItems;
          this.spinner=false;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    handlePageChange(value) {
      console.log(this.searchStatus)
      this.page = value;
      this.retrieveTutorials();
    },
    refreshList() {
      this.errorMsg=''
      this.searchTitle=''
      this.searchStatus='all'
      this.retrieveTutorials();
    },

    setActiveTutorial(tutorial, index) {
      this.currentTutorial = tutorial;
      this.currentIndex = index;
    }  
  },
  mounted() {
    this.retrieveTutorials();
  },
};
</script>

<style>
  .filter-section {
      display: flex;
  }
  .filter-heading{
    width:20%;
  }
  .font-resize {
    font-size: 25px;
  }
  button.filter-button-all {
    margin-right: 27px;
  }
  .filter-section button {
    border: none;
    width: 10%;
  }
  .active {
    background: green;
    color: #fff;
    border: none;
  }

  /* Absolute Center Spinner */
.loading {
  position: fixed;
  z-index: 999;
  height: 2em;
  width: 2em;
  overflow: show;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

/* Transparent Overlay */
.loading:before {
  content: '';
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
    background: radial-gradient(rgba(20, 20, 20,.8), rgba(0, 0, 0, .8));

  background: -webkit-radial-gradient(rgba(20, 20, 20,.8), rgba(0, 0, 0,.8));
}

/* :not(:required) hides these rules from IE9 and below */
.loading:not(:required) {
  /* hide "loading..." text */
  font: 0/0 a;
  color: transparent;
  text-shadow: none;
  background-color: transparent;
  border: 0;
}

.loading:not(:required):after {
  content: '';
  display: block;
  font-size: 10px;
  width: 1em;
  height: 1em;
  margin-top: -0.5em;
  -webkit-animation: spinner 150ms infinite linear;
  -moz-animation: spinner 150ms infinite linear;
  -ms-animation: spinner 150ms infinite linear;
  -o-animation: spinner 150ms infinite linear;
  animation: spinner 150ms infinite linear;
  border-radius: 0.5em;
  -webkit-box-shadow: rgba(255,255,255, 0.75) 1.5em 0 0 0, rgba(255,255,255, 0.75) 1.1em 1.1em 0 0, rgba(255,255,255, 0.75) 0 1.5em 0 0, rgba(255,255,255, 0.75) -1.1em 1.1em 0 0, rgba(255,255,255, 0.75) -1.5em 0 0 0, rgba(255,255,255, 0.75) -1.1em -1.1em 0 0, rgba(255,255,255, 0.75) 0 -1.5em 0 0, rgba(255,255,255, 0.75) 1.1em -1.1em 0 0;
box-shadow: rgba(255,255,255, 0.75) 1.5em 0 0 0, rgba(255,255,255, 0.75) 1.1em 1.1em 0 0, rgba(255,255,255, 0.75) 0 1.5em 0 0, rgba(255,255,255, 0.75) -1.1em 1.1em 0 0, rgba(255,255,255, 0.75) -1.5em 0 0 0, rgba(255,255,255, 0.75) -1.1em -1.1em 0 0, rgba(255,255,255, 0.75) 0 -1.5em 0 0, rgba(255,255,255, 0.75) 1.1em -1.1em 0 0;
}

/* Animation */

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-moz-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-o-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.errorMsg{
  color:red;
  text-align: center;
}
</style>
