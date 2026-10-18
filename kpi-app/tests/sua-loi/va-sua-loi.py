# Mục 18 của va-index.py (11/10): sửa lỗi giao diện do bộ kiểm tra Impeccable tìm ra.
# Chạy cuối cùng, trên biến s (toàn bộ Index.html). Không đụng hiệu ứng màn đăng nhập đã duyệt.
import re as _re18

def _thay18(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('mục 18: không thấy đúng %d chỗ' % dem, cu[:60], s.count(cu))
    s = s.replace(cu, moi)

# 1) Chữ quá nhỏ: 11 / 11,5px → 12 / 12,5px; 10 / 10,5px (nhãn, huy hiệu) → 11px. Chỉ sửa khai báo CSS (cả style="…" trong JS).
_co18 = {'10': '11', '10.5': '11', '11': '12', '11.5': '12.5'}
s = _re18.sub(r'font-size:(\s*)(10|10\.5|11|11\.5)px', lambda m: 'font-size:' + m.group(1) + _co18[m.group(2)] + 'px', s)
s = _re18.sub(r'(font:\s*\d00\s+)(10|10\.5|11|11\.5)px', lambda m: m.group(1) + _co18[m.group(2)] + 'px', s)

# 2) Chữ mờ khó đọc
_thay18('#gate input::placeholder{color:#5c5c5c}', '#gate input::placeholder{color:#8c8c8c}')   # 3,0:1 → 5,6:1
_thay18('--chu3:#707070', '--chu3:#939393')                                                      # 3,8:1 → 5,9:1

# 3) Bỏ vạch màu trang trí cạnh trái thẻ KPI → viền trên mảnh
_thay18(".kpi::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--cyan)}",
        ".kpi{border-top:2px solid var(--cyan)}")

# 4) Bỏ chữ tô dải màu: tiêu đề trang công nhân + chữ "vuốt để gửi"
_thay18('background:linear-gradient(90deg,#fff,#a9d8ff 60%,var(--cyan));-webkit-background-clip:text;background-clip:text;color:transparent}',
        'color:var(--ink)}')
_thay18('background:linear-gradient(90deg,var(--cyan) 0,var(--ink) 50%,var(--cyan) 100%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:gdChuVuot 2.4s linear infinite}',
        'opacity:.9}')

# 5) Chấm báo trên menu không nhấp nháy mãi
_thay18('animation:pulseDot 1.8s ease-in-out infinite', 'animation:none')

# 6) Màu đỏ giao diện tối sáng hơn một chút để chữ đỏ trên nền xám đủ tương phản (4,4:1 → 4,9:1)
_thay18('--red:#f47272', '--red:#f77e7e')

# 7) Vạch màu dày cạnh trái các thẻ "Việc hôm nay" và khung công thức: bỏ (màu con số đã báo mức gấp)
_thay18(".hn-viec::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ink3)}",
        ".hn-viec::before{content:none}")
_thay18('border-left:4px solid #8b7cf6;', '')

# 8) Phần sơ đồ nằm ở file riêng SoDo.html (mục 15, từ 12/10): sửa cỡ chữ + chữ đỏ như trên
_p18 = os.path.join(D, '..', 'SoDo.html')
_sd18 = io.open(_p18, encoding='utf-8').read()
_sd18 = _re18.sub(r'font-size:(\s*)(10|10\.5|11|11\.5)px', lambda m: 'font-size:' + m.group(1) + _co18[m.group(2)] + 'px', _sd18)
_sd18 = _re18.sub(r'(font:\s*\d00\s+)(10|10\.5|11|11\.5)px', lambda m: m.group(1) + _co18[m.group(2)] + 'px', _sd18)
for _a, _b in [('.sd-xs .bt{color:#f47272', '.sd-xs .bt{color:#ff9a9a'), ('<b style="color:#f47272">⚠ \' + ds.length', '<b style="color:#ff9a9a">⚠ \' + ds.length')]:
    assert _sd18.count(_a) == 1, ('mục 18 / SoDo.html', _a)
    _sd18 = _sd18.replace(_a, _b)
io.open(_p18, 'w', encoding='utf-8').write(_sd18)
