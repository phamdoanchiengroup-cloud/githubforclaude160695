/* =====================================================================
   TAB KỸ NĂNG (22/10) – máy chủ: ky-nang/ky-nang.gs
   Trưởng / phó phòng: ma trận người × kỹ năng của xưởng, đề xuất kỹ năng, ghi kết quả kiểm tra (cấp 1–4).
   Ban điều hành: duyệt danh mục + trọng số, xác nhận cấp 3–4, báo cáo độ phủ / điểm nghẽn.
   Nhân sự, trợ lý: chỉ xem. Công nhân: "Kỹ năng của tôi" + kỹ năng có thể học tiếp.
   ===================================================================== */
var KN=null, knXem='mt', knX='', knLocCD='';
var KN_MO_TA={1:'Đã được dạy, còn cần người kèm',2:'Tự làm đạt đủ tiêu chí',3:'Đạt năng suất, tự xử lý lỗi thường gặp',4:'Dạy và kiểm được người khác'};
(function(){
  var st=document.createElement('style');
  st.textContent=
    '.kn-o{display:inline-flex;align-items:center;justify-content:center;min-width:26px;height:26px;border-radius:7px;font:700 13px var(--mono);border:1.5px solid transparent}'+
    '.kn-o.c0{color:var(--ink3,#777);border-color:rgba(168,164,155,.25)}'+
    '.kn-o.c1{background:rgba(168,164,155,.16);color:var(--ink2)}'+
    '.kn-o.c2{background:rgba(var(--acc-rgb),.16);color:var(--cyan)}'+
    '.kn-o.c3{background:rgba(74,222,128,.18);color:var(--green)}'+
    '.kn-o.c4{background:rgba(242,169,59,.22);color:var(--amber)}'+
    '.kn-o.het{border-color:var(--amber);border-style:dashed}'+
    '.kn-o .cho{font-size:10px;margin-left:1px}'+
    'table.kn-mt th,table.kn-mt td{text-align:center;padding:5px 6px;white-space:nowrap}'+
    'table.kn-mt th:first-child,table.kn-mt td:first-child{text-align:left;position:sticky;left:0;background:var(--bg2,var(--card,#16181c));z-index:1}'+
    'table.kn-mt th.kn-h{max-width:92px;overflow:hidden;text-overflow:ellipsis;font-size:11.5px}'+
    'table.kn-mt button.kn-b{background:none;border:0;padding:2px;cursor:pointer}'+
    'table.kn-mt tr.kn-tong td{font-size:12px;color:var(--ink2)}'+
    'td.kn-nghen{color:var(--red)!important;font-weight:700}'+
    '.kn-the{border:1px solid var(--line,rgba(168,164,155,.18));border-radius:10px;padding:12px 14px;margin-bottom:10px}'+
    '.kn-the h4{margin:0 0 6px;font-size:15px}'+
    '.kn-the ol{margin:6px 0 6px 18px;padding:0}'+
    '.kn-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0 14px}'+
    '.kn-tabs .btn.on{background:rgba(var(--acc-rgb),.18);border-color:var(--cyan);color:var(--cyan)}'+
    '.kn-hop{position:fixed;inset:0;background:rgba(12,13,15,.82);z-index:180;display:flex;align-items:flex-start;justify-content:center;padding:24px 16px;overflow-y:auto}'+
    '.kn-hop .card{max-width:640px;width:100%;margin:0}'+
    '.kn-cap label,label.kn-chk,.kn-cds label{display:flex;gap:8px;align-items:flex-start;padding:5px 0;cursor:pointer;text-transform:none;letter-spacing:0;font-size:14px;color:var(--ink);margin:0}'+
    '.kn-hop input[type=radio],.kn-hop input[type=checkbox]{width:18px;height:18px;flex:none;padding:0;margin:3px 0 0;accent-color:var(--cyan)}'+
    '.kn-cap .nho{text-transform:none}'+
    '.kn-cds{max-height:220px;overflow-y:auto;border:1px solid var(--line,rgba(168,164,155,.18));border-radius:8px;padding:6px 10px}'+
    '.kn-cds label{font-size:13px;padding:3px 0}';
  document.head.appendChild(st);
})();

function knTenXuong(m){ if(m==='*')return 'Dùng chung'; var p=(D.phongban||[]).filter(function(x){return x.MaXuong===m})[0]; return p?p.TenXuong:m; }
function knTenNguoi(tk){ return (KN&&KN.ten&&KN.ten[tk])||tk||''; }
function knTenCD(ma){ var c=(D.congdoan||[]).filter(function(x){return String(x.MaCD)===String(ma)})[0]; return c?c.TenCD:ma; }
function knNgay(s){ s=String(s||''); return /^\d{4}-\d{2}-\d{2}/.test(s)?s.slice(8,10)+'/'+s.slice(5,7)+'/'+s.slice(0,4):s; }
function knO(cap,g){
  if(!cap) return '<span class="kn-o c0">·</span>';
  return '<span class="kn-o c'+cap+(g&&g.hetHan?' het':'')+'" title="'+esc(KN.cap[cap]+(g&&g.hetHan?' – đã quá hạn kiểm lại':''))+'">'+cap+'</span>';
}
function knHT(ma,k){ return (KN.gn||[]).filter(function(g){return g.MaNV===ma&&g.MaKN===k&&g.TrangThai==='Đã xác nhận'})[0]||null; }
function knChoGN(ma,k){ return (KN.gn||[]).filter(function(g){return g.MaNV===ma&&g.MaKN===k&&g.TrangThai==='Chờ xác nhận'})[0]||null; }
function knCuaXuong(x,chiDuyet){
  return (KN.kn||[]).filter(function(k){ return (k.MaXuong===x||k.MaXuong==='*') && (!chiDuyet||k.TrangThai==='Đã duyệt'); });
}
function knNguoiXuong(x){
  return sxTen((D.nhansu||[]).filter(function(n){return n.MaXuong===x&&String(n.TrangThai).trim()!=='Nghỉ việc'}));
}
function knSo(n){ return String(Math.round(n*10)/10).replace('.',','); }

/* ---------- vào tab ---------- */
function vKN(){
  $('main').innerHTML='<div class="ptitle">'+(ME.vaiTro==='CN'?'Kỹ năng của tôi':'Kỹ năng')+'</div><div class="pdesc">Đang tải…</div>';
  call('layKyNang',[],function(r){
    if(!r.ok){ $('main').innerHTML='<div class="alert a-wn">'+esc(r.msg)+'</div>'; return; }
    KN=r;
    if(r.quyen==='cn'){ knVeToi(); return; }
    if(r.quyen==='tp') knX=r.xuong;                                   // trưởng / phó phòng: luôn xưởng mình
    else if(!knX) knX=ME.xuong||(((D.phongban||[])[0]||{}).MaXuong||'');
    knVe();
  });
}
/* Hàm ghi trả kèm dữ liệu mới của tab (máy chủ: knDuLieu_) -> vẽ lại ngay, khỏi gọi tải lại lần 2 */
function knNhan(r){ if(r&&r.kn){ KN=r; if(r.quyen==='cn')knVeToi(); else knVe(); } else knTai(); }
function knTai(){ call('layKyNang',[],function(r){ if(r.ok){ KN=r; if(r.quyen==='cn')knVeToi(); else knVe(); } }); }

function knVe(){
  var q=KN.quyen, x=knX;
  var choKN=(KN.kn||[]).filter(function(k){return k.TrangThai==='Chờ duyệt'||(k.BanSua&&k.TrangThai==='Đã duyệt')}).length;
  var choGN=(KN.gn||[]).filter(function(g){return g.TrangThai==='Chờ xác nhận'}).length;
  var h='<div class="ptitle">Kỹ năng</div>'+
    '<div class="pdesc">Năng lực đã kiểm tra của từng người – dùng để phân công, đào tạo và xét tăng lương. Điểm kỹ năng hiện là <b>mô phỏng</b>, chưa tính vào lương.</div>';
  h+='<div class="kn-tabs">'+[['mt','Ma trận'],['dm','Danh mục kỹ năng'],['cho','Chờ duyệt'+((choKN+choGN)?' ('+(choKN+choGN)+')':'')],['bc','Báo cáo']].map(function(t){
    return '<button class="btn'+(knXem===t[0]?' on':'')+'" onclick="knXem=\''+t[0]+'\';knVe()">'+t[1]+'</button>'; }).join('')+'</div>';
  if(q!=='tp' && knXem!=='cho'){
    h+='<div style="margin-bottom:12px"><label>Xưởng</label> <select onchange="knX=this.value;knVe()">'+(D.phongban||[]).map(function(p){
      return '<option value="'+esc(p.MaXuong)+'"'+(p.MaXuong===x?' selected':'')+'>'+esc(p.TenXuong)+'</option>'; }).join('')+'</select></div>';
  }
  h+='<div id="knNoi"></div>';
  $('main').innerHTML=h;
  $('knNoi').innerHTML=({mt:knMaTran,dm:knDanhMuc,cho:knChoDuyet,bc:knBaoCao}[knXem]||knMaTran)();
}

/* ---------- 1. Ma trận ---------- */
function knMaTran(){
  var x=knX, ks=knCuaXuong(x,true), ns=knNguoiXuong(x), q=KN.quyen;
  var h='<div class="nho" style="margin-bottom:8px">'+[1,2,3,4].map(function(c){return knO(c)+' '+esc(KN.cap[c])}).join(' &nbsp; ')+
    ' &nbsp; <span class="kn-o c3 het">3</span> quá hạn kiểm lại &nbsp; ⏳ chờ ban điều hành xác nhận</div>';
  if(!ks.length) return h+'<div class="empty">Xưởng này chưa có kỹ năng được duyệt. Vào <b>Danh mục kỹ năng</b> để '+(q==='tp'?'đề xuất':'thêm / duyệt')+'.</div>';
  if(!ns.length) return h+'<div class="empty">Chưa có nhân sự.</div>';
  var dem={}; ks.forEach(function(k){ dem[k.MaKN]={d:0,k4:0}; });
  h+='<div class="tw"><table class="kn-mt"><thead><tr><th>Người</th>'+ks.map(function(k){
      return '<th class="kn-h" title="'+esc(k.TenKN)+' (trọng số '+esc(k.TrongSo)+')">'+esc(k.TenKN)+'</th>'; }).join('')+'<th>Điểm</th></tr></thead><tbody>';
  ns.forEach(function(n){
    h+='<tr><td>'+esc(n.HoTen)+(String(n.laTP).toUpperCase()==='TRUE'?' <span class="pill p-gr">TP</span>':'')+'</td>';
    ks.forEach(function(k){
      var g=knHT(n.MaNV,k.MaKN), c=knChoGN(n.MaNV,k.MaKN), cap=g?g.Cap:0;
      if(cap>=2&&!g.hetHan) dem[k.MaKN].d++; if(cap===4&&!g.hetHan) dem[k.MaKN].k4++;
      h+='<td><button class="kn-b" aria-label="'+esc(n.HoTen+' – '+k.TenKN)+'" onclick="knMoGan(\''+esc(n.MaNV)+'\',\''+esc(k.MaKN)+'\')">'+knO(cap,g)+(c?'<span class="cho">⏳</span>':'')+'</button></td>';
    });
    h+='<td class="n">'+knSo((KN.diem||{})[n.MaNV]||0)+'</td></tr>';
  });
  h+='<tr class="kn-tong"><td>Số người làm được (cấp 2+)</td>'+ks.map(function(k){ var d=dem[k.MaKN].d;
    return '<td class="'+(d<2?'kn-nghen':'')+'" title="'+(d<2?'Điểm nghẽn: dưới 2 người làm được':'')+'">'+d+'</td>'; }).join('')+'<td></td></tr>';
  h+='<tr class="kn-tong"><td>Kèm được (cấp 4)</td>'+ks.map(function(k){ var d=dem[k.MaKN].k4; return '<td class="'+(d<1?'kn-nghen':'')+'">'+d+'</td>'; }).join('')+'<td></td></tr>';
  h+='</tbody></table></div><div class="nho" style="margin-top:6px">Bấm vào ô để '+(q==='xem'?'xem chi tiết':'ghi kết quả kiểm tra')+'. Số đỏ = <b>điểm nghẽn</b> (dưới 2 người làm được, hoặc chưa ai kèm được). '+
    'Điểm = trọng số (A 1 · B 2 · C 3) × cấp (2 → 1 · 3 → 1,5 · 4 → 2).</div>';
  return h;
}

/* ---------- hộp thoại dùng chung ---------- */
function knHop(h){ knDong(); var d=document.createElement('div'); d.className='kn-hop'; d.id='knHop'; d.innerHTML='<div class="card">'+h+'</div>';
  d.addEventListener('click',function(e){ if(e.target===d) knDong(); }); document.body.appendChild(d); }
function knDong(){ var d=$('knHop'); if(d) d.remove(); }
document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&$('knHop')) knDong(); });

/* ---------- 2. Ghi kết quả kiểm tra cho 1 người × 1 kỹ năng ---------- */
function knMoGan(ma,mk){
  var n=(D.nhansu||[]).filter(function(x){return x.MaNV===ma})[0]||{HoTen:ma}, k=(KN.kn||[]).filter(function(x){return x.MaKN===mk})[0];
  if(!k) return;
  var g=knHT(ma,mk), c=knChoGN(ma,mk), q=KN.quyen, sua=(q==='bdh'||(q==='tp'&&String(n.laTP).toUpperCase()!=='TRUE'&&ma!==ME.maNV));
  var h='<h3>'+esc(n.HoTen)+'<span>'+esc(k.TenKN)+' · trọng số '+esc(k.TrongSo)+'</span></h3>';
  h+='<div class="nho" style="margin-bottom:8px">'+esc(k.MoTa)+'</div>';
  h+='<div style="margin-bottom:10px">Hiện tại: '+(g?knO(g.Cap,g)+' <b>'+esc(KN.cap[g.Cap])+'</b> · kiểm '+knNgay(g.NgayKiem)+' bởi '+esc(knTenNguoi(g.NguoiKiem))+
     (g.HetHan?' · hạn kiểm lại '+knNgay(g.HetHan)+(g.hetHan?' <span class="pill p-wn">quá hạn</span>':''):''):'<b>chưa có</b>')+'</div>';
  if(c) h+='<div class="alert a-nu">⏳ Đang chờ ban điều hành xác nhận <b>cấp '+c.Cap+' – '+esc(KN.cap[c.Cap])+'</b> (kiểm '+knNgay(c.NgayKiem)+', '+esc(knTenNguoi(c.NguoiKiem))+'). Ghi lần mới sẽ thay đề nghị này.</div>';
  // gợi ý từ bảng công đoạn (chỉ gợi ý – kỹ năng chỉ ghi khi đã kiểm tra thực tế)
  var cds=String(k.CongDoan||'').split(',').filter(Boolean), co=String(n.CongDoanLamDuoc||'').split(/[,;]\s*/), muc={};
  try{ muc=JSON.parse(n.MucKyNang||'{}')||{}; }catch(e){}
  var lam=cds.filter(function(m){ return co.indexOf(m)>=0 && muc[m]!=='hoc'; }).length;
  h+='<div class="nho" style="margin-bottom:10px">Theo bảng công đoạn: làm được <b>'+lam+'/'+cds.length+'</b> công đoạn liên quan ('+cds.map(knTenCD).map(esc).join(', ')+').'+
     (lam===cds.length&&(!g||g.Cap<2)?' <b>Nên kiểm tra</b> để ghi nhận.':'')+'</div>';
  if(sua){
    var cap0=g?Math.min(4,g.Cap+(g.Cap<4&&!g.hetHan?1:0)):1;
    h+='<div class="kn-cap">'+[1,2,3,4].map(function(cc){
      return '<label><input type="radio" name="kn_cap" value="'+cc+'"'+(cc===cap0?' checked':'')+' onchange="knDoiCap()"> '+knO(cc)+' <span><b>'+esc(KN.cap[cc])+'</b><br><span class="nho">'+esc(KN_MO_TA[cc])+'</span></span></label>'; }).join('')+'</div>';
    h+='<div style="margin:10px 0 4px"><b>Tiêu chí đạt</b> <span class="nho">(cấp 2 trở lên phải đạt đủ)</span></div>'+
      (k.TieuChi||[]).map(function(t,i){ return '<label class="kn-chk"><input type="checkbox" class="kn_tc" value="'+i+'"> <span>'+esc(t)+'</span></label>'; }).join('');
    h+='<div style="margin-top:10px"><label>Bằng chứng kiểm tra <span class="nho">(mã lô / sản phẩm đã kiểm, kết quả)</span></label><textarea id="kn_bc" rows="2" maxlength="500" style="width:100%"></textarea></div>';
    h+='<div class="row" style="gap:10px;margin-top:8px;flex-wrap:wrap"><div><label>Ngày kiểm</label><input type="date" id="kn_ngay" value="'+today()+'" max="'+today()+'"></div>'+
       '<div style="flex:1;min-width:200px" id="kn_lyDoO"><label>Lý do <span class="nho">(bắt buộc khi hạ cấp)</span></label><input id="kn_lyDo" maxlength="300" style="width:100%"></div></div>';
    h+='<div class="nho" id="kn_ghiChu" style="margin-top:8px"></div>';
    h+='<div class="acts" style="margin-top:12px"><button class="btn pri" onclick="knLuuGan(\''+esc(ma)+'\',\''+esc(mk)+'\')">Lưu</button>'+
       (g?'<button class="btn" onclick="knThuHoi(\''+esc(ma)+'\',\''+esc(mk)+'\')">Thu hồi</button>':'')+
       '<button class="btn" onclick="knDong()">Đóng</button></div>';
  } else {
    h+='<ol>'+(k.TieuChi||[]).map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ol>';
    if(q==='tp') h+='<div class="note">Kỹ năng của trưởng / phó phòng (và của chính bạn) do ban điều hành xác nhận.</div>';
    h+='<div class="acts" style="margin-top:12px"><button class="btn" onclick="knDong()">Đóng</button></div>';
  }
  var ls=(KN.gn||[]).filter(function(x){return x.MaNV===ma&&x.MaKN===mk&&(x.TrangThai==='Từ chối'||x.TrangThai==='Thu hồi')});
  if(ls.length) h+='<div class="nho" style="margin-top:10px">Lịch sử: '+ls.map(function(x){return esc(x.TrangThai)+' cấp '+x.Cap+' ('+knNgay(x.NgayXacNhan)+')'+(x.LyDo?': '+esc(x.LyDo):'')}).join(' · ')+'</div>';
  knHop(h); knMoGan._g=g; if(sua) knDoiCap();
}
function knDoiCap(){
  var e=document.querySelector('input[name="kn_cap"]:checked'), cap=e?+e.value:1, g=knMoGan._g, capCu=g?g.Cap:0, gc=[];
  if(cap>=2) gc.push('Cần tích đủ tiêu chí và ghi bằng chứng.');
  if(cap>=3&&KN.quyen==='tp'&&cap>capCu) gc.push('Cấp 3–4 sẽ <b>chờ ban điều hành xác nhận</b>; trong lúc chờ vẫn giữ cấp hiện tại.');
  if(cap<capCu) gc.push('<span class="vang">Hạ cấp '+capCu+' → '+cap+': ghi lý do.</span>');
  if(cap>=2) gc.push('Hạn kiểm lại: '+KN.hanThang+' tháng.');
  if($('kn_ghiChu')) $('kn_ghiChu').innerHTML=gc.join(' ');
}
function knLuuGan(ma,mk){
  var e=document.querySelector('input[name="kn_cap"]:checked');
  var o={maNV:ma, maKN:mk, cap:e?+e.value:0, tieuChiDat:Array.prototype.map.call(document.querySelectorAll('.kn_tc:checked'),function(c){return +c.value}),
    bangChung:$('kn_bc').value, ngayKiem:$('kn_ngay').value, lyDo:$('kn_lyDo').value};
  call('ganKyNang',[o],function(r){ toast(r.msg,r.ok); if(r.ok){ knDong(); knNhan(r); } });
}
function knThuHoi(ma,mk){
  var ly=prompt('Lý do thu hồi kỹ năng (lỗi chất lượng lặp lại, gian lận khi kiểm…):'); if(ly===null) return;
  call('thuHoiKyNang',[ma,mk,ly],function(r){ toast(r.msg,r.ok); if(r.ok){ knDong(); knNhan(r); } });
}

/* ---------- 3. Danh mục ---------- */
function knTheKN(k,coDuyet){
  var q=KN.quyen, tt=k.TrangThai, pill={'Chờ duyệt':'p-wn','Trả lại':'p-bd','Đã duyệt':'p-ok','Ngừng':'p-gr'}[tt]||'p-gr';
  var h='<div class="kn-the"><h4>'+esc(k.TenKN)+' <span class="pill '+pill+'">'+esc(tt)+'</span>'+
    (k.TrongSo?' <span class="pill p-nu">Trọng số '+esc(k.TrongSo)+'</span>':'')+(k.MaXuong==='*'?' <span class="pill p-gr">Dùng chung</span>':'')+
    (k.BanSua?' <span class="pill p-wn">Có bản sửa chờ duyệt</span>':'')+'</h4>';
  if(coDuyet||k.MaXuong!==knX) h+='<div class="nho">'+esc(knTenXuong(k.MaXuong))+'</div>';
  if(k.Nhom) h+='<div class="nho">Nhóm: '+esc(k.Nhom)+'</div>';
  h+='<div style="margin:4px 0">'+esc(k.MoTa)+'</div>';
  h+='<div class="nho">Tiêu chí đạt'+(+k.PhienBan>1?' (bản '+esc(k.PhienBan)+')':'')+':</div><ol>'+(k.TieuChi||[]).map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ol>';
  h+='<div class="nho">Công đoạn liên quan: '+String(k.CongDoan||'').split(',').filter(Boolean).map(knTenCD).map(esc).join(', ')+'</div>';
  if(k.LyDo) h+='<div class="nho">Vì sao cần: '+esc(k.LyDo)+'</div>';
  h+='<div class="nho">Đề xuất: '+esc(knTenNguoi(k.NguoiDeXuat))+' · '+knNgay(k.NgayDeXuat)+(k.NguoiDuyet?' — '+(tt==='Trả lại'?'Trả lại':'Duyệt')+': '+esc(knTenNguoi(k.NguoiDuyet))+' · '+knNgay(k.NgayDuyet):'')+'</div>';
  if(k.GhiChuDuyet&&tt!=='Đã duyệt') h+='<div class="alert a-wn" style="margin:8px 0 0">'+esc(k.GhiChuDuyet)+'</div>';
  else if(k.GhiChuDuyet) h+='<div class="nho">Ghi chú: '+esc(k.GhiChuDuyet)+'</div>';
  if(k.BanSua){
    var b=k.BanSua, tc=[]; try{ tc=JSON.parse(b.TieuChi||'[]'); }catch(e){}
    h+='<div class="kn-the" style="margin:8px 0 0;border-style:dashed"><b>Bản sửa đề nghị</b> ('+esc(knTenNguoi(b.NguoiSua))+' · '+knNgay(b.NgaySua)+')'+
      (b.TenKN!==k.TenKN?'<div>Tên: '+esc(b.TenKN)+'</div>':'')+(b.MoTa!==k.MoTa?'<div>Mô tả: '+esc(b.MoTa)+'</div>':'')+
      '<ol>'+tc.map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ol>'+
      (b.CongDoan!==k.CongDoan?'<div class="nho">Công đoạn: '+String(b.CongDoan||'').split(',').map(knTenCD).map(esc).join(', ')+'</div>':'')+'</div>';
  }
  var nut=[];
  var cuaToi=(q==='tp'&&(k.MaXuong===KN.xuong||(k.MaXuong==='*'&&k.NguoiDeXuat===ME.tk)));
  if(tt!=='Ngừng'&&(q==='bdh'||cuaToi)) nut.push('<button class="btn" onclick="knMoForm(\''+esc(k.MaKN)+'\')">✎ Sửa</button>');
  if(q==='tp'&&cuaToi&&(tt==='Chờ duyệt'||tt==='Trả lại')) nut.push('<button class="btn" onclick="knNgung(\''+esc(k.MaKN)+'\',true)">Rút đề xuất</button>');
  if(q==='bdh'&&tt==='Đã duyệt') nut.push('<button class="btn" onclick="knNgung(\''+esc(k.MaKN)+'\')">Ngừng</button>');
  if(q==='bdh'&&(tt==='Chờ duyệt'||(tt==='Đã duyệt'&&k.BanSua))){
    var id='kd_'+k.MaKN;
    h+='<div class="row" style="gap:8px;margin-top:10px;flex-wrap:wrap;align-items:end"><div><label>Trọng số</label><select id="'+id+'_ts">'+
      (tt==='Đã duyệt'?'<option value="">giữ '+esc(k.TrongSo)+'</option>':'<option value="">– chọn –</option>')+
      [['A','A – cơ bản (1)'],['B','B – trung bình (2)'],['C','C – khó / ảnh hưởng chất lượng (3)']].map(function(o){return '<option value="'+o[0]+'">'+o[1]+'</option>'}).join('')+'</select></div>'+
      '<div style="flex:1;min-width:180px"><label>Ghi chú (bắt buộc khi trả lại)</label><input id="'+id+'_gc" maxlength="300" style="width:100%"></div>'+
      '<button class="btn pri" onclick="knDuyet(\''+esc(k.MaKN)+'\',true)">Duyệt</button><button class="btn" onclick="knDuyet(\''+esc(k.MaKN)+'\',false)">Trả lại</button></div>';
  }
  if(nut.length) h+='<div class="acts" style="margin-top:10px">'+nut.join('')+'</div>';
  return h+'</div>';
}
function knDanhMuc(){
  var q=KN.quyen, x=knX, ks=knCuaXuong(x,false).filter(function(k){return q!=='tp'||k.MaXuong===KN.xuong||k.MaXuong==='*'});
  var h='';
  if(q==='tp'||q==='bdh') h+='<div class="acts" style="margin-bottom:10px"><button class="btn pri" onclick="knMoForm()">+ '+(q==='bdh'?'Thêm':'Đề xuất')+' kỹ năng</button></div>';
  h+='<details class="kn-the"><summary><b>Cách viết một kỹ năng tốt</b></summary><div class="nho" style="margin-top:6px">'+
    '• Một kỹ năng = một năng lực <b>kiểm tra được tại chỗ trong 15–30 phút</b>, thường bao 3–10 công đoạn. Mỗi xưởng khoảng <b>8–15 kỹ năng</b> (quá 20 là đang chép lại công đoạn).<br>'+
    '• <b>Tên</b> = động từ + đối tượng + chuẩn, vd. "Phun PU bóng đạt độ phủ đều". Không dùng tính cách ("cẩn thận", "chăm chỉ").<br>'+
    '• <b>Tiêu chí đạt</b>: 2–8 dòng, mỗi dòng đo / nhìn được, nên có 1 dòng an toàn. Vd: pha đúng tỉ lệ không cần nhắc · 10 cây liên tiếp không chảy, không rỗ · đạt ≥ 80% định mức giờ · đeo mặt nạ, găng đúng quy định.<br>'+
    '• Ban điều hành đặt <b>trọng số</b>: A cơ bản · B trung bình · C khó / ảnh hưởng lớn tới chất lượng.</div></details>';
  var soDung=ks.filter(function(k){return k.MaXuong===x&&k.TrangThai!=='Ngừng'}).length;
  if(soDung>20) h+='<div class="alert a-wn">Xưởng có '+soDung+' kỹ năng – nhiều quá, có thể đang chia nhỏ như công đoạn. Nên gộp lại.</div>';
  var thu={'Chờ duyệt':0,'Trả lại':1,'Đã duyệt':2,'Ngừng':3};
  ks.sort(function(a,b){ return (thu[a.TrangThai]-thu[b.TrangThai]) || (a.MaXuong==='*')-(b.MaXuong==='*') || (a.TenKN<b.TenKN?-1:1); });
  var ngung=ks.filter(function(k){return k.TrangThai==='Ngừng'}), con=ks.filter(function(k){return k.TrangThai!=='Ngừng'});
  if(!con.length) h+='<div class="empty">Chưa có kỹ năng nào cho '+esc(knTenXuong(x))+'.</div>';
  h+=con.map(function(k){return knTheKN(k)}).join('');
  if(ngung.length) h+='<details><summary class="nho">Đã ngừng ('+ngung.length+')</summary>'+ngung.map(function(k){return knTheKN(k)}).join('')+'</details>';
  return h;
}
function knDuyet(mk,ok){
  var id='kd_'+mk, ts=$(id+'_ts')?$(id+'_ts').value:'', gc=$(id+'_gc')?$(id+'_gc').value:'';
  call('bdhDuyetKyNang',[mk,ok,ts,gc],function(r){ toast(r.msg,r.ok); if(r.ok) knNhan(r); });
}
function knNgung(mk,rut){
  var ly=prompt(rut?'Rút đề xuất này? Ghi chú (không bắt buộc):':'Lý do ngừng kỹ năng (người đang có sẽ không còn tính điểm):'); if(ly===null) return;
  call('ngungKyNang',[mk,ly],function(r){ toast(r.msg,r.ok); if(r.ok) knNhan(r); });
}

/* Form đề xuất / sửa */
function knMoForm(mk){
  var q=KN.quyen, k=mk?(KN.kn||[]).filter(function(x){return x.MaKN===mk})[0]:null, src=k&&k.BanSua?k.BanSua:k;
  var tc=src?(Array.isArray(src.TieuChi)?src.TieuChi:(function(){try{return JSON.parse(src.TieuChi)}catch(e){return []}})()):[];
  var x=src?src.MaXuong:(q==='tp'?KN.xuong:knX);
  var xs=q==='tp'?[[KN.xuong,knTenXuong(KN.xuong)]]:(D.phongban||[]).map(function(p){return [p.MaXuong,p.TenXuong]});
  xs.push(['*','Dùng chung (nhiều xưởng)']);
  var h='<h3>'+(k?'Sửa kỹ năng':(q==='bdh'?'Thêm kỹ năng':'Đề xuất kỹ năng'))+'<span>'+(q==='tp'?(k&&k.TrangThai==='Đã duyệt'?'bản sửa sẽ chờ ban điều hành duyệt lại':'gửi ban điều hành duyệt'):'')+'</span></h3>';
  h+='<div><label>Tên kỹ năng</label><input id="kf_ten" maxlength="80" style="width:100%" placeholder="vd. Phun PU bóng đạt độ phủ đều" value="'+esc(src?src.TenKN:'')+'"></div>';
  h+='<div class="row" style="gap:10px;margin-top:8px;flex-wrap:wrap"><div><label>Xưởng</label><select id="kf_x" onchange="knVeCD()">'+xs.map(function(o){
      return '<option value="'+esc(o[0])+'"'+(o[0]===x?' selected':'')+'>'+esc(o[1])+'</option>'; }).join('')+'</select></div>'+
    '<div style="flex:1;min-width:160px"><label>Nhóm <span class="nho">(không bắt buộc)</span></label><input id="kf_nhom" maxlength="40" style="width:100%" value="'+esc(src?src.Nhom:'')+'"></div>'+
    (q==='bdh'?'<div><label>Trọng số</label><select id="kf_ts">'+['','A','B','C'].map(function(t){return '<option value="'+t+'"'+(k&&k.TrongSo===t?' selected':'')+'>'+(t||'– chọn –')+'</option>'}).join('')+'</select></div>':'')+'</div>';
  h+='<div style="margin-top:8px"><label>Mô tả <span class="nho">(làm việc gì, trên sản phẩm / máy nào)</span></label><textarea id="kf_mota" rows="2" maxlength="500" style="width:100%">'+esc(src?src.MoTa:'')+'</textarea></div>';
  h+='<div style="margin-top:8px"><label>Tiêu chí đạt <span class="nho">(mỗi dòng 1 tiêu chí đo / nhìn được, 2–8 dòng)</span></label><textarea id="kf_tc" rows="5" style="width:100%" placeholder="Pha đúng tỉ lệ không cần nhắc&#10;10 cây liên tiếp không chảy, không rỗ&#10;Đạt ≥ 80% định mức giờ&#10;Đeo mặt nạ, găng đúng quy định">'+esc(tc.join('\n'))+'</textarea></div>';
  h+='<div style="margin-top:8px"><label>Công đoạn liên quan</label><input id="kf_loc" placeholder="Lọc theo tên…" oninput="knLocCD=this.value;knVeCD()" style="width:100%;margin-bottom:6px"><div class="kn-cds" id="kf_cds"></div></div>';
  h+='<div style="margin-top:8px"><label>Vì sao cần kỹ năng này <span class="nho">(không bắt buộc – thiếu người, hay lỗi…)</span></label><input id="kf_lydo" maxlength="300" style="width:100%" value="'+esc(src?src.LyDo||'':'')+'"></div>';
  h+='<div class="acts" style="margin-top:12px"><button class="btn pri" onclick="knLuuForm('+(mk?'\''+esc(mk)+'\'':'')+')">'+(k?'Lưu':(q==='bdh'?'Thêm':'Gửi đề xuất'))+'</button><button class="btn" onclick="knDong()">Hủy</button></div>';
  knLocCD=''; knMoForm._chon={}; String(src?src.CongDoan:'').split(',').filter(Boolean).forEach(function(m){knMoForm._chon[m]=1});
  knHop(h); knVeCD();
}
function knVeCD(){
  var x=$('kf_x').value, loc=String(knLocCD||'').toLowerCase(), chon=knMoForm._chon;
  Array.prototype.forEach.call(document.querySelectorAll('.kf_cd'),function(c){ if(c.checked) chon[c.value]=1; else delete chon[c.value]; });
  var cds=(D.congdoan||[]).filter(function(c){ return String(c.TrangThai).trim()!=='Ngừng' && (x==='*'||c.MaXuong===x) && (!loc||String(c.TenCD).toLowerCase().indexOf(loc)>=0||chon[c.MaCD]); });
  $('kf_cds').innerHTML=cds.length?cds.map(function(c){ return '<label><input type="checkbox" class="kf_cd" value="'+esc(c.MaCD)+'"'+(chon[c.MaCD]?' checked':'')+'> '+esc(c.TenCD)+
    (x==='*'?' <span class="nho">· '+esc(knTenXuong(c.MaXuong))+'</span>':'')+'</label>'; }).join(''):'<div class="nho">Không có công đoạn.</div>';
}
function knLuuForm(mk){
  knVeCD();
  var o={TenKN:$('kf_ten').value, MaXuong:$('kf_x').value, Nhom:$('kf_nhom').value, MoTa:$('kf_mota').value, TieuChi:$('kf_tc').value,
    CongDoan:Object.keys(knMoForm._chon), LyDo:$('kf_lydo').value, TrongSo:$('kf_ts')?$('kf_ts').value:''};
  var fn=mk?'suaKyNang':'deXuatKyNang', a=mk?[mk,o]:[o];
  call(fn,a,function(r){ toast(r.msg,r.ok); if(r.ok){ knDong(); knXem='dm'; if(KN.quyen!=='tp') knX=o.MaXuong==='*'?knX:o.MaXuong; knNhan(r); } });
}

/* ---------- 4. Chờ duyệt ---------- */
function knChoDuyet(){
  var q=KN.quyen, h='';
  var ks=(KN.kn||[]).filter(function(k){return k.TrangThai==='Chờ duyệt'||(k.TrangThai==='Đã duyệt'&&k.BanSua)||(q==='tp'&&k.TrangThai==='Trả lại')});
  h+='<h3 style="margin:4px 0 8px">Kỹ năng chờ duyệt ('+ks.length+')</h3>';
  h+=ks.length?ks.map(function(k){return knTheKN(k,true)}).join(''):'<div class="empty">Không có.</div>';
  var gs=(KN.gn||[]).filter(function(g){return g.TrangThai==='Chờ xác nhận'});
  var tenNV={}; (D.nhansu||[]).forEach(function(n){tenNV[n.MaNV]=n.HoTen});
  var tenKN={}; (KN.kn||[]).forEach(function(k){tenKN[k.MaKN]=k.TenKN});
  h+='<h3 style="margin:18px 0 8px">Cấp 3–4 chờ xác nhận ('+gs.length+')</h3>';
  if(!gs.length) return h+'<div class="empty">Không có.</div>';
  h+='<div class="tw"><table><thead><tr><th>Người</th><th>Kỹ năng</th><th>Cấp</th><th>Kiểm</th><th>Bằng chứng</th>'+(q==='bdh'?'<th></th>':'')+'</tr></thead><tbody>'+
    gs.map(function(g){ return '<tr><td>'+esc(tenNV[g.MaNV]||g.MaNV)+'<div class="nho">'+esc(knTenXuong(g.MaXuong))+'</div></td><td>'+esc(tenKN[g.MaKN]||g.MaKN)+'</td>'+
      '<td>'+knO(g.CapCu)+' → '+knO(g.Cap)+'</td><td>'+knNgay(g.NgayKiem)+'<div class="nho">'+esc(knTenNguoi(g.NguoiKiem))+'</div></td><td>'+esc(g.BangChung)+'</td>'+
      (q==='bdh'?'<td><button class="btn pri" onclick="knXacNhan(\''+esc(g.MaGN)+'\',true)">Xác nhận</button> <button class="btn" onclick="knXacNhan(\''+esc(g.MaGN)+'\',false)">Từ chối</button></td>':'')+'</tr>'; }).join('')+
    '</tbody></table></div>';
  return h;
}
function knXacNhan(ma,ok){
  var ly=''; if(!ok){ ly=prompt('Lý do từ chối:'); if(ly===null) return; }
  call('bdhXacNhanKyNang',[ma,ok,ly],function(r){ toast(r.msg,r.ok); if(r.ok) knNhan(r); });
}

/* ---------- 5. Báo cáo ---------- */
function knBaoCao(){
  var hn=KN.homNay, sau60=(function(){ var d=new Date(hn+'T00:00:00'); d.setDate(d.getDate()+60); return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); })();
  var tom=function(x){
    var ks=knCuaXuong(x,true), ns=knNguoiXuong(x), ma={}; ns.forEach(function(n){ma[n.MaNV]=1});
    var ht=(KN.gn||[]).filter(function(g){return g.TrangThai==='Đã xác nhận'&&ma[g.MaNV]});
    var dong=ks.map(function(k){ var gs=ht.filter(function(g){return g.MaKN===k.MaKN});
      return { k:k, d:gs.filter(function(g){return g.Cap>=2&&!g.hetHan}).length, k4:gs.filter(function(g){return g.Cap===4&&!g.hetHan}).length,
        hoc:gs.filter(function(g){return g.Cap===1}).length, het:gs.filter(function(g){return g.HetHan&&g.HetHan<=sau60}).length }; });
    var soKN={}; ht.forEach(function(g){ if(g.Cap>=2&&!g.hetHan&&ks.some(function(k){return k.MaKN===g.MaKN})) soKN[g.MaNV]=(soKN[g.MaNV]||0)+1; });
    var daNang=ns.filter(function(n){return (soKN[n.MaNV]||0)>=3}).length;
    return { ks:ks, ns:ns, dong:dong, daNang:daNang, nghen:dong.filter(function(o){return o.d<2||o.k4<1}).length };
  };
  var h='';
  if(KN.quyen!=='tp'){
    h+='<h3 style="margin:4px 0 8px">Toàn nhà máy</h3><div class="tw"><table><thead><tr><th>Xưởng</th><th class="n">Kỹ năng đã duyệt</th><th class="n">Chờ duyệt</th><th class="n">Điểm nghẽn</th><th class="n">Đa năng (≥ 3 kỹ năng)</th></tr></thead><tbody>'+
      (D.phongban||[]).map(function(p){ var t=tom(p.MaXuong), cho=(KN.kn||[]).filter(function(k){return k.MaXuong===p.MaXuong&&k.TrangThai==='Chờ duyệt'}).length;
        return '<tr><td>'+esc(p.TenXuong)+'</td><td class="n">'+t.ks.length+'</td><td class="n">'+cho+'</td><td class="n'+(t.nghen?' kn-nghen':'')+'">'+t.nghen+'</td>'+
          '<td class="n">'+(t.ns.length?Math.round(t.daNang*100/t.ns.length)+'% ('+t.daNang+'/'+t.ns.length+')':'–')+'</td></tr>'; }).join('')+'</tbody></table></div>';
  }
  var t=tom(knX);
  h+='<h3 style="margin:18px 0 8px">'+esc(knTenXuong(knX))+'</h3>';
  h+='<div class="nho" style="margin-bottom:8px">Đa năng: <b>'+t.daNang+'/'+t.ns.length+'</b> người có từ 3 kỹ năng (cấp 2+). Mục tiêu mỗi kỹ năng: ít nhất <b>3 người làm được</b> và <b>1 người kèm được</b>.</div>';
  if(!t.dong.length) return h+'<div class="empty">Chưa có kỹ năng được duyệt.</div>';
  t.dong.sort(function(a,b){return a.d-b.d||a.k4-b.k4});
  h+='<div class="tw"><table><thead><tr><th>Kỹ năng</th><th>TS</th><th class="n">Làm được (2+)</th><th class="n">Kèm được</th><th class="n">Đang học</th><th class="n">Hết hạn ≤ 60 ngày</th></tr></thead><tbody>'+
    t.dong.map(function(o){ return '<tr><td>'+esc(o.k.TenKN)+(o.d<2||o.k4<1?' <span class="pill p-bd">điểm nghẽn</span>':'')+'</td><td>'+esc(o.k.TrongSo)+'</td>'+
      '<td class="n'+(o.d<2?' kn-nghen':'')+'">'+o.d+'</td><td class="n'+(o.k4<1?' kn-nghen':'')+'">'+o.k4+'</td><td class="n">'+o.hoc+'</td><td class="n">'+(o.het||'')+'</td></tr>'; }).join('')+
    '</tbody></table></div>';
  return h;
}

/* ---------- 6. Công nhân: Kỹ năng của tôi ---------- */
function knVeToi(){
  var toi=KN.toi, ks=(KN.kn||[]), d=(KN.diem||{})[toi]||0;
  var co=(KN.gn||[]).filter(function(g){return g.MaNV===toi&&g.TrangThai==='Đã xác nhận'});
  var cho=(KN.gn||[]).filter(function(g){return g.MaNV===toi&&g.TrangThai==='Chờ xác nhận'});
  var tenKN={}; ks.forEach(function(k){tenKN[k.MaKN]=k});
  var h='<div class="ptitle">Kỹ năng của tôi</div><div class="pdesc">Kỹ năng đã được trưởng phòng kiểm tra xác nhận. Học thêm kỹ năng là con đường để được xét tăng lương.</div>';
  h+='<div class="card" style="padding:14px"><div style="font-size:28px;font-weight:700;font-family:var(--mono)">'+knSo(d)+'</div><div class="nho">Điểm kỹ năng (đang chạy thử – chưa tính vào lương)</div></div>';
  h+='<h3 style="margin:16px 0 8px">Đã có ('+co.length+')</h3>';
  h+=co.length?co.map(function(g){ var k=tenKN[g.MaKN]; if(!k) return '';
    return '<div class="kn-the"><h4>'+knO(g.Cap,g)+' '+esc(k.TenKN)+'</h4><div class="nho">'+esc(KN.cap[g.Cap])+' · kiểm '+knNgay(g.NgayKiem)+
      (g.HetHan?' · hạn kiểm lại '+knNgay(g.HetHan)+(g.hetHan?' <span class="pill p-wn">quá hạn – nhờ trưởng phòng kiểm lại</span>':''):'')+'</div>'+
      (g.Cap<4?'<div class="nho" style="margin-top:4px">Lên cấp '+(g.Cap+1)+' – '+esc(KN.cap[g.Cap+1])+': '+esc(KN_MO_TA[g.Cap+1])+'.</div>':'')+'</div>'; }).join(''):'<div class="empty">Chưa có kỹ năng nào được ghi nhận.</div>';
  if(cho.length) h+='<div class="alert a-nu">⏳ Đang chờ ban điều hành xác nhận: '+cho.map(function(g){return esc((tenKN[g.MaKN]||{}).TenKN||'')+' – cấp '+g.Cap}).join(', ')+'</div>';
  var chua=ks.filter(function(k){ return !co.some(function(g){return g.MaKN===k.MaKN}); });
  h+='<h3 style="margin:16px 0 8px">Có thể học thêm ('+chua.length+')</h3>';
  h+=chua.length?chua.map(function(k){ var kem=(KN.kem||{})[k.MaKN]||[];
    return '<details class="kn-the"><summary><b>'+esc(k.TenKN)+'</b> <span class="pill p-nu">'+esc(k.TrongSo)+'</span></summary><div style="margin-top:6px">'+esc(k.MoTa)+'</div>'+
      '<div class="nho" style="margin-top:6px">Tiêu chí để đạt:</div><ol>'+(k.TieuChi||[]).map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ol>'+
      (kem.length?'<div class="nho">Người kèm được: '+kem.map(esc).join(', ')+'</div>':'')+'</details>'; }).join(''):'<div class="empty">Bạn đã có hết kỹ năng của xưởng. Tuyệt vời!</div>';
  $('main').innerHTML=h;
}
