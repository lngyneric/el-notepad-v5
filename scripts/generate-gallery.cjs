const f=require("fs"),p=require("path");
const NL=String.fromCharCode(10);
var cd=p.join(__dirname,"..","content","wiki","摄影鉴赏","Camera Roll");
if(!f.existsSync(cd))process.exit(0);
var j=f.readdirSync(cd).filter(function(x){return x.endsWith(".jpg");}).sort();
var pr=j.filter(function(x){return x.startsWith("portrait");});
var la=j.filter(function(x){return x.startsWith("panorama");});
var ot=j.filter(function(x){return !x.startsWith("portrait")&&!x.startsWith("panorama");});
var md="---"+NL+"title: \"摄影鉴赏\""+NL+"description: \"个人摄影作品集\""+NL+"tags: [photography, gallery]"+NL+"---"+NL+NL;
md+="# 摄影鉴赏"+NL+NL;
md+="> 共 "+j.length+" 张照片"+NL+NL;
function ad(title,items,cls){if(items.length===0)return;
md+="## "+title+" ("+items.length+")"+NL+NL;
md+="<div class=g-"+cls+">"+NL;
for(var i=0;i<items.length;i++){md+="<a href=camera-roll/"+encodeURIComponent(items[i])+" target=_blank><img src=camera-roll/"+encodeURIComponent(items[i])+" loading=lazy></a>"+NL;}
md+="</div>"+NL+NL;}
ad("竖向写真",pr,"p");
ad("横向全景",la,"l");
ad("其他",ot,"o");
var css=".g-p,.g-l,.g-o{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin:16px 0}.g-l{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}.g-p a,.g-l a,.g-o a{display:block;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);transition:transform .15s}.g-p a:hover,.g-l a:hover,.g-o a:hover{transform:scale(1.02)}.g-p img,.g-l img,.g-o img{width:100%;height:auto;display:block}@media(max-width:600px){.g-p,.g-o{grid-template-columns:repeat(2,1fr)}.g-l{grid-template-columns:1fr}}";
md+="<style>"+css+"</style>"+NL;
f.writeFileSync(p.join(__dirname,"..","content","wiki","摄影鉴赏","index.md"),md);
console.log("[gallery] "+j.length+" photos");