var LOGO='<img class="logo" src="{{RH_LOGO}}" alt="Rhino – Made by Vietnam">';
var ANH={must:'{{RH_1}}',eclipse:'{{RH_2}}',retro:'{{RH_3}}',mustcue:'{{RH_4}}',khac:'{{RH_KHAC}}'};
var KH=['Từng cái một, <b>cuối ca thành nghìn</b>!','Làm <b>đúng ngay từ đầu</b>, khỏi phải làm lại!','An toàn là trên hết – <b>về nhà bình an</b>!','Tổ đồng lòng, <b>việc khó cũng xong</b>.'];
function khNgay(){ return KH[Math.floor(Date.now()/864e5)%KH.length]; }
function maiChip(){ return '<div class="mai-chip"><span class="mai-tron" data-mai></span><span><b>'+buoi()[1].replace(/^\S+\s/,'')+'</b><small>Mai chúc bạn một ca tốt lành</small></span></div>'; }
function maiVe(goc){ var c=goc.querySelector('[data-mai]'); if(!c) return null;
  c.innerHTML='<svg class="mai" viewBox="26 22 148 148" aria-hidden="true">'+MAI.replace(/'<\/g>';?$/,'')+MAI_CHE+'</svg>'; return c.firstChild; }
/* Mai: che mắt khi gõ mật khẩu, lo khi sai, cổ vũ khi đúng – nối thêm vào cb của từng kiểu */
function voiMai(goc,cb){ var m=maiVe(goc), lop=function(x){ if(m) m.setAttribute('class','mai '+x); };
  var r={}; for(var k in cb) r[k]=cb[k];
  r.vao=function(o){ if(o==='mk') lop('che'); cb.vao&&cb.vao(o); };
  r.ra=function(o){ if(o==='mk') lop(''); cb.ra&&cb.ra(o); };
  r.sai=function(){ lop('lo'); cb.sai&&cb.sai(); };
  r.ok=function(t){ lop('covu'); cb.ok&&cb.ok(t); };
  return r; }
var FORM=function(cls){ return '<div class="'+(cls||'')+'"><div class="o-nhap"><input data-tk autocomplete="username" placeholder="Mã nhân viên" aria-label="Mã nhân viên"></div>'+O+MK+CHUNG+
  '<div class="hang" style="display:flex;justify-content:space-between;align-items:center;margin:2px 2px 10px"><label class="nho-tk"><input type="checkbox" data-nho> Ghi nhớ mã</label><small style="opacity:.7;font-size:12px">Quên mật khẩu? Hỏi trưởng phòng</small></div>'+
  '<button class="nut-vang" data-dn>Đăng nhập</button></div>'; };
function theoChuot(el,vung,f){ if(GIAM) return; vung.addEventListener('pointermove',function(e){ var r=vung.getBoundingClientRect(); f((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height,e); }); }

var KIEU=[
 {id:'A',ten:'A. Kính lỏng',mo:'Kiểu "Liquid Glass" của Apple – đang lan khắp Instagram từ khi iOS 26 ra mắt.',
  ghi:'<b>Hợp với:</b> cảm giác cao cấp, hiện đại. Tấm kính dày có viền sáng, nhìn xuyên ra ảnh sản phẩm Rhino chuyển chậm phía sau; đưa chuột thì vệt sáng và độ nghiêng của kính chạy theo. Đúng mật khẩu thì kính "tan" ra.',
  ve:function(k){ k.innerHTML='<div class="xh A"><div class="nen hien" style="background-image:url('+ANH.eclipse+')"></div><div class="nen" style="background-image:url('+ANH.retro+')"></div><div class="nen" style="background-image:url('+ANH.mustcue+')"></div>'+
     '<div class="dau">'+LOGO+'</div><div class="kinh" data-rung>'+maiChip()+'<h2>Đăng nhập</h2><div class="phu">Hệ thống KPI sản xuất · Carbon Billiards</div>'+FORM()+'</div></div>';
   var a=k.querySelector('.A'), kinh=a.querySelector('.kinh'), nen=a.querySelectorAll('.nen'), i=0;
   if(!GIAM) k.__t=setInterval(function(){ nen[i].classList.remove('hien'); i=(i+1)%nen.length; nen[i].classList.add('hien'); },6000);
   theoChuot(kinh,a,function(x,y,e){ var r=kinh.getBoundingClientRect(); kinh.style.setProperty('--mx',(e.clientX-r.left)+'px'); kinh.style.setProperty('--my',(e.clientY-r.top)+'px');
     kinh.style.setProperty('--ry',((x-.5)*6).toFixed(2)+'deg'); kinh.style.setProperty('--rx',((.5-y)*5).toFixed(2)+'deg'); });
   ganNhap(a,voiMai(a,{ok:function(t){ setTimeout(function(){a.classList.add('tan')},300); okLop(k,t); }})); }},

 {id:'B',ten:'B. Cực quang + hạt phim',mo:'Nền cực quang chuyển động, hạt phim, viền đèn rọi theo chuột – phong cách Linear/Vercel rất được chia sẻ.',
  ghi:'<b>Hợp với:</b> tối giản, "công nghệ". Nền ánh vàng – cam – xanh trôi chậm, có hạt nhiễu như phim; viền khung đăng nhập sáng vàng đúng chỗ con trỏ. Tiêu đề chữ lớn chuyển màu.',
  ve:function(k){ k.innerHTML='<div class="xh B"><div class="cq"><i></i><i></i><i></i></div><div class="luoi"></div><div class="hat"></div>'+
     '<div class="giua"><div class="dau">'+LOGO+'</div><div class="tieu">Vào ca.<br><em>Làm chuẩn.</em></div><div class="phu">Hệ thống KPI sản xuất · Carbon Billiards</div>'+
     '<div class="the" data-rung>'+maiChip().replace('mai-chip','mai-chip" style="margin-bottom:14px')+FORM()+'</div></div></div>';
   var b=k.querySelector('.B'), the=b.querySelector('.the');
   theoChuot(the,b,function(x,y,e){ var r=the.getBoundingClientRect(); the.style.setProperty('--mx',(e.clientX-r.left)+'px'); the.style.setProperty('--my',(e.clientY-r.top)+'px'); });
   ganNhap(b,voiMai(b,{ok:function(t){ b.classList.add('sang'); okLop(k,t); }})); }},

 {id:'C',ten:'C. Lưới bento',mo:'Bố cục "bento" – các ô bo tròn như hộp cơm Nhật, kiểu Apple và các app năm 2025–26 hay dùng.',
  ghi:'<b>Hợp với:</b> vừa đăng nhập vừa thấy thông tin hữu ích: giờ + ca hiện tại, khẩu hiệu của Mai, ảnh sản phẩm. Các ô hiện lần lượt, rê chuột vào thì viền sáng. Trên điện thoại các ô xếp chồng.',
  ve:function(k){ var n=new Date(), th=['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'][n.getDay()], h=n.getHours();
   k.innerHTML='<div class="xh C"><div class="o dn" data-rung>'+LOGO+'<h2>Đăng nhập</h2><div class="phu">Hệ thống KPI sản xuất · Carbon Billiards</div>'+FORM()+'</div>'+
     '<div class="o anh"><img src="'+ANH.retro+'" alt=""><div class="nhan"><b>Retro II</b><small>Rhino · Made by Vietnam</small></div></div>'+
     '<div class="o gio"><small>'+th+', '+('0'+n.getDate()).slice(-2)+'/'+('0'+(n.getMonth()+1)).slice(-2)+'</small><div><div class="so" data-gio></div><span class="ca">'+(h<12?'Ca sáng':h<18?'Ca chiều':'Ngoài giờ')+'</span></div></div>'+
     '<div class="o mai-o"><div class="mai-chip"><span class="mai-tron" data-mai></span><span><b>Mai</b><small>'+buoi()[1].replace(/^\S+\s/,'')+'</small></span></div><p>Khẩu hiệu hôm nay: '+khNgay()+'</p></div></div>';
   var c=k.querySelector('.C'), g=c.querySelector('[data-gio]'); function gio(){ var d=new Date(); g.textContent=('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2); } gio(); k.__t=setInterval(gio,10000);
   ganNhap(c,voiMai(c,{ok:function(t){ okLop(k,t); }})); }},

 {id:'D',ten:'D. Chữ động cỡ lớn',mo:'"Kinetic typography" – chữ khổng lồ chạy ngang màn hình, kiểu poster động đang rất hot trên Reels.',
  ghi:'<b>Hợp với:</b> mạnh, cá tính, đúng tinh thần thương hiệu. Bốn dải chữ RHINO · CARBON · MADE BY VIETNAM chạy ngược chiều nhau; gõ mã nhân viên thì dải vàng hiện "XIN CHÀO + mã" và chạy nhanh dần; sai thì dải vàng chuyển đỏ; đúng thì tất cả tăng tốc.',
  ve:function(k){ var dong=function(txt,cls,t){ var s='<span>'+txt+'</span>'; return '<div class="dong '+cls+'" style="--t:'+t+'s">'+s+s+s+s+'</div>'; };
   k.innerHTML='<div class="xh D">'+dong('Rhino · Carbon · ','v',46)+dong('Made by Vietnam · ','v nguoc',52)+'<div data-vang>'+dong('Vào ca · Làm chuẩn · ','vang',34)+'</div>'+dong('Precision · Chính xác · ','v nguoc',58)+dong('Rhino · Carbon · ','v',40)+
     '<div class="the" data-rung>'+LOGO+'<h2>Đăng nhập</h2>'+maiChip().replace('mai-chip','mai-chip" style="margin-bottom:14px')+FORM()+'</div></div>';
   var d=k.querySelector('.D'), vg=d.querySelector('[data-vang]');
   ganNhap(d,voiMai(d,{go:function(o,n,ntk){ if(o==='tk'){ var ma=d.querySelector('[data-tk]').value.trim().toUpperCase(); vg.innerHTML=dong((ma?'Xin chào '+ma+' · ':'Vào ca · Làm chuẩn · '),'vang',34); }
       d.style.setProperty('--toc',(1+Math.min(ntk,10)*.25).toFixed(2)); d.classList.remove('loi'); },
     sai:function(){ d.classList.add('loi'); }, ok:function(t){ d.classList.add('di'); okLop(k,t); }})); }},

 {id:'E',ten:'E. Thẻ nhân viên hologram',mo:'Thẻ nhân viên 3D lấp lánh như thẻ hologram – kiểu "thẻ sưu tầm" đang viral, nghiêng theo chuột.',
  ghi:'<b>Hợp với:</b> cảm giác "thẻ ra vào" của nhà máy. Gõ mã nhân viên thì mã + mã vạch hiện ngay trên thẻ; lớp hologram đổi màu khi thẻ nghiêng. Đúng thì thẻ lật sang mặt vàng "ĐÃ XÁC THỰC"; sai thì viền thẻ đỏ.',
  ve:function(k){ var n=new Date();
   k.innerHTML='<div class="xh E"><div class="the3d" data-the><div class="mat truoc"><div class="anh" style="background-image:url('+ANH.khac+')"></div><span class="lo"></span>'+
     '<div class="noi"><small>Thẻ nhân viên · Carbon Billiards</small><div class="ma" data-ma>––––</div><div class="vach" data-vach></div></div><div class="dau">'+LOGO.replace('class="logo"','class="logo" style="height:18px"')+'</div><div class="holo"></div></div>'+
     '<div class="mat sau"><span>Đã xác thực</span><b>✓</b><span>'+('0'+n.getDate()).slice(-2)+'/'+('0'+(n.getMonth()+1)).slice(-2)+' · '+(n.getHours()<12?'Ca sáng':'Ca chiều')+'</span></div></div>'+
     '<div class="form" data-rung>'+maiChip()+'<h2>Đăng nhập</h2><div class="phu">Hệ thống KPI sản xuất</div>'+FORM()+'</div></div>';
   var e=k.querySelector('.E'), the=e.querySelector('[data-the]'), ma=e.querySelector('[data-ma]'), vach=e.querySelector('[data-vach]');
   function veVach(s){ var h='', x=7; for(var i=0;i<26;i++){ x=(x*31+(s.charCodeAt(i%Math.max(1,s.length))||7))%97; h+='<i style="width:'+(1+x%4)+'px;opacity:'+(x%3?1:.35)+'"></i>'; } vach.innerHTML=h; }
   veVach('');
   theoChuot(the,e,function(x,y){ the.style.setProperty('--ry',((x-.5)*30).toFixed(1)+'deg'); the.style.setProperty('--rx',((.5-y)*22).toFixed(1)+'deg'); the.style.setProperty('--hx',(x*100).toFixed(0)+'%'); the.style.setProperty('--hy',(y*100).toFixed(0)+'%'); });
   ganNhap(e,voiMai(e,{go:function(o){ if(o==='tk'){ var v=e.querySelector('[data-tk]').value.trim().toUpperCase(); ma.textContent=v||'––––'; veVach(v); } the.classList.remove('do'); },
     sai:function(){ the.classList.add('do'); }, ok:function(t){ the.classList.add('lat'); okLop(k,t,'Thẻ đã xác thực – đang mở trang làm việc… (demo dừng ở đây)'); }}));
   var tk=e.querySelector('[data-tk]'); if(tk.value){ ma.textContent=tk.value.toUpperCase(); veVach(tk.value.toUpperCase()); } }}
];
