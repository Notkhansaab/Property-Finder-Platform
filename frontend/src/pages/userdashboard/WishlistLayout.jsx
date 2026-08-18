import React, { useEffect, useState } from "react";
import { getUserWishlist } from "../../axios/api";
import PropertyCards from "../PropertiesListing";

const WishlistLayout = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserWishlist();
        if (res?.success)
          setProperties(Array.isArray(res.data) ? res.data : []);
        else setError(res?.message || "Failed to load wishlist.");
      } catch (err) {
        setError(err?.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Wishlist</h1>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-red-600">{error}</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">
            Your saved properties will appear here.
          </p>
        </div>
      ) : (
        <PropertyCards properties={properties} />
      )}
    </div>
  );
};

export default WishlistLayout;
