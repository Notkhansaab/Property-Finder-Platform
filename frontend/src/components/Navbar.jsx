import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import NotificationBar from "./NotificationBar";
import {
  FiX,
  FiCalendar,
  FiHeart,
  FiSettings,
  FiRefreshCw,
  FiLogOut,
} from "react-icons/fi";
import { toggleHostMode, getNotifications } from "../axios/api";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth(); // 👈 Uses global auth context
  const avatar =
    user?.avatar ||
    user?.avatar_url ||
    `https://i.pravatar.cc/100?u=${user?.id || "anon"}`;

  const [isHost, setIsHost] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setIsHost(user.isHost || user.role === "host" || false);
      getNotifications()
        .then((res) => setNotifications(res.data?.data || res.data || []))
        .catch(() => setNotifications([]));
    }
  }, [user]);

  const handleHostToggle = async () => {
    try {
      const response = await toggleHostMode();
      setIsHost(response.data?.isHost ?? !isHost);
    } catch (err) {
      console.error("Failed to toggle host status:", err);
    }
  };

  const handleBecomeHostNavigate = () => {
    // Navigate to the Become Host flow instead of toggling role
    navigate("/becomehost");
  };

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate("/signin");
  };

  const userLoggedIn = Boolean(user);
  const displayName = user?.fullName || user?.name || "User";

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200">
        <div className="mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-3xl font-bold text-blue-700">
              EstateLink
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
              {[
                { name: "Rent", path: "/rent" },
                { name: "Buy", path: "/buy" },
                { name: "Lease", path: "/lease" },
              ].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-700 border-b-2 border-blue-700 pb-1"
                      : "hover:text-blue-700 transition"
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {userLoggedIn && (
                <button
                  onClick={() =>
                    isHost ? navigate("/host") : handleBecomeHostNavigate()
                  }
                  className="hover:text-blue-700 transition"
                >
                  {isHost ? "Switch to Host" : "Become a Host"}
                </button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {!loading && (
              <>
                {userLoggedIn && (
                  <button
                    onClick={() => setNotificationOpen(true)}
                    className="relative"
                  >
                    <NotificationBar count={notifications.length} />
                  </button>
                )}

                {userLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-3 border border-gray-200 rounded-full pl-4 pr-1 py-1 hover:shadow-md transition"
                    >
                      <span className="text-gray-700 font-medium">
                        {displayName}
                      </span>
                      <img
                        src={avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                      />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                        <Link
                          to="/userdashboard/bookings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700"
                        >
                          <FiCalendar size={18} className="text-gray-500" />
                          My Bookings
                        </Link>
                        <Link
                          to="/userdashboard/wishlist"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700"
                        >
                          <FiHeart size={18} className="text-gray-500" />
                          Wishlist
                        </Link>
                        <Link
                          to="/userdashboard/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700"
                        >
                          <FiSettings size={18} className="text-gray-500" />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            if (isHost) {
                              handleHostToggle();
                            } else {
                              handleBecomeHostNavigate();
                            }
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700"
                        >
                          <FiRefreshCw size={18} className="text-gray-500" />
                          {isHost ? "Switch to Host" : "Become a Host"}
                        </button>
                        <div className="border-t my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-gray-50"
                        >
                          <FiLogOut size={18} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="text-gray-600 font-medium hover:text-blue-700"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
