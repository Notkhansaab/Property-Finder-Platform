import React from "react";
import { FiBell } from "react-icons/fi";

const NotificationBar = () => {
  return (
    <div className="relative group flex items-center">
      {/* Bell Icon */}
      <div className="relative text-gray-600 hover:text-blue-700 transition cursor-pointer">
        <FiBell size={22} />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
      </div>

      {/* Dropdown */}
      <div
        className="
          absolute right-0 top-full mt-3 w-80
          bg-white rounded-xl shadow-xl
          border border-gray-200
          opacity-0 invisible
          group-hover:opacity-100
          group-hover:visible
          transition-all duration-200
          z-50
        "
      >
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
        </div>

        {/* Notifications */}
        <div className="divide-y">
          <div className="p-4 hover:bg-gray-50 cursor-pointer transition">
            <p className="text-sm font-medium">New booking request</p>
            <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
          </div>

          <div className="p-4 hover:bg-gray-50 cursor-pointer transition">
            <p className="text-sm font-medium">Message from Host</p>
            <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
          </div>

          <div className="p-4 hover:bg-gray-50 cursor-pointer transition">
            <p className="text-sm font-medium">
              Price dropped on a wishlist property
            </p>
            <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t text-center">
          <div className="text-blue-700 hover:text-blue-800 text-sm font-semibold cursor-pointer">
            View All
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;
