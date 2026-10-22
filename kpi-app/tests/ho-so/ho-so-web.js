/* ===== HỒ SƠ BẮT BUỘC KHI ĐĂNG NHẬP (22/10) =====
   Máy chủ gửi ME.hoSoThieu = các mục hồ sơ còn trống / sai. Còn thiếu thì hiện bảng điền, điền đủ mới dùng tiếp.
   Tab Nhân sự (ban điều hành, nhân sự, trưởng / phó phòng): thẻ thống kê ai còn thiếu. */
var HS_TEN = { DienThoai: 'Số điện thoại', SoCCCD: 'Số CCCD (12 số)', DiaChi: 'Địa chỉ thường trú',
  SdtKhanCap: 'SĐT người thân (khi khẩn cấp)', NamSinh: 'Năm sinh', NgayVaoLam: 'Ngày vào làm' };
var HS_GOI_Y = { DienThoai: 'VD: 0912345678', SoCCCD: 'VD: 001234567890', DiaChi: 'Số nhà, thôn / xóm, xã / phường, tỉnh',
  SdtKhanCap: 'Số của bố mẹ, vợ / chồng…', NamSinh: 'VD: 1995', NgayVaoLam: '' };
function hsKiemTraO_(k, v){
  v = String(v || '').trim(); var d = v.replace(/\D/g, '');
  if (k === 'DienThoai' || k === 'SdtKhanCap') return /^0\d{9}$/.test(d) ? '' : 'cần 10 chữ số, bắt đầu bằng 0';
  if (k === 'SoCCCD') return /^\d{12}$/.test(d) ? '' : 'cần đúng 12 chữ số';
  if (k === 'DiaChi') return v.length >= 5 ? '' : 'ghi rõ địa chỉ';
  if (k === 'NamSinh') { var y = +d, n = new Date().getFullYear(); return (d.length === 4 && y >= 1950 && y <= n - 15) ? '' : 'năm sinh 4 chữ số'; }
  if (k === 'NgayVaoLam') return (/^\d{4}-\d{2}-\d{2}$/.test(v) && v <= today()) ? '' : 'chọn ngày (không quá hôm nay)';
  return '';
}
function hsMo(){
  var ds = (ME && ME.hoSoThieu) || [];
  if (!ds.length || $('hsBox')) return;
  var o = document.createElement('div'); o.id = 'hsBox';
  o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-labelledby', 'hsTieuDe');
  // trên hướng dẫn Rhino (8800–8900), dưới hộp "phiên hết hạn" (9000+)
  o.style.cssText = 'position:fixed;inset:0;background:rgba(12,13,15,.86);z-index:8950;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(3px);overflow:auto';
  o.innerHTML = '<div class="card" style="max-width:460px;width:100%;margin:auto">' +
    '<h3 id="hsTieuDe" style="margin-top:0">Bổ sung thông tin cá nhân</h3>' +
    '<div class="note" style="margin-bottom:12px">Chào <b>' + esc(ME.ten || '') + '</b>. Hồ sơ của bạn còn thiếu <b>' + ds.length + ' mục</b> dưới đây. ' +
      'Điền đủ để tiếp tục dùng hệ thống. Thông tin chỉ công ty xem, dùng khi cần liên hệ.</div>' +
    ds.map(function(k){
      var loai = (k === 'NgayVaoLam') ? 'date' : 'text', them = '';
      if (k === 'DienThoai' || k === 'SdtKhanCap') them = ' inputmode="numeric" maxlength="12" autocomplete="tel"';
      if (k === 'SoCCCD') them = ' inputmode="numeric" maxlength="14"';
      if (k === 'NamSinh') them = ' inputmode="numeric" maxlength="4"';
      if (k === 'NgayVaoLam') them = ' max="' + today() + '"';
      return '<div class="row"><div><label for="hs_' + k + '">' + HS_TEN[k] + '</label>' +
        '<input type="' + loai + '" id="hs_' + k + '" placeholder="' + esc(HS_GOI_Y[k] || '') + '"' + them + '>' +
        '<div class="hs-loi" id="hsl_' + k + '" style="color:var(--red,#f47272);font-size:12px;min-height:16px"></div></div></div>';
    }).join('') +
    '<div id="hsErr" class="alert a-bd hide"></div>' +
    '<div class="acts" style="display:flex;gap:8px;justify-content:flex-end;margin-top:6px">' +
      '<button class="btn" onclick="hsThoat()">Thoát</button>' +
      '<button class="btn pri" id="hsLuu" onclick="hsLuu()">Lưu và tiếp tục</button></div></div>';
  document.body.appendChild(o);
  setTimeout(function(){ var e = $('hs_' + ds[0]); if (e) e.focus(); }, 50);
}
function hsThoat(){
  try { google.script.run.dangXuat(TOKEN); } catch (e) {}
  try { sessionStorage.removeItem('kpi_token'); } catch (e) {}
  location.reload();
}
function hsLuu(){
  var ds = (ME && ME.hoSoThieu) || [], o = {}, sai = false;
  ds.forEach(function(k){
    var e = $('hs_' + k), v = e ? e.value : '', l = hsKiemTraO_(k, v);
    o[k] = (k === 'DiaChi' || k === 'NgayVaoLam') ? String(v).trim() : String(v).replace(/\D/g, '');
    $('hsl_' + k).textContent = l ? '✗ ' + l : '';
    if (e) { if (l) e.setAttribute('aria-invalid', 'true'); else e.removeAttribute('aria-invalid'); }
    if (l && !sai) { sai = true; if (e) e.focus(); }
  });
  if (!sai && o.DienThoai && o.SdtKhanCap && o.DienThoai === o.SdtKhanCap) {
    $('hsl_SdtKhanCap').textContent = '✗ cần số của người thân, khác số của bạn'; sai = true;
  }
  if (sai) return;
  var b = $('hsLuu'); b.disabled = true; b.textContent = 'Đang lưu…';
  google.script.run.withSuccessHandler(function(r){
    b.disabled = false; b.textContent = 'Lưu và tiếp tục';
    if (r && r.hetHan) { try { hetHan(); } catch (e) {} return; }
    if (!r || !r.ok) {
      (r && r.loi || []).forEach(function(k){ var l = $('hsl_' + k); if (l) l.textContent = '✗ chưa đúng'; });
      var er = $('hsErr'); er.textContent = (r && r.msg) || 'Chưa lưu được, thử lại.'; er.classList.remove('hide'); return;
    }
    ME.hoSoThieu = [];
    var nv = (D.nhansu || []).filter(function(x){ return x.MaNV === ME.maNV; })[0];
    if (nv) Object.keys(o).forEach(function(k){ nv[k] = o[k]; });
    $('hsBox').remove(); toast(r.msg, true);
  }).withFailureHandler(function(e){
    b.disabled = false; b.textContent = 'Lưu và tiếp tục';
    var er = $('hsErr'); er.textContent = 'Lỗi mạng: ' + (e.message || e) + '. Thử lại.'; er.classList.remove('hide');
  }).luuHoSoThieu(TOKEN, o);
}
(function(){
  var cu = window.buildNav;                 // buildNav chạy ngay sau khi vào hệ thống
  window.buildNav = function(){ var r = cu.apply(this, arguments); try { hsMo(); } catch (e) {} return r; };
  var cuNS = window.vNS;
  window.vNS = function(){
    var r = cuNS.apply(this, arguments);
    try { if (['ADMIN', 'HR', 'TL', 'TP'].indexOf(ME.vaiTro) >= 0) hsThongKe(); } catch (e) {}
    return r;
  };
})();
function hsThongKe(){
  var m = $('main'); if (!m || $('hsTk')) return;
  var d = document.createElement('div'); d.id = 'hsTk'; d.className = 'card'; d.style.cssText = 'padding:12px 14px';
  d.innerHTML = '<div class="pdesc" style="margin:0">Đang đếm hồ sơ còn thiếu…</div>';
  var dau = m.querySelector('.pdesc'); if (dau && dau.parentNode === m) m.insertBefore(d, dau.nextSibling); else m.insertBefore(d, m.firstChild);
  google.script.run.withSuccessHandler(function(r){
    var e = $('hsTk'); if (!e) return;
    if (!r || !r.ok) { e.remove(); return; }
    if (!r.soThieu) { e.innerHTML = '<b>Hồ sơ:</b> cả ' + r.soXet + ' người đã nhập đủ thông tin.'; return; }
    var ten = {}; r.muc.forEach(function(x){ ten[x.k] = x.ten; });
    var theoX = {}; r.ds.forEach(function(x){ (theoX[x.MaXuong] = theoX[x.MaXuong] || []).push(x); });
    e.innerHTML = '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center">' +
      '<div><b>Hồ sơ chưa đủ: ' + r.soThieu + '/' + r.soXet + ' người</b> <span style="color:var(--ink3);font-size:12px">— họ sẽ phải điền khi đăng nhập lần tới</span><div style="font-size:12px;color:var(--ink2);margin-top:4px">' +
      r.muc.filter(function(x){ return r.theoMuc[x.k]; }).map(function(x){ return esc(x.ten) + ': <b>' + r.theoMuc[x.k] + '</b>'; }).join(' · ') + '</div></div>' +
      '<button class="btn sm" onclick="var l=document.getElementById(\'hsDs\');l.style.display=l.style.display?\'\':\'none\'">Xem danh sách</button></div>' +
      '<div id="hsDs" style="display:none;margin-top:10px;font-size:13px">' +
      Object.keys(theoX).map(function(mx){
        return '<div style="margin-top:8px"><b>' + esc(pbTen(mx) || mx || '(chưa gán xưởng)') + '</b> (' + theoX[mx].length + ')<div style="color:var(--ink2)">' +
          theoX[mx].map(function(x){ return esc(x.HoTen) + ' <span style="color:var(--ink3)">(' + esc(x.MaNV) + ': thiếu ' + x.thieu.map(function(k){ return esc(ten[k]); }).join(', ') + ')</span>'; }).join('<br>') + '</div></div>';
      }).join('') + '</div>';
  }).withFailureHandler(function(){ var e = $('hsTk'); if (e) e.remove(); }).thongKeHoSoThieu(TOKEN);
}
