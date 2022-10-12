// Package qui permet d'intéragir avec la base de données MongoDB 
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création du schéma de donnée qui contient les champs requis pour la connexion d'un utilisateur 
const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true },
  password: {type: String, required: true }
});
// Utilisation du schéma via le plugin de mongoose-unique-validator
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);