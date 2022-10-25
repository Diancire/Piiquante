// Importation du package Express
const express = require('express');
// Importation du package Mongoose
const mongoose = require('mongoose');

// Importation de userRoutes
const userRoutes = require('./routes/user');

// Importation de saucesRoutes
const saucesRoutes = require('./routes/sauces');

// Importation du "path" pour définir les chemins 
const path = require('path');
// Permet de stoker des variables d'environnement 
require('dotenv').config();
// Imporation d'helmet qui permet de sécuriser les en-têtes http
const helmet = require('helmet');
// App permet de créer une application express
const app = express();

// Connection à MongoDB
mongoose.connect(`${process.env.MONGO_DB_USER}`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

// Le CORS, système de sécurité qui bloque par défaut les appels HTTP entre les serveurs différents
app.use((req, res, next) => {
  // Header qui permet d'accéder à l'API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Header qui mentionne qui sont autorisés à accéder à l'API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // Header qui permet d'envoyer des requêtes avec les méthodes
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Chemins des routes principales 
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(helmet());

module.exports = app;