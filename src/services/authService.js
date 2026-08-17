const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../logs/application.log');

function writeLog(level, service, message) {
    const timestamp = '2024-11-18 08:34:22';

    const line =
        `${timestamp} ${level} ${service} - ${message}\n`;

    fs.appendFileSync(logFile, line);
}

async function login(username, password) {
    try {

        // Simulación de la incidencia reportada:
        // el módulo actualizado presenta un timeout
        // durante la consulta de usuarios.

        if (username === 'jgarcia') {

            await new Promise(resolve => setTimeout(resolve, 7000));

            writeLog(
                'ERROR',
                'DBConnection',
                'Timeout while querying table "users"'
            );

            throw new Error('Database query timeout');
        }

        const result = await pool.query(
            `SELECT * FROM users
             WHERE username = $1
             AND active = TRUE`,
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

    } catch (error) {

        writeLog(
            'ERROR',
            'AuthService',
            'Error validating user token'
        );

        throw error;
    }
}

module.exports = {
    login
};