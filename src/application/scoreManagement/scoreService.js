import createScoreRepository from "../../infrastructure/score/scoreRepository";

const scoreRepository = createScoreRepository();

const hasRecordChanged = (record, original) => {
  if (!original) return true;
  return (
    original.correctCount !== record.correctCount ||
    original.score !== record.score ||
    original.pendingImage !== record.pendingImage ||
    original.gradedImage !== record.gradedImage
  );
};

export default function createScoreService() {
  return {
    listExams() {
      return scoreRepository.listExams();
    },
    getExamRecords(examId) {
      if (!examId) return [];
      return scoreRepository.getExamRecords(examId);
    },
    async saveExamRecords({ examId, updatedRecords, originalRecords }) {
      if (!examId || !updatedRecords?.length) {
        return;
      }
      const originals = originalRecords || [];
      const changedRecords = updatedRecords.filter((record) => {
        const original = originals.find(
          (item) => item.recordId === record.recordId
        );
        return hasRecordChanged(record, original);
      });
      if (!changedRecords.length) {
        return;
      }
      await Promise.all(
        changedRecords.map((record) => {
          const original = originals.find(
            (item) => item.recordId === record.recordId
          );
          return scoreRepository.updateRecord(
            examId,
            record.recordId,
            record,
            original
          );
        })
      );
    },
  };
}
