import express from "express";
import https from "https";
import http from "http";

const router = express.Router();

router.get("/download", async (req, res) => {
  const { url, filename } = req.query;

  if (!url || !url.includes("cloudinary.com")) {
    return res.status(400).json({ message: "Invalid URL." });
  }

  const protocol = url.startsWith("https") ? https : http;

  protocol.get(url, (fileRes) => {
    // Check if Cloudinary returned an error page
    const contentType = fileRes.headers["content-type"] || "";
    if (contentType.includes("text/html")) {
      return res.status(500).json({ message: "File not accessible on Cloudinary." });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${filename || "template.pdf"}"`);
    res.setHeader("Content-Type", "application/pdf");
    fileRes.pipe(res);
  }).on("error", () => {
    res.status(500).json({ message: "Failed to download file." });
  });
});

export default router;