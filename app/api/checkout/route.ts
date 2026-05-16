import { NextRequest } from "next/server";
import Stripe from "stripe";
import { verifyIdToken, unauthorizedResponse } from "@/lib/firebase-admin";

export const maxDuration = 30;

// Price IDs définis dans le dashboard Stripe, passés via variables d'env Vercel :
//   STRIPE_PRICE_MYSTIQUE_MONTHLY, STRIPE_PRICE_MYSTIQUE_YEARLY
//   STRIPE_PRICE_VIP_MONTHLY,      STRIPE_PRICE_VIP_YEARLY
const PRICE_IDS = () => ({
  mystique: {
    monthly: process.env.STRIPE_PRICE_MYSTIQUE_MONTHLY,
    yearly:  process.env.STRIPE_PRICE_MYSTIQUE_YEARLY,
  },
  vip: {
    monthly: process.env.STRIPE_PRICE_VIP_MONTHLY,
    yearly:  process.env.STRIPE_PRICE_VIP_YEARLY,
  },
});

export async function POST(req: NextRequest) {
  const authResult = await verifyIdToken(req);
  if (!authResult) return unauthorizedResponse();

  const body = await req.json() as {
    tier: "mystique" | "vip";
    period: "monthly" | "yearly";
    email?: string;
    prenom?: string;
  };

  const { tier, period, email, prenom } = body;
  if (!tier || !period) return Response.json({ error: "Plan invalide" }, { status: 400 });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = PRICE_IDS()[tier]?.[period];

  // ── Mode simulé si Stripe n'est pas configuré ──
  if (!stripeKey || !priceId) {
    return Response.json({
      simulated: true,
      tier,
      period,
      message: "Mode démonstration — Stripe non configuré. Abonnement activé localement.",
    });
  }

  // ── Mode réel Stripe ──
  try {
    const stripe = new Stripe(stripeKey);
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://celestevoyance.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/tarifs/succes?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/tarifs`,
      customer_email: email || undefined,
      locale: "fr",
      metadata: { tier, prenom: prenom ?? "", period },
      subscription_data: { metadata: { tier, prenom: prenom ?? "" } },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[Stripe checkout error]", err);
    return Response.json({ error: "Erreur lors de la création du paiement" }, { status: 500 });
  }
}
