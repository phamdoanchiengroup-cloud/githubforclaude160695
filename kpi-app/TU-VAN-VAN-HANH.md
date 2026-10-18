# Tư vấn vận hành / dễ dùng / động viên / đào tạo (18/10)

Bốn chuyên gia (vai trò trong `.claude/agents/`) đọc mã và đề xuất. Các điểm chính đã đối chiếu lại với mã. **Chưa làm mục nào.** Mục có dấu ⚖ là chính sách, chủ dự án phải quyết trước.

## A. Vận hành / KPI
- [ ] A1. **Định mức theo kỳ hiệu lực.**
  - Hiện trạng: `duyetDeXuat` ghi đè dòng `DinhMuc`, còn `kpiThang_` tra định mức chỉ theo `MaCD`. Hệ quả: duyệt định mức mới giữa tháng thì cả tháng bị tính lại; chốt lại tháng cũ cũng ra kết quả khác.
  - Sửa: thêm dòng mới kèm `HieuLucTu`, chọn định mức theo ngày của từng dòng nhật ký (giống `trongSoKy_`).
- [ ] A2. **Vi phạm không ghi ngày bị trừ lại mỗi tháng** (điều kiện `!ng` trong `kpiThang_`).
  - Sửa: bắt buộc nhập ngày khi ghi vi phạm, và bỏ điều kiện này.
- [x] ~~A3~~ **KHÔNG LÀM** (chủ dự án 18/10: máy hỏng không tính giờ dừng để công nhân có ý thức bảo dưỡng máy; máy hỏng thì đi làm công đoạn khác). Giữ nguyên. Đề xuất cũ: **Giờ dừng có lý do** (Máy hỏng / Chờ vật tư / Đào tạo / Khác).
  - TP chọn lý do lúc duyệt. Giờ dừng trừ khỏi mẫu số, nên máy hỏng thì công nhân không bị thiệt.
  - Báo cáo tháng thêm phần nguyên nhân dừng máy.
- [ ] A4. **Bảng soát khâu duyệt cho ban điều hành:**
  - số dòng chờ duyệt quá 1 ngày;
  - % dòng TP sửa SL / lỗi;
  - % dòng nhập qua `chotCa`;
  - lấy mẫu 5% để đối chiếu.
- [ ] A5 ⚖ **Lỗi do KCS bắt mà công nhân không tự khai thì trừ nặng hơn.** KCS ghi theo ngày sản xuất.
- [ ] A6. **Báo cáo định mức lệch:** công đoạn có trung vị trên 115% hoặc dưới 80% trong 3 tháng liền.
- [ ] A7 **Chủ dự án chốt 18/10: KHÔNG TÍNH SẢN LƯỢNG TĂNG CA vào KPI** (thay cho đề xuất cũ: tính giờ tăng ca vào mẫu số). Cần xác định sản lượng nào là tăng ca – chờ chủ dự án cho biết cách ghi tăng ca hiện nay. Đề xuất cũ: **Tính giờ tăng ca vào mẫu số** (`gioCoMat_` hiện tối đa 8 giờ).
- [ ] A8. "KPI của tôi" thêm dòng "Còn N ngày chưa được duyệt, chưa tính vào KPI".
- Cách làm: chạy thử công thức mới trên 2–3 tháng đã chốt để xem bao nhiêu người đổi loại. Báo trước 1 kỳ rồi mới áp dụng; tháng đã chốt giữ nguyên.

## B. Dễ dùng cho công nhân (bố cục trang nhập giữ nguyên)
- [ ] B1. **Lưu số đang nhập dở vào máy** (`kpi_cn_nhap_<tk>`), mở lại trang thì hiện lại.
  - Nút "Tải lại trang" ở hộp hết phiên phải hỏi lại trước nếu còn số chưa gửi.
- [ ] B2. **Ô số dễ nhập hơn:**
  - chữ 16–18px, ô cao ≥ 44px;
  - `inputmode="numeric"`;
  - bỏ số 0 có sẵn, thay bằng placeholder;
  - chạm vào ô thì chọn sẵn cả số.
- [ ] B3. **Báo lỗi ngay tại ô:** viền đỏ, đưa con trỏ vào ô sai, lời báo nằm dưới ô và không tự tắt. Thêm `aria-live` cho `#toast`.
- [ ] B4 **Chủ dự án chốt 18/10: cửa cuốn đăng nhập hiện 1 lần mỗi ngày** (trên mỗi máy). Đề xuất cũ – **Cửa cuốn đăng nhập:** máy đã nhớ mã thì bỏ qua, hoặc mỗi ngày chỉ hiện 1 lần. Đổi chữ thành "Chạm để mở".
- [ ] B5 ⚖ **Đăng nhập nhanh hơn:**
  - tải dữ liệu song song với hoạt cảnh khắc tên;
  - với công nhân, rút ngắn hoặc bỏ phần khắc tên;
  - rút ngắn hoạt ảnh sau khi gửi.
- [ ] B6. **Nút và ô ngày:**
  - nút + / − cao ≥ 44px;
  - xóa dòng có Hoàn tác;
  - ô ngày không cho chọn ngày mai.
  - ⚖ Ẩn "Đặt số dòng" với công nhân.
- [ ] B7. **Hộp đọc lại trước khi gửi:** chạm ra ngoài không đóng hộp, Esc = Sửa lại, nút cao ≥ 48px.
- [ ] B8. **Mất mạng lúc đăng nhập:** báo bằng câu tiếng Việt, giữ nguyên mã đã gõ.

## C. Nhắc nhở, động viên
- [ ] C1. **Báo trước hạn nhập cho công nhân.** Trên trang nhập chỉ hiện 1 ngày gấp nhất: "Còn ngày 15/10 chưa nhập – hạn 17:00 thứ Sáu", kèm nút mở đúng ngày đó. Không dùng chữ "phạt".
- [ ] C2. **TP/PP thấy danh sách người cần nhắc** của xưởng mình trong tab Việc hôm nay, báo trước 1 ngày.
  - Không kèm lý do nghỉ (người đang nghỉ chỉ ghi "đang nghỉ – không cần nhắc").
- [ ] C3. **Chuỗi ngày gửi đều không đứt vì ngày nghỉ hợp lệ** (nghỉ dài hạn, có phép, xưởng không làm).
  - Khi chuỗi đứt, nói "Bắt đầu chuỗi mới – lần trước bạn đạt N ngày".
- [ ] C4. **Khen bằng sự thật:** 0 lỗi, gửi trong ngày, chuỗi ≥ 5 ngày. Không khen ngẫu nhiên.
- [ ] C5. **Câu nhắc cho người loại C/D** chỉ ra 1 việc cụ thể từ phần điểm yếu nhất. Bỏ các câu "hơi vất vả", "đừng nản".
- [ ] C6. **Khen cả xưởng** ("Xưởng Sơn: 96% nhập đúng hạn tuần này"). Không so với xưởng khác, không xếp hạng cá nhân công khai.
- [ ] C7. **Rhino tối đa 2 bong bóng mỗi phiên.** Bị bỏ qua 3 ngày liền thì hỏi "Rhino nói ít lại nhé?".
  - Pháo giấy chỉ bắn khi lên hạng.
  - Thứ tự ưu tiên khi nhiều thứ cùng hiện: hạn nhập > cơm trưa > Rhino > bóng đá.

## D. Đào tạo, hội nhập
- [ ] D1. **Phiếu bàn giao tài khoản in được:** họ tên, mã, mật khẩu tạm, mã QR mở web, 4 hình các bước nhập.
  - Đi cùng việc bảo mật số 3 (mật khẩu tạm ngẫu nhiên).
- [ ] D2 **Chủ dự án chốt 18/10: học việc 1 tháng** – trong tháng đầu (tính từ NgayVaoLam) không bị phạt nhập trễ. Vẫn nhắc như bình thường.
- [ ] D3 **(học việc 1 tháng, chủ dự án 18/10)** **Tháng đầu hiển thị "Học việc – đạt X% định mức"**, không xếp loại, không vào bảng so sánh.
- [ ] D4. **Danh sách 8 việc đón người mới cho HR/TP** (sheet `HoiNhap`), mục nào lấy được từ dữ liệu thì tự đánh dấu.
  - Thẻ "Người mới tuần này" ở tab Việc hôm nay.
- [ ] D5. **Bảng kỹ năng 3 mức** (Đang học / Làm được / Kèm được người khác).
  - Cảnh báo khi giao người đang học mà không có người kèm.
- [ ] D6. **Video ngắn ≤ 90 giây** (nhập sản lượng, KPI của tôi, đăng ký cơm, khi bị trả lại). Link đặt trong tab Hướng dẫn và gửi lên Zalo xưởng.
  - Chủ dự án quay video. Web chỉ gắn link.
- [ ] D7. **Rhino hướng dẫn TP/PP mới:** duyệt sản lượng, chốt ca, điểm danh.
- [ ] D8. **Thẻ định mức của tôi:** "Hôm qua bạn làm 42/50 – còn 8 nữa là đạt" (số thật).
- Lịch đón công nhân mới:
  - Ngày 1: HR giao phiếu, đứng cạnh lúc công nhân đăng nhập lần đầu.
  - Ngày 1–3: người kèm ngồi cạnh khi nhập.
  - Tuần 2–4: TP xem KPI cùng công nhân 5 phút mỗi tuần.
  - Ngày 30: TP xác nhận công nhân đã tự nhập được.
- TP mới: học 1 buổi 90 phút làm thật trên web, sau đó 2 tuần TP cũ duyệt lại song song.
