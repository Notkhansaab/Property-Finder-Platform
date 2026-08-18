import React, { useEffect, useState } from "react";
import { FiX, FiUploadCloud, FiFlag, FiLoader } from "react-icons/fi";
import { submitReport } from "../axios/api";

const ReportModal = ({ property, isOpen, onClose, currentUserId = null }) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !isSubmitting) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, isSubmitting]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    setSubject("");
    setDescription("");
    setFiles([]);
    setErrorMessage("");
    onClose();
  };

  const handleFiles = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!subject) {
      setErrorMessage("Please select an issue type.");
      return;
    }

    if (description.trim().length < 50) {
      setErrorMessage(
        "Please provide at least 50 characters in the description.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("property_id", property?.id);
      formData.append("issue_type", subject);
      formData.append("description", description);
      if (currentUserId) {
        formData.append("reporter_id", currentUserId);
      }

      files.forEach((file) => {
        formData.append("files", file);
      });

      const data = await submitReport(formData);

      if (!data.success) {
        throw new Error(data.message || "Failed to submit report.");
      }

      alert("Thank you. Your report has been submitted for review.");
      handleClose();
    } catch (err) {
      setErrorMessage(
        err.message || "An error occurred while submitting the report.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-50 rounded-2xl shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-50 px-6 md:px-8 pt-6 pb-4 border-b border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close report modal"
            className="absolute right-5 top-5 p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition disabled:opacity-50"
          >
            <FiX size={22} />
          </button>

          <div className="pr-10">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
              Report this listing
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              Please provide details about the issue. Your report will be
              reviewed by our trust and safety team.
            </p>
          </div>
        </div>

        <div className="px-6 md:px-8 py-6">
          {/* Selected Property */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Listing you're reporting
            </p>
            <h3 className="text-base font-semibold text-gray-900">
              {property?.title || "Property Listing"}
            </h3>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200"
          >
            {/* Subject / Issue Type */}
            <div>
              <label
                htmlFor="report-subject"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Issue Type
              </label>

              <select
                id="report-subject"
                name="report-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-base text-gray-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700 bg-white outline-none"
              >
                <option value="" disabled>
                  Select an issue type...
                </option>
                <option value="scam">Suspected scam or fraud</option>
                <option value="inaccurate">Inaccurate listing details</option>
                <option value="unavailable">
                  Property is no longer available
                </option>
                <option value="offensive">
                  Offensive or inappropriate content
                </option>
                <option value="other">Other issue</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="report-description"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Detailed Description
              </label>

              <textarea
                id="report-description"
                name="report-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                placeholder="Please describe the issue in detail..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-700 focus:border-blue-700 bg-white resize-none outline-none"
              />

              <p className="text-xs text-gray-500 mt-2">
                Minimum 50 characters. ({description.length}/50)
              </p>
            </div>

            {/* Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Add evidence / images (Optional)
              </label>

              <label
                htmlFor="report-file-upload"
                className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-6 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
              >
                <div className="text-center">
                  <FiUploadCloud
                    size={32}
                    className="text-gray-400 mx-auto mb-2"
                  />
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-700">
                      Upload files
                    </span>{" "}
                    or drag and drop
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>

                <input
                  id="report-file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isSubmitting}
                  onChange={handleFiles}
                  className="sr-only"
                />
              </label>

              {files.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  {files.length} file{files.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 justify-end border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-3 text-gray-600 font-medium text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiFlag size={18} />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
