// backend/controllers/paymentController.js
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to create a Checkout Session
export const createCheckoutSession = async (req, res) => {
  const { amount } = req.body; // Get the amount from the request body

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Total Fee', // Replace with your product/service name
            },
            unit_amount: amount * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.SUCCESS_URL}`, // Redirect URL after successful payment
      cancel_url: `${process.env.CANCEL_URL}`, // Redirect URL if the user cancels
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};
