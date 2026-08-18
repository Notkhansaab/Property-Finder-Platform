import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiShield,
  FiUploadCloud,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";

import {
  submitHostVerification,
  getHostVerificationStatus,
} from "../../axios/api";

const BecomeHost = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    documentType: "CNIC",
    documentNumber: "",
  });

  // File State
  const [documentFront, setDocumentFront] = useState(null);
  const [documentBack, setDocumentBack] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);

  // UI State
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Check existing verification status on load
  useEffect(() => {
    getHostVerificationStatus()
      .then((res) => {
        const verification = res.data?.data;
        if (verification && verification.status === "approved") {
          navigate("/documentverification"); // Or host dashboard
        }
      })
      .catch(() => {})
      .finally(() => setCheckingStatus(false));
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!documentFront) {
      setErrorMessage("Please upload at least the primary ID document.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (documentFront) data.append("documentFront", documentFront);
      if (documentBack) data.append("documentBack", documentBack);
      if (selfieImage) data.append("selfieImage", selfieImage);

      await submitHostVerification(data);
      navigate("/documentverification");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to submit verification. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8ff]">
        <FiLoader className="animate-spin text-blue-700" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col">
      <main className="grow max-w-7xl mx-auto w-full px-6 md:px-12 py-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Become a Host
          </h1>
          <p className="text-lg text-gray-600">
            Join our community of premium property hosts. Complete this quick
            verification to start listing your properties.
          </p>
        </div>

        {/* Main Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row"
        >
          {/* Sidebar */}
          <aside className="w-full md:w-1/3 bg-gray-50 p-8 border-r border-gray-200">
            <h2 className="text-xl font-semibold mb-8">Verification Steps</h2>

            <div className="relative flex flex-col gap-8">
              {/* Step 1 */}
              <div className="flex gap-4 items-start relative z-10">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FiCheck size={16} />
                </div>
                <div>
                  <p className="font-semibold">Account Basics</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
              </div>

              {/* Line */}
              <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-300" />

              {/* Step 2 */}
              <div className="flex gap-4 items-start relative z-10">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-blue-700">Host Details</p>
                  <p className="text-sm text-gray-500">Current Step</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start relative z-10">
                <div className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-500">
                    Document Verification
                  </p>
                  <p className="text-sm text-gray-500">Pending Review</p>
                </div>
              </div>
            </div>

            {/* Security Box */}
            <div className="mt-10 bg-blue-50 rounded-lg p-4 flex gap-3">
              <FiShield className="text-blue-700 mt-1 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-blue-900">
                  Secure Verification
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  Your data is encrypted and securely stored for verification
                  purposes only.
                </p>
              </div>
            </div>
          </aside>

          {/* Form Area */}
          <section className="w-full md:w-2/3 p-8">
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* Personal Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-6">
                Personal Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full mt-2 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="e.g. Jane"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full mt-2 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="e.g. Doe"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Phone Number</label>
                  <div className="flex mt-2">
                    <span className="px-4 flex items-center border border-r-0 rounded-l-lg bg-gray-50 text-gray-600">
                      +1
                    </span>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="flex-1 border rounded-r-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="(555) 000-0000"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-6">
                Address Details
              </h2>

              <div>
                <label className="text-sm text-gray-600">Street Address</label>
                <input
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full mt-2 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="text-sm text-gray-600">City</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full mt-2 border rounded-lg px-4 py-3"
                    placeholder="San Francisco"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    State/Province
                  </label>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full mt-2 border rounded-lg px-4 py-3"
                    placeholder="CA"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    ZIP/Postal Code
                  </label>
                  <input
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="w-full mt-2 border rounded-lg px-4 py-3"
                    placeholder="94105"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4">
                Document Upload
              </h2>

              <p className="text-sm text-gray-500 mb-6">
                Please upload clear copies of your government-issued ID
                (CNIC/Passport) and address verification proof.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ID Upload (Front) */}
                <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer">
                  <FiUploadCloud size={38} className="text-gray-400 mb-3" />
                  <h3 className="font-semibold text-gray-800">
                    Upload ID Document (Front)
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {documentFront
                      ? documentFront.name
                      : "CNIC, Passport or License"}
                  </p>
                  <span className="mt-4 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">
                    {documentFront ? "Change File" : "Select File"}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setDocumentFront(e.target.files[0])}
                  />
                </label>

                {/* ID Upload (Back / Proof) */}
                <label className="border border-gray-300 rounded-xl p-6 flex flex-col justify-between bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                  <div>
                    <FiCheckCircle size={38} className="text-green-600 mb-3" />
                    <h3 className="font-semibold text-gray-800">
                      ID Document (Back) / Address Proof
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {documentBack
                        ? documentBack.name
                        : "Utility bill, bank statement, or ID Back side."}
                    </p>
                  </div>

                  <div className="mt-6 bg-white border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-800">
                      {documentBack
                        ? "Change Document"
                        : "Choose verification document"}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setDocumentBack(e.target.files[0])}
                  />
                </label>
              </div>

              <div className="mt-6">
                <label className="block text-sm text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="CNIC">CNIC</option>
                  <option value="Passport">Passport</option>
                  <option value="License">License</option>
                </select>

                <label className="block text-sm text-gray-700 mt-4 mb-2">
                  Document Number
                </label>
                <input
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleInputChange}
                  className="w-full mt-2 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Enter document number"
                  required
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm text-gray-700 mb-2">
                  Selfie (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelfieImage(e.target.files[0])}
                  className="border rounded-lg px-3 py-2 w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Optional: take a selfie holding your ID for additional trust.
                </p>
              </div>
            </div>

            {/* Continue Button */}
            <div className="mt-12 pt-6 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <FiLoader className="animate-spin" />}
                {loading ? "Submitting..." : "Continue to Next Step"}
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
};

export default BecomeHost;
