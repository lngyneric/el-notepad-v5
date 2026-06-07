const fs=require("fs"),p=require("path");
function search(i,q){const Q=q.toLowerCase();const R=Q.split(/[s,]+/).filter(t=>t.length>0);const E=[];
for(const t of R){for(let i=0;i<t.length-1;i++){const b=t.slice(i,i+2);if(b.length>=2&&b.match(/[一-鿿]/))E.push(b);}}
let A=[...R,...E];let S=[];
for(const[s,item]of Object.entries(i)){if(!s.includes("/concepts/"))continue;
let tx=(item.title+" "+(item.content||"")).toLowerCase();let sc=0;if(tx.includes(Q))sc+=20;
for(let t of A){if(t.length<2)continue;if(tx.includes(t)){if(item.title.toLowerCase().includes(t))sc+=5;let p=0;while((p=tx.indexOf(t,p))!==-1){sc++;p+=t.length;}}}
if(sc>0)S.push({slug:s,title:item.title,content:(item.content||"").slice(0,300),score:sc});}
return S.sort((a,b)=>b.score-a.score).slice(0,8);}
async function main(){let q=process.argv.slice(2).filter(a=>!a.startsWith("--")).join(" ");
if(!q){console.log("Usage: node scripts/skill-query.cjs <question> [--no-ai]");process.exit(0);}
let nA=process.argv.includes("--no-ai");let idx=p.join(__dirname,"public","static","contentIndex.json");
if(!fs.existsSync(idx)){console.log("Run npx quartz build first");process.exit(1);}
let index=JSON.parse(fs.readFileSync(idx,"utf-8"));let res=search(index,q);
console.log("");console.log("=== Search ===");
res.forEach(function(r,i){console.log(" "+(i+1)+". "+r.title);console.log("    "+r.slug);});
if(nA||!res.length)return;try{let url=process.env.CF_URL||"https://el-notepad-v5.pages.dev";
let resp=await fetch(url+"/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q})});
let d=await resp.json();
console.log("");console.log("=== AI ===");console.log(d.answer||"");if(d.sources){console.log("");console.log("Sources:");d.sources.forEach(function(s){console.log("  "+s);});}
}catch(e){console.log("AI err: "+e.message);}}main().catch(console.error);
