import apiClient from "./axiosClient";

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "") {
      return;
    }

    if (Array.isArray(value) && value.length > 0) {
      query.append(key, value.join(","));
      return;
    }

    query.append(key, value);
  });

  return query.toString();
};

// --- AUTH & USER ENDPOINTS ---
export const getAuthUser = () => apiClient.get("/auth/me");
export const logoutUser = () => apiClient.post("/auth/logout");
export const toggleHostMode = () => apiClient.patch("/users/toggle-host-mode");
export const registerUser = (userData) =>
  apiClient.post("/auth/register", userData);
export const loginUser = (credentials) =>
  apiClient.post("/auth/login", credentials);

// --- NOTIFICATION ENDPOINTS ---
export const getNotifications = () => apiClient.get("/notifications");

// --- EXISTING ADMIN & PROPERTY ENDPOINTS ---
export const getAdminHosts = () => apiClient.get("/admin/hosts");
export const getAdminProperties = () => apiClient.get("/admin/properties");
export const deleteAdminProperty = (propertyId) =>
  apiClient.delete(`/admin/properties/${propertyId}`);
export const getAdminUsers = () => apiClient.get("/admin/users");
export const banAdminUser = (userId) =>
  apiClient.patch(`/admin/users/${userId}/ban`);
export const getHostVerifications = () =>
  apiClient.get("/admin/host-verifications");
export const approveHostVerification = (verificationId) =>
  apiClient.put(`/admin/host-verifications/${verificationId}/approve`, {});
export const rejectHostVerification = (verificationId, reason) =>
  apiClient.put(`/admin/host-verifications/${verificationId}/reject`, {
    rejectionReason: reason,
  });
export const getProperties = (params = {}) =>
  apiClient.get(`/properties?${buildQueryString(params)}`);
export const getUserBookings = () => apiClient.get(`/user/bookings`);
export const getUserWishlist = () => apiClient.get(`/user/wishlist`);
export const addToWishlist = (propertyId) =>
  apiClient.post(`/user/wishlist`, { property_id: propertyId });
export const removeFromWishlist = (propertyId) =>
  apiClient.delete(`/user/wishlist/${propertyId}`);
export const updateUserProfile = (data) =>
  apiClient.patch(`/user/profile`, data);
export const changeUserPassword = (data) =>
  apiClient.post(`/user/change-password`, data);
export const uploadUserAvatar = (formData) =>
  apiClient.post(`/user/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getPropertyById = (propertyId) =>
  apiClient.get(`/properties/${propertyId}`);
export const submitReport = (formData) =>
  apiClient.post("/reports", formData, {
    headers: { Accept: "application/json" },
  });
export const getConversations = (userId) =>
  apiClient.get(`/conversations/user/${userId}`);
export const getMessages = (conversationId) =>
  apiClient.get(`/conversations/${conversationId}/messages`);
export const markConversationRead = (conversationId, readerId) =>
  apiClient.put(`/conversations/${conversationId}/read`, {
    reader_id: readerId,
  });
export const sendMessage = (conversationId, message) =>
  apiClient.post(`/conversations/${conversationId}/messages`, message);
export const updateHostPayment = (paymentData) =>
  apiClient.put("/host/payment", paymentData);

// --- HOST VERIFICATION ENDPOINTS ---
export const submitHostVerification = (formData) =>
  apiClient.post("/host/verification", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getHostVerificationStatus = () =>
  apiClient.get("/host/verification/status");

// --- HOST DASHBOARD ---
export const getHostDashboard = () => apiClient.get(`/host/dashboard`);

// --- HOST LISTINGS ---
export const getHostListings = () => apiClient.get(`/host/listings`);

// --- HOST PROFILE ---
export const getHostProfile = () => apiClient.get(`/host/profile`);

// --- HOST BOOKINGS ---
export const getHostBookings = () => apiClient.get(`/host/bookings`);
