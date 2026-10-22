# -*- coding: utf-8 -*-
"""Vá Index.html – dòng "Bản web" ở cuối thanh menu (22/10): chủ dự án dán / cập nhật xong mà web vẫn chạy bản cũ
(đẩy nhầm dự án / triển khai nhầm) không có cách nào biết. Ghi giờ dựng bản + giờ dựng Code.gs (máy chủ gửi về, me.banMay).
Chạy bằng exec() trong tests/va-index.py (trước mục chia đôi)."""
import datetime as _dt32
_ban32 = (_dt32.datetime.now(_dt32.timezone.utc) + _dt32.timedelta(hours=7)).strftime('%d/%m/%Y %H:%M')
_js32 = """<script>
var KPI_BAN = '%s';
(function(){
  var cu = window.veNav;
  window.veNav = function(){
    var r = cu.apply(this, arguments);
    try {
      var n = $('nav'); if (n && !$('kpiBan')) {
        var d = document.createElement('div'); d.id = 'kpiBan';
        d.style.cssText = 'font-size:11px;line-height:1.5;color:var(--ink3);padding:10px 14px 4px';
        var may = (ME && ME.banMay) || '?';
        d.textContent = 'Bản web: ' + KPI_BAN + (may !== KPI_BAN ? ' · máy chủ: ' + may : '');
        d.title = 'Giờ dựng bản đang chạy. Sau khi cập nhật mà dòng này không đổi = web vẫn chạy bản cũ.';
        n.appendChild(d);
      }
    } catch (e) {}
    return r;
  };
})();
</script>
""" % _ban32
_k32 = s.rfind('</body>')
s = s[:_k32] + _js32 + s[_k32:]
