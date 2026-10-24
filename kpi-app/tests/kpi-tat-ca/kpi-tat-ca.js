/* =====================================================================
   35. BẢNG KPI – BAN ĐIỀU HÀNH / CHỦ SỞ HỮU TỰ TẢI TẤT CẢ XƯỞNG (24/10, chủ dự án)
   Trước: phải chọn xưởng mới thấy bảng (tránh tính cả nhà máy trong 1 lượt). Nay: ô Xưởng mặc định "Tất cả xưởng",
   mỗi xưởng một ô riêng, gọi layKPIKy từng xưởng (tối đa 3 lượt cùng lúc) – xưởng nào xong trước hiện bảng xưởng đó ngay.
   Chọn 1 xưởng cụ thể thì như cũ. window.__kpiR gộp số các xưởng đã tải (khung chia đôi tra chi tiết theo mã NV).
   ===================================================================== */
var KPI_TC = { luot: 0, gop: null };
var _goc_taiKPIKy = taiKPIKy;
function kpiVeVao_(o, r) {                                   // vẽ bảng của 1 xưởng vào ô riêng (veBangKPI vẽ vào #kpi_bang -> đổi id tạm)
  var goc = $('kpi_bang'); if (!goc) return;
  goc.id = 'kpi_bang_goc'; o.id = 'kpi_bang';
  try { veBangKPI(r); } finally { o.id = ''; goc.id = 'kpi_bang'; }
}
taiKPIKy = function () {
  var box = $('kpi_bang'); if (!box) return;
  if (!(ME.vaiTro === 'ADMIN' && !kpiXuong)) return _goc_taiKPIKy.apply(this, arguments);
  var luot = ++KPI_TC.luot, ky = kpiKy.kieu + '|' + kpiKy.giaTri, tab0 = tabHienTai;
  var ds = (D.phongban || []).slice(), cho = ds.slice(), dang = 0, xong = 0;
  KPI_TC.gop = { ok: true, ds: [], kieu: kpiKy.kieu, tamTinh: false };
  box.innerHTML = '<div class="note" id="kpiTcTT">Đang tải bảng KPI ' + ds.length + ' xưởng – xưởng nào xong trước hiện trước…</div>' +
    ds.map(function (p) { return '<div class="kpi-tc" data-x="' + esc(p.MaXuong) + '"><div class="card"><h3>' + esc(p.TenXuong) + '<span>đang tải…</span></h3><div class="empty">Đang tải…</div></div></div>'; }).join('');
  var conHieuLuc = function () { return luot === KPI_TC.luot && tabHienTai === tab0 && kpiKy.kieu + '|' + kpiKy.giaTri === ky && !kpiXuong && !!$('kpi_bang'); };
  var o = function (ma) { return document.querySelector('#kpi_bang .kpi-tc[data-x="' + ma + '"]'); };
  var capNhatTT = function () { var t = $('kpiTcTT'); if (t) t.textContent = xong < ds.length ? 'Đã tải ' + xong + ' / ' + ds.length + ' xưởng…' : ''; if (t && xong >= ds.length) t.remove(); };
  var mot = function (p) {
    dang++;
    var het = false, hen = setTimeout(function () { if (!het && conHieuLuc()) { var e = o(p.MaXuong); if (e) e.innerHTML = '<div class="alert a-bd">' + esc(p.TenXuong) + ': máy chủ xử lý quá lâu – bấm lại ô Kỳ để tải lại.</div>'; } }, 45000);
    var ket = function () { het = true; clearTimeout(hen); dang--; xong++; capNhatTT(); tiep(); };
    google.script.run.withSuccessHandler(function (r) {
      if (!conHieuLuc()) { ket(); return; }
      var e = o(p.MaXuong);
      try {
        if (!r || !r.ok) { if (e) e.innerHTML = '<div class="alert a-bd">' + esc(p.TenXuong) + ': ' + esc((r && r.msg) || 'Lỗi tải dữ liệu') + '</div>'; }
        else {
          var g = KPI_TC.gop; g.ds = g.ds.concat(r.ds || []); g.tamTinh = g.tamTinh || !!r.tamTinh; g.kieu = r.kieu;
          if (e) { if ((r.ds || []).length) kpiVeVao_(e, r); else e.innerHTML = '<div class="note" style="margin-bottom:12px">' + esc(p.TenXuong) + ': chưa có dữ liệu kỳ này.</div>'; }
          window.__kpiR = g;
        }
      } catch (er) { if (e) e.innerHTML = '<div class="alert a-bd">Lỗi hiển thị ' + esc(p.TenXuong) + ': ' + esc(er.message || er) + '</div>'; }
      ket();
    }).withFailureHandler(function (er) {
      if (conHieuLuc()) { var e = o(p.MaXuong); if (e) e.innerHTML = '<div class="alert a-bd">Không tải được ' + esc(p.TenXuong) + ': ' + esc((er && er.message) || er) + '</div>'; }
      ket();
    }).layKPIKy(TOKEN, kpiKy.kieu, kpiKy.giaTri, p.MaXuong);
  };
  var tiep = function () { if (!conHieuLuc()) return; while (dang < 3 && cho.length) mot(cho.shift()); };
  if (!ds.length) { box.innerHTML = '<div class="card"><div class="empty">Chưa có xưởng nào.</div></div>'; return; }
  tiep();
};
