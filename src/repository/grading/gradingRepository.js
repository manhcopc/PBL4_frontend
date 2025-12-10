import cameraApi from "../../data/cameraApi";
import gradingApi from "../../data/gradingApi";
import examineeRecordApi from "../../data/examineeRecordApi";
import examineeApi from "../../data/examineeApi";
import {
  enrichRecordsWithDetails,
  mapProcessingResponse,
  mapRecordResponse,
  mapRecordResultResponse,
} from "../../domain/grading/mappers";


const collectAllExamineeIds = (records) => {
  const ids = new Set();
  records.forEach((record) => {
    if (record.examineeId !== null && record.examineeId !== undefined) {
      ids.add(String(record.examineeId)); 
    }
  });
  return Array.from(ids);
};

const fetchMissingDetails = async (records) => {
  const ids = collectAllExamineeIds(records);
  
  console.log("Tìm thấy các ID cần lấy tên:", ids); 

  if (!ids.length) {
    return new Map();
  }
  try {
    const detailPairs = await Promise.all(
      ids.map((id) =>
        examineeApi
          .getExamineeById(id)
          .then((res) => ({ id, detail: res.data }))
          .catch((err) => {
            console.error(`Lỗi lấy sinh viên ID ${id}:`, err);
            return { id, detail: null };
          })
      )
    );

    const map = new Map();
    detailPairs.forEach(({ id, detail }) => {
      if (detail) {
        map.set(String(id), detail); 
      }
    });
    
    console.log("Đã tạo Map sinh viên với size:", map.size);
    return map;
  } catch (error) {
    console.error("Lỗi trong fetchMissingDetails:", error);
    return new Map();
  }
};


export default function createGradingRepository() {
  return {
    async fetchCameraFrame() {
      return "/api/CameraStream/TMDB-00001/";
    },

    async fetchCameraSnapshot() {
      const res = await cameraApi.getImage();
      return res.data;
    },

    async listRecords(examId) {
      const res = await examineeRecordApi.getAllRecord(examId);
      const raw = Array.isArray(res.data) ? res.data : [];

      // console.log("1. API Raw Data (Item đầu tiên):", raw[0]);
      let records = raw.map((record, index) =>
        mapRecordResponse(record, index)
      );
      // console.log("2. Sau Mapper lần 1 (Item đầu tiên):", records[0]);

      const detailMap = await fetchMissingDetails(records);
      
      if (detailMap.size) {
        records = enrichRecordsWithDetails(records, detailMap);
      }
      // console.log("3. Dữ liệu cuối cùng (Enriched):", records[0]);
      return records;
    },
    async processImage(file) {
      const formData = new FormData();
      if (file) {
        formData.append("image", file, file.name || "upload.jpg");
      }
      const res = await gradingApi.imageProcess(formData);
      return mapProcessingResponse(res.data || {});
    },

    async saveResult(payload) {
      return gradingApi.imageProcessSave(payload);
    },

    async fetchRecordResult(recordId) {
      // 1. Gọi API
      const res = await examineeRecordApi.getResult(recordId);
      
      const rawData = Array.isArray(res.data) ? res.data[0] : res.data;

      if (!rawData) return null;

      console.log("Repo Raw Data:", rawData);
      const record = mapRecordResponse(rawData);
      const result = mapRecordResultResponse(rawData);

      console.log("Repo Mapped Result:", result);

      return {
        record,
        result
      };
    },
  };
}