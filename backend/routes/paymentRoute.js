import express from 'express';
import { createCheckoutSession,paymentSuccess } from '../controllers/paymentController.js';

const router = express.Router();

// Route to handle creating a payment intent
router.post('/create-checkout-session', createCheckoutSession);
router.get('/payment-success', paymentSuccess);

export default router;
