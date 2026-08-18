import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import allproperties from "../../data/properties";

const RentPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const property = allproperties.find((item) => item.id === Number(id));

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <h2 className="text-xl font-bold text-gray-900">
            Property not found
          </h2>

          <button
            onClick={() => navigate(-1)}
            className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Complete Your Booking
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review your reservation details and complete payment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter your payment information below.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Cardholder Name
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Card Number
                  </label>

                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Expiry Date
                    </label>

                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      CVV
                    </label>

                    <input
                      type="password"
                      placeholder="•••"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>
                </div>
              </div>

              <div className="my-7 h-px bg-gray-100"></div>

              <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Secure Payment
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Your payment information is protected and securely
                    processed.
                  </p>
                </div>
              </div>

              <button
                onClick={() => alert("Payment processing...")}
                className="mt-7 w-full rounded-xl bg-gray-900 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-gray-900/20 transition hover:-translate-y-0.5 hover:bg-black hover:shadow-xl"
              >
                Pay ${Number(property.price).toLocaleString()}
              </button>
            </div>
          </div>

          {/* Booking Summary */}
          <div>
            <div className="sticky top-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-5 text-lg font-bold text-gray-900">
                Booking Summary
              </h3>

              <img
                src={property.image}
                alt={property.title}
                className="h-48 w-full rounded-2xl object-cover"
              />

              <div className="mt-5">
                <h4 className="font-bold text-gray-900">{property.title}</h4>

                <p className="mt-1 text-sm text-gray-500">
                  {property.location}
                </p>
              </div>

              <div className="my-5 h-px bg-gray-100"></div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Check-in</span>

                  <span className="font-semibold text-gray-900">
                    Select date
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Check-out</span>

                  <span className="font-semibold text-gray-900">
                    Select date
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Guests</span>

                  <span className="font-semibold text-gray-900">
                    {property.guests || 1}
                  </span>
                </div>
              </div>

              <div className="my-5 h-px bg-gray-100"></div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Total</span>

                <span className="text-xl font-bold text-gray-900">
                  ${Number(property.price).toLocaleString()}
                </span>
              </div>

              <p className="mt-2 text-right text-xs text-gray-400">
                per {property.period}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentPayment;
