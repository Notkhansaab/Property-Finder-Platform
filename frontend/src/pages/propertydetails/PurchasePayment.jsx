import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import allproperties from "../../data/properties";

const PurchasePayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const property = allproperties.find((item) => item.id === Number(id));

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <h2 className="text-xl font-bold text-gray-900">
            Property not found
          </h2>

          <button
            onClick={() => navigate(-1)}
            className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
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
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Purchase Property
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review the property and complete your purchase.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Payment */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter your payment details to continue.
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
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Card Number
                  </label>

                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
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
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      CVV
                    </label>

                    <input
                      type="password"
                      placeholder="•••"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>
                </div>
              </div>

              <div className="my-7 h-px bg-gray-100"></div>

              <div className="rounded-2xl bg-emerald-50 p-5">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">
                      Secure Property Purchase
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-emerald-700">
                      Your payment details are securely processed. The property
                      information is verified before purchase.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert("Purchase payment processing...")}
                className="mt-7 w-full rounded-xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Purchase for ${Number(property.price).toLocaleString()}
              </button>
            </div>
          </div>

          {/* Property Summary */}
          <div>
            <div className="sticky top-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-600">
                For Sale
              </span>

              <img
                src={property.image}
                alt={property.title}
                className="mt-4 h-48 w-full rounded-2xl object-cover"
              />

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                {property.title}
              </h3>

              <p className="mt-1 text-sm text-gray-500">{property.location}</p>

              <div className="my-5 h-px bg-gray-100"></div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Property Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {property.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Purchase Price
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    ${Number(property.price).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gray-50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Property price</span>

                  <span className="font-semibold text-gray-900">
                    ${Number(property.price).toLocaleString()}
                  </span>
                </div>

                <div className="my-3 h-px bg-gray-200"></div>

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Total</span>

                  <span className="text-lg font-bold text-gray-900">
                    ${Number(property.price).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePayment;
