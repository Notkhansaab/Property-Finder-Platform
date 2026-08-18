import React, { useEffect, useMemo, useState } from "react";
import {
  FiFileText,
  FiImage,
  FiCreditCard,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiUserCheck,
  FiSearch,
  FiEye,
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiShield,
} from "react-icons/fi";
import {
  approveHostVerification,
  getHostVerifications,
  rejectHostVerification,
} from "../../axios/api";

const AdminVerification = () => {
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Modals
  const [inspectItem, setInspectItem] = useState(null);
  const [rejectItem, setRejectItem] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Action states
  const [processingId, setProcessingId] = useState(null);

  // ============================================================
  // FETCH VERIFICATIONS
  // ============================================================

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHostVerifications();
      setRequests(data.data || []);
    } catch (err) {
      console.error("Fetch verifications:", err);
      setError(err.message || "Failed to load verification requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  // ============================================================
  // TIME FORMATTER
  // ============================================================

  const formatTimeAgo = (dateValue) => {
    if (!dateValue) return "Unknown";

    const date = new Date(dateValue);
    const now = new Date();

    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return "Just now";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
    }

    if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    }

    if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    }

    return date.toLocaleDateString();
  };

  // ============================================================
  // STATS
  // ============================================================

  const pendingTotal = requests.length;

  const hostCount = requests.length;

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredRequests = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return requests;
    }

    return requests.filter((item) => {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.reference?.toLowerCase().includes(query) ||
        item.documentType?.toLowerCase().includes(query)
      );
    });
  }, [requests, searchQuery]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage]);

  // ============================================================
  // APPROVE
  // ============================================================

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      setError("");

      const data = await approveHostVerification(id);

      if (!data.success) {
        throw new Error(data.message || "Failed to approve verification.");
      }

      // Remove approved request from pending queue
      setRequests((prev) => prev.filter((item) => item.id !== id));

      if (inspectItem?.id === id) {
        setInspectItem(null);
      }

      setCurrentPage(1);
    } catch (err) {
      console.error("Approve verification:", err);
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  // ============================================================
  // OPEN REJECT MODAL
  // ============================================================

  const handleRejectClick = (item) => {
    setRejectItem(item);
    setRejectReason("");
  };

  // ============================================================
  // CONFIRM REJECT
  // ============================================================

  const handleConfirmReject = async () => {
    if (!rejectItem) return;

    if (!rejectReason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }

    try {
      setProcessingId(rejectItem.id);
      setError("");

      const data = await rejectHostVerification(
        rejectItem.id,
        rejectReason.trim(),
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to reject verification.");
      }

      // Remove rejected request from pending queue
      setRequests((prev) => prev.filter((item) => item.id !== rejectItem.id));

      if (inspectItem?.id === rejectItem.id) {
        setInspectItem(null);
      }

      setRejectItem(null);
      setRejectReason("");
      setCurrentPage(1);
    } catch (err) {
      console.error("Reject verification:", err);
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 py-8">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Host Verification Queue
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review and manually verify incoming host identity verification
            requests.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* ========================================================
          SUMMARY CARDS
      ======================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Pending */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Pending Queue
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {pendingTotal}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <FiClock size={22} />
            </div>
          </div>
        </div>

        {/* Hosts */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Host Verifications
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {hostCount}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <FiUserCheck size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MAIN TABLE
      ======================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 px-6 py-4 bg-gray-50/40">
          {/* Host tab only */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <div className="px-4 py-1.5 rounded-lg bg-white text-gray-900 shadow-xs text-xs font-semibold">
              Host Verifications
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search host or ID..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* ======================================================
            TABLE
        ====================================================== */}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Host
                </th>

                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Documents
                </th>

                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Submitted
                </th>

                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-16 text-gray-400 text-sm"
                  >
                    Loading host verification requests...
                  </td>
                </tr>
              ) : paginatedRequests.length > 0 ? (
                paginatedRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="transition hover:bg-gray-50/80 group"
                  >
                    {/* Host */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={request.avatar}
                          alt={request.name}
                          className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-xs"
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              {request.name}
                            </p>

                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                              Host
                            </span>
                          </div>

                          <p className="text-xs text-gray-400 mt-0.5">
                            {request.reference}
                          </p>

                          <p className="text-xs text-gray-400">
                            {request.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Documents */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {request.documents.includes("identity") && (
                          <button
                            onClick={() => setInspectItem(request)}
                            className="flex items-center gap-1 rounded-lg bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 text-xs text-gray-600 transition cursor-pointer"
                          >
                            <FiCreditCard size={14} />
                            ID
                          </button>
                        )}

                        {request.documents.includes("document") && (
                          <button
                            onClick={() => setInspectItem(request)}
                            className="flex items-center gap-1 rounded-lg bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 text-xs text-gray-600 transition cursor-pointer"
                          >
                            <FiFileText size={14} />
                            Document
                          </button>
                        )}

                        {request.documents.includes("selfie") && (
                          <button
                            onClick={() => setInspectItem(request)}
                            className="flex items-center gap-1 rounded-lg bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 text-xs text-gray-600 transition cursor-pointer"
                          >
                            <FiImage size={14} />
                            Selfie
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Submitted */}
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                      {formatTimeAgo(request.submitted)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setInspectItem(request)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        >
                          <FiEye size={14} />
                          Inspect
                        </button>

                        <button
                          disabled={processingId === request.id}
                          onClick={() => handleRejectClick(request)}
                          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer disabled:opacity-50"
                        >
                          Reject
                        </button>

                        <button
                          disabled={processingId === request.id}
                          onClick={() => handleApprove(request.id)}
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white transition cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          {processingId === request.id
                            ? "Processing..."
                            : "Approve"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    No pending host verification requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ======================================================
            PAGINATION
        ====================================================== */}

        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/20">
          <p className="text-xs text-gray-400 font-medium">
            Showing page <span className="text-gray-700">{currentPage}</span> of{" "}
            <span className="text-gray-700">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition cursor-pointer"
            >
              <FiChevronLeft size={16} />
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="rounded-lg border border-gray-200 p-2 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition cursor-pointer"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          INSPECT MODAL
      ======================================================== */}

      {inspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setInspectItem(null)}
          />

          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition cursor-pointer"
            >
              <FiX size={18} />
            </button>

            {/* Host header */}
            <div className="flex items-center gap-3 mb-5">
              <img
                src={inspectItem.avatar}
                alt={inspectItem.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {inspectItem.name}
                </h3>

                <p className="text-xs text-gray-400">
                  {inspectItem.reference} • {inspectItem.email}
                </p>
              </div>
            </div>

            {/* Verification information */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  Document Type
                </p>

                <p className="text-xs font-semibold text-gray-800 mt-1">
                  {inspectItem.documentType || "Identity Document"}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  Host Code
                </p>

                <p className="text-xs font-semibold text-gray-800 mt-1">
                  {inspectItem.reference}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="p-3 bg-gray-50 rounded-xl mb-5 text-xs text-gray-600 border border-gray-100">
              <p className="font-semibold text-gray-700 mb-0.5">
                Submission Details
              </p>

              <p>{inspectItem.notes}</p>
            </div>

            {/* Documents */}
            <div className="space-y-4 mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Uploaded Verification Documents
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(inspectItem.documentPreviews || {})
                  .filter(([, url]) => url)
                  .map(([key, url]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-xs font-medium text-gray-600 capitalize">
                        {key}
                      </p>

                      <img
                        src={url}
                        alt={key}
                        className="w-full h-44 rounded-xl object-cover border border-gray-200 shadow-xs"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => setInspectItem(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                Close Preview
              </button>

              <div className="flex gap-2">
                <button
                  disabled={processingId === inspectItem.id}
                  onClick={() => handleRejectClick(inspectItem)}
                  className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  <span className="flex items-center gap-1">
                    <FiXCircle />
                    Reject
                  </span>
                </button>

                <button
                  disabled={processingId === inspectItem.id}
                  onClick={() => handleApprove(inspectItem.id)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <span className="flex items-center gap-1">
                    <FiCheckCircle />
                    Confirm & Approve
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          REJECTION MODAL
      ======================================================== */}

      {rejectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => {
              if (!processingId) {
                setRejectItem(null);
              }
            }}
          />

          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Decline Verification
            </h3>

            <p className="text-xs text-gray-500 mb-4">
              Specify a reason for declining {rejectItem.name}'s verification
              submission.
            </p>

            <textarea
              rows="4"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Identity document is unclear..."
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs outline-none focus:border-rose-500 focus:bg-white transition mb-5"
            />

            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                disabled={processingId === rejectItem.id}
                onClick={() => setRejectItem(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={processingId === rejectItem.id}
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer disabled:opacity-50"
              >
                {processingId === rejectItem.id
                  ? "Rejecting..."
                  : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerification;
