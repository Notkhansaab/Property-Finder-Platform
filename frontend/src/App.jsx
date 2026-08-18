import React from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Home from "./pages/Home";
import Rent from "./pages/rent/Rent";
import Buy from "./pages/buy/Buy";
import Lease from "./pages/lease/Lease";
// import Reporting from "./pages/ReportModal";
// ----------------
import DashboardLayout from "./Dashboards/UserDashboardLayout";
import BookingsLayout from "./pages/userdashboard/BookingsLayout";
import WishlistLayout from "./pages/userdashboard/WishlistLayout";
import MessagesLayout from "./pages/userdashboard/MessagesLayout";
import SettingsLayout from "./pages/userdashboard/SettingsLayout";
import BecomeHost from "./pages/become_host/BecomeHost";
import DocumentVerification from "./pages/become_host/DocumentVerification";
import RentPayment from "./pages/propertydetails/RentPayment";
import LeasePayment from "./pages/propertydetails/LeasePayment";
import PurchasePayment from "./pages/propertydetails/PurchasePayment";
// ------------
import HostLayout from "./layouts/HostLayout";
import HostDashboard from "./pages/hostDashboard/HostDashboard";
import HostListings from "./pages/hostDashboard/HostListings";
import AddProperty from "./pages/hostDashboard/AddProperty";
import HostBookings from "./pages/hostDashboard/HostBookings";
import HostBookingDetails from "./pages/hostDashboard/HostBookingDetails";
import HostEarnings from "./pages/hostDashboard/HostEarnings";
import HostMessages from "./pages/hostDashboard/HostMessages";
import HostProfile from "./pages/hostDashboard/hostSettings/HostProfile";
import HostSettings from "./pages/hostDashboard/hostSettings/HostSettings";
import HostSecurity from "./pages/hostDashboard/hostSettings/HostSecurity";
import HostPayments from "./pages/hostDashboard/hostSettings/HostPayment";
// -------
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import AdminUsers from "./pages/adminDashboard/AdminUsers";
import AdminHosts from "./pages/adminDashboard/AdminHosts";
import HostDetails from "./pages/adminDashboard/HostDetails";
import AdminProperties from "./pages/adminDashboard/AdminProperties";
import AdminVerification from "./pages/adminDashboard/AdminVerification";
import AdminReports from "./pages/adminDashboard/AdminReports";
import HostReports from "./pages/adminDashboard/reports/HostReports";
import PropertyReports from "./pages/adminDashboard/reports/PropertyReports";
import UsersReports from "./pages/adminDashboard/reports/UsersReports";
import PropertyDetails from "./pages/propertydetails/PropertyDetails";

const App = () => {
  const location = useLocation();

  const navbarPages = [
    "/",
    "/home",
    "/rent",
    "/buy",
    "/lease",
    "/becomehost",
    "/documentverification",
    "reporting",
  ];

  const showNavbar =
    navbarPages.includes(location.pathname) ||
    location.pathname.startsWith("/property/", "/payment/");
  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/lease" element={<Lease />} />
        <Route path="/becomehost" element={<BecomeHost />} />
        {/* <Route path="/reporting/:id" element={<Reporting />} /> */}
        <Route
          path="/documentverification"
          element={<DocumentVerification />}
        />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/payment/rent/:id" element={<RentPayment />} />

        <Route path="/payment/lease/:id" element={<LeasePayment />} />

        <Route path="/payment/purchase/:id" element={<PurchasePayment />} />

        {/* User dashboard parent route */}
        <Route path="/userdashboard" element={<DashboardLayout />}>
          <Route index element={<BookingsLayout />} />
          <Route path="bookings" element={<BookingsLayout />} />
          <Route path="wishlist" element={<WishlistLayout />} />
          <Route path="messages" element={<MessagesLayout />} />
          <Route path="settings" element={<SettingsLayout />} />
        </Route>

        {/* Host dashboard Parent route */}
        <Route path="/host" element={<HostLayout />}>
          <Route index element={<HostDashboard />} />
          <Route path="listings" element={<HostListings />} />
          <Route path="addproperty" element={<AddProperty />} />
          <Route path="bookings" element={<HostBookings />} />
          <Route path="bookings/:id" element={<HostBookingDetails />} />
          <Route path="earnings" element={<HostEarnings />} />
          <Route path="messages" element={<HostMessages />} />
          {/* Settings */}
          <Route path="settings" element={<HostSettings />}>
            <Route index element={<HostProfile />} />
            <Route path="security" element={<HostSecurity />} />
            <Route path="payments" element={<HostPayments />} />
          </Route>
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="users" element={<AdminUsers />} />
          <Route path="hosts" element={<AdminHosts />} />

          {/* Host Details Page */}
          <Route path="hosts/:id" element={<HostDetails />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="verifications" element={<AdminVerification />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="reports/hosts" element={<HostReports />} />
          <Route path="reports/properties" element={<PropertyReports />} />
          <Route path="reports/users" element={<UsersReports />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
