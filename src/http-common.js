import axios from "axios";
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
export default axios.create({
  baseURL: "http://fruits-app-api.stagingwebsites.info:8001/api/",
  // baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-type": "application/json"
  }
});
