import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropertyGallery from "./PropertyGallery";
import PropertyInfo from "./PropertyInfo";
import BookingCard from "./BookingCard";
import ReportModal from "../ReportModal";
import {
  getPropertyById,
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../axios/api";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const PropertyDetails = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getPropertyById(id);
        const result = response?.data || response;

        if (result?.success && result?.data) {
          setProperty(result.data);
        } else if (result?.id || result?.title) {
          setProperty(result);
        } else {
          setProperty(null);
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Unable to load property details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const checkSaved = async () => {
      if (!user) {
        setSaved(false);
        return;
      }

      try {
        const res = await getUserWishlist();
        if (res?.success && Array.isArray(res.data)) {
          setSaved(res.data.some((p) => String(p.id) === String(id)));
        }
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }

    checkSaved();
  }, [id, user]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading property details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {error ? "Error" : "Property Not Found"}
          </h1>
          <p className="text-gray-500 mt-2">
            {error || "The property you are looking for does not exist."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              {property.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-3">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                {property.rating || "New"}
                {property.reviews ? (
                  <span>({property.reviews} reviews)</span>
                ) : null}
              </span>

              <span>
                📍{" "}
                {property.location ||
                  property.address ||
                  "Location unavailable"}
              </span>
              {property.type && (
                <span className="capitalize px-2 py-0.5 bg-gray-100 rounded text-xs font-semibold">
                  {property.type}
                </span>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: property.title,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              ↗ Share
            </button>

            <button
              onClick={async () => {
                if (!user) return navigate("/signin");
                try {
                  if (!saved) {
                    const res = await addToWishlist(property.id);
                    if (res.success) setSaved(true);
                  } else {
                    const res = await removeFromWishlist(property.id);
                    if (res.success) setSaved(false);
                  }
                } catch (err) {
                  alert("Failed to update wishlist");
                }
              }}
              className={`px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition ${
                saved
                  ? "bg-red-50 border-red-400 text-red-600"
                  : "border-gray-300"
              }`}
            >
              {saved ? "♥ Saved" : "♡ Save"}
            </button>

            <button
              onClick={async () => {
                // Start or open conversation with host
                if (!user) return navigate("/signin");
                try {
                  const hostId =
                    property.host_id || property.host?.id || property.hostId;
                  const guestId = user.id;
                  if (!hostId) {
                    alert("Host information unavailable.");
                    return;
                  }
                  const resp = await fetch(`/api/conversations`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                      host_id: hostId,
                      guest_id: guestId,
                      property_id: property.id,
                    }),
                  }).then((r) => r.json());

                  if (resp.success && resp.data) {
                    // navigate to messages page and request to open the created conversation
                    navigate("/userdashboard/messages", {
                      state: {
                        openConversationId:
                          resp.data.id ||
                          resp.data.conversation_id ||
                          resp.data.conversationId,
                      },
                    });
                  } else {
                    alert(resp.message || "Failed to start conversation");
                  }
                } catch (err) {
                  console.error(err);
                  alert("Failed to start conversation");
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              ✉ Message Host
            </button>

            <button
              onClick={() => setReportOpen(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              ⚑ Report
            </button>
          </div>
        </div>

        {/* GALLERY */}
        <PropertyGallery images={property.images || []} />

        {/* CONTENT */}
        <div className="flex flex-col lg:flex-row gap-10 mt-10 items-start">
          <div className="flex-1 min-w-0 w-full">
            <PropertyInfo property={property} />
          </div>

          <aside className="w-full lg:w-96 lg:ml-auto shrink-0">
            <BookingCard property={property} />
          </aside>
        </div>
      </main>
      <ReportModal
        property={property}
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        currentUserId={user?.id}
      />
    </>
  );
};

export default PropertyDetails;
