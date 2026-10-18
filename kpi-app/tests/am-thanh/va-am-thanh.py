# Mục 24 của va-index.py (18/10): ÂM THANH + GIỌNG RHINO – chủ dự án chọn bộ tiếng "HUD phi thuyền" + giọng nữ (demo-am-thanh.html).
#  - Nút "🔇 Tiếng" ở đầu trang (cạnh nút Rhino), mặc định tắt; mã chạy: am-thanh/am-thanh.js (chèn trước </body> cuối).
#  - Tiếng thu sẵn (giong-web.json, sinh bởi tao-giong.py web) ghi ra file mới AmThanh.html, tải bằng taiManh khi bật giọng (mục 19).
import hashlib as _hl24, json as _json24
_A24 = os.path.join(D, 'am-thanh')

def _thay24(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('mục 24: không thấy đúng %d chỗ' % dem, cu[:70], s.count(cu))
    s = s.replace(cu, moi)

_thay24('<button class="btn sm hgd" id="btnMai" onclick="maiDoi()" title="Tắt nhân vật Rhino">🦏 Rhino</button>',
        '<button class="btn sm hgd" id="btnMai" onclick="maiDoi()" title="Tắt nhân vật Rhino">🦏 Rhino</button>\n'
        '      <button class="btn sm hgd" id="btnAm" onclick="amDoi()" title="Tiếng: đang tắt – bấm để bật tiếng hiệu ứng" aria-label="Tiếng: đang tắt – bấm để bật tiếng hiệu ứng">🔇</button>')
_k = s.rfind('</body>')
s = s[:_k] + '''<style>
/* 24. thêm nút Tiếng: điện thoại hẹp thì tên hệ thống tự cắt "…" để thanh đầu trang không tràn ngang */
@media (max-width:600px){ header .hl{min-width:0;flex:1 1 auto} header .hl>div:last-child{min-width:0} header .htitle{white-space:nowrap;overflow:hidden;text-overflow:ellipsis} header .hr{gap:6px;flex:none} }
</style>
<script>\n''' + io.open(os.path.join(_A24, 'am-thanh.js'), encoding='utf-8').read() + '</script>\n' + s[_k:]

# File AmThanh.html: tiếng thu sẵn
_gw = io.open(os.path.join(_A24, 'giong-web.json'), encoding='utf-8').read()
io.open(os.path.join(D, '..', 'AmThanh.html'), 'w', encoding='utf-8').write(
    '<!-- Giọng nói Rhino thu sẵn (tải khi bật giọng, xem tests/am-thanh/tao-giong.py) -->\n<script>\nAM_GIONG=' + _gw + ';\n</script>\n')
# mã phiên bản (SHA-256 như mục 22) để trình duyệt chỉ dùng bản nhớ đúng phiên bản
_i = s.index('var MANH_VER='); _j = s.index(';', _i)
_mv24 = _json24.loads(s[_i + len('var MANH_VER='):_j])
_mv24['AmThanh'] = _hl24.sha256(io.open(os.path.join(D, '..', 'AmThanh.html'), encoding='utf-8').read().encode('utf-8')).hexdigest()[:16]
s = s[:_i] + 'var MANH_VER=' + _json24.dumps(_mv24) + s[_j:]
