import { useSelector } from "react-redux";
import AdminHomePage from "./adminHomePage";
import DoctorHomePage from "./doctorHomePage";
import ManagerHomePage from "./managerHomePage";
import PatientHomePage from "./patientHomePage";

const ConditionalHome = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo || userInfo.userType === "patient") {
    return <PatientHomePage />;
  } else if (userInfo.userType === "manager") {
    return <ManagerHomePage />;
  }else if (userInfo.userType === "doctor") {
    return <DoctorHomePage />;
  }else if (userInfo.userType === "admin") {
    return <AdminHomePage />;
  }

  return null;
};

export default ConditionalHome;
