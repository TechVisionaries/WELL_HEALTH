import { useSelector } from "react-redux";
import Header from "./patientHeader";
import ManagerHeader from "./managerHeader";
import DoctorHeader from "./doctorHeader";

const ConditionalHeader = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo || userInfo.userType === "patient") {
    // Render patient or general user header
    return <Header />;
  } else if (userInfo.userType === "manager") {
    // Render manager-specific header
    return <ManagerHeader />;
  }else if (userInfo.userType === "doctor") {
    // Render manager-specific header
    return <DoctorHeader />;
  }

  // You can add other cases for different user types if necessary
  return null;
};

export default ConditionalHeader;
