import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/img", async (req, res) => {
  const url = req.query.url;

  if (!url) return res.status(400).send("Missing url");

  try {
    // 🔥 cache-bust BOTH upstream + proxy layer
    const response = await fetch(url + `?t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Cache-Control": "no-cache"
      }
    });

    const contentType = response.headers.get("content-type");
    const buffer = Buffer.from(await response.arrayBuffer());

    // 🔥 IMPORTANT: anti-cache headers (must be BEFORE send)
    res.set("Content-Type", contentType || "application/octet-stream");
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.set("Surrogate-Control", "no-store");

    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).send("Fetch failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));