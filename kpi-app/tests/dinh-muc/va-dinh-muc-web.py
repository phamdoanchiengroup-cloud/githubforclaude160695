# -*- coding: utf-8 -*-
"""Vá Index.html – tab Phân tích định mức (21/10, chủ dự án): hiện gợi ý cho MỌI công đoạn để về mốc 85%
(nâng hoặc hạ), số dự kiến sau khi áp, công đoạn phụ thuộc / ít người; lời xác nhận theo quy tắc mới:
đổi định mức là áp cho CẢ THÁNG đang làm (kể cả tháng đã chốt -> nhắc Chốt bù).
Chạy bằng exec() trong tests/va-index.py (trước mục chia đôi). Máy chủ: dinh-muc/dinh-muc.gs. Kiểm thử: tests/dinh-muc-web.js."""

_a = s.index('function vPTDM(){')
_b = s.index('\nfunction duyet(ma,ok){')
assert s.count('function vPTDM(){') == 1 and _a < _b
s = s[:_a] + io.open(os.path.join(D, 'dinh-muc', 'dinh-muc-web.js'), encoding='utf-8').read().rstrip() + '\n' + s[_b:]
