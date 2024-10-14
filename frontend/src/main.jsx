import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoadScript } from '@react-google-maps/api';

import store from './store';
import { Provider } from 'react-redux';
 
import App from './App.jsx';


import PatientHomePage from './pages/patientHomePage.jsx';
import DoctorHomePage from './pages/doctorHomePage.jsx';
import AdminHomePage from './pages/adminHomePage.jsx'
import ManagerHomePage from './pages/managerHomePage.jsx';

import LoginPage from './pages/loginPage.jsx';
import RegisterPage from './pages/registerPage.jsx';
import VerifyEmailPage from './pages/verifyEmailPage.jsx';
import ProfilePage from './pages/profilePage.jsx';
import GenerateOtpPage from './pages/generateOtpPage.jsx';
import ResetPasswordPage from './pages/resetPasswordPage.jsx';

import PrivateRoute from './components/privateRoute';
import AdminRoute from './components/adminRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Loading from './components/loadingComponent.jsx';

import PaymentPage from './pages/appointment/PaymentPage.jsx';

import HealthCardPage from './pages/HealthCardPage.jsx';
import PatientProfile from './pages/PatientProfile.jsx';
import AddPrescription from './components/AddPrescription.jsx';
import AppointmentDashboard from './pages/appointment/appointmentDashboard.jsx';
import PaymentSuccess from './pages/appointment/paymentSuccess.jsx';
import PaymentFailure from './pages/appointment/paymentFailure.jsx';
import DoctorAppointmentsDashboard from './pages/appointment/doctorAppointmentsDashboard.jsx';
import StaffPage from './pages/manage staff/staffPage.jsx';
import PrescriptionsPage from './pages/PrescriptionsPage.jsx';
import ManageUsersPage from './pages/manageUsersPage.jsx';



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index={true} path="/" element={<PatientHomePage />} />
      <Route index={true} path="/doctor-home" element={<DoctorHomePage />} />
      <Route index={true} path="/admin-home" element={<AdminHomePage />} />
      <Route index={true} path="/manager-home" element={<ManagerHomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/manage_users" element={<ManageUsersPage />} />
      <Route
        path="/register/:tokenHeader/:tokenPayload/:tokenSecret"
        element={<VerifyEmailPage />}
      />
      <Route path="/generateotp" element={<GenerateOtpPage />} />
      <Route path="/resetpassword" element={<ResetPasswordPage />} />
      <Route path="/health-card" element={<HealthCardPage />} />
      <Route path="/patient-profile" element={<PatientProfile />} />
      <Route path="/add-prescription" element={<AddPrescription />} />
      <Route path="/prescriptions" element={<PrescriptionsPage />} />

      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/appointment" element={<AppointmentDashboard />} />
        <Route path="/appointment/payment" element={<PaymentPage />} />
        <Route
          path="/appointment/payment/success"
          element={<PaymentSuccess />}
        />
        <Route
          path="/appointment/payment/cancel"
          element={<PaymentFailure />}
        />
        <Route
          path="/doctor/appointments"
          element={<DoctorAppointmentsDashboard />}
        />

        <Route path="/staff" element={<StaffPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="" element={<AdminRoute />}></Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store = {store}>
    <React.StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} loadingElement={<Loading />}>
          <RouterProvider router={ router } />
        </LoadScript>
      </GoogleOAuthProvider>
    </React.StrictMode>
  </Provider>,
)
