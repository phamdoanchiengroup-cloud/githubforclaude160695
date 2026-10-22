/* =====================================================================
   PHÂN TÍCH ĐỊNH MỨC – BẢN 21/10 (tests/dinh-muc/)
   - Đánh giá ĐỊNH MỨC ĐANG DÙNG trên mọi ngày của kỳ (trước đây dùng định mức từng ngày nên sửa xong vẫn >100%).
   - Gợi ý cho mọi công đoạn lệch mốc 85% quá ±3 điểm, giải cùng lúc (người làm nhiều công đoạn trong ngày
     chia giờ theo tỷ lệ giờ chuẩn, nên định mức các công đoạn ảnh hưởng lẫn nhau).
   - Đổi định mức (mọi đường) áp cho cả tháng đang làm (ngayApDM_), kể cả tháng đã chốt (nhắc Chốt bù).
   ===================================================================== */
var DM_MOC = 85;          // hiệu suất trung vị mong muốn
var DM_SAT = 3;           // lệch ≤ 3 điểm coi là đã sát mốc, không gợi ý
var DM_IT_NGUOI = 3;      // dưới 3 người có dữ liệu: gợi ý kém tin, mặc định không chọn
var __DM_TU = null;       // ngày bắt đầu áp định mức mới trong lượt gọi (tính một lần)

/* Đổi định mức áp cho CẢ THÁNG đang làm (ngày 1 tháng này), kể cả khi tháng đã chốt (chủ dự án 21/10). */
function ngayApDM_() {
  if (__DM_TU === null) __DM_TU = kyVN_() + '-01';
  return __DM_TU;
}
/* Tháng này đã có bản KPI chốt (KPIThang) -> sau khi đổi định mức cần "Chốt bù" để bản đã lưu khớp số mới */
// 22/10: bỏ lời nhắc "Chốt bù" – Bảng KPI của THÁNG ĐANG LÀM luôn tính trực tiếp (không đọc bản đã chốt), mà đổi định mức
// chỉ áp cho tháng đang làm, nên không bao giờ cần chốt bù vì đổi định mức. (Lời nhắc cũ làm chủ dự án bấm chốt tháng 10 giữa tháng.)
function nhacChotBuDM_(msg) { return msg + ' Bảng KPI tháng này tự tính lại theo định mức mới.'; }
/* Bỏ phần lịch sử định mức của maCD từ ngày tu trở đi (để định mức mới áp được cho các ngày đó) */
function catLichSuDM_(maCD, tu) {
  if (!ss_().getSheetByName(LSDM_SHEET)) return;
  var truoc = congNgay_(tu, -1), xoa = [];
  doc_(LSDM_SHEET).forEach(function(x) {
    if (x.MaCD !== maCD) return;
    var a = x.TuNgay ? ngayVN_(x.TuNgay) : '', b = ngayVN_(x.DenNgay);
    if (!b || b < tu) return;                           // đoạn kết thúc trước ngày áp: giữ
    if (a && a >= tu) xoa.push(x._row);                 // nằm trọn sau ngày áp: xóa
    else suaO_(LSDM_SHEET, x._row, 'DenNgay', "'" + truoc);
  });
  if (xoa.length) { xaGhi_(LSDM_SHEET); xoaNhieuDong_(LSDM_SHEET, xoa); }
}

function dmLamTron_(n) {                                  // sai số làm tròn ≤ ~2,5%
  if (!(n > 0)) return 0;
  var buoc = n >= 20 ? 1 : n >= 5 ? 0.5 : n >= 2 ? 0.1 : 0.05;
  return Math.max(buoc, Math.round(Math.round(n / buoc) * buoc * 100) / 100);
}

function phanTichDinhMucGoc_(token, kieu, giaTri) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  if (!me.laOwner && me.vaiTro !== 'TP')
    return sach_({ ok:false, msg:'Không có quyền xem phân tích định mức.' });

  var thangCanLay = [];
  if (kieu === 'thang') thangCanLay = [giaTri];
  else if (kieu === 'quy') {
    var m = String(giaTri).match(/^(\d{4})-Q([1-4])$/);
    if (m) { var y = m[1], q = Number(m[2]); for (var i = 0; i < 3; i++) thangCanLay.push(y + '-' + ('0' + ((q - 1) * 3 + 1 + i)).slice(-2)); }
  } else return sach_({ ok:false, msg:'Chỉ hỗ trợ xem theo Tháng hoặc Quý.' });

  var dt = docDuLieuKPI_(canLuuTru_(thangCanLay));
  var congdoan = doc_('CongDoan'), cdMa = {};
  congdoan.forEach(function(c) { cdMa[c.MaCD] = c; });
  var dmHT = {};                                         // định mức đang dùng
  doc_('DinhMuc').forEach(function(x) { var v = soVN_(x.DinhMucGio); if (v > 0) dmHT[x.MaCD] = v; });

  // (người, ngày) -> giờ có mặt + sản lượng đạt từng công đoạn (+ giờ chuẩn theo định mức từng ngày, để so với KPI)
  var nd = {};
  dt.nhatky.forEach(function(r) {
    if (String(r.TrangThai).trim() !== 'Đã chốt') return;
    var ng = ngayVN_(r.Ngay);
    if (thangCanLay.indexOf(ng.slice(0, 7)) < 0) return;
    if (!(dmHT[r.MaCD] > 0)) return;                     // chưa có định mức -> bỏ (như KPI)
    var dat = Number(r.SoLuongLamRa) - (dt.idxLoi[r.MaNV + '|' + ng + '|' + r.MaCD] || 0);
    if (!(dat > 0)) return;
    var dk = dmNgay_(dt, r.MaCD, ng);
    var k = r.MaNV + '|' + ng;
    var o = nd[k] || (nd[k] = { nv: r.MaNV, ng: ng, dat: {}, gcKy: {} });
    o.dat[r.MaCD] = (o.dat[r.MaCD] || 0) + dat;
    if (dk > 0) o.gcKy[r.MaCD] = (o.gcKy[r.MaCD] || 0) + dat / dk;
  });
  var ngay = [];
  Object.keys(nd).forEach(function(k) {
    var o = nd[k], kh = dt.idxCC ? (dt.idxCC[k] || 'x') : 'x', gio = gioCoMat_(kh);
    if (gio > 0) { o.gio = gio; ngay.push(o); }
  });
  var theoCD = {};                                       // MaCD -> các (người, ngày) có làm công đoạn đó
  ngay.forEach(function(o) { Object.keys(o.dat).forEach(function(mc) { (theoCD[mc] = theoCD[mc] || []).push(o); }); });

  var trungVi = function(a) {
    if (!a.length) return 0;
    a = a.slice().sort(function(x, y) { return x - y; });
    var h = Math.floor(a.length / 2);
    return a.length % 2 ? a[h] : (a[h - 1] + a[h]) / 2;
  };
  // Hiệu suất trung vị của công đoạn mc khi định mức là N (giờ có mặt chia theo tỷ lệ giờ chuẩn trong ngày).
  // Chuẩn bị sẵn từng dòng (người, ngày) của công đoạn: khac = giờ chuẩn các công đoạn khác trong ngày (theo N lúc chuẩn bị),
  // để khi dò định mức của riêng mc chỉ tính lại phần của mc.
  var chuanBi = function(mc, N) {
    var nv = {}, dsNv = [], rows = theoCD[mc].map(function(o) {
      var khac = 0, c; for (c in o.dat) if (c !== mc) khac += o.dat[c] / N[c];
      if (!(o.nv in nv)) { nv[o.nv] = dsNv.length; dsNv.push(o.nv); }
      return { p: nv[o.nv], dat: o.dat[mc], gio: o.gio, khac: khac };
    });
    return { rows: rows, soNv: dsNv.length };
  };
  var tvTu = function(cb, Nmc) {
    var gc = new Array(cb.soNv), gi = new Array(cb.soNv), i;
    for (i = 0; i < cb.soNv; i++) { gc[i] = 0; gi[i] = 0; }
    for (i = 0; i < cb.rows.length; i++) {
      var r = cb.rows[i], g = r.dat / Nmc;
      gc[r.p] += g; gi[r.p] += r.gio * g / (g + r.khac);
    }
    var hs = []; for (i = 0; i < cb.soNv; i++) hs.push(gi[i] > 0 ? gc[i] / gi[i] * 100 : 0);
    return trungVi(hs);
  };
  var tvCD = function(mc, N) { return tvTu(chuanBi(mc, N), N[mc]); };
  var tvKy = function(mc) {                              // như KPI: định mức theo từng ngày
    var p = {};
    theoCD[mc].forEach(function(o) {
      var tong = 0, c; for (c in o.gcKy) tong += o.gcKy[c];
      if (!(tong > 0) || !o.gcKy[mc]) return;
      var x = p[o.nv] || (p[o.nv] = { gc: 0, gio: 0 });
      x.gc += o.gcKy[mc]; x.gio += o.gio * o.gcKy[mc] / tong;
    });
    return trungVi(Object.keys(p).map(function(k) { return p[k].gio > 0 ? p[k].gc / p[k].gio * 100 : 0; }));
  };
  var dsMC = Object.keys(theoCD);
  var N0 = {}; Object.keys(dmHT).forEach(function(k) { N0[k] = dmHT[k]; });
  var tv0 = {}; dsMC.forEach(function(mc) { tv0[mc] = tvCD(mc, N0); });

  // Giải cùng lúc: mỗi vòng, với từng công đoạn lệch mốc, tìm định mức (chia đôi trên thang log) để trung vị = 85,
  // giữ định mức các công đoạn khác như vòng trước. Lặp tới khi ổn định.
  // Giải cùng lúc cho MỌI công đoạn có dữ liệu (công đoạn đang sát mốc cũng bị kéo lệch khi công đoạn làm cùng ngày đổi)
  var canChinh = dsMC.filter(function(mc) { return tv0[mc] > 0; });
  var N = {}; Object.keys(N0).forEach(function(k) { N[k] = N0[k]; });
  var CHAN = 4;
  var giai = function(ds) {
    for (var vong = 0; vong < 60; vong++) {
      var doiNhat = 0;
      ds.forEach(function(mc) {
        var cu = N[mc], cb = chuanBi(mc, N);
        // CHỈ NÂNG, không hạ (chủ dự án): định mức chặt thường do người mới đang đào tạo -> giữ định mức đang dùng
        var lo = Math.log(Math.max(cu / 1.5, N0[mc])), hi = Math.log(Math.min(cu * 1.5, N0[mc] * CHAN));
        for (var it = 0; it < 30; it++) {
          var giua = (lo + hi) / 2;
          if (tvTu(cb, Math.exp(giua)) > DM_MOC) lo = giua; else hi = giua;   // định mức cao hơn -> hiệu suất thấp hơn
        }
        N[mc] = Math.sqrt(cu * Math.exp((lo + hi) / 2));
        doiNhat = Math.max(doiNhat, Math.abs(N[mc] / cu - 1));
      });
      if (doiNhat < 0.0005) break;
    }
  };
  // Công đoạn phải đổi tới mức chặn mà vẫn chưa về mốc: phần việc này chỉ chiếm ít giờ trong ngày của người làm,
  // hiệu suất do công đoạn chính cùng ngày quyết định -> không gợi ý; giữ nguyên định mức của nó rồi giải lại phần còn lại.
  var chamChan = function(mc) {
    var tl = N[mc] / N0[mc];
    return tl > CHAN * 0.9;     // phải đổi gần ×4 mới về mốc = công đoạn phụ, không đáng đổi
  };
  var phuThuoc = {};
  var tachPhuThuoc = function() {                        // giải; công đoạn chạm chặn -> phụ thuộc, giải lại phần còn lại
    for (var lan = 0; lan < 8; lan++) {
      giai(canChinh);
      var moi = canChinh.filter(chamChan);
      if (!moi.length) return;
      moi.forEach(function(mc) { phuThuoc[mc] = 1; N[mc] = N0[mc]; });   // giữ định mức đang dùng
      canChinh = canChinh.filter(function(mc) { return !phuThuoc[mc]; });
    }
  };
  tachPhuThuoc();
  // Thử lại từng công đoạn phụ thuộc khi các công đoạn khác đã ổn: về được mốc trong giới hạn thì nhận lại
  var nhanLai = 0;
  Object.keys(phuThuoc).forEach(function(mc) {
    giai([mc]);
    if (chamChan(mc) || Math.abs(tvCD(mc, N) - DM_MOC) > DM_SAT) N[mc] = N0[mc];
    else { delete phuThuoc[mc]; canChinh.push(mc); nhanLai++; }
  });
  if (nhanLai) tachPhuThuoc();                           // nhận lại thì giải chung lần nữa (công đoạn khác có thể bị kéo tới chặn)
  var NR = {}; Object.keys(N0).forEach(function(k) { NR[k] = N0[k]; });
  canChinh.forEach(function(mc) {                       // không cần nâng (giải ra = định mức đang dùng) thì giữ số cũ, khỏi làm tròn
    if (N[mc] > N0[mc] * 1.001) NR[mc] = Math.max(N0[mc], dmLamTron_(N[mc]));
  });
  // Chỉ gợi ý khi cần: nếu giữ định mức cũ (các công đoạn khác vẫn đổi) mà vẫn sát mốc thì thôi
  canChinh.forEach(function(mc) {
    if (NR[mc] === N0[mc]) return;
    var moi = NR[mc]; NR[mc] = N0[mc];
    if (Math.abs(tvCD(mc, NR) - DM_MOC) > DM_SAT) NR[mc] = moi;
  });
  var ketqua = dsMC.map(function(mc) {
    var nguoi = {}; theoCD[mc].forEach(function(o) { nguoi[o.nv] = 1; });
    var so = Object.keys(nguoi).length, tv = tv0[mc], nhan;
    if (tv > 110) nhan = 'do';
    else if (tv > 95) nhan = 'vang';
    else if (tv > DM_MOC + DM_SAT) nhan = 'nhe';
    else if (tv >= DM_MOC - DM_SAT) nhan = 'sat';
    else nhan = 'chat';
    var goiY = NR[mc] !== N0[mc] ? NR[mc] : 0;
    var c = cdMa[mc] || {};
    return {
      maCD: mc, tenCD: c.TenCD || mc, maXuong: c.MaXuong || '', dinhMuc: N0[mc], soCoData: so,
      trungVi: r2_(tv), trungViKy: r2_(tvKy(mc)), nhan: nhan, itNguoi: so < DM_IT_NGUOI,
      dmGoiY: goiY, chinh: goiY ? Math.round((goiY / N0[mc] - 1) * 100) : 0,
      trungViSau: r2_(tvCD(mc, NR)), phuThuoc: !!phuThuoc[mc]
    };
  });

  var thuTuXuong = {}; doc_('PhongBan').forEach(function(p, i) { thuTuXuong[p.MaXuong] = i; });
  var uu = { do: 0, vang: 1, chat: 2, nhe: 3, sat: 4 };
  ketqua.sort(function(a, b) {
    var xa = thuTuXuong[a.maXuong] == null ? 999 : thuTuXuong[a.maXuong], xb = thuTuXuong[b.maXuong] == null ? 999 : thuTuXuong[b.maXuong];
    if (xa !== xb) return xa - xb;
    if (uu[a.nhan] !== uu[b.nhan]) return uu[a.nhan] - uu[b.nhan];
    return Math.abs(b.trungVi - DM_MOC) - Math.abs(a.trungVi - DM_MOC);
  });
  if (me.vaiTro === 'TP') ketqua = ketqua.filter(function(k) { return k.maXuong === me.xuong; });
  return sach_({ ok:true, kieu:kieu, giaTri:giaTri, moc:DM_MOC, sat:DM_SAT, itNguoi:DM_IT_NGUOI, ds:ketqua, apTu: ngayApDM_(), daChot: (function() { try { return daChotChinhThuc_(kyVN_()); } catch (e) { return false; } })() });
}

/* CHẠY TAY 1 LẦN (21/10): đưa các lần đổi định mức trong tháng này về quy tắc mới – cả tháng tính theo định mức đang dùng.
   Cắt mọi đoạn LichSuDinhMuc trùng tháng này (kể cả tháng đã chốt – khi đó cần Chốt bù). Không đổi tháng trước. */
function AP_DINH_MUC_CA_THANG() {
  if (!noiBo_(arguments[0])) return chanWeb_('AP_DINH_MUC_CA_THANG');
  khoa_();
  var ky = kyVN_(), dau = ky + '-01';
  if (!ss_().getSheetByName(LSDM_SHEET)) { Logger.log('Chưa có sheet ' + LSDM_SHEET + ' – không có gì để đổi.'); return; }
  var ma = {};
  doc_(LSDM_SHEET).forEach(function(x) { if (ngayVN_(x.DenNgay) >= dau) ma[x.MaCD] = 1; });
  Object.keys(ma).forEach(function(mc) { catLichSuDM_(mc, dau); });
  xong_();
  Logger.log(nhacChotBuDM_('Đã áp định mức đang dùng cho cả tháng ' + ky + ': ' + Object.keys(ma).length + ' công đoạn. Mở lại Bảng KPI / Phân tích định mức để thấy số mới.'));
  return Object.keys(ma).length;
}
