import fs from 'fs';
import path from 'path';

const articlesDir = 'articles';
const indexPath = 'index.html';
const today = new Date();
const date = today.toISOString().split('T')[0];
const daySeed = Math.floor(today.getTime() / 86400000);

const RAKUTEN_MARKET_URL = 'https://rpx.a8.net/svt/ejp?a8mat=4B1XE0+30CWVM+2HOM+67Z9T&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26043007918_4B1XE0_30CWVM_2HOM_67Z9T%3Fpc%3Dhttp%253A%252F%252Fwww.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252F';
const RAKUTEN_TRAVEL_URL = 'https://rpx.a8.net/svt/ejp?a8mat=4B1XE0+30CWVM+2HOM+6I9N5&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0eb4779e.5d30c5ba.0eb4779f.b871e4e3%2Fa26043007918_4B1XE0_30CWVM_2HOM_6I9N5%3Fpc%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F';
const RAKUTEN_MARKET_PIXEL = 'https://www13.a8.net/0.gif?a8mat=4B1XE0+30CWVM+2HOM+67Z9T';
const RAKUTEN_TRAVEL_PIXEL = 'https://www13.a8.net/0.gif?a8mat=4B1XE0+30CWVM+2HOM+6I9N5';

const evergreenTopics = [
  'プログラマー 副業 何から始める',
  'GitHub Pages 使い方 初心者',
  '個人ブログ 続けるコツ',
  'プログラミング 学習 ロードマップ',
  '個人開発 アイデア 出し方',
  'エンジニア ポートフォリオ 作り方',
  'JavaScript 初心者 勉強方法',
  'Python 自動化 初心者',
  'Linux コマンド 基本',
  '副業 ブログ 始め方'
];

const toolTopics = [
  'GitHub Actions 使い方',
  'VS Code おすすめ拡張機能',
  'Notion タスク管理 使い方',
  'Google Search Console 始め方',
  'Canva アイキャッチ 作り方',
  'Vercel デプロイ 方法',
  'Cloudflare Pages 使い方',
  'Figma ワイヤーフレーム 作り方'
];

const fallbackDailyTopics = [
  'AI 開発ツール 最新動向',
  '生成AI 仕事 活用方法',
  '副業 トレンド 2026',
  'Web制作 需要',
  'ノーコード ツール 比較'
];

function pickRotating(list, count, offset = 0) {
  const result = [];
  for (let i = 0; i < count; i++) result.push(list[(daySeed + offset + i) % list.length]);
  return result;
}

async function fetchDailyTopics() {
  try {
    const url = 'https://trends.google.co.jp/trending/rss?geo=JP';
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const xml = await res.text();
    const matches = [...xml.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/g)]
      .map((m) => (m[1] || m[2] || '').replace(/&amp;/g, '&').trim())
      .filter(Boolean)
      .filter((title) => !title.includes('Daily Search Trends'));
    return [...new Set(matches)].slice(0, 5);
  } catch (error) {
    console.log('Trend fetch failed. Use fallback topics.', error.message);
    return fallbackDailyTopics;
  }
}

function safeSlug(input, index) {
  const ascii = input.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
  return `${date}-${String(index + 1).padStart(2, '0')}-${ascii || 'article'}`;
}

function escapeHtml(str) {
  return str.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function affiliateBlock(category) {
  const isTravel = category === '今日のトピック';
  const url = isTravel ? RAKUTEN_TRAVEL_URL : RAKUTEN_MARKET_URL;
  const pixel = isTravel ? RAKUTEN_TRAVEL_PIXEL : RAKUTEN_MARKET_PIXEL;
  const label = isTravel ? '楽天トラベルで関連サービスを見る' : '楽天で関連商品を探す';
  const text = isTravel
    ? 'イベント参加や勉強会、作業旅行を考える場合は、宿泊先や移動先の候補も早めに確認しておくと安心です。'
    : '学習本、作業用ガジェット、デスク周りの道具などは、必要になったタイミングで比較して選ぶのがおすすめです。';

  return `<aside class="affiliate-box">
        <h3>関連リンク</h3>
        <p>${text}</p>
        <a class="btn" href="${url}" rel="nofollow sponsored">${label}</a>
        <img border="0" width="1" height="1" src="${pixel}" alt="" />
      </aside>`;
}

function articleBody({ title, category }) {
  const escapedTitle = escapeHtml(title);
  const escapedCategory = escapeHtml(category);
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapedTitle} | エンジニア副業ラボ</title>
  <meta name="description" content="${escapedTitle}について、初心者向けに手順と注意点を整理します。" />
  <link rel="stylesheet" href="../style.css" />
</head>
<body>
  <header>
    <h1><a href="../index.html">エンジニア副業ラボ</a></h1>
  </header>
  <main>
    <article class="article-page">
      <p class="post-date">公開日: ${date} / カテゴリ: ${escapedCategory}</p>
      <h2>${escapedTitle}</h2>
      <p>この記事では「${escapedTitle}」について、個人でサイト運営や学習を進める人向けに基本を整理します。</p>
      <h3>この記事でわかること</h3>
      <ul>
        <li>最初に確認するポイント</li>
        <li>小さく試すための手順</li>
        <li>失敗しやすい注意点</li>
        <li>次に取るべき行動</li>
      </ul>
      ${affiliateBlock(category)}
      <h3>最初にやること</h3>
      <p>まずは目的を一つに絞ります。アクセスを増やしたいのか、学習記録を残したいのか、サービス紹介につなげたいのかで記事の書き方は変わります。</p>
      <h3>具体的な進め方</h3>
      <p>検索する人が知りたい順番に合わせて、結論、理由、手順、注意点の流れでまとめます。専門用語を使う場合は、最初に短く説明します。</p>
      ${affiliateBlock(category)}
      <h3>注意点</h3>
      <p>自動生成だけに頼ると内容が薄くなりやすいです。公開後にアクセスがある記事から順番に、人間の経験やスクリーンショットを追加して改善します。</p>
      <h3>まとめ</h3>
      <p>「${escapedTitle}」は、まず小さく試して継続的に改善するのが現実的です。この記事も必要に応じて追記していきます。</p>
    </article>
  </main>
</body>
</html>
`;
}

function updateIndex() {
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  const files = fs.readdirSync(articlesDir).filter((file) => file.endsWith('.html')).sort().reverse();
  const items = files.map((file) => {
    const title = file.replace(/^\d{4}-\d{2}-\d{2}-\d{2}-/, '').replace(/\.html$/, '').replace(/-/g, ' ').replace(/\barticle\b/g, '記事');
    return `          <article class="card auto-article"><h3>${escapeHtml(title)}</h3><p>自動追加された記事です。</p><a href="articles/${encodeURI(file)}">続きを読む</a></article>`;
  }).join('\n');
  const autoBlock = `        <!-- AUTO_ARTICLES_START -->\n${items}\n        <!-- AUTO_ARTICLES_END -->`;
  if (indexHtml.includes('<!-- AUTO_ARTICLES_START -->')) {
    indexHtml = indexHtml.replace(/        <!-- AUTO_ARTICLES_START -->[\s\S]*?        <!-- AUTO_ARTICLES_END -->/, autoBlock);
  } else {
    indexHtml = indexHtml.replace('        </div>\n      </section>', `${autoBlock}\n        </div>\n      </section>`);
  }
  fs.writeFileSync(indexPath, indexHtml);
}

fs.mkdirSync(articlesDir, { recursive: true });
const dailyTopics = await fetchDailyTopics();
const topics = [
  ...dailyTopics.slice(0, 5).map((title) => ({ title, category: '今日のトピック' })),
  ...pickRotating(evergreenTopics, 4, 2).map((title) => ({ title, category: '恒常検索' })),
  { title: pickRotating(toolTopics, 1, 7)[0], category: 'ツール' }
].slice(0, 10);

topics.forEach((topic, index) => {
  const file = path.join(articlesDir, `${safeSlug(topic.title, index)}.html`);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, articleBody(topic));
    console.log('Generated:', file);
  } else {
    console.log('Skipped existing:', file);
  }
});

updateIndex();
console.log(`Done. ${topics.length} topics processed.`);
