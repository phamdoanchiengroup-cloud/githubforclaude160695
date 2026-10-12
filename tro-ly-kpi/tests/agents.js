/**
 * Kiểm thử Công ty Agent (Agents.gs + TroLyAI.gs + TroLyKPI.gs) trong Node.
 * Giả lập: Google Sheet (KPI + sheet Agent tự tạo), Lịch, Gmail, Zalo, Claude API.
 * Chạy: node tests/agents.js
 */
const fs = require('fs'), vm = require('vm'), path = require('path'), assert = require('assert');

const KPI_ID = '1znHlbc3ulMRQILePmLZbwNQx-mMXFxd9sm0PBG9lrF8';
const NOW = new Date('2026-10-11T07:00:00+07:00');   // Chủ nhật 11/10/2026, 07:00 giờ VN

/* ---------- Google Sheet trong bộ nhớ ---------- */
function Sheet(name, rows) { this.name = name; this.rows = rows || []; this.charts = []; }
Sheet.prototype = {
  getName() { return this.name; },
  getLastRow() { return this.rows.length; },
  getLastColumn() { return Math.max(0, ...this.rows.map(r => r.length)); },
  getDataRange() { return this.getRange(1, 1, this.rows.length, this.getLastColumn()); },
  getRange(r, c, nr, nc) {
    const sh = this;
    if (typeof r === 'string') return { setNumberFormat() { return this; } };
    nr = nr || 1; nc = nc || 1;
    const R = {
      getValues: () => { const o = []; for (let i = 0; i < nr; i++) { const row = []; for (let j = 0; j < nc; j++) row.push(((sh.rows[r - 1 + i] || [])[c - 1 + j]) ?? ''); o.push(row); } return o; },
      setValues: v => { v.forEach((row, i) => row.forEach((x, j) => { const X = sh.rows[r - 1 + i] = sh.rows[r - 1 + i] || []; X[c - 1 + j] = x; })); return R; },
      setValue: x => R.setValues([[x]]),
      setFontWeight: () => R, setBackground: () => R, setFontColor: () => R, setNumberFormat: () => R
    };
    return R;
  },
  appendRow(r) { this.rows.push(r.slice()); return this; },
  setFrozenRows() {},
  newChart() {
    const ch = { o: {} };
    const b = { setChartType: t => { ch.type = t; return b; }, addRange: () => b, setPosition: () => b, setOption: (k, v) => { ch.o[k] = v; return b; }, build: () => ch };
    return b;
  },
  insertChart(ch) { this.charts.push(ch); }
};
function Spreadsheet(id, name) { this.id = id; this.name = name; this.tabs = []; }
Spreadsheet.prototype = {
  getId() { return this.id; }, getUrl() { return 'https://docs.google.com/spreadsheets/d/' + this.id; },
  getSheetByName(n) { return this.tabs.find(t => t.name === n) || null; },
  insertSheet(n) { const s = new Sheet(n); this.tabs.push(s); return s; },
  getSheets() { return this.tabs; },
  deleteSheet(s) { this.tabs.splice(this.tabs.indexOf(s), 1); }
};

function taoMoiTruong() {
  const store = {}, cache = {}, gui = [], goi = [], triggers = [], ai = { kich: [], yeuCau: [] }, files = {}, lich = [], nhap = [];
  const kpi = new Spreadsheet(KPI_ID, 'CSDL KPI');
  files[KPI_ID] = kpi;
  let soFile = 0;
  class FakeDate extends Date { constructor(...a) { super(...(a.length ? a : [NOW.getTime()])); } static now() { return NOW.getTime(); } }
  const ctx = {
    console, Math, JSON, Date: FakeDate,
    Utilities: {
      getUuid: () => 'aaaa-bbbb-cccc-dddd',
      formatDate: (d, tz, f) => {
        const x = new Date(new Date(d).getTime() + 7 * 3600e3), p = n => String(n).padStart(2, '0');
        return f.replace('yyyy', x.getUTCFullYear()).replace('MM', p(x.getUTCMonth() + 1)).replace('dd', p(x.getUTCDate()))
          .replace('HH', p(x.getUTCHours())).replace('mm', p(x.getUTCMinutes())).replace('EEE', ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][x.getUTCDay()]);
      }
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k in store ? store[k] : null), setProperty: (k, v) => { store[k] = String(v); }, deleteProperty: k => { delete store[k]; }, getProperties: () => Object.assign({}, store) }) },
    CacheService: { getScriptCache: () => ({ get: k => cache[k] || null, put: (k, v) => { cache[k] = v; }, remove: k => { delete cache[k]; } }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    SpreadsheetApp: {
      openById: id => { if (!files[id]) throw new Error('không thấy file ' + id); return files[id]; },
      create: name => { const s = new Spreadsheet('agent' + (++soFile), name); s.insertSheet('Sheet1'); files[s.id] = s; return s; }
    },
    Charts: { ChartType: { COLUMN: 'COLUMN', LINE: 'LINE', PIE: 'PIE' } },
    CalendarApp: {
      getDefaultCalendar: () => ({
        getName: () => 'Lịch chính',
        getEvents: (a, b) => lich.filter(e => e.bd >= a && e.bd <= b).map(e => ({ getStartTime: () => e.bd, getEndTime: () => e.kt, getTitle: () => e.t, getLocation: () => e.dd || '' })),
        createEvent: (t, bd, kt, o) => { lich.push({ t, bd, kt, dd: o.location }); return { getTitle: () => t }; }
      })
    },
    GmailApp: {   // không có sendEmail: nếu mã gọi gửi thật sẽ lỗi ngay
      getAliases: () => [],
      search: () => [{ getMessages: () => [{ getFrom: () => 'khach@abc.vn', getPlainBody: () => 'Xin báo giá 500 gậy' }], getLastMessageDate: () => NOW, getFirstMessageSubject: () => 'Báo giá' }],
      createDraft: (to, sub, body) => { nhap.push({ to, sub, body }); }
    },
    ContentService: { createTextOutput: s => ({ s }) },
    ScriptApp: {
      getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/ABC/exec' }),
      getProjectTriggers: () => triggers, deleteTrigger: t => triggers.splice(triggers.indexOf(t), 1),
      newTrigger: h => ({ timeBased: () => ({
        everyDays: () => ({ atHour: g => ({ inTimezone: tz => ({ create: () => triggers.push({ h, g, tz, getHandlerFunction: () => h }) }) }) }),
        everyMinutes: m => ({ create: () => triggers.push({ h, m, getHandlerFunction: () => h }) })
      }) })
    },
    Logger: { log: () => {} },
    UrlFetchApp: {
      fetch(url, o) {
        if (url === 'https://api.anthropic.com/v1/messages') {
          const body = JSON.parse(o.payload);
          ai.yeuCau.push({ body, headers: o.headers });
          const r = ai.kich.shift();
          assert.ok(r, 'AI được gọi ngoài dự kiến: ' + JSON.stringify(body.messages).slice(0, 300));
          const tra = typeof r === 'function' ? r(body) : r;
          return { getResponseCode: () => 200, getContentText: () => JSON.stringify(tra) };
        }
        const ham = url.split('/').pop(), body = JSON.parse(o.payload);
        goi.push({ ham, body });
        if (ham === 'sendMessage') gui.push(body);
        return { getContentText: () => JSON.stringify({ ok: true, result: {} }) };
      }
    }
  };
  vm.createContext(ctx);
  ['TroLyKPI.gs', 'TroLyAI.gs', 'Agents.gs'].forEach(f => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), ctx, { filename: f }));
  return { ctx, store, cache, gui, goi, triggers, ai, files, kpi, lich, nhap };
}

function kpiMau(kpi) {
  const them = (n, rows) => { kpi.insertSheet(n).rows = rows; };
  them('PhongBan', [['MaXuong', 'TenXuong', 'TrangThai'], ['CNC', 'Xưởng CNC', 'Đang dùng']]);
  them('CongDoan', [['MaCD', 'TenCD', 'MaXuong', 'CachCham', 'TrangThai'], ['CNC-TIP', 'Tip', 'CNC', 'CN', 'Đang dùng']]);
  them('DinhMuc', [['MaCD', 'DinhMucGio'], ['CNC-TIP', 20]]);
  them('DanhMucLoi', [['MaLoi', 'TenLoi']]);
  them('NhanSu', [['MaNV', 'HoTen', 'MaXuong', 'ChucDanh', 'SoCCCD', 'LuongCoBan', 'TrangThai'], ['C1', 'A', 'CNC', 'Công nhân', '0010', 999, 'Đang làm']]);
  them('NhatKySanXuat', [['MaDong', 'Ngay', 'MaNV', 'MaCD', 'GioLam', 'SoLuongLamRa', 'GioDung', 'LyDoDung', 'TrangThai'], ['x', '2026-10-10', 'C1', 'CNC-TIP', 8, 160, 0, '', 'Đã chốt']]);
  them('XacNhanDiemDanh', [['Ngay', 'MaXuong'], ['2026-10-10', 'CNC']]);
}

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const txt = t => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: t }] });
const dung = (id, name, input) => ({ stop_reason: 'tool_use', content: [{ type: 'thinking', thinking: '', signature: 's' }, { type: 'tool_use', id, name, input }] });

const M = taoMoiTruong();
kpiMau(M.kpi);
Object.assign(M.store, { ZALO_TOKEN: 'TOK', WEBHOOK_KEY: 'k123456789', CHU_CHAT_ID: 'u1', ANTHROPIC_API_KEY: 'sk-test' });
const post = (text, id) => M.ctx.doPost({ parameter: { k: 'k123456789' }, postData: { contents: JSON.stringify({ result: { message: { chat: { id: 'u1' }, text, message_id: id } } }) } });
const cuoi = () => M.gui[M.gui.length - 1].text;

// ---------- Chưa cài: bot vẫn là trợ lý KPI một mình ----------
ok(M.ctx.chonAgent_('sk', 'u1', 'abc', []) === null, 'chưa cài → không có phòng');
M.ai.kich.push(txt('Hôm qua CNC đạt 100%.'));
post('hôm qua CNC thế nào', 'a0');
ok(cuoi() === 'Hôm qua CNC đạt 100%.' && M.ai.yeuCau[0].body.tools.length === 3, 'chưa cài: dùng 3 công cụ KPI như cũ');

// ---------- Cài đặt ----------
const kq = M.ctx.caiDatAgent();
const ag = M.files[M.store.AGENT_SHEET_ID];
ok(ag && ag.name === 'Trợ lý – Công ty Agent', 'tạo sheet cấu hình');
ok(ag.tabs.map(t => t.name).join() === 'CacAgent,SoTay,NhatKy', 'đủ tab, đã xóa Sheet1: ' + ag.tabs.map(t => t.name));
ok(ag.getSheetByName('CacAgent').rows.length === 7 && ag.getSheetByName('SoTay').rows.length === 4, 'dữ liệu mẫu 6 phòng + 3 dòng bối cảnh');
ok(M.triggers.filter(t => t.h === 'nhacViec' && t.m === 15).length === 1, 'trigger nhắc việc 15 phút');
ok(/Lịch: OK/.test(kq) && /Gmail: OK/.test(kq) && /SỬA DÒNG NÀY/.test(kq), 'báo quyền + hướng dẫn: ' + kq);
ag.getSheetByName('CacAgent').rows[1][4] += ' (đã sửa)';
M.ctx.caiDatAgent();
ok(/đã sửa/.test(ag.getSheetByName('CacAgent').rows[1][4]) && Object.keys(M.files).length === 2, 'chạy lại không ghi đè chỉnh sửa, không tạo file mới');
ok(M.triggers.filter(t => t.h === 'nhacViec').length === 1, 'chạy lại không nhân đôi trigger');

const ds = M.ctx.docAgents_();
ok(ds.length === 5 && !ds.some(a => a.ma === 'don_hang'), '5 phòng đang bật (Đơn hàng tắt)');
ok(ds.find(a => a.ma === 'thu_ky').congCu.length === 7, 'thư ký có 7 công cụ');

// ---------- Lệnh nhanh ----------
M.gui.length = 0;
post('phòng ban', 'b1');
ok(/CÁC PHÒNG ĐANG LÀM VIỆC/.test(cuoi()) && /Truyền thông \(@viết\)/.test(cuoi()) && !/Đơn hàng/.test(cuoi()), 'danh sách phòng');

// ---------- @viết: gọi thẳng, không cần điều phối ----------
const soYC = M.ai.yeuCau.length;
M.ai.kich.push(body => {
  ok(body.tools.map(t => t.name).join() === 'so_tay_tim', 'Truyền thông chỉ có công cụ sổ tay');
  const he = body.system[0].text;
  ok(/"Truyền thông"/.test(he) && /BỐI CẢNH/.test(he) && /Giọng văn \(SỬA DÒNG NÀY\)/.test(he), 'có vai trò + bối cảnh');
  ok(!/NhatKySanXuat/.test(he), 'phòng không đọc KPI thì không nhận mô tả dữ liệu KPI');
  ok(body.messages[body.messages.length - 1].content === 'bài tuyển 5 công nhân CNC', 'bỏ phần @viết khỏi câu hỏi');
  ok(body.output_config.effort === 'low', 'effort mặc định');
  return txt('🔥 TUYỂN 5 CÔNG NHÂN CNC …');
});
post('@viết bài tuyển 5 công nhân CNC', 'b2');
ok(M.ai.yeuCau.length === soYC + 1, '@viết không tốn lượt điều phối');
ok(cuoi() === '[Truyền thông]\n🔥 TUYỂN 5 CÔNG NHÂN CNC …', 'ghi rõ phòng trả lời');

// ---------- Điều phối + thư ký ghi việc ----------
M.ai.kich.push(body => {
  ok(!body.tools && /thu_ky: Thư ký/.test(body.system[0].text) && !/don_hang/.test(body.system[0].text), 'điều phối: không công cụ, chỉ phòng đang bật');
  ok(/Phòng vừa trao đổi: truyen_thong/.test(body.messages[0].content), 'điều phối biết phòng vừa trao đổi');
  return txt('thu_ky');
});
M.ai.kich.push(dung('t1', 'so_tay_ghi', { loai: 'Việc', noi_dung: 'Họp anh Công về máy CNC 3', han: '2026-10-16 9:00' }));
M.ai.kich.push(dung('t2', 'tra_cuu', { bang: 'NhanSu' }));
M.ai.kich.push(body => {
  const kq1 = body.messages[body.messages.length - 3].content[0], kq2 = body.messages[body.messages.length - 1].content[0];
  ok(kq1.content === 'Đã ghi #4, hạn 2026-10-16 09:00.', 'ghi sổ tay: ' + kq1.content);
  ok(kq2.is_error && /không được dùng công cụ tra_cuu/.test(kq2.content), 'thư ký không được đọc KPI');
  return txt('Đã ghi việc #4, nhắc lúc 9:00 thứ Sáu 16/10.');
});
post('nhắc mình thứ 6 9h họp anh Công về máy CNC 3', 'b3');
ok(cuoi() === '[Thư ký]\nĐã ghi việc #4, nhắc lúc 9:00 thứ Sáu 16/10.', 'trả lời của thư ký');
const st = ag.getSheetByName('SoTay');
ok(st.rows[4][0] === 4 && st.rows[4][2] === 'Việc' && st.rows[4][4] === '2026-10-16 09:00' && st.rows[4][5] === 'Mở' && st.rows[4][7] === 'Thư ký', 'dòng sổ tay đúng');
ok(ag.getSheetByName('NhatKy').rows.length === 3, 'nhật ký ghi 2 lượt hỏi');

// điều phối trả lời lung tung → giữ phòng trước
M.ai.kich.push(txt('Tôi nghĩ là… không rõ'));
M.ai.kich.push(txt('OK'));
post('thêm cả anh Tùng nữa', 'b4');
ok(cuoi() === '[Thư ký]\nOK', 'điều phối không rõ → giữ phòng vừa trao đổi');

// ---------- Việc, nhắc việc, xong ----------
M.ctx.themSoTay_('Việc', 'Gọi nhà cung cấp foam', '2026-10-11 06:30', 'Thư ký');   // đã đến hạn
M.ctx.themSoTay_('Việc', 'Duyệt định mức mới', '2026-10-10 08:00', 'Thư ký');      // quá hạn
post('việc', 'b5');
ok(/VIỆC ĐANG MỞ \(3\)/.test(cuoi()) && /#6 Duyệt định mức mới – hạn 08:00 10\/10\n#5 Gọi/.test(cuoi()), 'danh sách việc theo hạn: ' + cuoi());
M.gui.length = 0;
M.ctx.nhacViec();
ok(M.gui.length === 2 && /NHẮC VIỆC #5/.test(M.gui[0].text) && /xong 5/.test(M.gui[0].text), 'nhắc việc đến hạn, không nhắc việc tương lai');
M.ctx.nhacViec();
ok(M.gui.length === 2, 'mỗi việc chỉ nhắc 1 lần');
post('xong 5', 'b6');
ok(/Đã đánh dấu xong #5/.test(cuoi()) && st.rows[5][5] === 'Xong', 'xong 5');
ok(/Đã dời #6 sang 2026-10-12 08:00/.test(M.ctx.capNhatSoTay_(6, '2026-10-12 08:00')) && st.rows[6][6] === '', 'dời hạn → được nhắc lại');
const vh = M.ctx.viecHomNay_();
ok(/VIỆC HÔM NAY/.test(vh) === false || !/#5/.test(vh), 'việc đã xong không vào bản tin');

// bản tin sáng kèm việc hôm nay
M.ctx.themSoTay_('Việc', 'Kiểm tra máy ép', '2026-10-11 10:00', '');
M.gui.length = 0;
M.ctx.guiBanTinSang();
ok(M.gui.length && /📝 VIỆC HÔM NAY\n#7 Kiểm tra máy ép – 10:00/.test(M.gui.map(g => g.text).join('\n')), 'bản tin sáng có việc hôm nay: ' + M.gui.map(g => g.text).join('\n').slice(-200));

// ---------- Công cụ lịch, email, báo cáo ----------
const cc = { D: {}, ag: { ten: 'Thư ký', congCu: ['lich_tao', 'lich_xem', 'email_nhap', 'email_tim', 'bao_cao_sheet'] } };
ok(/Đã thêm vào lịch: Họp KCS, 09:00 16\/10\/2026/.test(M.ctx.chayCongCu_(cc, 'lich_tao', { tieu_de: 'Họp KCS', bat_dau: '2026-10-16 09:00' })), 'tạo lịch');
ok(M.lich[0].bd.toISOString() === '2026-10-16T02:00:00.000Z' && M.lich[0].kt - M.lich[0].bd === 3600000, 'giờ VN đúng, mặc định 1 giờ');
ok(/T6 16\/10 09:00–10:00 \| Họp KCS/.test(M.ctx.chayCongCu_(cc, 'lich_xem', { tu_ngay: '2026-10-12', den_ngay: '2026-10-18' })), 'xem lịch');
ok(/nháp/.test(M.ctx.chayCongCu_(cc, 'email_nhap', { den: 'a@b.vn', tieu_de: 'Báo giá', noi_dung: 'Kính gửi…' })) && M.nhap.length === 1, 'chỉ tạo nháp');
ok(/khach@abc.vn \| Báo giá \| Xin báo giá 500 gậy/.test(M.ctx.chayCongCu_(cc, 'email_tim', { truy_van: 'báo giá' })), 'tìm email');
const bc = M.ctx.chayCongCu_(cc, 'bao_cao_sheet', { tieu_de: 'Hiệu suất tháng 9', cot: ['Xưởng', '%'], dong: [['CNC', 98.5], ['Ngọn', 73]], bieu_do: 'cot', ghi_chu: 'CNC dẫn đầu' });
const f = M.files['agent2'];
ok(/Đã tạo báo cáo: https:\/\/docs.google.com\/spreadsheets\/d\/agent2/.test(bc) && f.tabs[0].rows[2][1] === 73 && f.tabs[0].charts[0].type === 'COLUMN' && f.tabs[0].rows[4][0] === 'CNC dẫn đầu', 'báo cáo Google Sheet + biểu đồ');
assert.throws(() => M.ctx.chayCongCu_(cc, 'so_tay_ghi', { loai: 'Việc', noi_dung: 'x' }), /không được dùng/); n++;
assert.throws(() => M.ctx.chayCongCu_({ D: {}, ag: { ten: 'TK', congCu: ['so_tay_ghi'] } }, 'so_tay_ghi', { loai: 'Việc', noi_dung: 'x', han: 'thứ 6' }), /Hạn không đúng/); n++;

// ---------- Phòng KPI vẫn có dữ liệu KPI; tên gọi nhiều chữ ----------
M.ai.kich.push(body => {
  ok(/NhatKySanXuat/.test(body.system[0].text) && body.tools.some(t => t.name === 'bao_cao_sheet') && body.output_config.effort === 'medium', 'phân tích: có KPI + báo cáo, effort medium');
  return txt('Phân tích xong.');
});
post('@phân tích so tháng 9 với tháng 8', 'b7');
ok(cuoi() === '[Phân tích dữ liệu]\nPhân tích xong.', '@phân tích');
M.ai.kich.push(body => { ok(body.messages[body.messages.length - 1].content === 'có việc gì mai?', '@thư ký (2 chữ) bỏ đúng phần tên'); return txt('Mai có 1 việc.'); });
post('@thư ký: có việc gì mai?', 'b8');
post('@sx', 'b9');
ok(/Bạn muốn nhờ phòng Sản xuất việc gì/.test(cuoi()), '@phòng mà không có việc');
ok(M.ai.kich.length === 0, 'không còn phản hồi AI chờ dùng');

// ---------- Không lộ dữ liệu cá nhân ----------
const tatCa = JSON.stringify(M.ai.yeuCau) + JSON.stringify(M.gui);
ok(!/0010|"999"|\b999\b|SoCCCD|LuongCoBan/.test(tatCa), 'không lộ CCCD / lương');

console.log('Công ty Agent: ' + n + ' kiểm tra đạt.');
