import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiUser,
  FiMessageCircle,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiCheckCircle,
  FiHome,
} from "react-icons/fi";

const bookingData = {
  1: {
    guest: "Sarah Jenkins",
    property: "Modern Downtown Apartment",
    location: "New York",
    address: "123 Arts District, Downtown",
    dates: "Oct 12 - Oct 15, 2026",
    checkIn: "Oct 12, 2026",
    checkOut: "Oct 15, 2026",
    guests: 3,
    nights: 3,
    price: "$450",
    cleaning: "$50",
    service: "-$25",
    total: "$475",
    status: "Confirmed",
  },
  2: {
    guest: "Michael Chen",
    property: "Luxury Beach Villa",
    location: "Malibu",
    address: "45 Ocean Drive, Malibu",
    dates: "Oct 20 - Oct 25, 2026",
    checkIn: "Oct 20, 2026",
    checkOut: "Oct 25, 2026",
    guests: 5,
    nights: 5,
    price: "$1200",
    cleaning: "$100",
    service: "-$50",
    total: "$1250",
    status: "Pending",
  },
};

export default function HostBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const booking = bookingData[id] || bookingData[1];

  return (
    <div className="min-h-screen bg-[#faf8ff] p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/host/bookings")}
          className="flex items-center gap-2 text-[#737686] hover:text-[#003fb1] mb-5"
        >
          <FiArrowLeft />
          Back to Bookings
        </button>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-[#191b23]">
              Booking Details
            </h1>

            <p className="text-[#737686] mt-2">
              Complete reservation information
            </p>
          </div>

          <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
            {booking.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SIDE */}

        <div className="lg:col-span-5 space-y-6">
          {/* Guest Card */}

          <div className="bg-white rounded-2xl border border-[#c3c5d7]/40 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-5">Guest</h2>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#dbe1ff] text-[#003fb1] flex items-center justify-center text-xl font-bold">
                SJ
              </div>

              <div>
                <h3 className="font-semibold text-lg">{booking.guest}</h3>

                <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                  <FiCheckCircle />
                  Verified Identity
                </div>

                <p className="text-sm text-[#737686] mt-1">
                  Joined October 2021
                </p>
              </div>
            </div>

            <button className="mt-6 w-full h-11 rounded-xl bg-[#f3f3fe] flex items-center justify-center gap-2 text-[#003fb1]">
              <FiMessageCircle />
              Message Guest
            </button>
          </div>

          {/* Property Card */}

          <div className="bg-white rounded-2xl overflow-hidden border border-[#c3c5d7]/40 shadow-sm">
            <div className="h-48 bg-[#dbe1ff] flex items-center justify-center">
              <FiHome size={60} className="text-[#003fb1]" />
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold">{booking.property}</h2>

              <p className="text-[#737686] flex items-center gap-2 mt-2">
                <FiMapPin />
                {booking.address}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="lg:col-span-7 space-y-6">
          {/* Reservation */}

          <div className="bg-white rounded-2xl border border-[#c3c5d7]/40 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Reservation Details</h2>

            <div className="grid grid-cols-2 gap-6">
              <Info
                icon={<FiCalendar />}
                title="Check In"
                value={booking.checkIn}
              />

              <Info
                icon={<FiCalendar />}
                title="Check Out"
                value={booking.checkOut}
              />

              <Info
                icon={<FiUsers />}
                title="Guests"
                value={`${booking.guests} Guests`}
              />

              <Info
                icon={<FiHome />}
                title="Duration"
                value={`${booking.nights} Nights`}
              />
            </div>
          </div>

          {/* Payment */}

          <div className="bg-white rounded-2xl border border-[#c3c5d7]/40 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Payment Breakdown</h2>

            <PaymentRow
              title={`${booking.price} x ${booking.nights} nights`}
              amount={booking.price}
            />

            <PaymentRow title="Cleaning Fee" amount={booking.cleaning} />

            <PaymentRow title="Service Fee" amount={booking.service} />

            <div className="flex justify-between mt-6 pt-5 border-t">
              <span className="text-xl font-bold">Total Payout</span>

              <span className="text-xl font-bold text-[#003fb1]">
                {booking.total}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, title, value }) {
  return (
    <div>
      <p className="text-sm text-[#737686] mb-2 flex items-center gap-2">
        {icon}
        {title}
      </p>

      <p className="font-semibold">{value}</p>
    </div>
  );
}

function PaymentRow({ title, amount }) {
  return (
    <div className="flex justify-between py-3 border-b border-[#c3c5d7]/30">
      <span className="text-[#737686]">{title}</span>

      <span className="font-semibold">{amount}</span>
    </div>
  );
}
