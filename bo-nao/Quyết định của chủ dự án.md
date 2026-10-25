# Quyết định của chủ dự án

Nhóm: Chung · Cập nhật 21/10/2026
Liên quan: [[Việc chờ chủ dự án]] · [[KPI Demo đã bỏ]] · [[00 Mục lục]]

Những điều đã chốt. Đừng đề xuất lại những gì ghi "không cần" / "không làm".

## Cách làm việc
- **Mỗi dự án một nhánh** (21/10, thay quyết định "một nhánh" trước đó cùng ngày): web KPI = `claude/beautiful-ptolemy-f2j7za`, Thiên Cơ Các = `claude/happy-brown-lttkz3`. Hai dự án không liên quan nhau, mỗi nhánh có CLAUDE.md và bộ não riêng.
- Phần nào xong và đã kiểm tra thì gửi trước, không chờ xong hết (19/10).
- **Claude giúp, không giao thêm việc** (25/10): nghĩ kỹ phương án, ưu tiên cách Claude tự làm được, đưa 2–3 đề xuất có so sánh + khuyến nghị; chỉ nhờ chủ dự án khi không còn cách khác (đã ghi vào CLAUDE.md).
- **Luôn hỏi để làm rõ yêu cầu trước khi hành động** và **luôn dùng vai chuyên gia Agency Agents** cho mỗi việc (25/10, đã ghi vào CLAUDE.md). – [[Công cụ Claude]]
- Bản bảo mật + vận hành: đợi sửa xong hết mới dán một lần (18/10).
- Bộ não thứ hai: thư mục `bo-nao/` + trang bản đồ xem bằng trình duyệt (21/10), mỗi nhánh một bộ.
- Plugin: không bật `claude-mem-cowork` (gửi dữ liệu lên cmem.ai). – [[Công cụ Claude]]

## Định mức (21/10)
- **Đổi định mức là áp cho cả tháng đang làm**: toàn bộ sản lượng tháng đó tính theo định mức mới (thay cách áp theo ngày của bản 18/10). **Kể cả tháng đã chốt**. (22/10: Bảng KPI tháng đang làm luôn tính trực tiếp nên không cần Chốt bù.) – [[KPI Phân tích định mức]]
- **Mốc định mức (22/10 tối): người khá (top 25%) đạt 90%**, gộp 3 tháng gần nhất, bỏ người đột biến (> 1,5 × người khá) và người mới (tài khoản / vào làm trong 2 tháng). Công đoạn 2–3 người vẫn gợi ý (không dùng ngưỡng 5 người). Không thêm mã "giờ không sản xuất". Trước đó: trung vị 85%, không tính người học việc (22/10). Không phân công đoạn "chính / phụ" – công đoạn nào cũng là chính (22/10). – [[KPI Phân tích định mức]]
- Phân tích định mức chỉ gợi ý **nâng** định mức lỏng về mốc 85%. **Không gợi ý hạ** định mức chặt – có thể đang đào tạo nhân viên mới (chủ dự án đã nói từ trước, nhắc lại 21/10). – [[KPI Phân tích định mức]]

## Xếp loại (22/10)
- Thang mới: **S ≥ 95, A+ ≥ 90, A ≥ 85, B ≥ 80, C ≥ 70, D < 70**. – [[KPI Thang xếp loại]]

- **Không dùng trần hiệu suất sản lượng** để ép người giỏi về 90–95% (22/10: "người ta làm được nhiều thật thì phải được ghi nhận"). Giữ `TranKPI` = 500; muốn người giỏi nhất quanh 90–95% thì chỉnh bằng định mức. – [[KPI Phân tích định mức]]

## Hồ sơ nhân viên (22/10)
- Đăng nhập mà hồ sơ thiếu thì phải điền đủ mới dùng tiếp. **Không bắt buộc: chủ sở hữu, ban điều hành, tài khoản nhóm báo cơm tổng (dùng chung), bếp; mọi tài khoản còn lại đều bắt buộc.** – [[KPI Hồ sơ bắt buộc]]
- Danh sách ban điều hành & hành chính nhân sự ở tab Nhân sự: **chỉ chủ sở hữu xem**. – [[KPI Hồ sơ bắt buộc]]

## Kỹ năng (22/10)
- Chủ dự án giao: "cứ làm thứ tốt nhất, tham khảo chuyên gia". Đã chốt theo 2 chuyên gia: 4 cấp ILUO, trọng số A/B/C do BĐH đặt, cấp 3–4 BĐH xác nhận, hạn 24 tháng, điểm chỉ mô phỏng – chưa gắn lương. – [[KPI Kỹ năng]]
- Quy tắc làm việc mới: sau mỗi lần sửa phải rà lại toàn bộ logic code, logic hiển thị và công thức (đã ghi vào CLAUDE.md).

## Phong cách giao diện web KPI
- Hologram vũ trụ **chỉ cho tài khoản chủ sở hữu**, cả web + Tổng quan "Đài quan sát KPI", chuyển động mặc định bật, có nút tắt (23/10). Các tài khoản khác giữ giao diện cũ. – [[KPI Hologram chủ sở hữu]]
- Thích kiểu **thiết bị đo nhà máy**; chê bộ 3D "như đồ chơi", 7 mẫu đầu demo-2, demo-4 (trừ số 5), demo-5, demo tương tác và giao diện nền. Hướng hiện tại: làm lại đúng màn hình đang dùng, đặt bản cũ cạnh bản mới. – [[KPI Demo giao diện]]
- Bỏ qua demo 3D CSS (08/10). – [[KPI Demo đã bỏ]]
- Màn đăng nhập: chọn **Khắc laser** (09/10); hiệu ứng đợt 2 chọn A1, 2, 4, 5, 6 (bỏ "giữ để vào ca") + toàn bộ B; mọi hiệu ứng phải chạy trên điện thoại. – [[KPI Màn đăng nhập Khắc laser]]
- Giữ nguyên trang công nhân nhập sản lượng (mục 7, 8) và điểm danh (mục 11). – [[KPI Thao tác và hiệu ứng bên trong]]
- Nhân vật: thay Mai bằng tê giác **Rhino mẫu 3B** (cơ Retro, 11/10); bản SVG tê giác tự vẽ bị chê xấu. – [[KPI Rhino]]
- Âm thanh: bộ "HUD phi thuyền" + giọng nữ, **mặc định bật**; nút ở cuối menu, không đặt đầu trang (18/10). – [[KPI Âm thanh và giọng Rhino]]

## Sơ đồ nhà máy
- Không cần nút "Ảnh như thật". Bỏ xem 3D trên điện thoại (13/10). Kính nhìn xuyên chỉ làm cho tòa điều hành, không làm xưởng (17/10). – [[KPI Sơ đồ nhà máy 3D]]
- Xoay khối xưởng 180° (thang máy + WC phía kho phụ); P. khuôn T1 thuộc xưởng Phôi Carbon (11/10).

## Cơm trưa
- **Không cần** (13/10): đối chiếu điểm danh, suất phát sinh sau khóa, suất khách/người chưa có tài khoản, "không ăn cho cả xưởng", cá nhân đổi nơi ăn, cảnh báo bếp sửa món, giới hạn món thay, suất chay.
- Chỉ trưởng phòng ăn cùng ban điều hành; HR và QC không tính suất; phạm vi đăng ký hộ: TP/PP xưởng mình, ADMIN + TL khối văn phòng (11/10). – [[KPI Cơm trưa]]

## Ảnh và giao diện (24/10)
- Ảnh nặng để trên Google Drive (thư mục "KPI – Ảnh web", chia sẻ bằng link), không nhúng vào file. – [[KPI Ảnh trên Google Drive]]
- Tab Sơ đồ nhà máy không hiện KPI / sĩ số (xem ở tab khác); 2D dùng ảnh mặt bằng chủ dự án gửi + ảnh tách tầng. – [[KPI Sơ đồ nhà máy 3D]]
- Màn đăng nhập: nền ảnh tòa nhà ban đêm + thẻ nhân viên vân carbon được laser khắc mã. Ghép ảnh ngọn cơ chụp lên nền đêm: chê xấu, không dùng. – [[KPI Màn đăng nhập Khắc laser]]

## Bóng đá
- Không làm tab riêng, chỉ dải thông báo; hiện từ 7 ngày trước trận (13/10). – [[KPI Bóng đá]]

## Bảo mật và vận hành (18/10)
- Không làm A5 (chưa có KCS), giữ ô "Đặt số dòng", không làm A3 giờ dừng, không cần video hướng dẫn; phần tăng ca đã gỡ. – [[KPI Bảo mật và vận hành]]

## KPI và định mức (25/10)
- Bỏ khoản "Không nhắc CN nhập" của TP/PP với lượt phạt trễ không có vi phạm NHAPTRE (phạt trước 15/09): chỉ trừ khi công nhân thật sự bị trừ. – [[KPI Sửa lỗi 21-10 và dữ liệu sheet]]
- Cân Phôi – Phân Loại Phôi trả về 180 (chủ dự án tự sửa trên web). **Không giới hạn** mức nâng định mức mỗi lần (bỏ đề xuất 10%/lần). – [[KPI Phân tích định mức]]
- Người SL 0 cả tháng (Bùi Hoàng Anh, Trần Thị Thuỳ Dung, Tống Thị Mỹ Duyên, Nguyễn Thị Mai Nga) là nhân viên mới; **giữ trọng số** SL 70 / CL 20 / TT 5 / AT 5. – [[KPI Soát đổi định mức 22-10]]
- Video giới thiệu từ tư liệu Rhino: **tự dựng** (ffmpeg + hoạt ảnh), không dùng video AI tốn credit. – [[KPI Màn đăng nhập demo chờ duyệt]]
