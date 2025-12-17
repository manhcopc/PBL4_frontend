import api from "./api";
export default {

    // listRecords: (examId) =>
    //     api.get(`/Records/${examId}`),

    imageProcess: (data) => 
        api.post(`/ImageProcess/`, data    ,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
    imageProcessSave: (data) =>
        api.post(`/ImageProcessSave/`,data)
}        