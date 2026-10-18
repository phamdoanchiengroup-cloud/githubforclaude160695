# -*- coding: utf-8 -*-
"""Mục 17 của va-index.py (exec, chạy SAU mục 12 Mai, 14, 16): thay nhân vật Mai bằng chú tê giác Rhino (chủ dự án chốt mẫu 3B, 11/10).
   - Hình: anh/rhino-mascot/rhino-3b-nen-trong.webp (ảnh AI mẫu 3B đã cắt nền, 415×480). MAI_SVG giờ chỉ là 1 thẻ <image> đặt trong
     khung 200×270 cũ nên mọi chỗ gọi maiHinh() / MAI_SVG (góc màn hình, dải khẩu hiệu, hướng dẫn, hộp đọc lại, Mai chỉ ô nhập sai,
     chân dung màn đăng nhập) tự đổi hình, không phải sửa từng nơi.
   - Ảnh tĩnh: các tư thế cũ của Mai (chỉ tay, cổ vũ, che mắt, bịt tai, mắt dõi theo chữ) không còn; chỉ nhún nhẹ khi đứng (tắt nếu giảm chuyển động).
   - Tên hiển thị "Mai" -> RH_TEN. Tên hàm / khóa lưu (maiX, kpi_mai…) giữ nguyên để không mất cài đặt bật / tắt của người dùng."""
import base64 as _b64
RH_TEN = 'Rhino'
_rh = _b64.b64encode(io.open(os.path.join(D, '..', 'anh', 'rhino-mascot', 'rhino-3b-nen-trong.webp'), 'rb').read()).decode()
# ảnh 415×480 đặt vừa khung 200×270, chạm đáy (đầu nằm khoảng x 71–128, y 40–110)
_RH_IMG = "<image class=\"rh-anh\" href=\"data:image/webp;base64," + _rh + "\" x=\"0\" y=\"0\" width=\"200\" height=\"270\" preserveAspectRatio=\"xMidYMax meet\"/>"

# 1) tên hiển thị (chỉ chữ "Mai" đứng riêng; tránh tên hàm bbMai/maiX và chuỗi base64)
import re as _re
_n = len(_re.findall(r'(?<![A-Za-z0-9+/_$])Mai(?![A-Za-z0-9+/=_$])', s))
s = _re.sub(r'(?<![A-Za-z0-9+/_$])Mai(?![A-Za-z0-9+/=_$])', RH_TEN, s)
assert _n >= 30, _n
s = s.replace("'🙂 " + RH_TEN + "'", "'🦏 " + RH_TEN + "'").replace(">🙂 " + RH_TEN + "<", ">🦏 " + RH_TEN + "<").replace("'Đã bật " + RH_TEN + " 🙂'", "'Đã bật " + RH_TEN + " 🦏'")

# 2) hình: MAI_SVG = 1 ảnh
_i = s.index("var MAI_SVG=''+")
_j = s.index("'</g>';", _i) + len("'</g>';")
s = s[:_i] + "var MAI_SVG='" + _RH_IMG + "';" + s[_j:]

# 3) màn đăng nhập: chân dung tròn lấy phần đầu tê giác; bỏ hình tay che mắt / bịt tai vẽ theo dáng Mai
R("""a.innerHTML = '<svg class="mai" viewBox="26 22 148 148">' + MAI_SVG.replace(/(id="|url\\(#)g(Toc|Mong|Ao|Da|Ma)\\b/g, '$1gbb$2') + BB_CHE + BB_TAI + '</svg>';""",
  """a.innerHTML = '<svg class="mai" viewBox="50 26 100 100">' + MAI_SVG + '</svg>';""")

# 4) CSS: nhún nhẹ, viền sáng mảnh để áo khoác đen không chìm vào nền tối
_k = s.rfind('</style>')
s = s[:_k] + """
/* Rhino (mục 17): ảnh tĩnh thay cho Mai */
svg.mai .rh-anh{transform-box:fill-box;transform-origin:50% 100%;animation:rhNhun 3.4s ease-in-out infinite;filter:drop-shadow(0 0 1.2px rgba(255,255,255,.55)) drop-shadow(0 3px 5px rgba(0,0,0,.35))}
@keyframes rhNhun{50%{transform:translateY(-1.5px) scaleY(1.008)}}
#gate svg.mai .rh-anh{animation:none;filter:none}
@media (prefers-reduced-motion:reduce){svg.mai .rh-anh{animation:none}}
""" + s[_k:]
