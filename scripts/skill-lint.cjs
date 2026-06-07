const fs=require("fs"),p=require("path");
function walk(d){let r=[];try{fs.readdirSync(d).forEach(function(f){let fp=p.join(d,f);if(fs.statSync(fp).isDirectory())r.push(...walk(fp));else if(f.endsWith(".md"))r.push(fp);})}catch(e){}return r;}
function main(){let wd=p.join(__dirname,"..","content","wiki");console.log("");console.log("=== LLM Wiki LINT ===");
let cfs=walk(wd).filter(function(f){return f.includes("concepts"+p.sep)&&!f.endsWith("index.md");});console.log("Concepts:",cfs.length);
let hi=0,me=0,lo=0,noR=[],noS=[],ex=[];const D=86400000,N=Date.now();
cfs.forEach(function(fp){let c=fs.readFileSync(fp,"utf-8");let r=c.match(/^reliability:[	 ]*"(.*?)"/m);let s=c.match(/^source-updated:[	 ]*"(.*?)"/m);let t=(c.match(/^title:[	 ]*"(.*?)"/m)||[,""])[1];
if(!r)noR.push(t||p.basename(fp,".md"));else if(r[1]==="high")hi++;else if(r[1]==="medium")me++;else lo++;
if(s){let d=(N-new Date(s[1]).getTime())/D;if(d>15)ex.push({t,days:Math.round(d)});}else noS.push(t||p.basename(fp,".md"));});
console.log("");console.log("Reliability: high="+hi+" medium="+me+" low="+lo);
if(noR.length){console.log("Missing reliability:",noR.length);noR.slice(0,5).forEach(function(t){console.log("  - "+t);});}
if(ex.length){console.log("");console.log("Expired (>15d):");ex.forEach(function(e){console.log("  - "+e.t+" ("+e.days+"d)");});}
console.log("");console.log("Orphans:");let af=walk(wd).filter(function(f){return f.endsWith(".md");});let or=0;
af.forEach(function(fp){if(fp.includes("index.md")||fp.includes("log.md")||fp.includes("SCHEMA"))return;
let n=p.basename(fp,".md");let rl=fp.split(p.sep+"wiki"+p.sep)[1]||"";let lk=false;
af.forEach(function(ot){if(ot!==fp){let c2=fs.readFileSync(ot,"utf-8");if(c2.includes("[["+n+"]]")||c2.includes(rl.split(p.sep).join("/")))lk=true;}});
if(!lk){or++;if(or<=5)console.log("  - "+rl.split(p.sep).join("/"));}});
console.log(or>5?"  ... total "+or:or===0?"  None":"");}
main();
