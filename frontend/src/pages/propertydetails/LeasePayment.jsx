import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import allproperties from "../../data/properties";

const LeasePayment = () => {
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
            Lease Request
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Submit your lease request and review the required payment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Lease Form */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                Lease Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Provide the information required for your lease request.
              </p>

              <div className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Lease Duration
                  </label>

                  <select className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10">
                    <option>6 Months</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3 Years</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Message to Owner
                  </label>

                  <textarea
                    rows="4"
                    placeholder="Write a message to the property owner..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
                  ></textarea>
                </div>
              </div>

              <div className="my-7 h-px bg-gray-100"></div>

              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    !
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-purple-900">
                      Lease payment
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-purple-700">
                      The lease amount and payment terms will be confirmed
                      according to the property's lease agreement.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert("Lease request submitted")}
                className="mt-7 w-full rounded-xl bg-purple-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-purple-600/20 transition hover:-translate-y-0.5 hover:bg-purple-700"
              >
                Submit Lease Request
              </button>
            </div>
          </div>

          {/* Property Summary */}
          <div>
            <div className="sticky top-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-600">
                Lease
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
                    Lease Price
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    ${Number(property.price).toLocaleString()}
                  </p>

                  <p className="text-xs text-gray-400">per {property.period}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeasePayment;
