/**
 * Kiểm thử Trợ lý KPI: giả lập Google Sheet "CSDL KPI" + Zalo Bot API trong Node.
 * Chạy: node tests/tro-ly.js
 */
const fs = require('fs'), vm = require('vm'), path = require('path'), assert = require('assert');

function taoCtx(homNay) {
  const store = {}, cache = {}, gui = [], goi = [], triggers = [];
  const sheets = {};
  const them = (ten, rows) => { sheets[ten] = rows; };
  const ss = {
    getSheetByName: n => sheets[n] ? {
      getLastRow: () => sheets[n].length,
      getDataRange: () => ({ getValues: () => sheets[n].map(r => r.slice()) })
    } : null
  };
  const NOW = new Date(homNay + 'T07:00:00+07:00');
  class FakeDate extends Date { constructor(...a) { super(...(a.length ? a : [NOW.getTime()])); } static now() { return NOW.getTime(); } }
  const ctx = {
    console, Math, JSON, Date: FakeDate,
    Utilities: {
      getUuid: () => 'aaaa-bbbb-cccc-dddd',
      formatDate: (d, tz, f) => {
        const x = new Date(new Date(d).getTime() + 7 * 3600e3), p = n => String(n).padStart(2, '0');
        return f.replace('yyyy', x.getUTCFullYear()).replace('MM', p(x.getUTCMonth() + 1)).replace('dd', p(x.getUTCDate()))
          .replace('HH', p(x.getUTCHours())).replace('mm', p(x.getUTCMinutes()));
      }
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k in store ? store[k] : null), setProperty: (k, v) => { store[k] = String(v); }, deleteProperty: k => { delete store[k]; } }) },
    CacheService: { getScriptCache: () => ({ get: k => cache[k] || null, put: (k, v) => { cache[k] = v; } }) },
    SpreadsheetApp: { openById: id => { assert.strictEqual(id, '1znHlbc3ulMRQILePmLZbwNQx-mMXFxd9sm0PBG9lrF8'); return ss; } },
    ContentService: { createTextOutput: s => ({ s }) },
    ScriptApp: {
      getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/ABC/exec' }),
      getProjectTriggers: () => triggers, deleteTrigger: t => triggers.splice(triggers.indexOf(t), 1),
      newTrigger: h => ({ timeBased: () => ({ everyDays: () => ({ atHour: g => ({ inTimezone: tz => ({ create: () => triggers.push({ h, g, tz, getHandlerFunction: () => h }) }) }) }) }) })
    },
    Logger: { log: () => {} },
    UrlFetchApp: {
      fetch(url, o) {
        const ham = url.split('/').pop(), body = JSON.parse(o.payload);
        assert.ok(url.startsWith('https://bot-api.zaloplatforms.com/botTOK/'), url);
        goi.push({ ham, body });
        if (ham === 'sendMessage') { assert.ok(body.text.length <= 2000, 'tin quá dài'); gui.push(body); }
        const r = ham === 'setWebhook' ? { ok: true, result: { verification: { ok: true } } } : { ok: true, result: {} };
        return { getContentText: () => JSON.stringify(r) };
      }
    }
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'TroLyKPI.gs'), 'utf8'), ctx, { filename: 'TroLyKPI.gs' });
  return { ctx, store, gui, goi, triggers, them };
}

function duLieuMau(them) {
  them('PhongBan', [['MaXuong', 'TenXuong', 'TrangThai'], ['CNC', 'Xưởng CNC', 'Đang dùng'], ['NGON', 'Xưởng Ngọn', 'Đang dùng'], ['SON', 'Xưởng Sơn', 'Đang dùng'], ['CU', 'Xưởng Cũ', 'Ngừng']]);
  them('CongDoan', [['MaCD', 'TenCD', 'MaXuong', 'CachCham', 'TrangThai'], ['CNC-TIP', 'Tip', 'CNC', 'CN', 'Đang dùng'], ['NGON-A', 'A', 'NGON', 'CN', 'Đang dùng']]);
  them('DinhMuc', [['MaCD', 'DinhMucGio', 'DonViTinh', 'HieuLucTu', 'NguoiDuyet', 'GhiChu'],
    ['CNC-TIP', 28, 'cái/giờ', '2026-01-01', '', ''], ['CNC-TIP', 20, 'cái/giờ', '2026-07-25', '', ''], ['NGON-A', '12,5', 'phôi/giờ', '2026-01-01', '', '']]);
  them('NhanSu', [['MaNV', 'HoTen', 'MaXuong', 'ChucDanh', 'BacTayNghe', 'NamSinh', 'NgayVaoLam', 'SoCCCD', 'DienThoai', 'DiaChi', 'LoaiHopDong', 'LuongCoBan'],
    ['C1', 'A', 'CNC', '', '', '', '', '001091234567', '0912345678', 'Hà Nội', '', 9000000], ['C2', 'B', 'NGON', '', '', '', '', '', '', '', '', 7000000]]);
  const H = ['MaDong', 'Ngay', 'MaNV', 'MaCD', 'MaMay', 'GioLam', 'SoLuongLamRa', 'GioDung', 'LyDoDung', 'GhiChu', 'TrangThai', 'NguoiNhap', 'ThoiDiemNhap', 'LyDoTuChoi', 'ThoiDiemDuyet'];
  const nk = [H];
  const dong = (ngay, nv, cd, gio, sl, dung, ly, tt) => nk.push(['x', ngay, nv, cd, '', gio, sl, dung, ly, '', tt, '', '', '', '']);
  // 10/10 (thứ Bảy): CNC 8h × 20/giờ đạt 100%; Ngọn 8h, 80 sp / 12,5 = 6,4h chuẩn = 80%, dừng 2h
  dong('2026-10-10', 'C1', 'CNC-TIP', 8, 160, 0, '', 'Đã duyệt');
  dong('2026-10-10', 'C2', 'NGON-A', 8, 80, 2, 'Chờ nguyên vật liệu', 'Đã duyệt');
  dong('2026-10-10', 'C2', 'NGON-A', 2, 999, 0, '', 'Từ chối');
  dong('2026-10-10', 'C1', 'CNC-TIP', 2, 40, 0, '', 'Chờ duyệt');
  // ngày trước để so sánh: CNC 90%
  dong(new Date(Date.UTC(2026, 9, 9, 0)), 'C1', 'CNC-TIP', 10, 180, 0, '', 'Đã duyệt');
  them('NhatKySanXuat', nk);
  them('PhieuKCS', [['MaPhieu', 'Ngay', 'MaNV', 'MaCD', 'SoLuongKhongDat', 'MaLoi', 'NguoiKiemTra', 'ThoiDiemNhap'],
    ['q', '2026-10-10', 'C2', 'NGON-A', 7, 'L02', '', ''], ['q', '2026-10-10', 'C1', 'CNC-TIP', 2, '', '', '']]);
  them('DanhMucLoi', [['MaLoi', 'TenLoi', 'NguyenNhan', 'MucDo'], ['L02', 'Bọt khí trong phôi', 'Người', 'Nặng']]);
  them('DiemDanhNghi', [['MaDD', 'Ngay', 'MaNV', 'MaXuong', 'LyDo'], ['d', '2026-10-10', 'C1', 'CNC', 'ỐM'], ['d', '2026-10-10', 'C2', 'NGON', 'P']]);
  them('MayMoc', [['MaMay', 'TenMay', 'MaXuong', 'ChungLoai', 'NamSuDung', 'TinhTrang', 'BaoTriKeTiep'],
    ['M1', 'Máy CNC 1', 'CNC', '', '', 'Đang chạy', '2026-10-09'], ['M2', 'Máy cũ', 'CNC', '', '', 'Thanh lý', '2026-01-01'], ['M3', 'Máy xa', 'CNC', '', '', 'Đang chạy', '2026-12-01']]);
  them('PhatNhapTre', [['MaNV', 'HoTen', 'MaXuong', 'Ngay', 'ThoiDiemPhat', 'GhiChu'], ['C1', '', 'CNC', '2026-10-07', '10/10/2026 18:38:52', '']]);
}

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

// ---------- Cài đặt + kết nối ----------
const A = taoCtx('2026-10-11');
duLieuMau(A.them);
assert.throws(() => A.ctx.caiDat(), /ZALO_TOKEN/); n++;
A.store.ZALO_TOKEN = 'TOK';
A.ctx.caiDat();
ok(A.goi[0].ham === 'setWebhook' && A.goi[0].body.url === 'https://script.google.com/macros/s/ABC/exec?k=aaaabbbbccccdddd', 'webhook có khóa');
ok(A.goi[0].body.secret_token.length >= 8, 'secret ≥ 8 ký tự');
ok(A.triggers.length === 1 && A.triggers[0].g === 7 && A.triggers[0].tz === 'Asia/Ho_Chi_Minh', 'trigger 7h giờ VN');
A.ctx.caiDat(); ok(A.triggers.length === 1, 'chạy lại không nhân đôi trigger');
const ma = A.store.MA_KET_NOI;
ok(/^\d{6}$/.test(ma), 'mã kết nối 6 số');

const post = (k, chat, text, id) => A.ctx.doPost({ parameter: { k }, postData: { contents: JSON.stringify({ ok: true, result: { event_name: 'message.text.received', message: { from: { id: chat }, chat: { id: chat, chat_type: 'PRIVATE' }, text, message_id: id } } }) } });

post('sai', 'u1', 'ketnoi ' + ma, 'm0'); ok(A.gui.length === 0, 'sai khóa webhook thì bỏ qua');
post('aaaabbbbccccdddd', 'u9', 'bc', 'm1'); ok(/trợ lý riêng/.test(A.gui.pop().text), 'người lạ bị từ chối khi chưa kết nối');
post('aaaabbbbccccdddd', 'u9', 'ketnoi 000000', 'm2'); ok(/không đúng/.test(A.gui.pop().text) && !A.store.CHU_CHAT_ID, 'mã sai');
post('aaaabbbbccccdddd', 'u1', 'Kết nối ' + ma, 'm3'); ok(A.store.CHU_CHAT_ID === 'u1' && /Đã kết nối/.test(A.gui.pop().text), 'kết nối thành công');
ok(!A.store.MA_KET_NOI, 'mã dùng 1 lần');
post('aaaabbbbccccdddd', 'u9', 'ketnoi ' + ma, 'm4'); ok(A.store.CHU_CHAT_ID === 'u1', 'không cướp được bot');
A.gui.length = 0;

// ---------- Bản tin ----------
post('aaaabbbbccccdddd', 'u1', 'BC', 'm5');
const t = A.gui.map(g => g.text).join('\n');
ok(/Thứ Bảy 10\/10\/2026/.test(t), 'ngày gần nhất = 10/10');
ok(/Xưởng CNC: 100% ▲10/.test(t), 'CNC 100%, hơn hôm trước 10 điểm (định mức theo ngày hiệu lực): ' + t);
ok(/Xưởng Ngọn: 80% · 8h · dừng 2h/.test(t), 'Ngọn 80% (định mức 12,5), bỏ dòng từ chối');
ok(/Toàn nhà máy: 90% định mức/.test(t), 'toàn nhà máy (8+6,4)/16 = 90%');
ok(/Chờ nguyên vật liệu: 2h \(Ngọn 2h\)/.test(t), 'lý do dừng');
ok(/KCS: 9 sp không đạt \(Ngọn 7, CNC 2\)/.test(t) && /Bọt khí trong phôi \(7\)/.test(t), 'KCS');
ok(/Nghỉ: 2 người/.test(t), 'nghỉ');
ok(/1 dòng còn chờ duyệt \(CNC 1\)/.test(t), 'dòng chờ duyệt');
ok(/Chưa có số liệu: Xưởng Sơn/.test(t) && !/Xưởng Cũ/.test(t), 'xưởng thiếu số liệu, bỏ xưởng ngừng');
ok(/1 lượt bị phạt nhập trễ/.test(t), 'nhập trễ');
ok(/M1 Máy CNC 1 \(Xưởng CNC\): QUÁ HẠN 2 ngày/.test(t) && !/M2|M3/.test(t), 'bảo trì');
ok(!/001091234567|0912345678|9000000|Hà Nội/.test(t), 'không lộ thông tin cá nhân');

post('aaaabbbbccccdddd', 'u1', 'BC', 'm5'); ok(A.gui.length === 1, 'tin trùng message_id không trả lời lại');
A.gui.length = 0;
post('aaaabbbbccccdddd', 'u1', 'bc 9/10', 'm6'); ok(/09\/10\/2026/.test(A.gui[0].text) && /Xưởng CNC: 90%/.test(A.gui[0].text), 'bc theo ngày');
post('aaaabbbbccccdddd', 'u1', 'tuần', 'm7'); ok(/TỔNG KẾT 7 NGÀY 04\/10 → 10\/10/.test(A.gui[1].text) && /Xưởng CNC: 94% · 18h/.test(A.gui[1].text), 'tuần: CNC (8+9)/18 = 94%');
post('aaaabbbbccccdddd', 'u1', 'xưởng nào tệ nhất?', 'm8'); ok(/bc – bản tin/.test(A.gui[2].text), 'câu lạ → hướng dẫn');

// ---------- Trigger 7h ----------
A.gui.length = 0;
A.ctx.guiBanTinSang(); ok(A.gui.length === 1 && A.store.DA_GUI_NGAY === '2026-10-10', 'trigger gửi bản tin');
A.ctx.guiBanTinSang(); ok(A.gui.length === 1, 'không gửi lại cùng ngày (Chủ nhật)');

// ---------- Dữ liệu ngày dạng Date và dd/mm/yyyy ----------
ok(A.ctx.ngay_('25/08/2026 9:14:47') === '2026-08-25' && A.ctx.ngay_('2026-8-5') === '2026-08-05', 'chuẩn hóa ngày');
ok(A.ctx.so_('12,5') === 12.5 && A.ctx.so_('1.234,5') === 1234.5 && A.ctx.so_('') === 0, 'đọc số kiểu VN');

console.log('Trợ lý KPI: ' + n + ' kiểm tra đạt.');
