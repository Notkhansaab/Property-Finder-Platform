import React, { useState } from "react";
import { FiArrowLeft, FiDownload, FiEye, FiCopy } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function HostDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [showBan, setShowBan] = useState(false);

  const host = {
    id: id || "HST-98234",
    name: "Sarah J. Thompson",
    email: "sarah.t@example.com",
    phone: "+1 (555) 123-4567",
    joined: "Oct 12, 2023",
    properties: 2,
    status: "Pending Review",
    avatar: "https://i.pravatar.cc/300?img=47",
    document: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-[#faf8ff] px-10 py-8">
      {/* Header */}

      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#434654] hover:text-[#003fb1] mb-5 text-sm"
        >
          <FiArrowLeft />
          Back to Hosts
        </button>

        <div className="flex items-center gap-4">
          <h1 className="text-[32px] font-semibold text-[#191b23]">
            Host Documentation: {host.name}
          </h1>

          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
            {host.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT SIDE */}

        <div className="space-y-6">
          {/* Profile Card */}

          <div className="bg-white rounded-xl border border-[#c3c5d7] p-6 text-center shadow-sm">
            <img
              src={host.avatar}
              className="w-24 h-24 rounded-full mx-auto object-cover mb-4"
            />

            <h2 className="text-xl font-semibold text-[#191b23]">
              {host.name}
            </h2>

            <p className="text-sm text-[#737686] mt-1">Joined {host.joined}</p>

            <div className="mt-5 border-t border-[#e2e1ed] pt-4 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[#737686]">Host ID</span>

                <b>{host.id}</b>
              </div>

              <div className="flex justify-between">
                <span className="text-[#737686]">Properties</span>

                <b>{host.properties} Active</b>
              </div>
            </div>
          </div>

          {/* Personal Details */}

          <div className="bg-white rounded-xl border border-[#c3c5d7] p-6">
            <h3 className="text-xl font-semibold mb-5">Personal Details</h3>

            <div className="space-y-5">
              <div>
                <p className="text-xs text-[#737686] mb-2">Email Address</p>

                <div className="bg-[#f3f3fe] rounded-lg px-4 py-3 flex justify-between">
                  {host.email}

                  <FiCopy className="text-[#003fb1]" />
                </div>
              </div>

              <div>
                <p className="text-xs text-[#737686] mb-2">Phone Number</p>

                <div className="bg-[#f3f3fe] rounded-lg px-4 py-3">
                  {host.phone}
                </div>
              </div>

              <div>
                <p className="text-xs text-[#737686] mb-2">Government ID</p>

                <div className="bg-[#f3f3fe] rounded-lg px-4 py-3">
                  EMP-09482
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="col-span-2 space-y-6">
          {/* Documents */}

          <div className="bg-white rounded-xl border border-[#c3c5d7] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Verification Documents</h2>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-[#c3c5d7] rounded-lg hover:bg-[#f3f3fe]">
                  <FiEye />
                  Preview
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-[#003fb1] text-white rounded-lg">
                  <FiDownload />
                  Download All
                </button>
              </div>
            </div>

            <div className="bg-[#f3f3fe] rounded-xl p-5 border border-[#c3c5d7]">
              <div className="mb-4">
                <h4 className="font-semibold">
                  Identity & Address Verification
                </h4>

                <p className="text-sm text-[#737686]">
                  Uploaded on Oct 15, 2023
                </p>
              </div>

              <img
                src={host.document}
                className="w-full h-[350px] object-cover rounded-lg border border-[#c3c5d7]"
              />
            </div>
          </div>

          {/* Decision */}

          <div className="bg-white rounded-xl border border-[#c3c5d7] p-6">
            <h2 className="text-xl font-semibold mb-5">
              Verification Decision
            </h2>

            <textarea
              placeholder="Enter reason for rejection or approval notes..."
              className="w-full h-28 rounded-lg border border-[#c3c5d7] p-4 resize-none focus:ring-2 focus:ring-[#003fb1]"
            />

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setShowBan(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Ban Host Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBan && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-[420px] shadow-xl">
            <h2 className="text-xl font-semibold mb-3">Ban Host?</h2>

            <p className="text-[#737686] mb-6">
              This will permanently restrict {host.name} from accessing host
              features.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBan(false)}
                className="px-5 py-2 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button className="px-5 py-2 bg-red-600 text-white rounded-lg">
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
