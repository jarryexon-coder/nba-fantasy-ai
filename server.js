const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'dist' directory (Expo web output)
// OR from the current directory if you haven't built yet
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes by sending the main HTML file (for Single Page Apps)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend server listening on port ${port}`);
});
