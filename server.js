import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/img", async (req, res) => {
  const url = req.query.url;

  if (!url) return res.status(400).send("Missing url");

  try {
    const response = await fetch(url);

    const contentType = response.headers.get("content-type");

    const buffer = Buffer.from(await response.arrayBuffer());

   
    res.set("Content-Type", contentType || "application/octet-stream");
    res.set("Cache-Control", "no-store");

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Fetch failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));