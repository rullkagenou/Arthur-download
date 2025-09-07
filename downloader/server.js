import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

// Biar bisa akses frontend
app.use(express.static("public"));

// Proxy download
app.get("/download", async (req, res) => {
  const fileUrl = req.query.url;
  const filename = req.query.filename || "media";

  if (!fileUrl) return res.status(400).send("URL tidak ada!");

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Gagal fetch file!");

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    response.body.pipe(res);
  } catch (e) {
    console.error(e);
    res.status(500).send("Gagal mengambil file!");
  }
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});