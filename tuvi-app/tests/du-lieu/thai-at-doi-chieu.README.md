# thai-at-doi-chieu.json – ca đối chiếu Thái Ất

- **Nguồn:** kintaiyi (MIT) – kentang2017, bản 0.2.3 trên PyPI (https://github.com/kentang2017/kintaiyi). Phép Thái Ất Thống Tông (`taiyi_acumyear = 0`).
- File chỉ chứa **dữ liệu kết quả** (1.232 ca: Tuế kế 1900–2100 và ranh Tết/Lập xuân, Nguyệt kế 2000–2035 và ranh tháng, Thời kế 300 giờ ngẫu nhiên 1950–2050, 2 chuỗi 6 ngày đủ 72 cục dương/âm, ca sát Đông chí/Hạ chí). Không chép mã thư viện vào dự án, không đưa kintaiyi lên Apps Script.
- Sinh lại: `tools/thai-at/sinh-doi-chieu.py` (chạy trong virtualenv riêng, xem đầu file).
- Mã vị trí: 0–15 = vòng 16 ô Tý, Sửu, Cấn, Dần, Mão, Thìn, Tốn, Tỵ, Ngọ, Mùi, Khôn, Thân, Dậu, Tuất, Càn, Hợi; 16 = Trung. Số cung: 1 Càn, 2 Ly, 3 Cấn, 4 Chấn, 5 Trung, 6 Đoài, 7 Khôn, 8 Khảm, 9 Tốn.
- Trường: `T` tích, `cuc`, `don` (d/a), `ty` cung Thái Ất, `vx` Văn Xương, `tk` Thủy Kích, `ke_` Kế Thần, `hop` Hợp Thần, `tue` Thái Tuế, `dm` Định Mục, `cc/kc/dc` Chủ/Khách/Định toán, `cd/ct`, `kd/kt`, `dd/dt` đại/tham tướng, `quan/than/dan` Quân/Thần/Dân Cơ, `tu` Tứ Thần, `tat` Thiên Ất, `dat` Địa Ất, `tp` Trực Phù, `np` Ngũ Phúc, `ddu` Đại Du, `tdu` Tiểu Du, `am` [năm, tháng] âm lịch, `nhom` (chinh / ranh_nam / ranh_thang / chuoi / ranh_chi).
- Dùng ở `tests/doi-chieu-thai-at.js` (khác biệt đã biết K1–K10 ghi ở đầu file kiểm thử).

MIT License – Copyright (c) 2023–2026 kentang2017 (áp dụng cho kết quả sinh từ thư viện).
