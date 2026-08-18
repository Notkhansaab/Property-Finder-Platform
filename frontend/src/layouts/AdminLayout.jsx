import { NavLink, Outlet } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiHome,
  FiCheckCircle,
  FiBarChart2,
  FiLogOut,
} from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: FiGrid, end: true },
  { name: "Users", path: "/admin/users", icon: FiUsers },
  { name: "Hosts", path: "/admin/hosts", icon: FiUserCheck },
  { name: "Properties", path: "/admin/properties", icon: FiHome },
  {
    name: "Verifications",
    path: "/admin/verifications",
    icon: FiCheckCircle,
    badge: 4,
  },
  { name: "Reports", path: "/admin/reports", icon: FiBarChart2 },
];

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#faf8ff]">
      <aside className="flex w-72 flex-col border-r border-gray-200 bg-white p-6">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 font-bold text-white">
            EL
          </div>

          <div>
            <h2 className="text-xl font-bold text-blue-700">EstateLink</h2>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
          <img
            src="https://i.pravatar.cc/100?img=5"
            alt="Admin"
            className="h-12 w-12 rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-gray-900">Welcome Back</h3>

            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {menuItems.map(({ name, path, icon: Icon, badge, end }) => (
            <NavLink
              key={name}
              to={path}
              end={end}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span className="font-medium">{name}</span>
              </div>

              {badge && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#faf8ff]">
        <Outlet />
      </main>
    </div>
  );
}
