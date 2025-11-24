import api from "../api";

export default {
  getCameraStream: () =>
    api.get(`/CameraStream/TMDB-00001/`, {
      responseType: "blob",
    }),
};
