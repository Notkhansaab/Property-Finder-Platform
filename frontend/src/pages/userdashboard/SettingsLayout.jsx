import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  updateUserProfile,
  changeUserPassword,
  uploadUserAvatar,
} from "../../axios/api";

const Settings = () => {
  const { user, setUser } = useAuth();
  const avatar =
    user?.avatar ||
    user?.avatar_url ||
    `https://i.pravatar.cc/200?u=${user?.id || "anon"}`;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (user) {
      // Split full name if available
      const full = user.fullName || user.name || user.full_name || "";
      const parts = full.trim().split(" ");
      setFirstName(parts.slice(0, -1).join(" ") || parts[0] || "");
      setLastName(parts.length > 1 ? parts[parts.length - 1] : "");

      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const res = await updateUserProfile({ fullName, email, phone });
      if (res.success) {
        setUser(res.data);
        setMessage({ type: "success", text: "Profile updated." });
      } else {
        setMessage({ type: "error", text: res.message || "Failed to update." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Server error" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await changeUserPassword({ currentPassword, newPassword });
      if (res.success) {
        setMessage({
          type: "success",
          text: res.message || "Password changed.",
        });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setMessage({
          type: "error",
          text: res.message || "Failed to change password.",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Server error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">
        User Settings
      </h1>

      <div
        className="
        bg-white rounded-xl shadow-sm
        border border-gray-200
        p-8 space-y-8
      "
      >
        {/* Profile Picture */}
        <section
          className="
          flex flex-col md:flex-row
          items-center gap-6
          pb-6 border-b border-gray-200
        "
        >
          <div className="relative group cursor-pointer">
            <img
              src={avatar}
              alt="Profile"
              className="
                w-24 h-24 rounded-full
                object-cover border-4
                border-white shadow
              "
            />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="hidden"
            />

            <div
              className="
              absolute inset-0
              rounded-full
              bg-black/40
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition
            "
            >
              <span className="material-symbols-outlined text-white">
                photo_camera
              </span>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-xl font-semibold text-gray-900">
              Profile Picture
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Upload a new avatar. Recommended size: 256x256px.
            </p>

            <div className="flex gap-3 mt-4 justify-center md:justify-start">
              <button
                className="
                bg-blue-700 text-white
                px-5 py-2 rounded-lg
                text-sm font-medium
                hover:bg-blue-800
              "
                onClick={() => document.getElementById("avatar-upload").click()}
              >
                Choose
              </button>

              <button
                className="
                bg-blue-700 text-white
                px-5 py-2 rounded-lg
                text-sm font-medium
                hover:bg-blue-800
              "
                onClick={async () => {
                  if (!avatarFile) {
                    setMessage({
                      type: "error",
                      text: "Select an image first.",
                    });
                    return;
                  }

                  setSaving(true);
                  setMessage(null);
                  try {
                    const fd = new FormData();
                    fd.append("avatar", avatarFile);
                    const res = await uploadUserAvatar(fd);
                    if (res.success) {
                      setUser(res.data);
                      setMessage({ type: "success", text: "Avatar updated." });
                    } else {
                      setMessage({
                        type: "error",
                        text: res.message || "Upload failed.",
                      });
                    }
                  } catch (err) {
                    setMessage({
                      type: "error",
                      text: err?.message || "Server error",
                    });
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {saving ? "Uploading..." : "Upload"}
              </button>

              <button
                className="
                border border-gray-300
                px-5 py-2 rounded-lg
                text-sm font-medium
                text-gray-600
                hover:bg-gray-50
              "
              >
                Remove
              </button>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section>
          <h2
            className="
            text-xl font-semibold
            text-gray-900 mb-5
          "
          >
            Personal Information
          </h2>

          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
              />
            </div>
          </div>
        </section>

        {/* Security */}
        <section
          className="
          pt-6 border-t border-gray-200
        "
        >
          <h2
            className="
            text-xl font-semibold
            text-gray-900 mb-5
          "
          >
            Security
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
              />
            </div>
            {message && (
              <p
                className={`text-sm ${message.type === "error" ? "text-red-600" : "text-green-600"}`}
              >
                {message.text}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              className="bg-blue-700 text-white px-7 py-3 rounded-lg font-medium hover:bg-blue-800 transition"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="border border-gray-300 px-7 py-3 rounded-lg font-medium hover:bg-gray-50"
              onClick={handleChangePassword}
              disabled={saving}
            >
              {saving ? "Working..." : "Change Password"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const Input = ({ label, value, type = "text", placeholder }) => {
  return (
    <div>
      <label
        className="
        block text-sm
        font-medium
        text-gray-700
        mb-2
      "
      >
        {label}
      </label>

      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className="
          w-full
          px-4 py-3
          rounded-lg
          border border-gray-300
          bg-gray-50
          focus:outline-none
          focus:ring-2
          focus:ring-blue-700
          focus:border-blue-700
        "
      />
    </div>
  );
};

export default Settings;
