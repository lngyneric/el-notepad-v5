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
md+="<div class=g-item data-src=https://pub-2f93b1eccd0743b9b0e353c78356c150.r2.dev/"+encodeURIComponent(fn)+"><img src=https://pub-2f93b1eccd0743b9b0e353c78356c150.r2.dev/"+encodeURIComponent(fn)+" loading=lazy alt=\""+alt+"\"></div>"+NL;}
md+="</div>"+NL+NL;});
if(groups["其他"]){
md+="## 其他 ("+groups["其他"].length+")"+NL+NL+"<div class=g-p>"+NL;
for(var i=0;i<groups["其他"].length;i++){
md+="<div class=g-item data-src=https://pub-2f93b1eccd0743b9b0e353c78356c150.r2.dev/"+encodeURIComponent(groups["其他"][i])+"><img src=https://pub-2f93b1eccd0743b9b0e353c78356c150.r2.dev/"+encodeURIComponent(groups["其他"][i])+" loading=lazy></div>"+NL;}
md+="</div>"+NL;}
var css=".g-p,.g-l{display:grid;gap:8px;margin:16px 0}.g-p{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}.g-l{grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}.g-p .g-item,.g-l .g-item{display:block;border-radius:6px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.1);transition:transform .15s;line-height:0}.g-p .g-item:hover,.g-l .g-item:hover{transform:scale(1.02);cursor:pointer}.g-p img,.g-l img{width:100%;height:auto;display:block;image-orientation:from-image}@media(max-width:600px){.g-p{grid-template-columns:repeat(2,1fr)}.g-l{grid-template-columns:1fr}.g-p img,.g-l img{min-height:120px;object-fit:cover}}@media(min-width:601px){.g-p img,.g-l img{min-height:160px;object-fit:cover}}";
md+="<style>"+css+"</style>"+NL;
md+="<script src=/static/gallery-lightbox.js defer></script>"+NL;md+="\n<script>// Gallery Lightbox v2 - supports div.g-item\r\n(function(){\r\n  document.addEventListener(\"click\",function(e){\r\n    var a=e.target.closest(\".g-item\");\r\n    if(!a)return;\r\n    var src=a.dataset.src;\r\n    if(!src)src=a.querySelector(\"img\")&&a.querySelector(\"img\").src;\r\n    if(!src)return;\r\n    var lb=document.getElementById(\"gallery-lb\");\r\n    if(!lb){\r\n      lb=document.createElement(\"div\");\r\n      lb.id=\"gallery-lb\";\r\n      lb.innerHTML=\"<span id=gallery-lb-close>&times;</span><img id=gallery-lb-img>\";\r\n      var css=\"#gallery-lb{display:none;position:fixed;z-index:99999;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.95);cursor:pointer;align-items:center;justify-content:center}#gallery-lb.open{display:flex}#gallery-lb-img{max-width:95vw;max-height:95vh;object-fit:contain}#gallery-lb-close{position:absolute;top:16px;right:24px;color:#fff;font-size:36px;font-weight:700;z-index:10}@media(orientation:landscape){#gallery-lb-img{max-width:98vw;max-height:98vh}}\";\r\n      var s=document.createElement(\"style\");\r\n      s.textContent=css;\r\n      document.head.appendChild(s);\r\n      document.body.appendChild(lb);\r\n      lb.onclick=function(ev){\r\n        if(ev.target===lb||ev.target.id===\"gallery-lb-close\"){\r\n          lb.classList.remove(\"open\");\r\n          document.body.style.overflow=\"\";\r\n        }\r\n      };\r\n    }\r\n    var img=document.getElementById(\"gallery-lb-img\");\r\n    img.src=src;\r\n    lb.classList.add(\"open\");\r\n    document.body.style.overflow=\"hidden\";\r\n  });\r\n})();\r\n</script>\n"+NL;md+="<script>document.addEventListener(\"click\",function(e){var el=e.target;while(el&&!el.classList)el=el.parentElement;if(!el||!el.classList.contains(\"g-item\"))return;e.stopPropagation();e.stopImmediatePropagation();var src=el.dataset.src||(el.querySelector(\"img\")||{}).src;if(!src)return;var lb=document.getElementById(\"gallery-lb\");if(!lb){lb=document.createElement(\"div\");lb.id=\"gallery-lb\";lb.innerHTML=\"<span id=gallery-lb-close>&times;</span><img id=gallery-lb-img>\";var css=\"#gallery-lb{display:none;position:fixed;z-index:99999;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.95);cursor:pointer;align-items:center;justify-content:center}#gallery-lb.open{display:flex}#gallery-lb-img{max-width:95vw;max-height:95vh;object-fit:contain}#gallery-lb-close{position:absolute;top:16px;right:24px;color:#fff;font-size:36px;font-weight:700;z-index:10}@media(orientation:landscape){#gallery-lb-img{max-width:98vw;max-height:98vh}}\";var s=document.createElement(\"style\");s.textContent=css;document.head.appendChild(s);document.body.appendChild(lb);lb.onclick=function(ev){if(ev.target===lb||ev.target.id===\"gallery-lb-close\"){lb.classList.remove(\"open\");document.body.style.overflow=\"\"}};}document.getElementById(\"gallery-lb-img\").src=src;lb.classList.add(\"open\");document.body.style.overflow=\"hidden\"},true);</script>"+NL;f.writeFileSync(p.join(__dirname,"..","content","wiki","摄影鉴赏","index.md"),md);
console.log("[gallery] "+j.length+" photos, "+Object.keys(groups).length+" sections");