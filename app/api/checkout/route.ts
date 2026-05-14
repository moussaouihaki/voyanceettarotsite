import { NextRequest } from "next/server";

// Placeholder Stripe checkout API.
// When STRIPE_SECRET_KEY is set, this would create a real Checkout Session.
// For now, returns a "simulated" success to demo the upgrade flow.

const PRICE_MAP: Record<string, Record<string, { amount: number; productName: string }>> = {
  mystique: {
    monthly: { amount: 990, productName: "Abonnement Mystique mensuel" },
    yearly:  { amount: 9500, productName: "Abonnement Mystique annuel" },
  },
  vip: {
    monthly: { amount: 2990, productName: "Abonnement Voyante VIP mensuel" },
    yearly:  { amount: 28700, productName: "Abonnement Voyante VIP annuel" },
  },
};

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    tier: "mystique" | "vip";
    period: "monthly" | "yearly";
    email?: string;
    prenom?: string;
  };

  const { tier, period } = body;
  const plan = PRICE_MAP[tier]?.[period];
  if (!plan) {
    return Response.json({ error: "Plan invalide" }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    // Simulated mode — return a "simulated" flag so the client can grant access locally.
    return Response.json({
      simulated: true,
      message: "Mode démonstration — Stripe non configuré. Abonnement activé en local.",
      tier,
      period,
    });
  }

  // Real Stripe integration would go here:
  //
  // const stripe = new Stripe(stripeKey);
  // const session = await stripe.checkout.sessions.create({
  //   mode: "subscription",
  //   payment_method_types: ["card"],
  //   line_items: [{ price: PRICE_ID_MAP[tier][period], quantity: 1 }],
  //   success_url: `${req.nextUrl.origin}/tarifs/succes?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
  //   cancel_url: `${req.nextUrl.origin}/tarifs`,
  //   customer_email: body.email,
  //   metadata: { tier, prenom: body.prenom ?? "" },
  // });
  // return Response.json({ url: session.url });

  return Response.json({
    simulated: true,
    message: "Stripe configuré mais price IDs non définis. Mode simulé activé.",
    tier,
    period,
  });
}
