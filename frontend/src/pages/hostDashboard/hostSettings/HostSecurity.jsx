import React from "react";
import { FiLock, FiSave } from "react-icons/fi";

export default function HostSecurity() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <section className="rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Security Settings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Change your password and secure your account.
            </p>
          </div>

          <div className="space-y-6">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <div className="my-8 border-t border-gray-100 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  Two-Factor Authentication
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add an extra layer of security to your account.
                </p>
              </div>

              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />

                <div className="peer h-6 w-11 rounded-full bg-gray-300 transition after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-700 peer-checked:after:translate-x-5" />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-medium text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800">
              <FiSave />
              Save Changes
            </button>
          </div>
        </section>
      </div>

      <div>
        <section className="rounded-3xl bg-white p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <FiLock className="text-3xl text-blue-700" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900">
            Account Security
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Use a strong password and enable two-factor authentication for
            maximum account protection.
          </p>
        </section>
      </div>
    </div>
  );
}

function Input({ label, type, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-600">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-100 bg-[#f8f8ff] px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}
