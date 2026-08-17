const express = require('express');
const pool = require('./src/config/database');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.status(200).json({
            status: 'OK',
            database: 'connected',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        console.error('Database connection error:', error.message);

        res.status(500).json({
            status: 'ERROR',
            database: 'disconnected'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});