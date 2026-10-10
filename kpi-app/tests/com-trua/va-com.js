/* Mục 16: CƠM TRƯA – thanh thực đơn (#combar) trên mọi trang của mọi tài khoản + trang "Cơm trưa".
   Máy chủ: napComTrua / dangKyCom / luuThucDon / xoaThucDon (tests/com-trua.gs). 16:00 hôm trước chỉ là GIỜ NHẮC – quá giờ vẫn đăng ký được tới hết ngày ăn. */
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
  if(comBep())return comConHan(t)?'Mọi người đăng ký trước <b>'+esc(comHanChu(t))+'</b> · '+esc(comConLai(t)):'Đã qua giờ nhắc ('+esc(comHanChu(t))+') – số suất vẫn có thể thay đổi';
  return comConHan(t)?'Đăng ký trước <b>'+esc(comHanChu(t))+'</b> · '+esc(comConLai(t))
    :(COM.d.cuaToi[t.ngay]===undefined?'<b>Đã qua '+esc(comHanChu(t))+'</b> – bạn chưa đăng ký, vẫn bấm được để bếp kịp chuẩn bị':'Đã qua giờ nhắc ('+esc(comHanChu(t))+') – vẫn đổi được nếu cần');
}
function comMon(t){return String(t.mon||'').split(/\n+/).map(function(x){return x.trim()}).filter(Boolean)}
function comTT(ng){
  if(comBep())return '';
  var v=COM.d.cuaToi[ng];
  return v===1?'<span class="cm-tt an">✓ Bạn đã đăng ký ăn</span>':v===0?'<span class="cm-tt khong">Bạn báo không ăn</span>':'<span class="cm-tt chua">Bạn chưa đăng ký</span>';
}
/* Tài khoản bếp không đăng ký suất: thay nút bằng số suất đã đăng ký */
function comBep(){return COM.d&&COM.d.quyen&&COM.d.quyen.dangKy===false}
function comSoSuat(ng){
  var th=(COM.d.tongHop||[]).filter(function(x){return x.ngay===ng})[0];
  return th?'<span class="cm-tt an">🍚 '+th.an+' suất ăn</span><span class="cm-tt khong">'+th.khong+' không ăn</span><span class="cm-tt chua">'+th.chua+' chưa đăng ký</span>':'';
}
function comNut(ng,mo){
  if(comBep())return comSoSuat(ng);
  var v=COM.d.cuaToi[ng];
  return '<button type="button" class="cm-nut an" aria-pressed="'+(v===1)+'"'+(mo?'':' disabled')+' onclick="comDangKy(\''+ng+'\',1)">🍚 Ăn</button>'+
         '<button type="button" class="cm-nut khong" aria-pressed="'+(v===0)+'"'+(mo?'':' disabled')+' onclick="comDangKy(\''+ng+'\',0)">Không ăn</button>';
}
function comTai(cb){
  if(typeof TOKEN==='undefined'||!TOKEN)return;
  google.script.run.withSuccessHandler(function(r){
    if(r&&r.hetHan){try{hetHan()}catch(e){}return}
    if(!r||!r.ok)return;
    COM.d=r; COM.tai=Date.now();
    veComBar();
    if(typeof tabHienTai!=='undefined'&&tabHienTai==='com')veCom();
    if(cb)cb();
  }).withFailureHandler(function(){}).napComTrua(TOKEN);
  clearTimeout(COM.hen); COM.hen=setTimeout(function(){comTai()},5*60*1000);   // tự cập nhật 5 phút/lần (bếp vừa báo thực đơn)
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
function vCom(){
  $('main').innerHTML='<div class="ptitle">Cơm trưa</div><div class="pdesc">Đang tải thực đơn…</div>';
  if(COM.d)veCom();
  comTai();
}
function veCom(){
  var d=COM.d; if(!d)return;
  var sap=d.thucDon.filter(function(t){return t.ngay>=d.homNay}), qua=d.thucDon.filter(function(t){return t.ngay<d.homNay}).reverse();
  var h=comBep()?'<div class="ptitle">Cơm trưa – Bếp ăn</div><div class="pdesc">Báo thực đơn ngày mai (khoảng 14–15h), xem số suất theo từng xưởng và danh sách người không ăn. Tài khoản bếp không cần đăng ký ăn và không được tính vào số suất.</div>'
   :'<div class="ptitle">Cơm trưa</div><div class="pdesc">Bếp báo thực đơn khoảng 14–15h; mọi người bấm <b>Ăn</b> hoặc <b>Không ăn</b>, nên trước <b>'+d.gioChot+':00 hôm trước</b> để bếp chuẩn bị (quá giờ vẫn đăng ký được). Tháng này bạn đã đăng ký <b>'+d.thang.an+'</b> bữa ăn, <b>'+d.thang.khong+'</b> bữa không ăn.</div>';
  h+='<div class="card"><h3>'+(comBep()?'Thực đơn đã báo':'Thực đơn & đăng ký của bạn')+'</h3>'+(sap.length?'<div class="cm-luoi">'+sap.map(function(t){
      return '<div class="cm-the"><h4>'+esc(t.ngay===d.homNay?'Hôm nay – '+comNgayTen(t.ngay):comNgayTen(t.ngay))+'</h4>'+
        '<div class="cm-han">'+comNhac(t)+'</div>'+
        '<ul>'+comMon(t).map(function(m){return '<li>'+esc(m)+'</li>'}).join('')+'</ul>'+(t.ghiChu?'<div class="cm-gc">📝 '+esc(t.ghiChu)+'</div>':'')+
        '<div class="cb-nut">'+comNut(t.ngay,true)+comTT(t.ngay)+'</div></div>';
    }).join('')+'</div>':'<p class="cm-ghi">Bếp chưa báo thực đơn cho ngày tới.</p>')+'</div>';
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
    var ten=function(ds,nhan){return ds&&ds.length?'<details><summary>'+nhan+' ('+ds.length+')</summary><p>'+esc(ds.join(', '))+'</p></details>':''};
    return '<div class="card"><h3>Tổng hợp số suất – '+esc(th.ngay===d.homNay?'hôm nay, '+comNgayTen(th.ngay):comNgayTen(th.ngay))+' <span>'+(mo?'tạm tính – nhắc đăng ký trước '+esc(comHanChu(t)):'đã qua giờ nhắc '+esc(comHanChu(t))+' – vẫn nhận đăng ký, số có thể tăng')+'</span></h3>'+
      '<div class="cm-so"><div class="an"><b>'+th.an+'</b><span>suất ăn</span></div><div class="khong"><b>'+th.khong+'</b><span>không ăn</span></div><div class="chua"><b>'+th.chua+'</b><span>chưa đăng ký</span></div></div>'+
      '<table class="cm-bang"><thead><tr><th>Xưởng</th><th class="r">Ăn</th><th class="r">Không ăn</th><th class="r">Chưa đăng ký</th><th>Danh sách</th></tr></thead><tbody>'+
      th.xuong.map(function(x){return '<tr><td><b>'+esc(x.ten)+'</b></td><td class="r"><b>'+x.an+'</b></td><td class="r">'+x.khong+'</td><td class="r">'+x.chua+'</td><td>'+
        (x.dsAn?ten(x.dsAn,'Ăn')+ten(x.dsKhong,'Không ăn')+ten(x.dsChua,'Chưa đăng ký'):'<span class="cm-ghi">–</span>')+'</td></tr>'}).join('')+
      '<tr class="tong"><td>Toàn nhà máy</td><td class="r">'+th.an+'</td><td class="r">'+th.khong+'</td><td class="r">'+th.chua+'</td><td></td></tr></tbody></table>'+
      comMuonHtml(th)+comKhongHtml(th)+
      '<p class="cm-khong-in" style="margin-top:10px"><button class="btn sm" type="button" onclick="comChep('+i+')">📋 Chép số suất gửi bếp</button> <button class="btn sm" type="button" onclick="window.print()">🖨 In</button></p></div>';
  }).join('');
}
/* Danh sách người KHÔNG ĂN: họ tên, mã nhân viên, xưởng (ban điều hành / nhân sự / bếp: cả nhà máy; trưởng phòng: xưởng mình) */
/* Đăng ký sau giờ nhắc (để bếp biết số đã đổi sau khi báo) */
function comMuonHtml(th){
  if(!th.muon)return '';
  var ds=th.dsMuon||[];
  return '<p class="cm-muon">⏰ Sau giờ nhắc có <b>'+th.muon+'</b> người đăng ký / đổi (<b>'+th.muonAn+'</b> ăn).</p>'+
    (ds.length?'<details class="cm-muon-ds"><summary>Xem ai đăng ký muộn</summary><table class="cm-bang"><thead><tr><th>Lúc</th><th>Họ tên</th><th>Mã NV</th><th>Xưởng</th><th>Đăng ký</th></tr></thead><tbody>'+
      ds.map(function(m){return '<tr><td>'+esc(m.luc.slice(11))+' '+esc(m.luc.slice(8,10)+'/'+m.luc.slice(5,7))+'</td><td>'+esc(m.ten)+'</td><td>'+esc(m.ma||'–')+'</td><td>'+esc(m.xuong)+'</td><td>'+(m.an?'Ăn':'Không ăn')+'</td></tr>'}).join('')+'</tbody></table></details>':'');
}
function comKhongHtml(th){
  var ds=th.dsKhongCT||[]; if(!ds.length&&!th.khong)return '';
  return '<h4 style="margin:16px 0 6px">Danh sách không ăn ('+ds.length+(ds.length<th.khong?' / '+th.khong+' – chỉ hiện xưởng của bạn':'')+')</h4>'+
    (ds.length?'<table class="cm-bang"><thead><tr><th class="r" style="width:42px">#</th><th>Họ tên</th><th>Mã NV</th><th>Xưởng</th></tr></thead><tbody>'+
      ds.map(function(c,i){return '<tr><td class="r">'+(i+1)+'</td><td>'+esc(c.ten)+'</td><td>'+esc(c.ma||'–')+'</td><td>'+esc(c.xuong)+'</td></tr>'}).join('')+'</tbody></table>':'');
}
function comChep(i){
  var th=COM.d.tongHop[i]; if(!th)return;
  var txt='Cơm trưa '+comNgayTen(th.ngay)+': '+th.an+' suất\n'+th.xuong.filter(function(x){return x.an}).map(function(x){return '- '+x.ten+': '+x.an}).join('\n')+
    (th.chua?'\n(Chưa đăng ký: '+th.chua+' người)':'');
  var xong=function(){toast('Đã chép – dán vào Zalo / tin nhắn gửi bếp',true)};
  try{ navigator.clipboard.writeText(txt).then(xong,function(){comChepCu(txt);xong()}); }catch(e){ comChepCu(txt); xong(); }
}
function comChepCu(txt){var t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(e){}t.remove()}
