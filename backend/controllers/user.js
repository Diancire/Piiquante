// Package de cryptage qui permet de créer un hash des mots de passe des utilisateurs 
const bcrypt = require('bcrypt');
// Package qui permet de créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const passwordSchema = require('../models/passwordSchema');

var validator = require('validator');

require('dotenv').config();

// Middleware pour le création de nouveaux users dans la base de donnée 
exports.signup = (req, res, next) => {
    if (passwordSchema.validate(req.body.password) && validator.isEmail(req.body.email)){ 
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error}));
        })
        .catch(error => res.status(500).json({ error}));
    }
    else {
        return res.status(400).json({ error : `L'email n'est pas conforme ou le mot passe est faible, veuillez le renforcer ! ${passwordSchema.validate('req.body.password', { list: true })}`})
    }
};

// Middleware pour permettre aux utilisateurs existant de se connecter 
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.RANDOM_TOKEN_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };