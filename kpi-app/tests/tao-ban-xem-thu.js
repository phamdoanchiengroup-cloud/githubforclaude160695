/**
 * Tạo BẢN XEM THỬ toàn bộ web app KPI thành MỘT file HTML mở thẳng bằng trình duyệt (không cần Apps Script).
 *   DATA=/đường/dẫn/csdl.json OUT=/đường/dẫn/xem-thu-kpi.html node kpi-app/tests/tao-ban-xem-thu.js
 *
 * - Code.gs chạy ngay trong trang trên một "Google Sheet giả" trong bộ nhớ (sửa gì chỉ mất khi tải lại trang).
 * - Dữ liệu được ẨN DANH: họ tên (trừ chủ sở hữu), CCCD, điện thoại, địa chỉ, lương thay bằng dữ liệu giả;
 *   nhật ký thao tác chỉ giữ 300 dòng cuối; mọi tài khoản dùng mật khẩu "demo".
 * - KHÔNG đưa file kết quả vào repo (vẫn là số liệu sản xuất thật của công ty).
 */
const fs = require('fs'), path = require('path');
const DATA = process.env.DATA, OUT = process.env.OUT;
if (!DATA || !OUT) { console.log('Cần DATA=<csdl.json> OUT=<file html>'); process.exit(1); }
const GIO = process.env.GIO || '2026-09-28T10:00:00+07:00';
const CHU = 'chienpham';   // chủ sở hữu: giữ tên thật (người xem bản thử)

const d = JSON.parse(fs.readFileSync(DATA, 'utf8'));

// ---------- 1) Ẩn danh ----------
let hat = 20260929;
const rnd = () => { hat = (hat * 1103515245 + 12345) % 2147483648; return hat / 2147483648; };
const chon = a => a[Math.floor(rnd() * a.length)];
const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đinh', 'Trịnh', 'Mai', 'Tạ'];
const DEM = ['Văn', 'Thị', 'Minh', 'Hữu', 'Thanh', 'Ngọc', 'Đức', 'Quang', 'Thu', 'Hồng', 'Xuân', 'Kim', 'Bảo', 'Gia', 'Anh', 'Phương'];
const TEN = ['An', 'Bình', 'Châu', 'Dũng', 'Giang', 'Hà', 'Hải', 'Hạnh', 'Hiếu', 'Hòa', 'Hùng', 'Hương', 'Khánh', 'Khoa', 'Lâm', 'Lan',
  'Linh', 'Long', 'Mai', 'Minh', 'My', 'Nam', 'Nga', 'Ngân', 'Nhung', 'Oanh', 'Phong', 'Phúc', 'Quân', 'Quyên', 'Sơn', 'Tâm', 'Thảo',
  'Thắng', 'Thủy', 'Tiến', 'Trang', 'Trung', 'Tú', 'Tuấn', 'Uyên', 'Vân', 'Việt', 'Vinh', 'Yến', 'Đạt', 'Hiền', 'Loan', 'Nhàn', 'Toàn'];
const cot = (bang, ten) => (d[bang] && d[bang][0] ? d[bang][0].indexOf(ten) : -1);

const hang = t => (d[t] || []).slice(1);
const cotTK = n => cot('TaiKhoan', n);
const tenChu = (hang('TaiKhoan').filter(r => String(r[cotTK('TenDangNhap')]).toLowerCase() === CHU)[0] || [])[cotTK('HoTen')] || '';
const tenThat = new Set();
[['NhanSu', 'HoTen'], ['TaiKhoan', 'HoTen'], ['KPIThang', 'HoTen'], ['PhatNhapTre', 'HoTen'], ['YeuCauSuaHoSo', 'HoTen'], ['NhatKyThaoTac', 'HoTen']]
  .forEach(([b, c]) => { const i = cot(b, c); if (i >= 0) hang(b).forEach(r => { const v = String(r[i] || '').trim(); if (v.split(/\s+/).length >= 2) tenThat.add(v); }); });
tenThat.delete(tenChu);
const daDung = new Set([tenChu, ...tenThat]), doiTen = {};   // tên giả không trùng tên thật của ai
[...tenThat].sort().forEach(t => {
  let g; do { g = chon(HO) + ' ' + chon(DEM) + ' ' + chon(TEN); } while (daDung.has(g));
  daDung.add(g); doiTen[t] = g;
});
// Tên đăng nhập là tên người thật (ngoài chủ sở hữu) -> đổi
const doiTK = {};
hang('TaiKhoan').forEach(r => {
  const tk = String(r[cotTK('TenDangNhap')]);
  if (tk.toLowerCase() !== CHU && /^[a-z]{5,}$/.test(tk) && !/^(giamdoc|phogd\d|nhansu|kcs|phongnhansu|phonghanhchinh|tp[a-z]+)$/.test(tk))
    doiTK[tk] = 'bdh' + (Object.keys(doiTK).length + 1);
});
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const reTen = new RegExp(Object.keys(doiTen).sort((a, b) => b.length - a.length).map(esc).join('|'), 'g');
// Nhật ký thao tác: chỉ giữ 300 dòng cuối
if (d.NhatKyThaoTac) d.NhatKyThaoTac = [d.NhatKyThaoTac[0]].concat(d.NhatKyThaoTac.slice(-300));
Object.keys(d).forEach(b => d[b].forEach((r, i) => { if (i) r.forEach((v, j) => {
  if (typeof v !== 'string') return;
  if (doiTK[v]) { r[j] = doiTK[v]; return; }
  if (Object.keys(doiTen).length) r[j] = v.replace(reTen, m => doiTen[m]);
}); }));
const so = n => { let s = ''; for (let i = 0; i < n; i++) s += Math.floor(rnd() * 10); return s; };
const DIA = ['Tổ 3, xã Mẫu Sơn', 'Thôn Đông, xã An Phú', 'Khu 5, phường Tân Mai', 'Xóm Bãi, xã Hòa Bình', 'Tổ 12, phường Minh Khai'];
['NhanSu', 'YeuCauSuaHoSo'].forEach(b => {
  const c = n => cot(b, n);
  hang(b).forEach(r => {
    if (c('SoCCCD') >= 0 && r[c('SoCCCD')]) r[c('SoCCCD')] = '0' + so(11);
    if (c('DienThoai') >= 0 && r[c('DienThoai')]) r[c('DienThoai')] = '09' + so(8);
    if (c('SdtKhanCap') >= 0 && r[c('SdtKhanCap')]) r[c('SdtKhanCap')] = '08' + so(8);
    if (c('DiaChi') >= 0 && r[c('DiaChi')]) r[c('DiaChi')] = chon(DIA);
    if (c('LuongCoBan') >= 0 && r[c('LuongCoBan')]) r[c('LuongCoBan')] = (55 + Math.floor(rnd() * 40)) * 100000;
  });
});
// Mọi tài khoản: mật khẩu "demo" (băm trong trình duyệt khi mở trang), không bắt đổi mật khẩu
hang('TaiKhoan').forEach(r => { r[cotTK('MatKhauMaHoa')] = '__DEMO__'; if (cotTK('DoiMatKhauLanDau') >= 0) r[cotTK('DoiMatKhauLanDau')] = 'Không'; });

// Tài khoản gợi ý trên màn đăng nhập
const tk = hang('TaiKhoan').filter(r => r[cotTK('TrangThai')] === 'Đang dùng');
const lay = (vt, xuong) => tk.filter(r => r[cotTK('VaiTro')] === vt && (!xuong || r[cotTK('MaXuong')] === xuong))[0];
const GOI_Y = [[tk.filter(r => String(r[cotTK('TenDangNhap')]).toLowerCase() === CHU)[0], 'Chủ sở hữu'], [lay('ADMIN'), 'Ban điều hành'],
  [lay('TP', 'DG'), 'Trưởng phòng'], [lay('PP', 'DG') || lay('PP'), 'Phó phòng'], [lay('CN', 'DG'), 'Công nhân'], [lay('HR'), 'Nhân sự'], [lay('QC'), 'Kiểm soát CL']]
  .filter(x => x[0]).map(x => ({ tk: x[0][cotTK('TenDangNhap')], ten: x[0][cotTK('HoTen')], vt: x[1] }));

// ---------- 2) Ghép trang ----------
const code = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8');
let html = fs.readFileSync(path.join(__dirname, '..', 'Index.html'), 'utf8');
const tenHam = [...new Set([...code.matchAll(/^function\s+([A-Za-z_$][\w$]*)\s*\(/gm)].map(m => m[1]))];
const anToan = s => s.replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\!--');

const MAY = `<script>
/* ===== BẢN XEM THỬ: máy chủ Apps Script giả chạy ngay trong trình duyệt ===== */
(function(){
  var RealDate=Date, BAT_DAU=RealDate.now(), GOC=new RealDate(${JSON.stringify(GIO)}).getTime();
  function NOW(){return GOC+(RealDate.now()-BAT_DAU)}
  function FakeDate(){ var a=[].slice.call(arguments); if(!(this instanceof FakeDate)) return new RealDate(NOW()).toString();
    return a.length?new (Function.prototype.bind.apply(RealDate,[null].concat(a)))():new RealDate(NOW()); }
  FakeDate.prototype=RealDate.prototype; FakeDate.now=NOW; FakeDate.UTC=RealDate.UTC; FakeDate.parse=RealDate.parse;
  window.Date=FakeDate;                                   // cả giao diện lẫn máy chủ giả cùng "hôm nay" ${GIO.slice(0, 10)}
  var VN=7*3600e3;
  function dinhDang(dt,f){var x=new RealDate(new RealDate(dt).getTime()+VN);var p=function(n,k){return String(n).padStart(k||2,'0')};
    var m={yyyy:x.getUTCFullYear(),MM:p(x.getUTCMonth()+1),dd:p(x.getUTCDate()),HH:p(x.getUTCHours()),mm:p(x.getUTCMinutes()),ss:p(x.getUTCSeconds()),
      H:x.getUTCHours(),m:x.getUTCMinutes(),u:(x.getUTCDay()||7),Z:'+0700'};
    return f.replace(/yyyy|MM|dd|HH|mm|ss|H|m|u|Z/g,function(t){return m[t]});}
  /* SHA-256 đồng bộ (Utilities.computeDigest) */
  function sha256(str){var b=unescape(encodeURIComponent(str)),n=b.length,K=[],H=[],i,j;
    var pr=function(x){for(var f=2;f*f<=x;f++)if(x%f===0)return false;return true};
    for(var c=2,k=0;k<64;c++)if(pr(c)){if(k<8)H[k]=(Math.pow(c,.5)*4294967296)|0;K[k++]=(Math.pow(c,1/3)*4294967296)|0;}
    var w=[];for(i=0;i<n;i++)w[i>>2]|=(b.charCodeAt(i)&255)<<(24-(i%4)*8);w[n>>2]|=0x80<<(24-(n%4)*8);
    var L=((n+8)>>6)*16+15;for(i=(n>>2)+1;i<L;i++)w[i]=w[i]|0;w[L]=n*8;
    for(j=0;j<w.length;j+=16){var W=w.slice(j,j+16),a=H.slice(0);for(i=0;i<64;i++){
      if(i>=16){var x=W[i-15],y=W[i-2];W[i]=(W[i-16]+((x>>>7|x<<25)^(x>>>18|x<<14)^(x>>>3))+W[i-7]+((y>>>17|y<<15)^(y>>>19|y<<13)^(y>>>10)))|0;}
      var e=a[4],t1=a[7]+((e>>>6|e<<26)^(e>>>11|e<<21)^(e>>>25|e<<7))+((e&a[5])^(~e&a[6]))+K[i]+W[i],A=a[0],
        t2=((A>>>2|A<<30)^(A>>>13|A<<19)^(A>>>22|A<<10))+((A&a[1])^(A&a[2])^(a[1]&a[2]));
      a=[(t1+t2)|0].concat(a);a[4]=(a[4]+t1)|0;a.pop();}
      for(i=0;i<8;i++)H[i]=(H[i]+a[i])|0;}
    var o=[];for(i=0;i<8;i++)for(k=3;k>=0;k--){var v=(H[i]>>(k*8))&255;o.push(v>127?v-256:v)}return o;}
  var duLieu=JSON.parse(document.getElementById('du-lieu-xem-thu').textContent);
  var sheets={},cache={},props={},khoa=false;
  function Sheet(ten,rows){this.ten=ten;this.rows=rows||[];this.fmt={}}
  Sheet.prototype={
    getName:function(){return this.ten},
    getLastRow:function(){var n=this.rows.length;while(n>0&&(!this.rows[n-1]||this.rows[n-1].every(function(v){return v===''||v==null})))n--;return n},
    getLastColumn:function(){return Math.max.apply(null,[0].concat(this.rows.map(function(r){var n=r.length;while(n>0&&(r[n-1]===''||r[n-1]==null))n--;return n})))},
    getMaxRows:function(){return Math.max(1000,this.rows.length)},
    getDataRange:function(){return this.getRange(1,1,Math.max(1,this.getLastRow()),Math.max(1,this.getLastColumn()))},
    getRange:function(r,c,nr,nc){return new Range(this,r,c,nr||1,nc||1)},
    appendRow:function(v){this.getRange(this.getLastRow()+1,1,1,v.length).setValues([v]);return this},
    deleteRow:function(i){this.rows.splice(i-1,1)}, deleteRows:function(i,n){this.rows.splice(i-1,n)},
    insertColumnBefore:function(c){this.rows.forEach(function(r){r.splice(c-1,0,'')})},
    setFrozenRows:function(){},setColumnWidth:function(){},autoResizeColumn:function(){},clear:function(){this.rows=[]}
  };
  function chuyen(sh,r,c,v){
    if(typeof v==='string'&&sh.fmt[c]!=='@'&&sh.fmt[r+','+c]!=='@'){
      if(/^\\d{4}-\\d{2}-\\d{2}$/.test(v))return new RealDate(v+'T00:00:00+07:00');
      if(/^\\d{4}-\\d{2}$/.test(v))return new RealDate(v+'-01T00:00:00+07:00');
    }
    if(v instanceof RealDate)return new RealDate(v.getTime());
    return v;
  }
  function Range(sh,r,c,nr,nc){this.sh=sh;this.r=r;this.c=c;this.nr=nr;this.nc=nc}
  Range.prototype={
    getValues:function(){var o=[];for(var i=0;i<this.nr;i++){var row=[];for(var j=0;j<this.nc;j++){var v=(this.sh.rows[this.r-1+i]||[])[this.c-1+j];
      row.push(v==null?'':(v instanceof RealDate?new RealDate(v.getTime()):v))}o.push(row)}return o},
    getValue:function(){return this.getValues()[0][0]},
    getDisplayValues:function(){return this.getValues().map(function(r){return r.map(function(v){return v instanceof RealDate?dinhDang(v,'dd/MM/yyyy'):String(v)})})},
    setValues:function(v){var me=this;v.forEach(function(row,i){row.forEach(function(x,j){var R=me.r-1+i;while(me.sh.rows.length<=R)me.sh.rows.push([]);
      var Rw=me.sh.rows[R];while(Rw.length<me.c-1+j)Rw.push('');Rw[me.c-1+j]=chuyen(me.sh,R+1,me.c+j,x)})});return this},
    setValue:function(x){return this.setValues([[x]])},
    clearContent:function(){for(var i=0;i<this.nr;i++){var Rw=this.sh.rows[this.r-1+i];if(Rw)for(var j=0;j<this.nc;j++)Rw[this.c-1+j]=''}return this},
    setNumberFormat:function(f){if(this.nr>500){for(var j=0;j<this.nc;j++)this.sh.fmt[this.c+j]=f}
      else for(var i=0;i<this.nr;i++)for(var k=0;k<this.nc;k++)this.sh.fmt[(this.r+i)+','+(this.c+k)]=f;return this},
    setFontWeight:function(){return this},setBackground:function(){return this},setFontColor:function(){return this},
    setHorizontalAlignment:function(){return this},setWrap:function(){return this}
  };
  Object.keys(duLieu).forEach(function(t){
    sheets[t]=new Sheet(t,duLieu[t].map(function(r){return r.map(function(v){return (v&&typeof v==='object'&&v.$d)?new RealDate(v.$d+'+07:00'):v})}));
  });
  var ss={getSheetByName:function(n){return sheets[n]||null},insertSheet:function(n){return (sheets[n]=new Sheet(n,[]))},
    getName:function(){return 'CSDL KPI (xem thử)'},getId:function(){return 'xem-thu'},getSpreadsheetTimeZone:function(){return 'Asia/Ho_Chi_Minh'},getSheets:function(){return Object.keys(sheets).map(function(k){return sheets[k]})}};
  var uuid=function(){return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return (c==='x'?r:(r&3|8)).toString(16)})};
  var G={
    Date:FakeDate, Logger:{log:function(m){console.log('[Logger]',m)}},
    Session:{getScriptTimeZone:function(){return 'Asia/Ho_Chi_Minh'},getActiveUser:function(){return {getEmail:function(){return ''}}}},
    Utilities:{DigestAlgorithm:{SHA_256:'sha256',MD5:'md5'},Charset:{UTF_8:'utf8'},
      computeDigest:function(a,s){if(a!=='sha256')throw new Error('không hỗ trợ');return sha256(s)},
      getUuid:uuid, formatDate:function(dt,tz,f){return dinhDang(dt,f)}, sleep:function(){}},
    PropertiesService:{getScriptProperties:function(){return {getProperty:function(k){return k in props?props[k]:null},setProperty:function(k,v){props[k]=String(v)},
      deleteProperty:function(k){delete props[k]},getProperties:function(){return Object.assign({},props)}}}},
    CacheService:{getScriptCache:function(){return {get:function(k){return k in cache?cache[k]:null},put:function(k,v){cache[k]=v},remove:function(k){delete cache[k]},
      getAll:function(ks){var o={};ks.forEach(function(k){if(k in cache)o[k]=cache[k]});return o},putAll:function(o){Object.assign(cache,o)}}}},
    LockService:{getScriptLock:function(){return {tryLock:function(){if(khoa)return false;khoa=true;return true},waitLock:function(){khoa=true},releaseLock:function(){khoa=false},hasLock:function(){return khoa}}}},
    SpreadsheetApp:{getActiveSpreadsheet:function(){return ss},openById:function(){return ss}},
    ScriptApp:{getProjectTriggers:function(){return []},deleteTrigger:function(){},newTrigger:function(){var b={timeBased:function(){return b},atHour:function(){return b},
      everyDays:function(){return b},onMonthDay:function(){return b},inTimezone:function(){return b},create:function(){return b}};return b}},
    HtmlService:{}, DriveApp:{}, MailApp:{sendEmail:function(){}}
  };
  var ten=Object.keys(G);
  var nguon=document.getElementById('ma-may-chu').textContent;
  var TEN_HAM=${JSON.stringify(tenHam)};
  var MAY_CHU=new Function(ten.join(','), nguon+'\\n;return {'+TEN_HAM.map(function(t){return JSON.stringify(t)+':(typeof '+t+'==="function"?'+t+':null)'}).join(',')+
    ',__datLai:function(){__SS_CACHE=null;__DOC_CACHE={};__HEAD_CACHE={};__KHOA=null;__NGAY_LE=null;__CHO_GHI={};__PB=null;__DA_TANG_PB=false;__DA_GHI={};}};')
    .apply(null,ten.map(function(k){return G[k]}));
  // mật khẩu xem thử: "demo"
  var mk=MAY_CHU.bam_('demo'), tkS=sheets.TaiKhoan, cMK=tkS.rows[0].indexOf('MatKhauMaHoa');
  tkS.rows.forEach(function(r,i){if(i&&r[cMK]==='__DEMO__')r[cMK]=mk});
  window.__MAY_CHU=MAY_CHU;
  function goi(fn,args){
    MAY_CHU.__datLai(); khoa=false;
    try{ if(!MAY_CHU[fn])throw new Error('Không có hàm '+fn); var r=MAY_CHU[fn].apply(null,JSON.parse(JSON.stringify(args)));
      return r===undefined?null:JSON.parse(JSON.stringify(r)); }
    finally{ khoa=false; }
  }
  window.google={script:{get run(){
    var ok=function(){}, loi=function(e){console.error(e)};
    var p=new Proxy({},{get:function(_,ten){
      if(ten==='withSuccessHandler')return function(f){ok=f;return p};
      if(ten==='withFailureHandler')return function(f){loi=f;return p};
      if(ten==='withUserObject')return function(){return p};
      return function(){var a=[].slice.call(arguments);
        setTimeout(function(){ var r,e=null; try{r=goi(ten,a)}catch(x){e=x}
          setTimeout(function(){ e?loi(e):ok(r) }, 120+Math.random()*180); }, 30);};
    }}); return p; }}};
})();
</script>`;

const GOI_Y_HTML = `<div id="xtGoiY" style="position:fixed;right:16px;bottom:16px;z-index:9999;background:#0f1012;color:#f1ede4;border:1px solid #3a3226;
  border-radius:12px;padding:12px 14px;font:12.5px Inter,system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.45);max-width:290px">
  <div style="font:600 10.5px 'JetBrains Mono',monospace;letter-spacing:.16em;color:#c9a36a;margin-bottom:8px">BẢN XEM THỬ · MẬT KHẨU: demo</div>
  ${GOI_Y.map(g => `<button type="button" onclick="document.getElementById('l_tk').value='${g.tk}';document.getElementById('l_mk').value='demo';login()"
    style="display:flex;justify-content:space-between;gap:10px;width:100%;background:none;border:0;border-top:1px solid #24211c;color:inherit;padding:7px 2px;cursor:pointer;font:inherit;text-align:left">
    <span><b style="font-weight:600">${g.vt}</b><br><span style="color:#8d8a83">${g.ten}</span></span><span style="font-family:'JetBrains Mono',monospace;color:#c9a36a">${g.tk}</span></button>`).join('')}
  <div style="color:#77746d;margin-top:6px;line-height:1.45">Tên và thông tin cá nhân đã thay bằng dữ liệu giả. Mọi thay đổi chỉ lưu tạm, tải lại trang là mất.</div>
</div>
<script>(function(){var g=document.getElementById('xtGoiY');setInterval(function(){g.style.display=(document.getElementById('app').style.display==='block')?'none':'block'},500)})();</script>`;

html = html.replace('<script>', () =>   // hàm thay thế: tránh $' $& trong mã bị hiểu là mẫu thay thế
  `<script type="application/json" id="du-lieu-xem-thu">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>\n` +
  `<script type="text/plain" id="ma-may-chu">${anToan(code)}</script>\n` + MAY + '\n<script>');
const cuoi = html.lastIndexOf('</body>');   // chữ </body> đầu tiên nằm trong chuỗi JS (in bảng chấm công)
html = html.slice(0, cuoi) + GOI_Y_HTML + '\n' + html.slice(cuoi);
fs.writeFileSync(OUT, html);
console.log('OK ->', OUT, Math.round(html.length / 1024) + ' KB;', Object.keys(doiTen).length, 'tên đã thay; tài khoản gợi ý:', GOI_Y.map(g => g.tk).join(', '));
