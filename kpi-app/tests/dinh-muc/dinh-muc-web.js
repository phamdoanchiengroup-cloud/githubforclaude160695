function vPTDM(){
  var h='<div class="ptitle">Phân tích định mức</div>'+
    '<div class="pdesc">Đánh giá định mức theo hiệu suất trung vị (người ở giữa) và gợi ý nâng định mức lỏng về mốc 85%</div>';
  h+='<div class="alert a-nu">Định mức hợp lý khi <b>hiệu suất trung vị</b> quanh mốc <b>85%</b> (±3 điểm). '+
    'Trên mốc là định mức <b>lỏng</b> → gợi ý <b>nâng</b>. Dưới mốc <b>không gợi ý hạ</b> — thường do người mới đang đào tạo, chưa lên tay. '+
    'Đổi định mức là áp cho <b>cả tháng đang làm</b>: toàn bộ sản lượng tháng này tính lại theo định mức mới, các tháng trước giữ nguyên.</div>';

  // Bộ chọn kỳ
  if(!ptdmKy.giaTri){var d=new Date(); ptdmKy.giaTri=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2);}
  h+='<div class="card" style="padding:12px 14px"><div class="row" style="gap:10px;align-items:end;flex-wrap:wrap">'+
     '<div><label>Xem theo</label><select id="ptdm_kieu" onchange="ptdmDoiKieu()">'+
       '<option value="thang"'+(ptdmKy.kieu==='thang'?' selected':'')+'>Tháng</option>'+
       '<option value="quy"'+(ptdmKy.kieu==='quy'?' selected':'')+'>Quý</option></select></div>'+
     '<div><label>Kỳ</label><select id="ptdm_giatri" onchange="ptdmDoiGiaTri()">'+ptdmOptKy()+'</select></div>'+
     '<button class="btn pri" onclick="ptdmChay()">Phân tích</button>'+
     '</div></div>';
  h+='<div id="ptdm_kq" style="margin-top:14px"><div class="pdesc">Bấm "Phân tích" để xem kết quả.</div></div>';
  $('main').innerHTML=h;
}
function ptdmOptKy(){
  var now=new Date(), y=now.getFullYear(), out='';
  if(ptdmKy.kieu==='thang'){
    for(var i=0;i<12;i++){
      var d=new Date(y, now.getMonth()-i, 1);
      var v=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2);
      out+='<option value="'+v+'"'+(v===ptdmKy.giaTri?' selected':'')+'>Tháng '+(d.getMonth()+1)+'/'+d.getFullYear()+'</option>';
    }
  }else{
    var curQ=Math.floor(now.getMonth()/3)+1;
    for(var j=0;j<6;j++){
      var q=curQ-j, yy=y; while(q<1){q+=4;yy--;}
      var v2=yy+'-Q'+q;
      out+='<option value="'+v2+'"'+(v2===ptdmKy.giaTri?' selected':'')+'>Quý '+q+'/'+yy+'</option>';
    }
  }
  return out;
}
function ptdmDoiKieu(){
  ptdmKy.kieu=$('ptdm_kieu').value;
  var now=new Date();
  ptdmKy.giaTri = ptdmKy.kieu==='thang'
    ? now.getFullYear()+'-'+('0'+(now.getMonth()+1)).slice(-2)
    : now.getFullYear()+'-Q'+(Math.floor(now.getMonth()/3)+1);
  $('ptdm_giatri').innerHTML=ptdmOptKy();
}
function ptdmDoiGiaTri(){ ptdmKy.giaTri=$('ptdm_giatri').value; }

var ptdmKq=null;      // kết quả phân tích gần nhất (apTu, daChot, ds) – lọc xưởng không phải chạy lại máy chủ
var ptdmLoc='goiy';   // 'goiy' = chỉ công đoạn có gợi ý / cần xem; 'tatca'
/* Câu nhắc khi đổi định mức: áp cả tháng; tháng đã chốt thì nhắc Chốt bù (chủ dự án 21/10) */
function ptdmNhacAp(){
  var tu=(ptdmKq&&ptdmKq.apTu)||'', th=tu?(+tu.slice(5,7))+'/'+tu.slice(0,4):'này';
  return 'Định mức mới áp cho CẢ THÁNG '+th+': toàn bộ sản lượng tháng '+th+' tính lại theo định mức mới (các tháng trước giữ nguyên).'+
    (ptdmKq&&ptdmKq.daChot?'\nTháng này đã chốt KPI → sửa xong vào Bảng KPI bấm "Chốt bù tháng này" để bảng đã chốt tính lại.':'');
}

/* Ban điều hành sửa định mức ngay tại bảng phân tích */
function ptdmSua(maCD, tenCD, dinhMucCu){
  var e=$('dm_'+maCD); if(!e)return;
  var moi=Number(e.value);
  if(!isFinite(moi)||moi<=0){toast('Nhập định mức hợp lệ');return}
  if(moi===Number(dinhMucCu)){toast('Định mức mới trùng định mức cũ');return}
  var lyDo=prompt('Sửa định mức "'+tenCD+'": '+dinhMucCu+' → '+moi+'\nLý do (có thể bỏ trống):','Theo phân tích định mức – về mốc 85%');
  if(lyDo===null)return;
  if(!confirm('Áp dụng định mức mới '+moi+' cho "'+tenCD+'"?\n'+ptdmNhacAp()+
    '\n\nLưu ý: gợi ý được tính chung cho các công đoạn làm cùng ngày – sửa lẻ một dòng thì hiệu suất dự kiến có thể lệch, nên dùng "Áp dụng các dòng đã chọn".'))return;
  call('banDieuHanhSuaDinhMuc',[maCD,moi,lyDo],function(r){
    toast(r.msg,r.ok);
    if(r.ok)reload(function(){ptdmChay();});   // tải lại + phân tích lại để thấy thay đổi
  });
}
function ptdmChay(){
  var box=$('ptdm_kq'); if(box)box.innerHTML='<div class="pdesc">Đang phân tích…</div>';
  call('phanTichDinhMuc',[ptdmKy.kieu, ptdmKy.giaTri],function(r){
    if(!r||!r.ok){ if(box)box.innerHTML='<div class="alert a-bd">'+esc((r&&r.msg)||'Lỗi phân tích')+'</div>'; return; }
    ptdmVe(r);
  });
}
function ptdmVe(r){
  var box=$('ptdm_kq'); if(!box)return;
  if(r) ptdmKq=r;
  var dsAll=(ptdmKq&&ptdmKq.ds)||[];
  var h='';
  if(!dsAll.length){
    box.innerHTML='<div class="alert a-wn">Kỳ này chưa có dữ liệu sản lượng đã chốt để phân tích.</div>';
    return;
  }
  // Lọc theo xưởng + chỉ công đoạn có gợi ý (phía trình duyệt, không chạy lại phân tích)
  var optX='<option value=""'+(ptdmXuong===''?' selected':'')+'>Tất cả xưởng</option>';
  (D.phongban||[]).forEach(function(p){optX+='<option value="'+esc(p.MaXuong)+'"'+(ptdmXuong===p.MaXuong?' selected':'')+'>'+esc(p.TenXuong)+'</option>';});
  h+='<div class="card" style="padding:10px 14px;margin-bottom:12px"><div class="row" style="gap:10px;align-items:end;flex-wrap:wrap">'+
    '<div><label>Xưởng</label><select onchange="ptdmXuong=this.value;ptdmVe(null)">'+optX+'</select></div>'+
    '<div><label>Hiện</label><select id="ptdm_loc" onchange="ptdmLoc=this.value;ptdmVe(null)">'+
      '<option value="goiy"'+(ptdmLoc==='goiy'?' selected':'')+'>Công đoạn có gợi ý / cần xem</option>'+
      '<option value="tatca"'+(ptdmLoc==='tatca'?' selected':'')+'>Tất cả công đoạn</option></select></div></div></div>';
  var dsX=ptdmXuong?dsAll.filter(function(x){return (x.maXuong||'')===ptdmXuong}):dsAll;
  if(!dsX.length){ box.innerHTML=h+'<div class="alert a-wn">Xưởng này chưa có dữ liệu để phân tích.</div>'; return; }

  var coGY=dsX.filter(function(x){return x.dmGoiY>0});
  var phu=dsX.filter(function(x){return x.phuThuoc}).length;
  var tu=ptdmKq.apTu||'', th=tu?(+tu.slice(5,7))+'/'+tu.slice(0,4):'';
  if(coGY.length){
    h+='<div class="alert a-bd"><b>'+coGY.length+' công đoạn nên nâng định mức</b> để về mốc 85%.'+
       (phu?' '+phu+' công đoạn phụ để nguyên (hiệu suất do công đoạn chính cùng ngày quyết định).':'')+
       '<br>Các gợi ý được tính <b>chung</b> (người làm nhiều công đoạn trong ngày) — nên áp <b>cùng lúc</b> bằng nút "Áp dụng các dòng đã chọn" thì phân tích lại mới về quanh 85%.</div>';
  }else{
    h+='<div class="alert a-ok">Không có công đoạn nào lỏng hơn mốc 85% — không cần nâng định mức.</div>';
  }
  if(th) h+='<div class="alert '+(ptdmKq.daChot?'a-wn':'a-nu')+'">Đổi định mức lúc này sẽ áp cho <b>cả tháng '+th+'</b> (từ ngày 1). '+
    (ptdmKq.daChot?'Tháng '+th+' <b>đã chốt KPI</b> → sửa xong vào Bảng KPI bấm <b>"Chốt bù tháng này"</b> để bảng đã chốt tính lại.':'KPI tháng '+th+' tự tính lại theo định mức mới.')+'</div>';

  var ds=ptdmLoc==='tatca'?dsX:dsX.filter(function(x){return x.dmGoiY>0||x.phuThuoc||x.nhan==='do'||x.nhan==='vang'});
  var tenXuong={}; (D.phongban||[]).forEach(function(p){tenXuong[p.MaXuong]=p.TenXuong;});
  var thuTuX=[], theoX={};
  ds.forEach(function(x){
    var k=x.maXuong||'(không rõ)';
    if(!theoX[k]){theoX[k]=[];thuTuX.push(k);}
    theoX[k].push(x);
  });

  var nhanInfo={
    do:  {pill:'p-bd', chu:'Lỏng rõ (>110%)'},
    vang:{pill:'p-wn', chu:'Hơi lỏng (95–110%)'},
    nhe: {pill:'p-nu', chu:'Nhỉnh hơn mốc'},
    sat: {pill:'p-ok', chu:'Sát mốc 85%'},
    chat:{pill:'p-gr', chu:'Dưới mốc — giữ'}
  };
  var laAdmin=ME.vaiTro==='ADMIN';
  var hangCD=function(x){
    var info=nhanInfo[x.nhan]||nhanInfo.sat;
    var gy='', ghi=[];
    if(x.dmGoiY>0){
      var dau=x.chinh>0?'+':'';
      gy='<b>'+x.dmGoiY+'</b> <span style="color:var(--ink3);font-size:12px">('+dau+x.chinh+'%)</span>'+
         '<div style="font-size:12px;color:var(--ink2)">dự kiến '+f(x.trungViSau,1)+'%</div>';
      if(x.nhan==='sat') ghi.push('chỉnh nhẹ vì công đoạn làm cùng ngày đổi');
    }else if(x.phuThuoc){
      gy='<span style="color:var(--ink3)">để nguyên</span>';
      ghi.push('công đoạn phụ — hiệu suất do công đoạn chính cùng ngày quyết định');
    }else{
      gy='<span style="color:var(--ink3)">giữ '+x.dinhMuc+'</span>'+
         (Math.abs(x.trungViSau-x.trungVi)>=0.5?'<div style="font-size:12px;color:var(--ink2)">dự kiến '+f(x.trungViSau,1)+'%</div>':'');
    }
    if(x.nhan==='chat'&&!(x.dmGoiY>0)) ghi.push('không hạ định mức — có thể người mới đang đào tạo');
    if(x.itNguoi) ghi.push('ít người có dữ liệu — cân nhắc');
    if(Math.abs((x.trungViKy||0)-x.trungVi)>=0.5) ghi.push('KPI tháng đang tính '+f(x.trungViKy,1)+'% (định mức cũ còn áp vài ngày)');
    var cb = laAdmin && x.dmGoiY>0
      ? '<input type="checkbox" class="ptdm-ck" data-macd="'+esc(x.maCD)+'" checked onchange="ptdmDemChon()">'
      : '';
    return '<tr><td style="text-align:center;width:34px">'+cb+'</td>'+
       '<td>'+esc(x.tenCD)+(ghi.length?'<div style="font-size:12px;color:var(--ink3)">'+esc(ghi.join(' · '))+'</div>':'')+'</td>'+
       '<td class="n">'+x.dinhMuc+'</td>'+
       '<td class="n">'+x.soCoData+'</td>'+
       '<td class="n" style="font-weight:600">'+f(x.trungVi)+'%</td>'+
       '<td><span class="pill '+info.pill+'">'+info.chu+'</span></td>'+
       '<td class="n">'+gy+'</td>'+
       (laAdmin?'<td><div style="display:flex;gap:6px;align-items:center">'+
         '<input type="number" id="dm_'+esc(x.maCD)+'" value="'+(x.dmGoiY>0?x.dmGoiY:x.dinhMuc)+'" min="0" step="any" '+
           'style="width:80px;padding:5px 7px;text-align:right">'+
         '<button class="btn sm" onclick="ptdmSua(\''+esc(x.maCD)+'\',\''+esc(x.tenCD).replace(/'/g,"\\'")+'\','+x.dinhMuc+')">Sửa</button>'+
       '</div></td>':'')+'</tr>';
  };

  if(!ds.length) h+='<div class="alert a-ok">Không có công đoạn nào cần xem ở bộ lọc này. Chọn "Tất cả công đoạn" để xem hết.</div>';
  thuTuX.forEach(function(k){
    var arr=theoX[k];
    h+='<div style="margin-top:16px"><h3 style="display:flex;align-items:center;gap:8px;font-size:14px">'+
       '<span style="width:6px;height:6px;border-radius:50%;background:var(--cyan);box-shadow:0 0 8px var(--cyan)"></span>'+
       esc(tenXuong[k]||k)+' <span style="color:var(--ink3);font-weight:400;font-size:12px">('+arr.length+' công đoạn)</span></h3>'+
       '<table><thead><tr><th style="width:34px"></th><th>Công đoạn</th><th class="n">Định mức</th>'+
       '<th class="n">Số người có SL</th><th class="n">Hiệu suất trung vị</th>'+
       '<th>Đánh giá</th><th class="n">Gợi ý định mức</th>'+(laAdmin?'<th>Sửa định mức</th>':'')+'</tr></thead><tbody>'+
       arr.map(hangCD).join('')+
       '</tbody></table></div>';
  });

  h+='<div class="pdesc" style="margin-top:10px"><b>Cách đọc:</b> "Hiệu suất trung vị" là mức người ở giữa đạt được — '+
     'không bị lệch bởi vài người xuất sắc. Mốc lý tưởng 85% (±3 điểm). '+
     '"Gợi ý định mức" là định mức mới để trung vị về quanh 85%; "dự kiến" là hiệu suất trung vị sau khi áp <b>tất cả</b> gợi ý. '+
     'Giờ có mặt trong ngày được chia cho các công đoạn người đó làm, nên công đoạn làm cùng ngày ảnh hưởng lẫn nhau — vì vậy gợi ý được tính chung. '+
     'Công đoạn dưới mốc không gợi ý hạ (thường do người mới chưa lên tay); muốn xem thì chọn "Tất cả công đoạn". '+
     'Công đoạn ít người (dưới 3) thì trung vị kém tin — vẫn chọn sẵn vì bỏ đi sẽ làm lệch các công đoạn làm cùng ngày; có thể sửa tay ô định mức. '+
     'Đổi định mức áp cho <b>cả tháng đang làm</b>; tháng đã chốt thì sửa xong bấm "Chốt bù tháng này" ở Bảng KPI.</div>';

  if(laAdmin && coGY.length){
    h+='<div id="ptdmBar" style="position:sticky;bottom:0;margin-top:14px;padding:12px 14px;'+
      'background:var(--panel);border:1px solid var(--line);border-radius:10px;'+
      'display:flex;align-items:center;gap:12px;flex-wrap:wrap;box-shadow:0 -4px 14px rgba(0,0,0,.25)">'+
      '<span style="font-weight:600">Sửa hàng loạt</span>'+
      '<span id="ptdmDem" style="color:var(--ink2);font-size:13px"></span>'+
      '<span style="flex:1"></span>'+
      '<button class="btn sm" onclick="ptdmChonTatCa(true)">Chọn tất cả</button>'+
      '<button class="btn sm" onclick="ptdmChonTatCa(false)">Bỏ chọn</button>'+
      '<button class="btn" onclick="ptdmSuaNhieu()">Áp dụng các dòng đã chọn →</button>'+
    '</div>';
  }
  box.innerHTML=h;
  ptdmDemChon();
}
function ptdmDemChon(){
  var e=$('ptdmDem'); if(!e)return;
  var n=document.querySelectorAll('.ptdm-ck:checked').length;
  e.textContent = n>0 ? (n+' công đoạn đã chọn') : 'Chưa chọn dòng nào';
}
function ptdmChonTatCa(v){
  var cks=document.querySelectorAll('.ptdm-ck');
  for(var i=0;i<cks.length;i++) cks[i].checked=v;
  ptdmDemChon();
}
function ptdmSuaNhieu(){
  var cks=document.querySelectorAll('.ptdm-ck:checked');
  if(!cks.length){ toast('Chưa chọn dòng nào'); return; }
  var ds=[], loi=[];
  for(var i=0;i<cks.length;i++){
    var maCD=cks[i].getAttribute('data-macd');
    var inp=$('dm_'+maCD);
    var v=inp?Number(inp.value):NaN;
    if(!isFinite(v)||v<=0){ loi.push(maCD); continue; }
    ds.push({maCD:maCD, dinhMucMoi:v});
  }
  if(!ds.length){ toast('Không có định mức hợp lệ để sửa'); return; }
  if(loi.length){ if(!confirm(loi.length+' dòng có định mức không hợp lệ sẽ bị bỏ qua. Tiếp tục?')) return; }
  var lyDo=prompt('Lý do sửa '+ds.length+' định mức (áp dụng chung, có thể bỏ trống):','Điều chỉnh theo phân tích định mức – về mốc 85%');
  if(lyDo===null) return;
  if(!confirm('Áp dụng '+ds.length+' định mức mới?\n'+ptdmNhacAp())) return;
  call('banDieuHanhSuaDinhMucNhieu',[ds,lyDo],function(r){
    toast(r.msg,r.ok);
    if(r.ok) reload(function(){ ptdmChay(); });
  });
}
