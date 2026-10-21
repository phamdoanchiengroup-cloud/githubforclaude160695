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
# vai trò TL = Trợ lý ban điều hành (chủ dự án 11/10): chỉ xem số liệu tổng (Tổng quan, Bảng KPI, Sơ đồ nhà máy) + Cơm trưa đầy đủ
# (báo thực đơn, đăng ký hộ mọi người, tổng hợp). Máy chủ: vai trò 'TL' không trùng 'ADMIN' nên mọi thao tác sửa đều bị từ chối.
R("""  BEP:[['hd','📖 Hướng dẫn'],['com','Cơm trưa']]""", """  BEP:[['hd','📖 Hướng dẫn'],['com','Cơm trưa']],
  NV:[['hd','📖 Hướng dẫn'],['com','Cơm trưa']],
  TBP:[['hd','📖 Hướng dẫn'],['com','Cơm trưa']],
  NHOM:[['com','Cơm trưa']],
  TL:[['hd','📖 Hướng dẫn'],['dash','Tổng quan'],['kpi','Bảng KPI'],['sodo','Sơ đồ nhà máy'],['com','Cơm trưa'],['dd','Điểm danh'],['cd','Công đoạn'],['ns','Nhân sự'],['mm','Máy móc']]""")
# HR (11/10): như trợ lý + sửa được hồ sơ nhân sự
R("""  HR:[['hd','📖 Hướng dẫn'],['ns','Hồ sơ nhân sự'],['com','Cơm trưa']],""", """  HR:[['hd','📖 Hướng dẫn'],['dash','Tổng quan'],['kpi','Bảng KPI'],['sodo','Sơ đồ nhà máy'],['com','Cơm trưa'],['dd','Điểm danh'],['cd','Công đoạn'],['ns','Hồ sơ nhân sự'],['mm','Máy móc']],""")
R("""  BEP:['com']
};""", """  BEP:['com'],
  TL:['dash','kpi','sodo','com'],
  NV:['com'],
  TBP:['com'],
  NHOM:['com'],
  HR:['dash','ns','dd','com']
};""")
R("""CN:'CÔNG NHÂN',BEP:'BẾP ĂN'}""", """CN:'CÔNG NHÂN',BEP:'BẾP ĂN',TL:'TRỢ LÝ BĐH',NV:'NHÂN VIÊN BP',TBP:'TRƯỞNG BP',NHOM:'NHÓM BÁO CƠM'}""")
s = s.replace("""CN:'Công nhân',BEP:'Bếp ăn'}[vt]||vt;""", """CN:'Công nhân',BEP:'Bếp ăn',TL:'Trợ lý ban điều hành',NV:'Nhân viên bộ phận',TBP:'Trưởng bộ phận',NHOM:'Nhóm báo cơm'}[vt]||vt;""")
R("""<option value="BEP">Bếp ăn (thực đơn, số suất)</option></select></div>'+""", """<option value="BEP">Bếp ăn (thực đơn, số suất)</option><option value="TL">Trợ lý ban điều hành (chỉ xem + cơm trưa)</option><option value="NHOM">Nhóm báo cơm – báo tổng số suất (chỉ cơm trưa)</option></select></div>'+""")
# tài khoản NHOM: ô chọn nhóm báo cơm (COM_BO_PHAN); không có mã NV
R("""    '<div id="qnvbox" style="display:none">""", """    '<div id="qbpbox" style="display:none"><label>Nhóm báo cơm</label><select id="q_bp">'+Object.keys(COM_BO_PHAN).map(function(k){return '<option value="'+k+'">'+esc(COM_BO_PHAN[k])+'</option>'}).join('')+'</select></div>'+
    '<div id="qnvbox" style="display:none">""")
R("""  $('qcnhint').style.display=(v==='CN')?'block':'none';""", """  $('qcnhint').style.display=(v==='CN')?'block':'none';
  if($('qbpbox'))$('qbpbox').style.display=(v==='NHOM')?'block':'none';""")
R("""    VaiTro:vt,MaXuong:'',
    MaNV:(vt==='CN'||vt==='TP')?($('q_nv')?$('q_nv').value:''):'',""", """    VaiTro:vt,MaXuong:(vt==='NHOM')&&$('q_bp')?$('q_bp').value:'',
    MaNV:(vt==='CN'||vt==='TP')?($('q_nv')?$('q_nv').value:''):'',""")
# danh sách tài khoản: tên vai trò + tên bộ phận
R("""  var vt={ADMIN:'Ban điều hành',TP:'Trưởng phòng',PP:'Phó phòng',HR:'Nhân sự',QC:'Kiểm soát CL',CN:'Công nhân'};""", """  var vt={ADMIN:'Ban điều hành',TP:'Trưởng phòng',PP:'Phó phòng',HR:'Nhân sự',QC:'Kiểm soát CL',CN:'Công nhân',BEP:'Bếp ăn',TL:'Trợ lý BĐH',NV:'Nhân viên BP',TBP:'Trưởng BP',NHOM:'Nhóm báo cơm'};""")
R("""  (D.phongban||[]).forEach(function(p){ tenXuong[p.MaXuong]=p.TenXuong; });""", """  (D.phongban||[]).forEach(function(p){ tenXuong[p.MaXuong]=p.TenXuong; });
  Object.keys(COM_BO_PHAN).forEach(function(k){ if(!tenXuong[k])tenXuong[k]=COM_BO_PHAN[k]; });""")
# tải thanh thực đơn ngay khi vào hệ thống
R("""    buildNav();
    try{ maiNut(); maiKhoiDong(); }catch(e){}""", """    buildNav();
    try{ comTai(); }catch(e){}
    try{ maiNut(); maiKhoiDong(); }catch(e){}""")
_k = s.rfind('</body>')
s = s[:_k] + '<style>\n' + _doc(os.path.join(_cm, 'va-com.css')) + '</style>\n<script>\n' + _doc(os.path.join(_cm, 'va-com.js')) + '</script>\n' + s[_k:]
