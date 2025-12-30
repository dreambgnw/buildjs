// src/routes/index.tsx
import { createResource, For } from "solid-js";
import { A } from "@solidjs/router";
import { client, type Post } from "~/lib/microcms";

// データ取得関数
const fetchPosts = async () => {
  const now = new Date().toISOString();
  const data = await client.get({ 
    endpoint: "posts", 
    queries: { 
      limit: 12, 
      orders: '-publishedAt',
      filters: `publishedAt[less_than]${now}`
    } 
  });
  return data.contents as Post[];
};

export default function Home() {
  const [posts] = createResource(fetchPosts);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" });

  return (
    // ベース: ライトモード(bg-stone-50) / ダークモード(bg-[#0c0a09])
    <div class="min-h-screen bg-stone-50 dark:bg-[#0c0a09] text-stone-800 dark:text-stone-200 font-sans selection:bg-orange-500 selection:text-white transition-colors duration-300">
      
      {/* Navigation Bar */}
      <nav class="sticky top-0 z-50 bg-white/80 dark:bg-[#0c0a09]/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800/50 transition-colors duration-300">
        <div class="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <A href="/" class="font-bold text-lg text-stone-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            QUICK INSTANT
          </A>
          <div class="flex gap-6 text-sm font-medium">
            <span class="text-stone-900 dark:text-white border-b-2 border-orange-500 cursor-default">Blog</span>
            <a href="https://ffnet.work" class="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">Home</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header class="relative py-24 px-6 text-center border-b border-stone-200 dark:border-stone-900 bg-white dark:bg-[#0c0a09] transition-colors duration-300">
        <div class="max-w-4xl mx-auto relative z-10">
          <h1 class="text-5xl md:text-6xl font-bold text-stone-900 dark:text-white mb-6 tracking-tight transition-colors duration-300">
            QUICK INSTANT
          </h1>
          <p class="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
            Chillout, Quickly, Geek. 
          </p>
        </div>
        {/* Glow Effect (Dark mode only) */}
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-500/10 dark:bg-orange-900/20 blur-[100px] rounded-full -z-0 pointer-events-none"></div>
      </header>

      {/* Post Grid */}
      <main class="max-w-7xl mx-auto px-6 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <For each={posts()}>
            {(post) => (
              <article class="flex flex-col group h-full">
                <A href={`/post/${post.id}`} class="block overflow-hidden rounded-2xl mb-6 relative aspect-[16/10] bg-stone-200 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 transition-transform duration-300 group-hover:-translate-y-1 shadow-sm dark:shadow-none">
                  {post.eyecatch ? (
                    <img 
                      src={post.eyecatch.url} 
                      alt={post.title} 
                      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div class="w-full h-full flex items-center justify-center bg-stone-100 dark:bg-stone-900 text-stone-400 dark:text-stone-700">
                      <span class="text-4xl">📝</span>
                    </div>
                  )}
                </A>
                
                <div class="flex-1 flex flex-col">
                  <div class="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-500">
                    <span class="bg-orange-100 dark:bg-orange-500/10 px-2 py-1 rounded">Article</span>
                    <time class="text-stone-500 dark:text-stone-500 font-normal">{formatDate(post.publishedAt)}</time>
                  </div>
                  
                  <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-3 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    <A href={`/post/${post.id}`}>{post.title}</A>
                  </h2>
                  
                  <div class="mt-auto pt-6 flex items-center gap-3 border-t border-stone-200 dark:border-stone-800/50">
                    <img src="https://github.com/dreambgnw.png" alt="Shun" class="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-700" />
                    <span class="text-sm text-stone-600 dark:text-stone-400">Shun Tonegawa</span>
                  </div>
                </div>
              </article>
            )}
          </For>
        </div>
      </main>

      <footer class="py-12 text-center text-stone-600 dark:text-stone-600 text-sm border-t border-stone-200 dark:border-stone-900 bg-stone-100 dark:bg-[#0c0a09] transition-colors duration-300">
        <p>&copy; 2025 Shun Tonegawa. Powered by SolidStart.</p>
      </footer>
    </div>
  );
}
