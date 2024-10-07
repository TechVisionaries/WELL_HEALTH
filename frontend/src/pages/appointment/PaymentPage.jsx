// src/pages/PaymentPage.jsx

import '../../styles/payment.css'; // Import custom CSS file for styling

const PaymentPage = () => {
 

  // Calculate charges
  const consultationFee = 50; // Example fee
  const channelingCharge = 10; // Example charge
  const vatTaxRate = 0.18;
  const subtotal = consultationFee + channelingCharge;
  const vatTax = subtotal * vatTaxRate;
  const totalCharges = subtotal + vatTax;

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


      <div className="text-center mt-4">
        <button className="btn proceed-btn">Proceed to Pay</button>
      </div>
    </div>
     
  );
};

export default PaymentPage;
