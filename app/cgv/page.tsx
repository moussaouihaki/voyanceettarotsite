import { FileText } from "lucide-react";

export const metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales de vente des abonnements Madame Céleste.",
};

export default function CGVPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12 fade-in-up">
        <FileText size={28} className="text-[#d4af6f] mx-auto mb-4" />
        <div className="badge-gold mb-4">CGV</div>
        <h1 className="font-serif-display text-4xl md:text-5xl text-gradient-cream mb-3">Conditions générales de vente</h1>
        <p className="font-serif-text italic text-[#c9b88a]">Pour une relation transparente</p>
      </div>

      <div className="luxe-card rounded-sm p-8 md:p-10 space-y-8 font-serif-text text-[#e8dcc0] leading-relaxed text-[15px]">
        <section>
          <h2 className="font-serif-display text-2xl text-[#d4af6f] mb-3">Article 1 — Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les abonnements proposés
            sur le site Madame Céleste. En souscrivant un abonnement, l&apos;utilisateur accepte
            sans réserve les présentes CGV.
          </p>
        </section>

        <section>
          <h2 className="font-serif-display text-2xl text-[#d4af6f] mb-3">Article 2 — Formules d&apos;abonnement</h2>
          <p className="mb-2">Trois formules sont proposées :</p>
          <ul className="space-y-1 ml-5 list-disc">
            <li><strong className="text-[#e8c875]">Découverte</strong> : gratuit à vie</li>
            <li><strong className="text-[#e8c875]">Mystique</strong> : 9,90 €/mois ou 95 €/an</li>
            <li><strong className="text-[#e8c875]">Voyante VIP</strong> : 29,90 €/mois ou 287 €/an</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif-display text-2xl text-[#d4af6f] mb-3">Article 3 — Paiement</h2>
          <p>
            Les paiements sont traités de manière sécurisée par Stripe. Les abonnements sont reconduits
            tacitement à chaque échéance, sauf résiliation préalable.
          </p>
        </section>

        <section>
          <h2 className="font-serif-display text-2xl text-[#d4af6f] mb-3">Article 4 — Droit de rétractation</h2>
          <p>
            Conformément à l&apos;article L221-18 du Code de la consommation, vous disposez d&apos;un délai
            de 14 jours pour vous rétracter sans avoir à justifier de motifs. Cependant, en commençant à
            utiliser un service immédiatement après souscription, vous renoncez expressément à ce droit
            (article L221-28).
          </p>
        </section>

        <section>
          <h2 className="font-serif-display text-2xl text-[#d4af6f] mb-3">Article 5 — Résiliation</h2>
          <p>
            Vous pouvez résilier votre abonnement à tout moment depuis votre profil. La résiliation prend
            effet à la fin de la période en cours — aucun remboursement au prorata.
          </p>
        </section>

        <section>
          <h2 className="font-serif-display text-2xl text-[#d4af6f] mb-3">Article 6 — Avertissement</h2>
          <p>
            Les lectures sont fournies à but de divertissement et de réflexion personnelle. Elles ne sauraient
            constituer un avis professionnel (médical, juridique, financier). L&apos;utilisateur reste seul
            responsable de ses décisions.
          </p>
        </section>

        <section>
          <h2 className="font-serif-display text-2xl text-[#d4af6f] mb-3">Article 7 — Litiges</h2>
          <p>
            Les présentes CGV sont régies par le droit français. En cas de litige, une solution amiable
            sera recherchée avant toute action judiciaire.
          </p>
        </section>
      </div>

      <p className="text-center text-[10px] tracking-widest text-[#8a6f3a] mt-10">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
