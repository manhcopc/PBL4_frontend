import cameraApi from "../../services/api/cameraApi";
import gradingApi from "../../services/api/gradingApi";
import examineeRecordApi from "../../services/api/examineeRecordApi";
import examineeApi from "../../services/api/examineeApi";
import {
  enrichRecordsWithDetails,
  mapProcessingResponse,
  mapRecordResponse,
  mapRecordResultResponse,
} from "../../domain/grading/mappers";

const collectMissingDetailIds = (records) =>
  Array.from(
    new Set(
      records
        .filter(
          (record) =>
            record.examineeId &&
            (!record.fullName ||
              record.fullName.startsWith("Thí sinh") ||
              !record.studentCode ||
              record.studentCode.startsWith("SV-"))
        )
        .map((record) => record.examineeId)
    )
  );

const fetchMissingDetails = async (records) => {
  const ids = collectMissingDetailIds(records);
  if (!ids.length) {
    return new Map();
  }

  const detailPairs = await Promise.all(
    ids.map((id) =>
      examineeApi
        .getExamineeById(id)
        .then((res) => ({ id, detail: res.data }))
        .catch(() => ({ id, detail: null }))
    )
  );

  const map = new Map();
  detailPairs.forEach(({ id, detail }) => {
    if (detail) {
      map.set(id, detail);
    }
  });
  return map;
};

export default function createGradingRepository() {
  return {
    async fetchCameraFrame() {
      const res = await cameraApi.getCameraStream();
      return res.data;
    },
    async listRecords(examId) {
      const res = await examineeRecordApi.getAllRecord(examId);
      const raw = Array.isArray(res.data) ? res.data : [];
      let records = raw.map((record, index) =>
        mapRecordResponse(record, index)
      );
      const detailMap = await fetchMissingDetails(records);
      if (detailMap.size) {
        records = enrichRecordsWithDetails(records, detailMap);
      }
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
    saveResult(payload) {
      return gradingApi.imageProcessSave(payload);
    },
    async fetchRecordResult(recordId) {
      const res = await examineeRecordApi.getResult(recordId);
      const payload = res.data || {};
      return {
        record: mapRecordResponse(payload, 0),
        result: mapRecordResultResponse(payload),
      };
    },
  };
}
