/**
 * Kiểm thử bảo mật (rà soát 16/11/2026): bề mặt API mà trình duyệt gọi được, chặn hàm vận hành, tham số URL, ghi Sheet an toàn.
 * Apps Script cho trình duyệt gọi MỌI hàm cấp cao không có "_" cuối tên → danh sách dưới đây là toàn bộ hàm được phép công khai.
 * Thêm hàm công khai mới: phải thêm vào đúng nhóm ở đây (và hàm đó phải tự kiểm token/quyền nếu trả dữ liệu riêng tư/trả phí).
 * Chạy: node tests/bao-mat.js
 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const D = path.join(__dirname, '..');
const { ctx } = require(path.join(D, 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; console.log('✗', msg); } }

// 1. Bề mặt API
const GIAO_DIEN = ('bangGiaCongKhai dangKy dangKyBanTin dangKyVanNgay dangNhap dangXuat datLaiMatKhau doGioSinh doiLich doiMatKhau donLichSu dsGieoQue ' +
  'dungLuotGiaDinh getDoanNghiemChung getLichSu ghiDoiChieu giaDinhDs giaDinhLuu giaDinhQuanHe giaDinhVanNam gieoQue huyVanNgay kiemTraDon lapCapDoi ' +
  'lapLaSo layAnhHolo muaPhan nhapMaQua phiTinhLuan phien qtDatVaiTro qtDieuChinhXu qtDsMaQua qtHuyDon qtKiemTraPayos qtLuuBangGia qtLuuCauHinh ' +
  'qtTaoMaQua qtTongQuan qtXacNhanDon qtXoaMaQua taoDonNap taoTaiKhoan thamKhaoThanSat thamKhaoTuVi tienIch tinhDiemNghiemChung tuViChuSoHuu viCuaToi ' +
  'xoaLichSu xoaTaiKhoan dsBanTin dsTaiKhoan dsVanNgay').split(' ');
const KHUNG = ['doGet', 'include', 'includeTuyChon'];
// Tiện ích lịch/can chi thuần tính toán – không chứa nội dung trả phí
const TIEN_ICH = ('canChiIndex canChiText findSolarTermJD getLeapMonthOfYear getTietKhiName jdFromDate jdToDate jdToLocalDateTime lunarToSolar mod10 mod12 ' +
  'napAm quanHeHanh solarToLunar sunLongitudeDeg thapThan truongSinhBazi layTuHoa').split(' ');
// Hàm vận hành: chỉ chạy theo lịch thật hoặc từ trình soạn thảo (chiChayNoiBo_)
const VAN_HANH = ['guiBanTinThang', 'guiBaoCaoNgay', 'guiVanNgay', 'ttQuetDonTuDong', 'tatVanNgay', 'tatBaoCaoNgay', 'caiDatBanTin', 'caiDatBaoCaoNgay',
  'caiDatVanNgay', 'capQuyenThanhToan', 'thuZaloVanNgay', 'kiemTraCaiDat', 'showNghiemChungUI'];
const congKhai = {};
fs.readdirSync(D).filter(f => f.endsWith('.gs')).forEach(f => {
  const s = fs.readFileSync(path.join(D, f), 'utf8');
  for (const m of s.matchAll(/^function\s+([A-Za-z0-9]+)\s*\(([^)]*)\)\s*\{\n?([^\n]*)/gm)) congKhai[m[1]] = { f, dong1: m[3] };
});
const choPhep = new Set([].concat(GIAO_DIEN, KHUNG, TIEN_ICH, VAN_HANH));
Object.keys(congKhai).forEach(n => {
  if (/^test/.test(n)) { kt(/chiChayNoiBo_\(/.test(congKhai[n].dong1), 'hàm thử ' + n + ' (' + congKhai[n].f + ') phải chặn bằng chiChayNoiBo_'); return; }
  kt(choPhep.has(n), 'hàm công khai chưa được duyệt: ' + n + ' (' + congKhai[n].f + ') – thêm "_" cuối tên hoặc thêm vào danh sách trong tests/bao-mat.js');
});
VAN_HANH.forEach(n => kt(congKhai[n] && /chiChayNoiBo_\(/.test(congKhai[n].dong1), n + ' chặn bằng chiChayNoiBo_ ở dòng đầu'));
// Hàm tính bài luận (trả phí) không còn công khai
['luanChiTiet', 'duDoanCuocDoi', 'tongHopLuan', 'phoiNgauLuan', 'ketHopLuan', 'nghiemChungLap', 'tuviTrinhTu', 'tuviLapLaSo', 'batTuLap', 'batTuChiTiet',
  'chiemTinhLap', 'chiemTinhLuan', 'hdLap', 'hdLuan', 'haLacLap', 'haLacLuan', 'thanSoHocLap', 'thanSoHocLuan', 'astToanBo'].forEach(n => {
  kt(!congKhai[n] && typeof ctx[n + '_'] === 'function', n + ' đã thành hàm riêng ' + n + '_');
});

// 2. Chặn hàm vận hành
ctx.__nguoiChay = '';                                         // trình duyệt / người lạ: không có tài khoản Google đang chạy
VAN_HANH.concat(['testFacts']).forEach(n => {
  if (typeof ctx[n] !== 'function') return;                   // kiemTraCaiDat nằm trong Code.gs (giả lập không nạp) – đã kiểm tĩnh ở trên
  let loi = ''; try { ctx[n](); } catch (e) { loi = e.message; }
  kt(/chỉ chạy theo lịch/.test(loi), n + ': người lạ gọi bị chặn');
  loi = ''; try { ctx[n]({ triggerUid: 'doan-bua-123' }); } catch (e) { loi = e.message; }
  kt(/chỉ chạy theo lịch/.test(loi), n + ': mã lịch giả bị chặn');
});
const cu = ctx.ScriptApp.getProjectTriggers;
ctx.ScriptApp.getProjectTriggers = () => [{ getUniqueId: () => '777', getHandlerFunction: () => 'guiVanNgay' }];
kt(ctx.laLichThat_({ triggerUid: '777' }) === true && ctx.laLichThat_({ triggerUid: '778' }) === false, 'chỉ nhận đúng mã lịch có thật của dự án');
ctx.ScriptApp.getProjectTriggers = cu;
ctx.__nguoiChay = 'khac@vidu.vn';
kt(!ctx.laChuTrinhSoan_(), 'người dùng Google khác không phải chủ dự án');
ctx.__nguoiChay = null;
kt(ctx.laChuTrinhSoan_(), 'chủ dự án chạy trong trình soạn thảo được phép');

// 3. Tham số URL chèn vào <script>
const code = fs.readFileSync(path.join(D, 'Code.gs'), 'utf8');
const a = code.indexOf('function thamSoAnToan_'), b = code.indexOf('\n}\n', a) + 3;
vm.runInContext(code.slice(a, b), ctx);
const js = ctx.thamSoAnToan_({ ref: '</script><script>alert(1)</script>', name: 'An', 'x"><img': '1', day: '15' });
kt(!/[<>]/.test(js) && !/<\/script/i.test(js), 'không còn ký tự < > trong JSON chèn vào trang');
const o = JSON.parse(js);
kt(o.ref === '</script><script>alert(1)</script>' && o.name === 'An' && o.day === '15' && !('x"><img' in o), 'giá trị vẫn đọc lại đúng, khóa lạ bị bỏ');
kt(JSON.parse(ctx.thamSoAnToan_({ ref: 'a'.repeat(500) })).ref.length === 200, 'giá trị bị cắt ≤ 200 ký tự');

// 4. Ghi Sheet an toàn
[['0912345678', "'0912345678"], ['1.5', "'1.5"], ['12/10', "'12/10"], ['=IMPORTDATA("x")', "'=IMPORTDATA(\"x\")"], ['+84912', "'+84912"],
  ['-abc', "'-abc"], ['@a', "'@a"], ['TRUE', "'TRUE"], ['khachmoi', 'khachmoi'], ['Nguyễn Văn An', 'Nguyễn Văn An'], ['an.123', 'an.123'], [42, 42]]
  .forEach(([v, k]) => kt(ctx.shO_(v) === k, 'shO_(' + v + ') → ' + k + ' (được ' + ctx.shO_(v) + ')'));

console.log('Bảo mật: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
