import { NavLink, Outlet } from "react-router-dom";
import { FiCreditCard, FiShield, FiUser } from "react-icons/fi";

const tabs = [
  {
    name: "Profile",
    icon: <FiUser />,
    to: "/host/settings",
    end: true,
  },
  {
    name: "Security",
    icon: <FiShield />,
    to: "/host/settings/security",
  },
  {
    name: "Payments",
    icon: <FiCreditCard />,
    to: "/host/settings/payments",
  },
];

export default function HostSettings() {
  return (
    <div className="flex-1 min-h-full bg-[#faf8ff] p-6 md:p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Account Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your personal details, security preferences, and payment
          settings.
        </p>
      </div>

      {/* Navigation */}
      <div className="mb-10 flex gap-8 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex items-center gap-2 border-b-2 pb-4 text-sm font-medium transition ${
                isActive
                  ? "border-blue-700 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`
            }
          >
            {tab.icon}
            {tab.name}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
