import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock } from "react-icons/fi";

const DocumentVerification = () => {
  const navigate = useNavigate();

  const isVerificationApproved = false;

  useEffect(() => {
    if (isVerificationApproved) {
      navigate("/");
    }
  }, [isVerificationApproved, navigate]);

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center px-6 md:px-12">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 md:p-16 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-32 h-32 md:w-48 md:h-48 mb-8 flex items-center justify-center rounded-full bg-blue-100">
          <FiCheckCircle size={96} className="text-blue-700" />
        </div>

        {/* Status */}
        <div className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-full mb-6">
          <FiClock size={16} className="mr-2" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Pending Verification
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          Your documentation has been provided successfully.
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 max-w-lg mb-8">
          Thank you for providing your documentation with EstateLink. Our team
          is currently reviewing your details to ensure they meet our quality
          standards. This process typically takes 1-2 business days.
        </p>

        <div className="w-full h-px bg-gray-200 mb-8" />

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="bg-blue-700 text-white rounded-lg px-8 py-3 font-semibold hover:bg-blue-800 transition"
        >
          Return to Home Page
        </button>

        {/* Reference */}
        <p className="text-sm text-gray-400 mt-8">Reference ID: EL-9482-XYZ</p>
      </div>
    </div>
  );
};

export default DocumentVerification;
