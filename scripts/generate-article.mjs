import fs from 'fs';
import path from 'path';

const articlesDir = 'articles';
const indexPath = 'index.html';
const today = new Date();
const date = today.toISOString().split('T')[0];
const seed = Math.floor(today.getTime() / 86400000);

const MARKET_URL = 'https://rpx.a8.net/svt/ejp?a8mat=4B1XE0+30CWVM+2HOM+67Z9T&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26043007918_4B1XE0_30CWVM_2HOM_67Z9T%3Fpc%3Dhttp%253A%252F%252Fwww.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252F';
const MARKET_PIXEL = 'https://www13.a8.net/0.gif?a8mat=4B1XE0+30CWVM+2HOM+67Z9T';
const A8_URL = 'https://px.a8.net/svt/ejp?a8mat=4B1XE0+2ZRH9U+0K+11ALC1';
const A8_BANNER = 'https://www29.a8.net/svt/bgt?aid=260430408181&wid=001&eno=01&mid=s00000000002006264000&mc=1';
const A8_PIXEL = 'https://www17.a8.net/0.gif?a8mat=4B1XE0+2ZRH9U+0K+11ALC1';
const DOMAIN_URL = 'https://px.a8.net/svt/ejp?a8mat=4B1XE0+30YCHE+50+2HV61T';
const DOMAIN_BANNER = 'https://www27.a8.net/svt/bgt?aid=260430408183&wid=001&eno=01&mid=s00000000018015094000&mc=1';
const DOMAIN_PIXEL = 'https://www18.a8.net/0.gif?a8mat=4B1XE0+30YCHE+50+2HV61T';

const keywordPool = [
  ['副業ブログ 始め方 エンジニア', '副業ブログはエンジニアに向いている？始め方と収益導線'],
  ['A8 登録 方法 初心者', 'A8.net登録前に決めることと記事へのつなげ方'],
  ['ドメイン 取得 必要 ブログ', '副業ブログにドメインは必要？取得するタイミング'],
  ['Python 副業 自動化', 'Python自動化を副業につなげる小さな作り方'],
  ['GitHub Pages ブログ 収益化', 'GitHub Pagesで副業ブログを作るときの注意点'],
  ['エンジニア 副業 何から', 'エンジニア副業は何から始めるべきか'],
  ['個人開発 収益化 方法', '個人開発を収益化するための最初の導線設計'],
  ['プログラミング 学習 続かない', 'プログラミング学習が続かない人の環境づくり'],
  ['ブログ 記事 書き方 SEO', '副業ブログの記事構成は結論から書くべき理由'],
  ['VS Code 拡張機能 副業', '副業開発を速くするVS Code環境の整え方'],
  ['Canva アイキャッチ 作り方', 'Canvaで副業ブログのアイキャッチを時短する方法'],
  ['Linux 開発環境 初心者', 'Linuxで副業開発環境を整える基本'],
  ['JavaScript Webツール 作り方', 'JavaScriptで小さなWebツールを作って公開する流れ'],
  ['ポートフォリオ 作り方 エンジニア', '副業につながるポートフォリオの作り方'],
  ['ブログ ASP 貼り方', 'ASP広告を自然に記事へ入れる書き方']
];

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function slug(s, i) { return `${date}-${String(i + 1).padStart(2,'0')}-${s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase() || 'seo'}`; }
function pick(items, n) { return Array.from({length:n}, (_,i) => items[(seed + i) % items.length]); }

function adBlock(kind) {
  if (kind === 'asp') return `<aside class="affiliate-box"><h3>PR: まずASPの出口を作る</h3><p>記事を書く前に案件を確認しておくと、読者の次の行動まで設計しやすくなります。</p><a href="${A8_URL}" rel="nofollow sponsored"><img width="300" height="250" alt="" src="${A8_BANNER.replaceAll('&','&amp;')}" /></a><img width="1" height="1" src="${A8_PIXEL}" alt="" /></aside>`;
  if (kind === 'domain') return `<aside class="affiliate-box"><h3>PR: 公開名が決まったらドメインを確認</h3><p>ブログや個人開発は名前を後から変えにくいので、早めに候補を確認しておくと安心です。</p><a href="${DOMAIN_URL}" rel="nofollow sponsored"><img width="728" height="90" alt="" src="${DOMAIN_BANNER.replaceAll('&','&amp;')}" /></a><img width="1" height="1" src="${DOMAIN_PIXEL}" alt="" /></aside>`;
  return `<aside class="affiliate-box"><h3>PR: 作業環境を整える</h3><p>毎日使う技術書、ガジェット、学習用品は継続に直結します。</p><a class="btn btn-primary" href="${MARKET_URL}" rel="nofollow sponsored">関連商品を探す</a><img width="1" height="1" src="${MARKET_PIXEL}" alt="" /></aside>`;
}

function articleHtml(keyword, title, index) {
  const kind = keyword.includes('A8') || keyword.includes('ASP') ? 'asp' : keyword.includes('ドメイン') ? 'domain' : 'market';
  const t = escapeHtml(title);
  const k = escapeHtml(keyword);
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${t} | エンジニア副業ラボ</title><meta name="description" content="${k}について、副業を始めたいエンジニア向けに結論・理由・手順・注意点・次の行動を整理します。" /><link rel="stylesheet" href="../style.css" /></head><body><header><h1><a href="../index.html">エンジニア副業ラボ</a></h1></header><main><article class="article-page"><p class="post-date">公開日: ${date} / キーワード: ${k}</p><h2>${t}</h2><p>この記事では「${k}」で調べている人に向けて、最初に決めること、実際の手順、収益導線へのつなげ方を整理します。</p><h3>結論</h3><p>最初から完璧な仕組みを作る必要はありません。小さく公開し、読者の悩みと次の行動を1本の線でつなぐことが重要です。</p><h3>理由</h3><p>副業サイトは記事数だけで伸びるわけではありません。検索意図に合う記事、内部リンク、広告導線がそろったときに成果が出やすくなります。</p>${adBlock(kind)}<h3>手順</h3><ol><li>検索キーワードを1つに絞る</li><li>読者が困っていることを1文で書く</li><li>結論、理由、手順、注意点の順に構成する</li><li>最後に次の行動を1つだけ置く</li></ol><h3>注意点</h3><p>広告を先に押し出しすぎると読者は離脱します。先に悩みを解決し、その後に自然な選択肢として紹介します。</p><h3>次に読む記事</h3><ul><li><a href="a8net-start.html">A8.netの始め方</a></li><li><a href="domain-start.html">ドメイン取得の考え方</a></li><li><a href="blog-start.html">副業ブログの始め方</a></li></ul></article></main></body></html>`;
}

function updateIndex(newFiles) {
  let html = fs.readFileSync(indexPath, 'utf8');
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html')).sort().reverse().slice(0, 12);
  const cards = files.map(file => {
    const name = file.replace(/\.html$/, '').replace(/^\d{4}-\d{2}-\d{2}-\d{2}-/, '').replace(/-/g, ' ');
    return `<article class="card auto-article"><h3>${escapeHtml(name)}</h3><p>副業・個人開発・ブログ収益化に関する記事です。</p><a href="articles/${encodeURI(file)}">続きを読む</a></article>`;
  }).join('');
  html = html.replace(/<div class="article-grid">[\s\S]*?<\/div><\/div><\/section>/, `<div class="article-grid">${cards}</div></div></section>`);
  fs.writeFileSync(indexPath, html);
}

fs.mkdirSync(articlesDir, { recursive: true });
const selected = pick(keywordPool, 10);
const created = [];
selected.forEach(([keyword, title], i) => {
  const file = `${slug(keyword, i)}.html`;
  const full = path.join(articlesDir, file);
  if (!fs.existsSync(full)) {
    fs.writeFileSync(full, articleHtml(keyword, title, i));
    created.push(file);
  }
});
updateIndex(created);
console.log(`created ${created.length} articles`);
