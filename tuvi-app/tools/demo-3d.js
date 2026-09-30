/**
 * Dựng 3D cho Tử Vi và Bát Tự từ lá số thật:
 *  - demo/la-so-3d.html, demo/bat-tu-3d.html (trang xem thử độc lập)
 *  - LaSo3D.html (file tùy chọn của app, nạp bằng includeTuyChon – mở trong khung riêng toàn màn hình)
 * Chạy: node tools/demo-3d.js ['{"name":"...","gender":"nam","calendar":"duong","day":15,"month":8,"year":1990,"hour":10,"minute":30}']
 * Khuôn: demo/la-so-3d.tpl.html, demo/bat-tu-3d.tpl.html (chỗ /*DATA*\/null được thay bằng dữ liệu).
 */
const fs = require('fs'), path = require('path');
const { ctx } = require('./gia-lap.js');
const D = path.join(__dirname, '..');
const macDinh = { name: 'Nguyễn Văn An', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30, place: '21.03|105.85|Hà Nội', tz: '7' };
const inp = Object.assign({}, macDinh, process.argv[2] ? JSON.parse(process.argv[2]) : {});
const r = ctx.lapLaSo(inp, '');

/* Hàm rút dữ liệu dùng chung cho Node (demo) và trình duyệt (LaSo3D.html) – viết ES5 */
function thongTin3D(r, input) {
  var I = r.tuvi.info;
  return { name: I.name || (input && input.name) || '', gioiTinh: I.gender, namCanChi: I.namCanChi, conGiap: I.conGiap, amDuong: I.amDuong, banMenh: (I.banMenh || {}).ten || '', cuc: I.cuc,
    gioTen: I.gioTen, solar: I.solar, lunar: I.lunar, noi: String((input && input.place) || '').split('|')[2] || '' };
}
function duLieuTV(r, input) {
  var t = r.tuvi, luan = {};
  ((t.luanGiai || {}).cung || []).forEach(function (c) { luan[c.cung] = { yNghia: c.yNghia, lines: c.lines || [], danhGia: c.danhGia }; });
  return { mau: false, info: thongTin3D(r, input), luan: luan,
    tru: ((r.battu && r.battu.pillars) || []).map(function (p) { return { tru: p.tru, can: p.canTen, chi: p.chiTen, h: p.canHanh }; }),
    palaces: t.palaces.slice().sort(function (a, b) { return a.chi - b.chi; }).map(function (p) {
      return { chi: p.chi, chiTen: p.chiTen, canTen: p.canTen, cung: p.cung, cungIdx: p.cungIdx, isThan: !!p.isThan, tuan: !!p.tuan, triet: !!p.triet, ts: p.trangSinh || '', dh: p.daiHan || 0,
        diem10: p.diem10 != null ? p.diem10 : Math.round(100 / (1 + Math.exp(-(p.diem || 0) / 3))) / 10,
        chinh: (p.chinh || []).map(function (s) { return { n: s.n, h: s.h, b: s.b || '', hoa: s.hoa || '' }; }),
        cat: (p.cat || []).map(function (s) { return s.n; }), hung: (p.hung || []).map(function (s) { return s.n; }) };
    }) };
}
function duLieuBT(r, input) {
  var b = r.battu, g = b.goiY || {}, dh = r.moRong && r.moRong.deHieu && r.moRong.deHieu.battu;
  return { mau: false, info: thongTin3D(r, input), nhatChu: b.nhatChu, phanTram: b.phanTram || {}, tyLeTro: b.tyLeTro, cuong: b.cuong,
    pillars: b.pillars.map(function (p) { return { tru: p.tru, canTen: p.canTen, chiTen: p.chiTen, canHanh: p.canHanh, chiHanh: p.chiHanh, thapThan: p.thapThan, napAm: p.napAm, truongSinh: p.truongSinh,
      tangCan: (p.tangCan || []).map(function (x) { return { ten: x.ten, hanh: x.hanh, thapThan: x.thapThan }; }) }; }),
    goiY: { dung: g.dung, hy: g.hy || [], ky: g.ky || [], mau: g.mau || '', huong: g.huong || '', so: g.so || '', nghe: g.nghe || '' },
    quanHe: (b.quanHe || []).map(function (q) { return { loai: q.loai, txt: q.txt }; }),
    daiVan: (b.daiVan || []).map(function (d) { return { tuoi: d.tuoi, nam: d.nam, canChi: d.canChi, hanhCan: d.hanhCan, hanhChi: d.hanhChi, danhGia: d.danhGia }; }),
    deHieu: (dh && dh.khoi) || [] };
}
const nhung = (tpl, data) => tpl.replace('/*DATA*/null', () => JSON.stringify(data).replace(/</g, '\\u003c'));
const TPL_TV = fs.readFileSync(path.join(D, 'demo/la-so-3d.tpl.html'), 'utf8');
const TPL_BT = fs.readFileSync(path.join(D, 'demo/bat-tu-3d.tpl.html'), 'utf8');
const mauTV = Object.assign(duLieuTV(r, inp), { mau: !process.argv[2] }), mauBT = Object.assign(duLieuBT(r, inp), { mau: !process.argv[2] });
fs.writeFileSync(path.join(D, 'demo/la-so-3d.html'), nhung(TPL_TV, mauTV));
fs.writeFileSync(path.join(D, 'demo/bat-tu-3d.html'), nhung(TPL_BT, mauBT));
console.log('Đã dựng demo/la-so-3d.html và demo/bat-tu-3d.html –', mauTV.info.name);

/* ---- File LaSo3D.gs cho app ----
 * Mã 3D đặt trong file Tập lệnh (.gs) chứ không phải HTML: HtmlService từ chối file HTML nó cho là "sai định dạng"
 * (khiến includeTuyChon âm thầm bỏ qua). Trình duyệt gọi layMa3D() khi bấm nút 3D lần đầu rồi chạy mã trả về. */
const dong = s => '[\n' + s.split('\n').map(x => JSON.stringify(x)).join(',\n') + "\n].join('\\n')";
const CSS = `#ls3dNen { position: fixed; inset: 0; z-index: 130; background: #07131f; display: none; }
#ls3dNen.mo { display: block; }
#ls3dNen iframe { border: 0; width: 100%; height: 100%; display: block; }
.ls3d-dong { position: absolute; top: calc(10px + env(safe-area-inset-top, 0px)); right: 12px; z-index: 2; font: 600 13.5px/1 'Be Vietnam Pro', system-ui, sans-serif; color: #07131f; background: #e2c078; border: 0; border-radius: 10px; padding: 9px 13px; cursor: pointer; box-shadow: 0 4px 14px rgba(0, 0, 0, .4); }
.ls3d-dong:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
body.ls3d-mo { overflow: hidden; }`;
const MA = `(function () {
  'use strict';
  if (window.moLaSo3D) return;
  var st = document.createElement('style'); st.textContent = ${dong(CSS)}; document.head.appendChild(st);
  var TPL = { tv: ${dong(TPL_TV)}, bt: ${dong(TPL_BT)} };
  ${thongTin3D.toString()}
  ${duLieuTV.toString()}
  ${duLieuBT.toString()}
  function dongLai() { var n = document.getElementById('ls3dNen'); if (!n) return; n.classList.remove('mo'); document.body.classList.remove('ls3d-mo'); }
  function mo(loai, r, input) {
    if (!r || !r.tuvi || !r.tuvi.palaces || (loai === 'bt' && !(r.battu && r.battu.pillars))) return false;
    var nen = document.getElementById('ls3dNen');
    if (!nen) {
      nen = document.createElement('div'); nen.id = 'ls3dNen'; nen.setAttribute('role', 'dialog'); nen.setAttribute('aria-modal', 'true');
      nen.innerHTML = '<button type="button" class="ls3d-dong">✕ Đóng</button><iframe title="Xem 3D" allow="fullscreen"></iframe>';
      document.body.appendChild(nen);
      nen.querySelector('.ls3d-dong').addEventListener('click', dongLai);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nen.classList.contains('mo')) dongLai(); });
    }
    nen.setAttribute('aria-label', loai === 'bt' ? 'Tứ Trụ 3D' : 'Lá số Tử Vi 3D');
    var I = r.tuvi.info, khoa = loai + JSON.stringify([I.name, I.gender, I.solar, I.hour, I.minute, r.tuvi.palaces.map(function (p) { return p.cungIdx; })]);
    if (nen._khoa !== khoa) {
      var data = loai === 'bt' ? duLieuBT(r, input) : duLieuTV(r, input);
      nen.querySelector('iframe').srcdoc = '<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"></head><body>' +
        TPL[loai].replace('/*DATA*/null', function () { return JSON.stringify(data).replace(/</g, '\\\\u003c'); }) + '</body></html>';
      nen._khoa = khoa;
    }
    nen.classList.add('mo'); document.body.classList.add('ls3d-mo');
    setTimeout(function () { nen.querySelector('.ls3d-dong').focus(); }, 30);
    return true;
  }
  /** Mở lá số Tử Vi 3D / Tứ Trụ 3D toàn màn hình cho kết quả đang xem. Trả về false nếu chưa có dữ liệu. */
  window.moLaSo3D = function (r, input) { return mo('tv', r, input); };
  window.moBatTu3D = function (r, input) { return mo('bt', r, input); };
})();`;
const gs = `/**
 * LaSo3D.gs – Lá số Tử Vi 3D và Tứ Trụ 3D (TÙY CHỌN – thiếu file này web vẫn chạy, chỉ nút 3D báo chưa cài).
 * Tự sinh bằng: node tools/demo-3d.js (từ demo/la-so-3d.tpl.html, demo/bat-tu-3d.tpl.html) – đừng sửa tay.
 * Trình duyệt gọi layMa3D() khi người dùng bấm nút 3D lần đầu, rồi chạy đoạn mã trả về.
 */
function layMa3D() { return LS3D_MA_; }
/** Chạy trong trình soạn thảo để kiểm tra file đã dán đủ chưa */
function kiemTra3D() { Logger.log('✔ LaSo3D.gs đã dán đủ – mã 3D dài ' + Math.round(LS3D_MA_.length / 1024) + ' KB.'); }
var LS3D_MA_ = ${dong(MA)};
`;
new Function(gs + '; return layMa3D();')();                  // tự kiểm tra: file .gs chạy được
fs.writeFileSync(path.join(D, 'LaSo3D.gs'), gs);
console.log('Đã dựng LaSo3D.gs –', (gs.length / 1024).toFixed(0) + ' KB, dòng dài nhất ' + Math.max.apply(null, gs.split('\n').map(x => x.length)) + ' ký tự');
