<template>
  <div class="list row">
    <div class="col-md-6">
      <h4>Total Nutritions</h4>
      <table class="table">
      <thead>
        <tr>
          <th>Calories</th>
          <th>Fat</th>
          <th>Sugar</th>
          <th>Carbohydrates</th>
          <th>Protein</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-if="nutritions"
          :key="index">
          <td>{{ nutritions.calories }}</td>
          <td>{{ nutritions.fat }}</td>
          <td>{{ nutritions.sugar }}</td>
          <td>{{ nutritions.carbohydrates }}</td>
          <td>{{ nutritions.protein }}</td>          
        </tr>
      </tbody>
      </table> 
      </div>
    </div>
</template>

<script>
import NutritionsDataService from "../services/NutritionsDataService";

export default {
  name: "tutorials-list",
  data() {
    return {
      nutritions: []
    };
  },
  methods: {
    retrieveTutorials() {     
      NutritionsDataService.getSum()
        .then((response) => {
          this.nutritions = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.retrieveTutorials();
  },
};
</script>

 