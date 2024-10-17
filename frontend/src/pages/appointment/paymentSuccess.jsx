import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; // Importing icon
import style from "../../styles/paymentStatus.module.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const PaymentSuccess = () => {
  const location = useLocation();

  useEffect(() => {
    const paymentSuccessResponse = async () => {
      const queryParams = new URLSearchParams(location.search);
      const sessionId = queryParams.get("session_id");

      if (sessionId) {
        try {
          await axios.get(`${BASE_URL}/payment/payment-success`, {
            params: {
              session_id: sessionId,
            },
          });
        } catch (error) {
          console.error("Error retrieving checkout session:", error);
        }
      }
    };

    paymentSuccessResponse();
  }, [location.search]);

  return (
    <div className={`${style.paymentStatusContainer} ${style.success}`}>
      <FaCheckCircle className={`${style.statusIcon} ${style.successIcon}`} />{" "}
      {/* Success Icon */}
      <h1>Payment Successful!</h1>
      <p>You have successfully booked your appointment.</p>
      <p>Thank you!</p>
      <Link to="/appointment" className={`${style.btn} ${style.btnPrimary}`}>
        See Your Appointment
      </Link>
    </div>
  );
};

export default PaymentSuccess;