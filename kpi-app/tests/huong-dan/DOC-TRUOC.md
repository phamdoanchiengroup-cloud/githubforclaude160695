# Tài liệu hướng dẫn tab Quy trình sản xuất + Đơn hàng (PDF)

Dựng lại (ảnh và PDF chỉ để ở scratchpad, không commit vì ảnh chụp từ bản xem thử có dữ liệu):
1. Dựng bản xem thử: `DATA=$S/dl/csdl.json DH=$S/dl/dh.json OUT=$S/xt.html GIO=... BO_HO_SO=1 TZ=Asia/Ho_Chi_Minh node kpi-app/tests/tao-ban-xem-thu.js`
2. Chụp ảnh: `mkdir -p $S/pdf/anh && F=$S/xt.html O=$S/pdf/anh node kpi-app/tests/huong-dan/chup-anh.js`
3. Chép `huong-dan.html` vào `$S/pdf/` (ảnh nằm ở `$S/pdf/anh/`), rồi
   `H=$S/pdf/huong-dan.html O=$S/pdf/Huong-dan-Quy-trinh-va-Don-hang.pdf node kpi-app/tests/huong-dan/xuat-pdf.js`
Web đổi thì sửa nội dung trong `huong-dan.html` cho khớp.
