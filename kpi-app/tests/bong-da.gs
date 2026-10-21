
/* ===== GIẢI BÓNG ĐÁ (13/10, chủ dự án: "chỉ một số thông tin để hưởng ứng phong trào, không cần tab riêng") =====
   Đọc thẳng sheet "Web đá bóng 2026" của web giải (cùng chủ sở hữu) – chỉ lấy tên giải, tên đội, lịch + tỉ số.
   KHÔNG đọc các ô khác của sheet CauHinh (có mật khẩu BTC). Nhớ tạm 10 phút để không mở sheet mỗi lần tải trang. */
var BD_SHEET_ID = '1k8zaZhkRM88Oye0zcKvD6q7PHv9KetTvNmY9xCYR6bE';
var BD_LINK = 'https://script.google.com/macros/s/AKfycbyU0HwrkHWv_cBug5SJYhN_Vo2SZd9R5j_RXlGBeAozoTIZmapdraymm7VWCUJz73PCJA/exec';   // đường link web giải (…/exec); để trống thì không hiện nút "Xem lịch & video"

function layBongDa(token) {
  try {
    var me = docPhien_(token);
    if (!me) return sach_({ ok: false, hetHan: true });
    var c = CacheService.getScriptCache(), cu = c.get('bd_v2');
    if (cu) { cu = JSON.parse(cu); cu.link = BD_LINK; return cu; }   // link luôn lấy mới, không theo bản nhớ tạm
    var ss = SpreadsheetApp.openById(BD_SHEET_ID);
    var bang = function(ten) {
      var sh = ss.getSheetByName(ten); if (!sh) return [];
      var v = sh.getDataRange().getDisplayValues(), h = v.shift() || [];
      return v.map(function(r) { var o = {}; h.forEach(function(k, i) { o[k] = String(r[i] == null ? '' : r[i]).trim(); }); return o; });
    };
    var ten = '';
    bang('CauHinh').forEach(function(r) { if (r.Khoa === 'TEN_GIAI') ten = r.GiaTri; });
    var doi = {};
    bang('Doi').forEach(function(r) { if (r.MaDoi) doi[r.MaDoi] = r.TenDoi; });
    var tran = bang('TranDau').map(function(r) {
      var m = /(\d{1,2}):(\d{2})\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(r.GioThiDau || '');
      if (!m) return null;
      var p = function(x) { return ('0' + x).slice(-2); };
      var xong = r.BanThangA !== '' && r.BanThangB !== '';
      return { a: doi[r.MaDoiA] || r.MaDoiA, b: doi[r.MaDoiB] || r.MaDoiB, vong: r.VongDau, gio: m[5] + '-' + p(m[4]) + '-' + p(m[3]) + ' ' + p(m[1]) + ':' + m[2],
        tsA: xong ? Number(r.BanThangA) : null, tsB: xong ? Number(r.BanThangB) : null, xong: xong };
    }).filter(Boolean).sort(function(x, y) { return x.gio < y.gio ? -1 : 1; });
    var out = sach_({ ok: true, ten: ten || 'Giải bóng đá', link: BD_LINK, tran: tran });
    try { c.put('bd_v2', JSON.stringify(out), 600); } catch (e) {}
    return out;
  } catch (e) { return sach_({ ok: false, msg: 'Không đọc được dữ liệu giải bóng đá: ' + e.message }); }
}
