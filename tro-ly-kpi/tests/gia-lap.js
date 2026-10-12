/**
 * Giả lập Apps Script + Google (Sheet, Lịch, Gmail, Drive) + Zalo + Claude API + Managed Agents cho kiểm thử trợ lý.
 * Dùng: const { taoMoiTruong, kpiMau } = require('./gia-lap.js');
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
  const store = {}, cache = {}, gui = [], goi = [], triggers = [], ai = { kich: [], yeuCau: [], loiKich: [] }, files = {}, lich = [], nhap = [];
  const kpi = new Spreadsheet(KPI_ID, 'CSDL KPI');
  const ma = { env: [], agents: {}, files: {}, sess: {}, goi: [], n: 0 };
  const drive = { folders: {}, n: 0 };
  const thuGmail = [];
  files[KPI_ID] = kpi;
  let soFile = 0;
  class FakeDate extends Date { constructor(...a) { super(...(a.length ? a : [NOW.getTime()])); } static now() { return NOW.getTime(); } }
  const ctx = {
    console, Math, JSON, Date: FakeDate,
    Utilities: {
      getUuid: () => 'aaaa-bbbb-cccc-dddd',
      newBlob: (data, type, name) => taoBlob(data, name),
      formatDate: (d, tz, f) => {
        const x = new Date(new Date(d).getTime() + 7 * 3600e3), p = n => String(n).padStart(2, '0');
        return f.replace('yyyy', x.getUTCFullYear()).replace('MM', p(x.getUTCMonth() + 1)).replace('dd', p(x.getUTCDate()))
          .replace('HH', p(x.getUTCHours())).replace('mm', p(x.getUTCMinutes())).replace('EEE', ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][x.getUTCDay()]);
      }
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k in store ? store[k] : null), setProperty: (k, v) => { store[k] = String(v); }, deleteProperty: k => { delete store[k]; }, getProperties: () => Object.assign({}, store) }) },
    CacheService: { getScriptCache: () => ({ get: k => cache[k] || null, put: (k, v) => { cache[k] = v; }, remove: k => { delete cache[k]; } }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, tryLock: () => true, releaseLock() {} }) },
    SpreadsheetApp: {
      openById: id => { if (!files[id]) throw new Error('không thấy file ' + id); return files[id]; },
      create: name => { const s = new Spreadsheet('agent' + (++soFile), name); s.insertSheet('Sheet1'); files[s.id] = s; return s; }
    },
    Charts: { ChartType: { COLUMN: 'COLUMN', LINE: 'LINE', PIE: 'PIE' } },
    DriveApp: {
      createFolder: name => { const f = taoThuMuc(name); return f; },
      getFolderById: id => { if (!drive.folders[id]) throw new Error('không thấy thư mục'); return drive.folders[id]; }
    },
    CalendarApp: {
      getDefaultCalendar: () => ({
        getName: () => 'Lịch chính',
        getEvents: (a, b) => lich.filter(e => e.bd >= a && e.bd <= b).map(e => ({ getStartTime: () => e.bd, getEndTime: () => e.kt, getTitle: () => e.t, getLocation: () => e.dd || '' })),
        createEvent: (t, bd, kt, o) => { lich.push({ t, bd, kt, dd: o.location }); return { getTitle: () => t }; }
      })
    },
    GmailApp: {   // không có sendEmail: nếu mã gọi gửi thật sẽ lỗi ngay
      getAliases: () => [],
      search: (q, s, n) => thuGmail.length ? thuGmail.slice(0, n) : [{ getMessages: () => [{ getFrom: () => 'khach@abc.vn', getPlainBody: () => 'Xin báo giá 500 gậy' }], getLastMessageDate: () => NOW, getFirstMessageSubject: () => 'Báo giá' }],
      createDraft: (to, sub, body) => { nhap.push({ to, sub, body }); }
    },
    ContentService: { createTextOutput: s => ({ s }) },
    ScriptApp: {
      getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/ABC/exec' }),
      getProjectTriggers: () => triggers, deleteTrigger: t => triggers.splice(triggers.indexOf(t), 1),
      newTrigger: h => ({ timeBased: () => ({
        everyDays: () => ({ atHour: g => ({
          inTimezone: tz => ({ create: () => triggers.push({ h, g, tz, getHandlerFunction: () => h }) }),
          nearMinute: mi => ({ inTimezone: tz => ({ create: () => triggers.push({ h, g, mi, tz, getHandlerFunction: () => h }) }) })
        }) }),
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
          let tra;
          try { tra = typeof r === 'function' ? r(body) : r; } catch (e) { ai.loiKich.push(e); throw e; }
          return { getResponseCode: () => 200, getContentText: () => JSON.stringify(tra) };
        }
        if (url.startsWith('https://api.anthropic.com/v1/')) return maApi(url.slice(29), o);
        const ham = url.split('/').pop(), body = JSON.parse(o.payload);
        goi.push({ ham, body });
        if (ham === 'sendMessage') gui.push(body);
        return { getContentText: () => JSON.stringify({ ok: true, result: {} }) };
      }
    }
  };
  function taoBlob(data, name) {
    const b = { data: String(data), name, getName: () => b.name, setName: x => { b.name = x; return b; }, getDataAsString: () => b.data, getBytes: () => Buffer.from(b.data) };
    return b;
  }
  function taoThuMuc(name) {
    const id = 'fold' + (++drive.n), f = { id, name, files: [], getId: () => id, getUrl: () => 'https://drive.google.com/drive/folders/' + id,
      createFile: blob => { const t = { name: blob.getName(), blob, getName: () => t.name, getUrl: () => 'https://drive.google.com/file/d/' + t.name }; f.files.push(t); return t; } };
    drive.folders[id] = f;
    return f;
  }
  function tra(code, j, blob) { return { getResponseCode: () => code, getContentText: () => (j === undefined ? '' : JSON.stringify(j)), getBlob: () => blob }; }
  function maApi(duong, o) {
    const m = (o.method || 'get').toLowerCase(), body = o.payload && typeof o.payload === 'string' ? JSON.parse(o.payload) : o.payload;
    ma.goi.push({ m, duong, body, headers: o.headers });
    assert.ok(o.headers['x-api-key'] === 'sk-test', 'thiếu khóa API');
    const p = duong.split('?')[0].split('/').filter(Boolean), q = new URLSearchParams(duong.split('?')[1] || '');
    if (p[0] !== 'files' || q.get('scope_id')) assert.ok(o.headers['anthropic-beta'] === 'managed-agents-2026-04-01', 'thiếu beta header: ' + duong);
    if (p[0] === 'environments') {
      if (m === 'post') { if (ma.env.some(e => e.name === body.name)) return tra(409, { error: { message: 'exists' } }); const e = Object.assign({ id: 'env_' + (++ma.n) }, body); ma.env.push(e); return tra(200, e); }
      return tra(200, { data: ma.env });
    }
    if (p[0] === 'agents') {
      if (p[1]) { const a = ma.agents[p[1]]; if (!a) return tra(404, { error: { message: 'not found' } }); Object.assign(a, body); a.version++; return tra(200, a); }
      const a = Object.assign({ id: 'agent_' + (++ma.n), version: 1 }, body); ma.agents[a.id] = a; return tra(200, a);
    }
    if (p[0] === 'files') {
      if (m === 'post') { const id = 'file_' + (++ma.n); ma.files[id] = o.payload.file; return tra(200, { id }); }
      if (q.get('scope_id')) return tra(200, { data: (ma.sess[q.get('scope_id')] || {}).outputs || [] });
      if (p[2] === 'content') return tra(200, undefined, taoBlob('PPTX…', 'raw'));
    }
    if (p[0] === 'sessions') {
      if (!p[1]) { const s = { id: 'sesn_' + (++ma.n), status: 'running', body, events: (body.initial_events || []).map((e, i) => Object.assign({ id: 'sevt_u' + i }, e)), outputs: [], gui: [] }; ma.sess[s.id] = s; return tra(200, { id: s.id, status: 'running' }); }
      const s = ma.sess[p[1]];
      if (p[2] === 'events' && m === 'post') { s.gui.push(...body.events); return tra(200, { data: body.events }); }
      if (p[2] === 'events') return tra(200, { data: s.events });
      if (p[2] === 'archive') { s.archived = true; return tra(200, { id: s.id }); }
      return tra(200, { id: s.id, status: s.status });
    }
    throw new Error('MA API chưa giả lập: ' + m + ' ' + duong);
  }
  vm.createContext(ctx);
  ['TroLyKPI.gs', 'TroLyAI.gs', 'Agents.gs', 'TayChan.gs'].forEach(f => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), ctx, { filename: f }));
  return { ctx, store, cache, gui, goi, triggers, ai, files, kpi, lich, nhap, ma, drive, thuGmail, taoBlob };
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
  them('PhieuKCS', [['MaPhieu', 'Ngay', 'MaNV', 'MaCD', 'SoLuongKhongDat', 'MaLoi'], ['q', '2026-10-10', 'C1', 'CNC-TIP', 4, '']]);
  them('DiemDanhNghi', [['MaDD', 'Ngay', 'MaNV', 'MaXuong', 'LyDo', 'KyHieu']]);
}

module.exports = { taoMoiTruong, kpiMau, NOW };
