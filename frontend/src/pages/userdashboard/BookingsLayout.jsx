import React, { useEffect, useState } from "react";
import { getUserBookings } from "../../axios/api";

const BookingsLayout = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserBookings();
        if (res.success) setBookings(res.data);
        else setError(res.message || "Failed to load bookings.");
      } catch (err) {
        setError(err?.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Bookings</h1>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-red-600">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">You have no bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4 items-center"
            >
              <img
                src={b.property_image || "https://via.placeholder.com/120"}
                alt={b.property_title}
                className="w-28 h-20 object-cover rounded-md"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{b.property_title}</h3>
                <p className="text-sm text-gray-500">{b.property_location}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {new Date(b.check_in).toLocaleDateString()} —{" "}
                  {new Date(b.check_out).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">{b.status}</p>
                <p className="font-semibold mt-2">
                  ${Number(b.total_amount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsLayout;
