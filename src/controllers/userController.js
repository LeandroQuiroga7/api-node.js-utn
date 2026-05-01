const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.json({ ok: true, msg: 'Usuario creado' });
    } catch (error) {
        res.status(400).json({ ok: false, msg: 'Error al registrar' });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ ok: false, msg: 'Contraseña incorrecta' });

        
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            ok: true,
            user: { id: user._id, username: user.username },
            token 
        });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error en el login' });
    }
};