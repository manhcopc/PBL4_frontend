import api from "./api";

export default {
  getCameraStream: () => 
    api.get("/CameraStream/TMDB-00001/"),
        // `${api.defaults.baseURL}/CameraStream/TMDB-00001/`,
  getImage: () => 
      api.get("/CameraStreamImage/TMDB-00001/", { responseType: 'blob' }),
};
