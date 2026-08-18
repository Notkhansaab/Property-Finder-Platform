import { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getHostListings } from "../../axios/api";

export default function HostListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await getHostListings();
        if (!mounted) return;
        if (res.data && res.data.success) {
          setListings(
            res.data.data.map((p) => ({
              id: p.id,
              title: p.title,
              location: p.location || "",
              image: p.image || "",
              category: p.category,
              type: p.type,
              rating: p.rating,
              beds: p.beds,
              baths: p.baths,
              guests: p.guests,
              price: p.price,
              period: p.period,
              description: p.description,
              status: p.status,
            })),
          );
        } else {
          setError(res.data?.message || "Failed to load listings");
        }
      } catch (err) {
        setError(err.message || "Failed to load listings");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(search.toLowerCase()) ||
      listing.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" || listing.type === filter;

    return matchesSearch && matchesFilter;
  });

  const confirmDelete = () => {
    if (propertyToDelete) {
      setListings((prev) =>
        prev.filter((item) => item.id !== propertyToDelete.id),
      );
      setPropertyToDelete(null);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setListings((prev) =>
      prev.map((item) =>
        item.id === editingProperty.id ? editingProperty : item,
      ),
    );
    setEditingProperty(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProperty((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            My Listings
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Manage, edit, and track the performance of your properties.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative grow md:w-72">
            <FiSearch
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search listings..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-sm"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm outline-none cursor-pointer text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            >
              <option value="all">All Listings</option>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add Listing Card */}
        <Link
          to="/host/addproperty"
          className="group border-2 border-dashed border-gray-300 rounded-2xl min-h-95 flex flex-col items-center justify-center p-6 bg-gray-50/50 hover:bg-blue-50/40 hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <FiPlus size={28} />
          </div>

          <p className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            Add New Listing
          </p>

          <p className="text-xs text-gray-500 mt-1 text-center">
            List a new property for rent or sale
          </p>
        </Link>

        {/* Property Cards */}
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 animate-pulse h-52"
              />
            ))
          : filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Card Image Container */}
                <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Status/Category Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-md text-gray-900 shadow-sm">
                      {listing.category || "Property"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-blue-600 text-white shadow-sm">
                      {listing.type || "Rent"}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  {listing.rating && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-900/80 backdrop-blur-md text-white flex items-center gap-1 shadow-sm">
                      <span className="text-yellow-400">★</span>
                      <span>{listing.rating}</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 truncate tracking-tight">
                      {listing.title}
                    </h3>

                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-normal">
                      <span className="material-symbols-outlined text-[15px] text-gray-400">
                        location_on
                      </span>
                      <span className="truncate">{listing.location}</span>
                    </p>

                    {/* Property Specs Pills */}
                    <div className="flex items-center gap-3 mt-4 text-xs font-medium text-gray-500 border-t border-b border-gray-100 py-2.5">
                      {listing.beds && (
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-gray-800">
                            {listing.beds}
                          </span>{" "}
                          Beds
                        </span>
                      )}
                      {listing.baths && (
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-gray-800">
                            {listing.baths}
                          </span>{" "}
                          Baths
                        </span>
                      )}
                      {listing.guests && (
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-gray-800">
                            {listing.guests}
                          </span>{" "}
                          Guests
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Actions Row */}
                  <div className="mt-4 pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 font-medium block">
                        Price
                      </span>
                      <p className="text-xl font-bold text-blue-600">
                        ${listing.price}
                        <span className="text-xs text-gray-500 font-normal ml-0.5">
                          /{listing.period || "night"}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProperty(listing)}
                        className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Edit Listing"
                      >
                        <FiEdit2 size={18} />
                      </button>

                      <button
                        onClick={() => setPropertyToDelete(listing)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Listing"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {propertyToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Delete Property
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                "{propertyToDelete.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setPropertyToDelete(null)}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROPERTY MODAL */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Property Details
              </h3>
              <button
                onClick={() => setEditingProperty(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingProperty.title || ""}
                  onChange={handleEditChange}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={editingProperty.location || ""}
                  onChange={handleEditChange}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editingProperty.price || 0}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Period
                  </label>
                  <select
                    name="period"
                    value={editingProperty.period || "night"}
                    onChange={handleEditChange}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition bg-white"
                  >
                    <option value="night">Per Night</option>
                    <option value="month">Per Month</option>
                    <option value="year">Per Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Listing Type
                </label>
                <select
                  name="type"
                  value={editingProperty.type || "rent"}
                  onChange={handleEditChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition bg-white"
                >
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={editingProperty.image || ""}
                  onChange={handleEditChange}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={editingProperty.description || ""}
                  onChange={handleEditChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2.5 border border-gray-200 font-medium rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-sm transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
