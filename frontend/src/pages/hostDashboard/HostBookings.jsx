import { useEffect, useState } from "react";
import {
  FiSearch,
  FiCalendar,
  FiUsers,
  FiEye,
  FiX,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiCheck,
} from "react-icons/fi";
import { getHostBookings } from "../../axios/api";

// Helper to format date strings nicely (e.g. "2026-08-15" -> "Aug 15, 2026")
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Modern Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      icon: <FiCheckCircle size={13} />,
      label: "Confirmed",
    },
    pending: {
      bg: "bg-amber-50 text-amber-700 border-amber-200/60",
      icon: <FiClock size={13} />,
      label: "Pending",
    },
    completed: {
      bg: "bg-blue-50 text-blue-700 border-blue-200/60",
      icon: <FiCheck size={13} />,
      label: "Completed",
    },
    cancelled: {
      bg: "bg-rose-50 text-rose-700 border-rose-200/60",
      icon: <FiXCircle size={13} />,
      label: "Cancelled",
    },
  };

  const current = styles[status?.toLowerCase()] || styles.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${current.bg}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};

export default function HostBookings() {
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Map backend bookings to UI shape
  const hostBookings = bookingsList.map((booking) => ({
    id: booking.id,
    propertyId: booking.property_id,
    propertyTitle: booking.property_title || "Unknown Property",
    propertyLocation: booking.property_location || "Unknown Location",
    propertyImage: booking.property_image || "",
    guestName: booking.guest_name || "Guest",
    guestEmail: booking.guest_email || "",
    userId: booking.user_id,
    checkIn: booking.check_in,
    checkOut: booking.check_out,
    guests: booking.guests,
    totalAmount: booking.total_amount,
    status: booking.status,
    createdAt: booking.created_at,
  }));

  // 3. Filter based on user search and status tabs
  const filteredBookings = hostBookings.filter((b) => {
    const matchesSearch =
      b.guestName.toLowerCase().includes(search.toLowerCase()) ||
      b.propertyTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.propertyLocation.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || b.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Action handlers to update booking status locally
  const updateStatus = (bookingId, newStatus) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)),
    );
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await getHostBookings();
        if (!mounted) return;
        if (res.data && res.data.success) {
          setBookingsList(res.data.data);
        } else {
          setError(res.data?.message || "Failed to load bookings");
        }
      } catch (err) {
        setError(err.message || "Failed to load bookings");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // Metrics summary calculations
  const totalRevenue = hostBookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const pendingCount = hostBookings.filter(
    (b) => b.status === "pending",
  ).length;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Bookings
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Track and manage reservations across your listed properties.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <FiSearch
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guest, property..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm outline-none cursor-pointer text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-600 transition"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Total Reservations
          </span>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {hostBookings.length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Pending Approval
          </span>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {pendingCount}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Confirmed Earnings
          </span>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bookings Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-medium text-gray-900">
              No bookings found
            </p>
            <p className="text-sm mt-1">
              Try adjusting your search query or filter settings.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Property</th>
                  <th className="py-4 px-6">Guest</th>
                  <th className="py-4 px-6">Dates</th>
                  <th className="py-4 px-6">Guests</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Property info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={b.propertyImage}
                          alt={b.propertyTitle}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 leading-snug">
                            {b.propertyTitle}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {b.propertyLocation}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Guest Info */}
                    <td className="py-4 px-6 font-medium text-gray-900">
                      <div>
                        <p>{b.guestName}</p>
                        <p className="text-xs text-gray-400 font-normal">
                          User #{b.userId}
                        </p>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-6 text-gray-600">
                      <div className="flex items-center gap-1.5 text-xs">
                        <FiCalendar className="text-gray-400" />
                        <span>
                          {formatDate(b.checkIn)} - {formatDate(b.checkOut)}
                        </span>
                      </div>
                    </td>

                    {/* Guest Count */}
                    <td className="py-4 px-6 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <FiUsers className="text-gray-400" size={14} />
                        <span>{b.guests}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 font-bold text-gray-900">
                      ${b.totalAmount}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <StatusBadge status={b.status} />
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BOOKING DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Reservation #{selectedBooking.id}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Guest User ID: #{selectedBooking.userId}
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-5 space-y-5 text-sm">
              {/* Property Snapshot */}
              <div className="flex items-center gap-4 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <img
                  src={selectedBooking.propertyImage}
                  alt={selectedBooking.propertyTitle}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {selectedBooking.propertyTitle}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {selectedBooking.propertyLocation}
                  </p>
                </div>
              </div>

              {/* Guest & Status Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium">
                    Guest Name
                  </p>
                  <p className="font-semibold text-gray-900 mt-0.5">
                    {selectedBooking.guestName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedBooking.guestEmail}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedBooking.status} />
                  </div>
                </div>
              </div>

              {/* Reservation Schedule & Pricing */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Check-In</p>
                  <p className="font-semibold text-gray-900 mt-0.5">
                    {formatDate(selectedBooking.checkIn)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Check-Out</p>
                  <p className="font-semibold text-gray-900 mt-0.5">
                    {formatDate(selectedBooking.checkOut)}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-blue-50/60 rounded-xl border border-blue-100">
                <div>
                  <p className="text-xs text-blue-700 font-medium">
                    Total Amount
                  </p>
                  <p className="text-xs text-blue-500">
                    {selectedBooking.guests} Guests
                  </p>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ${selectedBooking.totalAmount}
                </p>
              </div>

              {/* Quick Approval Actions (If pending) */}
              {selectedBooking.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() =>
                      updateStatus(selectedBooking.id, "confirmed")
                    }
                    className="flex-1 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition shadow-sm text-center"
                  >
                    Approve Reservation
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(selectedBooking.id, "cancelled")
                    }
                    className="flex-1 py-2.5 border border-rose-200 text-rose-600 font-medium rounded-xl hover:bg-rose-50 transition text-center"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2.5 border border-gray-200 font-medium rounded-xl hover:bg-gray-50 transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
