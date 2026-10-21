/**
 * Mô phỏng Apps Script trong Node cho web app KPI: Spreadsheet trong bộ nhớ (tự đổi chuỗi yyyy-MM-dd thành
 * ngày như Google Sheets, trừ ô định dạng văn bản '@'), Cache, Properties, Lock, Utilities.formatDate theo GMT+7,
 * đồng hồ giả (đặt giờ hiện tại bằng datLaiGio).
 *
 * Dùng: const G = require('./gia-lap-kpi.js'); const ctx = G.tao('../Code.gs', duLieu, '2026-09-28T16:00:00+07:00');
 * duLieu = { TenSheet: [[tiêu đề...], [dòng...]] } — ô ngày dạng { $d: '2026-08-25T00:00:00' } (giờ VN).
 */
const fs = require('fs'), vm = require('vm'), crypto = require('crypto'), path = require('path');
const zlib = require('zlib');
const blob = buf => ({ __buf: buf, getBytes: () => Array.from(buf).map(b => (b > 127 ? b - 256 : b)), getDataAsString: () => buf.toString('utf8') });

const VN = 7 * 3600e3;
function dinhDang(d, f) {
  const x = new Date(new Date(d).getTime() + VN);
  const p = (n, k = 2) => String(n).padStart(k, '0');
  const map = { yyyy: x.getUTCFullYear(), MM: p(x.getUTCMonth() + 1), dd: p(x.getUTCDate()), HH: p(x.getUTCHours()),
    mm: p(x.getUTCMinutes()), ss: p(x.getUTCSeconds()), H: x.getUTCHours(), m: x.getUTCMinutes(), u: (x.getUTCDay() || 7) };
  map.Z = '+0700';
  return f.replace(/yyyy|MM|dd|HH|mm|ss|H|m|u|Z/g, t => map[t]);
}

function tao(fileCode, duLieu, gioHienTai) {
  let NOW = new Date(gioHienTai).getTime();
  const RealDate = Date;
  class FakeDate extends RealDate {
    constructor(...a) { if (a.length === 0) super(NOW); else super(...a); }
    static now() { return NOW; }
  }
  const sheets = {}, cache = {}, props = {};
  const log = [];
  const thongKe = { ghi: 0, doc: 0, xoaDong: 0 };

  function Sheet(ten, rows) { this.ten = ten; this.rows = rows || []; this.fmt = {}; }
  Sheet.prototype = {
    getName() { return this.ten; },
    getLastRow() { let n = this.rows.length; while (n > 0 && (!this.rows[n - 1] || this.rows[n - 1].every(v => v === '' || v == null))) n--; return n; },
    getLastColumn() { return Math.max(0, ...this.rows.map(r => { let n = r.length; while (n > 0 && (r[n - 1] === '' || r[n - 1] == null)) n--; return n; })); },
    getMaxRows() { return Math.max(1000, this.rows.length); },
    getDataRange() { return this.getRange(1, 1, Math.max(1, this.getLastRow()), Math.max(1, this.getLastColumn())); },
    getRange(r, c, nr, nc) { return new Range(this, r, c, nr || 1, nc || 1); },
    appendRow(v) { thongKe.ghi++; const r = this.getLastRow() + 1; this.getRange(r, 1, 1, v.length).setValues([v]); return this; },
    deleteRow(i) { thongKe.xoaDong++; this.rows.splice(i - 1, 1); },
    deleteRows(i, n) { thongKe.xoaDong++; this.rows.splice(i - 1, n); },
    insertColumnBefore(c) { this.rows.forEach(r => r.splice(c - 1, 0, '')); },
    setFrozenRows() {}, setColumnWidth() {}, autoResizeColumn() {},
    clear() { this.rows = []; }
  };
  function chuyen(sh, r, c, v) {
    if (typeof v === 'string' && sh.fmt[c] !== '@' && sh.fmt[r + ',' + c] !== '@') {
      if (v[0] === "'") return v.slice(1);                                    // Sheets: dấu ' đầu = giữ nguyên văn bản (ẩn dấu)
      if (v.length > 1 && /^[=+\-@]/.test(v) && !/^[+-]?\d+(\.\d+)?$/.test(v)) return '#CONG_THUC:' + v;   // Sheets coi là công thức -> đánh dấu để kiểm thử bắt được

      if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return new RealDate(v + 'T00:00:00+07:00');
      if (/^\d{4}-\d{2}$/.test(v)) return new RealDate(v + '-01T00:00:00+07:00');   // Sheets đổi '2026-08' thành ngày
    }
    if (v instanceof RealDate) return new RealDate(v.getTime());
    return v;
  }
  function Range(sh, r, c, nr, nc) { Object.assign(this, { sh, r, c, nr, nc }); }
  Range.prototype = {
    getValues() {
      thongKe.doc++; thongKe.o = (thongKe.o || 0) + this.nr * this.nc;
      const o = [];
      for (let i = 0; i < this.nr; i++) {
        const row = [];
        for (let j = 0; j < this.nc; j++) {
          const v = (this.sh.rows[this.r - 1 + i] || [])[this.c - 1 + j];
          row.push(v == null ? '' : (v instanceof RealDate ? new FakeDate(v.getTime()) : v));
        }
        o.push(row);
      }
      return o;
    },
    getValue() { return this.getValues()[0][0]; },
    setValues(v) {
      thongKe.ghi++;
      v.forEach((row, i) => row.forEach((x, j) => {
        const R = this.r - 1 + i;
        while (this.sh.rows.length <= R) this.sh.rows.push([]);
        const Rw = this.sh.rows[R];
        while (Rw.length < this.c - 1 + j) Rw.push('');
        Rw[this.c - 1 + j] = chuyen(this.sh, R + 1, this.c + j, x);
      }));
      return this;
    },
    setValue(x) { return this.setValues([[x]]); },
    clearContent() { for (let i = 0; i < this.nr; i++) { const Rw = this.sh.rows[this.r - 1 + i]; if (Rw) for (let j = 0; j < this.nc; j++) Rw[this.c - 1 + j] = ''; } return this; },
    setNumberFormat(f) {
      if (this.nr > 500) { for (let j = 0; j < this.nc; j++) this.sh.fmt[this.c + j] = f; }
      else for (let i = 0; i < this.nr; i++) for (let j = 0; j < this.nc; j++) this.sh.fmt[(this.r + i) + ',' + (this.c + j)] = f;
      return this;
    },
    setFontWeight() { return this; }, setBackground() { return this; }, setFontColor() { return this; }
  };

  Object.keys(duLieu).forEach(ten => {
    const rows = duLieu[ten].map(r => r.map(v => (v && typeof v === 'object' && v.$d) ? new RealDate(v.$d + '+07:00') : v));
    sheets[ten] = new Sheet(ten, rows);
    // Cột "Ngay" của NgayLe / cột Ky của KPIThang: giữ văn bản
  });
  const ss = {
    getSheetByName: n => sheets[n] || null,
    insertSheet: n => (sheets[n] = new Sheet(n, [])),
    getName: () => 'CSDL KPI', getId: () => 'id', getSpreadsheetTimeZone: () => 'Asia/Ho_Chi_Minh'
  };
  let khoa = false;
  const ctx = {
    console, Math, JSON, Object, Array, String, Number, isNaN, isFinite, parseFloat, parseInt, RegExp, Error,
    Date: FakeDate,
    Logger: { log: m => log.push(String(m)) },
    // ctx.__nguoiDung: email người đang chạy. Mặc định = chủ dự án (chạy trong trình soạn thảo); '' = khách mở web.
    Session: { getScriptTimeZone: () => 'Asia/Ho_Chi_Minh',
      getActiveUser: () => ({ getEmail: () => (ctx.__nguoiDung === undefined ? 'chu@vidu.com' : ctx.__nguoiDung) }),
      getEffectiveUser: () => ({ getEmail: () => 'chu@vidu.com' }) },
    Utilities: {
      DigestAlgorithm: { SHA_256: 'sha256', MD5: 'md5' }, Charset: { UTF_8: 'utf8' },
      computeDigest: (a, s) => Array.from(crypto.createHash(a).update(s, 'utf8').digest()).map(b => (b > 127 ? b - 256 : b)),
      newBlob: (d, type) => { const buf = typeof d === 'string' ? Buffer.from(d, 'utf8') : Buffer.from(d.map(b => b & 255)); return blob(buf); },
      gzip: b => blob(zlib.gzipSync(b.__buf)),
      ungzip: b => blob(zlib.gunzipSync(b.__buf)),
      base64Encode: x => Buffer.from(Array.isArray(x) ? x.map(b => b & 255) : x).toString('base64'),
      base64EncodeWebSafe: x => Buffer.from(Array.isArray(x) ? x.map(b => b & 255) : x).toString('base64').replace(/\+/g, '-').replace(/\//g, '_'),
      base64Decode: s => Array.from(Buffer.from(s, 'base64')).map(b => (b > 127 ? b - 256 : b)),
      getUuid: () => crypto.randomUUID(),
      computeHmacSha256Signature: (v, k) => { const b = x => typeof x === 'string' ? Buffer.from(x, 'utf8') : Buffer.from(x.map(n => n & 255));
        return Array.from(crypto.createHmac('sha256', b(k)).update(b(v)).digest()).map(n => (n > 127 ? n - 256 : n)); },
      formatDate: (d, tz, f) => dinhDang(d, f)
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k in props ? props[k] : null), setProperty: (k, v) => { props[k] = v; }, deleteProperty: k => { delete props[k]; }, getProperties: () => Object.assign({}, props) }) },
    CacheService: { getScriptCache: () => ({
      get: k => (k in cache ? cache[k] : null),
      put: (k, v) => { if (String(v).length > 100000) throw new Error('Cache > 100KB'); cache[k] = v; },
      remove: k => { delete cache[k]; },
      getAll: ks => { const o = {}; ks.forEach(k => { if (k in cache) o[k] = cache[k]; }); return o; },
      putAll: o => { Object.keys(o).forEach(k => { if (String(o[k]).length > 100000) throw new Error('Cache > 100KB'); cache[k] = o[k]; }); }
    }) },
    LockService: { getScriptLock: () => ({ tryLock: () => { if (khoa) return false; khoa = true; return true; }, waitLock() { khoa = true; }, releaseLock() { khoa = false; } }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => ss,
      create: ten => {   // bảng tính mới (lưu chi tiết cơm trưa lên Drive)
        ctx.__bangMoi = ctx.__bangMoi || []; const ds = [new Sheet('Trang tính1', [])], id = 'ss' + (ctx.__bangMoi.length + 1);
        const o = { ten, id, ds, getId: () => id, getName: () => ten, getSheets: () => ds, getSheetByName: n => ds.find(x => x.ten === n) || null,
          insertSheet: n => { const x = new Sheet(n, []); ds.push(x); return x; } };
        Sheet.prototype.setName = Sheet.prototype.setName || function (n) { this.ten = n; return this; };
        ctx.__bangMoi.push(o); return o;
      } },
    HtmlService: { createTemplateFromFile: f => ({ getRawContent: () => fs.readFileSync(path.join(__dirname, '..', f + '.html'), 'utf8'), evaluate: () => ({ setTitle() { return this; }, addMetaTag() { return this; }, setXFrameOptionsMode() { return this; } }) }), XFrameOptionsMode: {},
      // HTML -> "PDF" giả: giữ nguyên HTML trong blob để bài kiểm tra đọc lại / dựng PDF thật bằng Chromium
      createHtmlOutputFromFile: f => ({ getContent: () => fs.readFileSync(path.join(__dirname, '..', f + '.html'), 'utf8') }),
      createHtmlOutput: html => ({ getContent: () => html, getAs: type => { const b = blob(Buffer.from(html, 'utf8')); b.__html = html; b.__type = type; b.__ten = ''; b.setName = n => { b.__ten = n; return b; }; b.getName = () => b.__ten; return b; } }) },
    MailApp: { sendEmail: o => { (ctx.__mail = ctx.__mail || []).push(o); }, getRemainingDailyQuota: () => 100 },
    // ctx.__trigger: danh sách trigger đã cài [{id, ham}]
    ScriptApp: { getProjectTriggers: () => (ctx.__trigger || []).map(t => ({ getUniqueId: () => t.id, getHandlerFunction: () => t.ham })), deleteTrigger() {}, newTrigger: () => { const b = { timeBased: () => b, atHour: () => b, everyDays: () => b, everyMinutes: () => b, everyHours: () => b, onMonthDay: () => b, inTimezone: () => b, create: () => b }; return b; } },
    DriveApp: (() => {   // Drive giả: thư mục + tệp trong bộ nhớ
      const thuMuc = [];
      const it = a => { let i = 0; return { hasNext: () => i < a.length, next: () => a[i++] }; };
      function TM(ten) { this.ten = ten; this.con = []; this.tep = []; }
      TM.prototype = { getName() { return this.ten; }, getUrl() { return 'https://drive.google.com/drive/folders/' + encodeURIComponent(this.ten); },
        getFoldersByName(n) { return it(this.con.filter(x => x.ten === n)); }, createFolder(n) { const f = new TM(n); this.con.push(f); return f; },
        getFilesByName(n) { return it(this.tep.filter(x => x.ten === n && !x.rac)); },
        createFile(b) { const t = { ten: b.getName(), b, rac: false, getName() { return this.ten; }, setTrashed(v) { this.rac = v; } }; this.tep.push(t); return t; } };
      const tepId = {};
      return { __thuMuc: thuMuc, getFileById: id => tepId[id] || (tepId[id] = { id, cha: null, getUrl: () => 'https://docs.google.com/spreadsheets/d/' + id, moveTo(tm) { this.cha = tm; tm.tep.push({ ten: id, rac: false, bangTinh: id, getName: () => id }); return this; } }),
        getFoldersByName: n => it(thuMuc.filter(x => x.ten === n)), createFolder: n => { const f = new TM(n); thuMuc.push(f); return f; } };
    })()
  };
  // Sheets API (dịch vụ nâng cao) giả: batchGet trả UNFORMATTED_VALUE, ngày ở dạng số serial như Google
  const sheetsApi = { Spreadsheets: { Values: { batchGet: (id, o) => {
    thongKe.doc++; thongKe.api = (thongKe.api || 0) + 1;
    o.ranges.forEach(r => { const sh = sheets[r.replace(/^'|'$/g, '').replace(/''/g, "'")]; if (sh) thongKe.o = (thongKe.o || 0) + sh.rows.length * ((sh.rows[0] || []).length); });
    return { valueRanges: o.ranges.map(r => {
      const ten = r.replace(/^'|'$/g, '').replace(/''/g, "'"), sh = sheets[ten];
      const v = sh.rows.map(row => row.map(x => (x instanceof RealDate) ? (x.getTime() + 7 * 3600e3) / 864e5 + 25569 : x));
      while (v.length && v[v.length - 1].every(x => x === '' || x === null || x === undefined)) v.pop();
      return { range: r, values: v.map(row => { const c = row.slice(); while (c.length && (c[c.length - 1] === '' || c[c.length - 1] == null)) c.pop(); return c; }) };
    }) };
  } } } };
  ctx.__batSheetsApi = () => { ctx.Sheets = sheetsApi; };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(fileCode, 'utf8'), ctx, { filename: fileCode });

  // Mỗi "lượt gọi" của Apps Script bắt đầu với biến toàn cục mới: xóa bộ nhớ đệm và nhả khóa.
  ctx.__goi = function (ten, ...a) {   // một lượt gọi máy chủ
    vm.runInContext('__SS_CACHE=null;__DOC_CACHE={};if(typeof __HEAD_CACHE!=="undefined")__HEAD_CACHE={};if(typeof __KHOA!=="undefined")__KHOA=null;if(typeof __NGAY_LE!=="undefined")__NGAY_LE=null;if(typeof __NGAY_VAO!=="undefined")__NGAY_VAO=null;if(typeof __CHO_GHI!=="undefined")__CHO_GHI={};if(typeof __PB!=="undefined")__PB=null;if(typeof __DA_TANG_PB!=="undefined")__DA_TANG_PB=false;if(typeof __DA_GHI!=="undefined")__DA_GHI={};if(typeof __PB_KPI!=="undefined")__PB_KPI=null;if(typeof __KPI_KHONG_DOI!=="undefined")__KPI_KHONG_DOI=false;', ctx);
    khoa = false;
    try { const r = ctx[ten](...a); return r === undefined ? null : moGoi(JSON.parse(JSON.stringify(r))); }
    finally { khoa = false; }
  };
  // napDuLieu / napPhan trả chuỗi JSON gói gọn (tăng tốc 21/10): __goi tự mở gói như trình duyệt (moGoi_ trong Index.html);
  // __goiTho trả nguyên bản máy chủ gửi về.
  function moGoi(r) {
    if (typeof r !== 'string' || r.charAt(0) !== '{') return r;
    try { r = JSON.parse(r); } catch (e) { return r; }
    for (const k in r) { const v = r[k]; if (v && v.__b === 1 && v.c && v.h) r[k] = v.h.map(d => { const o = {}; v.c.forEach((c, j) => { if (d[j] !== null) o[c] = d[j]; }); return o; }); }
    return r;
  }
  ctx.__goiTho = function (ten, ...a) { const mo = moGoi; moGoi = x => x; try { return ctx.__goi(ten, ...a); } finally { moGoi = mo; } };
  ctx.__datGio = t => { NOW = new RealDate(t).getTime(); };
  // Phiên dài hạn cho kiểm thử nhảy giờ nhiều ngày (phiên thật hết hạn sau 6 giờ)
  ctx.__phienDai = tk => { const t = ctx.taoPhien_(tk), k = 'P_' + t, o = JSON.parse(props[k]); o.hanDen += 365 * 864e5; cache[k] = props[k] = JSON.stringify(o); return t; };
  ctx.__sheets = sheets; ctx.__log = log; ctx.__thongKe = thongKe; ctx.__cache = cache;
  ctx.__giuKhoa = () => { khoa = true; };
  return ctx;
}
module.exports = { tao };
