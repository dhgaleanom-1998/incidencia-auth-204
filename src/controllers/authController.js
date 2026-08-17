const authService = require('../services/authService');

async function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: 'Usuario y contraseña son obligatorios'
        });
    }

    try {
        const result = await authService.login(username, password);

     if (!result) {

    console.warn(
        '2024-11-18 08:34:22 WARN AuthController - Login attempt failed for user: ' + username
    );

    return res.status(401).json({
        error: 'Credenciales no válidas'
    });
}

        return res.status(200).json(result);

    } catch (error) {

    console.warn(
        '2024-11-18 08:34:22 WARN AuthController - Login attempt failed for user: ' + username
    );

    console.error(
        `${new Date().toISOString()} ERROR AuthController - ${error.message}`
    );

    return res.status(500).json({
        error: 'Credenciales no válidas. Inténtelo nuevamente.'
    });
    }

}

module.exports = {
    login
};