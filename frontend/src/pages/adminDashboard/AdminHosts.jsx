import React, { useEffect, useState } from "react";
// import hosts from "../../data/hosts";
import {
  FiFilter,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
  FiStar,
  FiAlertTriangle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAdminHosts } from "../../axios/api";

export default function AdminHosts() {
  const navigate = useNavigate();
  const [hosts, setHosts] = useState([]);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const result = await getAdminHosts();
        if (result.success) {
          setHosts(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch hosts:", error);
      }
    };

    fetchHosts();
  }, []);

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-[#faf8ff] text-[#191b23]">
      <section className="px-10 py-8 max-w-370 mx-auto space-y-8">
        {/* Header */}

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[32px] leading-10 font-semibold tracking-tight">
              Registered Hosts
            </h1>

            <p className="text-[16px] text-[#434654] mt-1">
              Manage and monitor all active property hosts.
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#c3c5d7] text-[#434654] text-sm font-medium hover:bg-[#f3f3fe] transition">
            <FiFilter size={18} />
            Filter
          </button>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-4 gap-5">
          {[
            {
              title: "Total Hosts",
              value: "1,248",
              icon: <FiCheckCircle />,
            },
            {
              title: "Active Listings",
              value: "4,821",
              icon: <FiMoreVertical />,
            },
            {
              title: "Avg. Host Rating",
              value: "4.8",
              icon: <FiStar />,
            },
            {
              title: "Pending Verification",
              value: "34",
              icon: <FiAlertTriangle />,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white border border-[#c3c5d7] rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-5">
                <span className="text-sm text-[#737686] font-medium">
                  {item.title}
                </span>

                <div
                  className={`p-2 rounded-lg ${
                    index === 3
                      ? "bg-[#ffdad6] text-[#ba1a1a]"
                      : "bg-[#dbe1ff] text-[#003fb1]"
                  }`}
                >
                  {item.icon}
                </div>
              </div>

              <h2 className="text-[42px] font-bold tracking-tight">
                {item.value}
              </h2>

              <p className="text-xs text-[#737686] mt-2">Updated this month</p>
            </div>
          ))}
        </div>

        {/* Table Card */}

        <div className="bg-white rounded-xl border border-[#c3c5d7] shadow-sm overflow-hidden">
          {/* Controls */}

          <div className="flex justify-between items-center px-5 py-4 border-b border-[#c3c5d7]">
            <div className="flex gap-2">
              {["All", "Verified", "Pending"].map((item, index) => (
                <button
                  key={item}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    index === 0
                      ? "bg-[#003fb1] text-white"
                      : "bg-[#ededf8] text-[#434654] hover:bg-[#e2e1ed]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <button className="text-[#737686] hover:text-[#003fb1]">
              <FiMoreVertical />
            </button>
          </div>

          {/* Table */}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f3f3fe] border-b border-[#c3c5d7]">
                <tr>
                  {[
                    "Host",
                    "Status",
                    "Listings",
                    "Total Earnings",
                    "Rating",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-5 py-4 text-xs uppercase tracking-wide text-[#737686] font-semibold"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {hosts.map((host) => (
                  <tr
                    key={host.id}
                    className="border-b border-[#c3c5d7] hover:bg-[#faf8ff] transition"
                  >
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        {host.avatar ? (
                          <img
                            src={host.avatar}
                            className="w-11 h-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-[#e2e1ed] flex items-center justify-center font-semibold text-[#434654]">
                            DR
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-[#191b23]">
                            {host.name}
                          </p>

                          <p className="text-sm text-[#737686]">
                            Joined {host.joined}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      {host.status === "Verified" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#e8f5ef] text-[#006a61] border border-[#006a61]/20">
                          <FiCheckCircle size={14} />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/20">
                          <FiClock size={14} />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-5 text-center font-semibold">
                      {host.listings}
                    </td>

                    <td className="px-5 py-5 font-semibold">{host.earnings}</td>

                    <td className="px-5 py-5">
                      {host.rating === "New" ? (
                        <span className="text-[#737686]">New</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <FiStar className="text-[#fbbf24]" fill="#fbbf24" />

                          <span className="font-semibold">{host.rating}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/hosts/${host.id}`)}
                          className="px-3 py-1.5 border border-[#c3c5d7] rounded-lg bg-white text-[#191b23] text-sm hover:bg-[#f3f3fe] transition"
                        >
                          View
                        </button>

                        <button
                          onClick={() => {
                            setSelectedHost(host);
                            setShowBanModal(true);
                          }}
                          className="px-3 py-1.5 border border-red-200 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100 transition"
                        >
                          Ban
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}

          <div className="flex justify-between items-center px-5 py-4 border-t border-[#c3c5d7]">
            <p className="text-sm text-[#737686]">
              Showing 1 to 3 of 1,248 entries
            </p>

            <div className="flex gap-2">
              <button className="p-2 border border-[#c3c5d7] rounded-lg bg-white">
                <FiChevronLeft />
              </button>

              <button className="px-4 py-2 rounded-lg bg-[#003fb1] text-white text-sm">
                1
              </button>

              <button className="px-4 py-2 rounded-lg border border-[#c3c5d7] bg-white text-sm">
                2
              </button>

              <button className="px-4 py-2 rounded-lg border border-[#c3c5d7] bg-white text-sm">
                3
              </button>

              <button className="p-2 border border-[#c3c5d7] rounded-lg bg-white">
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ban Modal */}

      {showBanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl border border-[#c3c5d7] shadow-xl p-8">
            <div className="flex items-center gap-3 text-[#ba1a1a] mb-5">
              <div className="p-3 rounded-full bg-[#ffdad6]">
                <FiAlertTriangle size={26} />
              </div>

              <h2 className="text-xl font-semibold">Confirm Ban</h2>
            </div>

            <p className="text-[#434654] mb-7">
              Are you sure you want to ban
              <span className="font-semibold text-[#191b23]">
                {" "}
                {selectedHost?.name}
              </span>
              ? This action will restrict their access immediately.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBanModal(false)}
                className="px-4 py-2 rounded-lg hover:bg-[#f3f3fe]"
              >
                Cancel
              </button>

              <button className="px-4 py-2 rounded-lg bg-[#ba1a1a] text-white hover:bg-[#a31616]">
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
