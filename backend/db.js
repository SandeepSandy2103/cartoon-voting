const { Pool } = require('pg');
const Redis = require('ioredis');
require('dotenv').config();

// PostgreSQL Connection Pool
const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'postgres', 
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'voting',
    port: 5432,
});

// Redis Client
const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
});

// Test database connection
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('PostgreSQL connection successful');
        client.release();
    } catch (error) {
        console.error('PostgreSQL connection error:', error);
    }
}

// Test Redis connection
async function testRedisConnection() {
    try {
        await redisClient.ping();
        console.log('Redis connection successful');
    } catch (error) {
        console.error('Redis connection error:', error);
    }
}

// Initialize database tables
async function initializeDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cartoons (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                votes INTEGER DEFAULT 0,
                image_url TEXT
            )
        `);

        // Insert sample data if table is empty
        const result = await pool.query('SELECT COUNT(*) FROM cartoons');
        if (result.rows[0].count === '0') {
            await pool.query(`
                INSERT INTO cartoons (name, image_url) VALUES
                ('Tom and Jerry', 'https://rukminim2.flixcart.com/image/850/1000/xif0q/action-figure/e/8/s/5-set-of-6-tom-and-jerry-action-figure-or-cake-topper-showpiece-original-imagg9ejgjcmgd9g.jpeg?q=90&crop=false'),
                ('Spider-Man', 'https://image.api.playstation.com/vulcan/ap/rnd/202212/1616/ebKSYAneFeVLHD7SAWP1l5TE.png'),
                ('Mario', 'https://image.api.playstation.com/vulcan/img/rnd/202104/2308/e5A3zrfqnkwSN7BzIQZ73F8O.png')
            `);
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Export the database connections and functions
module.exports = {
    pool,
    redisClient,
    testConnection,
    testRedisConnection,
    initializeDatabase
}; 
