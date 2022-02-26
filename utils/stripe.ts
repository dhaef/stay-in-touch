import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

export const checkSubscription = async (stripeSubscriptionId) => {
  if (!stripeSubscriptionId) {
    return false;
  }

  const subscription = await stripe.subscriptions.retrieve(
    stripeSubscriptionId
  );

  if (!subscription || subscription.status !== 'active') {
    console.log('Stripe subscription is incomplete.');
    return false;
  }

  return true;
};
