import jwt from "jsonwebtoken";
import { getAdminConfig } from "../config/admin.js";

const protectAdmin = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    res.status(401);
    next(new Error("Admin authentication required."));
    return;
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const { admin, jwtSecret } = getAdminConfig();
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.role !== "admin" || decoded.email !== admin.email) {
      res.status(401);
      next(new Error("Invalid admin session."));
      return;
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Invalid or expired admin token."));
  }
};

export { protectAdmin };
