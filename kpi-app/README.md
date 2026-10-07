# Web app KPI sản xuất (Apps Script)

Dự án riêng, **không liên quan** tới `tuvi-app/`.

## Các file

| File | Vai trò |
|---|---|
| `Code.gs` | Mã máy chủ, là bản đã vá. Dán vào Apps Script |
| `Index.html` | Giao diện, là bản đã vá. Dán vào Apps Script |
| `goc/` | Bản gốc chủ dự án gửi ngày 28/09/2026 (đã đổi xuống dòng CRLF sang LF). Dùng làm gốc khi gộp 3 chiều |
| `HUONG-DAN-CAP-NHAT.md` | Các bước dán mã và chạy hàm một lần, viết cho chủ dự án |
| `xem-thu-dang-nhap.html` | Bản xem thử màn đăng nhập "Precision". Sinh bằng `tests/tao-xem-thu.py`. Gõ mật khẩu `demo` để xem hiệu ứng đăng nhập đúng |
| `tests/dang-nhap-bi-a.html` | Nguồn duy nhất của màn đăng nhập (gồm 3 đoạn CSS / HTML / JS). `va-index.py` chèn vào Index.html, `tao-xem-thu.py` dựng bản xem thử |
| `tests/va-code.py`, `tests/va-index.py` | Tạo `Code.gs` / `Index.html` từ `goc/` bằng các lần thay có kiểm tra (mỗi chuỗi gốc phải khớp đúng số lần) |
| `tests/ham-chay-tay.gs` | Các hàm chạy tay (kiểm tra, sửa ngày sai, ngày lễ…), được nối vào cuối `Code.gs` |
| `tests/toc-do.gs` | Tăng tốc, nối vào cuối `Code.gs`: bộ đệm ghi `suaO_` → `xaGhi_`, `xong_()` cuối lượt (trong `sach_`), số phiên bản `KPI_PB` + `nho_()` (CacheService gzip, khối 90KB, 10 phút), `ganPhanDoi_` (sheet đã đổi → `phanDoi`), `napPhan`, Sheets API `batchGet` (bật bằng `KIEM_TRA_SHEETS_API`), `LUU_TRU_NHAT_KY` |
| `tests/bao-cao.gs` | Báo cáo tháng PDF, nối vào cuối `Code.gs`: `bcDuLieu_(ky)` gom một lần (KPI như `layKPIKy`, KPI quản lý, sản lượng/lỗi/công đoạn, chuyên cần, vi phạm, so tháng trước nếu tháng trước đủ dữ liệu), `bcHtmlTong_` / `bcHtmlXuong_` (chỉ bảng + màu, an toàn khi Apps Script đổi PDF), `layBaoCaoThang(token, ky, xuong, 'pdf'\|'html')` cho web (TP chỉ xưởng mình), `guiBaoCaoThang_` (Drive `Báo cáo KPI hằng tháng/<kỳ>` + email theo sheet `NguoiNhanBaoCao`), gọi sau `chotThangTuDong`; hàm chạy tay `TAO_SHEET_NGUOI_NHAN_BAO_CAO`, `GUI_BAO_CAO_THANG_TRUOC` |
| `tests/giao-dien-moi.html` | CSS + JS giao diện bên trong (menu nhóm, thanh dưới, Việc hôm nay, chỉ mục tra cứu `ix_`, 2 bộ màu xám than/sáng + nút ☀/☾, hiệu ứng: số chạy/vòng KPI `hieuUngMoi` qua MutationObserver trên `#main`, khung chờ tải `.gd-skel`, chuyển tab `sauKhiVeTab`, dấu ✓ + dòng trượt `hieuUngDuyet`, số lật `odoHTML`, vòng hạn `capNhatVongHan`, bi vào lỗ + tiếng `tiengVaoLo`, rung ô sai `rungONhap`). `va-index.py` chèn vào Index.html |
| `tests/tao-ban-xem-thu.js` | Dựng **một file HTML** chạy cả web app trong trình duyệt (Code.gs chạy trên Sheet giả), dữ liệu ẩn danh, mật khẩu `demo`. File kết quả **không** đưa vào repo |
| `tests/gia-lap-kpi.js` | Giả lập Apps Script: Sheet tự đổi chuỗi ngày như Google Sheets, khóa, cache, đồng hồ giả |
| `tests/kiem-tra.js` | 85 kiểm tra trên dữ liệu thật, có đối chứng với mã gốc (mục 10: tăng tốc) |
| `tests/bao-cao.js` | 23 kiểm tra báo cáo tháng trên dữ liệu thật: quyền, khớp số với Bảng KPI, tổng sản lượng, gửi tự động ngày làm việc thứ 3, lưu Drive, gửi lại không trùng (`DATA=… [S=<thư mục ghi HTML xem thử>]`) |
| `tests/hieu-ung.js` | 27 kiểm tra hiệu ứng (Playwright) trên bản xem thử 1 file: số chạy, vòng KPI, khung chờ tải, top 3, rung ô sai, đổi nền, duyệt ✓, số lật, bi vào lỗ, giảm chuyển động, mọi tab không lỗi |
| `tests/hieu-ung-2.js` | 13 kiểm tra đợt 2: giữ để duyệt (thả sớm không duyệt), vuốt để duyệt trên điện thoại (vuốt nửa không duyệt), quầng sáng, tia lửa, bảng lật hạng, ly nước KPI |
| `demo-2.html` | Trang demo 8 màn hình có chuyển động (số liệu mẫu, chưa gắn vào web): vòng KPI 3 thành phần, biểu đồ kéo dò, bản đồ nhà máy 3D, bảng xếp hạng tự sắp xếp, tìm nhanh Ctrl+K, duyệt có Hoàn tác 5 giây, lịch chấm công bản đồ nhiệt, đồng hồ hiệu suất kim lò xo. Kiểm tra: `tests/demo-2.js` |
| `demo-3.html` | Trang demo 8 dụng cụ đo kiểu công nghiệp cùng phong cách đồng hồ đã chọn: cụm 9 đồng hồ xưởng, bộ đếm cơ khí, tháp đèn andon, máy ghi biểu đồ chạy giấy, đồng hồ ca làm việc, cột đèn LED, núm xoay chọn kỳ, đồng hồ lật đếm ngược hạn. Kiểm tra: `tests/demo-3.js` (21 kiểm tra) |
| `mau-da-chon/dong-ho-hieu-suat.html` | Mẫu chủ dự án đã duyệt (đồng hồ hiệu suất kim lò xo, demo-2 số 8), tách riêng để gắn vào web: số thật lấy từ `phanTichDinhMuc` |
| `mau-da-chon/cum-dong-ho-xuong.html` | Mẫu đã duyệt (demo-3 số 1): cụm 9 đồng hồ hiệu suất xưởng, bấm để chọn xưởng. Số thật: hiệu suất hôm nay từng xưởng so với định mức |
| `mau-da-chon/dong-ho-lat-dem-nguoc.html` | Mẫu đã duyệt (demo-3 số 8): đồng hồ lật đếm ngược hạn điểm danh 9:00 / nhập sản lượng 17:00 / chốt tháng, giờ Việt Nam |
| `demo-4.html` | Trang demo 8 thiết bị nhà máy đợt 2: bảng lật điểm danh kiểu nhà ga, đồng hồ hai kim kế hoạch – thực tế, màn LED 7 đoạn, bảng đèn cảnh báo, thước trượt định mức công đoạn, thẻ chấm công bấm giờ, phiếu lương in nhiệt, bàn trượt mô phỏng KPI. Kiểm tra: `tests/demo-4.js` (30 kiểm tra) |
| `mau-da-chon/thuoc-truot-dinh-muc.html` | Mẫu đã duyệt (demo-4 số 5): thước trượt định mức công đoạn, kim tam giác lò xo, vạch mờ là kỳ trước. Số thật: `phanTichDinhMuc` theo kỳ |
| `demo-5.html` | Trang demo 8 thiết bị nhà máy đợt 3: thước KPI từng người (dùng lại thước trượt đã duyệt), đồng hồ áp suất tồn duyệt, sơ đồ dây chuyền tìm điểm nghẽn, máy ghi biểu đồ tròn cả tuần, ống Nixie, bảng chữ chạy LED có dấu tiếng Việt, nhiệt kế tiến độ tháng, đồng hồ VU đôi. Kiểm tra: `tests/demo-5.js` (26 kiểm tra) |
| `demo-tuong-tac.html` | Demo **thao tác nhập liệu**: điểm danh bằng chạm (giữ để chọn lý do), bàn phím sản lượng lớn có kiểm tra định mức, duyệt hàng loạt có nắp an toàn + cần gạt, kéo thả phân công vào công đoạn (tự cân bằng), biên bản vi phạm 4 bước có chữ ký trên màn hình, kéo chọn khoảng ngày. Kiểm tra: `tests/demo-tuong-tac.js` (39 kiểm tra) |
| `demo-giao-dien-nen.html` | Demo **giao diện nền** (cả khung web: menu, đầu trang, trang Việc hôm nay): 4 kiểu nền (Xám than, Bảng điều khiển, Giấy kỹ thuật sáng, Kính đêm xanh) × 3 bố cục menu (thanh bên, thanh biểu tượng, menu trên) × 2 mật độ, xem như máy tính / điện thoại. Kiểm tra: `tests/demo-giao-dien-nen.js` (17 kiểm tra) |
| `demo-duyet-san-luong.html` | Làm lại màn hình **Duyệt sản lượng** theo việc thật (có tab "Bản hiện tại" để so): máy tự gắn cờ lượt bất thường (gõ thừa số 0, nghỉ mà có sản lượng, trùng công đoạn, lỗi > 5%, chưa có định mức, nửa ngày), lượt bình thường duyệt một lần, sửa số trong dòng, hoàn tác 5 giây thay hộp xác nhận, từ chối bắt buộc lý do, phím tắt. Kiểm tra: `tests/demo-duyet-san-luong.js` (23 kiểm tra) |
| `demo-lottie.html` | Demo hoạt ảnh **Lottie** ở 4 chỗ (đang tổng hợp báo cáo, duyệt xong, đã duyệt hết, mất kết nối), mỗi chỗ đặt cạnh cách hiện tại. 4 hoạt ảnh tự vẽ trong `lottie/*.json` (4–9 KB, sinh bằng `tests/tao-lottie.py`, mở/sửa được trên lottiefiles.com); trang dựng bằng `LOTTIE=<lottie_light.min.js> python3 tests/tao-demo-lottie.py` (nhúng lottie-web MIT). Kiểm tra: `tests/demo-lottie.js` (10 kiểm tra). **Đã gắn vào web thật** (va-index.py mục 8: `LT_DATA`, `ltNap` tải lottie-web từ cdnjs khi cần, `ltPhat`, lớp phủ `ltMo/ltXong/ltDong`, `ltMatMang` khi `call()` gặp lỗi mạng, hình tĩnh `LT_TINH` khi không tải được thư viện); kiểm tra `F=<bản xem thử> LOTTIE=<lottie_light.min.js> node tests/lottie-web.js` (25 kiểm tra) |
| `demo-lottie-2.html` | Demo Lottie **đợt 2**, cùng phong cách: chốt tháng (con dấu + khóa), lưu điểm danh (5 người sáng dần, 1 người nghỉ), công nhân gửi sản lượng (phiếu vào khay + đồng hồ chờ), xuất Excel, kỳ chưa có dữ liệu (kính lúp), hết phiên đăng nhập (không tự tải lại trang). Hoạt ảnh sinh bằng `tests/tao-lottie-2.py` (hàm vẽ chung `tests/lottie_cu.py`); trang dựng chung lệnh với demo-lottie. Kiểm tra: `tests/demo-lottie-2.js` (16 kiểm tra). **Đã gắn vào web thật** (va-index.py mục 9: `ltXong(tieuDe,phu,ten,ms)`, `ltTrong`, `hetHan` mới, `napThuVien` bắt lỗi); `tests/lottie-web.js` nay 40 kiểm tra |
| `demo-lottie-3.html` | Demo Lottie **đợt 3**: trả lại sản lượng (từ chối), máy chuyển sang "Đang sửa", ghi vi phạm nề nếp, đăng ký nghỉ dài hạn, thêm nhân sự, đổi mật khẩu. Hoạt ảnh sinh bằng `tests/tao-lottie-3.py`; trang dựng chung lệnh `tests/tao-demo-lottie.py`. Kiểm tra: `tests/demo-lottie-3.js` (12 kiểm tra). **Đã gắn vào web thật** (va-index.py mục 10); `tests/lottie-web.js` nay 49 kiểm tra |
| `demo-lottie-4.html` | Demo Lottie **đợt 4**: chốt ca (thẻ vào máy chấm công), gửi đề xuất định mức (kim trên thước), miễn trừ KPI (khiên), cấp lại mật khẩu (chìa khóa; bản mới hiện mật khẩu tạm chữ to + nút Chép thay cho hộp alert), gán công đoạn cho nhiều người, thanh lý máy. Hoạt ảnh sinh bằng `tests/tao-lottie-4.py`. Kiểm tra: `tests/demo-lottie-4.js` (14 kiểm tra). Chưa gắn vào web thật |
| `demo-huong-dan-cn.html` | Demo **hướng dẫn công nhân nhập sản lượng** khi đăng nhập lần đầu: nhân vật anime "Mai" tự vẽ bằng SVG (chớp mắt, đuôi tóc đung đưa, nói, đổi nét mặt), rọi sáng từng ô trên màn "Nhập sản lượng của tôi" (mô phỏng đúng `vCNNhap`/`cnVeGrid`), 14 bước có Mai tự gõ thử; chế độ **Tự làm thử** bắt lỗi theo đúng quy tắc `cnGui` (chọn công đoạn, SL>0, lỗi ≤ SL, không trùng) + nhắc số quá lớn + đọc lại trước khi gửi; nút đọc to (speechSynthesis vi-VN); "Không hiện lại" lưu localStorage. Kiểm tra: `tests/demo-huong-dan-cn.js` (20 kiểm tra). Chưa gắn vào web thật |
| `tests/xem-truoc.js` | Chạy giao diện trên máy với máy chủ giả lập. `/phien/<tên đăng nhập>` trả mã phiên để chụp ảnh không cần mật khẩu |

## Chạy kiểm tra

Dữ liệu thật (có CCCD, SĐT) **không** đưa vào repo. Cách lấy: tải file Sheet dạng .xlsx, đổi thành JSON `{TenSheet: [[...], ...]}` (ô ngày ghi dạng `{"$d": "2026-08-25T00:00:00"}`, tính theo giờ VN).

```bash
python3 kpi-app/tests/va-code.py && python3 kpi-app/tests/va-index.py      # tạo lại bản vá từ goc/
TZ=Asia/Ho_Chi_Minh DATA=/đường/dẫn/csdl.json node kpi-app/tests/kiem-tra.js
DATA=/đường/dẫn/csdl.json node kpi-app/tests/xem-truoc.js                  # http://localhost:8787
DATA=/đường/dẫn/csdl.json OUT=/tmp/xem-thu-kpi.html node kpi-app/tests/tao-ban-xem-thu.js   # bản xem thử 1 file
```

Giao diện: mỗi lời gọi ghi trên máy chủ trả `phanDoi` (danh sách phần `nk/cc/ns/cd/mm/vp/ts/tb/dm`, hoặc `'tat'`); `call()` giữ lại để `reload()` gọi `napPhan` thay vì `napDuLieu`. Thêm sheet mới mà giao diện có dùng thì nhớ thêm vào `PHAN_CUA_SHEET_` (toc-do.gs) và phần tương ứng trong `napDuLieuLoi_`.

Phải đặt `TZ=Asia/Ho_Chi_Minh`: mã gốc dùng `getHours()` theo múi giờ máy, nên chạy ở múi giờ khác thì số liệu đối chứng sẽ lệch.

## Khi chủ dự án gửi bản tự sửa

Gộp 3 chiều bằng `git merge-file <bản-repo> goc/<file> <bản-mới-của-họ>`, rồi chép bản mới của họ vào `goc/` làm gốc cho lần sau.
