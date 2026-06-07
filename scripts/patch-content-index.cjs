const fs=require("fs");
const fp=".quartz/plugins/content-index/dist/index.js";
let c=fs.readFileSync(fp,"utf8");
const m="description: data.description ?? \"\"";
const i=",
          category: frontmatter.category ?? \"\",
          summary: frontmatter.summary ?? \"\"";
if(c.includes(m)){c=c.replace(m,m+i);fs.writeFileSync(fp,c,"utf8");console.log("OK");}
else console.log("NOT FOUND");