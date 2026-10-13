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
    return b
