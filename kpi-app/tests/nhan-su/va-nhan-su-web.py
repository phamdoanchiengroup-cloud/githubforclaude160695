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
    '<div style="font-size:12.5px;color:var(--ink3);margin-bottom:8px">Chỉ tài khoản chủ sở hữu thấy. Danh sách theo bảng chấm công – không tính KPI, không vào điểm danh, cơm trưa hay lưu đồ 9 xưởng. Sửa ở sheet <b>NhanSuNgoaiSX</b>.</div>';
  if(!ds.length) h+='<div class="pdesc">Chưa có dữ liệu – chạy hàm SUA_NHAN_SU_THEO_CHAM_CONG trong Apps Script.</div>';
  else {
    h+='<div class="tw"><table><thead><tr><th>Bộ phận · nhóm</th><th>Mã</th><th>Họ tên</th><th>Chức danh</th><th>Ngày vào</th></tr></thead><tbody>';
    bp.forEach(function(b){ var a=g[b], ql=a.filter(function(x){return /Trưởng|Ban/.test(x.ChucDanh)}).length;
      h+='<tr class="dh-khoi"><td colspan="5">'+esc(b)+' · '+a.length+' người'+(ql&&b!=='Ban điều hành'?' ('+ql+' trưởng bộ phận)':'')+'</td></tr>';
      a.forEach(function(x){ h+='<tr><td style="color:var(--ink3)">'+esc(x.Nhom||'')+'</td><td>'+esc(x.MaNV)+'</td><td>'+esc(x.HoTen)+'</td><td>'+esc(x.ChucDanh)+'</td><td>'+esc(x.NgayVaoLam)+'</td></tr>'; }); });
    h+='<tr class="dh-khoi"><td colspan="5">Tổng: '+ds.length+' người · '+bp.map(function(b){return esc(b)+' '+g[b].length}).join(' · ')+'</td></tr></tbody></table></div>';
  }
  o.innerHTML=h+'</div>';
}
(function(){ var g=vNS; vNS=function(){ var r=g.apply(this,arguments); try{ nsnVe(); }catch(e){} return r; }; })();
</script>
""" + s[_k37:]
