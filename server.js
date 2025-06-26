const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the project root (html, js, css, images, markdown files)
app.use(express.static(path.join(__dirname)));

// For any other routes, serve index.html (optional, useful for SPA or URL parameters)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
