"""Dựng cai-dat-clasp/ds-file.txt: danh sách file .gs/.html của Thiên Cơ Các kèm dung lượng (byte).
Bộ bấm đúp (2-CAP-NHAT.bat) dùng danh sách này khi máy không vào được api.github.com – chỉ cần raw.githubusercontent.com.
Chạy sau mỗi lần thêm/sửa file: python3 tools/tao-ds-file.py   (tests/cai-dat.js báo lỗi nếu quên)"""
import os
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ds = sorted(f for f in os.listdir(D) if f.endswith(('.gs', '.html')))
open(os.path.join(D, 'cai-dat-clasp', 'ds-file.txt'), 'w', newline='\n').write(''.join('%s\t%d\n' % (f, os.path.getsize(os.path.join(D, f))) for f in ds))
print('ds-file.txt:', len(ds), 'file')
