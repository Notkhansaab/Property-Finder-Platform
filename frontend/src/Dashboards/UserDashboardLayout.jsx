import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import UserDashboardNavbar from "./UserDashboardNavbar";
import {
  FiCalendar,
  FiHeart,
  FiMail,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiBell,
} from "react-icons/fi";

import { useAuth } from "../context/authContext";

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };
  const menu = [
    {
      name: "Bookings",
      path: "/userdashboard/bookings",
      icon: FiCalendar,
    },
    {
      name: "Wishlist",
      path: "/userdashboard/wishlist",
      icon: FiHeart,
    },
    {
      name: "Messages",
      path: "/userdashboard/messages",
      icon: FiMail,
    },
    {
      name: "Settings",
      path: "/userdashboard/settings",
      icon: FiSettings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <aside
        className="
        fixed left-0 top-0 h-screen w-64
        bg-white border-r border-gray-200
        hidden md:flex flex-col p-4
      "
      >
        <div className="px-4 py-2 mb-8">
          <h1 className="text-2xl font-bold text-blue-700">EstateLink</h1>

          <p className="text-xs text-gray-500 mt-1">Professional Portal</p>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {/* Sidebar */}
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <button
          className="
          flex items-center gap-3 px-4 py-3
          text-gray-600 hover:bg-gray-100
          rounded-lg
          "
          onClick={handleLogout}
        >
          <FiLogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main */}
      <div className="md:ml-64">
        {/* Dashboard Topbar */}
        <UserDashboardNavbar />

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
