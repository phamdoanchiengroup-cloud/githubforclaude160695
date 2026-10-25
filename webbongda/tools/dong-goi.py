#!/usr/bin/env python3
"""Đóng gói giao diện web bóng đá lên jsDelivr.

Mã nguồn giao diện: web/app.css và web/app.js (sửa ở đây, KHÔNG sửa trong Index.html).
Chạy trong thư mục webbongda/:  python3 tools/dong-goi.py
  1. Nén web/app.css → web/app.min.css, web/app.js → web/app.min.js (csso, terser qua npx).
  2. Commit 2 file .min (để có mã commit cố định cho jsDelivr).
  3. Ghi mã commit đó vào Index.html (thẻ <link>/<script> giữa 2 dấu mốc TAI-NGUYEN), cập nhật cai-dat-clasp/ds-file.txt.
Sau đó tự commit + push Index.html như bình thường. jsDelivr dùng link gắn mã commit vì tên nhánh có dấu "/".
"""
import os, re, subprocess, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
REPO = 'phamdoanchiengroup-cloud/githubforclaude160695'
def chay(*a, **k):
    r = subprocess.run(a, capture_output=True, text=True, **k)
    if r.returncode: sys.exit('Lỗi: ' + ' '.join(a) + '\n' + r.stderr)
    return r.stdout
chay('npx', '--yes', 'csso-cli', 'web/app.css', '-o', 'web/app.min.css')
chay('npx', '--yes', 'terser', 'web/app.js', '-c', '-m', '--comments', 'false', '-o', 'web/app.min.js')
for f in ('app.min.css', 'app.min.js'):
    print(f, os.path.getsize('web/' + f) // 1024, 'KB')
chay('git', 'add', 'web')
if subprocess.run(['git', 'diff', '--cached', '--quiet']).returncode:
    chay('git', 'commit', '-q', '-m', 'Web bóng đá: đóng gói giao diện (web/app.min.css, web/app.min.js) cho jsDelivr')
sha = chay('git', 'rev-parse', 'HEAD').strip()
goc = 'https://cdn.jsdelivr.net/gh/%s@%s/webbongda/web/' % (REPO, sha)
du = 'https://fastly.jsdelivr.net/gh/%s@%s/webbongda/web/' % (REPO, sha)
t = open('Index.html', encoding='utf8').read()
t2 = re.sub(r'(<!-- TAI-NGUYEN-CSS -->).*?(<!-- /TAI-NGUYEN-CSS -->)',
    lambda m: m.group(1) + '\n<link rel="stylesheet" href="%sapp.min.css" onerror="this.onerror=null;this.href=\'%sapp.min.css\'">\n' % (goc, du) + m.group(2), t, flags=re.S)
t2 = re.sub(r'(<!-- TAI-NGUYEN-JS -->).*?(<!-- /TAI-NGUYEN-JS -->)',
    lambda m: m.group(1) + '\n<script src="%sapp.min.js" onerror="taiDuPhong_(\'%sapp.min.js\')"></script>\n' % (goc, du) + m.group(2), t2, flags=re.S)
if t2 == t and goc not in t: sys.exit('Không tìm thấy dấu mốc TAI-NGUYEN trong Index.html')
open('Index.html', 'w', encoding='utf8').write(t2)
open('cai-dat-clasp/ds-file.txt', 'w', newline='').write('Code.gs\t%d\r\nIndex.html\t%d\r\n' % (os.path.getsize('Code.gs'), os.path.getsize('Index.html')))
print('Index.html trỏ tới', goc)
