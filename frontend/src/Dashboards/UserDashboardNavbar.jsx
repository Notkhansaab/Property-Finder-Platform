import React from "react";
import { NavLink } from "react-router-dom";
import { FiSearch, FiBell } from "react-icons/fi";
import NotificationBar from "../components/NotificationBar";
import { useAuth } from "../context/authContext";

const UserDashboardNavbar = () => {
  const { user } = useAuth();

  const displayName =
    user?.name || user?.fullName || user?.full_name || user?.email || "User";
  const avatar =
    user?.avatar ||
    user?.avatar_url ||
    `https://i.pravatar.cc/100?u=${user?.id || "anon"}`;

  return (
    <header className="h-20 bg-white shadow-sm sticky top-0 z-40">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Navigation Links */}
        <nav className="hidden md:flex gap-8">
          <NavLink
            to="/rent"
            className="text-gray-600 hover:text-blue-700 transition"
          >
            Rent
          </NavLink>

          <NavLink
            to="/buy"
            className="text-gray-600 hover:text-blue-700 transition"
          >
            Buy
          </NavLink>

          <NavLink
            to="/lease"
            className="text-gray-600 hover:text-blue-700 transition"
          >
            Lease
          </NavLink>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-5 h-full">
          {/* Notifications */}
          <NotificationBar />

          {/* User */}
          <button className="flex items-center gap-3 border rounded-full px-3 py-1 hover:shadow-sm transition">
            <span className="text-sm font-medium">{displayName}</span>

            <img
              src={avatar}
              alt="User"
              className="w-9 h-9 rounded-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default UserDashboardNavbar;
