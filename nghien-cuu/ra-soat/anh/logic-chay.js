// Chạy giả lập 10 lá số đa dạng, lưu JSON để phân tích (logic-*)
const path='/home/user/githubforclaude160695/tuvi-app/tools/gia-lap.js';
const { ctx } = require(path);
const fs=require('fs');
const OUT=process.argv[2]||'/tmp/logic-out';
fs.mkdirSync(OUT,{recursive:true});
const L=[
 {name:'A',gender:'nam',day:12,month:3,year:1990,hour:8,minute:15},
 {name:'B',gender:'nu',day:25,month:7,year:1995,hour:14,minute:40},
 {name:'C',gender:'nam',day:3,month:11,year:1985,hour:23,minute:30},   // Tý muộn
 {name:'D',gender:'nu',day:19,month:1,year:2000,hour:23,minute:10},     // Tý muộn
 {name:'E',gender:'nam',day:7,month:9,year:1978,hour:5,minute:0},
 {name:'F',gender:'nu',day:30,month:4,year:1988,hour:19,minute:20},
 {name:'G',gender:'nam',day:15,month:6,year:2002,hour:11,minute:50},
 {name:'H',gender:'nu',day:1,month:12,year:1970,hour:2,minute:5},
 {name:'I',gender:'nam',day:22,month:2,year:1993,hour:16,minute:30},
 {name:'K',gender:'nu',day:9,month:10,year:1983,hour:0,minute:45},
];
L.forEach(x=>{ Object.assign(x,{calendar:'duong',viewYear:2026}); const t=Date.now(); const r=ctx.lapLaSoDayDu_(x); r.__ms=Date.now()-t; fs.writeFileSync(OUT+'/'+x.name+'.json',JSON.stringify(r)); console.log(x.name, r.__ms+'ms', r.moRongLoi||'', JSON.stringify(r.moRong&&r.moRong.loiTungHe||{}), JSON.stringify(r).length); });
