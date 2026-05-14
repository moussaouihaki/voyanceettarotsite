import {
  Sun, Hourglass, Heart, Briefcase, Sparkles, Layers, Star,
  Target, Calendar, Moon, Sunrise, Flower2, Clock, Hash, Leaf,
  Users, Flame, MessageCircleHeart, Search, Scale, Shuffle,
  Rocket, DollarSign, Gavel, Eye, Sparkle, Heart as Heart2,
  Repeat, Network, Infinity as InfinityIcon, ScrollText, Wand2,
  Plus, Triangle, Crown, Pyramid, Tent, Sigma, Globe2, Zap,
  Compass, MapPin, Brain, Activity, Hexagon, PartyPopper, ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import type { SpreadCategory } from "@/lib/spreads";

export const CATEGORY_ICONS: Record<SpreadCategory, LucideIcon> = {
  quotidien:     Sun,
  temporel:      Hourglass,
  amour:         Heart,
  professionnel: Briefcase,
  spirituel:     Sparkles,
  classique:     Layers,
  special:       Star,
};

export const SPREAD_ICONS: Record<string, LucideIcon> = {
  // Quotidien
  "carte-du-jour":   Sun,
  "oui-non":         Target,
  "carte-semaine":   Calendar,
  "carte-mois":      Moon,
  "matin-midi-soir": Sunrise,
  "meditation-jour": Flower2,
  // Temporel
  "passe-present-futur":     Hourglass,
  "passe-present-potentiel": Leaf,
  "annuel-13":               Calendar,
  "annuel-10":               Clock,
  "semaine-5":               ScrollText,
  "avant-hier-demain":       Repeat,
  "saisons":                 Leaf,
  // Amour
  "toi-moi-relation":   Users,
  "amour-6":            Heart,
  "flamme-jumelle":     Flame,
  "retour-affection":   MessageCircleHeart,
  "rencontrer-amour":   Search,
  "compatibilite":      Scale,
  "guerison-coeur":     Activity,
  // Professionnel
  "carriere-5":       Briefcase,
  "decision-carriere": Shuffle,
  "entreprise":       Rocket,
  "finances":         DollarSign,
  "conflit-travail":  Gavel,
  // Spirituel
  "shadow-work":       Eye,
  "mission-ame":       Star,
  "chakras-7":         Sparkle,
  "nouvelle-lune":     Moon,
  "pleine-lune":       Moon,
  "karma":             InfinityIcon,
  "guerison-interieure": Heart2,
  "manifestation":     Wand2,
  "naissance":         Sparkles,
  // Classique
  "croix-celtique":  Plus,
  "fer-a-cheval":    Triangle,
  "arbre-vie":       Network,
  "pyramide":        Pyramid,
  "croix-simple":    Plus,
  "romany":          Tent,
  // Spécial
  "astrologique-12":          Sigma,
  "elements-4":               Globe2,
  "mandala-9":                Hexagon,
  "decision-v":               Shuffle,
  "sante":                    Activity,
  "corps-ame-esprit":         Brain,
  "hexagramme":               Hexagon,
  "numérologique":            Hash,
  "anniversaire":             PartyPopper,
  "signes-zodiaque":          Sigma,
  "intention-manifestation":  Wand2,
  "etoile-6":                 Star,
  "yes-no-advanced":          Target,
};

export function getSpreadIcon(spreadId: string, category: SpreadCategory): LucideIcon {
  return SPREAD_ICONS[spreadId] || CATEGORY_ICONS[category] || Sparkles;
}

export const RUNE_SPREAD_ICONS: Record<string, LucideIcon> = {
  "rune-odin":  Eye,
  "nornes":     Hourglass,
  "croix-odin": Plus,
  "viking-6":   Compass,
  "asgard-9":   Globe2,
  "thor-7":     Zap,
};

export function getRuneSpreadIcon(id: string): LucideIcon {
  return RUNE_SPREAD_ICONS[id] || Sparkles;
}
