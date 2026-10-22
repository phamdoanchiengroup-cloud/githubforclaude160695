# -*- coding: utf-8 -*-
"""Vá Code.gs – hồ sơ bắt buộc khi đăng nhập (22/10, chủ dự án). Chạy bằng exec() ở cuối tests/va-code.py. Kiểm thử: tests/ho-so.js."""
R("""  if (me.phaiDoiMK) return sach_({ ok: false, phaiDoiMK: true, me: me, msg: 'Cần đổi mật khẩu lần đầu trước khi dùng hệ thống.' });""",
  """  if (me.phaiDoiMK) return sach_({ ok: false, phaiDoiMK: true, me: me, msg: 'Cần đổi mật khẩu lần đầu trước khi dùng hệ thống.' });
  try { me.hoSoThieu = hsVaiTroPhai_(me.vaiTroGoc || me.vaiTro) ? hoSoThieu_(hsCuaToi_(me)) : []; } catch (e) { me.hoSoThieu = []; }   // hồ sơ bắt buộc (22/10) – mọi nhánh, kể cả bếp / nhóm báo cơm""")
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'ho-so', 'ho-so.gs'), encoding='utf-8').read()
