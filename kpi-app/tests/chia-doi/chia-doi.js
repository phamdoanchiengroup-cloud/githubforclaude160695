/* ===== CHIA ĐÔI MÀN HÌNH (21/10, chủ dự án đề xuất) =====
   Màn hình rộng (≥1100px): bấm một người trong danh sách -> chi tiết hiện ở khung bên phải, danh sách vẫn ở bên trái.
   Áp cho: Bảng KPI (Chi tiết), Nhân sự (Xem hồ sơ), KPI quản lý (bấm dòng).
   - Hiện NGAY từ dữ liệu trình duyệt đã có (nhật ký 2 tháng gần nhất, điểm KPI của dòng), phần lịch sử đầy đủ tải sau.
   - ↑ ↓ chuyển người trên / dưới, Esc đóng. Nút "Kiểu cũ" tắt chia đôi (nhớ localStorage kpi_chia_doi).
   - Màn hình hẹp (điện thoại) giữ nguyên cách cũ. */
(function(){
  var CD_MIN=1100, CHO_TAI=350;
  var CD={loai:'',ma:'',hen:0,lan:0};
  var NHAN={kpi:'Chi tiết KPI',hs:'Hồ sơ nhân viên',ql:'KPI quản lý'};

  window.cdBat=function(){ try{ return localStorage.getItem('kpi_chia_doi')!=='tat'; }catch(e){ return true; } };
  window.cdDuoc=function(){ return cdBat() && window.innerWidth>=CD_MIN; };
  window.cdDatKieu=function(bat){ try{ localStorage.setItem('kpi_chia_doi', bat?'bat':'tat'); }catch(e){} };

  function khung(){
    var p=document.getElementById('cdPanel');
    if(p) return p;
    p=document.createElement('aside'); p.id='cdPanel'; p.setAttribute('aria-label','Chi tiết');
    p.innerHTML='<div class="cd-dau"><div class="cd-nhan" id="cdNhan"></div>'+
      '<button type="button" id="cdLen" title="Người phía trên (↑)" aria-label="Người phía trên">↑</button>'+
      '<button type="button" id="cdXuong" title="Người phía dưới (↓)" aria-label="Người phía dưới">↓</button>'+
      '<button type="button" id="cdCu" title="Tắt chia đôi, quay về kiểu mở cũ">Kiểu cũ</button>'+
      '<button type="button" id="cdDong" title="Đóng (Esc)" aria-label="Đóng">✕</button></div>'+
      '<div class="cd-than" id="cdThan"></div>';
    document.body.appendChild(p);
    document.getElementById('cdLen').onclick=function(){ cdBuoc(-1); };
    document.getElementById('cdXuong').onclick=function(){ cdBuoc(1); };
    document.getElementById('cdDong').onclick=function(){ cdDong(); };
    document.getElementById('cdCu').onclick=function(){
      var l=CD.loai, m=CD.ma; cdDatKieu(false); cdDong();
      if(l==='kpi') xemChiTietKPI(m); else if(l==='hs') xemHS(m);
      toast('Đã về kiểu cũ. Bật lại: nút "⧉ Chia đôi" trong cửa sổ chi tiết.',true);
    };
    return p;
  }
  function cdTop(){
    var h=document.querySelector('#app > header');
    if(h){ var b=h.getBoundingClientRect().bottom; document.documentElement.style.setProperty('--cd-top', Math.max(0,Math.round(b))+'px'); }
  }
  function hangCua(loai){
    return Array.prototype.filter.call(document.querySelectorAll('#main tr[data-cd^="'+loai+'|"]'), function(tr){ return tr.offsetParent!==null; });
  }
  function danhDau(){
    Array.prototype.forEach.call(document.querySelectorAll('#main tr.cd-chon'), function(tr){ tr.classList.remove('cd-chon'); });
    if(!CD.loai) return;
    var ds=hangCua(CD.loai), i=-1;
    ds.forEach(function(tr,k){ if(tr.getAttribute('data-cd')===CD.loai+'|'+CD.ma){ tr.classList.add('cd-chon'); i=k; } });
    if(i>=0) try{ ds[i].scrollIntoView({block:'nearest'}); }catch(e){}
    var len=document.getElementById('cdLen'), xu=document.getElementById('cdXuong');
    if(len) len.disabled=i<=0; if(xu) xu.disabled=(i<0||i>=ds.length-1);
  }
  /* Mở khung với nội dung có sẵn; trả số lượt để lời đáp máy chủ đến muộn không vẽ đè người khác */
  window.cdMo=function(loai, ma, html){
    khung(); cdTop();
    CD.loai=loai; CD.ma=ma; CD.lan++;
    document.getElementById('cdNhan').textContent=NHAN[loai]||'Chi tiết';
    var than=document.getElementById('cdThan'); than.innerHTML=html; than.scrollTop=0;
    document.body.classList.add('cd-mo');
    try{ maiGocDong(); }catch(e){}               // bong bóng Rhino góc phải sẽ che khung chi tiết
    danhDau();
    return CD.lan;
  };
  window.cdCon=function(lan){ return lan===CD.lan && document.body.classList.contains('cd-mo'); };
  window.cdThay=function(lan, html){ if(cdCon(lan)) document.getElementById('cdThan').innerHTML=html; };
  window.cdDong=function(){
    document.body.classList.remove('cd-mo'); CD.loai=''; CD.ma=''; CD.lan++; clearTimeout(CD.hen);
    danhDau();
  };
  window.cdBuoc=function(d){
    if(!CD.loai) return;
    var ds=hangCua(CD.loai), i=-1;
    ds.forEach(function(tr,k){ if(tr.getAttribute('data-cd')===CD.loai+'|'+CD.ma) i=k; });
    var tr=ds[i+d]; if(tr) moHang(tr);
  };
  function moHang(tr){
    var p=(tr.getAttribute('data-cd')||'').split('|'), loai=p[0], ma=p.slice(1).join('|');
    if(loai==='kpi') xemChiTietKPI(ma); else if(loai==='hs') xemHS(ma); else if(loai==='ql') cdQL(ma);
  }
  /* Gắn data-cd cho các dòng có nút Chi tiết / Xem hồ sơ (bảng được vẽ lại nhiều lần nên quét sau mỗi lần vẽ) */
  function ganHang(){
    var main=document.getElementById('main'); if(!main) return;
    [['kpi',/^xemChiTietKPI\('(.*)'\)$/],['hs',/^xemHS\('(.*)'\)$/]].forEach(function(c){
      Array.prototype.forEach.call(main.querySelectorAll('button[onclick^="'+(c[0]==='kpi'?'xemChiTietKPI':'xemHS')+'("]'), function(b){
        var m=(b.getAttribute('onclick')||'').match(c[1]); var tr=b.closest('tr');
        if(m && tr && !tr.hasAttribute('data-cd')) tr.setAttribute('data-cd', c[0]+'|'+m[1].replace(/\\'/g,"'"));
      });
    });
    // Cột phụ: ẩn khi đang chia đôi (CSS body.cd-mo .cd-an) – đánh dấu theo tên cột, không theo thứ tự
    Array.prototype.forEach.call(main.querySelectorAll('table'), function(tb){
      if(tb.__cdCot || !tb.querySelector('tr[data-cd]')) return; tb.__cdCot=1;
      var an=[];
      Array.prototype.forEach.call(tb.querySelectorAll('thead th'), function(th,i){ if(COT_PHU.indexOf(th.textContent.trim())>=0){ th.classList.add('cd-an'); an.push(i); } });
      if(an.length) Array.prototype.forEach.call(tb.querySelectorAll('tbody tr'), function(tr){
        an.forEach(function(i){ var td=tr.children[i]; if(td) td.classList.add('cd-an'); });
      });
    });
    if(document.body.classList.contains('cd-mo')) danhDau();
  }
  var COT_PHU=['Tuân thủ','An toàn','Vai trò','Xưởng','Chức danh','Công đoạn làm được','Hiệu suất','Tỷ lệ đạt','Vận hành','Nề nếp'];
  var henGan=0;
  function theoDoi(){
    var main=document.getElementById('main'); if(!main||main.__cdTheo) return; main.__cdTheo=1;
    new MutationObserver(function(){ clearTimeout(henGan); henGan=setTimeout(ganHang,60); }).observe(main,{childList:true,subtree:true});
  }
  /* Bấm vào dòng (không phải nút / ô nhập) cũng mở chi tiết – chỉ khi đang chia đôi */
  document.addEventListener('click', function(e){
    if(!cdDuoc()) return;
    var tr=e.target.closest && e.target.closest('#main tr[data-cd]'); if(!tr) return;
    if(e.target.closest('button,a,input,select,textarea,label')) return;
    moHang(tr);
  });
  document.addEventListener('keydown', function(e){
    if(!document.body.classList.contains('cd-mo')) return;
    var t=e.target; if(t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if(document.querySelector('.modal.on,#lsbox,#cd_ovl')) return;
    if(e.key==='Escape'){ cdDong(); e.preventDefault(); }
    else if(e.key==='ArrowDown'){ cdBuoc(1); e.preventDefault(); }
    else if(e.key==='ArrowUp'){ cdBuoc(-1); e.preventDefault(); }
  });
  window.addEventListener('resize', function(){ if(document.body.classList.contains('cd-mo')){ if(!cdDuoc()) cdDong(); else cdTop(); } });

  /* ---------- 1. BẢNG KPI → CHI TIẾT ---------- */
  var goc_veBangKPI=window.veBangKPI;
  window.veBangKPI=function(r){ window.__kpiR=r; return goc_veBangKPI.apply(this, arguments); };
  var goc_xemChiTietKPI=window.xemChiTietKPI;
  function oSo(nhan, v, donVi){ return '<div class="cd-o"><b>'+(v===undefined||v===null||v===''?'–':esc(v)+(donVi||''))+'</b><span>'+esc(nhan)+'</span></div>'; }
  window.xemChiTietKPI=function(maNV){
    if(!cdDuoc()) return goc_xemChiTietKPI.apply(this, arguments);
    var r=window.__kpiR||{}, o=(r.ds||[]).filter(function(x){ return x.MaNV===maNV; })[0]||{MaNV:maNV,HoTen:nv(maNV).HoTen,MaXuong:nv(maNV).MaXuong};
    var ky=(r.kieu==='thang'?'Tháng '+String(r.giaTri||'').slice(5)+'/'+String(r.giaTri||'').slice(0,4):r.kieu==='quy'?'Quý '+esc(r.giaTri):r.kieu==='nam'?'Năm '+esc(r.giaTri):'');
    var coHS=['ADMIN','HR','TP'].indexOf(ME.vaiTro)>=0;
    var h='<div class="cd-ten">'+esc(o.HoTen)+'</div>'+
      '<div class="cd-goi">'+esc(o.MaNV)+' · '+esc(pbTen(o.MaXuong))+(ky?' · '+ky:'')+(r.tamTinh?' · đang tính trực tiếp':'')+'</div>';
    if(o.tong!==undefined){
      h+='<div class="cd-so">'+oSo('Tổng KPI',f(o.tong),'%')+oSo('Xếp loại',o.loai)+
        oSo('Sản lượng',f(o.sl),'%')+oSo('Chất lượng',f(o.cl),'%')+oSo('Tuân thủ',f(o.tt),'%')+oSo('An toàn',f(o.at),'%')+
        oSo('Hạng trong xưởng',o.hang?'#'+o.hang:'Học việc')+oSo('Tổng sản phẩm',o.spl!==undefined?Number(o.spl).toLocaleString('vi-VN'):'')+'</div>';
    }
    if(coHS) h+='<div style="margin-bottom:12px"><button class="btn sm" onclick="xemHS(\''+esc(maNV)+'\')">Xem hồ sơ ▸</button></div>';
    h+='<div class="card"><h3>Lịch sử KPI<span><select id="ls_kieu" onchange="veLichSu(this.value)" aria-label="Xem theo">'+
      '<option value="thang">Tháng</option><option value="quy">Quý</option><option value="nam">Năm</option><option value="ngay">Ngày</option></select></span></h3>'+
      '<div id="ls_noidung"><div class="cd-tai">Đang tải lịch sử các tháng…</div></div></div>';
    var lan=cdMo('kpi', maNV, h);
    clearTimeout(CD.hen);
    CD.hen=setTimeout(function(){
      if(!cdCon(lan)) return;
      call('layLichSuKPI',[maNV], function(res){
        if(!cdCon(lan)) return;
        var box=document.getElementById('ls_noidung'); if(!box) return;
        if(!res||!res.ok){ box.innerHTML='<div class="empty">'+esc((res&&res.msg)||'Không tải được lịch sử')+'</div>'; return; }
        window.__ls=res; var k=document.getElementById('ls_kieu'); veLichSu(k?k.value:'thang');
      });
    }, CHO_TAI);
  };
  var goc_moModalLichSu=window.moModalLichSu;
  window.moModalLichSu=function(){
    var kq=goc_moModalLichSu.apply(this, arguments);
    if(window.innerWidth>=CD_MIN && !cdBat()){
      var sp=document.querySelector('#lsbox .card h3 span');
      if(sp) sp.insertAdjacentHTML('beforeend','<button class="btn sm cd-kieu" onclick="cdDatKieu(true);var m=window.__ls&&window.__ls.maNV;if(window.__lsDong)window.__lsDong();if(m)xemChiTietKPI(m)">⧉ Chia đôi</button>');
    }
    return kq;
  };

  /* ---------- 2. NHÂN SỰ → XEM HỒ SƠ ---------- */
  var goc_xemHS=window.xemHS;
  window.xemHS=function(ma){
    if(!cdDuoc()) return goc_xemHS.apply(this, arguments);
    var x=nv(ma), full=(ME.vaiTro==='ADMIN'||ME.vaiTro==='HR');
    var nk=(D.nhatky||[]).concat(D.choDuyet||[]).filter(function(r){ return r.MaNV===ma; })
      .sort(function(a,b){ return ngay(a.Ngay)<ngay(b.Ngay)?-1:ngay(a.Ngay)>ngay(b.Ngay)?1:0; });
    var tam={ ok:true, full:full, tam:true,
      ho:{ MaNV:ma, HoTen:x.HoTen, MaXuong:x.MaXuong, ChucDanh:x.ChucDanh, NamSinh:x.NamSinh, NgayVaoLam:ngay(x.NgayVaoLam),
        DienThoai:x.DienThoai, DiaChi:x.DiaChi, SdtKhanCap:x.SdtKhanCap, CongDoanLamDuoc:x.CongDoanLamDuoc, TrangThai:x.TrangThai,
        BacTayNghe:full?x.BacTayNghe:'', SoCCCD:full?x.SoCCCD:'', LoaiHopDong:full?x.LoaiHopDong:'', LuongCoBan:full?x.LuongCoBan:'' },
      nhatky:nk, kcs:(D.kcs||[]).filter(function(r){ return r.MaNV===ma; }) };
    var lan=cdMo('hs', ma, '');
    window.__hsVao=function(h){ cdThay(lan, '<div class="cd-tai">Đang tải lịch sử cũ hơn 2 tháng…</div>'+h); };
    try{ veHS(tam); } finally { window.__hsVao=null; }
    clearTimeout(CD.hen);
    CD.hen=setTimeout(function(){
      if(!cdCon(lan)) return;
      call('hoSoNhanVien',[ma],function(r){
        if(!cdCon(lan)) return;
        if(!r||!r.ok){ cdThay(lan, '<div class="alert a-bd">'+esc((r&&r.msg)||'Không tải được hồ sơ')+'</div>'); return; }
        var y=document.getElementById('cdThan').scrollTop;
        window.__hsVao=function(h){ cdThay(lan, h); };
        try{ veHS(r); } finally { window.__hsVao=null; }
        document.getElementById('cdThan').scrollTop=y;
      });
    }, CHO_TAI);
  };
  if(window.edHS){ var goc_edHS=window.edHS; window.edHS=function(){ cdDong(); return goc_edHS.apply(this, arguments); }; }

  /* ---------- 3. KPI QUẢN LÝ → BẤM DÒNG ---------- */
  window.cdQL=function(ma){
    if(!cdDuoc()) return;
    var o=(window.__qlDs||[]).filter(function(x){ return String(x.maNV)===String(ma); })[0]; if(!o) return;
    var c=o.chiTiet||{}, tru=[];
    if(c.ddMuon)   tru.push(['Điểm danh muộn '+c.ddMuon+' ngày', c.ddMuon*5]);
    if(c.ddQuen)   tru.push(['Quên điểm danh '+c.ddQuen+' ngày', c.ddQuen*10]);
    if(c.duyetTre) tru.push(['Duyệt trễ '+c.duyetTre+' lượt', c.duyetTre*2]);
    if(c.duyetAu)  tru.push(['Duyệt ẩu (bị ban điều hành từ chối) '+c.duyetAu+' dòng', c.duyetAu*2]);
    if(c.khongNhac)tru.push(['Không nhắc công nhân nhập kịp '+c.khongNhac+' lượt', c.khongNhac*2]);
    var h='<div class="cd-ten">'+esc(o.hoTen)+'</div>'+
      '<div class="cd-goi">'+esc(o.vaiTro)+' · '+esc(o.tenXuong)+(o.hang?' · hạng '+o.hang+(o.tongXuong?'/'+o.tongXuong:''):'')+'</div>'+
      '<div class="cd-so">'+oSo('KPI tổng',f1(o.tong),'%')+oSo('Xếp loại',loaiFE(o.tong))+
        oSo('Hiệu suất xưởng (40%)',f1(o.hieuSuatXuong),'%')+oSo('Tỷ lệ đạt xưởng (10%)',f1(o.tyLeDatXuong),'%')+
        oSo('Vận hành (40%)',f1(o.vanHanh))+oSo('Nề nếp (10%)',f1(o.neNep))+'</div>'+
      '<div class="card"><h3>Điểm vận hành bị trừ<span>'+(tru.length?tru.length+' khoản':'')+'</span></h3>'+
      (tru.length?'<div class="cd-tru">'+tru.map(function(t){ return '<div><span>'+esc(t[0])+'</span><b>−'+t[1]+'</b></div>'; }).join('')+'</div>'
                 :'<div class="ql-ok">✓ Không có điểm trừ vận hành</div>')+
      '<div class="cd-goiy">Vận hành bắt đầu từ 100 điểm. Muốn cải thiện: điểm danh trước 9h, duyệt sản lượng trong 2 ngày làm việc, nhắc công nhân nhập trước hạn.</div></div>';
    cdMo('ql', ma, h);
  };

  /* Sang tab khác thì đóng khung */
  var goc_go=window.go;
  window.go=function(){ if(document.body.classList.contains('cd-mo')) cdDong(); return goc_go.apply(this, arguments); };

  theoDoi(); ganHang();
})();
