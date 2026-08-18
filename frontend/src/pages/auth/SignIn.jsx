import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../axios/api";
import { useAuth } from "../../context/authContext";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // 👈 2. Destructure login function

  const successMessage = location.state?.message || "";

  const [formData, setFormData] = useState({
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

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(formData);

      if (response?.success) {
        const userData = response.data?.data || response.data;

        // 👈 3. CALL LOGIN HERE to update global state immediately
        if (userData) {
          login(userData);
        }

        navigate("/home");
      }
    } catch (err) {
      setError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#faf8ff]">
      {/* Left Image */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12">
        <img
          src="https://images.pexels.com/photos/7722158/pexels-photo-7722158.jpeg"
          alt="Luxury property"
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent rounded-xl" />

        <div className="relative z-10 mt-auto text-white">
          <h1 className="text-5xl font-bold">Join the Community</h1>

          <p className="mt-4 text-lg max-w-md">
            Access exclusive luxury listings and seamless real estate
            transactions.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="text-blue-700 text-3xl font-bold flex items-center justify-center gap-2">
              <span>🏠</span> EstateLink
            </div>

            <h2 className="text-3xl font-semibold text-gray-900 mt-6">
              Welcome back
            </h2>

            <p className="text-gray-500 mt-2">
              Don't have an account?
              <Link to="/signup">
                <span className="text-blue-600 font-medium ml-1 cursor-pointer hover:underline">
                  Sign Up
                </span>
              </Link>
            </p>
          </div>

          {successMessage && !error && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center font-medium">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In →"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-gray-300 flex-1" />
            <span className="text-gray-400 text-sm">or continue with</span>
            <div className="h-px bg-gray-300 flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="border rounded-lg py-3 hover:bg-gray-50 transition font-medium text-gray-700"
            >
              Google
            </button>

            <button
              type="button"
              className="border rounded-lg py-3 hover:bg-gray-50 transition font-medium text-gray-700"
            >
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
