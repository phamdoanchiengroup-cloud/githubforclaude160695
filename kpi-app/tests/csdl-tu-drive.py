# -*- coding: utf-8 -*-
"""Đổi file Sheet "CSDL KPI" tải từ Google Drive thành csdl.json cho bản xem thử (tests/tao-ban-xem-thu.js, DATA=...).
   1) Claude gọi công cụ Google Drive download_file_content: fileId = mã Sheet CSDL KPI (xem bo-nao/Liên kết và công cụ.md),
      exportMimeType = application/vnd.openxmlformats-officedocument.spreadsheetml.sheet. Kết quả (JSON có base64) được lưu thành file tool-results.
   2) python3 -I kpi-app/tests/csdl-tu-drive.py <file kết quả hoặc .xlsx> $S/dl/csdl.json
   Dữ liệu có thông tin cá nhân: CHỈ để ở scratchpad, KHÔNG commit."""
import openpyxl, json, sys, datetime, base64, io, re

def doc_xlsx(p):
    b = open(p, 'rb').read()
    if b[:2] == b'PK':
        return b
    t = b.decode('utf-8', 'ignore')
    try:   # kết quả công cụ: JSON, phần base64 nằm trong một trường chuỗi dài
        d = json.loads(t)
        chuoi = []
        def gom(x):
            if isinstance(x, str): chuoi.append(x)
            elif isinstance(x, dict): [gom(v) for v in x.values()]
            elif isinstance(x, list): [gom(v) for v in x]
        gom(d); t = max(chuoi, key=len)
    except ValueError:
        pass
    return base64.b64decode(re.sub(r'\s', '', t))

wb = openpyxl.load_workbook(io.BytesIO(doc_xlsx(sys.argv[1])), data_only=True, read_only=True)
out = {}
for ws in wb.worksheets:
    rows = []
    for r in ws.iter_rows(values_only=True):
        rr = []
        for v in r:
            if isinstance(v, datetime.datetime): v = {'$d': v.strftime('%Y-%m-%dT%H:%M:%S')}
            elif isinstance(v, datetime.date): v = {'$d': v.strftime('%Y-%m-%dT00:00:00')}
            elif isinstance(v, datetime.time): v = v.strftime('%H:%M:%S')
            elif v is None: v = ''
            rr.append(v)
        while rr and rr[-1] == '': rr.pop()
        rows.append(rr)
    while rows and not any(x != '' for x in rows[-1]): rows.pop()
    w = max((len(x) for x in rows), default=0)
    out[ws.title] = [x + [''] * (w - len(x)) for x in rows]
json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False)
for k, v in sorted(out.items(), key=lambda kv: -len(kv[1]))[:20]: print(len(v), len(v[0]) if v else 0, k)
