import http from "../http-common";

class NutritionsDataService {
  getSum() {
    return http.get("/total_sum");
  }
}

export default new NutritionsDataService();
