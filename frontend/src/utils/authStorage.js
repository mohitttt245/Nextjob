const tokenKey = "nextjob-admin-token";
const adminKey = "nextjob-admin-profile";

const getAuthToken = () => window.localStorage.getItem(tokenKey) || "";

const getStoredAdmin = () => {
  const raw = window.localStorage.getItem(adminKey);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
};

const persistAuthSession = ({ token, admin }) => {
  window.localStorage.setItem(tokenKey, token);
  window.localStorage.setItem(adminKey, JSON.stringify(admin));
};

const clearAuthSession = () => {
  window.localStorage.removeItem(tokenKey);
  window.localStorage.removeItem(adminKey);
};

export { getAuthToken, getStoredAdmin, persistAuthSession, clearAuthSession };
