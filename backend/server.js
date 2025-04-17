const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { pool, redisClient, initializeDatabase } = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample images for fallback
const sampleImages = [
    "https://rukminim2.flixcart.com/image/850/1000/xif0q/action-figure/e/8/s/5-set-of-6-tom-and-jerry-action-figure-or-cake-topper-showpiece-original-imagg9ejgjcmgd9g.jpeg?q=90&crop=false",
    "https://image.api.playstation.com/vulcan/ap/rnd/202212/1616/ebKSYAneFeVLHD7SAWP1l5TE.png",
    "https://image.api.playstation.com/vulcan/img/rnd/202104/2308/e5A3zrfqnkwSN7BzIQZ73F8O.png",
];

// Initialize database
initializeDatabase();

// Get all cartoons with Redis caching
app.get('/cartoons', async (req, res) => {
    try {
        // Try to get from Redis cache first
        const cachedCartoons = await redisClient.get('cartoons');
        if (cachedCartoons) {
            return res.json(JSON.parse(cachedCartoons));
        }

        // If not in cache, get from database
        const result = await pool.query('SELECT * FROM cartoons');
        const cartoons = result.rows;

        // Add sample images if 'image_url' is missing
        const cartoonsWithImages = cartoons.map((cartoon, index) => ({
            ...cartoon,
            image_url: cartoon.image_url || sampleImages[index % sampleImages.length]
        }));

        // Cache the result in Redis for 1 minute
        await redisClient.set('cartoons', JSON.stringify(cartoonsWithImages), 'EX', 60);

        res.json(cartoonsWithImages);
    } catch (error) {
        console.error('Error fetching cartoons:', error);
        res.status(500).json({ error: 'Failed to fetch cartoons' });
    }
});

// Vote for a cartoon
app.post('/vote', async (req, res) => {
    try {
        const { id } = req.body;
        
        // Update vote count in database
        await pool.query(
            'UPDATE cartoons SET votes = votes + 1 WHERE id = $1',
            [id]
        );

        // Invalidate Redis cache
        await redisClient.del('cartoons');
        await redisClient.del('results');

        res.json({ success: true });
    } catch (error) {
        console.error('Error voting:', error);
        res.status(500).json({ error: 'Failed to submit vote' });
    }
});

// Get voting results with Redis caching
app.get('/results', async (req, res) => {
    try {
        // Try to get from Redis cache first
        const cachedResults = await redisClient.get('results');
        if (cachedResults) {
            return res.json(JSON.parse(cachedResults));
        }

        // If not in cache, calculate results
        const result = await pool.query('SELECT * FROM cartoons');
        const cartoons = result.rows;
        
        const totalVotes = cartoons.reduce((sum, cartoon) => sum + cartoon.votes, 0);
        
        const results = cartoons.map(cartoon => ({
            id: cartoon.id,
            name: cartoon.name,
            percentage: totalVotes > 0 ? ((cartoon.votes / totalVotes) * 100).toFixed(1) : 0
        }));

        // Cache the results in Redis for 5 seconds
        await redisClient.set('results', JSON.stringify(results), 'EX', 5);

        res.json(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
}); 