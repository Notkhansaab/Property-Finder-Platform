import {
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

const cards = [
  {
    title: "Total Users",
    value: "12,450",
    change: "+5.2% this month",
    icon: FiUsers,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Total Revenue",
    value: "$1.2M",
    change: "+12.4% this month",
    icon: FiDollarSign,
    color: "bg-green-50 text-green-700",
  },
  {
    title: "Active Bookings",
    value: "842",
    change: "Stable this week",
    icon: FiCalendar,
    color: "bg-orange-50 text-orange-600",
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Overview</h1>

        <p className="mt-2 text-gray-500">
          System performance and pending actions.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {cards.map(({ title, value, change, icon: Icon, color }) => (
          <div
            key={title}
            className="rounded-3xl bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-medium text-gray-500">{title}</h3>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
              >
                <Icon size={22} />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-gray-900">{value}</h2>

            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-green-600">
              <FiTrendingUp size={16} />
              {change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
