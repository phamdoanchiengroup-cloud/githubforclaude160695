/** Kiểm văn luận Thái Ất (ThaiAtVan.gs): không rỗng, không %, không undefined/null, không chữ Hán, không tên thần trong phần dễ hiểu. Chạy: node tests/thai-at-van.js */
const { ctx } = require('../tools/gia-lap.js');
const CAM=/%|undefined|NaN|null|Thủy Kích|Văn Xương|Ngũ Phúc|Đại Du|Tiểu Du|Kế Thần|Thiên Ất|Địa Ất|Trực Phù|Quân Cơ|Thần Cơ|Dân Cơ|[一-鿿]/;
let loi=[],n=0;
function ck(s,ten){n++; if(typeof s!=='string'||!s.trim()) loi.push(ten+': rỗng'); else {const m=s.match(CAM); if(m) loi.push(ten+': "'+m[0]+'" … '+s.slice(Math.max(0,s.indexOf(m[0])-40), s.indexOf(m[0])+30));}}
const loai=['cong_viec','tai_loc','tinh_cam','di_xa','suc_khoe','kien_tung','thi_cu'];
for (let i=0;i<60;i++){
  const y=1950+i, sinh={day:1+(i*7)%28,month:1+(i*5)%12,year:y,hour:(i*3)%24,minute:10,gender:i%2?'nam':'nu'};
  const m=ctx.taMenh_(sinh), vm_=ctx.taVanMenh_(m); ck(vm_.tomTat,'menh.tomTat'); vm_.chiTiet.forEach((c,j)=>ck(c.van,'menh.cung'+j)); (vm_.loiKhuyen||[]).forEach(x=>ck(x,'menh.loiKhuyen')); ck(vm_.luuY,'menh.luuY');
  const nm=ctx.taVanNam_(ctx.taNamCaNhan_(sinh,2027)); ck(nm.heLo,'nam.heLo'); ck(nm.van,'nam.van'); nm.viec.forEach(x=>ck(x,'nam.viec'));
  const b=ctx.taLap_({ke:'gio',day:1+i%28,month:1+i%12,year:2026,hour:i%24,minute:0});
  loai.forEach(l=>{const h=ctx.taVanHoi_(b,l,ctx.taDanhGia_(b,l)); ck(h.ketLuan,'hoi.'+l); h.viec.forEach(x=>ck(x,'hoi.viec'));});
  const tc=ctx.taVanThoiCuoc_(ctx.taLap_({ke:'nam',year:1950+i})); ck(tc.van,'thoiCuoc');
}
console.log((loi.length?'✘':'✔')+' Văn Thái Ất: '+(n-loi.length)+'/'+n+' đạt'); if(loi.length){console.log([...new Set(loi)].slice(0,15).join('\n')); process.exit(1);}
