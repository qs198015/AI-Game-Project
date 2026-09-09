import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const required=['index.html','styles.css','game.js','manifest.webmanifest','sw.js','assets/icon.svg','assets/portraits/black-cat.svg','assets/portraits/crow.svg','assets/portraits/fox.svg','assets/portraits/rabbit.svg'];
for(const file of required){if(!fs.existsSync(path.join(root,file)))throw new Error(`缺少发布资源：${file}`);}
const html=fs.readFileSync('index.html','utf8');
const localRefs=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]).filter(ref=>!ref.startsWith('http')&&!ref.startsWith('data:'));
for(const ref of localRefs){const clean=ref.split('?')[0];if(clean==='./')continue;if(!fs.existsSync(path.join(root,clean)))throw new Error(`HTML 引用了不存在的资源：${ref}`);}
const sw=fs.readFileSync('sw.js','utf8');
for(const file of required.filter(file=>!['sw.js'].includes(file))){if(!sw.includes(`./${file}`)&&!['styles.css','game.js'].includes(file))console.warn(`缓存清单未显式包含：${file}`);}
const bytes=required.reduce((sum,file)=>sum+fs.statSync(path.join(root,file)).size,0);
if(bytes>250_000)throw new Error(`首发核心资源过大：${bytes} bytes`);
console.log(`发布校验通过：${required.length} 个核心资源，${Math.round(bytes/1024)} KiB`);
