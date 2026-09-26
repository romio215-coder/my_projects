// Run after editing portal.css or portal.js so returning visitors load the matching assets.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const extension of ['css', 'js']) {
  const content = fs.readFileSync(path.join(root, `portal.${extension}`));
  const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
  const asset = `assets/portal.${hash}.${extension}`;
  fs.writeFileSync(path.join(root, asset), content);
  html = html.replace(new RegExp(`\\./(?:assets/)?portal(?:\\.[a-f0-9]+)?\\.${extension}`, 'g'), `./${asset}`);
  console.log(asset);
}
fs.writeFileSync(path.join(root, 'index.html'), html);
