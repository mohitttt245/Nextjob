import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentAdmin, loginAdmin as loginAdminRequest } from "../services/authService";
import {
  clearAuthSession,
  getAuthToken,
  getStoredAdmin,
  persistAuthSession
} from "../utils/authStorage";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(getStoredAdmin);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const restoreAdminSession = async () => {
      const token = getAuthToken();

      if (!token) {
        clearAuthSession();
        setAdmin(null);
        setInitializing(false);
        return;
      }

      try {
        const { admin: currentAdmin } = await getCurrentAdmin();
        persistAuthSession({ token, admin: currentAdmin });
        setAdmin(currentAdmin);
      } catch (_error) {
        clearAuthSession();
        setAdmin(null);
      } finally {
        setInitializing(false);
      }
    };

    restoreAdminSession();
  }, []);

  const login = async (credentials) => {
    const data = await loginAdminRequest(credentials);
    persistAuthSession(data);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    clearAuthSession();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        initializing,
        isAuthenticated: Boolean(admin && getAuthToken()),
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};

export { AuthProvider, useAuth };
