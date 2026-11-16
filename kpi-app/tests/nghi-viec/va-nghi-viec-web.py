# -*- coding: utf-8 -*-
"""Vá Index.html – mục 48 (16/11 tối, chủ dự án): thẻ "Cho nghỉ việc hàng loạt" ở tab Nhân sự, chỉ chủ sở hữu.
Điền sẵn danh sách cắt giảm đợt 11/2026 (53 mã). Máy chủ: tests/nghi-viec/nghi-viec.gs. Chạy bằng exec() cuối tests/va-index.py."""
_k48 = "    '<div class=\"pdesc\">'+(full?'Đầy đủ thông tin cá nhân':'Thông tin cơ bản — lương và giấy tờ do phòng nhân sự quản lý')+'</div>';\n"
assert s.count(_k48) == 1, 'mục 48: không thấy đầu tab Nhân sự'
s = s.replace(_k48, _k48 + "  if(ME.laOwner) h+=nvHLThe();   /* 16/11 tối: cho nghỉ việc hàng loạt */\n")
_js48 = r"""
/* ===== 16/11 tối (chủ dự án): CHO NGHỈ VIỆC HÀNG LOẠT – chỉ chủ sở hữu. Dán mã NV → Xem trước → Xác nhận ===== */
var NVHL_DOT_1611='C741 C405 C672 C680 C659 C727 C723 C285 C418 C242 C532 C116 C544 C522 C636 C022 C711 C713 C715 C736 C750 C728 C710 C747 C759 C134 C385 C721 C054 C486 C201 C226 C080 C097 C743 C719 C717 C694 C676 C692 C709 C686 C704 C047 C311 C590 C542 C608 C609 C631 C638 C640 C700';
var NVHL=null;
function nvHLThe(){
  return '<div class="card" id="nvHL"><h3>Cho nghỉ việc hàng loạt</h3><div class="pdesc" style="margin:0 0 8px">Dán mã nhân viên (cách nhau bằng dấu cách, phẩy hoặc xuống dòng) → <b>Xem trước</b> → kiểm tên → <b>Xác nhận</b>. Mỗi người: trạng thái <b>Nghỉ việc</b> + <b>ngừng tài khoản</b> đăng nhập. Lịch sử sản lượng / KPI giữ nguyên.</div>'+
    '<textarea id="nvHLma" rows="3" style="width:100%" placeholder="C741 C405 C672 …"></textarea>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn sm" type="button" onclick="$(\'nvHLma\').value=NVHL_DOT_1611">Điền danh sách cắt giảm đợt 11/2026 (53 người)</button><button class="btn sm pri" type="button" onclick="nvHLXem()">Xem trước</button></div><div id="nvHLkq"></div></div>';
}
function nvHLXem(){ var v=($('nvHLma')||{}).value||''; if(!v.trim()){ toast('Dán mã nhân viên trước.'); return; } $('nvHLkq').innerHTML='<div class="pdesc">Đang đối chiếu…</div>';
  call('xemNghiViecHangLoat',[v],function(r){ if(!r||!r.ok){ $('nvHLkq').innerHTML='<div class="alert a-bd">'+esc((r&&r.msg)||'Lỗi.')+'</div>'; return; } NVHL={ds:v,r:r};
    var h='<div class="tw" style="margin-top:10px"><table><thead><tr><th>#</th><th>Mã NV</th><th>Họ tên</th><th>Xưởng</th><th>Chức danh</th><th>Trạng thái hiện tại</th><th>Tài khoản đang dùng</th><th>Sẽ làm</th></tr></thead><tbody>';
    r.dong.forEach(function(d,i){ var lam=!d.co?'<span style="color:#c8102e">Không có mã này</span>':(d.tt==='Nghỉ việc'&&!d.tkDung.length?'Đã nghỉ – bỏ qua':'Nghỉ việc'+(d.tkDung.length?' + ngừng TK':''));
      h+='<tr><td>'+(i+1)+'</td><td>'+esc(d.ma)+'</td><td>'+esc(d.ten)+'</td><td>'+esc(d.xuong)+'</td><td>'+esc(d.chucDanh)+'</td><td>'+esc(d.tt)+'</td><td>'+esc(d.tkDung.join(', ')||'–')+'</td><td><b>'+lam+'</b></td></tr>'; });
    h+='</tbody></table></div>'+(r.doi?'<button class="btn pri" type="button" style="margin-top:10px;background:#c8102e;border-color:#c8102e" onclick="nvHLLuu()">Xác nhận cho nghỉ việc '+r.doi+' người</button>':'<div class="pdesc" style="margin-top:8px">Không có ai cần đổi.</div>');
    $('nvHLkq').innerHTML=h; }); }
function nvHLLuu(){ if(!NVHL) return; if(!confirm('Chuyển '+NVHL.r.doi+' người sang "Nghỉ việc" và ngừng tài khoản đăng nhập của họ?')) return;
  call('luuNghiViecHangLoat',[NVHL.ds],function(r){ toast((r&&r.msg)||'Lỗi.',!!(r&&r.ok)); if(r&&r.ok){ NVHL=null; reload(function(){ if(tabHienTai==='ns') vNS(); }); } }); }
"""
_k48b = s.rfind('</script>')
s = s[:_k48b] + _js48 + s[_k48b:]
