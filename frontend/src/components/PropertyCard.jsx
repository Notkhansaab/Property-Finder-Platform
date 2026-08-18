import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import allproperties from "../data/properties";

const properties = allproperties;

const categories = [
  "All",
  "Hotels",
  "Houses",
  "Apartments",
  "Hostels",
  "Plazas",
  "Shops",
  "Offices",
  "Plots",
];

const Home = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);

  // 12 properties = 3 rows × 4 columns
  const propertiesPerPage = 12;

  const filteredProperties =
    selectedCategory === "All"
      ? properties
      : properties.filter((property) => property.category === selectedCategory);

  // Total number of pages
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Get properties for current page
  const startIndex = currentPage * propertiesPerPage;

  const currentProperties = filteredProperties.slice(
    startIndex,
    startIndex + propertiesPerPage,
  );

  // Reset slider when category changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  // Previous
  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Next
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <main>
      {/* HERO SECTION */}

      <section className="relative h-163 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:bg-black/30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
          }}
        />

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-14 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 drop-shadow-lg">
            Find Your Perfect Space
          </h1>

          <div className="w-full md:w-225 bg-white rounded-full shadow-xl p-2 flex flex-col md:flex-row items-center gap-2">
            {/* Where */}

            <div className="flex-1 px-5 py-2 rounded-full hover:bg-gray-100 transition text-left">
              <label className="block text-xs font-bold text-gray-800">
                Where to?
              </label>

              <input
                className="w-full bg-transparent outline-none text-sm text-gray-500"
                placeholder="Search destinations"
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-gray-300" />

            {/* Dates */}

            <div className="flex-1 px-5 py-2 rounded-full hover:bg-gray-100 transition text-left cursor-pointer">
              <label className="block text-xs font-bold text-gray-800">
                Dates
              </label>

              <span className="text-sm text-gray-400">Add dates</span>
            </div>

            <div className="hidden md:block w-px h-8 bg-gray-300" />

            {/* Guests */}

            <div className="flex-1 flex items-center justify-between px-5 py-2 rounded-full hover:bg-gray-100 transition">
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-800">
                  Guests
                </label>

                <span className="text-sm text-gray-400">Add guests</span>
              </div>

              <button className="bg-blue-700 hover:bg-blue-800 text-white w-11 h-11 rounded-full flex items-center justify-center shadow-md">
                🔍
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PROPERTY SECTION */}

      <section className="px-6 md:px-14 py-16">
        {/* CATEGORIES */}

        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`whitespace-nowrap px-6 py-3 rounded-full transition font-medium ${
                selectedCategory === item
                  ? "bg-blue-700 text-white"
                  : "bg-gray-100 hover:bg-blue-700 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* TITLE */}

        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            {selectedCategory === "All"
              ? "Explore Properties"
              : selectedCategory}
          </h2>

          <p className="text-gray-500 mt-2">
            {selectedCategory === "All"
              ? "Discover hand-picked properties around the world."
              : `Discover the best ${selectedCategory.toLowerCase()} available.`}
          </p>
        </div>

        {/* PROPERTY CARDS */}

        {filteredProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentProperties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => navigate(`/property/${property.id}`)}
                  className="group cursor-pointer"
                >
                  {/* IMAGE */}

                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Wishlist */}

                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-4 right-4 bg-white w-10 h-10 rounded-full shadow flex items-center justify-center hover:bg-gray-100"
                    >
                      ♡
                    </button>
                  </div>

                  {/* INFORMATION */}

                  <div className="flex justify-between mt-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {property.title}
                      </h3>

                      <p className="text-gray-500">{property.location}</p>
                    </div>

                    <span>⭐ {property.rating}</span>
                  </div>

                  {/* PRICE */}

                  <p className="mt-2 font-bold">
                    ${property.price}
                    <span className="text-gray-500 font-normal">
                      {" "}
                      / {property.period}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* SLIDER CONTROLS */}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-12">
                {/* PREVIOUS */}

                <button
                  onClick={previousPage}
                  disabled={currentPage === 0}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center text-xl transition ${
                    currentPage === 0
                      ? "text-gray-300 border-gray-200 cursor-not-allowed"
                      : "text-gray-700 border-gray-300 hover:bg-blue-700 hover:text-white hover:border-blue-700"
                  }`}
                >
                  ←
                </button>

                {/* PAGE INDICATORS */}

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-3 h-3 rounded-full transition ${
                        currentPage === index
                          ? "bg-blue-700 scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>

                {/* NEXT */}

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center text-xl transition ${
                    currentPage === totalPages - 1
                      ? "text-gray-300 border-gray-200 cursor-not-allowed"
                      : "text-gray-700 border-gray-300 hover:bg-blue-700 hover:text-white hover:border-blue-700"
                  }`}
                >
                  →
                </button>
              </div>
            )}
          </>
        ) : (
          /* NO PROPERTIES */

          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-700">
              No properties found
            </h3>

            <p className="text-gray-500 mt-2">
              There are currently no {selectedCategory.toLowerCase()} available.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
