/* ===== 44. WEB CÔNG NHÂN KIỂU APPLE (09/11) =====
   Chỉ tài khoản công nhân (ME.vaiTro==='CN'). Thanh dưới 5 nút Nhập · KPI · Cơm · Xưởng · Tôi.
   Xưởng = Bảng KPI xưởng + Chấm công (nút chuyển trên đầu). Tôi = hồ sơ, kỹ năng, hướng dẫn, đổi mật khẩu, chữ to, Rhino, về giao diện cũ.
   Bảng KPI xưởng: chỉ hiện top 3 + người ngay trên mình + mình; bấm "Xem cả xưởng" mới hiện hết.
   Không đổi logic nhập / duyệt / tính KPI – chỉ đổi khung và cách trình bày. */
var CN_KHOA_CU = 'kpi_cn_gd_cu', CN_KHOA_TO = 'kpi_cn_chu_to', CN_KHOA_XUONG = 'kpi_cn_xuong_tab';
function cnNho(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
function cnLaCN() { return !!(window.ME && ME.vaiTro === 'CN'); }
function cnMoi() { return cnLaCN() && cnNho(CN_KHOA_CU) !== '1'; }
var CN_NHOM = { cnnhap: 'cnnhap', kpica: 'kpica', com: 'com', kpicn: 'xuong', cccn: 'xuong', cnxuong: 'xuong', cntoi: 'toi', kyn: 'toi', hd: 'toi' };
var CN_ICON = {
  cnnhap: '<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z"/><path d="M13.5 7.5l3 3"/>',
  kpica: '<circle cx="12" cy="12" r="8.5"/><path d="M12 12l4-3"/><path d="M12 6.5v1M17.5 12h-1M6.5 12h1"/>',
  com: '<path d="M4 12h16a8 8 0 0 1-16 0z"/><path d="M8 4.5c0 1.5 1 1.5 1 3M12 3.5c0 1.5 1 1.5 1 3M16 4.5c0 1.5 1 1.5 1 3"/>',
  xuong: '<path d="M3 20V10l5 3V10l5 3V6h6v14z"/><path d="M3 20h18"/>',
  toi: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>'
};
function cnNut(k, nhan, nhom) { return '<button type="button" data-k="' + k + '" data-n="' + nhom + '" onclick="go(\'' + k + '\')"><svg viewBox="0 0 24 24">' + CN_ICON[nhom] + '</svg><span class="nl">' + nhan + '</span><span class="dem hide"></span></button>'; }
function cnThanhDuoi() {
  var bb = $('botbar'); if (!bb) { bb = document.createElement('div'); bb.id = 'botbar'; $('app').appendChild(bb); }
  bb.innerHTML = cnNut('cnnhap', 'Nhập', 'cnnhap') + cnNut('kpica', 'KPI', 'kpica') + cnNut('com', 'Cơm', 'com') + cnNut('cnxuong', 'Xưởng', 'xuong') + cnNut('cntoi', 'Tôi', 'toi');
  cnDanhDau();
}
function cnDanhDau() {
  var n = CN_NHOM[window.tabHienTai] || '', duc = $('ducbar'), coDuc = !!(duc && duc.textContent.replace(/\s+/g, ''));
  document.documentElement.classList.toggle('cn-tab-nhap', n === 'cnnhap');   /* khung nhắc nhập (ducbar) chỉ hiện đủ ở tab Nhập */
  Array.prototype.forEach.call(document.querySelectorAll('#botbar button'), function (b) { var k = b.getAttribute('data-n'); b.classList.toggle('on', k === n); if (k === n) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); if (k === 'cnnhap') b.classList.toggle('cham', coDuc); });
  var seg = $('cnSeg'); if (seg) {
    var o = n === 'xuong'; seg.classList.toggle('hide', !o);
    if (o) seg.innerHTML = '<div class="cn-seg" role="tablist"><button type="button" role="tab" aria-selected="' + (tabHienTai === 'kpicn') + '" class="' + (tabHienTai === 'kpicn' ? 'on' : '') + '" onclick="go(\'kpicn\')">Bảng KPI</button><button type="button" role="tab" aria-selected="' + (tabHienTai === 'cccn') + '" class="' + (tabHienTai === 'cccn' ? 'on' : '') + '" onclick="go(\'cccn\')">Chấm công</button></div>';
  }
}
/* Bật / tắt giao diện mới theo tài khoản + lựa chọn trên máy */
function cnApDung() {
  var on = cnMoi(), H = document.documentElement;
  H.classList.toggle('cn-moi', on); H.classList.toggle('cn-to', on && cnNho(CN_KHOA_TO) === '1');
  var seg = $('cnSeg'); if (!seg && on) { seg = document.createElement('div'); seg.id = 'cnSeg'; seg.className = 'hide'; $('main').parentNode.insertBefore(seg, $('main')); }
  var nm = $('cnNutMoi'); if (nm) nm.remove();
  if (on) cnThanhDuoi();
  else if (cnLaCN()) {   /* giao diện cũ: có nút quay lại giao diện mới */
    var hr = document.querySelector('header .hr'); if (hr) { var b = document.createElement('button'); b.id = 'cnNutMoi'; b.className = 'btn sm pri'; b.textContent = 'Giao diện mới'; b.onclick = function () { cnNho(CN_KHOA_CU, null); cnApDung(); go('cnnhap'); }; hr.insertBefore(b, hr.firstChild); }
  }
}
(function () {
  var gVeNav = window.veNav;
  window.veNav = function () { var r = gVeNav.apply(this, arguments); try { cnApDung(); } catch (e) {} return r; };
  var gGo = window.go;
  window.go = function (k) {
    if (cnMoi()) {
      if (k === 'cnxuong') k = cnNho(CN_KHOA_XUONG) === 'cccn' ? 'cccn' : 'kpicn';
      if (k === 'kpicn' || k === 'cccn') cnNho(CN_KHOA_XUONG, k);
      if (k === 'cntoi') { try { moNav(false); } catch (e) {} window.scrollTo(0, 0); tabHienTai = 'cntoi'; vCNToi(); cnDanhDau(); try { capNhatDucBar(); capNhatDem(); } catch (e) {} return; }
    } else if (k === 'cntoi' || k === 'cnxuong') k = k === 'cntoi' ? 'kyn' : 'kpicn';
    var r = gGo.apply(this, [k].concat([].slice.call(arguments, 1)));
    if (cnMoi()) cnDanhDau();
    return r;
  };
  var gDuc = window.capNhatDucBar;   /* khung nhắc đổi (vd vừa gửi xong) → cập nhật chấm đỏ ở nút Nhập */
  window.capNhatDucBar = function () { var r = gDuc.apply(this, arguments); try { if (cnMoi()) cnDanhDau(); } catch (e) {} return r; };
  /* Bảng KPI xưởng: top 3 + người ngay trên + mình */
  var gBang = window.veBangKPI;
  window.veBangKPI = function (r) { var x = gBang.apply(this, arguments); try { if (cnMoi()) cnLocBXH(); } catch (e) {} return x; };
})();
function cnLocBXH() {
  var hop = $('kpi_bang'); if (!hop) return;
  Array.prototype.forEach.call(hop.querySelectorAll('.card'), function (card) {
    var tb = card.querySelector('tbody'); if (!tb) return;
    var rows = [].slice.call(tb.rows), toi = -1;
    rows.forEach(function (tr, i) { if (/\bBạn\b/.test((tr.cells[1] || {}).textContent || '')) { toi = i; tr.classList.add('cn-toi'); } });
    var giu = {}; [0, 1, 2, toi - 1, toi].forEach(function (i) { if (i >= 0 && i < rows.length) giu[i] = 1; });
    var an = 0, truoc = -1;
    rows.forEach(function (tr, i) {
      if (giu[i]) { if (truoc >= 0 && i - truoc > 1) { var g = document.createElement('tr'); g.className = 'cn-cach'; g.innerHTML = '<td colspan="' + tr.cells.length + '">⋯</td>'; tb.insertBefore(g, tr); } truoc = i; }
      else { tr.classList.add('cn-an'); an++; }
    });
    if (an) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'btn cn-xemhet';
      b.textContent = 'Xem cả xưởng (' + rows.length + ' người)';
      b.onclick = function () { var mo = card.classList.toggle('cn-mo'); b.textContent = mo ? 'Thu gọn' : 'Xem cả xưởng (' + rows.length + ' người)'; };
      card.appendChild(b);
    }
  });
}
/* Màn "Tôi" */
function vCNToi() {
  var ten = (ME.ten || ME.hoTen || ''), chu = ten.trim().split(/\s+/).pop() || '?';
  var dong = function (nhan, phu, fn, phai, bat) { return '<button type="button" class="cn-dong"' + (bat == null ? '' : ' role="switch" aria-checked="' + !!bat + '"') + ' onclick="' + fn + '"><span>' + nhan + (phu ? '<small>' + phu + '</small>' : '') + '</span>' + (phai || '<b aria-hidden="true">›</b>') + '</button>'; };
  var cong = function (id, on) { return '<span class="cn-cong' + (on ? ' on' : '') + '" id="' + id + '" aria-hidden="true"></span>'; };
  var maiOn = (function () { try { return !maiTat(); } catch (e) { return true; } })();
  $('main').innerHTML =
    '<div class="cn-toi-dau"><div class="cn-av" aria-hidden="true">' + esc(chu.charAt(0).toUpperCase()) + '</div><div><div class="ptitle">' + esc(ten) + '</div><div class="pdesc">' + esc(ME.tenXuong ? 'Xưởng ' + ME.tenXuong.replace(/^Xưởng\s+/i, '') : '') + (ME.maNV ? ' · ' + esc(ME.maNV) : '') + '</div></div></div>' +
    '<div class="cn-nhom">CỦA TÔI</div><div class="cn-the">' +
      dong('Kỹ năng của tôi', 'Kỹ năng đã được xác nhận', "go('kyn')") +
      dong('Hướng dẫn sử dụng', 'Cách nhập sản lượng, xem KPI, đăng ký cơm', "go('hd')") +
      dong('Đổi mật khẩu', '', 'moDoiMK()') + '</div>' +
    '<div class="cn-nhom">CÀI ĐẶT</div><div class="cn-the">' +
      dong('Chữ to', 'Phóng to chữ và nút trên mọi trang', 'cnDoiChuTo()', cong('cnCongTo', cnNho(CN_KHOA_TO) === '1'), cnNho(CN_KHOA_TO) === '1') +
      dong('Rhino nhắc nhở', 'Nhân vật Rhino ở góc màn hình', 'cnDoiRhino()', cong('cnCongMai', maiOn), maiOn) +
      dong('Dùng giao diện cũ', 'Quay lại kiểu cũ; bấm "Giao diện mới" để trở lại', 'cnVeCu()') + '</div>' +
    '<button type="button" class="btn dg cn-thoat" onclick="logout()">Đăng xuất</button>';
}
function cnDoiChuTo() { var on = cnNho(CN_KHOA_TO) !== '1'; cnNho(CN_KHOA_TO, on ? '1' : null); document.documentElement.classList.toggle('cn-to', on); var c = $('cnCongTo'); if (c) { c.classList.toggle('on', on); c.parentNode.setAttribute('aria-checked', on); } }
function cnDoiRhino() {   /* maiDoi() tự vẽ lại tab hiện tại; vẫn cập nhật công tắc phòng khi không vẽ lại */
  try { maiDoi(); } catch (e) {} if (tabHienTai !== 'cntoi') go('cntoi');
  var on = (function () { try { return !maiTat(); } catch (e) { return true; } })(), c = $('cnCongMai'); if (c) { c.classList.toggle('on', on); c.parentNode.setAttribute('aria-checked', on); } }
function cnVeCu() {
  if (!confirm('Chuyển về giao diện cũ?\nMuốn dùng lại giao diện mới: bấm nút "Giao diện mới" ở đầu trang.')) return;
  cnNho(CN_KHOA_CU, '1'); cnApDung(); try { veNav(); } catch (e) {} go('cnnhap');
}
