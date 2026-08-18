import React, { useEffect, useState } from "react";
import {
  FiDownload,
  FiTrendingUp,
  FiInfo,
  FiDollarSign,
  FiHome,
  FiCalendar,
} from "react-icons/fi";

const HostDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [months, setMonths] = useState([]);

  const defaultStats = [
    {
      title: "Total Earnings",
      value: "$0",
      icon: <FiDollarSign />,
      detail: "",
      trend: false,
    },
    {
      title: "Total Listings",
      value: "0",
      icon: <FiHome />,
      detail: "",
      trend: false,
    },
    {
      title: "Active Listings",
      value: "0",
      icon: <FiHome />,
      detail: "",
      trend: false,
    },
    {
      title: "Total Bookings",
      value: "0",
      icon: <FiCalendar />,
      detail: "",
      trend: false,
    },
  ];

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await import("../../axios/api").then((m) =>
          m.getHostDashboard(),
        );

        if (!mounted) return;

        if (res.data && res.data.success) {
          const d = res.data.data;

          setStats([
            {
              title: "Total Earnings",
              value: `$${Number(d.totalEarnings || 0).toLocaleString()}`,
              icon: <FiDollarSign />,
              detail: `${d.monthlyRevenue && d.monthlyRevenue.length ? "Recent" : ""}`,
              trend: true,
            },
            {
              title: "Total Listings",
              value: `${d.totalListings || 0}`,
              icon: <FiHome />,
              detail: "",
              trend: false,
            },
            {
              title: "Active Listings",
              value: `${d.activeListings || 0}`,
              icon: <FiHome />,
              detail: "",
              trend: false,
            },
            {
              title: "Total Bookings",
              value: `${d.totalBookings || 0}`,
              icon: <FiCalendar />,
              detail: "",
              trend: true,
            },
          ]);

          setReservations(
            d.recentReservations.map((r) => ({
              name: r.property_title,
              guest: r.guest_name || "Guest",
              date:
                r.check_in && r.check_out
                  ? `${new Date(r.check_in).toLocaleDateString()} - ${new Date(r.check_out).toLocaleDateString()}`
                  : "-",
              amount: `$${r.total_amount || 0}`,
              status: r.status || "",
              color: "bg-gray-100 text-gray-700",
            })),
          );

          setMonths(
            d.monthlyRevenue.map((m) => ({ month: m.month, total: m.total })),
          );
        } else {
          setError(res.data?.message || "Failed to load dashboard");
          setStats(defaultStats);
          setReservations([]);
          setMonths([]);
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
        setStats(defaultStats);
        setReservations([]);
        setMonths([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Dashboard Overview
          </h1>

          <p className="text-gray-500 mt-1">
            Here's what's happening with your properties today.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
          <FiDownload />
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="relative bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="h-8 bg-gray-100 rounded w-24 mb-4" />
                <div className="h-10 bg-gray-100 rounded w-40" />
              </div>
            ))
          : stats.map((item, index) => (
              <div
                key={index}
                className="relative bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="absolute right-5 top-5 text-5xl text-blue-700 opacity-10">
                  {item.icon}
                </div>

                <p className="text-sm text-gray-500 mb-2">{item.title}</p>

                <h2 className="text-4xl font-bold text-gray-900">
                  {item.value}
                </h2>

                <div
                  className={`flex items-center gap-1 mt-4 text-sm ${item.trend ? "text-teal-600" : "text-gray-500"}`}
                >
                  {item.trend ? (
                    <FiTrendingUp size={16} />
                  ) : (
                    <FiInfo size={16} />
                  )}

                  {item.detail}
                </div>
              </div>
            ))}
      </div>

      {/* Chart + Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Monthly Revenue</h2>

            <select className="border rounded-lg px-3 py-2 text-sm">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>

          <div className="h-72 flex items-end gap-4 border-l border-b px-4 pb-2">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="w-full bg-gray-100 rounded-t h-24" />
                    <span className="text-xs text-gray-500">&nbsp;</span>
                  </div>
                ))
              : (() => {
                  const maxTotal =
                    months && months.length
                      ? Math.max(...months.map((m) => m.total || 0))
                      : 1;
                  return months.map((item, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-full bg-blue-100 rounded-t"
                        style={{
                          height: `${Math.min(95, Math.max(6, (item.total / (maxTotal || 1)) * 100))}%`,
                        }}
                      />

                      <span className="text-xs text-gray-500">
                        {item.month}
                      </span>
                    </div>
                  ));
                })()}
          </div>
        </div>

        {/* Reservations */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Reservations</h2>

            <button className="text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {reservations.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
              >
                <img
                  src={`https://i.pravatar.cc/100?img=${index + 10}`}
                  className="w-14 h-14 rounded-lg object-cover"
                  alt="Property"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>

                  <p className="text-xs text-gray-500">
                    {item.guest} • {item.date}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${item.color}`}
                  >
                    {item.status}
                  </span>

                  <p className="text-sm font-semibold mt-2">{item.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
