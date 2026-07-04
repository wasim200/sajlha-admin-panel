"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext(null);

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sajlha_admin_pwd");
    if (saved) {
      setPassword(saved);
      setIsAuthenticated(true);
    }
  }, []);

  const getAuthHeader = () => {
    return password || localStorage.getItem("sajlha_admin_pwd") || "";
  };

  const apiFetch = async (url, options = {}) => {
    const auth = getAuthHeader();
    const headers = { ...options.headers, Authorization: auth };
    return fetch(url, { ...options, headers });
  };

  return (
    <AdminContext.Provider value={{ password, setPassword, isAuthenticated, setIsAuthenticated, apiFetch, getAuthHeader, mounted }}>
      {children}
    </AdminContext.Provider>
  );
}
