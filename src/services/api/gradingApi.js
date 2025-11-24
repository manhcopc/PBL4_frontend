import api from "../api";
export default {
    imageProcess: (data) => 
        api.post(`/ImageProcess/`, data),
    imageProcessSave: (data) =>
        api.post(`/ImageProcessSave/`,data)
}