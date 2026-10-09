# -*- coding: utf-8 -*-
# Mục 16 của va-index.py (exec): CƠM TRƯA (11/10). Thanh thực đơn trên mọi trang của mọi tài khoản (#combar),
# trang "Cơm trưa" (đăng ký Ăn / Không ăn, bếp báo thực đơn, tổng hợp số suất theo xưởng), vai trò BEP.
# Máy chủ: tests/com-trua.gs. Mã web: tests/com-trua/va-com.{css,js}.
_cm = os.path.join(D, 'com-trua')
_doc = lambda p: io.open(p, encoding='utf-8').read()
assert 'combar' not in s
R("""  <div id="ducbar"></div>""", """  <div id="ducbar"></div>
  <div id="combar" class="hide"></div>""")
# tab "Cơm trưa" cho mọi vai trò; vai trò mới BEP chỉ có Hướng dẫn + Cơm trưa
R("""['sodo','Sơ đồ nhà máy'],['nk','Nhật ký'],""", """['sodo','Sơ đồ nhà máy'],['com','Cơm trưa'],['nk','Nhật ký'],""")
R("""['sodo','Sơ đồ nhà máy'],['duyetsl','Duyệt sản lượng'],""", """['sodo','Sơ đồ nhà máy'],['com','Cơm trưa'],['duyetsl','Duyệt sản lượng'],""")
R("""  CN:[['hd','📖 Hướng dẫn'],['cnnhap','Nhập sản lượng của tôi'],['kpica','KPI cá nhân'],""", """  CN:[['hd','📖 Hướng dẫn'],['cnnhap','Nhập sản lượng của tôi'],['com','Cơm trưa'],['kpica','KPI cá nhân'],""")
R("""  HR:[['hd','📖 Hướng dẫn'],['ns','Hồ sơ nhân sự']],
  QC:[['hd','📖 Hướng dẫn'],['kcs','Nhập kiểm tra CL'],['nk','Xem nhật ký']]""", """  HR:[['hd','📖 Hướng dẫn'],['ns','Hồ sơ nhân sự'],['com','Cơm trưa']],
  QC:[['hd','📖 Hướng dẫn'],['kcs','Nhập kiểm tra CL'],['nk','Xem nhật ký'],['com','Cơm trưa']],
  BEP:[['hd','📖 Hướng dẫn'],['com','Cơm trưa']]""")
R("""  ['Hôm nay',['homnay','dash','sodo','cnnhap','kpica']],""", """  ['Hôm nay',['homnay','dash','sodo','com','cnnhap','kpica']],""")
R("""  QC:['kcs','nk']
};""", """  QC:['kcs','nk'],
  BEP:['com']
};""")
R("""  sodo:'<path d="M3.5 20.5h17"/>""", """  com:'<path d="M4 12.5h16a8 8 0 0 1-16 0z"/><path d="M8 20.5h8"/><path d="M9 8.5c0-1.5 1.5-1.5 1.5-3M13 8.5c0-1.5 1.5-1.5 1.5-3"/>',
  sodo:'<path d="M3.5 20.5h17"/>""")
R("""cccn:vCCCaNhan,sodo:vSoDo}[k])();""", """cccn:vCCCaNhan,sodo:vSoDo,com:vCom}[k])();""")
# tên vai trò BEP ở các chỗ hiển thị + ô tạo tài khoản
R("""QC:'KIỂM SOÁT CL',CN:'CÔNG NHÂN'}[ME.vaiTroGoc||ME.vaiTro];""", """QC:'KIỂM SOÁT CL',CN:'CÔNG NHÂN',BEP:'BẾP ĂN'}[ME.vaiTroGoc||ME.vaiTro];""")
s = s.replace("""HR:'Nhân sự',QC:'Kiểm soát chất lượng',CN:'Công nhân'}[vt]||vt;""", """HR:'Nhân sự',QC:'Kiểm soát chất lượng',CN:'Công nhân',BEP:'Bếp ăn'}[vt]||vt;""")
R("""    '<option value="CN">Công nhân</option></select></div>'+""", """    '<option value="CN">Công nhân</option><option value="BEP">Bếp ăn (thực đơn, số suất)</option></select></div>'+""")
# tải thanh thực đơn ngay khi vào hệ thống
R("""    buildNav();
    try{ maiNut(); maiKhoiDong(); }catch(e){}""", """    buildNav();
    try{ comTai(); }catch(e){}
    try{ maiNut(); maiKhoiDong(); }catch(e){}""")
_k = s.rfind('</body>')
s = s[:_k] + '<style>\n' + _doc(os.path.join(_cm, 'va-com.css')) + '</style>\n<script>\n' + _doc(os.path.join(_cm, 'va-com.js')) + '</script>\n' + s[_k:]
