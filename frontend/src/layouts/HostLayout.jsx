import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  FiLayout,
  FiHome,
  FiPlusSquare,
  FiCalendar,
  FiDollarSign,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiRepeat,
} from "react-icons/fi";

const HostLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const menu = [
    { name: "Overview", path: "/host", end: true, icon: <FiLayout /> },
    { name: "My Listings", path: "/host/listings", icon: <FiHome /> },
    {
      name: "Add Property",
      path: "/host/addproperty",
      icon: <FiPlusSquare />,
    },
    { name: "Bookings", path: "/host/bookings", icon: <FiCalendar /> },
    { name: "Earnings", path: "/host/earnings", icon: <FiDollarSign /> },
    { name: "Messages", path: "/host/messages", icon: <FiMessageSquare /> },
    { name: "Settings", path: "/host/settings", icon: <FiSettings /> },
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex-col p-5">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">
            EL
          </div>

          <h1 className="text-xl font-bold text-blue-700">EstateLink</h1>
        </div>

        {/* Profile */}
        <HostProfileSummary />

        {/* Switch User */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-4 py-3 text-blue-700 hover:bg-blue-50 rounded-lg mb-5 transition"
        >
          <FiRepeat size={18} />
          Switch to User mode
        </button>

        {/* Menu */}
        <nav className="flex flex-col gap-1 flex-1">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition"
        >
          <FiLogOut />
          Logout
        </button>
      </aside>

      {/* Page Area */}
      <main className="md:ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default HostLayout;

// Small component to show current host summary
function HostProfileSummary() {
  const { user } = useAuth();

  const avatar =
    user?.avatar ||
    user?.avatar_url ||
    `https://i.pravatar.cc/100?u=${user?.id || "host"}`;
  const name = user?.fullName || user?.name || "Host";

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-5">
      <img
        src={avatar}
        className="w-10 h-10 rounded-full object-cover"
        alt="Host"
      />

      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500">Manage your properties</p>
      </div>
    </div>
  );
}
