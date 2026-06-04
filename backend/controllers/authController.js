import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";
import { getAdminConfig, getAdminProfile, validateAdminCredentials } from "../config/admin.js";

const buildAdminToken = () => {
  const { admin, jwtSecret, jwtExpiresIn } = getAdminConfig();

  return jwt.sign(
    {
      email: admin.email,
      role: "admin"
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

const loginAdmin = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim();
  const password = req.body.password || "";

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  if (!validateAdminCredentials({ email, password })) {
    res.status(401);
    throw new Error("Invalid admin credentials.");
  }

  res.json({
    token: buildAdminToken(),
    admin: getAdminProfile()
  });
});

const getCurrentAdmin = asyncHandler(async (_req, res) => {
  res.json({
    admin: getAdminProfile()
  });
});

export { loginAdmin, getCurrentAdmin };
