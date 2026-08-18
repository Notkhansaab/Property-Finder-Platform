import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiSearch,
  FiEye,
  FiUser,
  FiHome,
  FiArrowLeft,
  FiX,
} from "react-icons/fi";

// Mock Database of Cross-Entity Incident Reports
const initialReportsList = [
  {
    id: "REP-401",
    category: "Host",
    targetName: "Robert Johnson",
    targetRole: "Host",
    targetRef: "HST-8821",
    reporterName: "Alice Green",
    reporterRole: "Guest",
    issue: "Unresponsive during emergency",
    severity: "High",
    status: "Urgent",
    date: "Oct 14, 2026",
    description:
      "Host failed to respond for 18 hours when heating stopped working during freezing conditions. Guest had to relocate.",
    evidencePhotos: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
    ],
  },
  {
    id: "REP-402",
    category: "Property",
    targetName: "Sunset Villa #4B",
    targetRole: "Property Listing",
    targetRef: "LOC-Miami, FL",
    reporterName: "Tom Hardy",
    reporterRole: "Guest",
    issue: "Misleading Photos & Fake Amenities",
    severity: "Medium",
    status: "Pending",
    date: "Oct 13, 2026",
    description:
      "The pool in photos was completely drained and under construction. Private sauna listed did not exist.",
    evidencePhotos: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600",
    ],
  },
  {
    id: "REP-403",
    category: "User",
    targetName: "Mike Davis",
    targetRole: "Guest",
    targetRef: "USR-3391",
    reporterName: "Sarah Jenkins",
    reporterRole: "Host",
    issue: "Property Damage & Unauthorized Party",
    severity: "High",
    status: "Urgent",
    date: "Oct 14, 2026",
    description:
      "Guest hosted an unapproved event with 20+ people. Stained hardwood floors and damaged living room furniture.",
    evidencePhotos: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
    ],
  },
  {
    id: "REP-404",
    category: "Property",
    targetName: "Downtown Loft",
    targetRole: "Property Listing",
    targetRef: "LOC-New York, NY",
    reporterName: "Building Admin",
    reporterRole: "System Admin",
    issue: "Safety Hazard / Smoke Detector Failure",
    severity: "High",
    status: "Resolved",
    date: "Oct 10, 2026",
    description:
      "Annual inspection flag: Missing hardwired smoke alarm in master bedroom.",
    evidencePhotos: [],
  },
  {
    id: "REP-405",
    category: "User",
    targetName: "Emily Chen",
    targetRole: "Guest",
    issue: "Harassment in Direct Messages",
    status: "Pending",
    severity: "Low",
    date: "Oct 11, 2026",
    reporterName: "David Wright",
    reporterRole: "Host",
    description:
      "Guest sent offensive messages demanding a 100% refund post check-out after violating house rules.",
    evidencePhotos: [],
  },
];

const AdminReportsDetail = () => {
  const navigate = useNavigate();
  const { category: urlCategory } = useParams();

  const [reports, setReports] = useState(initialReportsList);
  const [selectedCategory, setSelectedCategory] = useState(
    urlCategory ? urlCategory.toLowerCase() : "all",
  );
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [activeReport, setActiveReport] = useState(null);
  const [actionNote, setActionNote] = useState("");

  // Filtered Logic
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        item.category.toLowerCase() === selectedCategory.replace(/s$/, "");

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesSearch =
        item.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [reports, selectedCategory, statusFilter, searchQuery]);

  const handleUpdateStatus = (id, newStatus) => {
    setReports((prev) =>
      prev.map((rep) => (rep.id === id ? { ...rep, status: newStatus } : rep)),
    );
    setActiveReport(null);
    setActionNote("");
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-8 py-10 min-h-screen bg-gray-50/50">
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => navigate("/admin/reports")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition mb-3 cursor-pointer"
          >
            <FiArrowLeft size={18} /> Back to Overview Dashboard
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Incident Moderation Queue
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Investigate policy violations, damage claims, and safety disputes
            between users and hosts.
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-red-200 bg-red-50/80 px-5 py-3 text-center shadow-xs">
            <span className="block text-xs font-bold uppercase tracking-wider text-red-600">
              Urgent Cases
            </span>
            <span className="text-2xl font-extrabold text-red-700">
              {reports.filter((r) => r.status === "Urgent").length}
            </span>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-5 py-3 text-center shadow-xs">
            <span className="block text-xs font-bold uppercase tracking-wider text-amber-600">
              Pending
            </span>
            <span className="text-2xl font-extrabold text-amber-700">
              {reports.filter((r) => r.status === "Pending").length}
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-100/80 p-1.5 rounded-xl w-full lg:w-auto">
          {[
            { label: "All Entity Reports", val: "all" },
            { label: "Host Reports", val: "host" },
            { label: "Property Reports", val: "property" },
            { label: "User / Guest Reports", val: "user" },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setSelectedCategory(tab.val)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                selectedCategory === tab.val
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Secondary Filters */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          {/* Status Dropdown */}
          <div className="relative flex-1 lg:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Urgent">Urgent Only</option>
              <option value="Pending">Pending Only</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 lg:w-72">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, entity, reporter..."
              className="w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Incident Reports Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4">Report ID & Date</th>
                <th className="px-6 py-4">Reported Target</th>
                <th className="px-6 py-4">Filed By (Reporter)</th>
                <th className="px-6 py-4">Issue Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-base">
              {filteredReports.length > 0 ? (
                filteredReports.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    {/* ID & Date */}
                    <td className="px-6 py-5">
                      <span className="font-mono text-sm font-bold text-gray-900 block">
                        {item.id}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        {item.date}
                      </span>
                    </td>

                    {/* Reported Entity */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 shrink-0">
                          {item.category === "Property" ? (
                            <FiHome size={20} />
                          ) : (
                            <FiUser size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {item.targetName}
                          </p>
                          <span className="text-xs text-gray-500 font-medium">
                            {item.targetRole} •{" "}
                            {item.targetRef || item.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Reporter */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-gray-800">
                        {item.reporterName}
                      </p>
                      <span className="text-xs text-gray-500">
                        {item.reporterRole}
                      </span>
                    </td>

                    {/* Issue & Severity */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.issue}
                      </p>
                      <span
                        className={`text-xs font-bold ${
                          item.severity === "High"
                            ? "text-rose-600"
                            : item.severity === "Medium"
                              ? "text-amber-600"
                              : "text-gray-500"
                        }`}
                      >
                        {item.severity} Severity
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          item.status === "Urgent"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : item.status === "Pending"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : item.status === "Resolved"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status === "Urgent" && (
                          <FiAlertTriangle size={14} />
                        )}
                        {item.status === "Resolved" && (
                          <FiCheckCircle size={14} />
                        )}
                        {item.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => setActiveReport(item)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition cursor-pointer shadow-xs"
                      >
                        <FiEye size={16} /> Investigate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-16 text-gray-500 text-sm"
                  >
                    No incident reports match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investigation & Resolution Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveReport(null)}
          />

          <div className="relative w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-200 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-blue-600">
                    {activeReport.id}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    • {activeReport.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {activeReport.issue}
                </h3>
              </div>

              <button
                onClick={() => setActiveReport(null)}
                className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Entity Comparison Card */}
            <div className="grid grid-cols-2 gap-6 my-6 p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Reported Target
                </p>
                <p className="font-bold text-gray-900 text-base mt-1">
                  {activeReport.targetName}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  {activeReport.targetRole}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Filed By
                </p>
                <p className="font-bold text-gray-900 text-base mt-1">
                  {activeReport.reporterName}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  {activeReport.reporterRole}
                </p>
              </div>
            </div>

            {/* Description Narrative */}
            <div className="space-y-2 mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Incident Description
              </p>
              <p className="text-sm text-gray-800 leading-relaxed bg-white p-4 rounded-2xl border border-gray-200">
                "{activeReport.description}"
              </p>
            </div>

            {/* Attached Evidence */}
            {activeReport.evidencePhotos?.length > 0 && (
              <div className="space-y-3 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Attached Photo Evidence
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {activeReport.evidencePhotos.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Incident Evidence"
                      className="w-full h-44 rounded-2xl object-cover border border-gray-200 shadow-xs"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Admin Action Note */}
            <div className="space-y-2 mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Admin Moderation Notes
              </p>
              <textarea
                rows="3"
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Log internal notes or message sent to entities..."
                className="w-full p-4 rounded-2xl border border-gray-300 text-sm text-gray-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder:text-gray-400"
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-gray-200">
              <button
                onClick={() => handleUpdateStatus(activeReport.id, "Dismissed")}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Dismiss Report
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleUpdateStatus(activeReport.id, "Resolved")
                  }
                  className="px-5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 text-sm font-semibold transition cursor-pointer"
                >
                  Issue Official Warning
                </button>

                <button
                  onClick={() =>
                    handleUpdateStatus(activeReport.id, "Resolved")
                  }
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition cursor-pointer shadow-xs"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportsDetail;
