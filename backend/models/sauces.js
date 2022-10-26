// Package qui permet d'intéragir avec la base de données MongoDB 
const mongoose = require('mongoose');
var mongodbErrorHandler = require('mongoose-mongodb-errors');

// Création du schéma de données qui contient les champs requis pour créer une sauce
const saucesSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default:0},
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]},
});

saucesSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('sauces', saucesSchema);