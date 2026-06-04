import { timingSafeEqual } from "crypto";

const getAdminProfile = () => ({
  email: process.env.ADMIN_EMAIL?.trim() || "",
  name: process.env.ADMIN_NAME?.trim() || "NextJob Admin"
});

const getAdminConfig = () => {
  const adminProfile = getAdminProfile();
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const jwtSecret = process.env.JWT_SECRET || "";

  if (!adminProfile.email || !adminPassword || !jwtSecret) {
    throw new Error(
      "Admin authentication is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and JWT_SECRET in backend/.env."
    );
  }

  return {
    admin: adminProfile,
    adminPassword,
    jwtSecret,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "12h"
  };
};

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

const validateAdminCredentials = ({ email, password }) => {
  const { admin, adminPassword } = getAdminConfig();

  return (
    safeEqual(String(email || "").trim().toLowerCase(), admin.email.toLowerCase()) &&
    safeEqual(password || "", adminPassword)
  );
};

export { getAdminConfig, getAdminProfile, validateAdminCredentials };
