# -*- coding: utf-8 -*-
"""Vá Index.html – 28/11 (chủ dự án chọn làm cả 5 mục của bản đánh giá bố cục; chuyên gia soat-giao-dien-cuoi đối chiếu):
 (1) Nề nếp: chủ sở hữu mặc định 1 xưởng (vẫn chọn được "Tất cả"), người vi phạm / điểm thấp lên đầu mỗi xưởng.
 (2) Trang quản trị (Nhân sự, Máy móc, Công đoạn, Tài khoản): form Thêm / Tạo / Cho nghỉ việc hàng loạt / Gán người THU GỌN thành 1 dòng
     (bấm tiêu đề để mở, nhớ trong phiên) → danh sách hiện ngay màn đầu.
 (4) Tổng quan: chủ sở hữu + ban điều hành cũng có khối "Trạng thái đơn hàng" ngay dưới tiêu đề; Đài quan sát xuống sau, cột radar hẹp lại.
 (5) Băng Tết + lời chào Rhino chỉ ở tab Hôm nay / Tổng quan / Nhập sản lượng (CN); hướng dẫn từng bước tự đóng khi chuyển tab.
Chạy bằng exec() ở CUỐI tests/va-index.py (mục 56)."""
def _R(a, b, n=1):
    global s
    assert s.count(a) == n, ('va-bo-cuc-web: không thấy / thấy nhiều', s.count(a), a[:90])
    s = s.replace(a, b)
# (4) Trạng thái đơn hàng ở Tổng quan cho cả chủ sở hữu / ban điều hành, đặt ngay dưới tiêu đề
_R("  if(!ME||ME.laOwner||ME.vaiTro!=='TP'||tabHienTai!=='dash') return;",
   "  if(!ME||(ME.vaiTro!=='TP'&&ME.vaiTro!=='ADMIN')||tabHienTai!=='dash') return;   /* 28/11: + chủ sở hữu / ban điều hành (đánh giá bố cục: việc cần xử lý lên màn đầu) */")
_R("d.id='tqDH'; ref=m.querySelector(':scope > .kpis')||m.querySelector(':scope > .pdesc');",
   "d.id='tqDH'; ref=(ME.vaiTro==='ADMIN'?m.querySelector(':scope > .pdesc'):null)||m.querySelector(':scope > .kpis')||m.querySelector(':scope > .pdesc');")
_R("  var moc = m.querySelector('.pdesc') || m.querySelector('.ptitle');\n  if (moc && moc.parentNode === m) moc.insertAdjacentElement('afterend', w.firstChild);",
   "  var moc = document.getElementById('tqDH') || m.querySelector('.pdesc') || m.querySelector('.ptitle');   /* 28/11: Đài quan sát xuống dưới khối Trạng thái đơn hàng */\n  if (moc && moc.parentNode === m) moc.insertAdjacentElement('afterend', w.firstChild);")
_R("h+=nhomXuong(ns,function(p){return p.MaXuong},nnThead,nnRow,",
   "h+=nhomXuong(nnSapXep_(ns),function(p){return p.MaXuong},nnThead,nnRow,")   # 28/11: điểm thấp / nhiều vi phạm lên đầu
_k = s.find('</head>')
s = s[:_k] + """<style id="boCuc2811">
/* 28/11: đánh giá bố cục – lớp phủ chỉ ở trang chính */
body[data-tab]:not([data-tab="homnay"]):not([data-tab="dash"]):not([data-tab="cnnhap"]) #festbar{display:none!important}
body[data-tab]:not([data-tab="homnay"]):not([data-tab="dash"]):not([data-tab="cnnhap"]) #maiGoc{display:none!important}
/* form quản trị thu gọn */
.card.gon-the>*:not(h3){display:none!important}
.card.gon-the{padding-top:12px!important;padding-bottom:12px!important}
.card.gon-the>h3,.card.gon-mo>h3{cursor:pointer;user-select:none}
.card.gon-the>h3{margin:0!important}
.card.gon-the>h3::after{content:'＋ Mở';margin-left:auto;font-size:12px;font-weight:600;letter-spacing:0;text-transform:none;opacity:.8}
.card.gon-mo>h3::after{content:'－ Thu gọn';margin-left:auto;font-size:12px;font-weight:600;letter-spacing:0;text-transform:none;opacity:.8}
.card.gon-the>h3,.card.gon-mo>h3{display:flex;align-items:center;gap:8px}
/* Tổng quan: radar hẹp lại */
html .hl-ba{grid-template-columns:minmax(0,1fr) minmax(0,.75fr) minmax(0,1fr)!important}
html .hl-giua svg{max-width:320px;margin:0 auto}
</style>
""" + s[_k:]
_k = s.rfind('</body>')
assert len(s) - _k < 400, 'va-bo-cuc-web: </body> cuối không ở cuối file'
s = s[:_k] + r"""<script>
/* ===== 28/11: đánh giá bố cục (mục 56) ===== */
/* bảng điểm nề nếp – điểm thấp nhất + nhiều vi phạm lên đầu mỗi xưởng (trước xếp theo tên) */
function nnSapXep_(ns){ var vp={}; (D.vipham||[]).forEach(function(v){ vp[v.MaNV]=(vp[v.MaNV]||0)+1; });
  var d=function(p){ try{ return Math.min(diemNeNep(p.MaNV,'ChuyenCan'),diemNeNep(p.MaNV,'NeNep')); }catch(e){ return 100; } };
  return (ns||[]).map(function(p,i){ return [p,d(p),vp[p.MaNV]||0,i]; }).sort(function(a,b){ return (a[1]-b[1])||(b[2]-a[2])||(a[3]-b[3]); }).map(function(x){ return x[0]; }); }
(function(){
  var GON_TAB={ns:1,mm:1,cd:1,pq:1}, GON_RE=/^\s*(Thêm|Tạo|Cho nghỉ việc|Gán người)/i, GON_MO={};
  function gonForm(){
    try{
      if(!GON_TAB[window.tabHienTai]) return;
      var m=document.getElementById('main'); if(!m) return;
      Array.prototype.forEach.call(m.querySelectorAll('.card'),function(c){
        var h=c.querySelector(':scope > h3'); if(!h||c.getAttribute('data-gon')) return;
        var t=(h.textContent||'').trim(); if(!GON_RE.test(t)) return;
        var k=window.tabHienTai+'|'+t.slice(0,40); c.setAttribute('data-gon',k);
        c.classList.add(GON_MO[k]?'gon-mo':'gon-the');
        h.setAttribute('role','button'); h.setAttribute('tabindex','0'); h.setAttribute('aria-expanded',GON_MO[k]?'true':'false');
        var lat=function(){ GON_MO[k]=!GON_MO[k]; c.classList.toggle('gon-the',!GON_MO[k]); c.classList.toggle('gon-mo',!!GON_MO[k]); h.setAttribute('aria-expanded',GON_MO[k]?'true':'false'); };
        h.addEventListener('click',lat); h.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); lat(); } });
      });
    }catch(e){}
  }
  var hen=0, ob=null;
  function canh(){ var m=document.getElementById('main'); if(!m||ob) return; ob=new MutationObserver(function(){ clearTimeout(hen); hen=setTimeout(gonForm,30); }); ob.observe(m,{childList:true,subtree:true}); }
  /* 28/11 (chủ dự án): BỎ HOÀN TOÀN mục Kỹ năng (Kỹ năng / Kỹ năng của tôi) khỏi web cho mọi vai trò – dữ liệu trong Sheet giữ nguyên, bật lại = bỏ 2 dòng này */
  var dt0=window.dsTabHienCo; if(typeof dt0==='function') window.dsTabHienCo=function(){ return (dt0.apply(this,arguments)||[]).filter(function(t){ return t&&t[0]!=='kyn'; }); };
  var g=window.go;
  window.go=function(k){
    if(k==='kyn'){ var ds=(typeof dsTabHienCo==='function'?dsTabHienCo():[]).filter(function(t){ return t[0]!=='hd'; }); k=(ds[0]&&ds[0][0])||'dash'; arguments[0]=k; }
    try{ document.body.setAttribute('data-tab',k); var w=document.getElementById('maiTour'); if(w&&w.classList.contains('mo')&&window.__tourTab&&window.__tourTab!==k&&typeof maiTourDong==='function') maiTourDong(); }catch(e){}
    var r=g.apply(this,arguments); canh(); setTimeout(gonForm,0); return r;
  };
  var t0=window.maiTour; if(typeof t0==='function') window.maiTour=function(){ window.__tourTab=window.tabHienTai; return t0.apply(this,arguments); };
  /* (1) Nề nếp: chủ sở hữu mặc định 1 xưởng, người vi phạm lên đầu */
  var vn=window.vNeNep;
  if(typeof vn==='function') window.vNeNep=function(){
    var cu=window.xuongLoc;
    try{
      if(ME&&ME.vaiTro==='ADMIN'&&!xuongLoc&&!window.NN_TATCA&&D.phongban&&D.phongban[0]) xuongLoc=D.phongban[0].MaXuong;
      return vn.apply(this,arguments);
    } finally { xuongLoc=cu; }
  };
  var dx=window.doiXuongLoc;
  if(typeof dx==='function') window.doiXuongLoc=function(v){ if(window.tabHienTai==='nenep') window.NN_TATCA=!v; return dx.apply(this,arguments); };
})();
</script>
""" + s[_k:]
