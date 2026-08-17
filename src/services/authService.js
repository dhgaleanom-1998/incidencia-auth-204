const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

async function login(username, password) {
    const result = await pool.query(
        'SELECT * FROM users WHERE username = $1 AND active = TRUE',
        [username]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const user = result.rows[0];

    const passwordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordValid) {
        return null;
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            full_name: user.full_name
        }
    };
}

module.exports = {
    login
};