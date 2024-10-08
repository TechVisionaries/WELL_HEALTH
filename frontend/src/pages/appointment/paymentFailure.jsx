import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa'; // Importing icon
import '../../styles/paymentStatus.css';

const PaymentFailure = () => {
  return (
    <div className="payment-status-container failure">
      <FaTimesCircle className="status-icon failure-icon" /> {/* Failure Icon */}
      <h1>Payment Failed!</h1>
      <p>Unfortunately, your payment could not be processed.</p>
      <p>Please try again or contact support for assistance.</p>
      <Link to="/" className="btn btn-primary">Return to Home</Link>
    </div>
  );
};

export default PaymentFailure;
