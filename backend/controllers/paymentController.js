// backend/controllers/paymentController.js
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Appointment from '../models/appointmentModel.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to create a Checkout Session
export const createCheckoutSession = async (req, res) => {
  const { serviceCharge, consultationFee, appointmentId } = req.body; 

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'lkr',
            product_data: {
              name: 'Service Charge', 
            },
            unit_amount: serviceCharge * 100, // Amount in cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'lkr',
            product_data: {
              name: 'Consultation Fee', 
            },
            unit_amount: consultationFee * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.SUCCESS_URL}`, // Redirect URL after successful payment
      cancel_url: `${process.env.CANCEL_URL}`, // Redirect URL if the user cancels
      metadata: {
        appointmentId, // Include the appointmentId in the metadata
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};