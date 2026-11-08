# 37. (03/11) Bộ phận ngoài sản xuất (Kho, Bếp + tạp vụ, Ban điều hành, Xưởng May) – khối cuối tab Nhân sự, chỉ chủ sở hữu.
#     Dữ liệu ở sheet riêng NhanSuNgoaiSX (máy chủ: nhan-su/nhan-su-ngoai-sx.gs) nên không vào KPI / điểm danh / cơm / lưu đồ.
_k37 = s.rfind('</body>'); assert _k37 > 0
s = s[:_k37] + r"""<script>
/* 37 (03/11): bộ phận ngoài sản xuất – chỉ chủ sở hữu, chỉ danh sách (không tính KPI) */
var NSN=null, NSNTai=false;
function nsnVe(){
  var m=$('main'); if(!m||!ME||!ME.laOwner||tabHienTai!=='ns') return;
  var o=document.getElementById('nsNgoai'); if(!o){ o=document.createElement('div'); o.id='nsNgoai'; m.appendChild(o); }
  if(!NSN){ o.innerHTML='<div class="card pdesc">Đang tải bộ phận ngoài sản xuất…</div>'; if(!NSNTai){ NSNTai=true; call('layNhanSuNgoaiSX',[],function(r){ NSNTai=false; NSN=r||{ok:false,msg:'Không tải được.'}; nsnVe(); }); } return; }
  if(!NSN.ok){ o.innerHTML='<div class="card pdesc">'+esc(NSN.msg||'Không tải được.')+'</div>'; return; }
  var ds=NSN.ds||[], bp=[], g={};
  ds.forEach(function(x){ if(!g[x.BoPhan]){ g[x.BoPhan]=[]; bp.push(x.BoPhan); } g[x.BoPhan].push(x); });
  var h='<div class="card"><h3>Bộ phận ngoài sản xuất<span>'+ds.length+' người</span></h3>'+
    '<div style="font-size:12.5px;color:var(--ink3);margin-bottom:8px">Chỉ tài khoản chủ sở hữu thấy. Chỉ là danh sách – không tính KPI, không vào điểm danh, cơm trưa hay lưu đồ 9 xưởng. Bản gốc ở file Drive'+(NSN.file?' <a href="'+esc(NSN.file)+'" target="_blank" rel="noopener">KPI – Nhân sự ngoài sản xuất</a>':'')+': thêm / sửa người ở file (nghỉ thì ghi "Nghỉ việc" ở cột TrangThai) rồi bấm <b>Cập nhật từ file</b>.</div>'+
    '<div style="margin:0 0 10px"><button class="btn sm" type="button" onclick="nsnCapNhat()">↻ Cập nhật từ file</button></div>';
  if(!ds.length) h+='<div class="pdesc">Chưa có dữ liệu – bấm Cập nhật từ file.</div>';
  else {
    /* 08/11 (chủ dự án): đủ hồ sơ – ngày onboard, ngày chính thức, tình trạng, thâm niên, */ /* 08/11: bỏ cột phép năm còn lại (chủ dự án: chưa cần) */
    var tn=function(m){ return m==null?'–':(m<12?m+' tháng':Math.floor(m/12)+' năm'+(m%12?' '+(m%12)+' th':'')); };
    var tt=function(x){ return x.tinhTrang==='Thử việc'?'<b style="color:var(--amber)">Thử việc</b>':(x.tinhTrang||'<span style="color:var(--ink3)">chưa rõ</span>'); };
    var tv=0; ds.forEach(function(x){ if(x.tinhTrang==='Thử việc') tv++; });
    h+='<div class="tw"><table><thead><tr><th>Bộ phận · nhóm</th><th>Mã</th><th>Họ tên</th><th>Chức danh</th><th>Ngày onboard</th><th>Ngày chính thức</th><th>Tình trạng</th><th style="text-align:right">Thâm niên</th><th>Ghi chú</th></tr></thead><tbody>';
    bp.forEach(function(b){ var a=g[b], ql=a.filter(function(x){return /trưởng|Ban|Giám đ|Quản lý/i.test(x.ChucDanh)}).length, tvb=a.filter(function(x){return x.tinhTrang==='Thử việc'}).length;
      h+='<tr class="dh-khoi"><td colspan="9">'+esc(b)+' · '+a.length+' người'+(ql&&b!=='Ban điều hành'?' · '+ql+' quản lý':'')+(tvb?' · '+tvb+' thử việc':'')+'</td></tr>';
      a.forEach(function(x){ h+='<tr><td style="color:var(--ink3)">'+esc(x.Nhom||'')+'</td><td>'+esc(x.MaNV)+'</td><td>'+esc(x.HoTen)+'</td><td>'+esc(x.ChucDanh)+'</td><td>'+esc(x.NgayVaoLam)+'</td><td>'+esc(x.NgayChinhThuc||'–')+'</td><td>'+tt(x)+'</td><td style="text-align:right;white-space:nowrap">'+tn(x.thamNienThang)+'</td><td style="color:var(--ink3)">'+esc(x.GhiChu||'')+'</td></tr>'; }); });
    h+='<tr class="dh-khoi"><td colspan="9">Tổng: '+ds.length+' người'+(tv?' ('+tv+' thử việc)':'')+' · '+bp.map(function(b){return esc(b)+' '+g[b].length}).join(' · ')+'</td></tr></tbody></table></div>'+
      '<div style="font-size:12px;color:var(--ink3);margin-top:6px">Tình trạng tự tính: đã qua ngày chính thức = Chính thức, chưa tới = Thử việc.</div>';
  }
  o.innerHTML=h+'</div>';
}
function nsnCapNhat(){ call('capNhatNgoaiSXTuFile',[],function(r){ if(!r||!r.ok){ toast((r&&r.msg)||'Không cập nhật được.'); return; } toast(r.msg,true); NSN=null; try{ TKD={}; }catch(e){} nsnVe(); }); }   /* 08/11 */
(function(){ var g=vNS; vNS=function(){ var r=g.apply(this,arguments); try{ nsnVe(); }catch(e){} return r; }; })();
</script>
""" + s[_k37:]
