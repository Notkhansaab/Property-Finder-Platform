import React, { useState, useEffect } from "react";
import Filters from "../../components/Filters";
import PropertyCards from "../PropertiesListing";
import { getProperties } from "../../axios/api";

const Buy = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    category: [],
    bedrooms: "Any",
    bathrooms: "Any",
    minArea: "",
    maxArea: "",
    amenities: [],
  });

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();

        // Lock query to sale properties ('buy' gets mapped to 'sale' on the backend)
        queryParams.append("type", "buy");

        if (filters.location.trim()) {
          queryParams.append("location", filters.location.trim());
        }
        if (filters.minPrice) {
          queryParams.append("minPrice", filters.minPrice);
        }
        if (filters.maxPrice) {
          queryParams.append("maxPrice", filters.maxPrice);
        }
        if (filters.bedrooms !== "Any") {
          queryParams.append("bedrooms", filters.bedrooms);
        }
        if (filters.bathrooms !== "Any") {
          queryParams.append("bathrooms", filters.bathrooms);
        }
        if (filters.minArea) {
          queryParams.append("minArea", filters.minArea);
        }
        if (filters.maxArea) {
          queryParams.append("maxArea", filters.maxArea);
        }
        if (filters.category.length > 0) {
          queryParams.append("category", filters.category.join(","));
        }
        if (filters.amenities.length > 0) {
          queryParams.append("amenities", filters.amenities.join(","));
        }

        const data = await getProperties({
          type: "buy",
          location: filters.location.trim() || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          bedrooms: filters.bedrooms !== "Any" ? filters.bedrooms : undefined,
          bathrooms:
            filters.bathrooms !== "Any" ? filters.bathrooms : undefined,
          minArea: filters.minArea || undefined,
          maxArea: filters.maxArea || undefined,
          category: filters.category,
          amenities: filters.amenities,
        });

        if (data.success) {
          setProperties(data.data);
        } else {
          setError(data.message || "Failed to load properties for sale.");
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProperties();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <main className="px-6 md:px-14 py-8 flex flex-col md:flex-row gap-8">
      <Filters filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="flex-1 flex justify-center items-center py-16">
          <p className="text-gray-500 font-medium animate-pulse">
            Loading properties for sale...
          </p>
        </div>
      ) : error ? (
        <div className="flex-1 text-center py-16 text-red-500 font-medium">
          {error}
        </div>
      ) : properties.length === 0 ? (
        <div className="flex-1 text-center py-16 text-gray-500 font-medium">
          No properties for sale match your search criteria.
        </div>
      ) : (
        <PropertyCards properties={properties} />
      )}
    </main>
  );
};

export default Buy;
