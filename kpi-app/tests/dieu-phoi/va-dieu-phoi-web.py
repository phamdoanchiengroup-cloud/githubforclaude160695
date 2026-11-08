# -*- coding: utf-8 -*-
"""Vá Index.html – mục 39: Điều phối sản xuất ở Việc hôm nay (08/11, chủ dự án chọn việc 1, 2, 3 của quan-ly-van-hanh).
- Chủ sở hữu + Ban điều hành (ADMIN): Cách đếm sản lượng (đề xuất, chủ sở hữu bấm Áp dụng), Nút cổ chai, Dòng chảy giữa xưởng, Sức khỏe dữ liệu (layDieuPhoi).
- Trưởng / phó phòng: "Hôm nay xưởng tôi làm gì trước" (layViecXuongToi + dpVeViec trong mảnh QuyTrinh.html). Chủ sở hữu: chọn xưởng, bấm mới tải.
Chạy bằng exec() cuối tests/va-index.py. Kiểm thử: tests/dieu-phoi-web.js"""

def _t39(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('mục 39: không thấy đúng %d chỗ' % dem, cu[:90], s.count(cu))
    s = s.replace(cu, moi)

_t39("""  // Lối tắt
  var co={}; dsTabHienCo().forEach(function(t){co[t[0]]=t[1]});""", """  // 39 (08/11): Điều phối sản xuất – chủ sở hữu / Ban điều hành: cách đếm, nút cổ chai, dòng chảy, sức khỏe dữ liệu; trưởng / phó phòng: việc của xưởng
  if(ME&&(ME.laOwner||ME.vaiTro==='ADMIN'||ME.vaiTro==='TP')){ h+='<div id="dpHN"></div>'; setTimeout(dpNap,0); }
  // Lối tắt
  var co={}; dsTabHienCo().forEach(function(t){co[t[0]]=t[1]});""")

_h39 = s.find('</head>'); assert _h39 > 0
s = s[:_h39] + '''<style id="dpCss">
/* 39. Điều phối sản xuất (08/11) */
.dp-the{max-width:100%;box-sizing:border-box;min-width:0;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin:0 0 14px}
.dp-the>.t{font-weight:600;margin-bottom:6px;display:flex;flex-wrap:wrap;gap:6px 10px;align-items:baseline}
.dp-the>.t small{font-weight:400;color:var(--ink3);font-size:12px}
.dp-m{font-size:12.5px;color:var(--ink3)} .dp-m b{color:var(--ink2)}
.dp-tb{width:100%;border-collapse:collapse;font-size:13px} .dp-tb th{font-size:11.5px;color:var(--ink3);text-align:left;font-weight:500;padding:4px 6px}
.dp-tb td{padding:6px;border-top:1px solid var(--line);vertical-align:top} .dp-tb .so{text-align:right;white-space:nowrap}
.dp-chip{display:inline-block;font-size:11.5px;padding:1px 8px;border-radius:99px;white-space:nowrap;background:rgba(127,127,127,.12);color:var(--ink2)}
.dp-chip.do{background:rgba(192,48,43,.14);color:var(--red,#c0302b)} .dp-chip.vang{background:rgba(201,138,0,.16);color:var(--amber,#b87500)}
.dp-chip.xanh{background:rgba(31,122,72,.14);color:var(--green,#1f7a48)} .dp-chip.xam{opacity:.8}
.dp-cc{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 8px;align-items:center} .dp-cc .ten{font-size:12.5px;min-width:86px;color:var(--ink2)}
.dp-cc span.o{font-size:12.5px;border:1px solid var(--line);border-radius:8px;padding:3px 8px;white-space:nowrap} .dp-cc span.o.nut{border-color:var(--red,#c0302b);box-shadow:0 0 0 1px var(--red,#c0302b) inset;font-weight:600}
.dp-cc .mt{color:var(--ink3);font-size:12px}
.dp-sk li{margin:3px 0;font-size:13px} .dp-sk{padding-left:18px;margin:4px 0}
.dp-the details summary{cursor:pointer;font-size:12.5px;color:var(--acc,#0b7a73)}
.dpv-tom{font-size:13.5px;margin-bottom:4px} .dpv-kh{font-size:12.5px;color:var(--ink3);margin-bottom:8px} .dpv-m{font-size:12px;color:var(--ink3)}
.dpv td{vertical-align:top} .dpv summary{font-size:12.5px;cursor:pointer} .dpv-chu{font-size:12px;color:var(--ink3);margin-top:6px}
.dpv-uu{font-size:10.5px;font-weight:700;letter-spacing:.04em;padding:1px 6px;border-radius:6px;background:rgba(201,138,0,.18);color:var(--amber,#b87500)} .dpv-u{color:var(--amber,#b87500)}
.dp-the .bd{color:var(--red,#c0302b)} .dp-the .wn{color:var(--amber,#b87500)}
@media (max-width:640px){ .dp-the{padding:12px} .dp-tb{font-size:12.5px} .dp-cc .ten{min-width:0;width:100%}
  .dp-the .tw{margin:0;padding:0} .dpv tr{padding-right:2px}
  .dpv thead{display:none} .dpv,.dpv tbody{display:block;width:100%} .dpv tr{display:grid;grid-template-columns:22px minmax(0,1fr) auto auto;gap:2px 10px;padding:8px 0;border-top:1px solid var(--line)}
  .dpv td{border:0!important;padding:0!important;min-width:0;overflow-wrap:anywhere} .dpv td:nth-child(5){grid-column:2/-1} .dpv tr.dh-khoi{grid-template-columns:1fr auto;padding:6px 4px} .dpv tr.dh-khoi td:empty{display:none} }
</style>
''' + s[_h39:]

_k39 = s.rfind('</body>')
s = s[:_k39] + r'''<script>
/* ===== 39. ĐIỀU PHỐI SẢN XUẤT (08/11) ===== */
var DP_TT={don:['do','Đang dồn'],hut:['vang','Đang hụt'],can:['xanh','Cân bằng'],lech:['xam','Lệch lớn – xem lại cách đếm'],thieu:['xam','Chưa đủ số']};
function dpSo(v){ return Math.round(Number(v)||0).toLocaleString('vi-VN'); }
function dpNg(d){ return d?d.slice(8,10)+'/'+d.slice(5,7):'–'; }
function dpNap(lamMoi){
  var el=document.getElementById('dpHN'); if(!el||!ME) return;
  var laQL=ME.laOwner||ME.vaiTro==='ADMIN';
  if(!el.dataset.ve){ el.dataset.ve='1'; el.innerHTML=(laQL?'<div class="hn-h">Điều phối sản xuất</div><div id="dpQL"><div class="dp-m">Đang tính…</div></div>':'')+((ME.laOwner||ME.vaiTro==='TP')?'<div class="hn-h">'+(ME.laOwner?'Việc theo xưởng hôm nay':'Hôm nay xưởng tôi làm gì trước')+'</div><div id="dpViec"></div>':''); }
  if(laQL){ var c=window.__dp; if(c&&!lamMoi&&Date.now()-c.t<300000) dpVeQL(c.r); else call('layDieuPhoi',[!!lamMoi],function(r){ window.__dp={t:Date.now(),r:r}; dpVeQL(r); }); }
  if(ME.vaiTro==='TP'&&!ME.laOwner) dpViecTai(false);
  else if(ME.laOwner) dpViecVe();
}
function dpVeQL(r){
  var el=document.getElementById('dpQL'); if(!el) return;
  if(!r||!r.ok){ el.innerHTML='<div class="alert a-bd">'+esc((r&&r.msg)||'Không tải được.')+' <button class="btn sm" type="button" onclick="dpNap(true)">Thử lại</button></div>'; return; }
  var h='', chua=(r.dem||[]).filter(function(p){return !p.daAp});
  /* 1a. Cách đếm */
  if(chua.length){
    h+='<div class="dp-the"><div class="t">Cách đếm sản lượng xưởng – Claude đề xuất <small>TB '+r.soNgay.d30+' ngày làm gần nhất</small></div>'+
      '<div class="dp-m" style="margin-bottom:6px">Số sản lượng xưởng đang lệch nên biểu đồ xưởng, nút cổ chai và dòng chảy chưa đúng. Đề xuất dưới đây so với xưởng trước / sau để kiểm chứng.</div>'+
      '<div class="tw"><table class="dp-tb"><thead><tr><th>Xưởng</th><th>Đang đếm</th><th class="so">Ra/ngày</th><th>Đề xuất</th><th class="so">Ra/ngày</th><th>Đối chiếu</th></tr></thead><tbody>';
    chua.forEach(function(p){
      h+='<tr><td><b>'+esc(p.ten.replace(/^Xưởng /,''))+'</b></td><td>'+esc(p.cu.ten.join(' + '))+(p.cu.luot>1?' ÷ '+p.cu.luot:'')+'</td><td class="so">'+dpSo(p.cu.tb)+'</td>'+
        '<td>'+(p.moi.them.length?'thêm <b>'+esc(p.moi.them.join(', '))+'</b>':'')+(p.moi.luot!==p.cu.luot?(p.moi.them.length?'; ':'')+'<b>÷ '+p.moi.luot+'</b> (mỗi khúc ghi '+p.moi.luot+' lần)':'')+'<div class="dp-m">'+esc(p.ly)+'</div></td><td class="so"><b>'+dpSo(p.moi.tb)+'</b></td>'+
        '<td class="dp-m">'+p.doi.map(function(a){return esc(a[0])+' <b>'+dpSo(a[1])+'</b>'}).join('<br>')+'</td></tr>';
    });
    h+='</tbody></table></div>'+(r.coTheAp?'<button class="btn pri" type="button" onclick="dpApDem()" style="margin-top:8px">Áp dụng đề xuất</button> <span class="dp-m">Đổi lại được bất cứ lúc nào ở Quy trình → Sửa quy trình → Bước xuất.</span>':'<div class="dp-m" style="margin-top:6px">Chủ sở hữu duyệt và bấm áp dụng.</div>')+'</div>';
  }
  /* 3a. Nút cổ chai */
  h+='<div class="dp-the"><div class="t">Nút cổ chai <small>xưởng ra ít nhất trong chuỗi – TB '+r.soNgay.d7+' ngày làm'+(r.coHQ?' và hôm qua '+dpNg(r.homQua):'')+'</small></div>';
  (r.chuoi||[]).forEach(function(c){ if(!c.ds.length) return;
    h+='<div class="dp-cc"><span class="ten">'+esc(c.ten)+'</span>'+c.ds.map(function(o,i){ return (i?'<span class="mt">→</span>':'')+'<span class="o'+(c.nut&&o.ten===c.nut.ten?' nut':'')+'">'+esc(o.ten.replace(/^Xưởng /,''))+' '+dpSo(o.tb7)+'</span>'; }).join('')+'</div>';
    if(c.nut) h+='<div class="dp-m" style="margin:-4px 0 8px">→ '+esc(c.ten)+' đang bị giới hạn ở <b>'+esc(c.nut.ten.replace(/^Xưởng /,''))+'</b> (~'+dpSo(c.nut.tb7)+'/ngày)'+(c.nutHQ&&c.nutHQ.ten!==c.nut.ten?'; hôm qua chậm nhất là '+esc(c.nutHQ.ten.replace(/^Xưởng /,''))+' ('+dpSo(c.nutHQ.hq)+')':'')+'. Ưu tiên người, máy, vật tư cho xưởng này – xưởng khác làm nhanh hơn chỉ làm hàng dồn thêm.</div>'; });
  h+='<div class="dp-m">Đóng gói TB '+r.soNgay.d7+' ngày: <b>'+dpSo(r.dg7)+'</b> sp/ngày. Mỗi số = sản lượng ở bước xuất của xưởng (chuôi / ngọn tách theo nhánh trong Quy trình).'+(r.theoDeXuat?' <b class="wn">Đang tính theo cách đếm đề xuất (chưa áp dụng).</b>':'')+'</div></div>';
  /* 3b. Dòng chảy */
  h+='<div class="dp-the"><div class="t">Dòng chảy giữa các xưởng <small>'+r.soNgay.d14+' ngày làm gần nhất</small></div>'+
    '<div class="tw"><table class="dp-tb"><thead><tr><th>Chặng</th><th class="so">Xưởng trước giao/ngày</th><th class="so">Xưởng sau làm/ngày</th><th class="so">Dồn thêm '+r.soNgay.d14+' ngày</th><th>Tình trạng</th></tr></thead><tbody>';
  (r.cap||[]).forEach(function(c){ var t=DP_TT[c.tt]||DP_TT.thieu;
    h+='<tr><td><b>'+esc(c.nhan)+'</b><div class="dp-m">'+esc(c.tu.replace(/^Xưởng /,''))+' → '+esc(c.den.replace(/^Xưởng /,''))+'</div></td><td class="so">'+dpSo(c.a)+'</td><td class="so">'+dpSo(c.b)+'</td>'+
      '<td class="so">'+(c.tt==='lech'||c.tt==='thieu'?'–':(c.tich>0?'+':'')+dpSo(c.tich)+(c.ngayB!=null?'<div class="dp-m">≈ '+String(Math.abs(c.ngayB)).replace('.',',')+' ngày làm</div>':''))+'</td><td><span class="dp-chip '+t[0]+'">'+t[1]+'</span>'+(c.ghiThieu&&c.ghiThieu.length&&c.tt==='hut'?'<div class="dp-m">Có thể do ghi thiếu '+esc(c.ghiThieu.join(', ').toLowerCase())+' ở xưởng trước – xem Sức khỏe dữ liệu</div>':'')+'</td></tr>'; });
  h+='</tbody></table></div><div class="dp-m" style="margin-top:6px"><b>Đang dồn</b>: xưởng sau làm chậm hơn xưởng trước giao (chênh > 10%) – hàng chờ trước xưởng sau tăng lên. <b>Đang hụt</b>: xưởng sau làm nhanh hơn – đang dùng hàng tồn cũ, sắp thiếu hàng để làm. Đây là phần <i>tăng / giảm</i> trong kỳ, không phải tổng tồn (chưa có số kiểm đếm đầu kỳ). Hoàn thiện → Đóng gói không so vì khác đơn vị (khúc / sản phẩm).</div></div>';
  /* 1b. Sức khỏe dữ liệu */
  var s=r.sk||{}, li=[];
  (s.ghiThieu||[]).forEach(function(g){ li.push('<span class="dp-chip vang">Có thể ghi thiếu</span> <b>'+esc(g.ten.replace(/^Xưởng /,''))+'</b> ghi giao '+esc(g.nhan.toLowerCase())+' <b>'+dpSo(g.a)+'</b>/ngày nhưng '+esc(g.sau.replace(/^Xưởng /,''))+' làm <b>'+dpSo(g.b)+'</b>/ngày ('+r.soNgay.d14+' ngày làm) – nhờ trưởng phòng '+esc(g.ten.replace(/^Xưởng /,''))+' ghi đủ bước '+esc(g.cdA.join(' / '))); });
  li.push(s.thieuNK&&s.thieuNK.length?'<span class="dp-chip vang">Thiếu nhật ký</span> '+s.thieuNK.map(function(x){return '<b>'+esc(x.ten.replace(/^Xưởng /,''))+'</b> '+x.ngay.map(dpNg).join(', ')}).join(' · '):'<span class="dp-chip xanh">Đủ nhật ký</span> 9 xưởng đều có ghi trong '+(s.ngay6||[]).length+' ngày làm gần nhất');
  li.push(s.choTong?'<span class="dp-chip vang">Chờ duyệt quá 2 ngày</span> <b>'+s.choTong+'</b> dòng: '+s.cho.map(function(x){return esc(x.ten.replace(/^Xưởng /,''))+' '+x.n+' (cũ nhất '+dpNg(x.cu)+')'}).join(' · '):'<span class="dp-chip xanh">Duyệt kịp</span> không có dòng chờ duyệt quá 2 ngày');
  li.push(s.laTong?'<span class="dp-chip do">Số bất thường</span> <b>'+s.laTong+'</b> dòng '+r.soNgay.d7+' ngày qua gấp ≥ 3 lần mức thường của công đoạn – nhờ trưởng phòng kiểm lại (có thể ghi số cả tổ hoặc gõ nhầm)<details><summary>Xem '+s.la.length+' dòng lớn nhất</summary>'+s.la.map(function(x){return '<div class="dp-m">'+dpNg(x.ng)+' · '+esc(x.x.replace(/^Xưởng /,''))+' · '+esc(x.cd)+': <b>'+dpSo(x.sl)+'</b> (thường '+dpSo(x.thuong)+', gấp '+String(x.lan).replace('.',',')+') – '+esc(x.nv)+(x.nguoi?', nhập: '+esc(x.nguoi):'')+'</div>'}).join('')+'</details>':'<span class="dp-chip xanh">Không có số bất thường</span>');
  if(s.tuongLai) li.push('<span class="dp-chip do">Ngày tương lai</span> <b>'+s.tuongLai+'</b> dòng ghi ngày sau hôm nay: '+s.tuongLaiDs.map(function(x){return dpNg(x.ng)+' '+esc(x.x)+' '+esc(x.nv)}).join(' · '));
  h+='<div class="dp-the"><div class="t">Sức khỏe dữ liệu nhật ký</div><ul class="dp-sk">'+li.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div>';
  h+='<div class="dp-m" style="margin:-6px 0 14px">Tính lúc '+esc(r.luc)+' (nhớ 10 phút) · <button class="btn sm" type="button" onclick="dpNap(true)">Làm mới</button></div>';
  el.innerHTML=h;
}
function dpApDem(){
  if(!confirm('Áp dụng cách đếm Claude đề xuất cho Phôi Carbon / Sơn / In UV? Biểu đồ sản lượng xưởng, Quy trình, báo cáo sẽ tính theo cách mới.')) return;
  call('apDeXuatDem',[],function(r){ if(!r||!r.ok){ toast((r&&r.msg)||'Không áp dụng được.'); return; } toast(r.msg,true); window.__dp=null; dpNap(true); });
}
/* Việc 2 */
function dpViecTai(lamMoi){
  var el=document.getElementById('dpViec'); if(!el) return;
  var X=ME.laOwner?(window.__dpX||'PHOICB'):'';
  var ve=function(){ var e2=document.getElementById('dpViec'); if(!e2) return; var r=window.__dpV.r; e2.innerHTML=(ME.laOwner?dpChonX():'')+'<div class="dp-the">'+dpVeViec(r,X||r.xuong,window.__dpN||15)+'</div>'; };
  if(window.__dpV&&!lamMoi&&Date.now()-window.__dpV.t<300000&&window.__qtDaNap){ ve(); return; }
  el.innerHTML=(ME.laOwner?dpChonX():'')+'<div class="dp-m">Đang đọc Sheet đơn…</div>';
  taiManh('QuyTrinh',function(ok,msg){
    if(!ok||!window.__qtDaNap){ var e1=document.getElementById('dpViec'); if(e1) e1.innerHTML='<div class="alert a-bd">'+esc(msg||'Không tải được.')+'</div>'; return; }
    call('layViecXuongToi',[],function(r){ window.__dpV={t:Date.now(),r:r}; ve(); });
  });
}
function dpChonX(){ var X=window.__dpX||'PHOICB', ds=[['PHOICB','Phôi Carbon'],['PHOITHO','Phôi Thô'],['SON','Sơn'],['INUV','In UV'],['NGONTARO','Ngọn Taro'],['NGONTIP','Ngọn Tip'],['CNC','CNC'],['HT','Hoàn thiện'],['DG','Đóng gói']];
  return '<div class="dp-m" style="margin-bottom:6px">Trưởng / phó phòng thấy đúng danh sách của xưởng mình. <label for="dpX">Xem xưởng:</label> <select id="dpX" onchange="window.__dpX=this.value;window.__dpN=15;dpViecTai(false)">'+ds.map(function(x){return '<option value="'+x[0]+'"'+(x[0]===X?' selected':'')+'>'+x[1]+'</option>'}).join('')+'</select></div>'; }
function dpViecVe(){ var el=document.getElementById('dpViec'); if(!el) return;
  if(window.__dpV&&window.__qtDaNap){ dpViecTai(false); return; }
  el.innerHTML='<div class="dp-the"><div class="dp-m">Danh sách việc từng xưởng theo hạn đơn (đơn ưu tiên trước) – giống trưởng phòng đang thấy.</div><button class="btn sm" type="button" onclick="dpViecTai(false)" style="margin-top:6px">Xem việc theo xưởng</button></div>'; }
function dpViecThem(){ window.__dpN=(window.__dpN||15)+15; dpViecTai(false); }
</script>
''' + s[_k39:]
