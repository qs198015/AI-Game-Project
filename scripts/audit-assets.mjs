import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceFiles = ['index.html', 'styles.css', 'game.js', 'sw.js', 'manifest.webmanifest'];
const assetPattern = /assets\/[A-Za-z0-9_./-]+\.(?:png|svg|mp4)/g;
const references = new Map();

for (const source of sourceFiles) {
  const contents = fs.readFileSync(path.join(root, source), 'utf8');
  for (const asset of contents.match(assetPattern) || []) {
    if (!references.has(asset)) references.set(asset, new Set());
    references.get(asset).add(source);
  }
}

const missing = [];
const wrongCase = [];
for (const asset of references.keys()) {
  const parts = asset.split('/');
  let current = root;
  for (const part of parts) {
    const entries = fs.readdirSync(current);
    if (!entries.includes(part)) {
      const caseMatch = entries.find(entry => entry.toLowerCase() === part.toLowerCase());
      if (caseMatch) wrongCase.push(`${asset}（实际为 ${caseMatch}）`);
      else missing.push(asset);
      break;
    }
    current = path.join(current, part);
  }
}

if (missing.length || wrongCase.length) {
  if (missing.length) console.error(`缺少资源：\n${missing.join('\n')}`);
  if (wrongCase.length) console.error(`资源路径大小写错误：\n${wrongCase.join('\n')}`);
  process.exitCode = 1;
} else {
  const active = [...references.keys()].map(asset => ({ asset, bytes: fs.statSync(path.join(root, asset)).size }));
  const total = active.reduce((sum, item) => sum + item.bytes, 0);
  const large = active.filter(item => item.bytes >= 2 * 1024 * 1024).sort((a, b) => b.bytes - a.bytes);
  console.log(`资源审计通过：${active.length} 个运行时资源，${(total / 1024 / 1024).toFixed(1)} MiB，路径大小写全部正确。`);
  if (large.length) console.log(`大图片监测（≥2 MiB）：${large.map(item => `${item.asset} ${(item.bytes / 1024 / 1024).toFixed(1)} MiB`).join('；')}`);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const menuButtons = ['start-game', 'tutorial', 'story-mode', 'black-moon-trial', 'pet-gallery', 'settings'];
for (const name of menuButtons) {
  for (const suffix of ['', '-1']) {
    const asset = `assets/menu-buttons/button-${name}${suffix}.png`;
    if (!html.includes(asset)) throw new Error(`主菜单按钮未接入：${asset}`);
  }
}
if (!html.includes('assets/battle/backgrounds/battle_screen_reference.png')) throw new Error('战斗背景未使用新增资源路径');
