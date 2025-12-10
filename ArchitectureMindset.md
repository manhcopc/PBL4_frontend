⭐ 1. Tư duy: UI không được xử lý dữ liệu → Service/Repository phải làm giùm

Điểm quan trọng nhất:

UI chỉ render.
Service/Repository xử lý dữ liệu và logic gọi API.

Khi bạn hiểu điều này → bạn sẽ biết tự động chuyển logic ra khỏi component.

Ví dụ:

❌ Không được để UI xử lý thế này:

lọc sinh viên thiếu thông tin

fetch bổ sung examinee

merge student records

normalize answers

tìm paper theo code

batch update answers

➡️ Những việc này phải nằm trong repository/service.

Tư duy số 1:
“UI làm gì? Render.
Service làm gì? Logic + API.”

⭐ 2. Tư duy: Service phải trả dữ liệu SẠCH cho Domain/UI

Bạn cần xoay mindset từ:

“API trả gì thì dùng nấy”

sang:

“API trả raw, Service phải làm sạch trước khi cho UI xài.”

Ví dụ hàm này:

normalizeAnswers(rawAnswers)


Là kết quả của tư duy:

“UI không được xử lý mảng raw, phải nhận dữ liệu sạch.”

Tư duy số 2:
“Dữ liệu sạch là trách nhiệm của Service.”

⭐ 3. Tư duy: Repository là nơi gom dữ liệu từ nhiều API

Ví dụ:

const [examRes, studentsRes, papers] = await Promise.all([...])


Đây là orchestration logic, UI không làm được.

Nếu bạn hiểu rằng 1 feature (ví dụ Edit Exam) cần:

exam info

papers list

answers

student list

student detail

👉 Bạn biết phải gom lại trong Repository.

Tư duy số 3:
“Feature = tập hợp nhiều API → Repository phải gom lại và xử lý.”

⭐ 4. Tư duy: Tạo hàm riêng cho từng “Meaningful Action”

Những hàm bạn viết như:

fillStudentDetail

fetchPapersWithAnswers

mapStudentRecord

mapExamineeEntity

mapAnswersForSave

đều là ví dụ hoàn hảo của:

“Mỗi hàm chỉ làm 1 việc rõ ràng.”
(Single Responsibility Principle)

Bạn thấy student thiếu detail → bạn tạo hàm fillStudentDetail.

Bạn thấy logic fetch papers trùng lặp → bạn tạo hàm fetchPapersWithAnswers.

Bạn thấy mapping raw record → bạn tạo mapStudentRecord.

Tư duy số 4:
“Nếu logic phức tạp hoặc lặp lại → tách thành hàm riêng.”

⭐ 5. Tư duy: Hãy nhìn vấn đề theo “quy trình nghiệp vụ” thay vì “API”

Nghiệp vụ “xem chi tiết bài thi” không phải gọi API
mà là quy trình:

Lấy đề thi

Lấy các mã đề

Lấy đáp án từng mã đề

Lấy danh sách thí sinh theo examId

Bổ sung thông tin examinee nếu thiếu

Merge tất cả lại → domain model sạch

💡 Khi bạn tư duy theo quy trình như vậy, bạn sẽ biết:

hàm nào phải tồn tại

hàm nào phải tách ra

hàm nào thuộc repository

hàm nào thuộc normalizer

hàm nào thuộc service

Tư duy số 5:
“Phải hiểu feature từ góc nhìn nghiệp vụ, không phải API.”

🎁 Tổng hợp 5 tư duy để viết được code như bạn đang viết
Tư duy	Giúp bạn viết được	Ví dụ trong code của bạn
UI không xử lý dữ liệu	tạo service/repository	createExamRepository
Service trả về dữ liệu sạch	mapper/normalize	mapPaperResponse, normalizeAnswers
Repository gom nhiều API	orchestration	getExamDetail()
Mỗi hàm 1 nhiệm vụ	tách logic	fillStudentDetail, fetchPapersWithAnswers
Nghĩ theo quy trình nghiệp vụ	biết cần viết gì	toàn bộ file của bạn
🔥 Muốn luyện tư duy này cực nhanh?

Tự đặt câu hỏi mỗi khi làm 1 feature:

❓ 1. “UI có nên biết cái này không?”

Nếu “KHÔNG” → đưa vào Service hoặc Repository.

❓ 2. “Có cần dữ liệu sạch không?”

Nếu “CÓ” → tạo mapper/normalizer.

❓ 3. “Logic này có thể dùng lại không?”

Nếu “CÓ” → tách thành hàm riêng.

❓ 4. “API cho mình raw hay clean?”

Nếu “raw” → phải map.

❓ 5. “Nghiệp vụ đầy đủ gồm những bước nào?”

Mỗi bước = 1 hàm riêng.