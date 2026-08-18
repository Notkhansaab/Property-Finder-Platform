import React from "react";

const Filters = ({ filters, setFilters }) => {
  // Display label and backend value mapping
  const categories = [
    { label: "Houses", value: "house" },
    { label: "Villas", value: "villa" },
    { label: "Apartments", value: "apartment" },
    { label: "Offices", value: "office" },
    { label: "Plazas", value: "plaza" },
    { label: "Shops", value: "shop" },
    { label: "Hotels", value: "hotel" },
    { label: "Plots", value: "plot" },
  ];

  const amenities = [
    "Wi-Fi",
    "Pool",
    "Kitchen",
    "Free parking",
    "Air conditioning",
    "Pet friendly",
    "Gym",
    "Workspace",
  ];

  return (
    <aside className="w-full md:w-80 md:sticky md:top-24 self-start h-fit">
      <div className="space-y-6">
        {/* Location */}

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Location</h3>

          <input
            type="text"
            placeholder="Search by city"
            value={filters.location}
            onChange={(e) =>
              setFilters({
                ...filters,

                location: e.target.value,
              })
            }
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>

        {/* Price */}

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Price ($)
          </h3>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({
                  ...filters,

                  minPrice: e.target.value,
                })
              }
              className="w-1/2 p-2 bg-gray-50 border rounded-lg text-sm"
            />

            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({
                  ...filters,

                  maxPrice: e.target.value,
                })
              }
              className="w-1/2 p-2 bg-gray-50 border rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Category */}

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Category</h3>

          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.value}
                className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.category.includes(category.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({
                        ...filters,

                        category: [...filters.category, category.value],
                      });
                    } else {
                      setFilters({
                        ...filters,

                        category: filters.category.filter(
                          (item) => item !== category.value,
                        ),
                      });
                    }
                  }}
                />

                {category.label}
              </label>
            ))}
          </div>
        </div>

        {/* Bedrooms */}

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Bedrooms</h3>

          <div className="flex flex-wrap gap-2">
            {["Any", "1+", "2+", "3+", "4+"].map((item) => (
              <button
                key={item}
                onClick={() =>
                  setFilters({
                    ...filters,

                    bedrooms: item,
                  })
                }
                className={`px-3 py-1.5 rounded-full text-sm border

${
  filters.bedrooms === item
    ? "bg-blue-700 text-white border-blue-700"
    : "border-gray-300"
}

`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Bathrooms
          </h3>

          <div className="flex flex-wrap gap-2">
            {["Any", "1+", "2+", "3+", "4+"].map((item) => (
              <button
                key={item}
                onClick={() =>
                  setFilters({
                    ...filters,

                    bathrooms: item,
                  })
                }
                className={`px-3 py-1.5 rounded-full text-sm border

${
  filters.bathrooms === item
    ? "bg-blue-700 text-white border-blue-700"
    : "border-gray-300"
}

`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Square Footage */}

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Square Footage (sqft)
          </h3>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minArea}
              onChange={(e) =>
                setFilters({
                  ...filters,

                  minArea: e.target.value,
                })
              }
              className="w-1/2 p-2 bg-gray-50 border rounded-lg text-sm"
            />

            <input
              type="number"
              placeholder="Max"
              value={filters.maxArea}
              onChange={(e) =>
                setFilters({
                  ...filters,

                  maxArea: e.target.value,
                })
              }
              className="w-1/2 p-2 bg-gray-50 border rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Amenities */}

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Amenities
          </h3>

          <div className="space-y-2">
            {amenities.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(item)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({
                        ...filters,

                        amenities: [...filters.amenities, item],
                      });
                    } else {
                      setFilters({
                        ...filters,

                        amenities: filters.amenities.filter((a) => a !== item),
                      });
                    }
                  }}
                />

                {item}
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Filters;
