/* Mục 16: CƠM TRƯA – thanh thực đơn (#combar) trên mọi trang của mọi tài khoản + trang "Cơm trưa".
   Máy chủ: napComTrua / dangKyCom / luuThucDon / xoaThucDon (tests/com-trua.gs). 16:00 hôm trước chỉ là GIỜ NHẮC – quá giờ vẫn đăng ký được tới hết ngày ăn. */
/* Nhóm ngoài xưởng sản xuất báo TỔNG số suất (tài khoản vai trò NHOM) – giữ đúng mã như COM_BO_PHAN trong tests/com-trua.gs */
var COM_BO_PHAN={HNAM_BEP:'Bếp + lái xe + bảo vệ (Hà Nam)',HNAM_KTK:'Kế toán kho + tạp vụ (Hà Nam)',HNOI_MAY:'May + kế toán kho + lái xe (Hà Nội)',HNOI_MKT:'Marketing (Hà Nội)',HNOI_STORE:'Store 47 Nguyễn Tuân (Hà Nội)'};
var COM={d:null,tai:0,hen:null};
var COM_THU=['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
function comMs_(s){var p=String(s).match(/^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2}))?/);return p?Date.UTC(+p[1],+p[2]-1,+p[3],+(p[4]||0),+(p[5]||0)):0}
function comBayGio_(){return COM.d?comMs_(COM.d.bayGio)+(Date.now()-COM.tai):0}
function comNgayTen(ng){return COM_THU[new Date(comMs_(ng)).getUTCDay()]+' '+ng.slice(8)+'/'+ng.slice(5,7)}
function comConHan(t){return comMs_(t.han)>comBayGio_()}
function comConLai(t){
  var p=Math.floor((comMs_(t.han)-comBayGio_())/60000); if(p<=0)return '';
  var g=Math.floor(p/60),ph=p%60;
  return g>=24?('còn '+Math.floor(g/24)+' ngày'+(g%24?' '+g%24+' giờ':'')):(g?'còn '+g+' giờ '+ph+' phút':'còn '+ph+' phút');
}
function comHanChu(t){var h=t.han;return h.slice(11)+' '+(h.slice(0,10)===COM.d.homNay?'hôm nay':COM_THU[new Date(comMs_(h)).getUTCDay()].toLowerCase()+' '+h.slice(8,10)+'/'+h.slice(5,7))}
/* Câu nhắc giờ đăng ký: trước giờ nhắc thì đếm ngược; quá giờ vẫn cho đăng ký */
function comNhac(t){
  if(comNhom())return comConHan(t)?'Báo số suất trước <b>'+esc(comHanChu(t))+'</b> · '+esc(comConLai(t))
    :(COM.d.cuaToi[t.ngay]===undefined?'<b>Đã qua '+esc(comHanChu(t))+'</b> – nhóm chưa báo, vẫn báo được để bếp kịp chuẩn bị':'Đã qua giờ nhắc ('+esc(comHanChu(t))+') – vẫn sửa được nếu cần');
  if(comBep())return comConHan(t)?'Mọi người đăng ký trước <b>'+esc(comHanChu(t))+'</b> · '+esc(comConLai(t)):'Đã qua giờ nhắc ('+esc(comHanChu(t))+') – số suất vẫn có thể thay đổi';
  return comConHan(t)?'Đăng ký trước <b>'+esc(comHanChu(t))+'</b> · '+esc(comConLai(t))
    :(COM.d.cuaToi[t.ngay]===undefined?'<b>Đã qua '+esc(comHanChu(t))+'</b> – bạn chưa đăng ký, vẫn bấm được để bếp kịp chuẩn bị':'Đã qua giờ nhắc ('+esc(comHanChu(t))+') – vẫn đổi được nếu cần');
}
function comMon(t){return String(t.mon||'').split(/\n+/).map(function(x){return x.trim()}).filter(Boolean)}
function comTT(ng){
  if(comBep())return '';
  if(comNhom()){var so=COM.d.cuaToi[ng];return so===undefined?'<span class="cm-tt chua">Nhóm chưa báo</span>':'<span class="cm-tt '+(so?'an':'khong')+'">'+(so?'✓ Đã báo '+so+' suất':'Đã báo nhóm không ăn (0 suất)')+'</span>';}
  var v=COM.d.cuaToi[ng];
  var ho=COM.d.cuaToiHo&&COM.d.cuaToiHo[ng], hc=ho?' <span class="cm-ghi">('+esc(ho)+' đăng ký hộ)</span>':'';
  if(ho&&v!==undefined)return (v===1?'<span class="cm-tt an">✓ Đã đăng ký ăn</span>':'<span class="cm-tt khong">Báo không ăn</span>')+hc;
  return v===1?'<span class="cm-tt an">✓ Bạn đã đăng ký ăn</span>':v===0?'<span class="cm-tt khong">Bạn báo không ăn</span>':'<span class="cm-tt chua">Bạn chưa đăng ký</span>';
}
/* Tài khoản bếp không đăng ký suất: thay nút bằng số suất đã đăng ký */
function comBep(){return COM.d&&COM.d.quyen&&COM.d.quyen.dangKy===false&&!COM.d.quyen.nhom}
/* Tài khoản nhóm (vai trò NHOM): báo tổng số suất thay cho nút Ăn / Không ăn */
function comNhom(){return !!(COM.d&&COM.d.quyen&&COM.d.quyen.nhom)}
function comSoSuat(ng){
  var th=(COM.d.tongHop||[]).filter(function(x){return x.ngay===ng})[0];
  return th?'<span class="cm-tt an">🍚 '+th.an+' suất ăn</span><span class="cm-tt khong">'+th.khong+' không ăn</span><span class="cm-tt chua">'+th.chua+' chưa đăng ký</span>':'';
}
function comNut(ng,mo){
  if(comBep())return comSoSuat(ng);
  if(comNhom()){var so=COM.d.cuaToi[ng];
    return '<span class="cm-nhom"><input type="number" inputmode="numeric" min="0" max="'+(COM.d.quyen.maxSuat||300)+'" step="1" class="cm-so-in" data-ng="'+ng+'" aria-label="Số suất '+esc(comNgayTen(ng))+'" placeholder="Số suất" value="'+(so===undefined?'':so)+'" onkeydown="if(event.key===\'Enter\')comBaoNhom(\''+ng+'\',this)">'+
      '<button type="button" class="cm-nut an"'+(mo?'':' disabled')+' onclick="comBaoNhom(\''+ng+'\',this.previousElementSibling)">'+(so===undefined?'Báo suất':'Cập nhật')+'</button></span>';}
  var v=COM.d.cuaToi[ng];
  return '<button type="button" class="cm-nut an" aria-pressed="'+(v===1)+'"'+(mo?'':' disabled')+' onclick="comDangKy(\''+ng+'\',1)">🍚 Ăn</button>'+
         '<button type="button" class="cm-nut khong" aria-pressed="'+(v===0)+'"'+(mo?'':' disabled')+' onclick="comDangKy(\''+ng+'\',0)">Không ăn</button>';
}
function comTai(cb){
  if(typeof TOKEN==='undefined'||!TOKEN)return;
  var lan=COM.lan=(COM.lan||0)+1;
  clearTimeout(COM.cho); COM.cho=setTimeout(function(){ if(lan===COM.lan&&!COM.d)comLoi('Máy chủ chưa trả lời sau 30 giây.') },30000);
  google.script.run.withSuccessHandler(function(r){
    if(lan!==COM.lan)return; clearTimeout(COM.cho);
    if(r&&r.hetHan){try{hetHan()}catch(e){}return}
    if(!r||!r.ok){comLoi((r&&r.msg)||'Máy chủ trả về dữ liệu trống (có thể chưa dán bản Code.gs mới).');return}
    COM.d=r; COM.tai=Date.now(); COM.loi='';
    veComBar();
    if(typeof tabHienTai!=='undefined'&&tabHienTai==='com')veCom();
    if(cb)cb();
  }).withFailureHandler(function(e){ if(lan!==COM.lan)return; clearTimeout(COM.cho); comLoi((e&&e.message)||String(e||'Lỗi không rõ')); }).napComTrua(TOKEN);
  clearTimeout(COM.hen); COM.hen=setTimeout(function(){comTai()},5*60*1000);   // tự cập nhật 5 phút/lần (bếp vừa báo thực đơn)
}
/* Không tải được: trên trang Cơm trưa báo rõ lỗi + nút Thử lại (trước đây trang đứng mãi ở "Đang tải…") */
function comLoi(msg){
  COM.loi=msg; try{console.warn('Cơm trưa:',msg)}catch(e){}
  if(typeof tabHienTai==='undefined'||tabHienTai!=='com'||COM.d)return;
  $('main').innerHTML='<div class="ptitle">Cơm trưa</div><div class="card"><h3>Chưa tải được thực đơn</h3>'+
    '<p class="cm-ghi">'+esc(msg)+'</p><p><button class="btn pri" type="button" onclick="vCom()">Thử lại</button></p>'+
    '<p class="cm-ghi">Nếu vẫn lỗi: chủ dự án mở Apps Script, chạy hàm <b>KIEM_TRA_COM_TRUA</b> rồi gửi nội dung Nhật ký thực thi.</p></div>';
}
/* Thanh thực đơn: ngày gần nhất còn hạn đăng ký; hết hạn thì hiện thực đơn hôm nay */
function veComBar(){
  var bar=$('combar'); if(!bar||!COM.d)return;
  var d=COM.d, toi=d.thucDon.filter(function(t){return t.ngay>d.homNay})[0], nay=d.thucDon.filter(function(t){return t.ngay===d.homNay})[0];
  var t=toi||nay;
  if(!t){bar.className='hide';bar.innerHTML='';return}
  var mon=comMon(t);
  bar.className='';
  bar.innerHTML='<span class="cb-ico" aria-hidden="true">🍱</span><div class="cb-nd" onclick="go(\'com\')" title="Xem thực đơn và đăng ký">'+
    '<div class="cb-tieu">Cơm trưa '+(t.ngay===d.homNay?'hôm nay':comNgayTen(t.ngay))+'</div>'+
    '<div class="cb-mon">'+esc(mon.join(' · '))+'</div>'+
    '<div class="cb-han">'+comNhac(t)+'</div></div>'+
    '<div class="cb-nut">'+comNut(t.ngay,true)+'</div>';
}
function comDangKy(ng,an){
  call('dangKyCom',[ng,!!an],function(r){
    if(!r||!r.ok){toast((r&&r.msg)||'Không đăng ký được');comTai();return}
    toast(r.msg,true);
    COM.d.cuaToi[ng]=r.an; veComBar(); if(tabHienTai==='com')veCom();
    comTai();
  });
}
function comBaoNhom(ng,o){
  var v=String(o&&o.value||'').trim(), n=Number(v), mx=COM.d.quyen.maxSuat||300;
  if(v===''||!(n>=0)||n!==Math.floor(n)){toast('Nhập số suất (số nguyên, 0 nếu cả nhóm không ăn)');if(o)o.focus();return}
  if(n>mx){toast('Số suất tối đa '+mx);return}
  call('baoSuatNhom',[ng,n],function(r){
    if(!r||!r.ok){toast((r&&r.msg)||'Không báo được');comTai();return}
    toast(r.msg,true); COM.d.cuaToi[ng]=r.so; veComBar(); if(tabHienTai==='com')veCom(); comTai();
  });
}
function vCom(){
  $('main').innerHTML='<div class="ptitle">Cơm trưa</div><div class="pdesc">Đang tải thực đơn…</div>';
  if(COM.d)veCom();
  comTai();
}
function veCom(){
  var d=COM.d; if(!d)return;
  var sap=d.thucDon.filter(function(t){return t.ngay>=d.homNay}), qua=d.thucDon.filter(function(t){return t.ngay<d.homNay}).reverse();
  var h=comNhom()?'<div class="ptitle">Cơm trưa – '+esc(COM_BO_PHAN[ME.xuong]||ME.ten||'Nhóm')+'</div><div class="pdesc">Mỗi ngày có thực đơn, nhập <b>tổng số suất</b> của cả nhóm rồi bấm <b>Báo suất</b>, nên trước <b>'+d.gioChot+':00 hôm trước</b> để bếp chuẩn bị (quá giờ vẫn báo / sửa được tới hết ngày ăn). Cả nhóm không ăn thì nhập <b>0</b>. Tháng này nhóm đã báo <b>'+d.thang.an+'</b> suất.</div>'
   :d.quyen.khongTinh?'<div class="ptitle">Cơm trưa</div><div class="pdesc">Tài khoản '+(ME.vaiTro==='QC'?'kiểm soát chất lượng':'nhân sự')+' <b>không tính suất cơm</b> (không cần đăng ký).'+(d.quyen.sua?' Bạn vẫn báo thực đơn và xem số suất theo từng xưởng được.':'')+'</div>'
      :comBep()?'<div class="ptitle">Cơm trưa – Bếp ăn</div><div class="pdesc">Báo thực đơn ngày mai (khoảng 14–15h), xem số suất theo từng xưởng và danh sách người không ăn. Tài khoản bếp không cần đăng ký ăn và không được tính vào số suất.</div>'
   :'<div class="ptitle">Cơm trưa</div><div class="pdesc">Bếp báo thực đơn khoảng 14–15h; mọi người bấm <b>Ăn</b> hoặc <b>Không ăn</b>, nên trước <b>'+d.gioChot+':00 hôm trước</b> để bếp chuẩn bị (quá giờ vẫn đăng ký được). Tháng này bạn đã đăng ký <b>'+d.thang.an+'</b> bữa ăn, <b>'+d.thang.khong+'</b> bữa không ăn.</div>';
  h+='<div class="card"><h3>'+(comBep()?'Thực đơn đã báo':comNhom()?'Thực đơn & số suất nhóm đã báo':'Thực đơn & đăng ký của bạn')+'</h3>'+(sap.length?'<div class="cm-luoi">'+sap.map(function(t){
      return '<div class="cm-the"><h4>'+esc(t.ngay===d.homNay?'Hôm nay – '+comNgayTen(t.ngay):comNgayTen(t.ngay))+'</h4>'+
        '<div class="cm-han">'+comNhac(t)+'</div>'+
        '<ul>'+comMon(t).map(function(m){return '<li>'+esc(m)+'</li>'}).join('')+'</ul>'+(t.ghiChu?'<div class="cm-gc">📝 '+esc(t.ghiChu)+'</div>':'')+
        '<div class="cb-nut">'+comNut(t.ngay,true)+comTT(t.ngay)+'</div></div>';
    }).join('')+'</div>':'<p class="cm-ghi">Bếp chưa báo thực đơn cho ngày tới.</p>')+'</div>';
  if(d.quyen.ho&&sap.length&&d.hoNguoi&&d.hoNguoi.length)h+=comHoHtml(sap);
  if(d.quyen.sua)h+=comFormHtml(sap);
  if(d.quyen.xem)h+=comTongHopHtml();
  if(qua.length)h+='<div class="card cm-khong-in"><details><summary><b>Thực đơn những ngày trước</b></summary><ul class="cm-ds">'+qua.map(function(t){
      return '<li><span><b>'+esc(comNgayTen(t.ngay))+'</b> – '+esc(comMon(t).join(', '))+'</span>'+comTT(t.ngay)+'</li>';}).join('')+'</ul></details></div>';
  $('main').innerHTML=h;
}
/* Bếp / ban điều hành: báo thực đơn */
function comNgayMacDinh(){
  var n=new Date(comMs_(COM.d.homNay)+864e5); if(n.getUTCDay()===0)n=new Date(n.getTime()+864e5);
  return n.toISOString().slice(0,10);
}
function comFormHtml(sap){
  return '<div class="card cm-khong-in"><h3>Báo thực đơn <span>bếp hoặc ban điều hành</span></h3><div class="cm-form">'+
    '<label for="cmNgay">Ngày ăn</label><input type="date" id="cmNgay" value="'+comNgayMacDinh()+'" min="'+COM.d.homNay+'">'+
    '<label for="cmMon">Món ăn<br><small class="cm-ghi">mỗi dòng một món</small></label><textarea id="cmMon" placeholder="Cơm trắng&#10;Gà rang sả ớt&#10;Rau muống xào tỏi&#10;Canh bí đỏ&#10;Tráng miệng: chuối"></textarea>'+
    '<label for="cmGc">Ghi chú</label><input id="cmGc" placeholder="vd. Có suất chay – báo bếp">'+
    '<span></span><div><button class="btn pri" type="button" onclick="comLuu()">Lưu thực đơn</button> <span class="cm-ghi">Lưu xong mọi người thấy ngay trên thanh thực đơn; hạn đăng ký '+COM.d.gioChot+':00 hôm trước ngày ăn.</span></div></div>'+
    (sap.length?'<ul class="cm-ds">'+sap.map(function(t){return '<li><span><b>'+esc(comNgayTen(t.ngay))+'</b> – '+esc(comMon(t).join(', '))+(t.nguoi?' <span class="cm-ghi">('+esc(t.nguoi)+')</span>':'')+'</span><span style="white-space:nowrap">'+
      '<button class="btn sm" type="button" onclick="comSua(\''+t.ngay+'\')">Sửa</button> <button class="btn sm dg" type="button" onclick="comXoa(\''+t.ngay+'\')">Xóa</button></span></li>'}).join('')+'</ul>':'')+'</div>';
}
function comSua(ng){
  var t=COM.d.thucDon.filter(function(x){return x.ngay===ng})[0]; if(!t)return;
  $('cmNgay').value=ng; $('cmMon').value=t.mon; $('cmGc').value=t.ghiChu||''; $('cmMon').focus();
}
function comLuu(){
  var ng=$('cmNgay').value, mon=$('cmMon').value.trim();
  if(!ng){toast('Chọn ngày ăn');return} if(!mon){toast('Nhập ít nhất một món');$('cmMon').focus();return}
  call('luuThucDon',[ng,mon,$('cmGc').value],function(r){ if(!r||!r.ok){toast((r&&r.msg)||'Không lưu được');return} toast(r.msg,true); comTai(); });
}
function comXoa(ng){
  if(!confirm('Xóa thực đơn '+comNgayTen(ng)+'? Các lượt đăng ký của ngày này cũng bị xóa.'))return;
  call('xoaThucDon',[ng],function(r){ if(!r||!r.ok){toast((r&&r.msg)||'Không xóa được');return} toast(r.msg,true); comTai(); });
}
/* Tổng hợp số suất theo xưởng (ban điều hành, nhân sự, bếp: kèm tên; trưởng / phó phòng: tên của xưởng mình) */
function comTongHopHtml(){
  var d=COM.d;
  if(!d.tongHop.length)return '<div class="card"><h3>Tổng hợp số suất</h3><p class="cm-ghi">Chưa có thực đơn nào cho hôm nay / ngày tới.</p></div>';
  return d.tongHop.map(function(th,i){
    var t=d.thucDon.filter(function(x){return x.ngay===th.ngay})[0]||{han:th.ngay}, mo=comConHan(t);
    var coTen=th.xuong.some(function(x){return x.dsAn&&!x.nhom});
    var ten=function(ds,nhan){return ds&&ds.length?'<details><summary>'+nhan+' ('+ds.length+')</summary><p>'+esc(ds.join(', '))+'</p></details>':''};
    return '<div class="card"><h3>Tổng hợp số suất – '+esc(th.ngay===d.homNay?'hôm nay, '+comNgayTen(th.ngay):comNgayTen(th.ngay))+' <span>'+(mo?'tạm tính – nhắc đăng ký trước '+esc(comHanChu(t)):'đã qua giờ nhắc '+esc(comHanChu(t))+' – vẫn nhận đăng ký, số có thể tăng')+'</span></h3>'+
      '<div class="cm-so"><div class="an"><b>'+th.an+'</b><span>suất ăn</span></div><div class="khong"><b>'+th.khong+'</b><span>không ăn</span></div><div class="chua"><b>'+th.chua+'</b><span>chưa đăng ký</span></div>'+(th.nhomChua?'<div class="chua"><b>'+th.nhomChua+'</b><span>nhóm chưa báo suất</span></div>':'')+'</div>'+
      '<table class="cm-bang"><thead><tr><th>Xưởng</th><th class="r">Ăn</th><th class="r">Không ăn</th><th class="r">Chưa đăng ký</th>'+(coTen?'<th>Danh sách</th>':'')+'</tr></thead><tbody>'+
      th.xuong.map(function(x){
        if(x.nhom)return '<tr class="cm-nhom-dong"><td><b>'+esc(x.ten)+'</b> <span class="cm-ghi">· nhóm báo tổng</span></td><td class="r"><b>'+(x.baoChua?'–':x.an)+'</b></td><td class="r">–</td><td class="r">'+(x.baoChua?'<span class="cm-tt chua">chưa báo</span>':'–')+'</td>'+(coTen?'<td></td>':'')+'</tr>';
        return '<tr><td><b>'+esc(x.ten)+'</b></td><td class="r"><b>'+x.an+'</b></td><td class="r">'+x.khong+'</td><td class="r">'+x.chua+'</td>'+
        (coTen?'<td>'+(x.dsAn?ten(x.dsAn,'Ăn')+ten(x.dsKhong,'Không ăn')+ten(x.dsChua,'Chưa đăng ký'):'<span class="cm-ghi">–</span>')+'</td>':'')+'</tr>'}).join('')+
      '<tr class="tong"><td>Toàn nhà máy</td><td class="r">'+th.an+'</td><td class="r">'+th.khong+'</td><td class="r">'+th.chua+'</td>'+(coTen?'<td></td>':'')+'</tr></tbody></table>'+
      comMuonHtml(th)+comKhongHtml(th)+
      '<p class="cm-khong-in" style="margin-top:10px"><button class="btn sm" type="button" onclick="comChep('+i+')">📋 Chép số suất gửi bếp</button> <button class="btn sm" type="button" onclick="window.print()">🖨 In</button></p></div>';
  }).join('');
}
/* Danh sách người KHÔNG ĂN: họ tên, mã nhân viên, xưởng (ban điều hành + trợ lý: cả nhà máy; trưởng phòng: xưởng mình; bếp / nhân sự: chỉ số) */
/* Đăng ký sau giờ nhắc (để bếp biết số đã đổi sau khi báo) */
function comMuonHtml(th){
  if(!th.muon)return '';
  var ds=th.dsMuon||[];
  return '<p class="cm-muon">⏰ Sau giờ nhắc có <b>'+th.muon+'</b> lượt đăng ký / đổi (<b>'+th.muonAn+'</b> suất ăn).</p>'+
    (ds.length?'<details class="cm-muon-ds"><summary>Xem ai đăng ký muộn</summary><table class="cm-bang"><thead><tr><th>Lúc</th><th>Họ tên</th><th>Mã NV</th><th>Xưởng</th><th>Đăng ký</th></tr></thead><tbody>'+
      ds.map(function(m){return '<tr><td>'+esc(m.luc.slice(11))+' '+esc(m.luc.slice(8,10)+'/'+m.luc.slice(5,7))+'</td><td>'+esc(m.ten)+'</td><td>'+esc(m.ma||'–')+'</td><td>'+esc(m.xuong)+'</td><td>'+(m.nhom?'Nhóm báo '+m.an+' suất':m.an?'Ăn':'Không ăn')+'</td></tr>'}).join('')+'</tbody></table></details>':'');
}
function comKhongHtml(th){
  var ds=th.dsKhongCT||[]; if(!ds.length&&!th.khong)return ''; if(!ds.length&&ME.vaiTro!=='TP'&&ME.vaiTro!=='TBP')return '';   // bếp / nhân sự: chỉ số, không danh sách tên
  return '<h4 style="margin:16px 0 6px">Danh sách không ăn ('+ds.length+(ds.length<th.khong?' / '+th.khong+' – chỉ hiện xưởng của bạn':'')+')</h4>'+
    (ds.length?'<table class="cm-bang"><thead><tr><th class="r" style="width:42px">#</th><th>Họ tên</th><th>Mã NV</th><th>Xưởng</th></tr></thead><tbody>'+
      ds.map(function(c,i){return '<tr><td class="r">'+(i+1)+'</td><td>'+esc(c.ten)+'</td><td>'+esc(c.ma||'–')+'</td><td>'+esc(c.xuong)+'</td></tr>'}).join('')+'</tbody></table>':'');
}
function comChep(i){
  var th=COM.d.tongHop[i]; if(!th)return;
  var txt='Cơm trưa '+comNgayTen(th.ngay)+': '+th.an+' suất\n'+th.xuong.filter(function(x){return x.an}).map(function(x){return '- '+x.ten+': '+x.an}).join('\n')+
    (th.chua?'\n(Chưa đăng ký: '+th.chua+' người)':'')+
    (th.nhomChua?'\n(Nhóm chưa báo suất: '+th.xuong.filter(function(x){return x.baoChua}).map(function(x){return x.ten}).join(', ')+')':'');
  var xong=function(){toast('Đã chép – dán vào Zalo / tin nhắn gửi bếp',true)};
  try{ navigator.clipboard.writeText(txt).then(xong,function(){comChepCu(txt);xong()}); }catch(e){ comChepCu(txt); xong(); }
}
function comChepCu(txt){var t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(e){}t.remove()}

/* Đăng ký hộ (trưởng / phó phòng: người trong xưởng mình; ban điều hành + trợ lý: người khối văn phòng) – cho người lớn tuổi không quen điện thoại, không có mạng */
COM.hoNgay='';COM.hoTim='';COM.hoLoc='chua';
function comHoHtml(sap){
  var d=COM.d; if(!sap.some(function(t){return t.ngay===COM.hoNgay}))COM.hoNgay=(sap.filter(function(t){return t.ngay>d.homNay})[0]||sap[0]).ngay;
  return '<div class="card cm-khong-in" id="cmHo"><h3>Đăng ký hộ <span>'+(ME.vaiTro==='TP'?'người trong xưởng của bạn':ME.vaiTro==='TBP'?'người trong bộ phận của bạn':'người khối văn phòng / ban điều hành')+'</span></h3>'+
    '<p class="cm-ghi" style="margin-top:0">Dành cho người lớn tuổi không quen dùng điện thoại hoặc không có mạng. Mọi người vẫn tự đăng ký được như bình thường; người được đăng ký hộ sẽ thấy tên bạn bên cạnh lựa chọn.</p>'+
    '<div class="cm-ho-loc"><label>Ngày ăn <select id="cmHoNgay" onchange="COM.hoNgay=this.value;comHoVe()">'+sap.map(function(t){return '<option value="'+t.ngay+'"'+(t.ngay===COM.hoNgay?' selected':'')+'>'+esc(comNgayTen(t.ngay))+'</option>'}).join('')+'</select></label>'+
    '<input id="cmHoTim" type="search" placeholder="Tìm tên / mã NV" value="'+esc(COM.hoTim)+'" oninput="COM.hoTim=this.value;comHoVe()">'+
    '<span class="cm-ho-tab">'+[['chua','Chưa đăng ký'],['tat','Tất cả']].map(function(x){return '<button type="button" class="btn sm'+(COM.hoLoc===x[0]?' pri':'')+'" onclick="COM.hoLoc=\''+x[0]+'\';comHoVe(1)">'+x[1]+'</button>'}).join(' ')+'</span></div>'+
    '<div id="cmHoDs">'+comHoDs()+'</div></div>';
}
function comHoVe(tab){ if(tab){var c=$('cmHo');if(c)c.outerHTML=comHoHtml(COM.d.thucDon.filter(function(t){return t.ngay>=COM.d.homNay}));return} var b=$('cmHoDs'); if(b)b.innerHTML=comHoDs(); }
function comHoDs(){
  var d=COM.d,dk=(d.hoDK&&d.hoDK[COM.hoNgay])||{},q=String(COM.hoTim||'').trim().toLowerCase();
  var ds=d.hoNguoi.filter(function(p){return (COM.hoLoc==='tat'||!dk[p.tk])&&(!q||(p.ten+' '+p.ma).toLowerCase().indexOf(q)>=0)});
  var chua=d.hoNguoi.filter(function(p){return !dk[p.tk]});
  var h='<p class="cm-ghi">'+chua.length+' / '+d.hoNguoi.length+' người chưa đăng ký '+esc(comNgayTen(COM.hoNgay))+'.'+
    (chua.length?' <button type="button" class="btn sm" onclick="comHoTatCa()">🍚 Đăng ký ăn cho tất cả '+chua.length+' người chưa đăng ký</button>':'')+'</p>';
  if(!ds.length)return h+'<p class="cm-ghi">'+(COM.hoLoc==='chua'?'Mọi người đã đăng ký.':'Không có ai khớp.')+'</p>';
  return h+'<ul class="cm-ds cm-ho-ds">'+ds.slice(0,300).map(function(p){var x=dk[p.tk],v=x?x[0]:undefined;
    return '<li><span><b>'+esc(p.ten)+'</b> <span class="cm-ghi">'+esc(p.ma||'')+(ME.vaiTro!=='TP'&&ME.vaiTro!=='TBP'?' · '+esc(p.xuong):'')+'</span>'+
      (x?' '+(v?'<span class="cm-tt an">Ăn</span>':'<span class="cm-tt khong">Không ăn</span>')+(x[1]?' <span class="cm-ghi">(hộ: '+esc(x[1])+')</span>':' <span class="cm-ghi">(tự đăng ký)</span>'):'')+'</span>'+
      '<span class="cb-nut"><button type="button" class="cm-nut an" aria-pressed="'+(v===1)+'" onclick="comHoDK([\''+p.tk+'\'],1)">🍚 Ăn</button>'+
      '<button type="button" class="cm-nut khong" aria-pressed="'+(v===0)+'" onclick="comHoDK([\''+p.tk+'\'],0)">Không ăn</button></span></li>'}).join('')+'</ul>';
}
function comHoDK(ds,an,xong){
  call('dangKyComHo',[COM.hoNgay,ds,!!an],function(r){
    if(!r||!r.ok){toast((r&&r.msg)||'Không đăng ký được');return}
    toast(r.msg,true); var o=COM.d.hoDK[COM.hoNgay]||(COM.d.hoDK[COM.hoNgay]={});
    ds.forEach(function(t){o[t]=[r.an,ME.ten||'bạn']}); comHoVe(); if(xong)xong(); comTai();
  });
}
function comHoTatCa(){
  var dk=COM.d.hoDK[COM.hoNgay]||{},ds=COM.d.hoNguoi.filter(function(p){return !dk[p.tk]}).map(function(p){return p.tk});
  if(!ds.length)return; if(!confirm('Đăng ký ĂN trưa '+comNgayTen(COM.hoNgay)+' cho '+ds.length+' người chưa đăng ký?'))return;
  comHoDK(ds,1);
}

/* ===== Chế độ CHỈ XEM (chủ dự án 11/10) =====
   Trợ lý ban điều hành (TL): Điểm danh, Công đoạn, Nhân sự, Máy móc chỉ xem. Nhân sự (HR): như trợ lý, riêng Hồ sơ nhân sự sửa được.
   Trang được vẽ như ban điều hành (thấy toàn nhà máy), rồi ẩn / khóa mọi nút sửa; máy chủ vẫn từ chối mọi thao tác sửa của TL. */
var CHI_XEM_TAB={TL:{dd:1,cd:1,ns:1,mm:1},HR:{dd:1,cd:1,mm:1}};
var CHI_XEM_VAI='';
function chiXemTab(k){var m=CHI_XEM_TAB[CHI_XEM_VAI||ME.vaiTro];return !!(m&&m[k])}
var CX_NUT=/(thanh lý|báo chạy|báo hỏng|lưu|thêm|xóa|xoá|sửa|ngừng|duyệt|gửi|chốt|xác nhận|khôi phục|cập nhật|bảo trì|đổi|hủy|huỷ|từ chối|kích hoạt|ghi|có mặt|vắng|nghỉ|import|nhập|tạo|gán|chuyển|đánh dấu|phạt|miễn|sửa chữa|hoạt động|đề xuất|tải lên)/i;
function chiXemDon(){
  var m=$('main'); if(!m||!chiXemTab(tabHienTai))return;
  if(!m.querySelector('.cx-bao')){var b=document.createElement('div');b.className='alert a-nu cx-bao';b.innerHTML='👁 <b>Chế độ chỉ xem</b> – tài khoản của bạn xem được số liệu nhưng không sửa được ở trang này.';
    var t=m.querySelector('.pdesc')||m.querySelector('.ptitle'); if(t&&t.parentNode===m)t.insertAdjacentElement('afterend',b); else m.insertBefore(b,m.firstChild);}
  Array.prototype.forEach.call(m.querySelectorAll('.card'),function(c){var h=c.querySelector('h3');if(h&&/^\s*(Thêm|Tạo|Nhập|Gửi|Đề xuất|Khai báo|Ghi|Import|Sửa)/i.test(h.textContent))c.style.display='none'});
  Array.prototype.forEach.call(m.querySelectorAll('button'),function(b){ var oc=b.getAttribute('onclick')||''; if(CX_NUT.test(b.textContent)||/^\s*[✎✕×🗑→]/.test(b.textContent)||/^(edKN|thanhLy|doiKieu|sua|xoa|luu|them|ngung|duyet)/i.test(oc)||/^\s*Công đoạn\s*$/.test(b.textContent)){b.style.display='none'} });
  Array.prototype.forEach.call(m.querySelectorAll('table input,table select,table textarea,[contenteditable="true"]'),function(e){e.disabled=true;e.removeAttribute('contenteditable')});
}
(function(){
  if(typeof go!=='function'||typeof call!=='function')return;
  var goCu=go, callCu=call, theo=null, hen=0;
  go=function(k){
    var cx=chiXemTab(k), vt=ME.vaiTro;
    if(cx){CHI_XEM_VAI=vt; ME.vaiTro='ADMIN';}            // vẽ như ban điều hành để thấy toàn nhà máy
    try{ return goCu.apply(this,arguments); }
    finally{
      if(cx){ME.vaiTro=vt; CHI_XEM_VAI=''; chiXemDon();
        if(!theo&&window.MutationObserver){theo=new MutationObserver(function(){clearTimeout(hen);hen=setTimeout(chiXemDon,30)});theo.observe($('main'),{childList:true,subtree:true})}}
    }
  };
  call=function(fn){
    if(chiXemTab(tabHienTai)&&!laHamDoc_(fn)){ try{toast('Tài khoản của bạn chỉ được xem trang này, không sửa được.')}catch(e){} return; }
    return callCu.apply(this,arguments);
  };
})();
