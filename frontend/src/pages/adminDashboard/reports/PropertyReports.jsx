import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const propertyReports = [
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    property: "Modern Minimalist Loft with City Views",
    location: "Downtown, NY",
    issue: "Fake Images",
    status: "Urgent",
    date: "Oct 24, 2023",
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    property: "Skyline View Penthouse Suite",
    location: "River North, IL",
    issue: "Wrong Location",
    status: "Pending",
    date: "Oct 23, 2023",
  },
  {
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
    property: "Renovated Suburban Family Home",
    location: "Oak Park, IL",
    issue: "Safety Hazard",
    status: "Urgent",
    date: "Oct 22, 2023",
  },
  {
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
    property: "Sunny Coastal Retreat Bedroom",
    location: "Malibu, CA",
    issue: "Spam Listing",
    status: "Resolved",
    date: "Oct 20, 2023",
  },
  {
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    property: "Luxury Modern Apartment",
    location: "Miami, FL",
    issue: "Fake Images",
    status: "Pending",
    date: "Oct 18, 2023",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Urgent: "bg-red-50 text-red-600 border-red-200",
    Pending: "bg-orange-50 text-orange-600 border-orange-200",
    Resolved: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <span
      className={`
      inline-flex
      items-center
      gap-2
      rounded-full
      border
      px-4
      py-2
      text-sm
      font-semibold
      ${styles[status]}
      `}
    >
      <span
        className={`
        h-2.5
        w-2.5
        rounded-full

        ${
          status === "Urgent"
            ? "bg-red-500"
            : status === "Resolved"
              ? "bg-emerald-500"
              : "bg-orange-500"
        }
        `}
      />

      {status}
    </span>
  );
};

const PropertyReports = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const filteredReports = propertyReports.filter((item) => {
    const value = search.toLowerCase();

    return (
      item.property.toLowerCase().includes(value) ||
      item.location.toLowerCase().includes(value) ||
      item.issue.toLowerCase().includes(value) ||
      item.status.toLowerCase().includes(value)
    );
  });

  return (
    <main
      className="
min-h-screen
bg-[#faf8ff]
p-10
"
    >
      {/* HEADER */}

      <div className="mb-10">
        <h1
          className="
text-5xl
font-bold
tracking-tight
text-gray-900
"
        >
          Reports on Properties
        </h1>

        <p
          className="
mt-3
text-lg
text-gray-500
"
        >
          Manage and review user-submitted issue reports across all active
          listings.
        </p>
      </div>

      {/* SEARCH + BUTTONS */}

      <div
        className="
mb-8
flex
flex-col
gap-5

rounded-3xl
border
border-gray-200
bg-white
p-7
shadow-sm

lg:flex-row
lg:items-center
lg:justify-between
"
      >
        <div
          className="
relative
w-full
lg:w-113
"
        >
          <span
            className="
absolute
left-5
top-1/2
-translate-y-1/2
text-2xl
text-gray-400
"
          >
            ⌕
          </span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="
Search property, location, issue...
"
            className="
w-full
rounded-2xl
border
border-gray-200
bg-gray-50
px-5
py-4
pl-14
text-base
text-gray-800
outline-none

transition

focus:border-blue-500
focus:bg-white
focus:ring-4
focus:ring-blue-100

"
          />
        </div>

        <div
          className="
flex
gap-4
"
        >
          <button
            className="
rounded-xl
border
border-gray-200
bg-white
px-7
py-3
text-base
font-semibold
text-gray-700

hover:bg-gray-50
transition
"
          >
            Filter
          </button>

          <button
            className="
rounded-xl
bg-blue-600
px-7
py-3
text-base
font-semibold
text-white

hover:bg-blue-700
transition
"
          >
            Export
          </button>
        </div>
      </div>

      {/* TABLE */}

      <div
        className="
overflow-hidden
rounded-3xl
border
border-gray-200
bg-white
shadow-lg
"
      >
        <div className="overflow-x-auto">
          <table
            className="
w-full
min-w-275
"
          >
            <thead>
              <tr
                className="
bg-gray-50
border-b
border-gray-200
"
              >
                <th className="px-8 py-5 text-left text-sm uppercase text-gray-500">
                  Property
                </th>

                <th className="px-8 py-5 text-left text-sm uppercase text-gray-500">
                  Location
                </th>

                <th className="px-8 py-5 text-left text-sm uppercase text-gray-500">
                  Issue
                </th>

                <th className="px-8 py-5 text-left text-sm uppercase text-gray-500">
                  Status
                </th>

                <th className="px-8 py-5 text-left text-sm uppercase text-gray-500">
                  Date
                </th>

                <th className="px-8 py-5 text-right text-sm uppercase text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.map((report, index) => (
                <tr
                  key={index}
                  className="
border-b
border-gray-100
hover:bg-blue-50/40
transition
"
                >
                  <td className="px-8 py-6">
                    <div
                      className="
flex
items-center
gap-5
"
                    >
                      <img
                        src={report.image}
                        className="
h-16
w-16
rounded-2xl
object-cover
shadow-md
"
                      />

                      <div>
                        <p
                          className="
text-base
font-bold
text-gray-900
"
                        >
                          {report.property}
                        </p>

                        <p
                          className="
text-sm
text-gray-500
mt-1
"
                        >
                          Property Report
                        </p>
                      </div>
                    </div>
                  </td>

                  <td
                    className="
px-8
py-6
text-base
text-gray-600
"
                  >
                    {report.location}
                  </td>

                  <td
                    className="
px-8
py-6
text-base
text-gray-700
"
                  >
                    {report.issue}
                  </td>

                  <td className="px-8 py-6">
                    <StatusBadge status={report.status} />
                  </td>

                  <td
                    className="
px-8
py-6
text-base
text-gray-500
"
                  >
                    {report.date}
                  </td>

                  <td
                    className="
px-8
py-6
text-right
"
                  >
                    <button
                      onClick={() =>
                        navigate(`/admin/reports/properties/${index}`)
                      }
                      className="
rounded-xl
bg-blue-50
px-5
py-2.5
text-sm
font-semibold
text-blue-600

hover:bg-blue-100
transition
"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}

        <div
          className="
flex
items-center
justify-between
bg-gray-50
px-8
py-5
"
        >
          <p
            className="
text-base
text-gray-500
"
          >
            Showing {filteredReports.length} of 45 entries
          </p>

          <div className="flex gap-3">
            <button
              className="
h-10
w-10
rounded-xl
bg-blue-600
font-semibold
text-white
"
            >
              1
            </button>

            <button
              className="
h-10
w-10
rounded-xl
border
bg-white
font-semibold
"
            >
              2
            </button>

            <button
              className="
h-10
w-10
rounded-xl
border
bg-white
font-semibold
"
            >
              3
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PropertyReports;
