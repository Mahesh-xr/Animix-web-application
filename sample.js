import express from 'express';
import Jikan from '@mateoaranda/jikanjs';

const app = express();
const PORT = 3000;

// Route to fetch top anime
app.get('/', async (req, res) => {
  const page = 1; // Default page is 1
  const limit = 10; // Default limit is 10

  try {
    // Fetch top anime using Jikan.js
    const results = await Jikan.get('top', 'anime', {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    // Send the results as a JSON response
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching top anime:', error.message);
    res.status(500).json({ error: 'Failed to fetch top anime' });
  }
});

// Start the Express.js server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
