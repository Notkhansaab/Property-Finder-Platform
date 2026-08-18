import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiTrash2,
  FiMapPin,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiX,
} from "react-icons/fi";
import { deleteAdminProperty, getAdminProperties } from "../../axios/api";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewProperty, setViewProperty] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // ============================================================
  // FETCH PROPERTIES
  // ============================================================

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAdminProperties();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch properties");
      }

      setProperties(result.data || []);
    } catch (err) {
      console.error("Fetch properties error:", err);

      setError("Unable to load properties. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const title = property.title || "";
      const location = property.location || "";
      const owner = property.owner || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        title.toLowerCase().includes(searchText) ||
        location.toLowerCase().includes(searchText) ||
        owner.toLowerCase().includes(searchText);

      const matchesType = typeFilter === "All" || property.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || property.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [properties, search, typeFilter, statusFilter]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;

  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage]);

  // If filtering makes current page invalid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, statusFilter]);

  // ============================================================
  // DELETE PROPERTY
  // ============================================================

  const handleDeleteClick = (property) => {
    setSelectedProperty(property);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProperty) return;

    try {
      const result = await deleteAdminProperty(selectedProperty.id);

      if (!result.success) {
        throw new Error(result.message || "Failed to delete property");
      }

      // Remove deleted property from frontend immediately
      setProperties((prev) =>
        prev.filter((property) => property.id !== selectedProperty.id),
      );

      setShowDeleteModal(false);
      setSelectedProperty(null);
    } catch (err) {
      console.error("Delete property error:", err);

      alert(err.message || "Failed to delete property");
    }
  };

  // ============================================================
  // STATS
  // ============================================================

  const totalCount = properties.length;

  const houseCount = properties.filter(
    (property) => property.type === "House",
  ).length;

  const aptCount = properties.filter(
    (property) => property.type === "Apartment",
  ).length;

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#faf8ff]">
        <div className="text-gray-500 text-sm">Loading properties...</div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#faf8ff] gap-4">
        <p className="text-red-500">{error}</p>

        <button
          onClick={fetchProperties}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-linear-to-br from-[#faf8ff] to-[#f3f3fe] p-5 gap-5 overflow-hidden">
      {/* ======================================================
          HEADER + STATS
      ====================================================== */}

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Property Listings
          </h1>

          <p className="text-sm text-gray-500 mt-0.5">
            Monitor, inspect, and organize all estate listings across the
            platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* TOTAL */}

          <div className="bg-blue-50/80 px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-blue-100">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <FiHome size={16} />
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium">
                Total Properties
              </p>

              <p className="text-xs font-semibold text-blue-700">
                {totalCount}
              </p>
            </div>
          </div>

          {/* HOUSES */}

          <div className="bg-indigo-50/80 px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-indigo-100">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              {houseCount}
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium">Houses</p>

              <p className="text-xs font-semibold text-indigo-700">Listed</p>
            </div>
          </div>

          {/* APARTMENTS */}

          <div className="bg-emerald-50/80 px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-emerald-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
              {aptCount}
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium">Apartments</p>

              <p className="text-xs font-semibold text-emerald-700">Listed</p>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-2xl text-sm transition shadow-xs cursor-pointer ml-auto md:ml-2">
            <FiPlus size={18} />
            Add Property
          </button>
        </div>
      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden">
        {/* CONTROLS */}

        <div className="p-5 border-b border-gray-100/60 flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* SEARCH */}

          <div className="w-full sm:w-80 flex items-center gap-3 bg-[#f3f3fe] rounded-2xl px-4 py-3">
            <FiSearch className="text-gray-400 text-lg" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search property, owner, or location..."
              className="bg-transparent outline-none w-full text-sm placeholder:text-gray-400"
            />
          </div>

          {/* FILTERS */}

          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mr-1">
              <FiFilter size={14} />
              Filter:
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#f3f3fe] text-gray-700 text-xs font-medium px-3.5 py-2.5 rounded-xl border-none outline-none cursor-pointer"
            >
              <option value="All">All Types</option>

              <option value="House">House</option>

              <option value="Apartment">Apartment</option>

              <option value="Commercial">Commercial</option>

              <option value="Villa">Villa</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#f3f3fe] text-gray-700 text-xs font-medium px-3.5 py-2.5 rounded-xl border-none outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>

              <option value="Available">Available</option>

              <option value="Rented">Rented</option>

              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* TABLE */}

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Property</th>

                <th className="py-4 px-6">Owner</th>

                <th className="py-4 px-6">Type</th>

                <th className="py-4 px-6">Price</th>

                <th className="py-4 px-6">Status</th>

                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100/80 text-sm">
              {paginatedProperties.length > 0 ? (
                paginatedProperties.map((property) => (
                  <tr
                    key={property.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    {/* PROPERTY */}

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="h-14 w-20 rounded-2xl object-cover shadow-xs border border-gray-100 shrink-0"
                        />

                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1">
                            {property.title}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                            <FiMapPin size={13} />

                            {property.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* OWNER */}

                    <td className="py-4 px-6 font-medium text-gray-700 text-xs">
                      {property.owner}
                    </td>

                    {/* TYPE */}

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {property.type}
                      </span>
                    </td>

                    {/* PRICE */}

                    <td className="py-4 px-6 font-bold text-gray-800 text-xs">
                      {property.price}
                    </td>

                    {/* STATUS */}

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          property.status === "Rented"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : property.status === "Pending"
                              ? "bg-rose-50 text-rose-600 border border-rose-100"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            property.status === "Rented"
                              ? "bg-amber-500"
                              : property.status === "Pending"
                                ? "bg-rose-500"
                                : "bg-emerald-500"
                          }`}
                        />

                        {property.status || "Available"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewProperty(property)}
                          className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="View Details"
                        >
                          <FiEye size={17} />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(property)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Property"
                        >
                          <FiTrash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-16 text-gray-400 text-sm"
                  >
                    No properties match your current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="p-4 border-t border-gray-100/80 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {paginatedProperties.length} of {filteredProperties.length}{" "}
            results
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <FiChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl font-medium transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-xs"
                    : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={() => setShowDeleteModal(false)}
          />

          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl z-10">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <FiTrash2 size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Delete Property
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100 text-sm">
              <p className="text-gray-500 text-xs">
                Are you sure you want to remove:
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {selectedProperty?.title}
              </p>

              <p className="text-xs text-gray-400 mt-0.5">
                {selectedProperty?.location}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3 text-xs font-semibold">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          VIEW MODAL
      ====================================================== */}

      {viewProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={() => setViewProperty(null)}
          />

          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl z-10 overflow-hidden">
            <button
              onClick={() => setViewProperty(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
            >
              <FiX size={18} />
            </button>

            <img
              src={viewProperty.image}
              alt={viewProperty.title}
              className="w-full h-48 rounded-2xl object-cover mb-4 border border-gray-100"
            />

            <div className="flex items-center justify-between mb-2">
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                {viewProperty.type}
              </span>

              <span className="text-lg font-bold text-gray-800">
                {viewProperty.price}
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {viewProperty.title}
            </h2>

            <p className="flex items-center gap-1 text-xs text-gray-500 mb-4">
              <FiMapPin size={14} />

              {viewProperty.location}
            </p>

            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl text-xs text-gray-600 mb-6 border border-gray-100">
              <div>
                <p className="text-gray-400">Owner Name</p>

                <p className="font-semibold text-gray-800 mt-0.5">
                  {viewProperty.owner}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Current Status</p>

                <p className="font-semibold text-emerald-600 mt-0.5">
                  {viewProperty.status || "Available"}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setViewProperty(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
