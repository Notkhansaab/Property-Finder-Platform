import React from "react";

const PropertyInfo = ({ property }) => {
  // Guard clause: prevents crashing if property is undefined or still loading
  if (!property) {
    return (
      <div className="w-full lg:w-2/3 p-6 text-gray-500 animate-pulse">
        Loading property information...
      </div>
    );
  }

  return (
    <div className="w-full lg:w-2/3 flex flex-col gap-8">
      {/* Host Section */}
      <div className="flex justify-between items-center pb-6 border-b">
        <div>
          <h2 className="text-2xl font-semibold">
            Entire villa hosted by <span>{property?.host?.name || "Host"}</span>
          </h2>

          <p className="text-gray-500 mt-2">
            {property?.guests ?? 0} guests · {property?.bedrooms ?? 0} bedrooms
            · {property?.beds ?? 0} beds · {property?.baths ?? 0} baths
          </p>
        </div>

        <img
          src={property?.host?.image || "https://via.placeholder.com/150"}
          alt={property?.host?.name || "Host"}
          className="w-14 h-14 rounded-full object-cover bg-gray-100"
        />
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold mb-3">About this space</h3>
        <p className="text-gray-600 leading-7">
          {property?.description || "No description available."}
        </p>
      </div>

      {/* Amenities */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">What this place offers</h3>

        <div className="grid md:grid-cols-2 gap-4">
          {property?.amenities && property.amenities.length > 0 ? (
            property.amenities.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-gray-700"
              >
                <span>✓</span>
                {typeof item === "object" ? item.name : item}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No amenities listed.</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Where you'll be</h3>
        <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
          Map Placeholder
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;
