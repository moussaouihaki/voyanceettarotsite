import Link from "next/link";
import { BLOG_ARTICLES } from "@/lib/blog";
import { Clock, ArrowRight, BookOpen } from "lucide-react";

export const metadata = {
  title: "Journal Mystique — Madame Céleste",
  description: "Articles ésotériques sur le tarot, l'astrologie, la numérologie, les runes, l'I-Ching et les arts divinatoires.",
};

export default function BlogPage() {
  const featured = BLOG_ARTICLES[0];
  const others = BLOG_ARTICLES.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="badge-gold mb-5">
          <BookOpen size={11} className="inline mr-2" />
          Journal Mystique
        </div>
        <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-5">Le Grimoire</h1>
        <p className="font-serif-text italic text-xl text-[#c9b88a] max-w-2xl mx-auto">
          Articles, méditations et enseignements sur les arts divinatoires
        </p>
      </div>

      {/* Featured article */}
      <Link href={`/blog/${featured.slug}`} className="block group mb-16">
        <article className="luxe-card-premium rounded-sm p-10 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(212,175,111,0.08),transparent_70%)]" />

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="badge-premium mb-5">À la une</div>
              <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] mb-4">
                <span>{featured.category}</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><Clock size={11} /> {featured.readTime} min</span>
              </div>
              <h2 className="font-serif-display text-3xl md:text-4xl text-cream mb-3 group-hover:text-[#e8c875] transition-colors">
                {featured.title}
              </h2>
              <p className="font-serif-text italic text-[#c9b88a] text-lg mb-5">{featured.subtitle}</p>
              <p className="text-[#c9b88a] leading-relaxed mb-6 text-[14px]">{featured.excerpt}</p>
              <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] group-hover:gap-3 transition-all">
                <span>Lire l&apos;article</span>
                <ArrowRight size={12} />
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-sm bg-gradient-to-br from-[rgba(74,14,46,0.4)] via-[rgba(45,10,62,0.6)] to-[rgba(26,18,52,0.9)] flex items-center justify-center border border-[rgba(212,175,111,0.2)]">
                <div className="text-center p-8">
                  <BookOpen size={48} className="text-[#d4af6f] mx-auto mb-4 opacity-40" />
                  <div className="font-serif-display text-[#d4af6f] text-2xl tracking-wider">
                    {featured.category}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>

      {/* Grid of other articles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {others.map((article) => (
          <Link key={article.slug} href={`/blog/${article.slug}`} className="group">
            <article className="luxe-card rounded-sm overflow-hidden h-full flex flex-col">
              <div className="aspect-[3/2] bg-gradient-to-br from-[rgba(45,10,62,0.4)] to-[rgba(13,8,32,0.8)] flex items-center justify-center border-b border-[rgba(212,175,111,0.1)]">
                <BookOpen size={36} className="text-[#d4af6f] opacity-30" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-[#d4af6f] mb-3">
                  <span>{article.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5"><Clock size={10} /> {article.readTime} min</span>
                </div>
                <h3 className="font-serif-display text-xl text-cream mb-2 group-hover:text-[#e8c875] transition-colors">
                  {article.title}
                </h3>
                <p className="font-serif-text italic text-[#c9b88a] text-sm mb-4">{article.subtitle}</p>
                <p className="text-[13px] text-[#c9b88a] leading-relaxed mb-5 flex-1 line-clamp-3">{article.excerpt}</p>
                <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] group-hover:gap-3 transition-all">
                  <span>Lire</span>
                  <ArrowRight size={11} />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-20 text-center pt-12 border-t border-[rgba(212,175,111,0.15)]">
        <h3 className="font-serif-display text-3xl text-gradient-cream mb-4">Soif d&apos;apprendre ?</h3>
        <p className="text-[#c9b88a] mb-6 max-w-md mx-auto">
          Recevez nos nouveaux articles et méditations directement dans votre boîte
        </p>
        <Link href="/tarifs" className="btn-outline-gold">
          <span>Newsletter VIP</span>
        </Link>
      </div>
    </div>
  );
}
