import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../axios/api";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(formData);

      if (response?.success) {
        navigate("/signin", {
          state: { message: "Account created! Please sign in." },
        });
      }
    } catch (err) {
      setError(err?.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#faf8ff]">
      {/* Left Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12">
        <img
          src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
          alt="Luxury property"
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent rounded-xl" />

        <div className="relative z-10 mt-auto text-white">
          <h1 className="text-5xl font-bold leading-tight">
            Join the Community
          </h1>

          <p className="mt-4 text-lg max-w-md text-gray-200">
            Unlock access to exclusive properties. Find your dream home or
            showcase your perfect space with EstateLink.
          </p>
        </div>
      </div>

      {/* Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 text-blue-700">
              <span className="text-3xl">🏠</span>
              <span className="text-2xl font-bold">EstateLink</span>
            </div>

            <h2 className="text-3xl font-semibold text-gray-900 mt-6">
              Create an account
            </h2>

            <p className="text-gray-500 mt-2">
              Already have an account?
              <Link to="/signin">
                <span className="text-blue-700 font-medium ml-1 cursor-pointer hover:underline">
                  Sign In
                </span>
              </Link>
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>

              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />

              <p className="text-xs text-gray-500 mt-2">
                Must be at least 8 characters long.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-gray-300 flex-1" />
            <span className="text-sm text-gray-400">or continue with</span>
            <div className="h-px bg-gray-300 flex-1" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="py-3 border rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
            >
              Google
            </button>

            <button
              type="button"
              className="py-3 border rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
            >
              Apple
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500 mt-6 leading-relaxed">
            By creating an account, you agree to our
            <span className="text-blue-700 cursor-pointer mx-1">
              Terms of Service
            </span>
            and
            <span className="text-blue-700 cursor-pointer ml-1">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
