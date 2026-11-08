# -*- coding: utf-8 -*-
"""Vá Index.html – mục 41: Tổng quan mới cho riêng chủ sở hữu (08/11). Bỏ "chưa khai báo sản lượng" + "cá nhân dưới 80%";
4 ô số + sản lượng xưởng + đơn hàng + nhân lực + cần chú ý (quan-ly-van-hanh, phương án Vừa, bỏ tỷ lệ lỗi).
Chạy bằng exec() cuối tests/va-index.py (sau mục 34 hologram để bọc ngoài vDash). Kiểm thử: tests/tong-quan-web.js"""
_k41 = s.rfind('</body>')
s = s[:_k41] + '<script>\n' + io.open(os.path.join(D, 'tong-quan', 'tong-quan-web.js'), encoding='utf-8').read() + '</script>\n' + s[_k41:]
