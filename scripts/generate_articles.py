from pathlib import Path
from datetime import date
import html

SITE_URL = "https://nyx1271.github.io/money-system"
ROOT = Path(__file__).resolve().parents[1]
ARTICLES_DIR = ROOT / "articles"

ARTICLES = [
    {
        "slug": "seo-title-writing",
        "title": "SEOタイトルの付け方｜初心者がクリックされる記事名を作る手順",
        "description": "SEOタイトルの付け方を初心者向けに解説。副業ブログでクリックされる記事名、検索意図、避けたい失敗、収益導線までまとめます。",
        "h1": "SEOタイトルの付け方。初心者がクリックされる記事名を作る手順",
        "keyword": "SEO タイトル 付け方 初心者",
        "reader_problem": "記事を書いてもクリックされず、どんなタイトルにすればよいか分からない",
        "answer": [
            "タイトルは検索キーワードだけでなく、読者が得られる結果まで入れます。",
            "最初は『キーワード + 悩み + 解決』の形で作ると失敗しにくいです。",
            "タイトルで読者を集め、本文の最後でブログ記事やA8記事へ自然に流します。",
        ],
        "steps": [
            "狙うキーワードを1つに絞る",
            "読者の悩みを1文で書く",
            "記事を読むメリットを入れる",
            "数字や初心者向けなど具体性を足す",
            "本文の内容とズレていないか確認する",
        ],
        "examples": [
            ["SEO", "SEO初心者が最初にやるべき3つの対策", "blog-start.html"],
            ["Python", "Pythonで副業につながる小さなツールの作り方", "2026-05-01-10-python.html"],
            ["A8", "A8.netの始め方と収益導線の作り方", "a8net-start.html"],
        ],
        "mistakes": [
            ["キーワードだけの短いタイトルにする", "読者が得られる結果まで入れる"],
            ["煽りすぎて本文とズレる", "本文で本当に解決できる範囲だけ書く"],
        ],
        "cta_title": "PR: 記事タイトルを決めたら収益導線も確認する",
        "cta_body": "タイトルで読者を集めても、最後の行動がないと収益にはつながりません。記事テーマに合う案件を確認して、自然な導線を作りましょう。",
        "cta_href": "a8net-start.html",
        "cta_label": "A8.netの始め方を見る",
    }
]

RELATED = [
    ("blog-start.html", "副業ブログの始め方"),
    ("a8net-start.html", "A8.netの始め方と収益導線の作り方"),
    ("domain-start.html", "ドメイン取得で後悔しない決め方"),
]


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def build_article(item: dict) -> str:
    slug = item["slug"]
    canonical = f"{SITE_URL}/articles/{slug}.html"
    answer = "".join(f"<li>{esc(x)}</li>" for x in item["answer"])
    steps = "".join(f"<li>{esc(x)}</li>" for x in item["steps"])
    rows = "".join(
        f"<tr><td>{esc(a)}</td><td>{esc(b)}</td><td><a href=\"{esc(c)}\">関連記事へ</a></td></tr>"
        for a, b, c in item["examples"]
    )
    mistakes = "".join(
        f"<p><strong>失敗:</strong> {esc(bad)}</p><p><strong>改善:</strong> {esc(good)}</p>"
        for bad, good in item["mistakes"]
    )
    related = "".join(f"<li><a href=\"{href}\">{esc(label)}</a></li>" for href, label in RELATED)
    today = date.today().isoformat()

    return f'''<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{esc(item['title'])}</title>
  <meta name="description" content="{esc(item['description'])}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="{esc(canonical)}" />
  <link rel="stylesheet" href="../style.css" />
</head>
<body>
<header class="site-header"><div class="container header-inner"><a class="brand" href="../index.html"><span class="brand-mark">E</span><span class="brand-copy"><strong>エンジニア副業ラボ</strong><small>副業・個人開発・ブログ運営</small></span></a></div></header>
<main><article class="article-page">
<p class="post-date">公開日: {today} / キーワード: {esc(item['keyword'])} / PRを含みます</p>
<h2>{esc(item['h1'])}</h2>
<div class="summary-box"><p><strong>この記事の結論</strong></p><ul>{answer}</ul></div>
<div class="toc-box"><p><strong>読む順番</strong></p><ol><li><a href="#problem">読者の悩み</a></li><li><a href="#steps">具体的な手順</a></li><li><a href="#example">記事への使い方</a></li><li><a href="#mistake">よくある失敗</a></li><li><a href="#next">次にやること</a></li></ol></div>
<h3 id="problem">読者の悩み</h3><p>{esc(item['reader_problem'])}。この状態で記事を増やしても、読者の行動にはつながりにくいです。</p>
<h3 id="steps">具体的な手順</h3><ol>{steps}</ol>
<h3 id="example">記事への使い方</h3><div class="compare-box"><table class="compare-table"><thead><tr><th>元のテーマ</th><th>改善例</th><th>次の導線</th></tr></thead><tbody>{rows}</tbody></table></div>
<aside class="affiliate-box"><h3>{esc(item['cta_title'])}</h3><p>{esc(item['cta_body'])}</p><a class="btn btn-primary" href="{esc(item['cta_href'])}">{esc(item['cta_label'])}</a></aside>
<h3 id="mistake">よくある失敗</h3><div class="note-box">{mistakes}</div>
<h3 id="next">次にやること</h3><p>まずは、この記事のテーマに合わせて「誰の悩みを解決するか」と「最後にどの記事へ進めるか」を1行で書いてください。</p>
<div class="related-box"><h3>次に読む記事</h3><ul>{related}</ul></div>
</article></main></body></html>
'''


def main() -> None:
    ARTICLES_DIR.mkdir(exist_ok=True)
    for item in ARTICLES:
        path = ARTICLES_DIR / f"{item['slug']}.html"
        path.write_text(build_article(item), encoding="utf-8")
        print(f"generated: {path}")


if __name__ == "__main__":
    main()
