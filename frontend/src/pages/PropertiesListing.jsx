import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiMapPin,
  FiMaximize2,
  FiFlag,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdBed, MdBathtub } from "react-icons/md";
import ReportModal from "./ReportModal";
import {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
} from "../axios/api";
import { useAuth } from "../context/authContext";

const PropertyCards = ({
  properties = [],
  favorites = [],
  onToggleFavorite,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [savedPropertyIds, setSavedPropertyIds] = useState([]);

  const propertiesPerPage = 15;
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  useEffect(() => {
    let cancelled = false;

    const fetchSavedProperties = async () => {
      if (!user) {
        setSavedPropertyIds([]);
        return;
      }

      try {
        const res = await getUserWishlist();
        if (!cancelled && res?.success && Array.isArray(res.data)) {
          setSavedPropertyIds(res.data.map((property) => String(property.id)));
        }
      } catch (err) {
        if (!cancelled) {
          setSavedPropertyIds([]);
        }
      }
    };

    fetchSavedProperties();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Reset pagination to first page whenever properties array changes (e.g. filter applied)
  useEffect(() => {
    setCurrentPage(0);
  }, [properties]);

  const effectiveFavorites =
    favorites.length > 0 ? favorites : savedPropertyIds;

  const startIndex = currentPage * propertiesPerPage;
  const visibleProperties = properties.slice(
    startIndex,
    startIndex + propertiesPerPage,
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handleToggleFavorite = async (propertyId) => {
    if (!user) {
      navigate("/signin");
      return;
    }

    const normalizedId = String(propertyId);
    const isSaved = effectiveFavorites.includes(normalizedId);

    try {
      if (onToggleFavorite) {
        onToggleFavorite(propertyId);
        return;
      }

      if (isSaved) {
        const res = await removeFromWishlist(propertyId);
        if (res?.success) {
          setSavedPropertyIds((prev) =>
            prev.filter((id) => id !== normalizedId),
          );
        }
      } else {
        const res = await addToWishlist(propertyId);
        if (res?.success) {
          setSavedPropertyIds((prev) =>
            prev.includes(normalizedId) ? prev : [...prev, normalizedId],
          );
        }
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      alert("Failed to update wishlist.");
    }
  };

  return (
    <section className="flex-1">
      {properties.length === 0 ? (
        <div className="py-20 text-center text-gray-500 font-medium">
          No properties found
        </div>
      ) : (
        <>
          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProperties.map((property) => {
              const isFavorite = effectiveFavorites.includes(
                String(property.id),
              );

              return (
                <article
                  key={property.id}
                  className="overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative h-64 bg-gray-100">
                      <img
                        src={
                          property.image ||
                          "https://via.placeholder.com/600x400?text=No+Image"
                        }
                        alt={property.title}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/600x400?text=No+Image";
                        }}
                        className="w-full h-full object-cover"
                      />

                      {/* Favorite & Report Action Buttons */}
                      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                        {/* Favorite */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleFavorite(property.id);
                          }}
                          aria-label="Add to favorites"
                          className="bg-white/90 backdrop-blur rounded-full p-2 hover:bg-white transition shadow-sm cursor-pointer"
                        >
                          <FiHeart
                            size={18}
                            className={`transition ${
                              isFavorite
                                ? "text-red-500 fill-red-500"
                                : "text-gray-600 hover:text-red-500"
                            }`}
                          />
                        </button>

                        {/* Report */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedProperty(property);
                            setReportModalOpen(true);
                          }}
                          aria-label={`Report ${property.title}`}
                          className="bg-white/90 backdrop-blur rounded-full p-2 hover:bg-white transition shadow-sm cursor-pointer"
                        >
                          <FiFlag
                            size={18}
                            className="text-gray-600 hover:text-red-500 transition"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Content Link */}
                    <Link to={`/property/${property.id}`} className="block p-5">
                      <div className="flex justify-between gap-3 items-start">
                        <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                          {property.title}
                        </h3>

                        <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
                          ${Number(property.price).toLocaleString()}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <FiMapPin size={16} className="shrink-0" />
                        <span className="text-sm truncate">
                          {property.location ||
                            `${property.city || ""}, ${property.state || ""}`}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="border-t border-gray-200 mt-4 pt-4 flex items-center gap-5 text-gray-500">
                        {property.bedrooms > 0 && (
                          <div className="flex items-center gap-1">
                            <MdBed size={16} />
                            <span className="text-xs font-medium">
                              {property.bedrooms} Beds
                            </span>
                          </div>
                        )}

                        {property.baths > 0 && (
                          <div className="flex items-center gap-1">
                            <MdBathtub size={16} />
                            <span className="text-xs font-medium">
                              {property.baths} Baths
                            </span>
                          </div>
                        )}

                        {property.area > 0 && (
                          <div className="flex items-center gap-1">
                            <FiMaximize2 size={16} />
                            <span className="text-xs font-medium">
                              {property.area} sqft
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Amenities */}
                      {property.amenities && property.amenities.length > 0 && (
                        <p className="text-sm text-gray-500 mt-3 truncate">
                          {Array.isArray(property.amenities)
                            ? property.amenities.join(" • ")
                            : property.amenities}
                        </p>
                      )}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                {/* Previous */}
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                  aria-label="Previous page"
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                    currentPage === 0
                      ? "cursor-not-allowed text-gray-300"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                  }`}
                >
                  <FiChevronLeft size={20} />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, index) => index).map(
                    (pageIndex) => (
                      <button
                        key={pageIndex}
                        type="button"
                        onClick={() => setCurrentPage(pageIndex)}
                        className={`relative h-10 min-w-10 px-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          currentPage === pageIndex
                            ? "bg-gray-900 text-white shadow-md"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        {pageIndex + 1}
                      </button>
                    ),
                  )}
                </div>

                {/* Next */}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentPage === totalPages - 1}
                  aria-label="Next page"
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                    currentPage === totalPages - 1
                      ? "cursor-not-allowed text-gray-300"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                  }`}
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ReportModal
        property={selectedProperty}
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setSelectedProperty(null);
        }}
      />
    </section>
  );
};

export default PropertyCards;
