const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Registro de usuario con encriptación
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);

        const nuevoUsuario = new User({ 
            username, 
            email, 
            password: passwordHashed 
        });

        await nuevoUsuario.save();

        res.status(201).json({
            ok: true,
            msg: 'Usuario registrado con seguridad',
            user: { id: nuevoUsuario._id, username: nuevoUsuario.username }
        });
    } catch (error) {
        res.status(400).json({ ok: false, msg: error.message });
    }
};

// Login de usuario
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const usuarioDB = await User.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }

        
        const validPassword = await bcrypt.compare(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({ ok: false, msg: 'Contraseña incorrecta' });
        }

        res.json({
            ok: true,
            msg: 'Login exitoso',
            user: { id: usuarioDB._id, username: usuarioDB.username }
        });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error en el servidor' });
    }
};