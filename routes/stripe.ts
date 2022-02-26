import { stripe } from '../utils/stripe';
import express, { Response } from 'express';
import { authUser, UserRequest } from '../middleware/auth';
import { stripeUpdate } from '../db/users';
const router = express.Router();

router.post(
  '/payment_intents',
  authUser,
  async (req: UserRequest, res: Response) => {
    const { amount } = req.body;
    const { email } = req.user;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        receipt_email: email,
      });
      res.status(200).send(paymentIntent);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
);

const price = {
  y: process.env.STRIPE_YEARLY_ID,
  m: process.env.STRIPE_MONTHLY_ID,
};

router.post(
  '/subscription',
  authUser,
  async (req: UserRequest, res: Response) => {
    const { email, id } = req.user;
    const { payment_method, plan } = req.body;

    try {
      const customer = await stripe.customers.create({
        payment_method,
        email,
        invoice_settings: {
          default_payment_method: payment_method,
        },
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price[plan] }],
        expand: ['latest_invoice.payment_intent'],
      });

      // update user in db with stripe subscription id and customer id
      await stripeUpdate(id, customer.id, subscription.id);

      res.status(200).json({ customer, subscription });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ msg: error.message });
    }
  }
);

// router.get('/cancel', authUser, async (req: UserRequest, res: Response) => {
//   const { stripeSubscriptionId } = req.user;
//   try {
//     const canceled = await cancelSubscription(stripeSubscriptionId);
//     return res.status(204).json({ data: canceled });
//   } catch (error) {
//     return res.status(400);
//   }
// });

module.exports = router;
