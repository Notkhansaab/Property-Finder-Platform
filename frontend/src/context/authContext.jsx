import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuthUser, logoutUser as logoutApi } from "../axios/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch session on initial load
  const checkAuth = async () => {
    try {
      // getAuthUser() returns backend JSON: { success: true, data: { id, fullName, ... } }
      const res = await getAuthUser();

      // Extract user directly from res.data
      if (res?.success && res?.data?.id) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, checkAuth, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
