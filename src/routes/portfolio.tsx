// src/routes/portfolio.tsx
import { A } from "@solidjs/router";

export default function Portfolio() {
  const projects = [
    {
      title: "Home Server",
      desc: "NixOS & Incus managed infrastructure.",
      icon: "server",
      tags: ["NixOS", "Incus", "Docker"]
    },
    {
      title: "Audio Setup",
      desc: "Customized high-fidelity environment.",
      icon: "headphones",
      tags: ["FiiO", "IEMs", "Linux Audio"]
    },
    {
      title: "Concrnt Node",
      desc: "Self-hosted decentralized SNS node.",
      icon: "share-2",
      tags: ["Concrnt", "ActivityPub"]
    }
  ];

  return (
    <div class="min-h-screen bg-[#0c0a09] text-stone-200 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Navigation Bar */}
      <nav class="sticky top-0 z-50 bg-[#0c0a09]/80 backdrop-blur-md border-b border-stone-800/50">
        <div class="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <A href="/" class="font-bold text-lg text-white hover:text-orange-400 transition-colors">
            QUICK INSTANT
          </A>
          <div class="flex gap-6 text-sm font-medium">
            <A href="/" class="text-stone-400 hover:text-white transition-colors">Blog</A>
            <span class="text-white border-b-2 border-orange-500 cursor-default">Portfolio</span>
          </div>
        </div>
      </nav>

      <main class="max-w-4xl mx-auto px-6 py-16 pb-20">
        {/* Profile Header */}
        <header class="mb-20">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">Portfolio</h1>
          <div class="flex flex-col md:flex-row items-start gap-8">
            <img src="https://github.com/dreambgnw.png" alt="Shun" class="w-24 h-24 rounded-full border-4 border-stone-800" />
            <div>
              <h2 class="text-2xl font-bold text-white mb-3">Shun Tonegawa</h2>
              <p class="text-stone-400 leading-relaxed mb-6 max-w-2xl">
                Headless CMS, Server-side engineering, and High-fidelity audio.<br/>
                Building things with modern web technologies like NixOS, SolidJS, and ActivityPub.
              </p>
              <div class="flex gap-4 text-sm font-bold">
                <a href="https://github.com/dreambgnw" target="_blank" class="flex items-center gap-2 text-stone-300 hover:text-white bg-stone-900 border border-stone-800 px-4 py-2 rounded-lg transition-colors">
                  GitHub
                </a>
                <a href="https://hnr.f5.si" target="_blank" class="flex items-center gap-2 text-stone-300 hover:text-concrnt bg-stone-900 border border-stone-800 px-4 py-2 rounded-lg transition-colors">
                  Concrnt
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Projects Grid */}
        <section>
          <h3 class="text-xl font-bold text-white mb-8 border-b border-stone-800 pb-4">Projects & Interests</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => (
              <div class="bg-stone-900/40 border border-stone-800 p-6 rounded-xl hover:border-orange-500/30 transition-colors group">
                <h4 class="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{project.title}</h4>
                <p class="text-stone-400 text-sm mb-4 leading-relaxed">{project.desc}</p>
                <div class="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span class="text-xs font-mono bg-stone-800 text-stone-400 px-2 py-1 rounded border border-stone-700/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer class="py-12 text-center text-stone-600 text-sm border-t border-stone-900 bg-[#0c0a09]">
        <p>&copy; 2025 Shun Tonegawa.</p>
      </footer>
    </div>
  );
}
