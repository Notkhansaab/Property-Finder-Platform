import { useState } from "react";
import { FiSave, FiCreditCard, FiPlus, FiTrash2 } from "react-icons/fi";
import { updateHostPayment } from "../../../axios/api";

export default function HostPayments() {
  const [payment, setPayment] = useState({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    iban: "",
    swift: "",
  });

  const handleChange = (e) => {
    setPayment((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateHostPayment(payment);
      alert("Payment details saved successfully.");
    } catch (error) {
      console.error("Host payment update failed:", error);
      alert(error.message || "Failed to update payment settings.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
        >
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Payment Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your payout information.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Account Holder"
              name="accountHolder"
              value={payment.accountHolder}
              onChange={handleChange}
            />

            <Input
              label="Bank Name"
              name="bankName"
              value={payment.bankName}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Account Number"
            name="accountNumber"
            value={payment.accountNumber}
            onChange={handleChange}
          />

          <Input
            label="IBAN"
            name="iban"
            value={payment.iban}
            onChange={handleChange}
          />

          <Input
            label="SWIFT / BIC"
            name="swift"
            value={payment.swift}
            onChange={handleChange}
          />

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-medium text-white transition hover:bg-blue-800"
            >
              <FiSave />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div>
        <section className="rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <FiCreditCard className="text-3xl text-blue-700" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            Payout Account
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            This account will receive your rental earnings.
          </p>

          <div className="mt-8 space-y-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-700 py-3 font-medium text-blue-700 transition hover:bg-blue-50">
              <FiPlus />
              Add Another Account
            </button>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 font-medium text-red-600 transition hover:bg-red-50">
              <FiTrash2 />
              Remove Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium text-gray-600">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-gray-100 bg-[#f8f8ff] px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}
