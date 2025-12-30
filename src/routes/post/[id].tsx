// src/routes/post/[id].tsx
import { createResource, Show, For } from "solid-js";
import { useParams, A } from "@solidjs/router";
import * as cheerio from "cheerio"; // HTML解析用
import { client, type Post } from "~/lib/microcms";

// 目次用の型定義
type TocItem = {
  id: string;
  text: string;
  tag: string;
};

type PostWithToc = Post & { toc: TocItem[] };

const fetchPost = async (id: string): Promise<PostWithToc | null> => {
  try {
    const post = await client.get<Post>({ endpoint: "posts", contentId: id });
    const $ = cheerio.load(post.content);
    const toc: TocItem[] = [];

    $('h2, h3').each((_, elm) => {
      const text = $(elm).text();
      const id = $(elm).attr('id') || `section-${toc.length + 1}`;
      $(elm).attr('id', id);
      toc.push({ id, text, tag: elm.tagName.toLowerCase() });
    });

    $('table').each((_, elm) => {
      $(elm).wrap('<div class="table-container"></div>');
    });

    return { ...post, content: $.html(), toc };
  } catch (e) {
    console.error(e);
    return null;
  }
};

export default function PostDetail() {
  const params = useParams();
  const [post] = createResource(() => params.id, fetchPost);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div class="min-h-screen bg-stone-50 dark:bg-[#0c0a09] text-stone-800 dark:text-stone-200 font-sans selection:bg-orange-500 selection:text-white transition-colors duration-300">
      
      {/* Navigation Bar */}
      <nav class="sticky top-0 z-50 bg-white/80 dark:bg-[#0c0a09]/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800/50 transition-colors duration-300">
        <div class="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <A href="/" class="font-bold text-lg text-stone-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            QUICK INSTANT
          </A>
          <div class="flex gap-6 text-sm font-medium">
            <A href="/" class="text-stone-900 dark:text-white border-b-2 border-orange-500 transition-colors">Blog</A>
            <a href="https://ffnet.work" class="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">Home</a>
          </div>
        </div>
      </nav>

      <Show when={post()} fallback={<div class="h-screen flex items-center justify-center text-stone-500">Loading...</div>}>
        {(p) => (
          <article>
            
            {/* Header Section */}
            <header class="relative py-32 md:py-48 px-6 text-center w-full overflow-hidden border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-black transition-colors duration-300">
              <Show when={p().eyecatch}>
                <div class="absolute inset-0 z-0">
                  <img 
                    src={p().eyecatch!.url} 
                    class="w-full h-full object-cover opacity-20 dark:opacity-30 blur-md scale-105" 
                    alt="" 
                  />
                  {/* Gradient Overlay for Light/Dark */}
                  <div class="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/60 to-transparent dark:from-[#0c0a09] dark:via-[#0c0a09]/60"></div>
                </div>
              </Show>

              <div class="relative z-10 max-w-4xl mx-auto">
                <div class="mb-8 flex items-center justify-center">
                  <time class="text-orange-600 dark:text-orange-400 font-mono text-sm bg-white/50 dark:bg-[#0c0a09]/50 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-500/30 backdrop-blur-sm">
                    {formatDate(p().publishedAt)}
                  </time>
                </div>
                
                <h1 class="text-4xl md:text-6xl font-bold text-stone-900 dark:text-white mb-10 leading-tight tracking-tight drop-shadow-sm dark:drop-shadow-lg">
                  {p().title}
                </h1>

                <div class="flex items-center justify-center gap-4 bg-white/40 dark:bg-[#0c0a09]/40 inline-flex px-6 py-3 rounded-full border border-stone-200 dark:border-stone-700/50 backdrop-blur-sm">
                  <img src="https://github.com/dreambgnw.png" alt="Shun" class="w-10 h-10 rounded-full border border-stone-300 dark:border-stone-600" />
                  <div class="text-left">
                    <p class="text-stone-800 dark:text-stone-200 text-sm font-bold">Shun Tonegawa</p>
                    <p class="text-stone-500 dark:text-stone-400 text-xs">Author</p>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content Layout */}
            <div class="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
              
              {/* Table of Contents */}
              <Show when={p().toc.length > 0}>
                <aside class="lg:w-64 lg:shrink-0 order-1 lg:order-2">
                  <div class="sticky top-24 bg-white/50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl p-6 transition-colors duration-300">
                    <h3 class="text-stone-900 dark:text-white font-bold mb-4 flex items-center gap-2">
                      <span class="text-orange-500">#</span> Table of Contents
                    </h3>
                    <ul class="space-y-3 text-sm">
                      <For each={p().toc}>
                        {(item) => (
                          <li class={`${item.tag === 'h3' ? 'pl-4' : ''}`}>
                            <a 
                              href={`#${item.id}`} 
                              class="text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors block leading-relaxed"
                            >
                              {item.text}
                            </a>
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>
                </aside>
              </Show>

              {/* Content Body */}
              <div class="flex-1 order-2 lg:order-1 min-w-0">
                <div 
                  class="prose prose-lg prose-stone dark:prose-invert prose-orange max-w-none 
                         text-stone-700 dark:text-stone-300
                         prose-headings:scroll-mt-24"
                  innerHTML={p().content}
                />
              </div>

            </div>

            {/* Footer Area */}
            <div class="border-t border-stone-200 dark:border-stone-900 bg-stone-100 dark:bg-stone-950 py-20 px-6 transition-colors duration-300">
              <div class="max-w-2xl mx-auto text-center">
                <img src="https://github.com/dreambgnw.png" alt="Shun" class="w-20 h-20 rounded-full border-4 border-stone-200 dark:border-stone-800 mx-auto mb-6" />
                <h3 class="text-2xl font-bold text-stone-900 dark:text-white mb-2">Shun Tonegawa</h3>
                <p class="text-stone-600 dark:text-stone-400 mb-8 leading-relaxed">
                  Headless CMSと自鯖とオーディオが好きなエンジニア。<br/>
                  技術スタックの実験場としてこのブログを運用中。
                </p>
                <div class="flex justify-center gap-4 mt-6">
                  <A href="/" class="px-6 py-2 rounded-full bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-stone-200 dark:border-stone-800">
                    Home
                  </A>
                  <a href="[https://ffnet.work](https://ffnet.work)" class="px-6 py-2 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                    Portfolio
                  </a>
                </div>
              </div>
            </div>

          </article>
        )}
      </Show>

      {/* Global Styles for Headings & Tables (Light/Dark aware) */}
      <style>{`
        /* 見出し (Dark Mode) */
        :global(.dark) .prose h2 {
          color: #fff;
          border-left: 4px solid #f97316;
          background: linear-gradient(90deg, rgba(249, 115, 22, 0.1), transparent);
        }
        :global(.dark) .prose h3 {
          color: #e7e5e4;
          border-bottom: 1px solid #44403c;
        }
        
        /* 見出し (Light Mode) */
        .prose h2 {
          position: relative;
          padding-left: 1rem;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1c1917; /* stone-900 */
          border-left: 4px solid #f97316;
          background: linear-gradient(90deg, rgba(249, 115, 22, 0.05), transparent);
          border-radius: 0 4px 4px 0;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        .prose h3 {
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          font-size: 1.4rem;
          font-weight: 600;
          color: #44403c; /* stone-700 */
          border-bottom: 1px solid #e7e5e4; /* stone-200 */
          padding-bottom: 0.5rem;
        }

        /* 共通スタイル */
        .prose p { margin-bottom: 1.5rem; line-height: 1.8; }
        .prose a { color: #f97316; text-decoration: underline; text-decoration-color: rgba(249, 115, 22, 0.4); }
        .prose a:hover { text-decoration-color: #f97316; }
        
        /* Code Block (Always Dark) */
        .prose pre {
          background-color: #1c1917;
          border: 1px solid #292524;
          border-radius: 0.5rem;
          color: #e7e5e4;
        }

        /* Table */
        .table-container {
          overflow-x: auto;
          margin-bottom: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb; /* Light border */
        }
        :global(.dark) .table-container {
          border-color: #292524; /* Dark border */
        }
        
        .prose table { margin-top: 0; margin-bottom: 0; min-width: 100%; }
        
        .prose thead { border-bottom-color: #e5e7eb; }
        :global(.dark) .prose thead { border-bottom-color: #44403c; }
        
        .prose th { color: #1c1917; font-weight: 700; text-align: left; padding: 0.75rem 1rem; white-space: nowrap; }
        :global(.dark) .prose th { color: #fff; }
        
        .prose td { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; color: #57534e; }
        :global(.dark) .prose td { border-bottom-color: #292524; color: #d6d3d1; }
        
        .prose tr:last-child td { border-bottom: none; }
      `}</style>
    </div>
  );
}
