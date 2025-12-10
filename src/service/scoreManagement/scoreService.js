import createScoreRepository from "../../repository/score/scoreRepository";

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
    listExams: () => scoreRepository.listExams(),
    
    getExamRecords: (examId) => {
      if (!examId) return Promise.resolve([]);
      return scoreRepository.getExamRecords(examId);
    },

    async saveExamRecords({ examId, updatedRecords, originalRecords }) {
      if (!examId || !updatedRecords?.length) return { success: 0, failed: 0 };

      const originals = originalRecords || [];
      const originalMap = new Map(originals.map(item => [item.recordId, item]));

      const changedRecords = updatedRecords.filter((record) => {
        const original = originalMap.get(record.recordId);
        return !original || hasRecordChanged(record, original);
      });

      if (!changedRecords.length) return { success: 0, failed: 0 };
      const results = await Promise.allSettled(
        changedRecords.map((record) => {
          const original = originalMap.get(record.recordId);
          return scoreRepository.updateRecord(examId, record.recordId, record, original);
        })
      );

      const failedCount = results.filter(r => r.status === 'rejected').length;
      const successCount = results.filter(r => r.status === 'fulfilled').length;

      // Trả về kết quả để View hiển thị Toast/Alert
      return { success: successCount, failed: failedCount, total: changedRecords.length };
    }
  };
}
