const { Pool } = require('pg');
const Redis = require('redis');
require('dotenv').config();

// PostgreSQL Configuration
const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD || undefined,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
});

// Redis Configuration
const redisClient = Redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD || undefined
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.connect();

// Initialize database tables
async function initializeDatabase() {
    try {
        // Check if table exists
        const tableExists = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'cartoons'
            );
        `);

        if (!tableExists.rows[0].exists) {
            await pool.query(`
                CREATE TABLE cartoons (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    image_url TEXT,
                    votes INTEGER DEFAULT 0
                )
            `);

            // Insert sample data
            await pool.query(`
                INSERT INTO cartoons (name, image_url, votes)
                VALUES 
                    ('Tom and Jerry', 'https://rukminim2.flixcart.com/image/850/1000/xif0q/action-figure/e/8/s/5-set-of-6-tom-and-jerry-action-figure-or-cake-topper-showpiece-original-imagg9ejgjcmgd9g.jpeg?q=90&crop=false', 0),
                    ('Mickey Mouse', 'https://image.api.playstation.com/vulcan/ap/rnd/202212/1616/ebKSYAneFeVLHD7SAWP1l5TE.png', 0),
                    ('Donald Duck', 'https://image.api.playstation.com/vulcan/img/rnd/202104/2308/e5A3zrfqnkwSN7BzIQZ73F8O.png', 0)
            `);
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        // Don't throw the error, let the application continue
    }
}

module.exports = {
    pool,
    redisClient,
    initializeDatabase
}; 