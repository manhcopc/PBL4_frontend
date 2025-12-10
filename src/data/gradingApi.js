import api from "./clientApi";
export default {

    // listRecords: (examId) =>
    //     api.get(`/Records/${examId}`),
    imageProcess: (data) => 
        api.post(`/ImageProcess/`, data),
    imageProcessSave: (data) =>
        api.post(`/ImageProcessSave/`,data)
}        