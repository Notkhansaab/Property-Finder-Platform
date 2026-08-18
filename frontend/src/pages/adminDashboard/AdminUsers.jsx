import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiUserPlus,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
} from "react-icons/fi";
import { banAdminUser, getAdminUsers } from "../../axios/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banLoading, setBanLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 15;

  // Fetch users from PostgreSQL through backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers();
      setUsers(data.data);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Unable to load users. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search users
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Open ban confirmation
  const openBanModal = (user) => {
    setSelectedUser(user);
    setShowBanModal(true);
  };

  // Ban user
  const handleBanUser = async () => {
    if (!selectedUser) return;

    try {
      setBanLoading(true);

      await banAdminUser(selectedUser.id);

      // Update UI immediately
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, status: "suspended" } : user,
        ),
      );

      setShowBanModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Ban user error:", err);
      alert("Failed to ban user.");
    } finally {
      setBanLoading(false);
    }
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-[#faf8ff]">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white border-b border-[#c3c5d7] px-10 py-6 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-[32px] font-semibold text-[#191b23]">
            User Management
          </h1>

          <p className="text-[16px] text-[#434654] mt-1">
            Manage platform users, roles, and account statuses.
          </p>
        </div>

        <button
          className="
            flex items-center gap-2
            bg-[#003fb1]
            text-white
            px-5 py-3
            rounded-lg
            font-medium
            hover:bg-[#00359b]
            transition
            shadow-sm
          "
        >
          <FiUserPlus size={19} />
          Invite User
        </button>
      </header>

      <section className="px-10 py-8 max-w-350 mx-auto">
        {/* SEARCH */}
        <div
          className="
            bg-white
            border border-[#c3c5d7]
            rounded-xl
            p-5
            shadow-sm
            mb-8
          "
        >
          <div className="relative w-[320px]">
            <FiSearch
              size={20}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#737686]
              "
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="
                w-full
                pl-12
                pr-4
                py-3
                rounded-lg
                border
                border-[#c3c5d7]
                bg-[#faf8ff]
                text-[15px]
                outline-none
                focus:border-[#003fb1]
              "
            />
          </div>
        </div>

        {/* TABLE CARD */}
        <div
          className="
            bg-white
            rounded-xl
            border
            border-[#c3c5d7]
            shadow-sm
            overflow-hidden
          "
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f3f3fe] border-b border-[#c3c5d7]">
                  <th className="px-6 py-4">
                    <input type="checkbox" />
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-[#434654]">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-[#434654]">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-[#434654]">
                    Bookings
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-[#434654]">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-[#434654]">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-[#434654] text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#c3c5d7]">
                {/* LOADING */}
                {loading && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-[#737686]"
                    >
                      Loading users...
                    </td>
                  </tr>
                )}

                {/* ERROR */}
                {!loading && error && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-red-600"
                    >
                      <p className="mb-3">{error}</p>

                      <button
                        onClick={fetchUsers}
                        className="px-4 py-2 bg-[#003fb1] text-white rounded-lg"
                      >
                        Try Again
                      </button>
                    </td>
                  </tr>
                )}

                {/* EMPTY */}
                {!loading && !error && filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-[#737686]"
                    >
                      No users found.
                    </td>
                  </tr>
                )}

                {/* USERS */}
                {!loading &&
                  !error &&
                  currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#f8f8ff] transition">
                      {/* CHECKBOX */}
                      <td className="px-6 py-5">
                        <input type="checkbox" />
                      </td>

                      {/* USER */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="
                                w-12
                                h-12
                                rounded-full
                                object-cover
                              "
                            />
                          ) : (
                            <div
                              className="
                                w-12
                                h-12
                                rounded-full
                                bg-[#e7e7f3]
                                flex
                                items-center
                                justify-center
                                font-semibold
                              "
                            >
                              {user.name
                                ?.split(" ")
                                .map((x) => x[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-[#191b23]">
                              {user.name}
                            </p>

                            <p className="text-sm text-[#737686]">
                              ID: {user.externalId || user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td className="px-6 py-5">
                        <p className="text-[#191b23]">{user.email}</p>

                        <p className="text-sm text-[#737686]">
                          {user.phone || "No phone number"}
                        </p>
                      </td>

                      {/* BOOKINGS */}
                      <td className="px-6 py-5">
                        <p className="text-[#191b23] font-medium text-[15px]">
                          {user.bookings ?? 0}
                        </p>

                        <p className="text-sm text-[#737686]">Total bookings</p>
                      </td>

                      {/* JOINED */}
                      <td className="px-6 py-5 text-[#434654]">
                        {user.joined
                          ? new Date(user.joined).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        <span
                          className={`
                            inline-flex
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : user.status === "suspended"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                            }
                          `}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5 text-right">
                        {user.status === "suspended" ? (
                          <span className="text-sm text-red-600 font-medium">
                            Banned
                          </span>
                        ) : (
                          <button
                            onClick={() => openBanModal(user)}
                            className="
                              bg-[#ba1a1a]
                              text-white
                              px-4
                              py-2
                              rounded-lg
                              hover:bg-red-700
                              transition
                            "
                          >
                            Ban
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-[#c3c5d7]">
            <p className="text-sm text-[#737686]">
              Showing {filteredUsers.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(endIndex, filteredUsers.length)} of{" "}
              {filteredUsers.length} results
            </p>

            <div className="flex gap-2 items-center">
              {/* Previous */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 border rounded-lg ${
                  currentPage === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <FiChevronLeft />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-[#003fb1] text-white"
                        : "border border-[#c3c5d7] bg-white hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-2 border rounded-lg ${
                  currentPage === totalPages || totalPages === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BAN MODAL */}
      {showBanModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            backdrop-blur-sm
          "
        >
          <div
            className="
              bg-white
              p-8
              rounded-xl
              shadow-xl
              border
              border-[#c3c5d7]
              max-w-md
              w-full
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                mb-5
                text-[#ba1a1a]
              "
            >
              <FiAlertTriangle size={32} />

              <h2 className="text-xl font-semibold">Confirm Ban</h2>
            </div>

            <p className="text-[#434654] mb-6">
              Are you sure you want to ban
              <span className="font-semibold text-black">
                {" "}
                {selectedUser?.name}
              </span>
              ? This action will restrict their access immediately.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setSelectedUser(null);
                }}
                disabled={banLoading}
                className="
                  px-4
                  py-2
                  rounded-lg
                  hover:bg-gray-100
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                onClick={handleBanUser}
                disabled={banLoading}
                className="
                  bg-[#ba1a1a]
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  disabled:opacity-50
                "
              >
                {banLoading ? "Banning..." : "Confirm Ban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
