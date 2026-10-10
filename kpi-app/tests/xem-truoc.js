/**
 * Chạy thử giao diện Index.html trên máy, máy chủ là bộ giả lập (gia-lap-kpi.js) với dữ liệu JSON.
 *   DATA=/đường/dẫn/csdl.json node kpi-app/tests/xem-truoc.js   -> mở http://localhost:8787
 * google.script.run được thay bằng lời gọi HTTP tới giả lập. Ảnh nền / font Google có thể không tải nếu không có mạng.
 */
const http = require('http'), fs = require('fs'), path = require('path');
const G = require('./gia-lap-kpi.js');
const FILE_HTML = process.env.HTML || path.join(__dirname, '..', 'Index.html');
const ctx = G.tao(path.join(__dirname, '..', 'Code.gs'), JSON.parse(fs.readFileSync(process.env.DATA, 'utf8')),
  process.env.GIO || '2026-09-28T10:00:00+07:00');
if (process.env.CHUAN_BI) process.env.CHUAN_BI.split(',').forEach(f => ctx.__goi(f));

const STUB = `<script>
window.google={script:{get run(){
  var ok=function(){}, fail=function(e){console.error(e)};
  var p=new Proxy({}, {get:function(_, ten){
    if(ten==='withSuccessHandler') return function(f){ok=f;return p};
    if(ten==='withFailureHandler') return function(f){fail=f;return p};
    return function(){ var a=[].slice.call(arguments);
      fetch('/goi/'+ten,{method:'POST',body:JSON.stringify(a)}).then(function(r){return r.json()})
        .then(function(j){ j.loi?fail(new Error(j.loi)):ok(j.kq) }).catch(fail); };
  }}); return p; }}};
</script>`;

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url.startsWith('/goi/')) {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      const ten = req.url.slice(5);
      let out;
      try { out = { kq: ctx.__goi(ten, ...JSON.parse(b || '[]')) }; } catch (e) { out = { loi: e.message }; }
      res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(out));
    });
    return;
  }
  // Chỉ để chụp ảnh / thử: /phien/<tên đăng nhập> -> mã phiên (bỏ qua bước bắt đổi mật khẩu trong bộ nhớ giả lập)
  if (req.url.startsWith('/phien/')) {
    const tenDN = decodeURIComponent(req.url.slice(7));
    const sh = ctx.__sheets.TaiKhoan, cot = sh.rows[0].indexOf('DoiMatKhauLanDau');
    sh.rows.forEach((r, i) => { if (i && String(r[sh.rows[0].indexOf('TenDangNhap')]).toLowerCase() === tenDN && cot >= 0) r[cot] = 'Không'; });
    ctx.__DOC_CACHE = {};
    const tk = ctx.doc_('TaiKhoan').filter(x => String(x.TenDangNhap).toLowerCase() === tenDN)[0];
    res.end(tk ? ctx.taoPhien_(tk) : '');
    return;
  }
  const html = fs.readFileSync(FILE_HTML, 'utf8').replace('<script>', STUB + '<script>');
  res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(html);
}).listen(process.env.PORT || 8787, () => console.log('Xem thử: http://localhost:' + (process.env.PORT || 8787)));
