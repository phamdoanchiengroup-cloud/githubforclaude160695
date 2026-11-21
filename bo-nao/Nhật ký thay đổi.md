# Nhật ký thay đổi

Liên quan: [[00 Mục lục]] · [[Quyết định của chủ dự án]] · [[Bài học của Claude]] · [[Bàn giao phiên]] · [[Lần dán lên Apps Script]]

Mỗi lần sửa web / dữ liệu / quy tắc: **ngày · sửa gì · VÌ SAO sửa (ai yêu cầu, lỗi gì, số liệu nào) · file / hàm · kiểm thử · commit**. Mới nhất ở trên. Chủ dự án yêu cầu 18/11: "khi chúng ta sửa gì, tại sao phải sửa, cũng phải ghi vào bộ nhớ; công việc lớn cũng phải ghi lại". Chi tiết kỹ thuật dài để ở ghi chú chủ đề, ở đây chỉ 3–6 dòng mỗi mục.

## 21/11
- **Sửa Bán hàng "cứ bị hết phiên"** (Bán hàng báo). Nguyên nhân: sau đăng nhập web gọi `napComTrua` / `layBongDa` / `layKPIKy` cho mọi tài khoản → BH bị chặn ở `docPhien_` → máy chủ trả `hetHan` → web đăng xuất. Sửa: web không gọi 3 hàm đó cho BH; máy chủ: lượt bị chặn vì là BH trả `{ok:false, bhChan:1}` (`__BH_CHAN`, sach_), không còn hetHan. Bản xem thử nay đặt lại `__CHO_BH` mỗi lượt như Apps Script (trước không bắt được lỗi). Kiểm thử don-ban 70, don-ban-web 43 (+ở trang 90 giây). Commit `f757a40`.
- **Quỹ thưởng – chủ dự án duyệt việc 1, 2; việc 4 không (đã bỏ giờ dừng máy để CN có ý thức bảo trì); việc 5 giữ nguyên (sau khi TP/PP duyệt chỉ chủ sở hữu "từ chối" được dòng, không ai sửa số trên web); việc 3 chưa hiểu – giải thích lại.**
  - Việc 1: chốt KPI quản lý vào sheet `KPIQuanLyThang` khi chốt tháng (`kqlChot_`), tháng đã chốt web hiện số chốt (`kqlDocChot_`, `daChot`). Hiệu suất / tỷ lệ đạt xưởng tính cả CN đã nghỉ nếu họ CÓ nhật ký trong tháng (`kqlCoTinh_`, `dt.nhansuTatCa`).
  - **Phát hiện lỗi cũ**: `docDuLieuKPI_` bỏ người "Nghỉ việc" → chốt lại tháng cũ làm MẤT KPI người đã nghỉ (T10: 153 → 97), và bản chốt T10 cũ đã sót 11 CN làm trong T10 nhưng nghỉ trước ngày chốt. Nay chốt tính cả họ (T10 chốt lại = 162).
  - Việc 2: trần hiệu suất xưởng 130% (`KQL_TRAN_XUONG`); trần CN 150% từ 2026-11 – tự thêm 1 dòng TrongSoKPI (cờ `KQL_TRAN150`, `kqlTran150_`), T10 trở về trước giữ trần cũ 500.
  - Kiểm thử mới `kpi-ql.js` 16/16 (số thật). bo-hom-nay.js 6/7 và kiem-tra.js (khóa tài khoản) lỗi sẵn từ trước, bản chưa sửa cũng vậy.
- **Đọc phương án thưởng của HC-NS** (`Bonus_KSX_T11.2026`): quỹ 180 tr, mức CS 1.303.000, TBP 2,0/1,8 – PBP 1,5 (không theo KPI QL), NV theo loại S/A+ 1,1 · A 1,0 · B 0,8 · C 0,6 · D 0,5, toàn nhà máy (không chia theo xưởng), có Kho nhà máy, xét ngày công tối thiểu (chuyên cần theo chấm công).
- **Soạn Phiếu mô tả công việc chị Đinh Kim Loan (C067)**, Trợ lý Ban điều hành: hàng hóa – đơn hàng, Bán hàng, khách OEM, hỗ trợ Đóng gói, giấy tờ HC-NS (cùng kiểu chung chung chủ dự án duyệt; quản lý trực tiếp ghi GĐ Hán Việt Hưng – Claude tự điền). Trước đó (19–20/11): bản GĐ Hán Việt Hưng (ô quản lý trực tiếp để trống).
- **Đánh giá KPI trước khi gắn QUỸ THƯỞNG (từ tháng 12)** – hỏi `quan-ly-van-hanh`, chưa sửa web. Vì sao: chủ dự án báo từ tháng tới có quỹ thưởng theo KPI. Kết luận chính: KPI CN thực chất ≈ 0,7×HS + 29,6 (CL, tuân thủ gần như ai cũng 100); trần HS 500% vô nghĩa; tự khai + TP duyệt mà TP hưởng theo HS xưởng; Vận hành TP/PP trừ thẳng dễ về 0; KPI QL không chốt. Đề xuất: trần thưởng 130/120, chất lượng thành hệ số, Vận hành theo tỷ lệ 25% sàn 40, giờ chờ việc, chốt KPI QL, chia quỹ theo xưởng × hệ số loại (85% CN / 15% QL), chạy thử tháng 12. Chờ chủ dự án chọn việc làm ([[Việc chờ chủ dự án]]).

## 19/11
- **Soạn Phiếu mô tả công việc Ban điều hành cho chủ dự án** (Word theo mẫu công ty, không sửa web). Chủ dự án chốt: quản lý trực tiếp = GĐ Hán Việt Hưng (C019); mảng phụ trách: kế hoạch SX & đơn hàng · KPI, định mức, nhân sự SX · số hóa – web KPI · quy trình & kỹ thuật SX (cấu hình gậy phối hợp C077); công việc hằng ngày viết theo việc, không theo giờ. File ở scratchpad.
- **Xuất Excel KPI quản lý tháng 9 + 10** (không sửa web). Vì sao: chủ dự án cần sau đợt cắt giảm. Cách: KPI quản lý KHÔNG lưu sẵn (web tính lúc xem, `layKPIQuanLy`) → chạy đúng hàm web trong `gia-lap-kpi.js` trên CSDL KPI thật (nhớ đặt prop `KPI_MOC_LUU_TRU`='2026-10' để đọc nhật ký lưu trữ, không thì tháng 9 hiệu suất xưởng = 0), 2 lần: như web hiện nay và coi 63 CN đã nghỉ là còn làm.
- **Phát hiện**: Trụ 1 (hiệu suất + tỷ lệ đạt xưởng) chỉ tính CN có `TrangThai` ≠ "Nghỉ việc" HÔM NAY → KPI quản lý tháng cũ đổi sau mỗi đợt nghỉ việc (vd INUV T10: 90,3 → 96,9). Chưa sửa web – chờ chủ dự án quyết ([[Việc chờ chủ dự án]]).

## 18/11
- **Xuất Excel KPI tháng 9 + 10 cả người đã nghỉ** (không sửa web). Vì sao: tuần 12–14/11 nhà máy cắt giảm ~60 người, chủ dự án cần danh sách. Nguồn: CSDL KPI (xlsx qua Drive) – tab `KPIThang` (giữ cả người nghỉ) + `NhanSu.TrangThai` + ngày cuối có nhật ký sản xuất. 160 người, 63 đã nghỉ (48 người làm ngày cuối 12–14/11). File chỉ ở scratchpad (có tên người).
- **"Vì sao đơn này xong ngày này"** (Bán hàng: nút trên thẻ đơn; người duyệt: bấm mã đơn trong bảng dự kiến). Vì sao: chủ dự án thấy đơn Kho trễ nhiều mà không biết do đâu (#16/10 hạn sớm hơn mà xong muộn hơn). Hàm `viSaoDonBH` / `dbvTinh_`.
- **Sheet "Tóm tắt đơn hàng cho trợ lý (web)"** web tự ghi mỗi giờ. Vì sao: để Claude (và Trợ lý Zalo sau này) đọc đúng số web – cầu nối không có hủy / tạm dừng / ★. `tom-tat.gs`.
- **Đọc được Sheet "CSDL Đơn hàng (web)"** qua Drive (ghi mã file vào [[Liên kết và công cụ]]); số tồn 18/11 trừ tạm dừng ≈ 12.150 sp ([[Số liệu đơn hàng theo tuần]]).
- Kiểm thử: thu-don 70 · don-ban-web 42 · du-kien 76 · don-ban 65 · don-hang 142 · uu-tien-web 33.
- **Ghi các trả lời của chủ dự án** vào [[Quyết định của chủ dự án]]: không giới hạn đề nghị ưu tiên; chưa xử lý deadline Kho; CÓ làm "Vì sao đơn này xong ngày này"; họp Bán hàng chốt sau; POD-ECOMSTONE trống là bình thường (sửa lại ghi chú đã ghi nhầm là lỗi).
- **Thêm [[Số liệu đơn hàng theo tuần]], [[Từ điển nhà máy]], mục câu hỏi còn mở trong [[Việc chờ chủ dự án]]**. Vì sao: chủ dự án "thấy cái nào cần thì lưu lại, vì còn làm rất nhiều về web và đơn hàng" – để phiên sau hiểu ngay tên gọi, thấy xu hướng tồn và không quên việc chưa chốt.
- **Quy tắc: câu hỏi có số liệu → tải số thật trước** (CLAUDE.md). Vì sao: Claude trả lời "không có dữ liệu sống" trong khi đã có Sheet cầu nối + kết nối Google Drive; chủ dự án nhắc. Xem [[Bài học của Claude]].
- **Lập ghi chú này + [[Bài học của Claude]]**. Vì sao: chủ dự án muốn mọi thay đổi có lý do được nhớ qua các phiên.
- Giải thích (không sửa code): đơn Kho trễ 20–35 ngày là đúng toán – deadline Kho ~7.670 sp trước 10/12 trong khi làn Kho 50% ≈ 150 sp/ngày; còn nghi #16/10 (hạn sớm hơn #04/11 mà xong muộn hơn) do xếp theo dòng – chưa kiểm.

## 17/11 khuya (việc lớn)
- **Chủ sở hữu tự chia 5 làn ở ⚙ Công suất** (% · thứ tự phần dư · kênh → làn · Xem trước · nhật ký). Vì sao: chủ dự án muốn chỉnh tỷ lệ theo thực tế xưởng thay vì nhờ sửa code. Commit `3fe5b5b`. Chi tiết: [[KPI Thiết kế trang Đơn hàng và chuyển từ Sheet sang web (16-11)]] mục "17/11 KHUYA (2)".
- **Bán hàng "Thử trước khi đặt" + gửi / xử lý đề nghị ưu tiên**. Vì sao: Bán hàng hẹn khách bằng cảm giác, xin ưu tiên bằng miệng không ai thấy đơn khác lùi bao nhiêu. Đề nghị bắt tick "đã xem đơn bị lùi" (góp ý quan-ly-van-hanh). Commit `27b96da`.
- **Bộ slide họp Sản xuất – Bán hàng** (17 slide, số 16/11): https://claude.ai/artifact/UqiDkrJZfvUo7zSYyaaKhB. Vì sao: chủ dự án họp thống nhất cách hẹn khách.

## 17/11 tối (việc lớn)
- **5 làn công suất 10·20·50·5·15 + phần dư Dealer → Kho → OEM → A Đông → Lẻ**. Vì sao: Kho và Dealer tranh nhau một hàng; chủ dự án muốn Dealer có làn riêng (thống kê Dealer đặt/tháng).
- **Thử nhận đơn: chọn kênh, hẹn khách an toàn = cuối làn + 6 ngày làm** (bỏ +20%). Vì sao: chủ dự án thấy 2 ngày hẹn khó hiểu (29/12 và 27/01).
- **Tạm dừng sản xuất (mã / cả đơn)**, Sheet đơn không đổi màu; tab Đến hạn 10 ngày sang file riêng. Vì sao: chủ dự án không muốn web làm thay đổi Sheet.
- **Ngày dự kiến cho Bán hàng = mô phỏng + 2 ngày làm; kín lịch + 6 ngày làm; bảng đơn nhà máy 4 cột; khóa cột Sheet 2 bước**. Vì sao: Bán hàng cần ngày chắc chắn để hứa khách.

Mục cũ hơn: xem từng ghi chú chủ đề trong [[00 Mục lục]] (đã ghi ngày + việc), và [[Quyết định của chủ dự án]].
