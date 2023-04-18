import http from "../http-common";

class TutorialDataService {
  getAll(url,params) {
    return http.get(`/${url}`,{ params });
  }
  addToFav(params) {
    return http.post("/addfav",params);
  }
  removeToFav(params) {
    return http.post("/removefav",params);
  }  
  showfav() {
    return http.get("/showfav");
  }
  
}

export default new TutorialDataService();
