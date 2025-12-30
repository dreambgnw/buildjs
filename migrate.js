// migrate.js
import GhostContentAPI from '@tryghost/content-api';

// ▼ Ghostの設定 (Integrationsで取得)
const GHOST_URL = 'https://hogus.work';
const GHOST_KEY = 'a0f08d43e14bdd3646d5841ca5';

// ▼ MicroCMSの設定
const MICROCMS_DOMAIN = 'dkkv8t9ifg';
const MICROCMS_API_KEY = 'crEvnYaomDeU7rlE7fGUtwzJu9HlAipvsDeW'; // 書き込み権限のあるキー
const MICROCMS_ENDPOINT = 'posts';

const ghost = new GhostContentAPI({
  url: GHOST_URL,
  key: GHOST_KEY,
  version: "v5.0"
});

async function migrate() {
  console.log('👻 Fetching from Ghost...');
  
  // HTML形式で全記事取得
  const posts = await ghost.posts.browse({ limit: 'all', formats: ['html'] });
  console.log(`Found ${posts.length} posts.`);

  for (const post of posts) {
    console.log(`Migrating: ${post.title}`);
    
    const body = {
      title: post.title,
      content: post.html, // GhostのHTMLをそのまま移行
      publishedAt: post.published_at,
      // 必要なら eyecatch (画像URL) もここで処理
    };

    try {
      const res = await fetch(`https://${MICROCMS_DOMAIN}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MICROCMS-API-KEY': MICROCMS_API_KEY
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`❌ Failed: ${post.title}`, err);
      } else {
        console.log(`✅ Success: ${post.title}`);
      }
    } catch (err) {
      console.error(err);
    }
    
    // APIレート制限回避のため少し待機
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('🎉 Migration completed!');
}

migrate();
