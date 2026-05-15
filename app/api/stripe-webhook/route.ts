import { NextRequest } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

// Stripe webhook — écoute checkout.session.completed pour valider les abonnements.
// Variable d'env requise : STRIPE_WEBHOOK_SECRET (depuis le dashboard Stripe > Webhooks)
// L'abonnement est validé côté serveur — plus fiable que le seul paramètre URL de succès.

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return new Response("Stripe non configuré", { status: 200 });
  }

  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return new Response("Signature manquante", { status: 400 });

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(stripeKey);
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[Webhook signature error]", err);
    return new Response("Signature invalide", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const tier = session.metadata?.tier;
    const prenom = session.metadata?.prenom;
    // Le tier est validé. La page /tarifs/succes met à jour le profil localStorage
    // via le paramètre tier dans l'URL de redirection Stripe (success_url).
    console.log(`[Webhook] Abonnement activé — ${prenom} → ${tier}`);
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    console.log(`[Webhook] Abonnement résilié — ${sub.metadata?.prenom}`);
    // En production : mettre à jour la DB pour repasser l'utilisateur en "decouverte"
  }

  return new Response("OK", { status: 200 });
}
