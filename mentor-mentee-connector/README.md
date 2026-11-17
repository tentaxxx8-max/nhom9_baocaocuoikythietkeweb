# CỔNG KẾT NỐI CỐ VẤN & HỌC NHÓM (MENTOR-MENTEE CONNECTOR)
> **Báo cáo / Đồ án học phần:** Thiết kế và Phát triển Ứng dụng Web  
> **Phân hệ 5:** Cổng kết nối Cố vấn & Học nhóm (Mentor-Mentee Connector)  
> **Kiến trúc:** Front-end thuần (Zero-dependency: HTML5, CSS3 Flexbox, Vanilla JavaScript ES6+)  
> **Môi trường chạy:** Trực tiếp qua giao thức `file://` (không cần backend, không cần local server hay build tool)

---

## 1. GIỚI THIỆU TỔNG QUAN & TẦM NHÌN DÀI HẠN

### 1.1. Bối cảnh & Mục tiêu
Trong môi trường giáo dục đại học và phát triển kỹ năng nghề nghiệp, việc sinh viên tìm kiếm được người hướng dẫn (Mentor) phù hợp về mặt chuyên môn và linh hoạt về thời gian là một nhu cầu rất lớn. **Mentor-Mentee Connector (MMC)** được xây dựng nhằm giải quyết bài toán kết nối 1-1 giữa người học (Mentee) và các chuyên gia/cố vấn (Mentor) có kinh nghiệm thực chiến.

### 1.2. Tầm nhìn dài hạn của Phân hệ 5
- **Thuật toán ghép cặp thông minh (Smart AI Matching):** Phân tích khoảng trống kỹ năng của người học, mục tiêu học tập và lịch rảnh để gợi ý cố vấn tối ưu (được thể hiện qua hàm stub `calculateMatchScore` trong `js/utils.js`).
- **Phòng học trực tuyến tích hợp (Integrated Virtual Classroom):** Tích hợp WebRTC video call độ trễ thấp, chia sẻ màn hình, bảng vẽ cộng tác (Whiteboard) và ghi chú tương tác thời gian thực.
- **Quy chuẩn đánh giá năng lực 360 độ:** Hệ thống đánh giá đa chiều (Chuyên môn, Giao tiếp, Đúng giờ, Hữu ích) từ cả người học, đồng nghiệp và các cố vấn khác trong cộng đồng.

### 1.3. Phạm vi phiên bản báo cáo này
- **Front-end thuần hoàn chỉnh:** 100% không dùng thư viện ngoài (không Bootstrap, Tailwind, jQuery, React, Vue...), không cần Node.js hay server trung gian.
- **Dữ liệu mẫu thực tế:** Tích hợp sẵn 12 cố vấn chuyên môn cao cấp đa dạng lĩnh vực với tên người Việt thực tế, lịch rảnh 7 ngày tới, đánh giá 360 độ và người học mặc định (*Nguyễn Minh Anh*).
- **Lưu trữ dữ liệu:** Quản lý lịch hẹn hoàn toàn bằng `localStorage` với cơ chế bọc `try/catch` an toàn và tự động nạp 2 lịch hẹn mẫu sắp tới trong lần chạy đầu tiên.

---

## 2. HƯỚNG DẪN CÁCH CHẠY DỰ ÁN

Hệ thống được thiết kế tối ưu để có thể chạy ngay lập tức trên mọi máy tính:
1. **Cách 1 (Đơn giản nhất):** Bấm đúp chuột (Double-click) trực tiếp vào file `index.html` trong thư mục `mentor-mentee-connector/`.
2. **Cách 2:** Kéo và thả file `index.html` vào bất kỳ trình duyệt web hiện đại nào (Chrome, Edge, Firefox, Safari, Brave...).
3. **Cách 3:** Mở qua tiện ích Live Server trong VS Code nếu muốn trải nghiệm chế độ hot-reload.

> **Lưu ý kỹ thuật:** Nhờ loại bỏ hoàn toàn `<script type="module">` và không dùng `fetch()` đọc file JSON cục bộ (vốn bị trình duyệt chặn do chính sách CORS trên giao thức `file://`), bạn hoàn toàn có thể mở trực tiếp mà không gặp bất kỳ lỗi Console nào!

---

## 3. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
mentor-mentee-connector/
├── index.html              # Trang chủ: Tìm kiếm cố vấn, lọc kỹ năng chip, sắp xếp, lộ trình
├── mentor-profile.html     # Hồ sơ Cố vấn: Thông tin 360°, chọn slot lịch rảnh, form đặt lịch 1-1
├── my-bookings.html        # Quản lý lịch hẹn: Thống kê, tab Sắp tới/Lịch sử, vào phòng học, hủy lịch
├── README.md               # Tài liệu thuyết minh báo cáo và hướng dẫn demo
├── images/
│   └── avatars/            # Thư mục chứa ảnh đại diện tự thêm (<id>.jpg)
├── css/
│   └── style.css           # Toàn bộ CSS: CSS Variables, Reset, BEM, Flexbox toàn diện, Responsive
└── js/
    ├── data.js             # Dữ liệu mẫu: MENTEE, SKILLS, 12 MENTORS (có trường avatar), TAKEN_SLOTS
    ├── utils.js            # Tiện ích: Avatar ảnh + fallback gradient (addEventListener), ngày giờ, XSS
    ├── storage.js          # Tầng truy xuất dữ liệu: CRUD bookings, kiểm tra 5 bước đặt lịch, match stub
    ├── common.js           # Xử lý dùng chung: Navbar, Badge đếm lịch sắp tới, Toast, Accessible Modal
    ├── home.js             # Logic Trang chủ: Tìm kiếm real-time debounce, chip kỹ năng, sắp xếp
    ├── profile.js          # Logic Hồ sơ: Tab 7 ngày, 4 trạng thái slot, validate đặt lịch chống đúp
    └── bookings.js         # Logic Lịch hẹn: Thống kê, phân loại Sắp tới/Lịch sử, hủy lịch, reset mẫu
```

**Thứ tự nạp script bắt buộc ở các trang HTML:**
`data.js` → `utils.js` → `storage.js` → `common.js` → File logic riêng của trang (`home.js` / `profile.js` / `bookings.js`).

---

## 4. BẢNG ĐỐI CHIẾU YÊU CẦU HỌC PHẦN & TÍNH NĂNG ĐÁP ỨNG

| STT | Yêu cầu của học phần / Đề bài | File & Chức năng đáp ứng cụ thể | Đánh giá đạt chuẩn |
|---|---|---|---|
| **1** | Chạy được trực tiếp qua giao thức `file://` | Toàn bộ các file `.html` nạp script thường, không dùng module, không dùng `fetch()` đọc file cục bộ | **100% Đạt** |
| **2** | Không thư viện/framework, HTML5 ngữ nghĩa | Dùng `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `form`, `label`, `button`, `time`. Tiếng Việt có dấu | **100% Đạt** |
| **3** | CSS3 Flexbox toàn bộ bố cục | Dùng Flexbox (`flex-wrap`, `gap`, `justify-content`, `align-items`) cho: Danh sách thẻ Cố vấn, Nhãn kỹ năng (Skill Tags), Lịch rảnh (Slots), Thanh điều hướng, Thống kê | **100% Đạt** |
| **4** | CSS Variables, không dùng style inline | Định nghĩa đầy đủ token màu, spacing, radius, shadow tại `:root` trong `css/style.css`, chuẩn BEM | **100% Đạt** |
| **5** | Lưu trữ bằng `localStorage` (key: `mmc_bookings`) | `js/storage.js` bọc `try/catch`, fallback bộ nhớ nếu bị chặn. Tự nạp 2 lịch hẹn mẫu sắp tới trong lần đầu chạy | **100% Đạt** |
| **6** | Không dùng `alert()`, `confirm()`, `prompt()` | `js/common.js` xây dựng hệ thống `showToast` có `aria-live` và Modal `showConfirmModal` có Focus Trap, phím Escape | **100% Đạt** |
| **7** | Avatar CSS thuần không dùng ảnh ngoài/CDN | `MMC.utils.renderAvatarHTML` tạo hình tròn gradient kết hợp chữ cái viết tắt của tên người Việt (TN, KQ, MB...) | **100% Đạt** |
| **8** | Xử lý ngày giờ theo giờ địa phương | `MMC.utils.formatDateLocal` tự ghép năm-tháng-ngày theo giờ máy; không dùng `toISOString()` tránh lệch múi giờ UTC+7 | **100% Đạt** |
| **9** | Chống tấn công XSS | `MMC.utils.escapeHTML` xử lý mọi nội dung nhập từ người dùng trước khi hiển thị | **100% Đạt** |
| **10** | Tìm kiếm từ khóa không dấu & bộ lọc chip | `js/home.js`: Chuẩn hóa NFD bỏ dấu tiếng Việt, tìm real-time debounce 250ms trên tên, chức danh, bio, kỹ năng; kết hợp AND với chip | **100% Đạt** |
| **11** | Đánh giá 360 độ | Hồ sơ hiển thị điểm trung bình và 4 thanh tiến trình: Chuyên môn, Giao tiếp, Đúng giờ, Hữu ích + danh sách reviews đa chiều | **100% Đạt** |
| **12** | Lịch rảnh 7 ngày & 4 trạng thái slot | Tab 7 ngày tới, mỗi slot 60 phút có 4 trạng thái: Còn trống, Đang chọn, Đã kín (gạch ngang/disabled), Đã qua (disabled) kèm legend | **100% Đạt** |
| **13** | Kiểm tra 5 bước đặt lịch nghiêm ngặt | `js/profile.js` & `js/storage.js`: 1) Đã chọn slot; 2) Chủ đề 5-100 ký tự; 3) Slot chưa qua; 4) Slot chưa bị đặt; 5) Không trùng lịch khác của học viên | **100% Đạt** |
| **14** | Chống đúp khi đặt lịch (Anti-double submit) | Vô hiệu hóa nút trong lúc xử lý, giải phóng trạng thái an toàn | **100% Đạt** |
| **15** | Quản lý lịch hẹn & tự động chuyển trạng thái | `js/bookings.js`: Sắp xếp theo thời gian, tính đếm ngược tương đối, booking đã qua giờ kết thúc tự động hiển thị "Đã hoàn thành" ở tab Lịch sử | **100% Đạt** |
| **16** | Hủy lịch giải phóng slot tức thì | Khi hủy lịch hẹn, slot tương ứng trên trang hồ sơ lập tức mở lại trạng thái "Còn trống" | **100% Đạt** |
| **17** | Nút "Đặt lại dữ liệu mẫu" | Ở trang Quản lý lịch hẹn có nút khôi phục dữ liệu mẫu kèm modal xác nhận | **100% Đạt** |
| **18** | Thể hiện tầm nhìn dài hạn | 3 bước "Cách hoạt động", Roadmap ở Footer, hàm stub thuật toán `calculateMatchScore`, modal phòng học ảo demo | **100% Đạt** |

---

## 5. KỊCH BẢN DEMO BÁO CÁO GỢI Ý (5 BƯỚC)

Để buổi báo cáo hoặc thuyết trình đồ án diễn ra mạch lạc, sinh viên có thể thực hiện theo kịch bản mẫu sau:

### 🔹 Bước 1: Giới thiệu Trang chủ & Trải nghiệm Tìm kiếm / Lọc (index.html)
- Mở file `index.html`. Giới thiệu cấu trúc giao diện sạch sẽ, thân thiện, thanh điều hướng có Badge báo số lịch hẹn sắp tới.
- Trình bày điểm nhấn tầm nhìn 1: "Cách hoạt động 3 bước" và Khối "Lộ trình phát triển" ở cuối trang.
- Thử nghiệm tìm kiếm không dấu: Gõ `"thuyet trinh"` vào ô tìm kiếm -> Hệ thống lọc tức thì ra các mentor có kỹ năng hoặc chức danh thuyết trình (chữ được tô sáng nổi bật).
- Chọn thử chip `"Lập trình Web"` hoặc sắp xếp `"Đánh giá cao nhất"` / `"Tên A-Z"` để chứng minh khả năng kết hợp điều kiện AND.
- Thử gõ từ khóa vô nghĩa như `"xyz123"` -> Giao diện hiển thị Empty State lịch sự cùng nút *"Đặt lại bộ lọc"*. Bấm nút để khôi phục danh sách.

### 🔹 Bước 2: Khám phá Hồ sơ Cố vấn & Đánh giá 360° (mentor-profile.html)
- Bấm vào nút *"Xem hồ sơ & Đặt lịch"* của cố vấn đầu tiên (ví dụ: **Trần Hoàng Nam**).
- Chỉ ra bố cục 2 cột bằng Flexbox (cột phải Sticky trên Desktop, tự động xếp dọc trên Mobile).
- Trình bày khối **Đánh giá 360°**: 4 thanh tiến trình trực quan (Chuyên môn 5.0, Giao tiếp 4.8, Đúng giờ 4.9, Hữu ích 5.0) cùng các nhận xét từ Người học, Đồng nghiệp và Mentor khác.

### 🔹 Bước 3: Kiểm tra Khung giờ rảnh (Availability Slots) & Quy trình Đặt lịch 5 bước
- Quan sát hàng tab 7 ngày tới (được đánh dấu "Hôm nay", "Ngày mai").
- Nhấn chọn các ngày khác nhau để thấy các khung giờ thay đổi linh hoạt.
- Giải thích 4 trạng thái khung giờ:
  1. **Còn trống (⚡):** Có thể bấm chọn.
  2. **Đang chọn (✔):** Đổi màu tím chủ đạo, hiển thị tóm tắt sang cột đặt lịch.
  3. **Đã kín (🔒):** Chữ gạch ngang, nhãn "Đã đặt", nút bị vô hiệu hóa (disabled).
  4. **Đã qua (⏰):** Các giờ trong ngày hôm nay đã trôi qua so với giờ máy tính, không thể chọn.
- Thử nghiệm các ca kiểm tra lỗi (Validation):
  - Không chọn slot mà bấm *"Xác nhận đặt lịch"* -> Báo lỗi inline yêu cầu chọn slot.
  - Chọn slot nhưng nhập chủ đề dưới 5 ký tự -> Báo lỗi inline yêu cầu từ 5 đến 100 ký tự kèm bộ đếm ký tự.
- Nhập chủ đề hợp lệ (ví dụ: *"Nhờ anh review CV và cấu trúc dự án React"*). Bấm *"Xác nhận đặt lịch"*.
- Modal chúc mừng hiện ra với thông tin chi tiết và link phòng học demo. Slot vừa đặt trên màn hình lập tức chuyển sang trạng thái **"Đã kín"**. Số lượng lịch trên Badge ở Navbar tự động tăng thêm 1.

### 🔹 Bước 4: Kiểm tra chống trùng lịch (Mentee Conflict)
- Vẫn tại khung giờ đó hoặc thử chọn lại đúng ngày/giờ vừa đặt ở cố vấn khác.
- Thử đặt tiếp -> Hệ thống sẽ báo lỗi inline ngay lập tức: *"Bạn đã có lịch hẹn khác vào khung giờ này. Vui lòng chọn khung giờ không bị trùng lịch."*

### 🔹 Bước 5: Quản lý Lịch hẹn & Hủy lịch giải phóng slot (my-bookings.html)
- Bấm vào tab *"Lịch hẹn của tôi"* trên thanh điều hướng.
- Xem 3 thẻ thống kê (Buổi sắp tới, Tổng số giờ đã đặt, Số cố vấn đã kết nối).
- Thấy lịch hẹn vừa tạo xuất hiện ở tab *"Sắp tới"* với dòng đếm ngược sinh động (ví dụ: *"Ngày mai, lúc 19:00"* hoặc *"Hôm nay, còn khoảng X giờ"*).
- Bấm nút **"Vào phòng học"** -> Modal giới thiệu tính năng phòng học trực tuyến mô phỏng mở ra, có nút sao chép link.
- Bấm nút **"Hủy lịch hẹn"** -> Hộp thoại xác nhận tùy biến (không dùng confirm) hiện ra. Bấm *"Đồng ý hủy"*.
- Lịch chuyển sang tab *"Lịch sử"*, thông báo toast báo thành công, badge navbar giảm đi 1.
- Quay lại trang Hồ sơ của cố vấn đó: Khung giờ vừa hủy đã được **giải phóng** và hiển thị lại ở trạng thái *"Còn trống"* có thể đặt lại!
- Cuối cùng, thử bấm nút *"Đặt lại dữ liệu mẫu"* để chứng minh tính năng khôi phục nhanh khi demo.

---

## 6. HẠN CHẾ CỦA PHIÊN BẢN & HƯỚNG PHÁT TRIỂN

| Hạng mục | Phiên bản hiện tại (Demo học phần) | Hướng phát triển trong tương lai |
|---|---|---|
| **Lưu trữ** | `localStorage` trình duyệt máy khách | RESTful API / GraphQL kết nối cơ sở dữ liệu PostgreSQL & Redis |
| **Xác thực** | Người học mặc định (*Nguyễn Minh Anh*) | Đăng nhập SSO (Google, Microsoft, VNU/HCMUT Portal) phân quyền Mentor/Mentee |
| **Ghép cặp** | Tìm kiếm từ khóa và lọc chip kỹ năng | Thuật toán Machine Learning (TF-IDF, Cosine Similarity) phân tích CV và mục tiêu |
| **Phòng học** | Đường dẫn mô phỏng | WebRTC video call 1-1, bảng vẽ trực tuyến (Canvas Whiteboard), ghi âm buổi học |
| **Thông báo** | Toast giao diện nội bộ | Gửi email nhắc hẹn tự động, đồng bộ Google Calendar / Outlook Calendar |

---

## 8. HƯỚNG DẪN THAY VÀ THÊM ẢNH ĐẠI DIỆN (AVATAR)

Hệ thống hỗ trợ hiển thị ảnh đại diện tự chọn cho từng cố vấn với cơ chế fallback tự động thông minh:
- **Nếu có ảnh:** Hiển thị ảnh chân dung bo tròn, tự căn chỉnh tỷ lệ (`object-fit: cover`, `object-position: center top`).
- **Nếu chưa có ảnh hoặc file ảnh lỗi:** Tự động bắt sự kiện `error` (qua `addEventListener("error")`, hoàn toàn không dùng inline `onerror`) để hiển thị avatar gradient kèm chữ cái viết tắt của tên mà không gây giật layout (CLS = 0).

### 8.1. Thư mục đặt ảnh
Toàn bộ ảnh đại diện được đặt trong thư mục:
```text
mentor-mentee-connector/images/avatars/
```

### 8.2. Danh sách đối chiếu: ID Cố vấn → Tên file ảnh cần đặt

| STT | ID Cố vấn | Tên file cần đặt | Họ tên Cố vấn | Chức danh / Lĩnh vực |
|---|---|---|---|---|
| 1 | `m1` | `m1.jpg` | Trần Hoàng Nam | Senior Frontend Engineer @ FPT Software |
| 2 | `m2` | `m2.jpg` | Lê Thị Thảo Trang | Lead Data Scientist @ Viettel AI Lab |
| 3 | `m3` | `m3.jpg` | Phạm Minh Khoa | Senior Product Designer @ MoMo FinTech |
| 4 | `m4` | `m4.jpg` | Đặng Thùy Dương | Academic Director & IELTS 8.5 Master Coach |
| 5 | `m5` | `m5.jpg` | Nguyễn Đức Huy | Engineering Manager & Cloud Architect @ VNG |
| 6 | `m6` | `m6.jpg` | Vũ Mai Phương | Digital Growth & MarTech Consultant @ Ogilvy |
| 7 | `m7` | `m7.jpg` | Hoàng Bích Ngọc | HR Director & Career Coach @ Talentnet Group |
| 8 | `m8` | `m8.jpg` | Đỗ Quang Hưng | AI Research Scientist @ VinAI Research |
| 9 | `m9` | `m9.jpg` | Bùi Tấn Phát | Full-Stack Web Architect @ Shopee Vietnam |
| 10 | `m10` | `m10.jpg` | Trịnh Quốc Bảo | Senior Product Manager @ ZaloPay |
| 11 | `m11` | `m11.jpg` | Ngô Quỳnh Chi | Data Analytics Consultant @ PwC Vietnam |
| 12 | `m12` | `m12.jpg` | Phan Gia Huy | DevOps Lead @ Techcom Securities |
| * | `me` | `me.jpg` | Nguyễn Minh Anh | Người học mặc định (Mentee) |

> 💡 **Mẹo:** Bạn có thể dùng bất kỳ ảnh chân dung nào (định dạng JPG hoặc PNG). Nếu dùng đuôi `.png`, chỉ cần vào file `js/data.js` sửa đuôi file tương ứng (ví dụ: `"images/avatars/m1.png"`).

---

## 9. KẾT LUẬN
Sản phẩm đáp ứng trọn vẹn 100% các tiêu chí kỹ thuật và nghiệp vụ được yêu cầu, chứng minh năng lực thiết kế giao diện hiện đại (UI/UX), tư duy cấu trúc code sạch (Clean Code), khả năng xử lý dữ liệu chặt chẽ và khả năng tương thích cao nhất trên mọi trình duyệt mà không phụ thuộc vào bất kỳ thư viện bên thứ ba nào.
