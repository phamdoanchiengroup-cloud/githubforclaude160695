/**
 * Mô phỏng Apps Script trong Node (vm): Google Sheet trong bộ nhớ, Script Properties, Cache, Lock, payOS giả.
 * Nạp mọi file .gs của tuvi-app (Code.gs chỉ nạp phần lập lá số). Dùng: const { ctx } = require('./gia-lap.js');
 */
const fs = require('fs'), vm = require('vm'), path = require('path'), crypto = require('crypto');
const D = path.join(__dirname, '..');
const store = {}, cache = {}, sheets = {};
function Range(sh, r, c, nr, nc) {
  this.sh = sh; this.r = r; this.c = c; this.nr = nr || 1; this.nc = nc || 1;
}
Range.prototype = {
  getValues() { const o = []; for (let i = 0; i < this.nr; i++) { const row = []; for (let j = 0; j < this.nc; j++) row.push(((this.sh.rows[this.r - 1 + i] || [])[this.c - 1 + j]) ?? ''); o.push(row); } return o; },
  getValue() { return this.getValues()[0][0]; },
  getDisplayValues() { return this.getValues().map(r => r.map(v => v instanceof Date ? v.getDate() + '/' + (v.getMonth() + 1) + '/' + v.getFullYear() : String(v))); },
  setValues(v) { v.forEach((row, i) => row.forEach((x, j) => { const R = this.sh.rows[this.r - 1 + i] = this.sh.rows[this.r - 1 + i] || []; R[this.c - 1 + j] = x; })); return this; },
  setValue(x) { return this.setValues([[x]]); },
  setFontWeight() { return this; }, setBackground() { return this; }, setFontColor() { return this; },
  getRow() { return this.r; },
  createTextFinder(t) { const self = this; return { matchEntireCell() { return this; }, matchCase() { return this; },
    findAll() { const o = []; for (let i = 0; i < self.nr; i++) if (String((self.sh.rows[self.r - 1 + i] || [])[self.c - 1]) === String(t)) o.push(new Range(self.sh, self.r + i, self.c)); return o; } }; }
};
function Sheet(n) { this.name = n; this.rows = []; }
Sheet.prototype = {
  appendRow(r) { this.rows.push(r.map(v => typeof v === 'string' && v[0] === "'" ? v.slice(1) : typeof v === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(v) ? (([d, m, y]) => new Date(y, m - 1, d))(v.split('/').map(Number)) : v)); return this; }, getLastRow() { return this.rows.length; },
  getLastColumn() { return Math.max(0, ...this.rows.map(r => r.length)); },
  getRange(r, c, nr, nc) { return new Range(this, r, c, nr, nc); }, setFrozenRows() {}, setColumnWidth() {}, deleteRow(i) { this.rows.splice(i - 1, 1); }
};
const ss = { getSheetByName: n => sheets[n] || null, insertSheet: n => (sheets[n] = new Sheet(n)), getId: () => 'x' };
const payos = { don: {} };
const ctx = {
  console, Math, Date, JSON,
  Utilities: {
    DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { UTF_8: 'utf8' },
    computeDigest: (a, s) => Array.from(crypto.createHash('sha256').update(s, 'utf8').digest()).map(b => (b > 127 ? b - 256 : b)),
    computeHmacSha256Signature: (s, k) => Array.from(crypto.createHmac('sha256', k).update(s, 'utf8').digest()).map(b => (b > 127 ? b - 256 : b)),
    getUuid: () => crypto.randomUUID(), sleep: () => {}, formatDate: (d, tz, f) => { const x = new Date(d); const p = n => String(n).padStart(2, '0'); return f === 'yyyyMMdd' ? '' + x.getFullYear() + p(x.getMonth() + 1) + p(x.getDate()) : x.toISOString(); }
  },
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k in store ? store[k] : null), setProperty: (k, v) => { store[k] = v; }, deleteProperty: k => { delete store[k]; }, getProperties: () => Object.assign({}, store) }) },
  CacheService: { getScriptCache: () => ({ get: k => (k in cache ? cache[k] : null), put: (k, v) => { cache[k] = v; }, remove: k => { delete cache[k]; } }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  SpreadsheetApp: { getActiveSpreadsheet: () => ss },
  ScriptApp: { getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/X/exec' }), getProjectTriggers: () => [], newTrigger: () => ({ timeBased: () => ({ everyMinutes: () => ({ create() { ctx.__trigger = true; } }) }) }) },
  UrlFetchApp: { fetch(url, o) {
    const m = url.match(/payment-requests\/?(\d*)$/); let j;
    if (o.method === 'post') {
      const b = JSON.parse(o.payload), key = ctx.__checksum;
      const s = ['amount', 'cancelUrl', 'description', 'orderCode', 'returnUrl'].map(k => k + '=' + b[k]).join('&');
      const ok = crypto.createHmac('sha256', key).update(s).digest('hex') === b.signature && o.headers['x-client-id'] === 'cid';
      payos.don[b.orderCode] = { orderCode: b.orderCode, amount: b.amount, amountPaid: 0, status: 'PENDING' };
      j = ok ? { code: '00', data: { checkoutUrl: 'https://pay.payos.vn/web/abc', bin: '970452', accountNumber: '123456789', accountName: 'PHAM CHIEN', description: b.description } } : { code: '20', desc: 'Chữ ký không hợp lệ' };
    } else { const d = payos.don[m[1]]; j = d ? { code: '00', data: d } : { code: '101', desc: 'Không tìm thấy' }; }
    return { getContentText: () => JSON.stringify(j), getResponseCode: () => 200 };
  } }
};
vm.createContext(ctx);
fs.readdirSync(D).filter(f => f.endsWith('.gs') && f !== 'Code.gs').forEach(f => vm.runInContext(fs.readFileSync(path.join(D, f), 'utf8'), ctx, { filename: f }));
const code = fs.readFileSync(path.join(D, 'Code.gs'), 'utf8');
vm.runInContext(code.slice(code.indexOf('function lapLaSoDayDu_'), code.indexOf('/* ---------------------- Lưu trữ')), ctx);
module.exports = { ctx, payos };
