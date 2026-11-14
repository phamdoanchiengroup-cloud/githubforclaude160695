/** Kiểm thử hạn chuẩn bộ phận (14/11): node kpi-app/tests/han-chuan.js – không cần DATA */
const vm=require('vm'),fs=require('fs');
const src=fs.readFileSync(process.argv[2] || require('path').join(__dirname, 'quy-trinh', 'don-hang.gs'),'utf8');
const props={};
const ctx={console,PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]||null,setProperty:(k,v)=>{props[k]=v}})},homNayVN_:()=>'2026-11-16'};
vm.createContext(ctx); vm.runInContext(src,ctx);
let n=0,l=0; const ok=(c,t,x)=>{n++; if(c) console.log('  ✓ '+t); else {l++; console.log('  ✗ '+t+' → '+JSON.stringify(x))}};
const cs={nghi:[['2026-11-24','VH']],lam:[],bp:ctx.dhCsBP_(null)};
const GAY=['PHOI','SON','TARO','UV','HT','TIP','DG'];
// gậy 2 khúc SL 100, deadline Thứ 7 28/11/2026. 24/11 nghỉ.
let o={sl:100,thieu:100,dl:'2026-11-28',btp:GAY,pl:{loai:'GAY'},qua:{},hen:{}};
let h=ctx.dhHanChuan_(o,cs,'2026-11-16');
ok(h.DG.h==='2026-11-28','DG = deadline',h.DG);
ok(h.HT.h==='2026-11-25','HT = deadline − 1 (DG) − 2 đệm, bỏ CN không, 24/11 nghỉ',h.HT); // 28→27(1)→26(2)→25(3)
ok(h.UV.h==='2026-11-23','UV = HT − 1 (bỏ 24 nghỉ)',h.UV);
ok(h.SON.h==='2026-11-21' && h.PHOI_C.h==='2026-11-20','SON 21, Phôi chuôi 20',[h.SON,h.PHOI_C]);
ok(h.TIP.h==='2026-11-23' && h.TARO.h==='2026-11-20' && h.PHOI_N.h==='2026-11-19','ngọn: TIP 23, TARO 20 (qua HT lượt 1), Phôi ngọn 19',[h.TIP,h.TARO,h.PHOI_N]);
ok(!h.PHOI,'gậy 2 khúc tách Phôi chuôi / ngọn',Object.keys(h));
// SL 700: Phôi chuôi ceil(700/250)=3, ngọn ceil(700/350)=2, khác 3
o.sl=700;o.thieu=700; h=ctx.dhHanChuan_(o,cs,'2026-11-16');
ok(h.DG.n===3&&h.PHOI_C.n===3&&h.PHOI_N.n===2,'số ngày chuẩn theo công suất',[h.DG.n,h.PHOI_C.n,h.PHOI_N.n]);
// mức
o={sl:100,thieu:100,dl:'2026-11-28',btp:GAY,pl:{loai:'GAY'},qua:{PHOI:100},p2:{c:100,n:100},hen:{SON:'2026-11-21',UV:'2026-11-24',HT:'2026-11-30',TARO:'2026-11-26'}};
h=ctx.dhHanChuan_(o,cs,'2026-11-16');
ok(h.SON.m==='','hẹn đúng hạn chuẩn → không cảnh báo',h.SON);
ok(h.UV.m==='vang'&&h.UV.tre===1,'UV hẹn 24 (nghỉ) > 23 → vàng +1',h.UV);
ok(h.TARO.m==='do','Taro trễ 4 ngày làm → đỏ',h.TARO);
ok(h.HT.m==='dd','HT hẹn sau deadline → đỏ đậm',h.HT);
ok(h.PHOI_C.xong&&!h.PHOI_C.m,'Phôi đã đủ → không xét',h.PHOI_C);
// chưa hẹn
o={sl:50,thieu:50,dl:'2026-11-20',btp:['PHOI','SON','UV','HT','DG'],pl:{loai:'CHUOI'},qua:{},hen:{}};
h=ctx.dhHanChuan_(o,cs,'2026-11-16');
ok(h.PHOI && h.PHOI.m && h.PHOI.chua,'chuôi: Phôi chưa hẹn, quá / sát hạn chuẩn → cảnh báo',h.PHOI);
ok(!h.SON.m,'bộ phận sau (chưa tới) chưa hẹn → không cảnh báo',h.SON);
o.dn={o:'UV'}; h=ctx.dhHanChuan_(o,cs,'2026-11-16');
ok(!h.PHOI.m && h.UV.chua,'hàng đang ở UV → xét UV, bỏ Phôi/Sơn',[h.PHOI,h.UV]);
ok(ctx.dhHanChuan_({sl:5,thieu:5,dl:'2026-09-01',btp:GAY,pl:{loai:'GAY'}},cs,'2026-11-16')===null,'trễ > 30 ngày → bỏ');
ok(ctx.dhHanChuan_({sl:5,thieu:0,dl:'2026-12-01',btp:GAY,pl:{loai:'GAY'}},cs,'2026-11-16')===null,'dòng đã đủ → bỏ');
ok(ctx.dhHanChuan_({sl:5,thieu:5,dl:'2026-12-01',btp:[],pl:{loai:'PK'}},cs,'2026-11-16')===null,'phụ kiện → bỏ');
// email: lần 1 có, lần 2 không đổi → không lặp
const e=x=>String(x),so=x=>String(x);
o={maDon:'D1',ten:'Gậy A',tab:'KHO',sl:100,thieu:100,dl:'2026-11-28',btp:GAY,pl:{loai:'GAY'},qua:{},hen:{HT:'2026-11-30'}};
let m1=ctx.dhHanChuanEmail_([o],cs,e,so,false); let m2=ctx.dhHanChuanEmail_([o],cs,e,so,false);
ok(/D1/.test(m1)&&/Hoàn thiện/.test(m1),'email lần 1 có dòng đỏ đậm, gom theo bộ phận',m1.slice(0,200));
ok(!/D1/.test(m2),'email lần 2 (không đổi) không lặp lại',m2.slice(0,300));
o.hen.HT='2026-12-02'; let m3=ctx.dhHanChuanEmail_([o],cs,e,so,false);
ok(/D1/.test(m3)&&/\(đổi\)/.test(m3),'hẹn đổi → báo lại, ghi (đổi)');
ok(JSON.stringify(ctx.dhCsBP_({SON:'abc',UV:200}))===JSON.stringify(Object.assign(ctx.dhCsBP_(null),{UV:200})),'bảng công suất: số sai về mặc định');
// 14/11 (2 làn): hạn ngầm đơn lẻ + công suất thực đo
o={tab:'WEB LẺ CUSTOM',ngayDat:'2026-11-12',sl:10,thieu:10,dl:'',btp:GAY,pl:{loai:'GAY'},qua:{},hen:{}};
ok(ctx.dhDlNgam_(o)==='2026-11-22','đơn lẻ không deadline → hạn ngầm ngày đặt + 10',ctx.dhDlNgam_(o));
ok(ctx.dhDlNgam_({tab:'OEM',ngayDat:'2026-11-12'})==='','kênh không lẻ → không hạn ngầm');
h=ctx.dhHanChuan_(o,cs,'2026-11-16'); ok(h&&h.DG.h==='2026-11-22','hạn chuẩn dùng hạn ngầm',h&&h.DG);
ctx.dhDongGoiNgay_=()=>({ngay:{'2026-11-02':300,'2026-11-03':0,'2026-11-04':280,'2026-11-05':260,'2026-11-06':320,'2026-11-07':250,'2026-11-09':290,'2026-11-08':999}});
let d=ctx.dhCsDo_(cs); ok(d&&d.sp===285&&d.n===6,'thực đo = trung vị ngày làm > 0 (bỏ CN, bỏ 0)',d);
ctx.dhDongGoiNgay_=()=>({ngay:{'2026-11-02':300,'2026-11-04':280}}); ok(ctx.dhCsDo_(cs)===null,'dưới 5 ngày số → không dùng');
console.log(n+' kiểm thử, '+l+' lỗi');
