# -*- coding: utf-8 -*-
"""Vá Code.gs – hồ sơ bắt buộc khi đăng nhập (22/10, chủ dự án). Chạy bằng exec() ở cuối tests/va-code.py. Kiểm thử: tests/ho-so.js."""
R("""  var out = { ok: true, me: me, phan: phan || 'tat' };""",
  """  var out = { ok: true, me: me, phan: phan || 'tat' };
  try { me.hoSoThieu = hsVaiTroPhai_(me.vaiTroGoc || me.vaiTro) ? hoSoThieu_(hsCuaToi_(me)) : []; } catch (e) { me.hoSoThieu = []; }   // hồ sơ bắt buộc (22/10)""")
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'ho-so', 'ho-so.gs'), encoding='utf-8').read()
