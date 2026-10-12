# Mục 19 của va-index.py (12/10): PHẦN GIAO DIỆN TẢI SAU – cho trang nhẹ hơn khi mọi người mở web.
#  - SoDo.html (tab Sơ đồ nhà máy, ghi bởi mục 15) và HoatAnh.html (dữ liệu Lottie, ghi ở đây) là 2 file HTML riêng trong Apps Script;
#    trình duyệt gọi layManhGiaoDien (tests/manh.gs) khi cần, chèn vào trang, nhớ trong localStorage theo mã phiên bản (MANH_VER).
#  - Hoạt ảnh: tải nền 2,5 giây sau khi vào web; chưa tải xong thì dùng hình tĩnh LT_TINH như khi mất mạng.
import hashlib as _hl, re as _re

def _thay19(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('mục 19: không thấy đúng %d chỗ' % dem, cu[:70], s.count(cu))
    s = s.replace(cu, moi)

# 1) Lottie: dữ liệu ra HoatAnh.html
_thay19('var LT_DATA=' + LT_JSON + ';', 'var LT_DATA=null;   /* dữ liệu nằm ở HoatAnh.html, tải sau (mục 19) */')
_HOAT_ANH = '<!-- Dữ liệu hoạt ảnh Lottie (tải nền sau khi đăng nhập, xem tests/manh/va-manh.py) -->\n<script>\nLT_DATA=' + LT_JSON + ';\n</script>\n'
io.open(os.path.join(D, '..', 'HoatAnh.html'), 'w', encoding='utf-8').write(_HOAT_ANH)
_thay19("""function ltNap(cb){
  if(window.lottie){cb(true);return}""", """function ltNap(cb){
  if(!LT_DATA){ if(typeof taiManh!=='function'){cb(false);return}
    taiManh('HoatAnh',function(ok){ if(ok&&LT_DATA)ltNap(cb); else cb(false); }); return; }
  if(window.lottie){cb(true);return}""")
_thay19("""  if(!el||!LT_DATA[ten])return h;
  ltNap(function(ok){""", """  if(!el||(LT_DATA?!LT_DATA[ten]:!LT_TINH[ten]))return h;
  ltNap(function(ok){
    if(ok&&!(LT_DATA&&LT_DATA[ten]))ok=false;""")

# 2) Bộ tải chung + tải nền hoạt ảnh sau khi vào web
_ver = lambda p: _hl.md5(io.open(os.path.join(D, '..', p), encoding='utf-8').read().encode('utf-8')).hexdigest()[:10]
_MANH_VER = {'SoDo': _ver('SoDo.html'), 'HoatAnh': _ver('HoatAnh.html')}
_k = s.rfind('</body>')
s = s[:_k] + '''<script>
/* ===== 19. PHẦN GIAO DIỆN TẢI SAU (12/10) – SoDo.html, HoatAnh.html: chỉ tải khi cần, nhớ lại theo phiên bản ===== */
var MANH_VER=''' + _json.dumps(_MANH_VER) + ''';
var __manh={da:{},cho:{}};
function ganManh_(nd){
  var js=[], ngoai=String(nd).replace(/<script>([\\s\\S]*?)<\\/script>/g,function(_,x){js.push(x);return ''});
  if(ngoai.replace(/<!--[\\s\\S]*?-->/g,'').trim()){var d=document.createElement('div');d.innerHTML=ngoai;while(d.firstChild)document.body.appendChild(d.firstChild);}
  js.forEach(function(x){var e=document.createElement('script');e.text=x;document.body.appendChild(e);});
}
/* taiManh(ten, cb(ok, thongBao)) */
function taiManh(ten,cb){
  if(__manh.da[ten]){cb(true);return}
  var ds=__manh.cho[ten]=(__manh.cho[ten]||[]); ds.push(cb); if(ds.length>1)return;
  var khoa='kpi_manh_'+ten+'_'+(MANH_VER[ten]||''), nd=null;
  var xong=function(ok,msg){var c=__manh.cho[ten]||[];__manh.cho[ten]=[];c.forEach(function(f){try{f(ok,msg)}catch(e){}})};
  var gan=function(x){try{ganManh_(x);__manh.da[ten]=true;xong(true)}catch(e){xong(false,'Lỗi khi mở phần '+ten+': '+e.message)}};
  try{nd=localStorage.getItem(khoa)}catch(e){}
  if(nd){gan(nd);return}
  if(typeof TOKEN==='undefined'||!TOKEN){xong(false,'Chưa đăng nhập.');return}
  google.script.run.withSuccessHandler(function(r){
    if(r&&r.hetHan){try{hetHan()}catch(e){} xong(false,'Phiên đăng nhập đã hết hạn.');return}
    if(!r||!r.ok){xong(false,(r&&r.msg)||'Không tải được.');return}
    try{ for(var i=localStorage.length-1;i>=0;i--){var k=localStorage.key(i); if(k&&k.indexOf('kpi_manh_'+ten+'_')===0)localStorage.removeItem(k)}
      localStorage.setItem(khoa,r.noiDung);}catch(e){}
    gan(r.noiDung);
  }).withFailureHandler(function(e){xong(false,'Không tải được (mạng chập chờn?).')}).layManhGiaoDien(TOKEN,ten);
}
/* Sau khi vào web: tải nền dữ liệu hoạt ảnh (nhỏ, có nhớ) để lúc cần là có ngay */
(function(){ var cu=window.vaoHeThong; if(typeof cu!=='function')return;
  window.vaoHeThong=function(){ var r=cu.apply(this,arguments); setTimeout(function(){taiManh('HoatAnh',function(){})},2500); return r; }; })();
</script>
''' + s[_k:]

# 3) Font khắc dự phòng (Michroma / Oswald / Saira) chỉ dùng ở trang demo đổi font – web thật dùng Orbitron (LkOrb)
_n19 = len(s)
s = _re.sub(r"@font-face\{font-family:'Lk(Mic|Osw|Sai)';src:url\(data:font/woff2;base64,[A-Za-z0-9+/=]+\) format\('woff2'\);[^}]*\}\n?", '', s)
assert _n19 - len(s) > 10000 and not _re.search(r"font-family:'Lk(Mic|Osw|Sai)'", s), 'mục 19: không bỏ được font dự phòng'
