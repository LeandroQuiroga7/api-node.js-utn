const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');


const schemaRegistro = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});


exports.registerUser = async (req, res) => {
    try {
        
        const { error } = schemaRegistro.validate(req.body);
        if (error) {
            return res.status(400).json({ ok: false, msg: error.details[0].message });
        }

        const { username, email, password } = req.body;

        
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ ok: false, msg: 'El email ya está registrado' });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.json({ ok: true, msg: 'Usuario creado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error interno al registrar' });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ ok: false, msg: 'Contraseña incorrecta' });
        }

        
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
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error interno en el login' });
    }
};