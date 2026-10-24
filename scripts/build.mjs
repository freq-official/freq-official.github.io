// Dependency-free static rendering. Run: node scripts/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const shell=fs.readFileSync(path.join(root,'scripts/template.html'),'utf8');
const content=fs.readFileSync(path.join(root,'content.js'),'utf8');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const noop=()=>{};
for(const route of ['','news','profile','discography','live','video','contact']){
 const main={innerHTML:'',addEventListener:noop};
 const stub={addEventListener:noop,querySelector:()=>stub,querySelectorAll:()=>[],classList:{remove:noop},setAttribute:noop};
 const document={addEventListener:noop,querySelector:s=>s==='main'?main:stub,readyState:'loading',body:{style:{}}};
 const window={addEventListener:noop,scrollTo:noop};
 const context={window,document,location:{href:'https://freq-official.github.io/',hash:route?'#/'+route:'',pathname:'/index.html'},URL};
 vm.createContext(context);vm.runInContext(content,context);vm.runInContext(app,context);
 let html=shell.replace('<main id="main" tabindex="-1"></main>',`<main id="main" tabindex="-1">${main.innerHTML}</main>`);
 const file=(route||'index')+'.html';
 if(route){html=html.replace('<title>FRe:Q. | Official Website</title>',`<title>${route.toUpperCase()} | FRe:Q.</title>`).replace('rel="canonical" href="https://freq-official.github.io/"',`rel="canonical" href="https://freq-official.github.io/${file}"`).replace('property="og:url" content="https://freq-official.github.io/"',`property="og:url" content="https://freq-official.github.io/${file}"`)}
 fs.writeFileSync(path.join(root,file),html);
}
console.log('Rendered 7 static pages.');
