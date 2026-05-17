import { NextRequest } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { getUserByEmail, updateFirestoreSubscription } from "@/lib/firebase-db";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return new Response("Stripe non configuré", { status: 500 });
  }

  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return new Response("Signature manquante", { status: 400 });

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(stripeKey);
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.error("[Webhook signature error]", err);
    return new Response("Signature invalide", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const tier = session.metadata?.tier as string | undefined;
    const customerEmail = session.customer_details?.email ?? session.metadata?.email;

    if (tier && customerEmail) {
      const user = await getUserByEmail(customerEmail);
      if (user?.uid) {
        await updateFirestoreSubscription(user.uid, tier);
        if (process.env.NODE_ENV === "development") console.log(`[Webhook] Abonnement activé — ${customerEmail} → ${tier}`);
      } else {
        if (process.env.NODE_ENV === "development") console.warn(`[Webhook] Utilisateur introuvable pour email: ${customerEmail}`);
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const stripe = new Stripe(stripeKey);
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.deleted && customer.email) {
        const user = await getUserByEmail(customer.email);
        if (user?.uid) {
          await updateFirestoreSubscription(user.uid, "decouverte");
          if (process.env.NODE_ENV === "development") console.log(`[Webhook] Abonnement résilié — ${customer.email} → decouverte`);
        }
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") console.error("[Webhook] Erreur résiliation", e);
    }
  }

  return new Response("OK", { status: 200 });
}
