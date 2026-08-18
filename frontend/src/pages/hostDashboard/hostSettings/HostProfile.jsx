import React from "react";
import { FiCamera, FiSave } from "react-icons/fi";

export default function HostProfile() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Personal Information */}
      <div className="lg:col-span-2">
        <section className="rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your account details
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Input label="First Name" value="Eleanor" />
            <Input label="Last Name" value="Shellstrop" />
          </div>

          <Input label="Email Address" value="eleanor@example.com" />

          <Input label="Phone Number" value="+1 (555) 123-4567" />

          <div className="mt-8 flex justify-end">
            <button className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-medium text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800">
              <FiSave />
              Save Changes
            </button>
          </div>
        </section>
      </div>

      {/* Profile Card */}
      <div>
        <section className="rounded-3xl bg-white p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="group relative mx-auto mb-6 h-32 w-32">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              alt="Profile"
              className="h-full w-full rounded-full object-cover ring-4 ring-blue-50"
            />

            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
              <FiCamera className="text-xl text-white" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900">
            Eleanor Shellstrop
          </h3>

          <p className="mt-2 mb-6 text-sm text-gray-500">Host since 2021</p>

          <button className="w-full rounded-xl border border-gray-200 py-3 font-medium text-gray-700 transition hover:bg-gray-50">
            Update Photo
          </button>
        </section>
      </div>
    </div>
  );
}

function Input({ label, value }) {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium text-gray-600">
        {label}
      </label>

      <input
        type="text"
        value={value}
        readOnly
        className="w-full rounded-xl border border-gray-100 bg-[#f8f8ff] px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}
