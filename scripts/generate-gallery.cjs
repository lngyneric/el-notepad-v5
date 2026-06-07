const f=require("fs"),p=require("path");
const NL=String.fromCharCode(10);
var cd=p.join(__dirname,"..","content","wiki","摄影鉴赏","Camera Roll");
if(!f.existsSync(cd))process.exit(0);
var j=f.readdirSync(cd).filter(function(x){return x.endsWith(".jpg");}).sort();
var groups={};
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
j.forEach(function(fn){
var sec="其他";
if(fn.startsWith("portrait-"))sec="竖向写真";
else if(fn.startsWith("panorama-"))sec="横向全景";
else if(fn.startsWith("冰岛法国-")){
var parts=fn.replace(/.jpg$/,"").split("-");
sec=parts.length>=3?"冰岛·"+parts[1]:"冰岛法国";}
if(!groups[sec])groups[sec]=[];groups[sec].push(fn);
});
var orders=["竖向写真","横向全景"].concat(Object.keys(groups).filter(function(k){return k.startsWith("冰岛");}).sort());
var md="---"+NL+"title: \"摄影鉴赏\""+NL+"description: \"个人摄影作品集\""+NL+"tags: [photography, gallery]"+NL+"---"+NL+NL;
md+="# 摄影鉴赏"+NL+NL;
md+="> 共 "+j.length+" 张照片"+NL+NL;
orders.forEach(function(section){
var items=groups[section];if(!items||items.length===0)return;
var cls=(section==="横向全景")?"l":"p";
md+="## "+section+" ("+items.length+")"+NL+NL;
md+="<div class=g-"+cls+">"+NL;
for(var i=0;i<items.length;i++){
var fn=items[i];
var alt=esc(fn.replace(/.jpg$/,""));
md+="<a href=https://pub-2f93b1eccd0743b9b0e353c78356c150.r2.dev/"+encodeURIComponent(fn)+" target=_blank><img src=https://pub-2f93b1eccd0743b9b0e353c78356c150.r2.dev/"+encodeURIComponent(fn)+" loading=lazy alt=\""+alt+"\"></a>"+NL;}
md+="</div>"+NL+NL;});
if(groups["其他"]){
md+="## 其他 ("+groups["其他"].length+")"+NL+NL+"<div class=g-p>"+NL;
for(var i=0;i<groups["其他"].length;i++){
md+="<a href=https://pub-2f93b1eccd0743b9b0e353c78356c150.r2.dev/"+encodeURIComponent(groups["其他"][i])+" target=_blank><img src=https://pub-2f93b1eccd0743b9b0e353c78356c150.r2.dev/"+encodeURIComponent(groups["其他"][i])+" loading=lazy></a>"+NL;}
md+="</div>"+NL;}
var css=".g-p,.g-l{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin:16px 0}.g-l{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}.g-p a,.g-l a{display:block;border-radius:6px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.1);transition:transform .15s;line-height:0}.g-p a:hover,.g-l a:hover{transform:scale(1.02)}.g-p img,.g-l img{width:100%;height:auto;display:block}@media(max-width:600px){.g-p{grid-template-columns:repeat(2,1fr)}.g-l{grid-template-columns:1fr}}";
md+="<style>"+css+"</style>"+NL;
f.writeFileSync(p.join(__dirname,"..","content","wiki","摄影鉴赏","index.md"),md);
console.log("[gallery] "+j.length+" photos, "+Object.keys(groups).length+" sections");