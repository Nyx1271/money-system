import fs from 'fs';
import path from 'path';

const topics = [
  'GitHub Pagesで個人サイトを公開する方法',
  'プログラマーが個人ブログを続けるコツ',
  '開発メモを記事に変える手順',
  'エンジニア向け便利ツールの選び方',
  '個人開発アイデアの見つけ方'
];

const today = new Date();
const date = today.toISOString().split('T')[0];
const topic = process.argv.slice(2).join(' ') || topics[Math.floor(today.getTime() / 86400000) % topics.length];
const slug = `${date}-${topic}`
  .replace(/[\\/:*?"<>|]/g, '')
  .replace(/\s+/g, '-')
  .toLowerCase();

const articlesDir = 'articles';
fs.mkdirSync(articlesDir, { recursive: true });

const articlePath = path.join(articlesDir, `${slug}.html`);
const articleHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${topic}</title>
  <link rel="stylesheet" href="../style.css" />
</head>
<body>
  <header>
    <h1><a href="../index.html">モダン副業ブログ</a></h1>
  </header>
  <main>
    <article class="article-page">
      <p class="post-date">公開日: ${date}</p>
      <h2>${topic}</h2>
      <p>この記事では「${topic}」について、個人でサイトを運営する人向けに基本を整理します。</p>
      <h3>最初にやること</h3>
      <p>まずは小さく始めて、実際に公開しながら改善します。最初から完璧を狙うより、公開後に直すほうが続きやすいです。</p>
      <h3>記事に入れる内容</h3>
      <ul>
        <li>読者の悩み</li>
        <li>具体的な手順</li>
        <li>注意点</li>
        <li>次にやること</li>
      </ul>
      <h3>まとめ</h3>
      <p>継続して記事を増やすことで、サイト全体の情報量が増えます。まずは週1本の更新を目標にします。</p>
    </article>
  </main>
</body>
</html>
`;

if (!fs.existsSync(articlePath)) {
  fs.writeFileSync(articlePath, articleHtml);
}

const indexPath = 'index.html';
let indexHtml = fs.readFileSync(indexPath, 'utf8');
const files = fs.readdirSync(articlesDir)
  .filter((file) => file.endsWith('.html'))
  .sort()
  .reverse();

const items = files.map((file) => {
  const title = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.html$/, '').replace(/-/g, ' ');
  return `          <article class="card auto-article"><h3>${title}</h3><p>自動追加された記事です。</p><a href="articles/${file}">続きを読む</a></article>`;
}).join('\n');

const autoBlock = `        <!-- AUTO_ARTICLES_START -->\n${items}\n        <!-- AUTO_ARTICLES_END -->`;

if (indexHtml.includes('<!-- AUTO_ARTICLES_START -->')) {
  indexHtml = indexHtml.replace(/        <!-- AUTO_ARTICLES_START -->[\s\S]*?        <!-- AUTO_ARTICLES_END -->/, autoBlock);
} else {
  indexHtml = indexHtml.replace('        </div>\n      </section>', `${autoBlock}\n        </div>\n      </section>`);
}

fs.writeFileSync(indexPath, indexHtml);
console.log('Generated article:', articlePath);
console.log('Updated index.html');
