import fs from 'fs';
const topic = process.argv[2] || "プログラマー 副業";
const date = new Date().toISOString().split('T')[0];
const content = `# ${topic}\n\n公開日: ${date}\n\n## 概要\n${topic}についての基本解説。\n\n## ポイント\n- 初心者でも始めやすい\n- 小さく試す\n- 継続が重要\n\n## まとめ\n継続すれば成果につながる。`;
const filename = `articles/${date}-${topic.replace(/\s+/g,'-')}.md`;
fs.mkdirSync('articles', { recursive: true });
fs.writeFileSync(filename, content);
console.log('Generated:', filename);