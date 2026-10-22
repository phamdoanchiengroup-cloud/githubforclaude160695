/* =====================================================================
   PHÂN TÍCH ĐỊNH MỨC (tests/dinh-muc/)
   - 21/10: đánh giá ĐỊNH MỨC ĐANG DÙNG trên mọi ngày của kỳ; giải cùng lúc mọi công đoạn (người làm nhiều công đoạn
     trong ngày chia giờ theo tỷ lệ giờ chuẩn, nên định mức các công đoạn ảnh hưởng lẫn nhau); chỉ NÂNG, không hạ.
   - 22/10 (chủ dự án duyệt theo tư vấn chuyên gia vận hành): mốc = NGƯỜI KHÁ (phân vị 75%) đạt 90%, gộp 3 tháng gần
     nhất, bỏ người ĐỘT BIẾN (> 1,5 × người khá của công đoạn) và người MỚI (tài khoản tạo hoặc vào làm trong 2 tháng).
     Không phân công đoạn chính/phụ, công đoạn 2–3 người vẫn gợi ý (ghi "ít người").
   - Đổi định mức (mọi đường) áp cho cả tháng đang làm (ngayApDM_).
   ===================================================================== */
var DM_MOC = 90;          // hiệu suất người khá mong muốn
var DM_PV = 0.75;         // người khá = phân vị 75% (top 25%)
var DM_SAT = 3;           // lệch ≤ 3 điểm coi là đã sát mốc, không gợi ý
var DM_IT_NGUOI = 3;      // dưới 3 người có dữ liệu: gợi ý kém tin (vẫn gợi ý)
var DM_DOT_BIEN = 1.5;    // hiệu suất > 1,5 × người khá của những người còn lại = đột biến, không tính (công đoạn ≥ 4 người)
var DM_MOI_THANG = 2;     // tài khoản / ngày vào làm trong 2 tháng gần đây = người mới, không tính
var DM_SO_THANG = 3;      // xem theo tháng: gộp 3 tháng gần nhất (tới tháng đang chọn)
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
  if (kieu === 'thang') {
    if (!/^\d{4}-\d{2}$/.test(String(giaTri))) return sach_({ ok:false, msg:'Tháng không hợp lệ.' });
    for (var t = giaTri, i0 = 0; i0 < DM_SO_THANG; i0++, t = kyTruoc_(t)) thangCanLay.unshift(t);   // 3 tháng gần nhất
  } else if (kieu === 'quy') {
    var m = String(giaTri).match(/^(\d{4})-Q([1-4])$/);
    if (m) { var y = m[1], q = Number(m[2]); for (var i = 0; i < 3; i++) thangCanLay.push(y + '-' + ('0' + ((q - 1) * 3 + 1 + i)).slice(-2)); }
  } else return sach_({ ok:false, msg:'Chỉ hỗ trợ xem theo Tháng hoặc Quý.' });
  if (!thangCanLay.length) return sach_({ ok:false, msg:'Kỳ không hợp lệ.' });

  var dt = docDuLieuKPI_(canLuuTru_(thangCanLay));
  var congdoan = doc_('CongDoan'), cdMa = {};
  congdoan.forEach(function(c) { cdMa[c.MaCD] = c; });
  var dmHT = {};                                         // định mức đang dùng
  doc_('DinhMuc').forEach(function(x) { var v = soVN_(x.DinhMucGio); if (v > 0) dmHT[x.MaCD] = v; });
  var tenNV = {}; dt.nhansu.forEach(function(x) { tenNV[x.MaNV] = x.HoTen; });

  // Người MỚI: tài khoản tạo hoặc ngày vào làm trong DM_MOI_THANG tháng tính tới cuối kỳ (hoặc hôm nay nếu kỳ chưa hết)
  var cuoiKy = thangCanLay[thangCanLay.length - 1] + '-31', homNay = homNayVN_();
  if (cuoiKy > homNay) cuoiKy = homNay;
  var mocMoi = cuoiKy.slice(0, 7); for (var k0 = 0; k0 < DM_MOI_THANG; k0++) mocMoi = kyTruoc_(mocMoi);
  mocMoi = mocMoi + cuoiKy.slice(7);                     // cùng ngày, lùi 2 tháng
  var batDau = {};
  dt.nhansu.forEach(function(x) { var v = x.NgayVaoLam ? ngayVN_(x.NgayVaoLam) : ''; if (v) batDau[x.MaNV] = v; });
  doc_('TaiKhoan').forEach(function(x) {
    var v = x.NgayTao ? ngayVN_(x.NgayTao) : '', nv = String(x.MaNV || '').trim();
    if (v && nv && (!batDau[nv] || v > batDau[nv])) batDau[nv] = v;   // lấy ngày muộn hơn giữa vào làm và tạo tài khoản
  });
  var laMoi = function(nv) { return !!batDau[nv] && batDau[nv] > mocMoi; };

  // (người, ngày) -> giờ có mặt + sản lượng đạt từng công đoạn
  var nd = {}, boMoi = {}, boHV = {};
  dt.nhatky.forEach(function(r) {
    if (String(r.TrangThai).trim() !== 'Đã chốt') return;
    var ng = ngayVN_(r.Ngay);
    if (thangCanLay.indexOf(ng.slice(0, 7)) < 0) return;
    if (!(dmHT[r.MaCD] > 0)) return;                     // chưa có định mức -> bỏ (như KPI)
    var dat = Number(r.SoLuongLamRa) - (dt.idxLoi[r.MaNV + '|' + ng + '|' + r.MaCD] || 0);
    if (!(dat > 0)) return;
    if (laMoi(r.MaNV)) { boMoi[r.MaNV] = 1; return; }                        // người mới (2 tháng): không tính
    if (dangHocViec_(r.MaNV, ng)) { boHV[r.MaNV] = 1; return; }             // ngày còn học việc của người cũ: không tính
    var k = r.MaNV + '|' + ng;
    var o = nd[k] || (nd[k] = { nv: r.MaNV, ng: ng, dat: {} });
    o.dat[r.MaCD] = (o.dat[r.MaCD] || 0) + dat;
  });
  var ngay = [];
  Object.keys(nd).forEach(function(k) {
    var o = nd[k], kh = dt.idxCC ? (dt.idxCC[k] || 'x') : 'x', gio = gioCoMat_(kh);
    if (gio > 0) { o.gio = gio; ngay.push(o); }
  });
  var theoCD = {};                                       // MaCD -> các (người, ngày) có làm công đoạn đó
  ngay.forEach(function(o) { Object.keys(o.dat).forEach(function(mc) { (theoCD[mc] = theoCD[mc] || []).push(o); }); });

  var pv = function(a, p) {                              // phân vị p (nội suy tuyến tính)
    if (!a.length) return 0;
    a = a.slice().sort(function(x, y) { return x - y; });
    var vt = (a.length - 1) * p, d = Math.floor(vt), t2 = Math.min(d + 1, a.length - 1);
    return a[d] + (a[t2] - a[d]) * (vt - d);
  };
  // Chuẩn bị từng dòng (người, ngày) của công đoạn: khac = giờ chuẩn các công đoạn khác trong ngày (theo N lúc chuẩn bị),
  // để khi dò định mức của riêng mc chỉ tính lại phần của mc. bo = người đột biến của công đoạn (không đưa vào thống kê).
  var dotBien = {};                                      // MaCD -> {MaNV: hiệu suất}
  var chuanBi = function(mc, N) {
    var nv = {}, dsNv = [], bo = dotBien[mc] || {}, rows = [];
    theoCD[mc].forEach(function(o) {
      if (o.nv in bo) return;
      var khac = 0, c; for (c in o.dat) if (c !== mc) khac += o.dat[c] / N[c];
      if (!(o.nv in nv)) { nv[o.nv] = dsNv.length; dsNv.push(o.nv); }
      rows.push({ p: nv[o.nv], dat: o.dat[mc], gio: o.gio, khac: khac });
    });
    return { rows: rows, soNv: dsNv.length, dsNv: dsNv };
  };
  var hsTu = function(cb, Nmc) {                         // hiệu suất từng người ở công đoạn khi định mức là Nmc
    var gc = [], gi = [], i;
    for (i = 0; i < cb.soNv; i++) { gc.push(0); gi.push(0); }
    for (i = 0; i < cb.rows.length; i++) {
      var r = cb.rows[i], g = r.dat / Nmc;
      gc[r.p] += g; gi[r.p] += r.gio * g / (g + r.khac);
    }
    var hs = []; for (i = 0; i < cb.soNv; i++) hs.push(gi[i] > 0 ? gc[i] / gi[i] * 100 : 0);
    return hs;
  };
  var mocTu = function(cb, Nmc) { return pv(hsTu(cb, Nmc), DM_PV); };
  var tk4 = function(mc, N) {                            // [thấp P25, giữa, khá P75, cao nhất]
    var hs = hsTu(chuanBi(mc, N), N[mc]);
    return [pv(hs, 0.25), pv(hs, 0.5), pv(hs, DM_PV), hs.length ? Math.max.apply(null, hs) : 0];
  };
  var dsMC = Object.keys(theoCD);
  var N0 = {}; Object.keys(dmHT).forEach(function(k) { N0[k] = dmHT[k]; });

  // Người ĐỘT BIẾN: hiệu suất > 1,5 × người khá của NHỮNG NGƯỜI CÒN LẠI (không tính chính họ – nếu tính thì người cao nhất
  // kéo mốc lên và lúc bị coi lúc không, số liệu nhảy) -> bỏ khỏi thống kê công đoạn đó. Chỉ xét khi công đoạn có ≥ 4 người.
  dsMC.forEach(function(mc) {
    var cb = chuanBi(mc, N0), hs = hsTu(cb, N0[mc]);
    if (hs.length < 4) return;
    hs.forEach(function(h, i) {
      var khac = hs.slice(0, i).concat(hs.slice(i + 1)), kha = pv(khac, DM_PV);
      if (kha > 0 && h > DM_DOT_BIEN * kha) (dotBien[mc] = dotBien[mc] || {})[cb.dsNv[i]] = h;
    });
  });
  var tk0 = {}; dsMC.forEach(function(mc) { tk0[mc] = tk4(mc, N0); });

  // Giải cùng lúc mọi công đoạn: mỗi vòng, với từng công đoạn, dò định mức (chia đôi trên thang log) để người khá = 90%,
  // giữ định mức các công đoạn khác như vòng trước. Lặp tới khi ổn định. CHỈ NÂNG, không hạ (định mức chặt thường do người mới).
  var canChinh = dsMC.filter(function(mc) { return tk0[mc][2] > 0; });
  var N = {}; Object.keys(N0).forEach(function(k) { N[k] = N0[k]; });
  var CHAN = 4;                                          // chặn an toàn: không gợi ý quá ×4 định mức đang dùng
  var giai = function(ds) {
    for (var vong = 0; vong < 60; vong++) {
      var doiNhat = 0;
      ds.forEach(function(mc) {
        var cu = N[mc], cb = chuanBi(mc, N);
        var lo = Math.log(Math.max(cu / 1.5, N0[mc])), hi = Math.log(Math.min(cu * 1.5, N0[mc] * CHAN));
        for (var it = 0; it < 30; it++) {
          var giua = (lo + hi) / 2;
          if (mocTu(cb, Math.exp(giua)) > DM_MOC) lo = giua; else hi = giua;   // định mức cao hơn -> hiệu suất thấp hơn
        }
        N[mc] = Math.sqrt(cu * Math.exp((lo + hi) / 2));
        doiNhat = Math.max(doiNhat, Math.abs(N[mc] / cu - 1));
      });
      if (doiNhat < 0.0005) break;
    }
  };
  giai(canChinh);
  var NR = {}; Object.keys(N0).forEach(function(k) { NR[k] = N0[k]; });
  canChinh.forEach(function(mc) {                       // không cần nâng (giải ra = định mức đang dùng) thì giữ số cũ, khỏi làm tròn
    if (N[mc] > N0[mc] * 1.001) NR[mc] = Math.max(N0[mc], dmLamTron_(N[mc]));
  });
  // Chỉ gợi ý khi cần: nếu giữ định mức cũ (các công đoạn khác vẫn đổi) mà người khá vẫn sát mốc thì thôi
  canChinh.forEach(function(mc) {
    if (NR[mc] === N0[mc]) return;
    var moi = NR[mc]; NR[mc] = N0[mc];
    if (Math.abs(mocTu(chuanBi(mc, NR), NR[mc]) - DM_MOC) > DM_SAT) NR[mc] = moi;
  });

  var ketqua = dsMC.map(function(mc) {
    var nguoi = {}; theoCD[mc].forEach(function(o) { if (!(dotBien[mc] && o.nv in dotBien[mc])) nguoi[o.nv] = 1; });
    var so = Object.keys(nguoi).length, a = tk0[mc], kha = a[2], nhan;
    if (kha > 110) nhan = 'do';
    else if (kha > 95) nhan = 'vang';
    else if (kha > DM_MOC + DM_SAT) nhan = 'nhe';
    else if (kha >= DM_MOC - DM_SAT) nhan = 'sat';
    else nhan = 'chat';
    var goiY = NR[mc] !== N0[mc] ? NR[mc] : 0, b = tk4(mc, NR);   // "sau" = khi áp TẤT CẢ gợi ý
    var c = cdMa[mc] || {};
    return {
      maCD: mc, tenCD: c.TenCD || mc, maXuong: c.MaXuong || '', dinhMuc: N0[mc], soCoData: so,
      thap: r2_(a[0]), trungVi: r2_(a[1]), kha: r2_(kha), caoNhat: r2_(a[3]), nhan: nhan, itNguoi: so < DM_IT_NGUOI,
      dotBien: Object.keys(dotBien[mc] || {}).map(function(nv) { return { ten: tenNV[nv] || nv, hs: r2_(dotBien[mc][nv]) }; }),
      dmGoiY: goiY, chinh: goiY ? Math.round((goiY / N0[mc] - 1) * 100) : 0,
      khaSau: r2_(b[2]), trungViSau: r2_(b[1]), caoNhatSau: r2_(b[3]),
      chamTran: !!goiY && N[mc] >= N0[mc] * CHAN * 0.999
    };
  });

  // Áp hết gợi ý thì bao nhiêu người đổi hạng (tháng đang làm, theo Bảng KPI)
  var doiHang = null, kyHT = kyVN_();
  if (thangCanLay.indexOf(kyHT) >= 0 && ketqua.some(function(x) { return x.dmGoiY; })) {
    var maQL = mapQuanLy_(), dsNV = dt.nhansu.filter(function(x) {
      return !maQL[String(x.MaNV).trim()] && (me.vaiTro !== 'TP' || x.MaXuong === me.xuong);
    });
    var hang = function() {
      var o = {}; dsNV.forEach(function(x) { var k = kpiThang_(x.MaNV, kyHT, dt); if (k) o[x.MaNV] = loaiCo_(x.MaNV, kyHT, k.tong); }); return o;
    };
    var truoc = hang(), luu = {};
    ketqua.forEach(function(x) { if (x.dmGoiY) { luu[x.maCD] = dt.idxDM[x.maCD]; dt.idxDM[x.maCD] = x.dmGoiY; } });
    var sau = hang();
    Object.keys(luu).forEach(function(mc) { dt.idxDM[mc] = luu[mc]; });
    var chuyen = {}, so2 = 0;
    Object.keys(truoc).forEach(function(nv) {
      if (sau[nv] && sau[nv] !== truoc[nv]) { so2++; var kk = truoc[nv] + ' → ' + sau[nv]; chuyen[kk] = (chuyen[kk] || 0) + 1; }
    });
    doiHang = { soNguoi: Object.keys(truoc).length, soDoi: so2, chuyen: chuyen };
  }

  var thuTuXuong = {}; doc_('PhongBan').forEach(function(p, i) { thuTuXuong[p.MaXuong] = i; });
  var uu = { do: 0, vang: 1, nhe: 2, chat: 3, sat: 4 };
  ketqua.sort(function(a, b) {
    var xa = thuTuXuong[a.maXuong] == null ? 999 : thuTuXuong[a.maXuong], xb = thuTuXuong[b.maXuong] == null ? 999 : thuTuXuong[b.maXuong];
    if (xa !== xb) return xa - xb;
    if (uu[a.nhan] !== uu[b.nhan]) return uu[a.nhan] - uu[b.nhan];
    return Math.abs(b.kha - DM_MOC) - Math.abs(a.kha - DM_MOC);
  });
  if (me.vaiTro === 'TP') ketqua = ketqua.filter(function(k) { return k.maXuong === me.xuong; });
  var dsMoi = Object.keys(boMoi).map(function(nv) { return { ten: tenNV[nv] || nv, tu: batDau[nv] || '' }; })
    .sort(function(a, b) { return a.ten < b.ten ? -1 : 1; });
  return sach_({ ok:true, kieu:kieu, giaTri:giaTri, thang: thangCanLay, moc:DM_MOC, pv:DM_PV, sat:DM_SAT, itNguoi:DM_IT_NGUOI,
    dotBienHeSo: DM_DOT_BIEN, moiThang: DM_MOI_THANG, ds:ketqua, nguoiMoi: dsMoi, soHocViecBo: Object.keys(boHV).length,
    doiHang: doiHang, apTu: ngayApDM_() });
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
