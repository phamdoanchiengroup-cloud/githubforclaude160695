# -*- coding: utf-8 -*-
"""Vá Code.gs – hồ sơ bắt buộc khi đăng nhập (22/10, chủ dự án). Chạy bằng exec() ở cuối tests/va-code.py. Kiểm thử: tests/ho-so.js."""
R("""  if (me.phaiDoiMK) return sach_({ ok: false, phaiDoiMK: true, me: me, msg: 'Cần đổi mật khẩu lần đầu trước khi dùng hệ thống.' });""",
  """  if (me.phaiDoiMK) return sach_({ ok: false, phaiDoiMK: true, me: me, msg: 'Cần đổi mật khẩu lần đầu trước khi dùng hệ thống.' });
  try { me.hoSoThieu = hsVaiTroPhai_(me.vaiTroGoc || me.vaiTro) ? hoSoThieu_(hsCuaToi_(me)) : []; } catch (e) { me.hoSoThieu = []; }   // hồ sơ bắt buộc (22/10) – mọi nhánh, kể cả bếp / nhóm báo cơm""")
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'ho-so', 'ho-so.gs'), encoding='utf-8').read()
# Giờ dựng Code.gs – gửi về web (me.banMay) để so với "Bản web" (mục 32 bên Index)
import datetime as _dths
R("""  try { me.hoSoThieu = hsVaiTroPhai_""", """  me.banMay = KPI_BAN_MAY;
  try { me.hoSoThieu = hsVaiTroPhai_""")
s = s.rstrip() + '\nvar KPI_BAN_MAY = \'' + (_dths.datetime.now(_dths.timezone.utc) + _dths.timedelta(hours=7)).strftime('%d/%m/%Y %H:%M') + '\';   // giờ dựng Code.gs (22/10)\n'
