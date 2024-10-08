import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // Importing icon
import '../../styles/paymentStatus.css';

const PaymentSuccess = () => {
  return (
    <div className="payment-status-container success">
      <FaCheckCircle className="status-icon success-icon" /> {/* Success Icon */}
      <h1>Payment Successful!</h1>
      <p>Your payment has been processed successfully.</p>
      <p>Thank you!</p>
      <Link to="/" className="btn btn-primary">Return to Home</Link>
    </div>
  );
};

export default PaymentSuccess;
