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
  'xoaLichSu xoaTaiKhoan dsBanTin dsTaiKhoan dsVanNgay guiMaEmail xacThucEmail kyMonHoi qtPheu thaiAtHoi thaiAtMenh thaiAtThoiCuoc').split(' ');
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
  for (const m of s.matchAll(/^function\s+([\w$]*[A-Za-z0-9$])\s*\(([^)]*)\)\s*\{\n?([^\n]*)/gm)) congKhai[m[1]] = { f, dong1: m[3] };   // mọi tên KHÔNG kết thúc bằng _
});
const choPhep = new Set([].concat(GIAO_DIEN, KHUNG, TIEN_ICH, VAN_HANH));
Object.keys(congKhai).forEach(n => {
  if (/^test/.test(n)) { kt(/chiChayNoiBo_\(/.test(congKhai[n].dong1), 'hàm thử ' + n + ' (' + congKhai[n].f + ') phải chặn bằng chiChayNoiBo_'); return; }
  kt(choPhep.has(n), 'hàm công khai chưa được duyệt: ' + n + ' (' + congKhai[n].f + ') – thêm "_" cuối tên hoặc thêm vào danh sách trong tests/bao-mat.js');
});
VAN_HANH.forEach(n => kt(congKhai[n] && /chiChayNoiBo_\(/.test(congKhai[n].dong1), n + ' chặn bằng chiChayNoiBo_ ở dòng đầu'));
// 16/11: hàm xác thực email (quà 39 xu) phải tự kiểm phiên ở dòng đầu; người lạ gọi bị chặn
['guiMaEmail', 'xacThucEmail'].forEach(n => {
  kt(congKhai[n] && /tkCan_\(token\)/.test(congKhai[n].dong1), n + ' kiểm phiên (tkCan_) ở dòng đầu');
  let loi = ''; try { ctx[n]('token-gia-mao-khong-hop-le-123', n === 'guiMaEmail' ? 'a@b.vn' : '123456'); } catch (e) { loi = e.message; }
  kt(/đăng nhập/.test(loi), n + ': chưa đăng nhập bị chặn');
});
// 21/11: Kỳ Môn hỏi việc cần đăng nhập; phễu bán hàng chỉ chủ sở hữu – cả hai kiểm phiên ở dòng đầu
kt(congKhai.kyMonHoi && /tkCan_\(token\)/.test(congKhai.kyMonHoi.dong1), 'kyMonHoi kiểm phiên (tkCan_) ở dòng đầu');
kt(congKhai.qtPheu && /tkCan_\(token, true\)/.test(congKhai.qtPheu.dong1), 'qtPheu chỉ chủ sở hữu (tkCan_(token, true)) ở dòng đầu');
['kyMonHoi', 'qtPheu'].forEach(n => { let loi = ''; try { ctx[n]('token-gia-mao-khong-hop-le-123', n === 'kyMonHoi' ? 'cong_viec' : 7); } catch (e) { loi = e.message; } kt(/đăng nhập/.test(loi), n + ': chưa đăng nhập bị chặn'); });
// 21/11: Thái Ất – hỏi việc và mệnh pháp cần đăng nhập (tkCan_ dòng đầu); thời cuộc chung MIỄN PHÍ, không cần đăng nhập
// (chủ dự án chốt: bàn chung cho mọi người, không nhận dữ liệu cá nhân, không có phần trả phí) – kiểm: không tham số, không đọc phiên/ví, không lộ trường riêng
['thaiAtHoi'].forEach(n => {
  kt(congKhai[n] && /tkCan_\(token\)/.test(congKhai[n].dong1), n + ' kiểm phiên (tkCan_) ở dòng đầu');
  let loi = ''; try { ctx[n]('token-gia-mao-khong-hop-le-123', 'cong_viec'); } catch (e) { loi = e.message; }
  kt(/đăng nhập/.test(loi), n + ': chưa đăng nhập bị chặn');
});
// thaiAtMenh: khách xem được tóm tắt (chủ dự án 21/11) – dòng đầu đọc phiên bằng tkPhien_, token giả không mở phần trả phí
{ kt(congKhai.thaiAtMenh && /tkPhien_\(token\)/.test(congKhai.thaiAtMenh.dong1), 'thaiAtMenh đọc phiên (tkPhien_) ở dòng đầu');
  const g = ctx.thaiAtMenh('token-gia-mao-khong-hop-le-123', { day: 1, month: 1, year: 1990, hour: 8, gender: 'nam' });
  kt(g.ok && !g.cung12 && !g.luan.chiTiet && g.soDu === null && g.canDangNhap === true, 'thaiAtMenh: khách chỉ thấy tóm tắt, không lộ phần trả phí'); }
{
  const src = fs.readFileSync(path.join(D, congKhai.thaiAtThoiCuoc.f), 'utf8'), than = src.slice(src.indexOf('function thaiAtThoiCuoc('), src.indexOf('/* ---------- (1) Mệnh pháp'));
  kt(/^function thaiAtThoiCuoc\(\)/m.test(src) && !/tkPhien_|tkCan_|ttSoDu_|ttQuyen_|MoKhoa|token/.test(than), 'thaiAtThoiCuoc: không tham số, không đọc phiên/ví/quyền');
  const tc = JSON.stringify(ctx.thaiAtThoiCuoc());
  kt(!/"(soDu|nguoiDung|ten|email|token|danhGia|luan|daMua)"\s*:/.test(tc.replace(/"ten":"[^"]*"/g, '')) && !/"(soDu|email|token|daMua|nguoiDung)"/.test(tc), 'thaiAtThoiCuoc: không lộ trường riêng tư / trả phí');
}
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
ctx.ScriptApp.getProjectTriggers = () => [{ getUniqueId: () => '7770001', getHandlerFunction: () => 'guiVanNgay' }];
kt(ctx.laLichThat_({ triggerUid: '7770001' }) === true && ctx.laLichThat_({ triggerUid: '7770002' }) === false, 'chỉ nhận đúng mã lịch có thật của dự án');
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
[['0912345678', "'0912345678"], ['1.5', "'1.5"], ['5-mar', "'5-mar"], ['=IMPORTDATA("x")', "'=IMPORTDATA(\"x\")"], ['+84912', "'+84912"],
  ['TRUE', "'TRUE"], ['khachmoi', "'khachmoi"], ['Nguyễn Văn An', "'Nguyễn Văn An"], ['', ''], [42, 42]]
  .forEach(([v, k]) => kt(ctx.shO_(v) === k, 'shO_(' + v + ') → ' + k + ' (được ' + ctx.shO_(v) + ')'));

// 5. Web phải chạy dưới quyền chủ dự án – nếu đổi sang USER_ACCESSING thì getActiveUser == getEffectiveUser với mọi người, lớp chặn mất tác dụng
const cfg = JSON.parse(fs.readFileSync(path.join(D, 'appsscript.json'), 'utf8'));
kt(cfg.webapp && cfg.webapp.executeAs === 'USER_DEPLOYING', 'appsscript.json: webapp.executeAs phải là USER_DEPLOYING');
// 6. Ghi Sheet thật: dấu ' bị Sheet bỏ, tìm lại dòng theo tên toàn số vẫn thấy
{ const sh = ctx.ttSheet_('Vi'); sh.appendRow([ctx.shO_('0912000111'), 5, new Date()]);
  kt(ctx.ttTim_(sh, 1, '0912000111').length === 1 && ctx.ttSoDu_('0912000111') === 5, 'tên đăng nhập toàn số: tìm lại đúng dòng ví, không mất số 0 đầu'); }
// 7. Nghiệm chứng (rà soát V1): khách lạ không lấy được kết luận Tổng hợp 6 hệ; tài khoản được, có giới hạn số lần
{ ctx.__nguoiChay = '';
  const inp = { name: 'An', gender: 'nam', calendar: 'duong', day: 5, month: 6, year: 1990, hour: 8, minute: 0, place: '21.03|105.85|Hà Nội', tz: '7' };
  let loi = ''; try { ctx.getDoanNghiemChung(inp, ''); } catch (e) { loi = e.message; }
  kt(/tài khoản|đăng nhập/.test(loi), 'nghiệm chứng: khách chưa đăng nhập bị chặn');
  const t = ctx.dangKy('kiemnc', 'matkhau123', 'NC', 'kiemnc@vidu.vn', '').token;
  const d = ctx.getDoanNghiemChung(inp, t); kt(Array.isArray(d) && d.length >= 6, 'nghiệm chứng: tài khoản nhận đủ các nhóm (' + d.length + ')');
  ctx.CacheService.getScriptCache().put('NCG_kiemnc', '20', 600);
  loi = ''; try { ctx.getDoanNghiemChung(inp, t); } catch (e) { loi = e.message; }
  kt(/đợi khoảng 10 phút/.test(loi), 'nghiệm chứng: quá 20 lần / 10 phút bị chặn');
  ctx.__nguoiChay = null; }
console.log('Bảo mật: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
