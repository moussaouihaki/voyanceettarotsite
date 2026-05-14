import Link from "next/link";
import { Sparkles, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <div className="font-serif-display text-8xl text-gradient-gold mb-6 float-slow">404</div>
      <div className="badge-gold mb-5">
        <Sparkles size={11} className="inline mr-2" />
        Page introuvable
      </div>
      <h1 className="font-serif-display text-4xl text-gradient-cream mb-4">Les astres ne révèlent rien ici</h1>
      <p className="font-serif-text italic text-[#c9b88a] text-lg mb-10">
        La page que vous cherchez s&apos;est perdue dans les brumes du cosmos.
        Peut-être qu&apos;une autre voie s&apos;ouvre à vous.
      </p>
      <Link href="/" className="btn-gold">
        <Home size={14} />
        <span>Retour au sanctuaire</span>
      </Link>
    </div>
  );
}
