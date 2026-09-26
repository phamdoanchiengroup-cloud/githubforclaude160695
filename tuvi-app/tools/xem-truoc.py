"""Dựng tools/preview.html từ Index/Styles/Script/Anh để chạy giao diện ngoài Apps Script.
google.script.run được thay bằng window.srv(tên, JSON đối số) – Playwright cung cấp hàm này (xem tools/README trong CLAUDE.md).
Chạy: python3 tools/xem-truoc.py            (tự lập lá số mẫu)
      NOAUTO=1 python3 tools/xem-truoc.py   (trang trống, chưa lập lá số)
"""
import os
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..') + '/'
T = os.path.dirname(os.path.abspath(__file__)) + '/'
idx = open(D + 'Index.html').read()
idx = idx.replace("<?!= include('Styles'); ?>", open(D + 'Styles.html').read())
mock = """<script>
var google={script:{run:(function(){function mk(ok,fail){return new Proxy({},{get:function(t,n){
 if(n==='withSuccessHandler')return function(f){return mk(f,fail)}; if(n==='withFailureHandler')return function(f){return mk(ok,f)};
 return function(){var a=Array.prototype.slice.call(arguments);window.srv(n,JSON.stringify(a)).then(function(r){var j=JSON.parse(r);if(j.loi){fail&&fail({message:j.loi})}else ok&&ok(j.kq)})}}})}return mk()})()}};
</script>"""
tham = '{"name":"Nguyễn Văn An","gender":"nam","calendar":"duong","day":15,"month":8,"year":1990,"hour":10,"minute":30,"place":"21.03|105.85|Hà Nội","tz":"7","auto":"1"}'
if os.environ.get('NOAUTO'): tham = tham.replace('"auto":"1"', '"auto":"0"').replace('"name":"Nguyễn Văn An"', '"name":""')
idx = idx.replace("<script>var INITIAL_PARAMS = <?!= initialParams ?>;</script>", mock + '<script>var INITIAL_PARAMS = ' + tham + ';</script>')
anh = D + 'Anh.html'
idx = idx.replace("<?!= includeTuyChon('Anh'); ?>", open(anh).read() if os.path.exists(anh) else '')
idx = idx.replace("<?!= include('Script'); ?>", open(D + 'Script.html').read())
# Thư viện PDF: dùng bản cài cục bộ nếu có (tests/node_modules), không thì giữ CDN
R = D + 'tests/node_modules'
for cdn, loc in [('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', '/html2canvas/dist/html2canvas.min.js'),
                 ('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', '/jspdf/dist/jspdf.umd.min.js')]:
    if os.path.exists(R + loc): idx = idx.replace(cdn, 'file://' + R + loc)
assert '<?' not in idx, 'còn thẻ Apps Script chưa thay'
open(T + ('preview-trong.html' if os.environ.get('NOAUTO') else 'preview.html'), 'w').write(idx)
print('Đã dựng', T + 'preview.html')
