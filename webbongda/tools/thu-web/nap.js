// Chạy napDuLieu của Code.gs trong Node với Sheet giả từ CSV (gviz)
const fs=require('fs'),vm=require('vm'),path=require('path');
const DIR=path.join(__dirname,'sheet');
function csv(t){const rows=[];let r=[],f='',q=false;for(let i=0;i<t.length;i++){const c=t[i];
 if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++;}else q=false;}else f+=c;}
 else if(c==='"')q=true;else if(c===','){r.push(f);f='';}else if(c==='\n'){r.push(f);rows.push(r);r=[];f='';}else if(c!=='\r')f+=c;}
 if(f!==''||r.length){r.push(f);rows.push(r);}return rows;}
const sheets={};
for(const f of fs.readdirSync(DIR)){const n=f.replace('.csv','');const v=csv(fs.readFileSync(path.join(DIR,f),'utf8'));
 const w=Math.max(...v.map(r=>r.length),1);sheets[n]=v.map(r=>{while(r.length<w)r.push('');return r;});}
const sheetObj=n=>sheets[n]?{getDataRange:()=>({getValues:()=>sheets[n].map(r=>r.slice())}),getLastRow:()=>sheets[n].length,getLastColumn:()=>sheets[n][0].length,
 getRange:()=>({setValue(){},setValues(){},getValues:()=>[[]],setNumberFormat(){return this;}}),appendRow(){},getName:()=>n}:null;
const store={};
const ctx={console,
 SpreadsheetApp:{getActiveSpreadsheet:()=>({getSheetByName:sheetObj}),flush(){}},
 CacheService:{getScriptCache:()=>({get:k=>store[k]||null,put:(k,v)=>{store[k]=v},remove:k=>{delete store[k]}})},
 PropertiesService:{getScriptProperties:()=>({getProperty:()=>null,setProperty(){},deleteProperty(){}})},
 LockService:{getScriptLock:()=>({waitLock(){},tryLock:()=>true,releaseLock(){}})},
 Utilities:{getUuid:()=>'x',formatDate:(d)=>String(d),base64Encode:s=>Buffer.from(String(s)).toString('base64'),base64Decode:s=>[...Buffer.from(s,'base64')]},
 Session:{getScriptTimeZone:()=>'Asia/Ho_Chi_Minh'},HtmlService:{}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.argv[2],'utf8'),ctx);
const d=vm.runInContext('napDuLieu("")',ctx);
if(!d.ok){console.error(d);process.exit(1);}
fs.writeFileSync(path.join(__dirname,'data.json'),JSON.stringify(d));
console.log('ok doi',d.doi.length,'ct',d.cauThu.length,'tran',d.tranDau.length,'sk',d.suKien.length, 'gio', d.tranDau.map(t=>t.gioThiDau).join(' | '));
