# -*- coding: utf-8 -*-
"""Vá bản 3D của chủ dự án (so-do/nha-may-3d.html): thêm tô màu KPI / sĩ số, thẻ chi tiết, máy bảo trì – dùng chung SS của trang cha.
   Dùng cho demo (tao-demo.py) và web thật (va-so-do.py, mục 15 của va-index.py)."""

def R(s, old, new, n=1):
    assert s.count(old) == n, (old[:80], s.count(old))
    return s.replace(old, new)

def va_ba(ba_d, nhan_kpi='KPI hôm nay'):
    b = ba_d
    b = R(b, '<script type="importmap">', '''<script>window.SS=(window.parent&&window.parent!==window&&window.parent.SS)||null;</script>
<style>.ss-the{margin-top:10px;display:grid;gap:5px;font-size:13px}.ss-the .ss-dong{display:flex;justify-content:space-between;gap:10px;border-bottom:1px dashed var(--line);padding-bottom:4px}
.ss-the .ss-dong span{color:var(--muted)}.ss-the small{color:var(--muted);font-size:11.5px}.ss-trong{color:var(--muted)}
.ss-bt{padding:8px 10px;border-radius:6px;background:rgba(229,72,77,.12);border:1px solid rgba(229,72,77,.5)}
.lbl.bt{background:#e5484d;color:#fff;border-color:#a61b20}</style>
<script type="importmap">''')
    b = R(b, '''      <label class="sun" for="hour">''', '''      <div class="seg" id="segMau" role="group" aria-label="Tô màu"><button data-c="" aria-pressed="false">Màu thật</button><button data-c="kpi" aria-pressed="true">''' + nhan_kpi + '''</button><button data-c="siso" aria-pressed="false">Sĩ số</button></div>
      <label class="sun" for="hour">''')
    b = R(b, 'cat:false,hq:!small,sel:null};', 'cat:false,kpi:!!window.SS,hq:!small,sel:null};')
    b = R(b, 'st.cat?m.userData.cat:m.userData.real', 'veMau(m)', 2)
    b = R(b, 'let flyT=null;', '''function veMau(m){
  if(st.cat)return m.userData.cat;
  if(st.kpi&&window.SS){const R=DATA[m.userData.fi].rooms[m.userData.ri];const c=SS.mau(m.userData.fi,R)||(R.c==='sx'||R.c==='son'?'#8b9196':null);if(c)return mat(c,{roughness:.8});}
  return m.userData.real;}
const segMau=document.getElementById('segMau');
function veSegMau(){segMau.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String((st.kpi?SS.cheDo:'')===b.dataset.c)));}
if(!window.SS)segMau.remove();
else{segMau.onclick=e=>{const b=e.target.closest('button');if(!b)return;st.kpi=!!b.dataset.c;if(b.dataset.c)SS.datCheDo(b.dataset.c);else{apply();legend();}veSegMau();};
  SS.nghe.push(()=>{apply();legend();veSegMau();});}
let flyT=null;''')
    b = R(b, "document.getElementById('legend').innerHTML=st.cat?", "document.getElementById('legend').innerHTML=st.kpi&&window.SS&&!st.cat?SS.chuGiai():st.cat?")
    b = R(b, '''</dl>
     ${Object.keys(eq).length?''', '''</dl>${window.SS?SS.the(u.fi,R):''}
     ${Object.keys(eq).length?''')
    b = R(b, '</dl>${Mc.note?', "</dl>${window.SS?SS.theMay(u.fi,Mc):''}${Mc.note?")
    b = R(b, 'parts.mc.add(m);pick.push(m);const a=rc(Mc.r);', '''parts.mc.add(m);pick.push(m);const a=rc(Mc.r);
    if(window.SS&&SS.baoTri(fi,Mc)){parts.mc.add(box(a.x1-a.x0+.5,.04,a.y1-a.y0+.5,S({color:0xe5484d,emissive:0xe5484d,emissiveIntensity:.9}),px((a.x0+a.x1)/2),.08,pz((a.y0+a.y1)/2),false));
      const el=document.createElement('div');el.className='lbl bt';el.textContent='⚠ Bảo trì';const L=new CSS2DObject(el);L.position.set(px((a.x0+a.x1)/2),Mc.h+.7,pz((a.y0+a.y1)/2));L.userData.big=true;parts.labels.add(L);}''')
    # 13/10: lưu bố trí máy ("✥ Sắp xếp máy") lên web – trang cha đặt window.BTM {data, sua, luc, nguoi, luu(chuoi, cb)} (tests/bo-tri-may.gs).
    # Không có BTM (mở file 3D riêng / demo) thì vẫn nhớ trong trình duyệt như bản gốc.
    b = R(b, '<script>window.SS=', '<script>window.BTM=(window.parent&&window.parent!==window&&window.parent.BTM)||null;</script>\n<script>window.SS=')
    b = R(b, 'Bố trí tự lưu trên máy này.</p>', '<span id="btGhiLuu">Bố trí tự lưu trên máy này.</span></p>')
    b = R(b, '<p id="btSo" class="sub"></p>', '<p id="btSo" class="sub"></p><p id="btLuuTT" class="sub" role="status"></p>')
    b = R(b, '<button id="btXuatNut" type="button">Xuất bố trí</button>', '<button id="btLuu" type="button" hidden style="font-weight:700;background:#f7b829;color:#1a1a1a;border-color:#f7b829">💾 Lưu bố trí</button><button id="btXuatNut" type="button">Xuất bố trí</button>')
    b = R(b, "  try{localStorage.setItem(KHOA_BT,JSON.stringify({d:o,n,x}));}catch(e){}", "  if(window.BTM)btDoi(JSON.stringify({d:o,n,x}));else try{localStorage.setItem(KHOA_BT,JSON.stringify({d:o,n,x}));}catch(e){}")
    b = R(b, "function napBT(){let o={};try{o=JSON.parse(localStorage.getItem(KHOA_BT)||'{}');}catch(e){}", "function napBT(){let o={};if(window.BTM)o=window.BTM.data||{};else try{o=JSON.parse(localStorage.getItem(KHOA_BT)||'{}');}catch(e){}")
    b = R(b, "else{ctl.enabled=true;keo=null;document.getElementById('btXuat').hidden=true;}}", "else{ctl.enabled=true;keo=null;document.getElementById('btXuat').hidden=true;if(btChuaLuu())btLuu();}}")
    b = R(b, "\nnapBT();\n", r"""
var btDaLuu=null,btHienTai='',btDang=false;
function btChuaLuu(){return !!window.BTM&&window.BTM.sua&&btDaLuu!==null&&btHienTai!==btDaLuu;}
function btDoi(chu){btHienTai=chu;const B=window.BTM;if(!B||btDaLuu===null)return;const doi=chu!==btDaLuu,n=document.getElementById('btLuu');if(n)n.disabled=!doi||btDang;
  document.getElementById('btLuuTT').textContent=btDang?'Đang lưu lên web…':doi?'● Có thay đổi chưa lưu – bấm “💾 Lưu bố trí” để mọi người cùng thấy.':B.luc?'✓ Đã lưu lên web lúc '+B.luc+(B.nguoi?' ('+B.nguoi+')':'')+'.':'Đang dùng đúng vị trí theo bản vẽ.';}
function btLuu(xong){const B=window.BTM;if(!B||!B.sua||btDang||btDaLuu===null||btHienTai===btDaLuu){if(xong)xong(true);return;}
  const chu=btHienTai;btDang=true;btDoi(chu);
  B.luu(chu,r=>{btDang=false;if(r&&r.ok){btDaLuu=chu;B.luc=r.luc;B.nguoi=r.nguoi;B.data=JSON.parse(chu);bao('Đã lưu bố trí máy – ai mở sơ đồ cũng thấy bố trí này.');}
    else bao('Chưa lưu được: '+((r&&r.msg)||'lỗi kết nối')+'. Bấm “💾 Lưu bố trí” lần nữa.');btDoi(btHienTai);if(xong)xong(!!(r&&r.ok));});}
window.__btChuaLuu=btChuaLuu;window.__btLuu=btLuu;
napBT();
if(window.BTM){btDaLuu=btHienTai=JSON.stringify(luuBT());btDoi(btHienTai);
  document.getElementById('btXuatNut').hidden=true;
  if(window.BTM.sua){const n=document.getElementById('btLuu');n.hidden=false;n.onclick=()=>btLuu();
    document.getElementById('btGhiLuu').textContent='Sắp xếp xong bấm “💾 Lưu bố trí” (bấm Xong cũng tự lưu) – bố trí lưu lên web, ai mở sơ đồ cũng thấy.';}
  else document.getElementById('btnBoTri').style.display='none';}
if(window.__v3)Object.assign(window.__v3,{btBat:batBoTri,btXoayThu:()=>{const F=floors[0];for(let mi=0;mi<F.mc.length;mi++){const Mc=F.mc[mi];if(Mc.xoa||!Mc.obj)continue;selMc={fi:0,mi};const q=Mc.quay;xoay();if(Mc.quay!==q)return Mc.l;}return '';}});   // cho kiểm thử
""")
    # ---- 21/10 (chủ dự án): mặc định chế độ Nhẹ; nút Toàn màn hình; nút ẩn / hiện thanh chi tiết bên phải
    b = R(b, 'kpi:!!window.SS,hq:!small,sel:null};', 'kpi:!!window.SS,hq:false,sel:null};')
    b = R(b, '#btnNhe[aria-pressed="true"]{background:var(--ink);color:var(--panel)}', '#btnNhe[aria-pressed="true"]{background:var(--ink);color:var(--panel)}\n' + CSS_TOAN)
    b = R(b, '⚡ Nhẹ</button>', '⚡ Nhẹ</button>\n      <button id="btnToan" type="button" aria-pressed="false" title="Xem toàn màn hình (Esc để thoát)">⛶ Toàn màn hình</button>'
             '\n      <button id="btnBen" type="button" aria-pressed="false" aria-controls="benPhai" title="Ẩn / hiện thanh chi tiết bên phải">◨ Ẩn chi tiết</button>')
    b = R(b, '  <aside>', '  <aside id="benPhai">')
    b = R(b, "document.getElementById('btnNhe').onclick=", JS_TOAN + "document.getElementById('btnNhe').onclick=")
    # ---- 23/10 (chủ dự án): chọn giờ tối thì trong xưởng tối đen, rất khó nhìn -> bật đèn xưởng; thanh giờ tới 22:00 (ca tối)
    b = R(b, 'id="hour" min="5.5" max="19"', 'id="hour" min="5.5" max="22"')
    b = R(b, 'M.lampHead.emissiveIntensity=0.2+night*3;', 'M.lampHead.emissiveIntensity=0.2+night*3;denDem(night);')
    # ---- 24/10 (chủ dự án): tab Sơ đồ không cần KPI / sĩ số (xem ở tab khác) – bỏ nút tô màu, luôn màu thật; thẻ phòng chỉ ghi xưởng
    b = R(b, 'kpi:!!window.SS,hq:false,sel:null};', 'kpi:false,hq:false,sel:null};')
    b = R(b, 'if(!window.SS)segMau.remove();', 'segMau.remove();if(0);')
    b = R(b, "</dl>${window.SS?SS.the(u.fi,R):''}", r'''</dl>${window.SS&&SS.xuong(u.fi,R)?'<div class="ss-the"><div class="ss-dong"><span>Xưởng làm việc</span><b>'+SS.TEN[SS.xuong(u.fi,R)]+'</b></div></div>':''}''')
    b = R(b, 'setHour(+hourEl.value); legend(); size(); apply(); select(null);', JS_DEN_DEM + 'setHour(+hourEl.value); legend(); size(); apply(); select(null);')
    # ---- 03/11 (chủ dự án): dòng hàng giữa các xưởng trong 3D (nút "↝ Dòng hàng", ai xem sơ đồ cũng thấy, không số)
    #      + bấm khu / nhãn xưởng -> mở lưu đồ xưởng ở trang cha (chỉ chủ sở hữu, TP/PP xưởng mình – parent.sdCoLuuDo)
    b = R(b, '⚡ Nhẹ</button>', '⚡ Nhẹ</button>\n      <button id="btnDongHang" type="button" aria-pressed="false" title="Mũi tên dòng bán thành phẩm giữa các xưởng (xanh: hàng chính, cam: cấp phụ)">↝ Dòng hàng</button>')
    b = R(b, '#btnNhe[aria-pressed="true"]{background:var(--ink);color:var(--panel)}', '#btnNhe[aria-pressed="true"]{background:var(--ink);color:var(--panel)}\n' + CSS_DONG_HANG)
    b = R(b, "'</b></div></div>':''}", "'</b></div>'+dh3NutLD(SS.xuong(u.fi,R))+'</div>':''}")
    b = R(b, 'roomList(); stats();\n}', 'roomList(); stats();\n  if(typeof DH3!=="undefined"&&DH3&&DH3.on)dh3Dung();\n}')
    b = R(b, 'if(flyT||floors.some(F=>Math.abs(F.ty-F.yNow)>.002))canVe=Math.max(canVe,2);',
             'if(flyT||floors.some(F=>Math.abs(F.ty-F.yNow)>.002))canVe=Math.max(canVe,2);\n    if(typeof DH3!=="undefined"&&DH3&&DH3.on){dh3Buoc(dt);canVe=Math.max(canVe,2);}')
    b = R(b, 'function loop(t){', JS_DONG_HANG + 'function loop(t){')
    return b

JS_DEN_DEM = r'''/* 23/10: đèn xưởng ban đêm – đèn trần treo trên các khu sản xuất lớn (không đổ bóng cho nhẹ), ánh sáng ấm trong nhà,
   ánh trăng xanh nhạt ngoài trời, bật các bóng đèn trần đã vẽ (userData.den). n = 0 ban ngày … 1 ban đêm. */
const denAmXuong=new THREE.AmbientLight(0xffe2b8,0); scene.add(denAmXuong);
const denTran=[];
floors.forEach(F=>{
  const ds=[];
  F.rooms.forEach(R=>{ if(/^(Thang|WC|Hành lang|Lối đi)/.test(R.n||''))return;
    R.r.forEach(r=>{const a=rc(r),s=(a.x1-a.x0)*(a.y1-a.y0); if(s>=40)ds.push({a,s});}); });
  ds.sort((p,q)=>q.s-p.s).slice(0,5).forEach(o=>{
    const L=new THREE.PointLight(0xffdcae,0,Math.max(14,Math.sqrt(o.s)*1.7),1.6); L.castShadow=false;
    L.position.set(px((o.a.x0+o.a.x1)/2),3.1,pz((o.a.y0+o.a.y1)/2)); L.userData.s=o.s; F.g.add(L); denTran.push(L); });
});
const bongTran=[]; scene.traverse(o=>{ if(o.userData&&o.userData.den&&o.userData.den.material)bongTran.push(o.userData.den.material); });
const mauTroi=new THREE.Color(0xcfe2ff), mauTrang=new THREE.Color(0x9db7e6);
function denDem(n){
  denAmXuong.intensity=0.55*n;
  denTran.forEach(L=>{L.intensity=n*(12+Math.min(18,L.userData.s/16));});
  bongTran.forEach(m=>{m.emissiveIntensity=2.2*n;});
  hemi.color.copy(mauTroi).lerp(mauTrang,n); hemi.intensity=Math.max(hemi.intensity,0.12+0.28*n);
  if(typeof canVe!=='undefined')canVe=30;
}
'''


CSS_TOAN = """#btnToan,#btnBen{font:600 14px/1 var(--f-display);letter-spacing:.04em;text-transform:uppercase;color:var(--ink);background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:9px 12px;min-height:40px;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.12);white-space:nowrap}
#btnToan[aria-pressed="true"],#btnBen[aria-pressed="true"]{background:var(--ink);color:var(--panel)}
#btnToan:focus-visible,#btnBen:focus-visible,#btnNhe:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
body.an-ben .app{grid-template-columns:1fr}
body.an-ben aside{display:none}
@media (max-width:820px){body.an-ben .app{grid-template-rows:100vh}}"""

# Toàn màn hình: Fullscreen API; trình duyệt / khung nhúng không cho (iPhone, khung chặn) thì báo web thu gọn đầu lớp phủ (sdGon3D)
JS_TOAN = r"""document.getElementById('tgHq').checked=st.hq;document.getElementById('tgPp').checked=st.pp;
(function(){
  const nT=document.getElementById('btnToan'),nB=document.getElementById('btnBen'),goc=document.documentElement;
  const pa=(window.parent&&window.parent!==window)?window.parent:null;
  let gia=false;
  const dangToan=()=>!!(document.fullscreenElement||document.webkitFullscreenElement)||gia;
  const ve=()=>{const on=dangToan();nT.setAttribute('aria-pressed',String(on));nT.textContent=on?'⛶ Thoát toàn màn hình':'⛶ Toàn màn hình';};
  const giaLap=on=>{gia=on;try{if(pa&&pa.sdGon3D)pa.sdGon3D(on);}catch(e){}ve();};
  nT.onclick=()=>{
    if(dangToan()){if(gia)giaLap(false);else (document.exitFullscreen||document.webkitExitFullscreen).call(document);return;}
    const vao=goc.requestFullscreen||goc.webkitRequestFullscreen;
    if(vao&&(document.fullscreenEnabled||document.webkitFullscreenEnabled)){try{const p=vao.call(goc);if(p&&p.catch)p.catch(()=>giaLap(true));}catch(e){giaLap(true);}}
    else giaLap(true);};
  document.addEventListener('fullscreenchange',ve);document.addEventListener('webkitfullscreenchange',ve);
  addEventListener('keydown',e=>{if(e.key==='Escape'&&gia&&!st.boTri)giaLap(false);});
  const datBen=an=>{document.body.classList.toggle('an-ben',an);nB.setAttribute('aria-pressed',String(an));nB.textContent=an?'◧ Hiện chi tiết':'◨ Ẩn chi tiết';
    try{localStorage.setItem('kpi_3d_an_ben',an?'1':'');}catch(e){}};
  nB.onclick=()=>datBen(!document.body.classList.contains('an-ben'));
  let an0=false;try{an0=localStorage.getItem('kpi_3d_an_ben')==='1';}catch(e){}
  datBen(an0);ve();
  if(window.__v3)Object.assign(window.__v3,{toan:()=>nT.click(),ben:()=>nB.click()});   // cho kiểm thử
})();
"""


CSS_DONG_HANG = """#btnDongHang{font:600 14px/1 var(--f-display);letter-spacing:.04em;text-transform:uppercase;color:var(--ink);background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:9px 12px;min-height:40px;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.12);white-space:nowrap}
#btnDongHang[aria-pressed="true"]{background:#0b7a73;color:#fff;border-color:#0b7a73}
#btnDongHang:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.lbl.dh3{background:#0b2f3a;color:#bff3ff;border-color:#46d7ff;font-size:12.5px;padding:3px 8px;box-shadow:0 0 12px rgba(70,215,255,.55)}
.lbl.dh3.mo{pointer-events:auto;cursor:pointer}.lbl.dh3.mo:hover{background:#0b7a73;color:#fff}
.lbl.dh3p{background:rgba(60,35,5,.85);color:#ffd9a3;border-color:#ffb347;font-size:11px}
.ss-ld{margin-top:8px;width:100%;font:600 13px/1.2 var(--f-display);padding:9px 10px;border-radius:6px;border:1px solid #0b7a73;background:#0b7a73;color:#fff;cursor:pointer}"""

# Dòng hàng 3D: nút = khu lớn nhất của mỗi xưởng (ghép khu ↔ xưởng SS.xuong của trang cha), cạnh như lưu đồ toàn nhà máy (tab Quy trình)
JS_DONG_HANG = r"""/* 03/11: dòng hàng giữa các xưởng – đường cong phát sáng nối khu các xưởng (xuyên tầng), chấm chạy theo chiều hàng đi */
var DH3={on:false,g:new THREE.Group(),dots:[],key:''};
scene.add(DH3.g); DH3.g.visible=false;
var DH3_CANH=[['PHOICB','PHOITHO',0],['PHOITHO','SON',0],['PHOITHO','NGONTARO',0],['SON','INUV',0],['NGONTARO','NGONTIP',0],['INUV','HT',0],['NGONTIP','HT',0],['HT','DG',0],
  ['NGONTARO','PHOITHO',1,'POM'],['CNC','NGONTIP',1,'Tip, phíp'],['CNC','SON',1,'Đầu lết'],['CNC','DG',1,'Tip bán lẻ'],['NGONTIP','DG',1,'Ngọn lẻ']];
function dh3Cha(){try{return window.parent&&window.parent!==window?window.parent:null;}catch(e){return null;}}
function dh3CoLD(ma){const p=dh3Cha();try{return !!(ma&&p&&p.sdCoLuuDo&&p.sdCoLuuDo(ma));}catch(e){return false;}}
function dh3MoLD(ma){const p=dh3Cha();try{if(p&&p.sdLuuDo)p.sdLuuDo(ma);}catch(e){}}
function dh3NutLD(ma){return dh3CoLD(ma)?'<button type="button" class="ss-ld" onclick="dh3MoLD(\''+ma+'\')">▦ Xem lưu đồ sản xuất của xưởng</button>':'';}
window.dh3MoLD=dh3MoLD;
function dh3Nut(){
  const S=window.SS; if(!S||!S.xuong)return {};
  const tong={};
  floors.forEach((F,fi)=>F.rooms.forEach(R=>{const ma=S.xuong(fi,R);if(!ma)return;
    (R.r||[]).forEach(r=>{const a=rc(r),s=(a.x1-a.x0)*(a.y1-a.y0);if(!(s>0))return;const k=ma+'|'+fi,o=tong[k]||(tong[k]={ma,fi,s:0,x:0,y:0});o.s+=s;o.x+=s*(a.x0+a.x1)/2;o.y+=s*(a.y0+a.y1)/2;});}));
  const best={};Object.values(tong).forEach(o=>{if(!best[o.ma]||o.s>best[o.ma].s)best[o.ma]=o;});
  Object.values(best).forEach(o=>{o.x/=o.s;o.y/=o.s;});return best;}
function dh3Xoa(){DH3.g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
  [...DH3.g.children].forEach(o=>DH3.g.remove(o));DH3.dots=[];}
function dh3Dung(){
  dh3Xoa();DH3.g.visible=DH3.on;if(!DH3.on)return;
  const N=dh3Nut(),ten=(window.SS&&SS.TEN)||{},nhin=ma=>N[ma]&&floors[N[ma].fi].g.visible;
  const P=ma=>{const o=N[ma];return new THREE.Vector3(px(o.x),floors[o.fi].g.position.y+1.7,pz(o.y));};
  const vl=(c,op)=>new THREE.MeshBasicMaterial({color:c,depthTest:false,transparent:true,opacity:op});
  Object.keys(N).filter(nhin).forEach(ma=>{const p=P(ma);
    const m=new THREE.Mesh(new THREE.SphereGeometry(.5,18,12),vl(0x7fe0ff,.95));m.position.copy(p);m.renderOrder=999;DH3.g.add(m);
    const el=document.createElement('div');el.className='lbl dh3'+(dh3CoLD(ma)?' mo':'');el.textContent=String(ten[ma]||ma).replace(/^Xưởng\s+/i,'');
    if(dh3CoLD(ma)){el.title='Bấm để xem lưu đồ sản xuất của xưởng';el.onclick=()=>dh3MoLD(ma);}
    const L=new CSS2DObject(el);L.position.copy(p).add(new THREE.Vector3(0,1.2,0));DH3.g.add(L);});
  DH3_CANH.forEach(c=>{if(!nhin(c[0])||!nhin(c[1]))return;const a=P(c[0]),b=P(c[1]);
    const cao=Math.max(a.y,b.y)+(Math.abs(a.y-b.y)<.5?3.2:2.4),phu=!!c[2],col=phu?0xffb347:0x46d7ff;
    const cv=new THREE.CubicBezierCurve3(a,new THREE.Vector3(a.x,cao,a.z),new THREE.Vector3(b.x,cao,b.z),b);
    const tu=new THREE.Mesh(new THREE.TubeGeometry(cv,56,phu?.07:.12,8,false),vl(col,phu?.7:.9));tu.renderOrder=998;DH3.g.add(tu);
    const t1=cv.getPointAt(.9),t2=cv.getPointAt(.985),mu=new THREE.Mesh(new THREE.ConeGeometry(phu?.28:.38,1,14),vl(col,1));
    mu.position.copy(t1).lerp(t2,.5);mu.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),t2.clone().sub(t1).normalize());mu.renderOrder=999;DH3.g.add(mu);
    for(let i=0;i<3;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(phu?.15:.2,10,8),vl(0xffffff,1));d.renderOrder=1000;d.userData.cv=cv;d.userData.u=i/3;d.position.copy(cv.getPointAt(i/3));DH3.g.add(d);DH3.dots.push(d);}
    if(c[3]){const el=document.createElement('div');el.className='lbl dh3p';el.textContent=c[3];const L=new CSS2DObject(el);L.position.copy(cv.getPointAt(.5)).add(new THREE.Vector3(0,.5,0));DH3.g.add(L);}});
  DH3.key=floors.map(F=>F.g.position.y.toFixed(2)+(F.g.visible?1:0)).join(',');}
function dh3Buoc(dt){
  const k=floors.map(F=>F.g.position.y.toFixed(2)+(F.g.visible?1:0)).join(',');if(k!==DH3.key){dh3Dung();return;}
  if(reduce)return;DH3.dots.forEach(d=>{d.userData.u=(d.userData.u+dt/4200)%1;d.position.copy(d.userData.cv.getPointAt(d.userData.u));});}
function dh3Bat(on){DH3.on=on;
  {const c=document.getElementById('tgLbl');if(on){DH3.lbl=st.lbl;st.lbl=false;}else if(DH3.lbl!==undefined){st.lbl=DH3.lbl;delete DH3.lbl;}if(c)c.checked=st.lbl;if(!on||!(st.mode==='khoi'&&st.floor==='all'))apply();}   // bật dòng hàng: tạm ẩn tên phòng cho nhãn xưởng dễ đọc, tắt thì trả lạiconst n=document.getElementById('btnDongHang');if(n)n.setAttribute('aria-pressed',String(on));
  if(on&&st.mode==='khoi'&&st.floor==='all'){st.mode='tach';apply();}   // tách tầng cho thấy đường đi xuyên tầng
  if(on&&st.floor==='all')fly(new THREE.Vector3(2,H+GAP,0),new THREE.Vector3(-46,H+GAP+34,52));   // góc nhìn thấy cả 3 tầng và đường nối
  dh3Dung();canVe=30;
  if(on)bao('Dòng hàng: đường xanh = hàng đi chính, đường cam = cấp phụ (POM, tip, phíp, đầu lết)'+(Object.keys(dh3Nut()).some(dh3CoLD)?'. Bấm tên xưởng để xem lưu đồ.':'.'));}
document.getElementById('btnDongHang').onclick=()=>dh3Bat(!DH3.on);
if(window.__v3)Object.assign(window.__v3,{dongHang:dh3Bat,dh3:()=>({on:DH3.on,nut:Object.keys(dh3Nut()),canh:DH3.g.children.filter(o=>o.geometry&&o.geometry.type==='TubeGeometry').length,nhan:DH3.g.children.filter(o=>o.isCSS2DObject).map(o=>o.element.textContent)})});
"""
