// src/pages/PaymentPage.jsx
import { useState } from 'react';
import axios from 'axios';
import style from  '../../styles/payment.module.css';

const PaymentPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(null);

    // Calculate charges
    const consultationFee = 50; // Example fee
    const channelingCharge = 10; // Example charge
    const vatTaxRate = 0.18;
    const subtotal = consultationFee + channelingCharge;
    const vatTax = subtotal * vatTaxRate;
    const totalCharges = subtotal + vatTax;

    const handlePayment = async () => {
        setIsLoading(true);
        setPaymentError(null);
        setPaymentSuccess(null);

        try {
            // Create a Checkout Session on the server
            const { data } = await axios.post('http://localhost:5000/api/payment/create-checkout-session', {
                amount: totalCharges
            });

            // Redirect to Stripe Checkout using the session URL
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No URL returned for Checkout session');
            }
        } catch (error) {
            console.error('Error creating Checkout session:', error);
            setPaymentError('Payment failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="payment-page container mt-5">
            <h2 className="text-center mb-4">Billing Information</h2>

            {/* Charges Summary Card */}
            <div className="card charges-summary mb-4">
                <div className="card-body">
                    <h4 className="info-title">Charges Summary</h4>
                    <p><strong>Channeling Charge:</strong> ${channelingCharge.toFixed(2)}</p>
                    <p><strong>Consultation Fee:</strong> ${consultationFee.toFixed(2)}</p>
                    <p><strong>VAT + TAX (18%):</strong> ${vatTax.toFixed(2)}</p>
                    <h5 className="total-charges"><strong>Total Charges:</strong> ${totalCharges.toFixed(2)}</h5>
                </div>
            </div>

            {/* Payment Button */}
            <button 
                className="btn proceed-btn mt-4" 
                onClick={handlePayment} 
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Pay Now'}
            </button>

            {paymentError && <div className="alert alert-danger mt-2">{paymentError}</div>}
            {paymentSuccess && <div className="alert alert-success mt-2">{paymentSuccess}</div>}
        </div>
    );
};

export default PaymentPage;
