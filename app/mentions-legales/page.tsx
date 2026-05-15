import { Scale } from "lucide-react";

export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales et politique de confidentialité de Madame Céleste.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12 fade-in-up">
        <Scale size={28} className="text-[#d4af6f] mx-auto mb-4" />
        <div className="badge-gold mb-4">Informations légales</div>
        <h1 className="font-serif-display text-4xl md:text-5xl text-gradient-cream mb-3">Mentions légales</h1>
        <p className="font-serif-text italic text-[#c9b88a]">Transparence et confiance — fondations de notre sanctuaire</p>
      </div>

      <div className="luxe-card rounded-sm p-8 md:p-10 space-y-8 font-serif-text text-[#e8dcc0] leading-relaxed text-[15px]">
        <section>
          <h2 className="font-serif-display text-2xl text-[#d4af6f] mb-3">Éditeur du site</h2>
          <p>
            Le site Madame Céleste est édité par Madame Céleste, sanctuaire numérique de voyance.<br />
            Contact : <a href="mailto:info@celestevoyance.com" className="text-[#d4af6f] hover:text-[#e8c875] transition-colors">info@celestevoyance.com</a>
          </p>
        </section>

        <section>
          <h2 className="font-serif-display text-2xl text-[#d4af6f] mb-3">Hébergement</h2>
          <p>
            Le site est hébergé par Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
          </p>
        </section>

        <section>
          <h2 className="font-serif-display text-2xl text-[#d4af6f] mb-3">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu (textes, design, illustrations) est protégé par le droit d&apos;auteur.
            Les images des cartes du Tarot Rider-Waite-Smith (1909) sont dans le domaine public.
            Toute reproduction non autorisée est interdite.
          </p>
        </section>

        <section>
          <h2 className="font-serif-display text-2xl text-[#d4af6f] mb-3">Données personnelles (RGPD)</h2>
          <p className="mb-3">
            Les informations que vous nous confiez (prénom, date de naissance, etc.) sont stockées sur votre appareil
            (localStorage) et dans notre base de données sécurisée (Firebase/Firestore, Google Cloud) lorsque vous
            créez un compte. Elles sont utilisées uniquement pour personnaliser vos lectures et gérer votre abonnement.
            Elles ne sont jamais vendues ni transmises à des tiers commerciaux, sauf à Google (Gemini) pour la
            génération des interprétations IA et à Stripe pour le traitement des paiements.
          </p>
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données.
            Vous pouvez supprimer votre profil depuis la page « Mon profil » ou en nous contactant à{" "}
            <a href="mailto:info@celestevoyance.com" className="text-[#d4af6f] hover:text-[#e8c875] transition-colors">info@celestevoyance.com</a>.
          </p>
        </section>

        <section>
          <h2 className="font-serif-display text-2xl text-[#d4af6f] mb-3">Avertissement</h2>
          <p>
            Les lectures proposées sur ce site sont à but de divertissement uniquement. Elles ne sauraient
            remplacer un avis médical, juridique ou financier professionnel. Madame Céleste décline toute responsabilité
            quant aux décisions prises sur la base des interprétations fournies.
          </p>
        </section>

        <section>
          <h2 className="font-serif-display text-2xl text-[#d4af6f] mb-3">Cookies</h2>
          <p>
            Ce site n&apos;utilise pas de cookies de tracking. Seul le localStorage est utilisé pour stocker
            votre profil et l&apos;historique de vos lectures.
          </p>
        </section>
      </div>

      <p className="text-center text-[10px] tracking-widest text-[#8a6f3a] mt-10">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
