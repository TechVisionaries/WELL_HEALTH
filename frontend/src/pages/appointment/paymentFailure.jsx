import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa'; // Importing icon
import style from '../../styles/paymentStatus.module.css';

const PaymentFailure = () => {
  return (
    <div className={`${style.paymentStatusContainer} ${style.failure}`}>
      <FaTimesCircle className={`${style.statusIcon} ${style.failureIcon}`} /> {/* Failure Icon */}
      <h1>Payment Failed!</h1>
      <p>Unfortunately, your payment could not be processed.</p>
      <p>Please try again or contact support for assistance.</p>
      <Link to="/" className={`${style.btn} ${style.btnPrimary}`}>Return to Home</Link>
    </div>
  );
};

export default PaymentFailure;