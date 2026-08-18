import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingCard = ({ property }) => {
  const navigate = useNavigate();

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(property?.guests || 1);

  if (!property) return null;

  const { type, price, period } = property;

  const isRent = type === "rent";
  const isLease = type === "lease";
  const isBuy = type === "buy";

  const canReserve = (() => {
    if (isRent) {
      return checkIn && checkOut && checkOut > checkIn;
    }
    return true;
  })();

  const today = new Date().toISOString().split("T")[0];

  const formatDate = (date) => {
    if (!date) return "Select date";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const openDatePicker = (ref) => {
    if (ref.current) {
      ref.current.focus();

      if (typeof ref.current.showPicker === "function") {
        ref.current.showPicker();
      }
    }
  };

  const handleCheckInChange = (e) => {
    const selectedDate = e.target.value;

    setCheckIn(selectedDate);

    // If checkout is now invalid, clear it
    if (checkOut && selectedDate >= checkOut) {
      setCheckOut("");
    }
  };

  const handleCheckOutChange = (e) => {
    setCheckOut(e.target.value);
  };

  const handleAction = () => {
    if (isRent) {
      if (!checkIn) {
        alert("Please select a check-in date.");
        return;
      }

      if (!checkOut) {
        alert("Please select a check-out date.");
        return;
      }

      if (checkOut <= checkIn) {
        alert("Check-out must be after check-in.");
        return;
      }

      navigate(`/payment/rent/${property.id}`, {
        state: {
          checkIn,
          checkOut,
          guests,
        },
      });

      return;
    }

    if (isLease) {
      navigate(`/payment/lease/${property.id}`);
      return;
    }

    if (isBuy) {
      navigate(`/payment/purchase/${property.id}`);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              ${Number(price).toLocaleString()}
            </h2>

            {isRent && (
              <span className="text-sm text-gray-500">/ {period}</span>
            )}
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
            isRent
              ? "bg-blue-50 text-blue-600"
              : isLease
                ? "bg-purple-50 text-purple-600"
                : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {type}
        </span>
      </div>

      {/* RENT */}
      {isRent && (
        <div className="py-5">
          {/* DATE SELECTION */}
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-200">
            {/* CHECK IN */}
            <button
              type="button"
              onClick={() => openDatePicker(checkInRef)}
              className="relative cursor-pointer p-4 text-left transition hover:bg-gray-50"
            >
              <p className="mb-1 text-[10px] font-bold tracking-wider text-gray-500">
                CHECK-IN
              </p>

              <p
                className={`text-sm font-semibold ${
                  checkIn ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {formatDate(checkIn)}
              </p>

              <input
                ref={checkInRef}
                type="date"
                value={checkIn}
                min={today}
                onChange={handleCheckInChange}
                className="pointer-events-none absolute h-0 w-0 opacity-0"
                tabIndex={-1}
              />
            </button>

            {/* CHECK OUT */}
            <button
              type="button"
              onClick={() => {
                if (!checkIn) {
                  alert("Please select your check-in date first.");
                  return;
                }

                openDatePicker(checkOutRef);
              }}
              className={`relative cursor-pointer border-l border-gray-200 p-4 text-left transition ${
                checkIn ? "hover:bg-gray-50" : "cursor-not-allowed bg-gray-50"
              }`}
            >
              <p className="mb-1 text-[10px] font-bold tracking-wider text-gray-500">
                CHECK-OUT
              </p>

              <p
                className={`text-sm font-semibold ${
                  checkOut ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {formatDate(checkOut)}
              </p>

              <input
                ref={checkOutRef}
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={handleCheckOutChange}
                className="pointer-events-none absolute h-0 w-0 opacity-0"
                tabIndex={-1}
              />
            </button>
          </div>

          {/* GUESTS */}
          <div className="mt-3">
            <label
              htmlFor="guest-select"
              className="block cursor-pointer rounded-2xl border border-gray-200 p-4 transition hover:bg-gray-50"
            >
              <p className="mb-1 text-[10px] font-bold tracking-wider text-gray-500">
                GUESTS
              </p>

              <select
                id="guest-select"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-sm font-semibold text-gray-900 outline-none focus:ring-0"
              >
                {Array.from({ length: 10 }, (_, index) => index + 1).map(
                  (number) => (
                    <option key={number} value={number}>
                      {number} {number === 1 ? "Guest" : "Guests"}
                    </option>
                  ),
                )}
              </select>
            </label>
          </div>
        </div>
      )}

      {/* LEASE */}
      {isLease && (
        <div className="space-y-3 py-5">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-gray-500">
              LEASE PERIOD
            </p>

            <p className="text-sm font-semibold text-gray-900">
              Discuss with owner
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="mb-1 text-[10px] font-bold tracking-wider text-gray-500">
              PROPERTY TYPE
            </p>

            <p className="text-sm font-semibold text-gray-900">
              {property.category}
            </p>
          </div>
        </div>
      )}

      {/* PURCHASE */}
      {isBuy && (
        <div className="py-5">
          <div className="flex gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
              ✓
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                Ready to purchase?
              </h4>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Continue to the secure payment page to complete your property
                purchase.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ACTION */}
      <button
        type="button"
        onClick={handleAction}
        disabled={!canReserve}
        title={
          !canReserve ? "Select valid check-in and check-out dates" : "Proceed"
        }
        className={`w-full rounded-2xl px-5 py-4 text-sm font-semibold shadow-lg transition duration-200 active:translate-y-0 ${
          canReserve
            ? "bg-gray-900 text-white shadow-gray-900/20 hover:-translate-y-0.5 hover:bg-black hover:shadow-xl"
            : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
        }`}
      >
        {isRent && "Reserve Now"}
        {isLease && "Request Lease"}
        {isBuy && "Purchase Now"}
      </button>

      {/* FOOTER */}
      <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500">
        <span>
          {isRent && "You won't be charged yet"}
          {isLease && "Lease request required"}
          {isBuy && "Secure payment"}
        </span>

        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          {isRent && "Secure booking"}
          {isLease && "Secure process"}
          {isBuy && "Verified property"}
        </span>
      </div>
    </div>
  );
};

export default BookingCard;
