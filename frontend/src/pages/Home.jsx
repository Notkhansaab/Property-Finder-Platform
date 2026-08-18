import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiMapPin,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdBed, MdBathtub } from "react-icons/md";
import { getProperties } from "../axios/api";

const categoryOptions = [
  { label: "All", value: "All" },
  { label: "Hotels", value: "hotel" },
  { label: "Houses", value: "house" },
  { label: "Apartments", value: "apartment" },
  { label: "Villas", value: "villa" },
  { label: "Offices", value: "office" },
  { label: "Plazas", value: "plaza" },
  { label: "Shops", value: "shop" },
  { label: "Plots", value: "plot" },
];

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    location: "",
    guests: "",
    category: "All",
  });

  const propertiesPerPage = 20;

  const fetchProperties = async (nextFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      const categoryValue =
        nextFilters.category && nextFilters.category !== "All"
          ? [nextFilters.category]
          : undefined;

      const response = await getProperties({
        location: nextFilters.location?.trim() || undefined,
        category: categoryValue,
      });

      if (response?.success && Array.isArray(response.data)) {
        setProperties(response.data);
      } else {
        setError(response?.message || "Failed to load properties.");
        setProperties([]);
      }
    } catch (err) {
      console.error("Home properties fetch failed:", err);
      setError("Unable to load properties right now.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(filters);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.location, filters.category, filters.guests]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const combinedText = [
        property.city,
        property.state,
        property.country,
        property.address,
        property.title,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const locationMatch =
        !filters.location ||
        combinedText.includes(filters.location.trim().toLowerCase());

      const guestMatch =
        !filters.guests ||
        Number(property.guests || 0) >= Number(filters.guests);

      return locationMatch && guestMatch;
    });
  }, [filters, properties]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProperties.length / propertiesPerPage),
  );

  const currentProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * propertiesPerPage;
    return filteredProperties.slice(startIndex, startIndex + propertiesPerPage);
  }, [filteredProperties, currentPage]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage === 1) {
      return [1, 2, 3];
    }

    if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, totalPages]);

  const handleSearch = () => {
    fetchProperties(filters);
  };

  return (
    <main>
      <section className="relative h-[480px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 flex h-full items-center justify-center px-6 md:px-14">
          <div className="w-full max-w-6xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg">
              Find Your Perfect Space
            </h1>

            <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-2xl p-2 flex flex-col md:flex-row items-center gap-2 md:gap-0">
              <div className="flex-1 px-5 py-3 text-left rounded-full hover:bg-gray-100 transition">
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600">
                  Where to?
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Search destinations"
                  className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />
              </div>

              <div className="hidden md:block w-px h-10 bg-gray-300" />

              <div className="flex-1 px-5 py-3 text-left rounded-full hover:bg-gray-100 transition">
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600">
                  Guests
                </label>
                <input
                  type="number"
                  min="1"
                  value={filters.guests}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, guests: e.target.value }))
                  }
                  placeholder="Add guests"
                  className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />
              </div>

              <div className="hidden md:block w-px h-10 bg-gray-300" />

              <div className="flex-1 px-5 py-3 text-left rounded-full hover:bg-gray-100 transition">
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full bg-transparent outline-none text-sm text-gray-700"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="m-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg hover:bg-blue-800 transition"
                aria-label="Search listings"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-14 py-14">
        <div className="mb-10">
          <div className="flex flex-wrap gap-3 overflow-x-auto pb-2">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, category: option.value }))
                }
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  filters.category === option.value
                    ? "bg-blue-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-700">
              Featured Listings
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              {filters.category === "All"
                ? "Explore Properties"
                : filters.category}
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {filteredProperties.length} properties available
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 font-medium">
            Loading properties...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-red-500 font-medium">
            {error}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-500 font-medium">
            No properties match your filters.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentProperties.map((property) => (
                <article
                  key={property.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <Link to={`/property/${property.id}`} className="block">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={
                          property.image ||
                          "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
                        }
                        alt={property.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80";
                        }}
                      />

                      <button
                        type="button"
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur-sm hover:bg-white"
                        aria-label={`Save ${property.title}`}
                        onClick={(e) => e.preventDefault()}
                      >
                        <FiHeart size={18} />
                      </button>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold text-gray-900">
                            {property.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                            <FiMapPin size={14} />
                            <span className="truncate">
                              {property.location ||
                                `${property.city || ""}${property.city && property.country ? ", " : ""}${property.country || ""}`}
                            </span>
                          </div>
                        </div>
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                          {property.type
                            ? property.type.toUpperCase()
                            : "LISTING"}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-5 text-sm text-gray-500">
                        {Number(property.bedrooms || 0) > 0 && (
                          <div className="flex items-center gap-1">
                            <MdBed size={16} />
                            <span>{property.bedrooms} Beds</span>
                          </div>
                        )}

                        {Number(property.baths || 0) > 0 && (
                          <div className="flex items-center gap-1">
                            <MdBathtub size={16} />
                            <span>{property.baths} Baths</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
                        <div>
                          <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(property.price)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {property.price_period || "total"}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-blue-700">
                          View details
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {filteredProperties.length > propertiesPerPage && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                    currentPage === 1
                      ? "cursor-not-allowed border-gray-200 text-gray-300"
                      : "border-gray-300 text-gray-700 hover:border-blue-700 hover:text-blue-700"
                  }`}
                >
                  <FiChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2">
                  {pageNumbers.map((pageNo) => (
                    <button
                      key={pageNo}
                      type="button"
                      onClick={() => setCurrentPage(pageNo)}
                      className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                        currentPage === pageNo
                          ? "bg-blue-700 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                      }`}
                    >
                      {pageNo}
                    </button>
                  ))}

                  {totalPages > 3 && currentPage < totalPages - 1 && (
                    <span className="px-1 text-gray-400">...</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                    currentPage === totalPages
                      ? "cursor-not-allowed border-gray-200 text-gray-300"
                      : "border-gray-300 text-gray-700 hover:border-blue-700 hover:text-blue-700"
                  }`}
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default Home;
