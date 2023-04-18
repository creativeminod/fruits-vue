import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/",
      name: "tutorials",
      component: () => import("./components/TutorialsList")
    },
    {
      path: "/nutritions",
      alias: "/nutritions",
      name: "nutritions",
      component: () => import("./components/Nutritions")
    }    
  ]
});
