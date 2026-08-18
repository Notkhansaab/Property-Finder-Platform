import React, { useState } from "react";
import { FiMoreVertical, FiSearch, FiFilter } from "react-icons/fi";

const initialReports = [
  {
    id: 1,
    name: "Eleanor Vance",
    reporter: "John Doe",
    issue: "Unresponsive",
    status: "Urgent",
    date: "Oct 24, 2023",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    id: 2,
    name: "Arthur Pendelton",
    reporter: "Sarah Jenkins",
    issue: "Misleading Listing",
    status: "Pending",
    date: "Oct 22, 2023",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
  {
    id: 3,
    name: "Maria Garcia",
    reporter: "Anonymous",
    issue: "Professionalism",
    status: "Resolved",
    date: "Oct 20, 2023",
  },
];

const statusStyles = {
  Urgent: "bg-red-100 text-red-700",
  Pending: "bg-gray-100 text-gray-600",
  Resolved: "bg-green-100 text-green-700",
};

const HostReports = () => {
  const [reports, setReports] = useState(initialReports);

  const [openMenu, setOpenMenu] = useState(null);

  const [banModal, setBanModal] = useState(false);

  const [selectedHost, setSelectedHost] = useState(null);

  const handleIgnore = (id) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status: "Ignored" } : report,
      ),
    );

    setOpenMenu(null);

    // Future API:
    // await api.patch(`/reports/${id}/ignore`)
  };

  const handleBanClick = (report) => {
    setSelectedHost(report);

    setBanModal(true);

    setOpenMenu(null);
  };

  const confirmBan = () => {
    console.log("Ban host:", selectedHost.name);

    // Future API:
    // await api.post(`/hosts/${selectedHost.id}/ban`)

    setBanModal(false);
    setSelectedHost(null);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] p-10">
      <div className="mx-auto max-w-330">
        {/* Header */}

        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Reports on Hosts
            </h1>

            <p className="mt-2 text-gray-500">
              Manage and review incoming reports concerning host behavior and
              listings.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                placeholder="Search hosts..."
                className="rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 outline-none focus:border-blue-500"
              />
            </div>

            <button
              className="
flex items-center gap-2
rounded-lg border border-gray-200
bg-white px-4 py-2
hover:bg-gray-50
"
            >
              <FiFilter />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}

        <div
          className="
overflow-hidden
rounded-xl
border border-gray-200
bg-white
shadow-sm
"
        >
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4">Host Name</th>

                <th className="px-6 py-4">Reporter</th>

                <th className="px-6 py-4">Issue Type</th>

                <th className="px-6 py-4">Status</th>

                <th className="px-6 py-4">Date</th>

                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="
border-t border-gray-100
hover:bg-gray-50
"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {report.avatar ? (
                        <img
                          src={report.avatar}
                          className="
h-10 w-10
rounded-full
object-cover
"
                        />
                      ) : (
                        <div
                          className="
flex h-10 w-10
items-center justify-center
rounded-full
bg-blue-100
font-semibold
text-blue-600
"
                        >
                          M
                        </div>
                      )}

                      <span className="font-medium text-gray-900">
                        {report.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-gray-600">{report.reporter}</td>

                  <td className="px-6 py-5">{report.issue}</td>

                  <td className="px-6 py-5">
                    <span
                      className={`
rounded-full px-3 py-1
text-xs font-semibold
${statusStyles[report.status] || "bg-gray-100 text-gray-600"}
`}
                    >
                      {report.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-gray-500">{report.date}</td>

                  <td className="relative px-6 py-5 text-right">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === report.id ? null : report.id)
                      }
                      className="
rounded-lg p-2
text-gray-500
hover:bg-gray-100
"
                    >
                      <FiMoreVertical />
                    </button>

                    {openMenu === report.id && (
                      <div
                        className="
absolute right-8 top-14
z-20 w-32
rounded-lg
border border-gray-200
bg-white
shadow-lg
"
                      >
                        <button
                          onClick={() => handleIgnore(report.id)}
                          className="
block w-full px-4 py-3
text-left text-sm
hover:bg-gray-50
"
                        >
                          Ignore
                        </button>

                        <button
                          onClick={() => handleBanClick(report)}
                          className="
block w-full px-4 py-3
text-left text-sm
text-red-600
hover:bg-red-50
"
                        >
                          Ban
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ban Modal */}

      {banModal && (
        <div
          className="
fixed inset-0
z-50
flex items-center justify-center
"
        >
          <div
            className="
absolute inset-0
bg-black/40
"
            onClick={() => setBanModal(false)}
          />

          <div
            className="
relative
w-full max-w-md
rounded-xl
bg-white
p-6
shadow-xl
"
          >
            <h2
              className="
text-xl
font-semibold
text-gray-900
"
            >
              Ban Host
            </h2>

            <p
              className="
mt-3
text-gray-600
"
            >
              Are you sure you want to ban{" "}
              <span className="font-semibold">{selectedHost?.name}</span>?
            </p>

            <div
              className="
mt-6
flex justify-end gap-3
"
            >
              <button
                onClick={() => setBanModal(false)}
                className="
rounded-lg
border border-gray-200
px-5 py-2
hover:bg-gray-50
"
              >
                Cancel
              </button>

              <button
                onClick={confirmBan}
                className="
rounded-lg
bg-red-600
px-5 py-2
text-white
hover:bg-red-700
"
              >
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostReports;
