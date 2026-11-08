# -*- coding: utf-8 -*-
"""Vá Index.html – mục 40: tab Nhân sự gọn lại (08/11, chủ dự án).
- Thẻ "Thêm nhân viên" lên đầu, thẻ "Tìm nhân viên" thứ hai, có bộ lọc như Thống kê nhân sự:
  Xưởng, Trạng thái, Chức danh, Thâm niên (< 3 tháng / 3–12 tháng / 1–3 năm / > 3 năm), Độ tuổi (< 25 / 25–34 / 35–44 / 45–54 / ≥ 55).
- Bảng nhân viên (mọi vai trò): bỏ cột Xưởng, bỏ cột KPI, thêm cột Thâm niên (tính từ ngày vào làm).
- "Đón người mới" đã gỡ hẳn ở mục van-hanh (web + máy chủ).
Chạy bằng exec() cuối tests/va-index.py. Kiểm thử: tests/nhan-su-loc-web.js"""

def _t40(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('mục 40: không thấy đúng %d chỗ' % dem, cu[:90], s.count(cu))
    s = s.replace(cu, moi)

# 1) Bỏ ô tìm cũ ở đầu – dựng lại sau thẻ Thêm nhân viên
_t40("""  if(full){
    h+='<div class="card" style="padding:12px 14px"><div style="position:relative">'+
      '<input id="nsTim" placeholder="🔍 Tìm theo tên hoặc mã nhân viên…" '+
      'oninput="locNhanSu()" style="width:100%;background:var(--panel2);border:1px solid var(--line);'+
      'border-radius:9px;padding:10px 12px;color:var(--ink);font-size:14px;font-family:inherit">'+
      '<span id="nsTimKq" style="font-size:12px;color:var(--ink3);margin-top:6px;display:block"></span>'+
      '</div></div>';
  }
""", "")
_t40("""    h+='<div class="acts"><button class="btn pri" onclick="addNS()">Lưu hồ sơ</button></div></div>';
  }
""", """    h+='<div class="acts"><button class="btn pri" onclick="addNS()">Lưu hồ sơ</button></div></div>';
  }
  // 40 (08/11): Tìm nhân viên + bộ lọc (thứ hai, sau Thêm nhân viên)
  if(full) h+=nsTheTim();
""")
# 2) Bảng: bỏ Xưởng + KPI, thêm Thâm niên; mỗi dòng mang thông tin để lọc
_t40("""    '<th>Mã</th><th>Họ tên</th>'+(full?'<th>Xưởng</th>':'')+'<th>Chức danh</th>'+
    '<th class="n">KPI</th><th>Công đoạn làm được</th><th></th></tr></thead><tbody>';""",
"""    '<th>Mã</th><th>Họ tên</th><th>Chức danh</th>'+
    '<th>Thâm niên</th><th>Công đoạn làm được</th><th></th></tr></thead><tbody>';""")
_t40("""    var k=kpi(x.MaNV);
    var lo=k?loai(k.tong):null;
    var timkey=((x.HoTen||'')+' '+(x.MaNV||'')).toLowerCase();
    return '<tr class="ns-row" data-tim="'+esc(timkey)+'"><td class="mono">'+esc(x.MaNV)+'</td><td>'+esc(x.HoTen)+'</td>'+
      (full?'<td class="mono">'+esc(x.MaXuong)+'</td>':'')+'<td>'+esc(x.ChucDanh)+'</td>'+
      '<td class="n">'+(k?'<span class="pill '+lo[1]+'">'+f(k.tong)+'%</span>':'<span style="color:var(--ink3)">–</span>')+'</td>'+""",
"""    var timkey=((x.HoTen||'')+' '+(x.MaNV||'')).toLowerCase(), th=nsThang(x.NgayVaoLam), tu=nsTuoi(x.NamSinh);
    return '<tr class="ns-row" data-tim="'+esc(timkey)+'" data-x="'+esc(x.MaXuong||'')+'" data-tt="'+esc(nsTT(x))+'" data-cd="'+esc(String(x.ChucDanh||'').trim()||'Chưa ghi')+'"'+
      ' data-tn="'+nsNhom(th,NS_TN)+'" data-tuoi="'+nsNhom(tu,NS_TUOI)+'"><td class="mono">'+esc(x.MaNV)+'</td><td>'+esc(x.HoTen)+'</td>'+
      '<td>'+esc(x.ChucDanh)+'</td>'+
      '<td style="white-space:nowrap">'+(th==null?'<span style="color:var(--ink3)">–</span>':'<span title="Vào làm '+esc(dmy(nsNgay(x.NgayVaoLam)))+'"'+(th<3?' style="color:var(--amber)"':'')+'>'+nsTNChu(th)+'</span>')+'</td>'+""")
# 3) Số người mỗi thẻ xưởng: đánh dấu để bộ lọc cập nhật "k / n người"
_t40("""      h+='<div class="card"><h3>'+esc(p.TenXuong)+'<span>'+ds.length+' người</span></h3>'+""",
"""      h+='<div class="card"><h3>'+esc(p.TenXuong)+'<span class="ns-dem" data-n="'+ds.length+'">'+ds.length+' người</span></h3>'+""")
# 4) Lọc: tên/mã + 5 bộ lọc
_t40("""function locNhanSu(){
  var inp=$('nsTim'); if(!inp)return;
  var q=inp.value.trim().toLowerCase();
  var rows=document.querySelectorAll('.ns-row');
  var hien=0;
  rows.forEach(function(tr){
    var ok=!q || (tr.getAttribute('data-tim')||'').indexOf(q)>=0;
    tr.style.display=ok?'':'none';
    if(ok)hien++;
  });""", """/* 40 (08/11): thâm niên / tuổi / bộ lọc tab Nhân sự – cùng nhóm với Thống kê nhân sự */
var NS_TN=[['< 3 tháng',0,3],['3–12 tháng',3,12],['1–3 năm',12,36],['> 3 năm',36,1e9]], NS_TUOI=[['< 25',0,25],['25–34',25,35],['35–44',35,45],['45–54',45,55],['≥ 55',55,200]];
var NS_LOC={x:'',tt:'',cd:'',tn:'',tuoi:''};
function nsNgay(v){ if(!v) return ''; var t=String(v); if(/^\\d{4}-\\d{2}-\\d{2}/.test(t)&&!/T/.test(t)) return t.slice(0,10); var d=new Date(v); if(isNaN(d)) return ''; return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); }
function nsThang(v){ var a=nsNgay(v); if(!a) return null; var p=a.split('-'), h=today().split('-'); var m=(h[0]-p[0])*12+(h[1]-p[1])-(Number(h[2])<Number(p[2])?1:0); return m<0?null:m; }
function nsTuoi(v){ var n=Number(v)||0; return n>1900?new Date().getFullYear()-n:null; }
function nsNhom(v,ds){ if(v==null) return 'na'; for(var i=0;i<ds.length;i++) if(v>=ds[i][1]&&v<ds[i][2]) return String(i); return 'na'; }
function nsTNChu(m){ return m<1?'dưới 1 tháng':m<12?m+' tháng':Math.floor(m/12)+' năm'+(m%12?' '+(m%12)+' tháng':''); }
function nsTT(x){ return String(x.TrangThai||'').trim()||'Đang làm'; }
var NS_CD_TT=['Công nhân','Tổ trưởng','Phó phòng','Trưởng phòng'];
function nsTheTim(){
  var ds=D.nhansu||[], dem=function(fn){ var o={}; ds.forEach(function(x){ var k=fn(x); o[k]=(o[k]||0)+1; }); return o; };
  var oTT=dem(nsTT), oCD=dem(function(x){return String(x.ChucDanh||'').trim()||'Chưa ghi'}), oTN=dem(function(x){return nsNhom(nsThang(x.NgayVaoLam),NS_TN)}), oTu=dem(function(x){return nsNhom(nsTuoi(x.NamSinh),NS_TUOI)});
  var sel=function(k,nhan,ops){ return '<label class="ns-loc"><span>'+nhan+'</span><select id="nsL_'+k+'" onchange="NS_LOC.'+k+'=this.value;locNhanSu()"><option value="">Tất cả</option>'+
    ops.map(function(o){return '<option value="'+esc(o[0])+'"'+(NS_LOC[k]===o[0]?' selected':'')+'>'+esc(o[1])+(o[2]!=null?' ('+o[2]+')':'')+'</option>'}).join('')+'</select></label>'; };
  var cds=Object.keys(oCD).sort(function(a,b){ var i=NS_CD_TT.indexOf(a), j=NS_CD_TT.indexOf(b); return (i<0?9:i)-(j<0?9:j)||a.localeCompare(b,'vi'); });
  var xs=(D.phongban||[]).filter(function(p){return ds.some(function(x){return x.MaXuong===p.MaXuong})});
  return '<div class="card ns-tim"><h3>Tìm nhân viên<span id="nsTong">'+ds.length+' người</span></h3>'+
    '<input id="nsTim" placeholder="🔍 Tìm theo tên hoặc mã nhân viên…" oninput="locNhanSu()" style="width:100%;background:var(--panel2);border:1px solid var(--line);border-radius:9px;padding:10px 12px;color:var(--ink);font-size:14px;font-family:inherit">'+
    '<div class="ns-locs">'+
      (xs.length>1?sel('x','Xưởng',xs.map(function(p){return [p.MaXuong,p.TenXuong,ds.filter(function(x){return x.MaXuong===p.MaXuong}).length]})):'')+
      sel('tt','Trạng thái',Object.keys(oTT).sort().map(function(k){return [k,k,oTT[k]]}))+
      sel('cd','Chức danh',cds.map(function(k){return [k,k,oCD[k]]}))+
      sel('tn','Thâm niên',NS_TN.map(function(t,i){return [String(i),t[0],oTN[i]||0]}).concat(oTN.na?[['na','Chưa có ngày vào làm',oTN.na]]:[]))+
      sel('tuoi','Độ tuổi',NS_TUOI.map(function(t,i){return [String(i),t[0],oTu[i]||0]}).concat(oTu.na?[['na','Chưa có năm sinh',oTu.na]]:[]))+
    '</div><div class="ns-kq"><span id="nsTimKq"></span> <button class="btn sm" type="button" id="nsXoaLoc" onclick="nsXoaLoc()" style="display:none">✕ Bỏ lọc</button></div></div>';
}
function nsXoaLoc(){ NS_LOC={x:'',tt:'',cd:'',tn:'',tuoi:''}; ['x','tt','cd','tn','tuoi'].forEach(function(k){ var e=$('nsL_'+k); if(e) e.value=''; }); var i=$('nsTim'); if(i) i.value=''; locNhanSu(); }
function locNhanSu(){
  var inp=$('nsTim'); if(!inp)return;
  var q=inp.value.trim().toLowerCase(), L=NS_LOC, coLoc=!!(L.x||L.tt||L.cd||L.tn||L.tuoi);
  var rows=document.querySelectorAll('.ns-row');
  var hien=0;
  rows.forEach(function(tr){
    var g=function(k){return tr.getAttribute('data-'+k)||''};
    var ok=(!q || g('tim').indexOf(q)>=0) && (!L.x||g('x')===L.x) && (!L.tt||g('tt')===L.tt) && (!L.cd||g('cd')===L.cd) && (!L.tn||g('tn')===L.tn) && (!L.tuoi||g('tuoi')===L.tuoi);
    tr.style.display=ok?'':'none';
    if(ok)hien++;
  });
  q=q||(coLoc?'loc':'');
  document.querySelectorAll('#main .ns-dem').forEach(function(sp){ var c=sp.closest('.card'), n=sp.getAttribute('data-n'), k=c?Array.prototype.filter.call(c.querySelectorAll('.ns-row'),function(t){return t.style.display!=='none'}).length:0; sp.textContent=(q?k+' / ':'')+n+' người'; });
  var xl=$('nsXoaLoc'); if(xl) xl.style.display=(inp.value.trim()||coLoc)?'':'none';""")
_t40("""  var kq=$('nsTimKq');
  if(kq)kq.textContent=q?('Tìm thấy '+hien+' người khớp “'+inp.value.trim()+'”'):'';
}""", """  var kq=$('nsTimKq');
  if(kq)kq.textContent=q?('Khớp '+hien+' / '+rows.length+' người'+(inp.value.trim()?' · tên / mã có “'+inp.value.trim()+'”':'')):'';
}""")
# 5) vẽ lại tab giữ bộ lọc đang chọn
_t40("""  var dau = m.querySelector('.pdesc'); if (dau && dau.parentNode === m) m.insertBefore(d, dau.nextSibling); else m.insertBefore(d, m.firstChild);""",
"""  var dau = m.querySelector('.ns-tim') || m.querySelector('.pdesc'); if (dau && dau.parentNode === m) m.insertBefore(d, dau.nextSibling); else m.insertBefore(d, m.firstChild);   // 40: thẻ hồ sơ thiếu ngay dưới thẻ Tìm""")
_t40("""(function(){ var g=vNS; vNS=function(){ var r=g.apply(this,arguments); try{ nsnVe(); }catch(e){} return r; }; })();""",
"""(function(){ var g=vNS; vNS=function(){ var r=g.apply(this,arguments); try{ nsnVe(); }catch(e){} return r; }; })();
(function(){ var g=vNS; vNS=function(){ var r=g.apply(this,arguments); try{ if(NS_LOC.x||NS_LOC.tt||NS_LOC.cd||NS_LOC.tn||NS_LOC.tuoi) locNhanSu(); }catch(e){} return r; }; })();   /* 40: giữ bộ lọc khi vẽ lại */""")
if "ns-locs{" not in s:
    i = s.index("</style>")
    s = s[:i] + """.ns-locs{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:10px}
.ns-loc{display:flex;flex-direction:column;gap:3px;font-size:12px;color:var(--ink3);min-width:0}
.ns-loc select{width:100%;min-height:36px}
.ns-kq{margin-top:8px;font-size:12.5px;color:var(--ink3);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
""" + s[i:]
