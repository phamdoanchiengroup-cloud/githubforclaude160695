# -*- coding: utf-8 -*-
"""Vá Index.html – mục 46 (14/11 khuya, chủ dự án): "Đơn hàng" lên đầu nhóm Sản xuất, nút to + màu nhấn Azure (soat-giao-dien-cuoi: không gradient / nhấp nháy);
Tổng quan của TP/PP: dưới các thông báo hiện bản gọn "Trạng thái đơn hàng" (dhTQVe ở mảnh QuyTrinh.html). Chạy bằng exec() cuối tests/va-index.py, sau mục 45."""
def _t46(a, b):
    global s
    assert s.count(a) == 1, ('mục 46', a[:80], s.count(a)); s = s.replace(a, b)
_t46("  ['Sản xuất',['duyetsl','nk','qt','dh','cgay','tk','kcs','dd','nenep','cccn']],", "  ['Sản xuất',['dh','duyetsl','nk','qt','cgay','tk','kcs','dd','nenep','cccn']],   /* 14/11 khuya: Đơn hàng lên đầu, nút nổi bật */")
_k46 = s.rfind('</body>')
s = s[:_k46] + r'''<style id="navDH">
#nav button[data-k="dh"],html[data-gd="toi"]:not(.cn-moi) #nav button[data-k="dh"]{min-height:44px;font-size:15px;font-weight:700;color:var(--cyan);background:rgba(var(--acc-rgb),.12);border:1px solid rgba(var(--acc-rgb),.28);border-left:3px solid var(--cyan);margin:2px 0 6px}
#nav button[data-k="dh"] svg{color:var(--cyan)}
#nav button[data-k="dh"]:hover,html[data-gd="toi"]:not(.cn-moi) #nav button[data-k="dh"]:hover{background:rgba(var(--acc-rgb),.2);color:var(--cyan)}
#nav button[data-k="dh"].on,html[data-gd="toi"]:not(.cn-moi) #nav button[data-k="dh"].on{background:var(--cyan);color:var(--on-acc);box-shadow:none;border-color:var(--cyan)}
#nav button[data-k="dh"].on svg,html[data-gd="toi"]:not(.cn-moi) #nav button[data-k="dh"].on svg{color:var(--on-acc);filter:none}
</style>
<script>
/* 14/11 khuya (chủ dự án): Tổng quan của TP/PP – ngay dưới các thông báo hiện bảng gọn Trạng thái đơn hàng (chỉ đơn có việc ở bộ phận mình) */
(function(){ var g=window.vDash; window.vDash=function(){ var r=g.apply(this,arguments); try{ dhTQGan(); }catch(e){} return r; }; })();
function dhTQGan(){
  if(!ME||ME.laOwner||ME.vaiTro!=='TP'||tabHienTai!=='dash') return;
  var m=$('main'); if(!m||document.getElementById('tqDH')) return;
  var d=document.createElement('div'), ref; d.id='tqDH'; ref=m.querySelector(':scope > .kpis')||m.querySelector(':scope > .pdesc');
  while(ref&&ref.nextElementSibling&&ref.nextElementSibling.classList.contains('alert')) ref=ref.nextElementSibling;
  if(ref) ref.insertAdjacentElement('afterend',d); else m.insertBefore(d,m.firstChild);
  if(window.__qtDaNap&&typeof dhTQVe==='function'){ dhTQVe(); return; }
  d.innerHTML='<div class="card pdesc">Đang đọc trạng thái đơn hàng…</div>';
  taiManh('QuyTrinh',function(ok,msg){ if(tabHienTai!=='dash') return; var e=document.getElementById('tqDH'); if(!e) return;
    if(ok&&typeof dhTQVe==='function') dhTQVe(); else e.innerHTML='<div class="alert a-wn">Chưa tải được bảng đơn hàng. '+esc(msg||'')+'</div>'; });
}
</script>
''' + s[_k46:]
