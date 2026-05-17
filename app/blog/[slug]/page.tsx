import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_ARTICLES, getArticleBySlug } from "@/lib/blog";
import { Clock, ArrowLeft, BookOpen, Calendar } from "lucide-react";

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((a) => ({ slug: a.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: `${article.title} — Madame Céleste`,
    description: article.excerpt,
  };
}

function renderContent(content: string) {
  return content.split("\n\n").map((para, i) => {
    const trimmed = para.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="font-serif-display text-3xl text-gradient-cream mt-12 mb-6">
          {trimmed.replace(/^## /, "")}
        </h2>
      );
    }
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").map((l) => l.replace(/^- /, ""));
      return (
        <ul key={i} className="space-y-3 my-6">
          {items.map((it, j) => (
            <li key={j} className="text-[15px] text-[#c9b88a] flex gap-3">
              <span className="text-[#d4af6f] mt-1.5">✦</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(it) }} />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p
        key={i}
        className="text-[16px] text-[#e8dcc0] leading-[1.85] my-5 font-serif-text"
        dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
      />
    );
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInline(text: string) {
  const safe = escapeHtml(text);
  return safe
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[#e8c875]">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-[#d4af6f]">$1</em>')
    .replace(/&amp;laquo;/g, "«")
    .replace(/&amp;raquo;/g, "»");
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = BLOG_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#d4af6f] hover:text-[#e8c875] mb-10 transition-colors">
        <ArrowLeft size={12} />
        <span>Retour au journal</span>
      </Link>

      <article>
        <div className="mb-10">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase text-[#d4af6f] mb-5">
            <span className="badge-soft">{article.category}</span>
            <span className="flex items-center gap-1.5"><Calendar size={10} /> {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>·</span>
            <span className="flex items-center gap-1.5"><Clock size={10} /> {article.readTime} min</span>
          </div>
          <h1 className="font-serif-display text-4xl md:text-5xl text-gradient-cream mb-4 leading-tight">{article.title}</h1>
          <p className="font-serif-text italic text-xl text-[#c9b88a] mb-6">{article.subtitle}</p>
          <div className="gold-line my-8" />
          <p className="text-[15px] text-[#c9b88a] italic">Par {article.author}</p>
        </div>

        <div className="prose-mystic">
          {renderContent(article.content)}
        </div>

        <div className="mt-16 pt-10 border-t border-[rgba(212,175,111,0.15)] text-center">
          <BookOpen size={28} className="text-[#d4af6f] mx-auto mb-4 opacity-50" />
          <p className="font-serif-text italic text-[#c9b88a]">
            &ldquo;La sagesse est un voyage, pas une destination&rdquo;
          </p>
          <p className="text-[10px] tracking-widest uppercase text-[#8a6f3a] mt-2">— Madame Céleste</p>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-20">
          <div className="divider-ornament max-w-sm mx-auto mb-10">
            <span>À découvrir</span>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="luxe-card rounded-sm p-5 group">
                <div className="text-[10px] tracking-widest uppercase text-[#d4af6f] mb-2">{r.category}</div>
                <h4 className="font-serif-display text-lg text-cream group-hover:text-[#e8c875] transition-colors mb-2">{r.title}</h4>
                <p className="text-[12px] text-[#c9b88a] line-clamp-2">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
