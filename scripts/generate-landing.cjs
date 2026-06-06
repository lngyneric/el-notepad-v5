const f=require("fs"),p=require("path");
function walk(d,list){f.readdirSync(d).forEach(n=>{const fp=p.join(d,n);if(f.statSync(fp).isDirectory())walk(fp,list);else if(n.endsWith(".md"))list.push(fp);});}
const all=[];walk(p.join(__dirname,"..","content","wiki"),all);
const ld=p.join(__dirname,"..","public","landing");
f.mkdirSync(ld,{recursive:true});
const doms={};
for(const fp of all){
const slug=fp.split("content"+p.sep+"wiki"+p.sep)[1];if(!slug||!slug.includes("concepts"+p.sep))continue;
const parts=slug.split(p.sep).join("/").split("/");
const d=parts[0];if(!doms[d])doms[d]={};
const c=f.readFileSync(fp,"utf-8");
const catMatch=c.match(/^category:[ 	]*"(.+?)"/m);
const cat=catMatch?catMatch[1]:"其他";
if(!doms[d][cat])doms[d][cat]=[];
const tMatch=c.match(/^title:[ 	]*"(.+?)"/m);
const sMatch=c.match(/^summary:[ 	]*"(.+?)"/m);
const title=tMatch?tMatch[1]:parts[parts.length-1].replace(".md","");
const summary=sMatch?sMatch[1]:"";
doms[d][cat].push({t:title,slug:"/wiki/"+parts.join("/").replace(".md",""),s:summary,c:cat});
}
for(const[d,cats]of Object.entries(doms)){
const dd=p.join(ld,d);f.mkdirSync(dd,{recursive:true});
const all=Object.values(cats).flat();
f.writeFileSync(p.join(dd,"index.html"),pg(d,all,true));
for(const[c,cards]of Object.entries(cats)){
const cs=c.replace(/[<>:"/\|?*]/g,"-").toLowerCase();
f.writeFileSync(p.join(dd,cs+".html"),pg(c,cards,false));}}
f.writeFileSync(p.join(ld,"index.html"),main(doms));
console.log("Done: "+Object.keys(doms).length+" domains, "+Object.values(doms).reduce((a,x)=>a+Object.values(x).flat().length,0)+" cards");
function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function pg(title,cards,showCat){
var items="";for(var i=0;i<cards.length;i++){
var c=cards[i];
var badge=showCat&&c.c?"<span class=b>"+esc(c.c)+"</span>":"";
items+="<a class=card href="+c.slug+">"+badge+"<h3>"+esc(c.t)+"</h3><p>"+esc(c.s||"")+"</p></a>";}
return"<!DOCTYPE html><html lang=zh><meta charset=utf-8><meta name=viewport content=width=device-width,initial-scale=1><script src=/static/chat-widget.js defer></script><title>"+esc(title)+"</title><style>*{margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#f5f5f5;color:#222}body.dark{background:#161618;color:#e0e0e0}header{background:linear-gradient(135deg,#284b63,#3a6b83);color:#fff;padding:32px;text-align:center}h1{font-size:28px}.container{max-width:1200px;margin:0 auto;padding:24px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}.card{background:#fff;border-radius:8px;padding:20px;color:inherit;box-shadow:0 1px 4px rgba(0,0,0,.08);position:relative;display:block;text-decoration:none}body.dark .card{background:#1e1e2e}.card h3{font-size:16px;margin-bottom:8px;color:#284b63}body.dark .card h3{color:#7b97aa}.card p{font-size:13px;color:#666}.b{position:absolute;top:12px;right:12px;background:#e8f0f5;color:#284b63;font-size:11px;padding:2px 8px;border-radius:4px}body.dark .b{background:#2a3a4a;color:#7b97aa}.count{text-align:center;color:#888;font-size:13px;margin-bottom:16px}@media(max-width:600px){.grid{grid-template-columns:1fr}}.nb{display:flex;gap:0;padding:0;background:#284b63;font-size:13px;line-height:36px;height:36px;overflow:hidden}body.dark .nb{background:#1a1a2e}.nb a{color:rgba(255,255,255,.7);text-decoration:none;padding:0 16px;white-space:nowrap}.nb a:hover{background:rgba(255,255,255,.1);color:#fff}.nb a.on{background:rgba(255,255,255,.15);color:#fff}@media(max-width:600px){.nb{font-size:12px;line-height:34px;height:34px}.nb a{flex:1;text-align:center;padding:0 4px}}</style><body><div class=nb><a href=/>Home</a><a href=/landing/ class=on>Map</a><a href=/wiki/>Wiki</a></div><header><h1>"+esc(title)+"</h1></header><div class=container><p class=count>"+cards.length+" items</p><div class=grid>"+items+"</div></div>";}
function main(doms){
var sec="";var entries=Object.entries(doms).sort();
for(var i=0;i<entries.length;i++){
var d=entries[i][0];var cats=entries[i][1];
var total=0;var catList=[];for(var ck in cats){total+=cats[ck].length;catList.push([ck,cats[ck].length]);}
catList.sort(function(a,b){return b[1]-a[1]});if(catList.length>10)catList=catList.slice(0,10);
var links="";for(var j=0;j<catList.length;j++){var cn=catList[j][0];var cc=catList[j][1];
var cs=cn.replace(/[<>:"/\|?*]/g,"-").toLowerCase();
links+="<a href=/landing/"+d+"/"+cs+".html class=cl><span class=cn>"+esc(cn)+"</span><span class=cc>"+cc+"</span></a>";}
sec+="<div class=ds><h2><a href=/landing/"+d+"/>"+esc(d)+"</a><span style=color:#999;font-size:13px;margin-left:8px>"+total+" items</span></h2><div class=cg>"+links+"</div></div>";}
return"<!DOCTYPE html><html lang=zh><meta charset=utf-8><meta name=viewport content=width=device-width,initial-scale=1><script src=/static/chat-widget.js defer></script><title>EL-Notepad</title><style>*{margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#f5f5f5;color:#222}body.dark{background:#161618;color:#e0e0e0}header{background:linear-gradient(135deg,#284b63,#3a6b83);color:#fff;padding:48px;text-align:center}h1{font-size:32px}.container{max-width:1000px;margin:0 auto;padding:24px}.ds{background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.06)}body.dark .ds{background:#1e1e2e}.ds h2{font-size:20px}.ds h2 a{color:#284b63;text-decoration:none}.cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:8px}.cl{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#f8f9fa;border-radius:6px;text-decoration:none;color:#333;font-size:14px}body.dark .cl{background:#2a2a3e;color:#ccc}.cl:hover{background:#e8f0f5}.cn{font-weight:500}.cc{background:#284b63;color:#fff;font-size:11px;padding:2px 8px;border-radius:10px}@media(max-width:600px){.cg{grid-template-columns:1fr}}footer{text-align:center;padding:32px;color:#888}.nb{display:flex;gap:0;padding:0;background:#284b63;font-size:13px;line-height:36px;height:36px;overflow:hidden}body.dark .nb{background:#1a1a2e}.nb a{color:rgba(255,255,255,.7);text-decoration:none;padding:0 16px;white-space:nowrap}.nb a:hover{background:rgba(255,255,255,.1);color:#fff}.nb a.on{background:rgba(255,255,255,.15);color:#fff}@media(max-width:600px){.nb{font-size:12px;line-height:34px;height:34px}.nb a{flex:1;text-align:center;padding:0 4px}}</style><body><div class=nb><a href=/>Home</a><a href=/landing/ class=on>Map</a><a href=/wiki/>Wiki</a></div><header><h1>EL-Notepad Knowledge Map</h1></header><div class=container>"+sec+"<div class=ds><h2><a href=/wiki/摄影鉴赏/>📷 摄影鉴赏</a></h2><p class=dc>20 photos · 竖向写真 + 横向全景</p></div><footer><a href=/>Home</a> | <a href=/wiki/>Full Wiki</a></footer></div>";}