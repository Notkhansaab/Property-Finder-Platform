import React, { useState } from "react";
import {
  FiSearch,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";

const usersReports = [
  {
    id: 1,
    user: "Alex Mercer",
    reportedBy: "Sarah Jenkins",
    issue: "Property Damage",
    reports: 7,
    date: "Oct 24, 2024",
  },
  {
    id: 2,
    user: "Elena Rodriguez",
    reportedBy: "System Flag",
    issue: "Policy Violation",
    reports: 5,
    date: "Oct 23, 2024",
  },
  {
    id: 3,
    user: "John Doe",
    reportedBy: "Emily Chen",
    issue: "Harassment",
    reports: 12,
    date: "Oct 22, 2024",
  },
  {
    id: 4,
    user: "Robert Smith",
    reportedBy: "Manager - L.A.",
    issue: "Payment Dispute",
    reports: 3,
    date: "Oct 21, 2024",
  },
  {
    id: 5,
    user: "Michael Wu",
    reportedBy: "Local Authority",
    issue: "Noise Complaint",
    reports: 8,
    date: "Oct 20, 2024",
  },
  {
    id: 6,
    user: "Sophia Williams",
    reportedBy: "Host",
    issue: "Fake Identity",
    reports: 6,
    date: "Oct 19, 2024",
  },
  {
    id: 7,
    user: "Daniel Brown",
    reportedBy: "Admin",
    issue: "Spam Activity",
    reports: 9,
    date: "Oct 18, 2024",
  },
  {
    id: 8,
    user: "Olivia Martin",
    reportedBy: "Guest",
    issue: "Fraud Attempt",
    reports: 11,
    date: "Oct 17, 2024",
  },
  {
    id: 9,
    user: "William Anderson",
    reportedBy: "System",
    issue: "Multiple Accounts",
    reports: 4,
    date: "Oct 16, 2024",
  },
  {
    id: 10,
    user: "Emma Thomas",
    reportedBy: "Host",
    issue: "Bad Behaviour",
    reports: 2,
    date: "Oct 15, 2024",
  },

  // More users for pagination
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 11,
    user: `Reported User ${i + 11}`,
    reportedBy: i % 2 === 0 ? "Admin" : "System",
    issue: [
      "Spam Activity",
      "Fake Reviews",
      "Payment Issue",
      "Suspicious Login",
    ][i % 4],
    reports: Math.floor(Math.random() * 15) + 1,
    date: `Sep ${30 - i}, 2024`,
  })),
];

export default function UsersReports() {
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [openMenu, setOpenMenu] = useState(null);

  const [banUser, setBanUser] = useState(null);

  const perPage = 10;

  const filteredUsers = usersReports.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / perPage);

  const currentUsers = filteredUsers.slice(
    (page - 1) * perPage,
    page * perPage,
  );
  return (
    <main className="min-h-screen bg-[#f8f8ff] p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#191b23]">Reports on Users</h1>

        <p className="mt-3 text-lg text-[#6b7280]">
          Manage and review flagged user activity across EstateLink.
        </p>
      </div>

      {/* Search */}
      <div
        className="
      bg-white
      rounded-2xl
      border
      border-[#e4e5f0]
      shadow-sm
      p-6
      mb-8
    "
      >
        <div className="relative max-w-xl">
          <FiSearch
            className="
          absolute
          left-5
          top-1/2
          -translate-y-1/2
          text-[#8b8fa3]
          "
            size={23}
          />

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="
          Search user name, issue, reporter...
          "
            className="
          w-full
          pl-14
          pr-5
          py-4
          rounded-xl
          bg-[#fafaff]
          border
          border-[#dfe2f2]
          text-lg
          outline-none
          focus:border-[#3159d8]
          focus:ring-4
          focus:ring-[#3159d8]/10
          "
          />
        </div>
      </div>

      {/* Table */}

      <div
        className="
      bg-white
      rounded-2xl
      border
      border-[#e5e7f0]
      shadow-sm
      overflow-visible
    "
      >
        <table className="w-full">
          <thead>
            <tr
              className="
            bg-[#f1f2fb]
            border-b
            border-[#e4e6f1]
            "
            >
              {[
                "User Name",
                "Reported By",
                "Issue Type",
                "Times Reported",
                "Date",
                "Action",
              ].map((title) => (
                <th
                  key={title}
                  className="
                px-8
                py-5
                text-left
                text-sm
                uppercase
                tracking-wide
                text-[#697086]
                font-semibold
                "
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((item) => (
              <tr
                key={item.id}
                className="
              border-b
              border-[#edf0f7]
              hover:bg-[#fafbff]
              transition
              "
              >
                {/* User */}

                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="
                    w-12
                    h-12
                    rounded-full
                    bg-[#dce5ff]
                    flex
                    items-center
                    justify-center
                    text-[#3159d8]
                    font-bold
                    "
                    >
                      {item.user.slice(0, 2).toUpperCase()}
                    </div>

                    <span
                      className="
                    text-lg
                    font-semibold
                    text-[#20232d]
                    "
                    >
                      {item.user}
                    </span>
                  </div>
                </td>

                {/* Reported By */}

                <td
                  className="
                px-8
                text-lg
                text-[#646b7c]
                "
                >
                  {item.reportedBy}
                </td>

                {/* Issue */}

                <td
                  className="
                px-8
                text-lg
                text-[#454b5c]
                "
                >
                  {item.issue}
                </td>

                {/* Number of Reports */}

                <td className="px-8">
                  <span
                    className="
                  inline-flex
                  px-4
                  py-2
                  rounded-full
                  bg-[#fff0ef]
                  text-[#d64545]
                  font-semibold
                  "
                  >
                    {item.reports}
                  </span>
                </td>

                {/* Date */}

                <td
                  className="
                px-8
                text-lg
                text-[#73798b]
                "
                >
                  {item.date}
                </td>

                {/* Actions */}

                <td className="px-8 relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === item.id ? null : item.id)
                    }
                    className="
                  p-3
                  rounded-full
                  hover:bg-[#eef1ff]
                  text-[#687089]
                  "
                  >
                    <FiMoreVertical size={22} />
                  </button>

                  {openMenu === item.id && (
                    <div
                      className="
                      absolute
                      right-8
                      top-14
                      w-48
                      bg-white
                      rounded-xl
                      shadow-xl
                      border
                      border-[#e3e5ef]
                      z-50
                      overflow-hidden
                      "
                    >
                      <button
                        onClick={() => setOpenMenu(null)}
                        className="
                        w-full
                        px-5
                        py-3
                        text-left
                        text-[#555b6e]
                        hover:bg-[#f4f5ff]
                        "
                      >
                        Ignore Report
                      </button>

                      <button
                        onClick={() => {
                          setBanUser(item);
                          setOpenMenu(null);
                        }}
                        className="
                        w-full
                        px-5
                        py-3
                        text-left
                        text-red-600
                        hover:bg-red-50
                        "
                      >
                        Ban User
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}

        <div
          className="
        flex
        justify-between
        items-center
        px-8
        py-5
        bg-[#fafaff]
        border-t
        border-[#e5e7f0]
        "
        >
          <p
            className="
          text-[#73798b]
          text-base
          "
          >
            Showing {(page - 1) * perPage + 1}-
            {Math.min(page * perPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </p>

          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="
            w-11
            h-11
            flex
            items-center
            justify-center
            rounded-xl
            border
            border-[#dfe2f0]
            bg-white
            hover:bg-[#f0f3ff]
            disabled:opacity-40
            "
            >
              <FiChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={`
                  w-11
                  h-11
                  rounded-xl
                  font-semibold
                  transition

                  ${
                    page === number
                      ? "bg-[#3159d8] text-white"
                      : "bg-white border border-[#dfe2f0] text-[#5f6678] hover:bg-[#f1f4ff]"
                  }

                `}
                >
                  {number}
                </button>
              ),
            )}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="
            w-11
            h-11
            flex
            items-center
            justify-center
            rounded-xl
            border
            border-[#dfe2f0]
            bg-white
            hover:bg-[#f0f3ff]
            disabled:opacity-40
            "
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Ban Confirmation Modal */}

      {banUser && (
        <div
          className="
          fixed
          inset-0
          bg-black/30
          backdrop-blur-sm
          flex
          items-center
          justify-center
          z-100
          "
        >
          <div
            className="
            w-105
            bg-white
            rounded-2xl
            shadow-2xl
            p-7
            "
          >
            <div
              className="
              flex
              justify-between
              items-center
              mb-5
              "
            >
              <h2
                className="
                text-2xl
                font-bold
                text-[#20232d]
                "
              >
                Ban User
              </h2>

              <button
                onClick={() => setBanUser(null)}
                className="
                p-2
                rounded-full
                hover:bg-[#f2f3fa]
                "
              >
                <FiX size={22} />
              </button>
            </div>

            <p
              className="
              text-[#636a7c]
              text-lg
              leading-relaxed
              "
            >
              Are you sure you want to ban{" "}
              <span
                className="
                font-bold
                text-[#20232d]
                "
              >
                {banUser.user}
              </span>
              ?
            </p>

            <div
              className="
              flex
              justify-end
              gap-4
              mt-8
              "
            >
              <button
                onClick={() => setBanUser(null)}
                className="
                px-5
                py-3
                rounded-xl
                border
                border-[#dfe2ef]
                text-[#60677a]
                hover:bg-[#f5f6fc]
                "
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  console.log("Banned:", banUser.user);

                  setBanUser(null);
                }}
                className="
                px-5
                py-3
                rounded-xl
                bg-[#d64545]
                text-white
                font-semibold
                hover:bg-[#c43737]
                "
              >
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
