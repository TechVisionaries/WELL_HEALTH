import express from 'express';
import { createCheckoutSession } from '../controllers/paymentController.js';

const router = express.Router();

// Route to handle creating a payment intent
router.post('/create-checkout-session', createCheckoutSession);

export default router;
