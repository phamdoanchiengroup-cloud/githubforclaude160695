
/* =====================================================================
   BÁO CÁO THÁNG (PDF) — tự tổng hợp khi chốt tháng, gửi ban lãnh đạo; trưởng phòng tải báo cáo xưởng mình.
   - Số liệu KPI lấy đúng như bảng KPI trên web: bản chốt chính thức (sheet KPIThang), xưởng nào chưa chốt thì tính trực tiếp.
   - Một lần đọc dữ liệu dựng được cả báo cáo toàn nhà máy lẫn từng xưởng (bcDuLieu_).
   - HTML chỉ dùng bảng + màu nền (không flex/grid/SVG) để Apps Script đổi sang PDF ổn định.
   Người nhận: sheet "NguoiNhanBaoCao" (Email | NhanBaoCao = TOAN_NHA_MAY / mã xưởng / TAT_CA | GhiChu).
   ===================================================================== */
var BC_THU_MUC = 'Báo cáo KPI hằng tháng';
var BC_SHEET_NHAN = 'NguoiNhanBaoCao';
var BC_LOAI = ['A+','A','B','C','D'];
var BC_MAU_LOAI = { 'A+':'#1e7f5c', 'A':'#3aa57a', 'B':'#d29b2a', 'C':'#e07b39', 'D':'#c0392b' };

function bcSo_(v, n) {
  if (v === null || v === undefined || v === '' || isNaN(v)) return '–';
  n = n || 0;
  var p = Math.abs(Number(v)).toFixed(n).split('.');
  p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (Number(v) < 0 && Number(p.join('.')) !== 0 ? '-' : '') + p.join(',');
}
function bcE_(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function bcThang_(ky) { return 'tháng ' + Number(ky.slice(5,7)) + '/' + ky.slice(0,4); }
function bcLech_(moi, cu, n, donVi, nguoc) {          // "▲ 2,1 điểm" xanh / đỏ (nguoc: giảm là tốt)
  if (moi === null || cu === null || moi === undefined || cu === undefined || isNaN(moi) || isNaN(cu)) return '<span style="color:#8a949c">chưa so được với tháng trước</span>';
  var d = moi - cu, tot = nguoc ? d < 0 : d > 0;
  if (Math.abs(d) < Math.pow(10, -(n||0)) / 2) return '<span style="color:#8a949c">không đổi</span>';
  return '<span style="color:' + (tot ? '#1e7f5c' : '#c0392b') + '">' + (d > 0 ? '▲ ' : '▼ ') + bcSo_(Math.abs(d), n) + (donVi || '') + '</span>';
}
function bcTenX_(du, mx) { var t = String(du.tenX[mx] || mx); return /^(xưởng|phòng|bộ phận|tổ)(\s|$)/i.test(t) ? t : 'Xưởng ' + t; }
function bcTB_(arr, f) { if (!arr.length) return null; return arr.reduce(function(s,o){ return s + Number(o[f]||0); }, 0) / arr.length; }

/* KPI công nhân 1 tháng: giống layKPIKy (chốt chính thức; xưởng chưa chốt -> tính trực tiếp) */
function bcKpiKy_(ky) {
  var snap = laySnapshotThang_(ky, '');
  var theoX = {};
  snap.forEach(function(r){ (theoX[r.MaXuong] = theoX[r.MaXuong] || []).push(r); });
  var xTam = Object.keys(theoX).filter(function(mx){ return theoX[mx].every(laChotTam_); });
  var ds = snap, chinhThuc = snap.length > 0 && !xTam.length && ky < kyVN_();
  if (!snap.length || xTam.length || ky >= kyVN_()) {
    var song = tinhThangTrucTiep_(ky, '');
    ds = (!snap.length || ky >= kyVN_()) ? song
      : snap.filter(function(r){ return xTam.indexOf(r.MaXuong) < 0; }).concat(song.filter(function(r){ return xTam.indexOf(r.MaXuong) >= 0; }));
  }
  var out = ds.map(function(o){
    return { MaNV:o.MaNV, HoTen:o.HoTen, MaXuong:o.MaXuong, sl:Number(o.HieuSuatSL), cl:Number(o.ChatLuong), tt:Number(o.TuanThu),
             at:Number(o.AnToan), tong:Number(o.TongKPI), spl:Number(o.TongSanLuong||0) };
  });
  var theoXuong = {};
  out.forEach(function(o){ o.loai = loaiKPI_(o.tong); (theoXuong[o.MaXuong] = theoXuong[o.MaXuong] || []).push(o); });
  Object.keys(theoXuong).forEach(function(mx){ sapXepHang_(theoXuong[mx]); });
  return { ds:out, chinhThuc:chinhThuc };
}

/* KPI quản lý (TP/PP) 1 tháng — cùng cách tính với layKPIQuanLy, không cần phiên đăng nhập */
function bcKpiQL_(ky) {
  try {
    var dt = docDuLieuKPI_(canLuuTru_([ky]));
    dt.congdoan = doc_('CongDoan');
    if (!dt.xacNhanDD) dt.xacNhanDD = ss_().getSheetByName('XacNhanDiemDanh') ? doc_('XacNhanDiemDanh') : [];
    dt.phatTre = ss_().getSheetByName('PhatNhapTre') ? doc_('PhatNhapTre') : [];
    dt.mienKPI = {};
    if (ss_().getSheetByName('MienTruKPIQuanLy')) doc_('MienTruKPIQuanLy').forEach(function(m){ dt.mienKPI[String(m.IdKhoan)] = m.LyDo || 1; });
    var xuongCuaCD = {}, nkTheoXuong = {};
    dt.congdoan.forEach(function(c){ xuongCuaCD[c.MaCD] = String(c.MaXuong); });
    dt.nhatky.forEach(function(r){ var mx = xuongCuaCD[r.MaCD]; if (mx) (nkTheoXuong[mx] = nkTheoXuong[mx] || []).push(r); });
    return doc_('TaiKhoan').filter(function(a){ var vt = String(a.VaiTro).trim(); return (vt === 'TP' || vt === 'PP') && a.MaNV; }).map(function(a){
      var nv = dt.nhansu.filter(function(x){ return x.MaNV === a.MaNV; })[0];
      if (!nv) return null;
      dt.nhatkyXuong = nkTheoXuong[String(nv.MaXuong)] || [];
      var k = kpiQuanLy_(nv.MaNV, nv.MaXuong, ky, dt);
      return { MaNV:nv.MaNV, HoTen:nv.HoTen, MaXuong:nv.MaXuong, vaiTro:String(a.VaiTro).trim(), tong:k.tong,
               hsXuong:k.hieuSuatXuong, tlDat:k.tyLeDatXuong, vanHanh:k.vanHanh, neNep:k.neNep };
    }).filter(Boolean);
  } catch (e) { Logger.log('KPI quản lý lỗi: ' + e); return []; }
}

/* Gom MỌI số liệu của 1 tháng (+ tháng trước để so sánh). Dùng chung cho báo cáo toàn nhà máy và từng xưởng. */
function bcDuLieu_(ky) {
  var kyT = kyTruoc_(ky);
  var dt = docDuLieuKPI_(canLuuTru_([ky, kyT]));
  var congdoan = doc_('CongDoan'), xuongCD = {}, tenCD = {};
  congdoan.forEach(function(c){ xuongCD[c.MaCD] = String(c.MaXuong); tenCD[c.MaCD] = c.TenCD; });
  var tenX = {};
  doc_('PhongBan').forEach(function(p){ tenX[p.MaXuong] = p.TenXuong; });
  var maQL = mapQuanLy_();

  var k = bcKpiKy_(ky), kT = bcKpiKy_(kyT);
  var kpiT = {};
  kT.ds.forEach(function(o){ kpiT[o.MaNV] = o; });

  // ---- Sản lượng (nhật ký đã chốt), lỗi KCS, giờ chuẩn; theo xưởng / ngày / công đoạn
  function sanLuong(thang) {
    var X = {}, CD = {}, daTinhLoi = {}, dong = 0;
    dt.nhatky.forEach(function(r){
      if (String(r.TrangThai).trim() !== 'Đã chốt') return;
      var ng = ngayVN_(r.Ngay); if (ng.slice(0,7) !== thang) return;
      var mx = xuongCD[r.MaCD] || dt.idxXuongNV[r.MaNV] || ''; dong++;
      var sl = Number(r.SoLuongLamRa) || 0, d = dt.idxDM[r.MaCD] || 0, gio = soVN_(r.GioLam) || 0;
      var kl = r.MaNV + '|' + ng + '|' + r.MaCD, loi = daTinhLoi[kl] ? 0 : (dt.idxLoi[kl] || 0); daTinhLoi[kl] = 1;
      var x = X[mx] || (X[mx] = { sl:0, loi:0, gc:0, gio:0, ngay:{}, nguoi:{} });
      x.sl += sl; x.loi += loi; x.ngay[ng] = (x.ngay[ng] || 0) + sl; x.nguoi[r.MaNV] = 1;
      if (d > 0) { x.gc += Math.max(0, sl - loi) / d; if (gio > 0) x.gio += gio; }
      var c = CD[r.MaCD] || (CD[r.MaCD] = { MaCD:r.MaCD, ten:tenCD[r.MaCD] || r.MaCD, MaXuong:mx, dm:d, sl:0, loi:0, gc:0, gio:0, nguoi:{} });
      c.sl += sl; c.loi += loi; c.nguoi[r.MaNV] = 1;
      if (d > 0) { c.gc += Math.max(0, sl - loi) / d; if (gio > 0) c.gio += gio; }
    });
    Object.keys(CD).forEach(function(m){ var c = CD[m]; c.hs = (c.dm > 0 && c.gio > 0) ? c.gc / c.gio * 100 : null; c.soNguoi = Object.keys(c.nguoi).length; c.tlLoi = c.sl ? c.loi / c.sl * 100 : 0; });
    return { X:X, CD:CD, dong:dong };
  }
  var sl = sanLuong(ky), slT = sanLuong(kyT);

  // ---- Chuyên cần: ký hiệu chấm tay trong tháng; ngày công = ngày xưởng đã điểm danh
  function chuyenCan(thang) {
    var X = {}, nguoi = {};
    dt.diemdanh.forEach(function(r){
      var ng = ngayVN_(r.Ngay); if (ng.slice(0,7) !== thang) return;
      var mx = r.MaXuong || dt.idxXuongNV[r.MaNV] || '', kh = khTuBanGhi_(r);
      var x = X[mx] || (X[mx] = { cp:0, kp:0, muon:0, nua:0 });
      var n = nguoi[r.MaNV] || (nguoi[r.MaNV] = { MaNV:r.MaNV, MaXuong:mx, cp:0, kp:0, muon:0, nua:0 });
      if (laVangKyHieu_(kh)) { if (laKhongPhepKyHieu_(kh)) { x.kp++; n.kp++; } else { x.cp++; n.cp++; } }
      else if (kh === '0.5x') { x.nua++; n.nua++; }
      else if (kh.indexOf('x-') === 0) { x.muon++; n.muon++; }
    });
    Object.keys(X).forEach(function(mx){
      var ngayCong = {}; (dt.idxNgayDD[mx + '|' + thang] || []).forEach(function(d){ ngayCong[d] = 1; });
      var soNg = Object.keys(ngayCong).length, soNguoi = dt.nhansu.filter(function(x){ return x.MaXuong === mx; }).length;
      X[mx].ngayCong = soNg; X[mx].tyLe = (soNg && soNguoi) ? Math.max(0, 100 - (X[mx].cp + X[mx].kp) / (soNg * soNguoi) * 100) : null;
    });
    return { X:X, nguoi:nguoi };
  }
  var cc = chuyenCan(ky), ccT = chuyenCan(kyT);

  // ---- Vi phạm trong tháng
  var tenVP = {}; (dt.dmvp || []).forEach(function(v){ tenVP[v.MaVP] = v.TenViPham; });
  function viPham(thang) {
    return (dt.vipham || []).filter(function(v){ return ngayVN_(v.Ngay).slice(0,7) === thang; }).map(function(v){
      return { MaNV:v.MaNV, MaXuong:dt.idxXuongNV[v.MaNV] || '', ten:tenVP[v.MaVP] || v.MaVP, ngay:ngayVN_(v.Ngay), ghiChu:v.GhiChu || '' };
    });
  }
  var vp = viPham(ky), vpT = viPham(kyT);
  var tre = docAnToan_('PhatNhapTre').filter(function(r){ return ngayVN_(r.Ngay).slice(0,7) === ky; });

  // ---- Nhân sự
  var tenNV = {}; doc_('NhanSu').forEach(function(x){ tenNV[x.MaNV] = x.HoTen; });   // gồm cả người đã nghỉ việc
  var nsX = {};
  dt.nhansu.forEach(function(x){
    var o = nsX[x.MaXuong] || (nsX[x.MaXuong] = { tong:0, cn:0, moi:0 });
    o.tong++; if (!maQL[String(x.MaNV).trim()]) o.cn++;
    if (ngayVN_(x.NgayVaoLam).slice(0,7) === ky) o.moi++;
  });

  // Tháng trước có đủ dữ liệu để so không? (vd. tháng đầu dùng web chỉ có vài ngày) -> ít hơn 60% số ngày có sản lượng, hoặc ít hơn một nửa số dòng nhập thì không so
  function soNgaySL(S){ var d = {}; Object.keys(S.X).forEach(function(m){ Object.keys(S.X[m].ngay).forEach(function(n){ d[n] = 1; }); }); return Object.keys(d).length; }
  var duSo = soNgaySL(slT) >= Math.max(1, soNgaySL(sl) * .6) && slT.dong >= sl.dong * .5;   // và số dòng nhập ít nhất bằng nửa tháng này
  var ql = bcKpiQL_(ky);
  var dsX = Object.keys(tenX).filter(function(mx){
    return nsX[mx] || sl.X[mx] || k.ds.some(function(o){ return o.MaXuong === mx; });
  });
  return { ky:ky, kyT:kyT, tenX:tenX, dsX:dsX, tenNV:tenNV, kpi:k.ds, kpiT:kpiT, kpiTds:kT.ds, chinhThuc:k.chinhThuc,
           sl:sl, slT:slT, cc:cc, ccT:ccT, vp:vp, vpT:vpT, duSo:duSo, tre:tre, ns:nsX, ql:ql, com:bcCom_(ky), lapLuc:new Date() };
}

/* Suất ăn trưa của tháng theo xưởng (module cơm trưa); lỗi / chưa dùng thì trả mảng rỗng */
function bcCom_(ky) { try { return typeof comBaoCao_ === 'function' ? comBaoCao_(ky) : []; } catch (e) { return []; } }
function bcComHtml_(ds, so) {
  if (!ds.length) return '';
  var tong = { soNgay:0, an:0, khong:0, chua:0 };
  ds.forEach(function(x){ tong.soNgay = Math.max(tong.soNgay, x.soNgay); tong.an += x.an; tong.khong += x.khong; tong.chua += x.chua; });
  var dong = function(x, i, dam){ return '<tr' + (i % 2 ? ' class="chan"' : '') + '><td>' + (dam ? '<b>' : '') + bcE_(x.ten) + (dam ? '</b>' : '') + '</td><td class="r">' + x.soNgay + '</td><td class="r"><b>' + bcSo_(x.an) + '</b></td><td class="r">' + bcSo_(x.khong) + '</td><td class="r">' + bcSo_(x.chua) + '</td><td class="r">' + (x.soNgay ? bcSo_(x.an / x.soNgay, 1) : '–') + '</td></tr>'; };
  return '<h2>' + so + '. Suất ăn trưa</h2><table class="bang"><tr><th>Xưởng</th><th class="r">Ngày có cơm</th><th class="r">Suất ăn</th><th class="r">Không ăn</th><th class="r">Chưa đăng ký</th><th class="r">TB suất / ngày</th></tr>' +
    ds.map(function(x, i){ return dong(x, i); }).join('') + (ds.length > 1 ? dong({ ten:'Toàn nhà máy', soNgay:tong.soNgay, an:tong.an, khong:tong.khong, chua:tong.chua }, ds.length, true) : '') +
    '</table><p class="nho">Theo đăng ký cơm trưa trên web (hạn chót 16:00 hôm trước). "Chưa đăng ký": người có tài khoản nhưng không bấm Ăn / Không ăn.</p>';
}

/* Tóm tắt số của 1 phạm vi (mx = '' -> toàn nhà máy) */
function bcTomTat_(du, mx) {
  function loc(a){ return mx ? a.filter(function(o){ return o.MaXuong === mx; }) : a; }
  function cong(X, f){ return Object.keys(X).filter(function(m){ return !mx || m === mx; }).reduce(function(s,m){ return s + (X[m][f] || 0); }, 0); }
  var kp = loc(du.kpi), kpT = loc(du.kpiTds);
  var phanLoai = {}; BC_LOAI.forEach(function(l){ phanLoai[l] = 0; }); kp.forEach(function(o){ phanLoai[o.loai]++; });
  var sl = cong(du.sl.X,'sl'), loi = cong(du.sl.X,'loi'), slT = cong(du.slT.X,'sl'), loiT = cong(du.slT.X,'loi');
  function tlCC(C){ var tu=0, mau=0; Object.keys(C.X).filter(function(m){ return !mx || m === mx; }).forEach(function(m){ var c=C.X[m], n=(du.ns[m]||{}).tong||0; if (c.ngayCong && n){ tu += c.cp + c.kp; mau += c.ngayCong*n; } }); return mau ? 100 - tu/mau*100 : null; }
  var ngay = {};
  Object.keys(du.sl.X).filter(function(m){ return !mx || m === mx; }).forEach(function(m){ var n = du.sl.X[m].ngay; Object.keys(n).forEach(function(d){ ngay[d] = (ngay[d]||0) + n[d]; }); });
  var r = {
    soNguoi:kp.length, kpiTB:bcTB_(kp,'tong'), kpiTBT:bcTB_(kpT,'tong'), hsTB:bcTB_(kp,'sl'), clTB:bcTB_(kp,'cl'), ttTB:bcTB_(kp,'tt'), atTB:bcTB_(kp,'at'),
    phanLoai:phanLoai, tlTot: kp.length ? (phanLoai['A+'] + phanLoai['A']) / kp.length * 100 : null,
    tlTotT: kpT.length ? kpT.filter(function(o){ return o.tong >= 90; }).length / kpT.length * 100 : null,
    sl:sl, slT:slT, tlLoi: sl ? loi/sl*100 : null, tlLoiT: slT ? loiT/slT*100 : null,
    cc:tlCC(du.cc), ccT:tlCC(du.ccT), vp:loc(du.vp).length, vpT:loc(du.vpT).length, tre:loc(du.tre).length, ngay:ngay
  };
  if (!du.duSo) { r.kpiTBT = r.tlTotT = r.tlLoiT = r.ccT = r.vpT = null; r.slT = 0; }
  return r;
}

/* Nhận định tự động bằng lời (mức: 'tot' | 'canh' | 'xau') */
function bcNhanDinh_(du, mx) {
  var t = bcTomTat_(du, mx), out = [], ten = mx ? bcTenX_(du, mx) : 'Toàn nhà máy';
  if (t.kpiTB !== null) {
    var d = t.kpiTBT !== null ? t.kpiTB - t.kpiTBT : null;
    out.push({ m: t.kpiTB >= 90 ? 'tot' : t.kpiTB >= 80 ? 'canh' : 'xau', s: ten + ' đạt KPI trung bình <b>' + bcSo_(t.kpiTB,1) + '</b> (' + loaiKPI_(t.kpiTB) + ')' +
      (d !== null ? ', ' + (Math.abs(d) < .05 ? 'không đổi' : (d > 0 ? 'tăng ' : 'giảm ') + bcSo_(Math.abs(d),1) + ' điểm') + ' so với ' + bcThang_(du.kyT) : '') + '.' });
  }
  if (!mx) {
    var bx = du.dsX.map(function(m){ var x = bcTomTat_(du, m); return { m:m, kpi:x.kpiTB, d: (x.kpiTB !== null && x.kpiTBT !== null) ? x.kpiTB - x.kpiTBT : null, n:x.soNguoi }; }).filter(function(x){ return x.kpi !== null && x.n >= 3; });
    if (bx.length >= 2) {
      bx.sort(function(a,b){ return b.kpi - a.kpi; });
      out.push({ m:'tot', s:'Dẫn đầu: <b>' + bcE_(bcTenX_(du, bx[0].m)) + '</b> (' + bcSo_(bx[0].kpi,1) + '). Thấp nhất: <b>' + bcE_(bcTenX_(du, bx[bx.length-1].m)) + '</b> (' + bcSo_(bx[bx.length-1].kpi,1) + ').' });
      var coD = bx.filter(function(x){ return x.d !== null; }).sort(function(a,b){ return a.d - b.d; });
      if (coD.length && coD[0].d <= -3) out.push({ m:'xau', s:'<b>' + bcE_(bcTenX_(du, coD[0].m)) + '</b> giảm mạnh nhất: ' + bcSo_(-coD[0].d,1) + ' điểm so với tháng trước – cần tìm nguyên nhân.' });
      if (coD.length && coD[coD.length-1].d >= 3) out.push({ m:'tot', s:'<b>' + bcE_(bcTenX_(du, coD[coD.length-1].m)) + '</b> tiến bộ nhất: tăng ' + bcSo_(coD[coD.length-1].d,1) + ' điểm.' });
    }
  }
  if (t.phanLoai.D) out.push({ m:'xau', s:'<b>' + t.phanLoai.D + ' người</b> xếp loại D (dưới 70 điểm)' + (t.soNguoi ? ', chiếm ' + bcSo_(t.phanLoai.D / t.soNguoi * 100,1) + '%' : '') + ' – nên trao đổi riêng và có kế hoạch kèm cặp.' });
  if (t.sl) out.push({ m: (t.slT && t.sl < t.slT * .95) ? 'canh' : 'tot', s:'Tổng sản lượng <b>' + bcSo_(t.sl) + '</b> sản phẩm' + (t.slT ? ' (' + (t.sl >= t.slT ? 'tăng ' : 'giảm ') + bcSo_(Math.abs(t.sl - t.slT) / t.slT * 100,1) + '% so với tháng trước)' : '') + '.' });
  if (t.tlLoi !== null && t.tlLoi >= 1) out.push({ m: t.tlLoi >= 3 ? 'xau' : 'canh', s:'Tỷ lệ hàng không đạt (KCS) <b>' + bcSo_(t.tlLoi,2) + '%</b>' + (t.tlLoiT !== null ? ' (tháng trước ' + bcSo_(t.tlLoiT,2) + '%)' : '') + '.' });
  var cd = Object.keys(du.sl.CD).map(function(m){ return du.sl.CD[m]; }).filter(function(c){ return (!mx || c.MaXuong === mx) && c.hs !== null && c.gio >= 40; });
  var yeu = cd.filter(function(c){ return c.hs < 80; }).sort(function(a,b){ return b.gio - a.gio; });
  if (yeu.length) out.push({ m:'canh', s:'<b>' + yeu.length + ' công đoạn</b> chạy dưới 80% định mức (nhiều giờ nhất: ' + yeu.slice(0,3).map(function(c){ return bcE_(c.ten) + ' ' + bcSo_(c.hs,0) + '%'; }).join(', ') + ') – xem lại định mức hoặc đào tạo tay nghề.' });
  var vuot = cd.filter(function(c){ return c.hs > 130; });
  if (vuot.length) out.push({ m:'canh', s:'<b>' + vuot.length + ' công đoạn</b> vượt 130% định mức – có thể định mức đang thấp so với thực tế.' });
  if (t.cc !== null && t.cc < 95) out.push({ m: t.cc < 90 ? 'xau' : 'canh', s:'Tỷ lệ chuyên cần <b>' + bcSo_(t.cc,1) + '%</b>.' });
  var kp = Object.keys(du.cc.nguoi).map(function(m){ return du.cc.nguoi[m]; }).filter(function(n){ return (!mx || n.MaXuong === mx) && n.kp >= 2; });
  if (kp.length) out.push({ m:'xau', s:'<b>' + kp.length + ' người</b> nghỉ không phép từ 2 ngày trở lên.' });
  if (t.vp) out.push({ m: (t.vpT !== null && t.vp <= t.vpT) ? 'tot' : 'canh', s:'<b>' + t.vp + '</b> lượt vi phạm nề nếp/chuyên cần' + (t.vpT !== null ? ' (tháng trước ' + t.vpT + ')' : '') + '.' });
  if (!du.duSo && !mx) out.push({ m:'canh', s:'Tháng trước (' + bcThang_(du.kyT) + ') có quá ít dữ liệu trên web (mới bắt đầu dùng) nên báo cáo này <b>không so sánh</b> với tháng trước.' });
  if (t.tre) out.push({ m:'canh', s:'<b>' + t.tre + '</b> lượt bị phạt nhập sản lượng trễ.' });
  return out;
}

/* ---------------- Dựng HTML (bảng thuần, an toàn khi đổi PDF) ---------------- */
var BC_CSS = 'body{font-family:Arial,Helvetica,sans-serif;color:#1d2a33;font-size:10pt;margin:0}' +
  'table{border-collapse:collapse;width:100%}td,th{padding:4px 6px;vertical-align:middle}' +
  '.bang th{background:#0f4c5c;color:#ffffff;font-size:8.5pt;font-weight:bold;text-align:left;border:1px solid #0f4c5c}' +
  '.bang td{border:1px solid #d5dbe0;font-size:9pt}.bang tr.chan td{background:#f5f8fa}.r{text-align:right}.c{text-align:center}' +
  'h2{font-size:13pt;color:#0f4c5c;margin:18px 0 6px;padding-bottom:3px;border-bottom:2px solid #127c74}' +
  '.nho{font-size:8.5pt;color:#5b6770}.trang{page-break-before:always}h2{page-break-after:avoid}tr{page-break-inside:avoid}thead{display:table-header-group}';

function bcThanh_(pt, mau, cao) {            // thanh ngang: bảng 2 ô theo %
  pt = Math.max(0, Math.min(100, pt || 0));
  return '<table style="width:100%;height:' + (cao||8) + 'px"><tr>' + (pt > 0 ? '<td style="width:' + pt.toFixed(1) + '%;background:' + mau + ';padding:0;height:' + (cao||8) + 'px"></td>' : '') +
    (pt < 100 ? '<td style="background:#e8edf0;padding:0"></td>' : '') + '</tr></table>';
}
function bcChongLoai_(pl, tong) {             // thanh xếp chồng phân loại A+..D
  if (!tong) return '';
  var h = '<table style="width:100%;height:14px"><tr>';
  BC_LOAI.forEach(function(l){ var p = pl[l] / tong * 100; if (p > 0) h += '<td style="width:' + p.toFixed(1) + '%;background:' + BC_MAU_LOAI[l] + ';padding:0;color:#fff;font-size:7.5pt;text-align:center">' + (p >= 7 ? l : '') + '</td>'; });
  return h + '</tr></table>';
}
function bcCotNgay_(ngay, ky) {               // biểu đồ cột sản lượng theo ngày
  var ds = Object.keys(ngay).sort(); if (!ds.length) return '<p class="nho">Chưa có sản lượng đã duyệt trong tháng.</p>';
  var max = Math.max.apply(null, ds.map(function(d){ return ngay[d]; })), TB = ds.reduce(function(s,d){ return s + ngay[d]; }, 0) / ds.length, CAO = 110;
  var h = '<table style="width:100%;table-layout:fixed"><tr>';
  ds.forEach(function(d){ var v = ngay[d], ch = Math.max(2, Math.round(v / max * CAO));
    h += '<td style="vertical-align:bottom;padding:0 1px;height:' + (CAO + 14) + 'px;text-align:center"><div style="font-size:6pt;color:#5b6770">' + (v >= 1000 ? bcSo_(v/1000,1) + 'k' : bcSo_(v)) + '</div>' +
      '<div style="height:' + ch + 'px;background:' + (v < TB * .8 ? '#e0a03a' : '#127c74') + '"></div></td>'; });
  h += '</tr><tr>';
  ds.forEach(function(d){ h += '<td style="font-size:6.5pt;color:#5b6770;text-align:center;padding:2px 0;border-top:1px solid #9aa6ae">' + Number(d.slice(8)) + '</td>'; });
  return h + '</tr></table><p class="nho">Cột cam: ngày thấp hơn 80% mức trung bình ' + bcSo_(TB) + ' sp/ngày. Sản lượng tính theo ngày làm, chỉ gồm dòng đã duyệt.</p>';
}
function bcO_(nhan, gt, phu, mau) {
  return '<td style="width:33%;padding:5px"><table style="border:1px solid #d5dbe0;border-left:4px solid ' + (mau || '#127c74') + ';background:#fafcfd"><tr><td style="padding:8px 10px">' +
    '<div style="font-size:8.5pt;color:#5b6770">' + nhan + '</div><div style="font-size:18pt;font-weight:bold;color:#1d2a33;margin:2px 0">' + gt + '</div><div style="font-size:8pt">' + phu + '</div></td></tr></table></td>';
}
function bcDau_(du, mx, tieuDe) {
  var lap = Utilities.formatDate(du.lapLuc, TZ_VN, 'HH:mm dd/MM/yyyy');
  return '<table style="background:#0f4c5c;color:#ffffff"><tr><td style="padding:16px 18px">' +
    '<div style="font-size:9pt;letter-spacing:1px;color:#9fd8d1">BÁO CÁO SẢN XUẤT &amp; KPI</div>' +
    '<div style="font-size:20pt;font-weight:bold;margin-top:4px">' + tieuDe + '</div>' +
    '<div style="font-size:11pt;margin-top:2px">' + (mx ? bcE_(bcTenX_(du, mx)) + ' · ' : '') + bcThang_(du.ky).replace('tháng','Tháng') + '</div></td>' +
    '<td style="padding:16px 18px;text-align:right;font-size:8.5pt;color:#cfe3e6;vertical-align:bottom">Lập tự động lúc ' + lap + '<br>' +
    (du.chinhThuc ? 'Số liệu KPI: <b style="color:#ffffff">đã chốt chính thức</b>' : 'Số liệu KPI: <b style="color:#ffd27a">tạm tính (chưa chốt)</b>') + '</td></tr></table>';
}
function bcNhanDinhHtml_(nd) {
  if (!nd.length) return '';
  var mau = { tot:'#1e7f5c', canh:'#b7791f', xau:'#c0392b' };
  return '<table>' + nd.map(function(x){ return '<tr><td style="width:14px;vertical-align:top;padding:5px 0"><div style="width:9px;height:9px;background:' + mau[x.m] + ';margin-top:3px"></div></td><td style="padding:4px 6px;font-size:10pt;line-height:1.45">' + x.s + '</td></tr>'; }).join('') + '</table>';
}
function bcTomTatHtml_(t, du) {
  return '<table><tr>' +
    bcO_('KPI trung bình công nhân', t.kpiTB === null ? '–' : bcSo_(t.kpiTB,1), bcLech_(t.kpiTB, t.kpiTBT, 1, ' điểm') + ' · ' + t.soNguoi + ' người', t.kpiTB >= 90 ? '#1e7f5c' : t.kpiTB >= 80 ? '#d29b2a' : '#c0392b') +
    bcO_('Tổng sản lượng (sp)', bcSo_(t.sl), t.slT ? bcLech_(t.sl / t.slT * 100, 100, 1, '%') + ' so với tháng trước' : 'chưa có tháng trước') +
    bcO_('Tỷ lệ xếp loại A+/A', t.tlTot === null ? '–' : bcSo_(t.tlTot,1) + '%', bcLech_(t.tlTot, t.tlTotT, 1, ' điểm %')) + '</tr><tr>' +
    bcO_('Tỷ lệ hàng không đạt (KCS)', t.tlLoi === null ? '–' : bcSo_(t.tlLoi,2) + '%', bcLech_(t.tlLoi, t.tlLoiT, 2, ' điểm %', true), t.tlLoi >= 3 ? '#c0392b' : '#127c74') +
    bcO_('Tỷ lệ chuyên cần', t.cc === null ? '–' : bcSo_(t.cc,1) + '%', bcLech_(t.cc, t.ccT, 1, ' điểm %')) +
    bcO_('Vi phạm nề nếp / nhập trễ', t.vp + ' / ' + t.tre, bcLech_(t.vp, t.vpT, 0, ' lượt', true)) + '</tr></table>';
}
function bcBangKPI_(ds, du, coXuong) {
  var h = '<table class="bang"><tr><th class="c">' + (coXuong ? 'Hạng trong xưởng' : 'Hạng') + '</th><th>Mã</th><th>Họ tên</th>' + (coXuong ? '<th>Xưởng</th>' : '') +
    '<th class="r">Sản lượng %</th><th class="r">Chất lượng</th><th class="r">Tuân thủ</th><th class="r">An toàn</th><th class="r">KPI</th><th class="c">Loại</th>' + (du.duSo ? '<th class="r">So tháng trước</th>' : '') + '<th class="r">Số sp</th></tr>';
  ds.forEach(function(o, i){ var cu = du.duSo ? du.kpiT[o.MaNV] : null;
    h += '<tr' + (i % 2 ? ' class="chan"' : '') + '><td class="c">' + (o.hang || i+1) + '</td><td>' + bcE_(o.MaNV) + '</td><td>' + bcE_(o.HoTen) + '</td>' + (coXuong ? '<td>' + bcE_(du.tenX[o.MaXuong] || o.MaXuong) + '</td>' : '') +
      '<td class="r">' + bcSo_(o.sl,1) + '</td><td class="r">' + bcSo_(o.cl,1) + '</td><td class="r">' + bcSo_(o.tt,0) + '</td><td class="r">' + bcSo_(o.at,0) + '</td>' +
      '<td class="r"><b>' + bcSo_(o.tong,1) + '</b></td><td class="c" style="color:#ffffff;background:' + BC_MAU_LOAI[o.loai] + ';font-weight:bold">' + o.loai + '</td>' +
      (du.duSo ? '<td class="r">' + (cu ? bcLech_(o.tong, cu.tong, 1, '') : '<span style="color:#8a949c">mới</span>') + '</td>' : '') + '<td class="r">' + bcSo_(o.spl) + '</td></tr>'; });
  return h + '</table>';
}
function bcBangCD_(dsCD, du, coXuong) {
  if (!dsCD.length) return '<p class="nho">Không có dữ liệu công đoạn.</p>';
  var h = '<table class="bang"><tr><th>Công đoạn</th>' + (coXuong ? '<th>Xưởng</th>' : '') + '<th class="r">Định mức (sp/giờ)</th><th class="r">Sản lượng</th><th class="r">Giờ chuẩn</th><th class="r">Giờ làm khai</th><th class="r">Hiệu suất</th><th style="width:22%"></th><th class="r">Lỗi KCS</th><th class="r">Số người</th></tr>';
  dsCD.forEach(function(c, i){ var hs = (c.hs !== null && c.gio >= 8) ? c.hs : null, m = hs === null ? '#9aa6ae' : hs > 300 ? '#b7791f' : hs >= 100 ? '#1e7f5c' : hs >= 80 ? '#d29b2a' : '#c0392b';
    h += '<tr' + (i % 2 ? ' class="chan"' : '') + '><td>' + bcE_(c.ten) + '</td>' + (coXuong ? '<td>' + bcE_(du.tenX[c.MaXuong] || c.MaXuong) + '</td>' : '') +
      '<td class="r">' + (c.dm ? bcSo_(c.dm,1) : 'chưa có') + '</td><td class="r">' + bcSo_(c.sl) + '</td><td class="r">' + (c.dm ? bcSo_(c.gc,1) : '–') + '</td><td class="r">' + bcSo_(c.gio,1) + '</td>' +
      '<td class="r" style="color:' + m + ';font-weight:bold">' + (hs === null ? '–' : hs > 300 ? '&gt;300%' : bcSo_(hs,0) + '%') + '</td><td>' + (hs === null ? '' : bcThanh_(hs / 1.5, m, 7)) + '</td>' +
      '<td class="r">' + (c.loi ? bcSo_(c.loi) + ' (' + bcSo_(c.tlLoi,1) + '%)' : '–') + '</td><td class="r">' + c.soNguoi + '</td></tr>'; });
  return h + '</table><p class="nho">Giờ chuẩn = số đạt ÷ định mức. Hiệu suất công đoạn = giờ chuẩn ÷ giờ làm công nhân khai cho công đoạn đó. Thanh đầy = 150%. Công đoạn khai dưới 8 giờ trong tháng không tính hiệu suất (–); trên 300% thường do khai thiếu giờ làm.</p>';
}
function bcPhuongPhap_(du) {
  return '<h2>Ghi chú cách tính</h2><p class="nho" style="line-height:1.5">KPI công nhân lấy đúng như bảng KPI trên web: ' +
    (du.chinhThuc ? 'bản chốt chính thức của tháng.' : 'có xưởng chưa chốt chính thức nên đang tính trực tiếp từ dữ liệu hiện có; số có thể đổi đến khi chốt.') +
    ' KPI = Sản lượng × trọng số + Chất lượng × trọng số + Tuân thủ × trọng số + An toàn × trọng số (trọng số theo đúng kỳ). Xếp loại: A+ ≥ 100, A ≥ 90, B ≥ 80, C ≥ 70, D &lt; 70. ' +
    'Sản lượng chỉ gồm dòng đã duyệt. Tỷ lệ chuyên cần = 1 − (ngày vắng có phép + không phép) ÷ (số người × số ngày đã điểm danh). Không gồm trưởng/phó phòng trong bảng KPI công nhân (có bảng KPI quản lý riêng).</p>';
}

/* Báo cáo TOÀN NHÀ MÁY gửi ban lãnh đạo */
function bcHtmlTong_(du) {
  var t = bcTomTat_(du, ''), h = '<html><head><meta charset="utf-8"><style>' + BC_CSS + '</style></head><body>';
  h += bcDau_(du, '', 'Báo cáo tháng toàn nhà máy');
  h += '<h2>1. Tóm tắt</h2>' + bcTomTatHtml_(t, du);
  h += '<h2>2. Nhận định chính</h2>' + bcNhanDinhHtml_(bcNhanDinh_(du, ''));
  // So sánh xưởng
  var bx = du.dsX.map(function(mx){ var x = bcTomTat_(du, mx); x.mx = mx; x.ql = du.ql.filter(function(q){ return q.MaXuong === mx && q.vaiTro === 'TP'; })[0]; return x; })
    .filter(function(x){ return x.soNguoi || x.sl; }).sort(function(a,b){ return (b.kpiTB||0) - (a.kpiTB||0); });
  h += '<h2>3. So sánh các xưởng</h2><table class="bang"><tr><th class="c">#</th><th>Xưởng</th><th class="r">Người</th><th class="r">KPI TB</th><th style="width:15%">Phân loại A+ → D</th>' + (du.duSo ? '<th class="r">So tháng trước</th>' : '') + '<th class="r">Sản lượng</th><th class="r">Lỗi KCS</th><th class="r">Chuyên cần</th><th class="r">Vi phạm</th><th class="r">KPI trưởng phòng</th></tr>';
  bx.forEach(function(x, i){
    h += '<tr' + (i % 2 ? ' class="chan"' : '') + '><td class="c">' + (i+1) + '</td><td><b>' + bcE_(du.tenX[x.mx] || x.mx) + '</b></td><td class="r">' + x.soNguoi + '</td>' +
      '<td class="r"><b style="color:' + (x.kpiTB >= 90 ? '#1e7f5c' : x.kpiTB >= 80 ? '#b7791f' : '#c0392b') + '">' + bcSo_(x.kpiTB,1) + '</b></td><td>' + bcChongLoai_(x.phanLoai, x.soNguoi) + '</td>' +
      (du.duSo ? '<td class="r">' + bcLech_(x.kpiTB, x.kpiTBT, 1, '') + '</td>' : '') + '<td class="r">' + bcSo_(x.sl) + '</td><td class="r">' + (x.tlLoi === null ? '–' : bcSo_(x.tlLoi,2) + '%') + '</td>' +
      '<td class="r">' + (x.cc === null ? '–' : bcSo_(x.cc,1) + '%') + '</td><td class="r">' + x.vp + '</td><td class="r">' + (x.ql ? bcSo_(x.ql.tong,1) : '–') + '</td></tr>'; });
  h += '</table><p class="nho">Thanh phân loại: <span style="color:' + BC_MAU_LOAI['A+'] + '">■</span> A+ <span style="color:' + BC_MAU_LOAI.A + '">■</span> A <span style="color:' + BC_MAU_LOAI.B + '">■</span> B <span style="color:' + BC_MAU_LOAI.C + '">■</span> C <span style="color:' + BC_MAU_LOAI.D + '">■</span> D. Xếp theo KPI trung bình.</p>';
  // Phân loại toàn nhà máy
  h += '<h2>4. Phân bố xếp loại toàn nhà máy</h2><table class="bang"><tr>' + BC_LOAI.map(function(l){ return '<th class="c" style="background:' + BC_MAU_LOAI[l] + ';border-color:' + BC_MAU_LOAI[l] + '">' + l + '</th>'; }).join('') + '</tr><tr>' +
    BC_LOAI.map(function(l){ return '<td class="c"><b style="font-size:13pt">' + t.phanLoai[l] + '</b><br><span class="nho">' + (t.soNguoi ? bcSo_(t.phanLoai[l]/t.soNguoi*100,1) : '0') + '%</span></td>'; }).join('') + '</tr></table>';
  h += '<div class="trang"></div><h2>5. Sản lượng theo ngày</h2>' + bcCotNgay_(t.ngay, du.ky);
  // Top/bottom
  var ds = du.kpi.slice().sort(function(a,b){ return b.tong - a.tong; });
  h += '<h2>6. 10 công nhân dẫn đầu</h2>' + bcBangKPI_(ds.slice(0,10), du, true);
  h += '<h2>7. 10 công nhân cần hỗ trợ</h2>' + bcBangKPI_(ds.slice(-10).reverse(), du, true);
  // Công đoạn cần chú ý
  var cd = Object.keys(du.sl.CD).map(function(m){ return du.sl.CD[m]; }).filter(function(c){ return c.hs !== null && c.gio >= 40; });
  var yeu = cd.filter(function(c){ return c.hs < 85; }).sort(function(a,b){ return b.gio - a.gio; }).slice(0,12);
  h += '<div class="trang"></div><h2>8. Công đoạn dưới 85% định mức (nhiều giờ nhất)</h2>' + bcBangCD_(yeu, du, true);
  var loi = Object.keys(du.sl.CD).map(function(m){ return du.sl.CD[m]; }).filter(function(c){ return c.loi > 0; }).sort(function(a,b){ return b.loi - a.loi; }).slice(0,8);
  if (loi.length) h += '<h2>9. Công đoạn nhiều hàng lỗi nhất</h2>' + bcBangCD_(loi, du, true);
  // KPI quản lý
  if (du.ql.length) {
    h += '<h2>' + (loi.length ? 10 : 9) + '. KPI quản lý (trưởng / phó phòng)</h2><table class="bang"><tr><th>Họ tên</th><th>Chức vụ</th><th>Xưởng</th><th class="r">Hiệu suất xưởng</th><th class="r">Tỷ lệ đạt</th><th class="r">Vận hành</th><th class="r">Nề nếp</th><th class="r">KPI quản lý</th><th class="c">Loại</th></tr>';
    du.ql.slice().sort(function(a,b){ return b.tong - a.tong; }).forEach(function(q, i){ var l = loaiKPI_(q.tong);
      h += '<tr' + (i % 2 ? ' class="chan"' : '') + '><td>' + bcE_(q.HoTen) + '</td><td>' + (q.vaiTro === 'TP' ? 'Trưởng phòng' : 'Phó phòng') + '</td><td>' + bcE_(du.tenX[q.MaXuong] || q.MaXuong) + '</td>' +
        '<td class="r">' + bcSo_(q.hsXuong,1) + '</td><td class="r">' + bcSo_(q.tlDat,1) + '</td><td class="r">' + bcSo_(q.vanHanh,1) + '</td><td class="r">' + bcSo_(q.neNep,1) + '</td>' +
        '<td class="r"><b>' + bcSo_(q.tong,1) + '</b></td><td class="c" style="color:#fff;background:' + BC_MAU_LOAI[l] + ';font-weight:bold">' + l + '</td></tr>'; });
    h += '</table>';
  }
  h += bcComHtml_(du.com || [], (du.ql.length ? (loi.length ? 11 : 10) : (loi.length ? 10 : 9)));
  return bcThead_(h + bcPhuongPhap_(du) + '</body></html>');
}

/* Báo cáo RIÊNG MỘT XƯỞNG (trưởng phòng tải về) */
function bcHtmlXuong_(du, mx) {
  var t = bcTomTat_(du, mx), tNM = bcTomTat_(du, ''), ten = du.tenX[mx] || mx;
  var hang = du.dsX.map(function(m){ return { m:m, k:bcTomTat_(du, m) }; }).filter(function(x){ return x.k.soNguoi; }).sort(function(a,b){ return (b.k.kpiTB||0) - (a.k.kpiTB||0); });
  var viTri = hang.map(function(x){ return x.m; }).indexOf(mx) + 1;
  var h = '<html><head><meta charset="utf-8"><style>' + BC_CSS + '</style></head><body>';
  h += bcDau_(du, mx, 'Báo cáo tháng ' + bcE_(bcTenX_(du, mx).replace(/^Xưởng/, 'xưởng')));
  h += '<h2>1. Tóm tắt</h2>' + bcTomTatHtml_(t, du);
  h += '<p class="nho">So với toàn nhà máy: KPI trung bình nhà máy ' + bcSo_(tNM.kpiTB,1) + (viTri ? ' · xưởng đứng thứ <b>' + viTri + '/' + hang.length + '</b> về KPI trung bình' : '') + '.</p>';
  h += '<h2>2. Nhận định</h2>' + bcNhanDinhHtml_(bcNhanDinh_(du, mx));
  h += '<h2>3. Phân loại công nhân</h2>' + bcChongLoai_(t.phanLoai, t.soNguoi) + '<p class="nho">' + BC_LOAI.map(function(l){ return l + ': <b>' + t.phanLoai[l] + '</b>'; }).join(' · ') + '</p>';
  var ds = du.kpi.filter(function(o){ return o.MaXuong === mx; }).sort(function(a,b){ return a.hang - b.hang; });
  h += '<h2>4. KPI từng công nhân</h2>' + (ds.length ? bcBangKPI_(ds, du, false) : '<p class="nho">Chưa có KPI.</p>');
  h += '<div class="trang"></div><h2>5. Sản lượng theo ngày</h2>' + bcCotNgay_(t.ngay, du.ky);
  var cd = Object.keys(du.sl.CD).map(function(m){ return du.sl.CD[m]; }).filter(function(c){ return c.MaXuong === mx; }).sort(function(a,b){ return b.gc - a.gc || b.sl - a.sl; });
  h += '<h2>6. 15 công đoạn đóng góp nhiều giờ chuẩn nhất</h2>' + bcBangCD_(cd.slice(0, 15), du, false) +
    (cd.length > 15 ? '<p class="nho">Còn ' + (cd.length - 15) + ' công đoạn khác (xem chi tiết ở trang Phân tích định mức trên web).</p>' : '');
  // Chuyên cần
  var cc = Object.keys(du.cc.nguoi).map(function(m){ return du.cc.nguoi[m]; }).filter(function(n){ return n.MaXuong === mx && (n.cp + n.kp + n.muon + n.nua); })
    .sort(function(a,b){ return (b.kp*3 + b.cp + b.muon*.5) - (a.kp*3 + a.cp + a.muon*.5); });
  h += '<h2>7. Chuyên cần</h2>' + (cc.length ? '<table class="bang"><tr><th>Họ tên</th><th>Mã</th><th class="r">Vắng có phép</th><th class="r">Vắng không phép</th><th class="r">Đi muộn</th><th class="r">Nửa ngày</th></tr>' +
    cc.map(function(n, i){ return '<tr' + (i % 2 ? ' class="chan"' : '') + '><td>' + bcE_(du.tenNV[n.MaNV] || n.MaNV) + '</td><td>' + bcE_(n.MaNV) + '</td><td class="r">' + (n.cp || '–') + '</td><td class="r"' + (n.kp ? ' style="color:#c0392b;font-weight:bold"' : '') + '>' + (n.kp || '–') + '</td><td class="r">' + (n.muon || '–') + '</td><td class="r">' + (n.nua || '–') + '</td></tr>'; }).join('') + '</table>'
    : '<p class="nho">Không có ngày vắng / đi muộn nào được chấm trong tháng.</p>');
  // Vi phạm
  var vp = du.vp.filter(function(v){ return v.MaXuong === mx; }).sort(function(a,b){ return a.ngay.localeCompare(b.ngay); });
  h += '<h2>8. Vi phạm nề nếp</h2>' + (vp.length ? '<table class="bang"><tr><th>Ngày</th><th>Họ tên</th><th>Lỗi</th><th>Ghi chú</th></tr>' +
    vp.map(function(v, i){ return '<tr' + (i % 2 ? ' class="chan"' : '') + '><td>' + v.ngay.slice(8) + '/' + v.ngay.slice(5,7) + '</td><td>' + bcE_(du.tenNV[v.MaNV] || v.MaNV) + '</td><td>' + bcE_(v.ten) + '</td><td>' + bcE_(v.ghiChu) + '</td></tr>'; }).join('') + '</table>'
    : '<p class="nho">Không có vi phạm.</p>');
  var ql = du.ql.filter(function(q){ return q.MaXuong === mx; });
  if (ql.length) h += '<h2>9. KPI quản lý</h2><table class="bang"><tr><th>Họ tên</th><th>Chức vụ</th><th class="r">Hiệu suất xưởng</th><th class="r">Tỷ lệ đạt</th><th class="r">Vận hành</th><th class="r">Nề nếp</th><th class="r">KPI quản lý</th></tr>' +
    ql.map(function(q){ return '<tr><td>' + bcE_(q.HoTen) + '</td><td>' + (q.vaiTro === 'TP' ? 'Trưởng phòng' : 'Phó phòng') + '</td><td class="r">' + bcSo_(q.hsXuong,1) + '</td><td class="r">' + bcSo_(q.tlDat,1) + '</td><td class="r">' + bcSo_(q.vanHanh,1) + '</td><td class="r">' + bcSo_(q.neNep,1) + '</td><td class="r"><b>' + bcSo_(q.tong,1) + '</b></td></tr>'; }).join('') + '</table>';
  h += bcComHtml_((du.com || []).filter(function(x){ return x.mx === mx; }), ql.length ? 10 : 9);
  return bcThead_(h + bcPhuongPhap_(du) + '</body></html>');
}

/* Dòng tiêu đề của mỗi bảng thành <thead> để lặp lại khi bảng sang trang */
function bcThead_(h) { return h.replace(/<table class="bang"><tr>([\s\S]*?)<\/tr>/g, '<table class="bang"><thead><tr>$1</tr></thead>'); }
function bcPdf_(html, tenFile) {
  return HtmlService.createHtmlOutput(html).getAs('application/pdf').setName(tenFile);
}
function bcTenFile_(ky, mx, du) {
  var bo = function(s){ return String(s).normalize ? String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').replace(/[^A-Za-z0-9]+/g,'-') : s; };
  return 'Bao-cao-KPI-' + ky + (mx ? '-' + bo(du.tenX[mx] || mx) : '-Toan-nha-may') + '.pdf';
}

/* API cho web (tên bắt đầu bằng 'lay' để giao diện coi là hàm chỉ đọc): TP tải báo cáo xưởng mình; ban điều hành tải toàn nhà máy hoặc xưởng bất kỳ.
   dang = 'pdf' (mặc định) -> {ok, ten, b64}; 'html' -> {ok, html} để xem / in từ trình duyệt. */
function layBaoCaoThang(token, ky, maXuong, dang) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'ADMIN' && me.vaiTro !== 'TP') return sach_({ ok:false, msg:'Chỉ ban điều hành và trưởng phòng được tải báo cáo tháng.' });
  ky = String(ky || kyTruoc_(kyVN_()));
  if (!/^\d{4}-\d{2}$/.test(ky) || ky > kyVN_()) return sach_({ ok:false, msg:'Tháng không hợp lệ.' });
  var mx = me.vaiTro === 'TP' ? me.xuong : String(maXuong || '');
  var du = bcDuLieu_(ky);
  if (mx && du.dsX.indexOf(mx) < 0) return sach_({ ok:false, msg:'Không có dữ liệu xưởng này trong tháng.' });
  var html = mx ? bcHtmlXuong_(du, mx) : bcHtmlTong_(du);
  if (dang === 'html') return sach_({ ok:true, html:html });
  var ten = bcTenFile_(ky, mx, du);
  return sach_({ ok:true, ten:ten, b64:Utilities.base64Encode(bcPdf_(html, ten).getBytes()) });
}

/* Danh sách người nhận (sheet NguoiNhanBaoCao). Trả {tong:[email], xuong:{MaXuong:[email]}} */
var BC_EMAIL_MAU = 'email-ban-giam-doc@vidu.com';
function bcNguoiNhan_() {
  var o = { tong:[], xuong:{} };
  docAnToan_(BC_SHEET_NHAN).forEach(function(r){
    var em = String(r.Email || '').trim(), loai = String(r.NhanBaoCao || '').trim().toUpperCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return;
    if (em.toLowerCase() === BC_EMAIL_MAU) return;   // dòng mẫu do TAO_SHEET_NGUOI_NHAN_BAO_CAO tạo, chưa thay email thật
    if (loai === 'TOAN_NHA_MAY' || loai === 'TAT_CA' || !loai) o.tong.push(em);
    if (loai === 'TAT_CA') o.tatCa = (o.tatCa || []).concat(em);
    else if (loai && loai !== 'TOAN_NHA_MAY') (o.xuong[String(r.NhanBaoCao).trim()] = o.xuong[String(r.NhanBaoCao).trim()] || []).push(em);
  });
  return o;
}
function bcThuMuc_(ky) {
  var it = DriveApp.getFoldersByName(BC_THU_MUC), goc = it.hasNext() ? it.next() : DriveApp.createFolder(BC_THU_MUC);
  var con = goc.getFoldersByName(ky);
  return con.hasNext() ? con.next() : goc.createFolder(ky);
}

/* Tạo toàn bộ báo cáo của 1 tháng: lưu PDF vào Google Drive (thư mục "Báo cáo KPI hằng tháng/<tháng>") và gửi email.
   Gọi tự động sau khi chốt tháng; cũng chạy tay được (GUI_BAO_CAO_THANG_TRUOC). */
function guiBaoCaoThang_(ky) {
  var du = bcDuLieu_(ky), nhan = bcNguoiNhan_(), thuMuc = null, ketQua = { ky:ky, tep:[], email:0 };
  try { thuMuc = bcThuMuc_(ky); } catch (e) { Logger.log('Không mở được Google Drive: ' + e); }
  var tong = bcPdf_(bcHtmlTong_(du), bcTenFile_(ky, '', du));
  var tepX = {};
  du.dsX.forEach(function(mx){ if (bcTomTat_(du, mx).soNguoi) tepX[mx] = bcPdf_(bcHtmlXuong_(du, mx), bcTenFile_(ky, mx, du)); });
  if (thuMuc) {
    [tong].concat(Object.keys(tepX).map(function(m){ return tepX[m]; })).forEach(function(b){
      var cu = thuMuc.getFilesByName(b.getName()); while (cu.hasNext()) cu.next().setTrashed(true);
      ketQua.tep.push(thuMuc.createFile(b).getName());
    });
  }
  var t = bcTomTat_(du, ''), nd = bcNhanDinh_(du, '').slice(0, 5);
  var than = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#1d2a33"><p>Kính gửi Ban lãnh đạo,</p><p>Hệ thống KPI gửi báo cáo sản xuất &amp; KPI <b>' + bcThang_(ky) + '</b>' + (du.chinhThuc ? ' (đã chốt chính thức)' : ' (tạm tính)') + '.</p>' +
    '<p>KPI trung bình công nhân: <b>' + bcSo_(t.kpiTB,1) + '</b> · Tổng sản lượng: <b>' + bcSo_(t.sl) + '</b> sp · Tỷ lệ A+/A: <b>' + bcSo_(t.tlTot,1) + '%</b></p><ul>' +
    nd.map(function(x){ return '<li style="margin:4px 0">' + x.s + '</li>'; }).join('') + '</ul><p>Chi tiết trong tệp PDF đính kèm' + (thuMuc ? ' và trên Google Drive: <a href="' + thuMuc.getUrl() + '">' + BC_THU_MUC + ' / ' + ky + '</a>' : '') + '.</p>' +
    '<p style="color:#8a949c;font-size:12px">Email tự động từ web KPI sản xuất.</p></div>';
  if (nhan.tong.length) {
    MailApp.sendEmail({ to:nhan.tong.join(','), subject:'Báo cáo sản xuất & KPI ' + bcThang_(ky), htmlBody:than, attachments:[tong], name:'Hệ thống KPI sản xuất' });
    ketQua.email += nhan.tong.length;
  }
  Object.keys(tepX).forEach(function(mx){
    var ds = (nhan.xuong[mx] || []).concat(nhan.tatCa || []);
    if (!ds.length) return;
    MailApp.sendEmail({ to:ds.join(','), subject:'Báo cáo KPI ' + bcThang_(ky) + ' – ' + bcTenX_(du, mx), name:'Hệ thống KPI sản xuất',
      htmlBody:'<div style="font-family:Arial,sans-serif;font-size:14px">Báo cáo KPI ' + bcThang_(ky) + ' của <b>' + bcE_(bcTenX_(du, mx)) + '</b> trong tệp đính kèm.</div>', attachments:[tepX[mx]] });
    ketQua.email += ds.length;
  });
  try { var shLog = ss_().getSheetByName('NhatKyThaoTac'); if (shLog) shLog.appendRow([new Date(),'HE_THONG','Gửi báo cáo tháng','Kỳ ' + ky + ' — ' + ketQua.tep.length + ' tệp, ' + ketQua.email + ' email','','']); } catch (e) {}
  return ketQua;
}

/* ===== Hàm chạy tay (chủ sở hữu) ===== */
/* Chạy 1 lần: tạo sheet người nhận báo cáo. Điền email vào cột Email; cột NhanBaoCao ghi
   TOAN_NHA_MAY (báo cáo cả nhà máy), mã xưởng (vd. SON) để nhận báo cáo xưởng đó, hoặc TAT_CA. */
function TAO_SHEET_NGUOI_NHAN_BAO_CAO() {
  var ss = ss_(), sh = ss.getSheetByName(BC_SHEET_NHAN);
  if (!sh) {
    sh = ss.insertSheet(BC_SHEET_NHAN);
    sh.appendRow(['Email', 'NhanBaoCao', 'GhiChu']);
    sh.appendRow([BC_EMAIL_MAU, 'TOAN_NHA_MAY', 'Thay bằng email thật. Xóa dòng mẫu này nếu không dùng.']);
    sh.setFrozenRows(1);
  }
  Logger.log('Sheet ' + BC_SHEET_NHAN + ' đã sẵn sàng. Mã xưởng dùng được: ' + doc_('PhongBan').map(function(p){ return p.MaXuong + ' (' + p.TenXuong + ')'; }).join(', '));
}
/* Chạy tay: tạo + gửi báo cáo của THÁNG TRƯỚC ngay bây giờ (dùng để thử hoặc gửi bù). */
function GUI_BAO_CAO_THANG_TRUOC() {
  var r = guiBaoCaoThang_(kyTruoc_(kyVN_()));
  Logger.log('Đã tạo ' + r.tep.length + ' tệp trong Drive và gửi ' + r.email + ' email cho kỳ ' + r.ky + '.');
}
