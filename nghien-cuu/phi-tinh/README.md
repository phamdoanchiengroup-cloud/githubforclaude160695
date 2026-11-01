# Nghiên cứu Tứ Hóa Phi Tinh (Bắc phái) – nguồn để sinh `tuvi-app/TuViPhiTinh.gs`

Thư mục này **không đẩy lên Apps Script** (bộ clasp chỉ đẩy file trong `tuvi-app/`). Chuyển từ thư mục nháp phiên lên nhánh ngày 1/11/2026 để phiên sau làm tiếp. Ghi chú bộ não: `bo-nao/Thiên Cơ Các/TCC Tứ Hóa Phi Tinh.md`.

| File | Nội dung |
|---|---|
| `tong-quan.md` | Tổng quan trường phái, kỹ thuật, nguồn S1–S30 |
| `quy-tac.json` | Quy tắc máy đọc: bảng Tứ Hóa phái Phi Tinh, luận mẫu phi hóa từng cung, mẫu Kỵ có tên, nguồn |
| `van.json` | Văn hai tầng (khuôn) dùng trong tab hiện tại |
| `gen/vo.js` | Phần hàm JS của TuViPhiTinh.gs (ptNguyenCuc_, ptMau_, ptCung_, ptTang_, ptLap_, phiTinhLuan) |
| `gen/bai.js`, `gen/cong-thuc.js` | Bộ dựng bài luận theo mục lục Bắc phái (`ptBai_`), Mệnh tháng Đẩu quân, Nghịch/Thuận thủy Kỵ |
| `gen/dung.py` | Ghép tất cả thành file .gs (kèm kho `PT_KHO` từ catalog.json + tong-hop/bo-sung.json) |
| `cong-thuc-bo-sung.md` | Kết quả tìm công thức trên internet (1/11): mức chắc chắn từng mục |
| `tong-hop/catalog.json` | **Kho luận giải tổng hợp** từ 4 bài luận Bắc phái mẫu của tuvi.cohoc.net (viết lại bằng lời mới, bỏ ý trùng, không dữ liệu cá nhân): `mucLuc` 18 phần theo mục lục cohoc, `dinhNghia` 42 khái niệm, `luan` 518 khóa / 606 ý (mỗi ý: `nguon`, `ky` tầng chuyên môn, `de` tầng dễ hiểu, `muc` cat/hung/trung) |
| `tong-hop/README.md` | Cấu trúc và cách đặt tên khóa của catalog |

## Sinh lại TuViPhiTinh.gs
```
cd nghien-cuu/phi-tinh && python3 gen/dung.py ../../tuvi-app/TuViPhiTinh.gs
cd ../../tuvi-app && node tests/phi-tinh.js && python3 tools/tao-ds-file.py && node tests/cai-dat.js
```
(1/11: chạy lệnh trên ra file giống hệt bản đang dùng.)

## Việc tiếp theo (đã làm 1/11 – xem ghi chú bộ não; còn lại: cung khí, xí hoa nếu chủ dự án đồng ý dùng giả thuyết)
Dựng lại tab ✶ Phi Tinh **theo mục lục cohoc** (chủ dự án chốt 1/11) dùng `tong-hop/catalog.json`: Tổng quan → cung Mệnh, Thân, 11 cung → 12 đại vận (thông tin, tứ hóa nhập xuất, phi hóa tha–ngã, M chất, hồi quy tam hợp, tổng luận 12 chủ đề) → vận năm (Thể–Dụng, mức *–****) → vận tháng ×12 + kết luận → phụ lục. Tra khóa cụ thể trước, không có thì lùi về khóa `*`. Mỗi đoạn: lời dễ hiểu + "Căn cứ Phi Tinh". Những điểm chưa xác định (công thức điểm xí hoa, Thiên–Địa–Nhân của can Quý, Thuận/Nghịch thủy Kỵ…) xem cuối `tong-hop/README.md` – đừng bịa, ghi là tham khảo hoặc bỏ.
Bài cohoc **đúng** của con gái (âm 8/7 Quý Mão, giờ Tý): https://tuvi.cohoc.net/bac-phai-la-so-tu-vi-nam-quy-mao-thang-7-ngay-8-gio-ti-am-nu-lid-403265.html – chưa trích (bài lid-403261 là ngày 7/7, chỉ dùng làm quy tắc chung). Không vượt trang chống bot, không chép nguyên văn.
