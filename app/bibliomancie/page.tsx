"use client";

import { authFetch } from "@/lib/api-client";
import { useState } from "react";
import Link from "next/link";
import { useUserProfile, canAccessFeature } from "@/contexts/UserProfileContext";
import ReadingResult from "@/components/ReadingResult";
import { Sparkles, BookOpen, RotateCcw, Crown } from "lucide-react";

// ── Sacred Texts Collection ───────────────────────────────────────────────────

interface SacredText {
  text: string;
  source: string;
  tradition: string;
}

const SACRED_TEXTS: SacredText[] = [
  // Tao Te Ching — Lao Tseu
  {
    text: "Le Tao qui peut être nommé n'est pas le Tao éternel. Celui qui sait ne parle pas ; celui qui parle ne sait pas.",
    source: "Tao Te Ching, Lao Tseu — Chapitre 1 & 56",
    tradition: "Taoïsme",
  },
  {
    text: "Connaître les autres, c'est la sagesse. Se connaître soi-même, c'est l'illumination. Vaincre les autres demande de la force. Se vaincre soi-même demande une force plus grande encore.",
    source: "Tao Te Ching, Lao Tseu — Chapitre 33",
    tradition: "Taoïsme",
  },
  {
    text: "L'eau est la chose la plus douce et la plus souple du monde, et pourtant elle use et creuse la pierre la plus dure. Ainsi agit la douceur sur la rigidité.",
    source: "Tao Te Ching, Lao Tseu — Chapitre 78",
    tradition: "Taoïsme",
  },
  {
    text: "Voyager mille li commence par un seul pas. Le grand arbre naquit d'un germe minuscule. Le voyage le plus haut commence au bas d'une échelle.",
    source: "Tao Te Ching, Lao Tseu — Chapitre 64",
    tradition: "Taoïsme",
  },
  {
    text: "Celui qui se sait suffisant est riche. Celui qui agit avec vigueur a de la volonté. Celui qui ne perd pas son centre dure. Celui qui meurt sans périr possède la longévité.",
    source: "Tao Te Ching, Lao Tseu — Chapitre 33",
    tradition: "Taoïsme",
  },
  {
    text: "Rentre en toi-même. Là est la source. Retourne toujours à la racine et tu trouveras le repos.",
    source: "Tao Te Ching, Lao Tseu — Chapitre 16",
    tradition: "Taoïsme",
  },
  // Rumi
  {
    text: "Ta tâche n'est pas de chercher l'amour, mais simplement de chercher et de trouver tous les obstacles que tu as érigés contre lui.",
    source: "Jalāl ad-Dīn Rūmī — Masnavi",
    tradition: "Soufisme",
  },
  {
    text: "Sors de ton cercle de temps comme un lotus qui s'ouvre à la lumière. Quand tu t'assoies avec moi, ne me dis pas que la vie est amère — pose-toi et ferme les yeux.",
    source: "Jalāl ad-Dīn Rūmī — Diwân de Shams-e Tabrizi",
    tradition: "Soufisme",
  },
  {
    text: "Il y a une voix qui ne s'exprime pas en mots. Écoute-la.",
    source: "Jalāl ad-Dīn Rūmī — Masnavi, Livre I",
    tradition: "Soufisme",
  },
  {
    text: "Vends ta sagesse et achète de l'étonnement. La sagesse est une opinion ; l'étonnement est de voir.",
    source: "Jalāl ad-Dīn Rūmī — Masnavi",
    tradition: "Soufisme",
  },
  {
    text: "Hier j'étais malin et je voulais changer le monde. Aujourd'hui je suis sage et je me change moi-même.",
    source: "Jalāl ad-Dīn Rūmī",
    tradition: "Soufisme",
  },
  {
    text: "Brise le cœur du passé et ouvre la porte au futur. Dans la douleur même se cache la médecine.",
    source: "Jalāl ad-Dīn Rūmī — Masnavi, Livre II",
    tradition: "Soufisme",
  },
  // Khalil Gibran — Le Prophète
  {
    text: "Vos enfants ne sont pas vos enfants. Ils sont les fils et les filles de l'appel de la Vie à elle-même. Ils viennent à travers vous, mais non de vous. Et bien qu'ils soient avec vous, ils ne vous appartiennent pas.",
    source: "Khalil Gibran — Le Prophète, « Des enfants »",
    tradition: "Sagesse orientale",
  },
  {
    text: "Le travail est l'amour rendu visible. Et si vous ne pouvez travailler qu'avec répugnance, il vaut mieux que vous abandonniez votre travail et vous assieyiez à la porte du temple pour recevoir l'aumône de ceux qui travaillent avec joie.",
    source: "Khalil Gibran — Le Prophète, « Du travail »",
    tradition: "Sagesse orientale",
  },
  {
    text: "La douleur est la rupture de la coque qui enferme votre compréhension. De même que le noyau du fruit doit se briser pour que son cœur se dresse au soleil, vous devez connaître la douleur.",
    source: "Khalil Gibran — Le Prophète, « De la douleur »",
    tradition: "Sagesse orientale",
  },
  {
    text: "Votre joie est votre tristesse sans masque. Et le même puits d'où jaillit votre rire a souvent été rempli de vos larmes.",
    source: "Khalil Gibran — Le Prophète, « De la joie et de la tristesse »",
    tradition: "Sagesse orientale",
  },
  {
    text: "Aimez-vous l'un l'autre mais ne faites pas de l'amour un lien. Qu'il soit plutôt une mer mouvante entre les rives de vos âmes.",
    source: "Khalil Gibran — Le Prophète, « Du mariage »",
    tradition: "Sagesse orientale",
  },
  {
    text: "La liberté n'est pas ce que tu attends d'un autre ou d'un lieu. La liberté est ce que tu portes en toi-même, partout où tu vas.",
    source: "Khalil Gibran — Le Prophète, « De la liberté »",
    tradition: "Sagesse orientale",
  },
  // Marc-Aurèle — Pensées pour moi-même
  {
    text: "Tu as du pouvoir sur ton esprit, pas sur les événements extérieurs. Comprends cela et tu trouveras la force.",
    source: "Marc-Aurèle — Pensées pour moi-même, Livre VI",
    tradition: "Stoïcisme",
  },
  {
    text: "La chose la plus importante dans ta vie n'est pas ce qui t'arrive, mais ce que tu fais de ce qui t'arrive. Tout dépend de ton jugement intérieur.",
    source: "Marc-Aurèle — Pensées pour moi-même, Livre IV",
    tradition: "Stoïcisme",
  },
  {
    text: "Commence le matin en te disant : je rencontrerai aujourd'hui des importuns, des ingrats, des arrogants, des trompeurs, des envieux, des égoïstes. Mais ils sont ainsi faits par leur ignorance du bien et du mal.",
    source: "Marc-Aurèle — Pensées pour moi-même, Livre II",
    tradition: "Stoïcisme",
  },
  {
    text: "Si ce n'est pas juste, ne le fais pas. Si ce n'est pas vrai, ne le dis pas. Tout est question de jugement et d'intention.",
    source: "Marc-Aurèle — Pensées pour moi-même, Livre XII",
    tradition: "Stoïcisme",
  },
  {
    text: "Consacre-toi à quelques choses seulement si tu veux être heureux. Car c'est dans l'agitation de trop d'occupations que la vie se dissipe.",
    source: "Marc-Aurèle — Pensées pour moi-même, Livre IV",
    tradition: "Stoïcisme",
  },
  {
    text: "Chaque heure, décide fermement, comme un Romain et un homme, d'accomplir ce que tu as en main avec une gravité exacte et véritable, avec bienveillance, liberté et justice.",
    source: "Marc-Aurèle — Pensées pour moi-même, Livre II",
    tradition: "Stoïcisme",
  },
  // Upanishads
  {
    text: "Tat tvam asi — Tu es cela. Ce qui est l'essence subtile, c'est cela qu'est toute cette création, c'est la réalité, c'est l'Atman, et toi, Shvetaketu, tu es cela.",
    source: "Chandogya Upanishad 6.8.7",
    tradition: "Védisme",
  },
  {
    text: "L'Atman, l'âme du monde, ne naît jamais, ne meurt jamais. Il n'est pas né, et ne mourra pas. Non créé, éternel, ancien, il n'est pas tué quand le corps est tué.",
    source: "Katha Upanishad 2.18",
    tradition: "Védisme",
  },
  {
    text: "Que la paix soit dans les hauteurs célestes, que la paix soit dans l'espace intermédiaire, que la paix soit sur la terre. Que les eaux soient paisibles, que les plantes soient paisibles. Om shanti, shanti, shanti.",
    source: "Atharva Veda — Prière de la paix",
    tradition: "Védisme",
  },
  {
    text: "Il existe deux voies : la voie de la connaissance et la voie de l'ignorance. Elles vont en sens contraires, conduisant l'une à la libération, l'autre à la servitude.",
    source: "Mundaka Upanishad 1.2.1",
    tradition: "Védisme",
  },
  {
    text: "Comme les rivières qui coulent dans l'océan, perdant leur nom et leur forme, de même le sage, affranchi de son nom et de sa forme, atteint la Lumière suprême.",
    source: "Mundaka Upanishad 3.2.8",
    tradition: "Védisme",
  },
  // Kybalion — Textes hermétiques
  {
    text: "Comme en haut, ainsi en bas ; comme en bas, ainsi en haut. Tout correspond. Cette grande vérité abolit toutes les contradictions apparentes.",
    source: "Le Kybalion — Principe de Correspondance",
    tradition: "Hermétisme",
  },
  {
    text: "Le tout est esprit ; l'univers est mental. Comprends ceci et tu tiendras la clé de toute existence.",
    source: "Le Kybalion — Principe de Mentalisme",
    tradition: "Hermétisme",
  },
  {
    text: "Le rythme se compense. La mesure du swing vers la droite est la mesure du swing vers la gauche. Ce qui monte doit descendre ; ce qui descend doit monter.",
    source: "Le Kybalion — Principe de Rythme",
    tradition: "Hermétisme",
  },
  {
    text: "Toute cause a son effet ; tout effet a sa cause. Tout se passe conformément à la loi. Le hasard n'est qu'un nom donné à une loi non reconnue.",
    source: "Le Kybalion — Principe de Causalité",
    tradition: "Hermétisme",
  },
  {
    text: "Il y a du genre en tout ; le genre se manifeste dans tout. Le masculin et le féminin sont présents partout dans la création.",
    source: "Le Kybalion — Principe de Genre",
    tradition: "Hermétisme",
  },
  // Sutras bouddhistes
  {
    text: "Trois choses ne peuvent longtemps rester cachées : le soleil, la lune et la vérité.",
    source: "Dhammapada — Paroles du Bouddha",
    tradition: "Bouddhisme",
  },
  {
    text: "Votre travail est de découvrir votre monde et de vous y donner de tout votre cœur.",
    source: "Dhammapada — Paroles du Bouddha",
    tradition: "Bouddhisme",
  },
  {
    text: "La paix vient de l'intérieur. Ne la cherchez pas sans. La haine ne cesse jamais par la haine en ce monde. La haine ne cesse que par l'amour.",
    source: "Dhammapada, verset 5 — Paroles du Bouddha",
    tradition: "Bouddhisme",
  },
  {
    text: "Tout ce que nous sommes est le résultat de nos pensées. L'esprit est tout. Ce que vous pensez, vous le devenez.",
    source: "Dhammapada, verset 1-2 — Paroles du Bouddha",
    tradition: "Bouddhisme",
  },
  {
    text: "Même la mort n'est pas à craindre par celui qui a vécu avec sagesse. Les erreurs du passé sont comme un nuage qui passe ; la compréhension est le vent qui les dissipe.",
    source: "Majjhima Nikaya — Discours du Bouddha",
    tradition: "Bouddhisme",
  },
  {
    text: "Celui qui n'est pas enchaîné par les désirs ni par le doute, qui a traversé les fleuves de la perplexité, celui-là je l'appelle un brahmane.",
    source: "Dhammapada, chapitre 26 — Paroles du Bouddha",
    tradition: "Bouddhisme",
  },
  // Poésie celtique
  {
    text: "Je suis le vent sur la mer. Je suis une vague sur l'océan. Je suis le rugissement de la mer. Je suis un bœuf de sept combats. Je suis un aigle sur un rocher.",
    source: "Chant d'Amergin — Poésie celtique ancienne",
    tradition: "Celtisme",
  },
  {
    text: "La lune est le miroir de l'eau. L'étoile est la fleur du ciel. L'amour est l'âme du monde. La douleur est la porte de la sagesse.",
    source: "Triades galloises — Sagesse bardique",
    tradition: "Celtisme",
  },
  {
    text: "Trois choses qui valent d'être conservées : la promesse, l'amitié et la santé. Car ces trois choses, une fois perdues, reviennent rarement.",
    source: "Triades irlandaises — Sagesse celtique",
    tradition: "Celtisme",
  },
  {
    text: "Ce qui est réel ne peut être vu. Ce qui peut être vu n'est qu'un reflet. Cherche la vérité dans les espaces entre les mots et le silence entre les sons.",
    source: "Tradition druidique — Enseignements des bardes",
    tradition: "Celtisme",
  },
  {
    text: "Dans chaque âme réside la forêt. Dans chaque forêt réside un temple. Dans chaque temple réside un feu. Avive ce feu et tu trouveras ton chemin.",
    source: "Tradition druidique — Poésie bardique",
    tradition: "Celtisme",
  },
  // Psaumes (version française classique)
  {
    text: "L'Éternel est mon berger : je ne manquerai de rien. Il me fait reposer dans de verts pâturages, il me dirige près des eaux paisibles.",
    source: "Psaume 23 — La Bible de Louis Segond",
    tradition: "Tradition hébraïque",
  },
  {
    text: "C'est toi qui crées dans mon cœur un esprit pur, et qui renouvelles en moi un esprit bien disposé. Ne me rejette pas loin de ta face.",
    source: "Psaume 51 — La Bible de Louis Segond",
    tradition: "Tradition hébraïque",
  },
  {
    text: "Du fond de l'abîme je crie vers toi, Seigneur. Seigneur, écoute ma voix ! Que ton oreille soit attentive à la voix de mes supplications.",
    source: "Psaume 130 — La Bible de Louis Segond",
    tradition: "Tradition hébraïque",
  },
  {
    text: "Remets ton sort à l'Éternel, espère en lui, et il agira. Il fera paraître ta justice comme la lumière, et ton droit comme le soleil à son midi.",
    source: "Psaume 37 — La Bible de Louis Segond",
    tradition: "Tradition hébraïque",
  },
  {
    text: "Je lève les yeux vers les montagnes. D'où me viendra le secours ? Mon secours vient de l'Éternel, qui a fait les cieux et la terre.",
    source: "Psaume 121 — La Bible de Louis Segond",
    tradition: "Tradition hébraïque",
  },
  {
    text: "Même si je marche dans la vallée de l'ombre de la mort, je ne crains aucun mal, car tu es avec moi ; ta houlette et ton bâton me rassurent.",
    source: "Psaume 23 — La Bible de Louis Segond",
    tradition: "Tradition hébraïque",
  },
  // Suppléments — sagesse universelle
  {
    text: "La nuit est le moment où les étoiles montrent leur vrai visage. De même, c'est dans les moments difficiles que l'âme révèle sa vraie nature.",
    source: "Épictète — Entretiens, Livre I",
    tradition: "Stoïcisme",
  },
  {
    text: "Ce que tu cherches te cherche aussi. La rencontre a déjà eu lieu en dehors du temps.",
    source: "Jalāl ad-Dīn Rūmī — Quatrains",
    tradition: "Soufisme",
  },
  {
    text: "Dans le silence, il y a l'éloquence. Cesse de tisser des mots et écoute. La mer qui refuse de parler n'est-elle pas la plus éloquente de toutes ?",
    source: "Jalāl ad-Dīn Rūmī — Masnavi, Livre IV",
    tradition: "Soufisme",
  },
  {
    text: "Celui qui connaît les autres est érudit. Celui qui se connaît lui-même est illuminé. Reste dans la lumière de ta propre connaissance.",
    source: "Tao Te Ching, Lao Tseu — Chapitre 33",
    tradition: "Taoïsme",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function drawRandomPassage(): SacredText {
  return SACRED_TEXTS[Math.floor(Math.random() * SACRED_TEXTS.length)];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PremiumWall({ title, message }: { title: string; message: string }) {
  return (
    <div className="max-w-lg mx-auto text-center px-6 py-20">
      <Crown size={40} className="text-[#d4af6f] mx-auto mb-6" />
      <div className="badge-gold mb-5">Premium</div>
      <h2 className="font-serif-display text-3xl text-gradient-cream mb-4">{title}</h2>
      <p className="font-serif-text italic text-[#c9b88a] mb-8">{message}</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link href="/tarifs" className="btn-gold">
          <Crown size={14} />
          <span>Voir les offres</span>
        </Link>
        <Link href="/mon-profil" className="btn-outline-gold">
          <span>Mon profil</span>
        </Link>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function BiblioManciePage() {
  const { profile, addReading, isHydrated } = useUserProfile();
  const [question, setQuestion] = useState("");
  const [drawnPassage, setDrawnPassage] = useState<SacredText | null>(null);
  const [reading, setReading] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  const handleOpenBook = () => {
    setBookOpen(true);
    setDrawnPassage(null);
    setReading("");
    setSubmitted(false);
    // Small delay for animation
    setTimeout(() => {
      setDrawnPassage(drawRandomPassage());
    }, 400);
  };

  const handleGetReading = async () => {
    if (!drawnPassage) return;
    setIsStreaming(true);
    setReading("");
    setSubmitted(true);
    try {
      const res = await authFetch("/api/bibliomancie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim() || undefined,
          passage: drawnPassage.text,
          source: drawnPassage.source,
          profile,
        }),
      });
      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setReading((p) => p + chunk);
      }
      addReading({
        type: "bibliomancie",
        title: drawnPassage.source,
        content: full,
        meta: { question },
      });
    } catch {
      setReading("Le livre garde ses secrets pour ce soir... Réessayez.");
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => {
    setDrawnPassage(null);
    setReading("");
    setSubmitted(false);
    setBookOpen(false);
    setQuestion("");
  };

  if (!isHydrated) return null;

  if (!profile) {
    return (
      <PremiumWall
        title="L'Oracle des Textes Sacrés"
        message="Inscrivez-vous gratuitement pour consulter l'oracle des textes sacrés."
      />
    );
  }

  if (!canAccessFeature(profile.subscription, "premium")) {
    return (
      <PremiumWall
        title="Bibliomancie — Abonnement requis"
        message="L'interprétation par IA des textes sacrés est réservée aux membres Premium."
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 fade-in-up">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="badge-gold mb-5">
          <BookOpen size={11} className="inline mr-2" />
          Bibliomancie
        </div>
        <h1 className="font-serif-display text-5xl md:text-6xl text-gradient-cream mb-4">
          L&apos;Oracle des Textes Sacrés
        </h1>
        <p className="font-serif-text italic text-[#c9b88a] text-lg max-w-2xl mx-auto">
          Laissez les grands textes de la sagesse universelle vous répondre
        </p>
      </div>

      {/* Process steps */}
      <div className="flex items-start justify-center gap-0 mb-12 max-w-2xl mx-auto">
        <Step number="1" label="Posez votre question" />
        <Connector />
        <Step number="2" label="Ouvrez le livre" />
        <Connector />
        <Step number="3" label="Recevez le message" />
      </div>

      {/* Question input */}
      <div className="luxe-card rounded-sm p-8 mb-8">
        <label className="luxe-label">Votre question (optionnelle)</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Quelle direction dois-je prendre ? Comment traverser cette épreuve ?"
          className="luxe-input"
          disabled={submitted && isStreaming}
        />
        <p className="text-[11px] text-[#c9b88a] mt-3 tracking-wide">
          Posez votre question dans votre cœur, fermez les yeux, puis ouvrez le livre...
        </p>
      </div>

      {/* Open book button */}
      {!drawnPassage && (
        <div className="flex justify-center mb-8">
          <button
            onClick={handleOpenBook}
            className="group relative"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <div
              className="luxe-card rounded-sm px-12 py-10 text-center transition-all duration-300"
              style={{
                border: "1px solid rgba(212,175,111,0.3)",
                minWidth: 280,
              }}
            >
              <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
                📖
              </div>
              <div className="font-serif-display text-[#d4af6f] text-xl mb-2">
                Ouvrir le Livre
              </div>
              <p className="text-[12px] text-[#c9b88a] tracking-wide">
                Touchez pour tirer un passage sacré au sort
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Drawn passage */}
      {drawnPassage && (
        <div
          className="mb-8 fade-in-up"
          style={{
            opacity: bookOpen ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          <div className="luxe-card rounded-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f]">
                Passage tiré au sort
              </div>
              <span
                className="text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-sm"
                style={{
                  border: "1px solid rgba(212,175,111,0.2)",
                  color: "#c9b88a",
                }}
              >
                {drawnPassage.tradition}
              </span>
            </div>

            <blockquote
              className="font-serif-text text-[#e8dcc0] text-[18px] leading-[1.9] mb-6 italic"
              style={{ borderLeft: "2px solid rgba(212,175,111,0.4)", paddingLeft: "1.5rem" }}
            >
              « {drawnPassage.text} »
            </blockquote>

            <p className="text-[12px] text-[#c9b88a] tracking-wide text-right">
              — {drawnPassage.source}
            </p>
          </div>

          {/* Action buttons */}
          {!submitted && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
              <button
                onClick={handleGetReading}
                className="btn-gold"
                disabled={isStreaming}
              >
                <Sparkles size={14} />
                <span>Obtenir l&apos;interprétation</span>
              </button>
              <button onClick={handleOpenBook} className="btn-outline-gold">
                <RotateCcw size={14} />
                <span>Tirer un autre passage</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reading result */}
      {submitted && (
        <div className="mb-8">
          <ReadingResult text={reading} isStreaming={isStreaming} />
        </div>
      )}

      {/* Reset */}
      {(drawnPassage || submitted) && (
        <div className="flex justify-center mb-8">
          <button onClick={reset} className="btn-outline-gold text-sm">
            <RotateCcw size={13} />
            <span>Nouvelle consultation</span>
          </button>
        </div>
      )}

      {/* Information section */}
      <div className="luxe-card rounded-sm p-8 mb-8">
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] mb-5">
          Qu&apos;est-ce que la bibliomancie ?
        </div>
        <div className="font-serif-text text-[#e8dcc0] text-[16px] leading-[1.85] space-y-3">
          <p>
            La bibliomancie est une pratique divinatoire ancestrale qui consiste à ouvrir un livre sacré
            au hasard et à lire le passage sur lequel le doigt se pose, comme réponse à une question ou
            guidance pour une situation. Cette pratique est attestée dans de nombreuses traditions :
            la <em>sortes Sanctorum</em> chrétienne, la <em>fal al-Qur&apos;an</em> islamique,
            la <em>sortes Virgilianæ</em> romaine.
          </p>
          <p>
            Ce que le hasard nous désigne n&apos;est jamais vraiment aléatoire : c&apos;est la synchronicité
            jungienne à l&apos;œuvre. L&apos;inconscient guide la main, et l&apos;univers répond à travers
            la sagesse des âges.
          </p>
        </div>
      </div>

      {/* Traditions */}
      <div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#d4af6f] text-center mb-6">
          Traditions représentées
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: "☯", name: "Tao Te Ching", trad: "Lao Tseu" },
            { icon: "🌹", name: "Soufisme", trad: "Rumi" },
            { icon: "🌿", name: "Sagesse orientale", trad: "Khalil Gibran" },
            { icon: "⚖", name: "Stoïcisme", trad: "Marc-Aurèle" },
            { icon: "🕉", name: "Upanishads", trad: "Védisme" },
            { icon: "☿", name: "Hermétisme", trad: "Kybalion" },
            { icon: "☸", name: "Bouddhisme", trad: "Dhammapada" },
            { icon: "🌳", name: "Celtisme", trad: "Triades & Bardes" },
            { icon: "✡", name: "Tradition hébraïque", trad: "Psaumes" },
          ].map((t) => (
            <div
              key={t.name}
              className="rounded-sm p-4 text-center"
              style={{ border: "1px solid rgba(212,175,111,0.12)", background: "rgba(212,175,111,0.02)" }}
            >
              <div className="text-2xl mb-1">{t.icon}</div>
              <div className="text-[11px] text-cream font-serif-display">{t.name}</div>
              <div className="text-[10px] text-[#c9b88a]">{t.trad}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tiny helpers ──────────────────────────────────────────────────────────────

function Step({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center mb-2 font-serif-display text-sm text-[#d4af6f]"
        style={{ border: "1px solid rgba(212,175,111,0.4)" }}
      >
        {number}
      </div>
      <div className="text-[10px] tracking-[0.15em] uppercase text-[#c9b88a] leading-tight max-w-[80px]">
        {label}
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex-shrink-0 flex items-start pt-4">
      <div className="w-8 h-px bg-[rgba(212,175,111,0.2)] mt-0" />
    </div>
  );
}
