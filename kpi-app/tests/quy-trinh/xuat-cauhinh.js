// Xuất dữ liệu cấu hình gậy + quy trình nháp ra JSON (chỉ để ở scratchpad, KHÔNG commit JSON). Dùng: node xuat-cauhinh.js <kpi-app> <csdl.json> <dh.json> <ra.json>
const fs=require('fs');const G=require(process.argv[2]+'/tests/gia-lap-kpi.js');
const du=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));const iD=du.TaiKhoan[0].indexOf('DoiMatKhauLanDau');du.TaiKhoan.slice(1).forEach(x=>x[iD]='Không');
const c=G.tao(process.argv[2]+'/Code.gs',du,'2026-11-01T10:00:00+07:00');
const TK=c.doc_('TaiKhoan').filter(t=>t.TrangThai==='Đang dùng');const T=c.__phienDai(TK.find(t=>String(t.VaiTro).trim()==='OWNER'));
const dh=JSON.parse(fs.readFileSync(process.argv[4],'utf8')),sh={};for(const k in dh)sh[k]=dh[k].map(rw=>(rw||[]).map(v=>(v&&typeof v==='object'&&v.$d)?new Date(v.$d+'+07:00'):v));
c.__ngoai={[c.DH_SHEET_ID]:{ten:'x',sheets:sh}};
const r=c.__goi('layDonHangXuong',T,true);
const ten={};r.don.forEach(o=>{const k=o.tenChuan;const x=ten[k]||(ten[k]={ten:o.ten,pl:o.pl,don:0,thieu:0,sl:0,ghiChu:o.ghiChu});x.don++;x.thieu+=o.thieu;x.sl+=o.sl;});
const q=c.layQuyTrinh(T,30);const cm={};q.congDoan.forEach(x=>cm[x.MaCD]=x);
const qt=q.quyTrinh.map(x=>({Ma:x.Ma,MaXuong:x.MaXuong,Nhanh:x.Nhanh,Buoc:x.Buoc,Ten:(cm[x.Ma]||{}).TenCD,DM:(cm[x.Ma]||{}).DM,DVT:(cm[x.Ma]||{}).DVT,SL:((q.thongKe[x.Ma]||{}).sl||0)/q.soNgaySX}));
fs.writeFileSync(process.argv[5],JSON.stringify({nhan:r.nhan,dong:c.PL_DONG,dau:c.PL_DAU_MD,ten:Object.values(ten),qt,xuong:q.xuong,nhanh:q.nhanh,luong:q.xuongLuong}));
console.log(Object.keys(ten).length,qt.length);
