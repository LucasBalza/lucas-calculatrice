const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const calculateRoutes = require('./routes/calculate');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB seulement si ce n'est pas un test
if (process.env.NODE_ENV !== 'test') {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/calculator';

  // Ajouter les credentials si elles sont définies
  const mongoUriWithAuth = process.env.MONGO_ROOT_USERNAME && process.env.MONGO_ROOT_PASSWORD
    ? mongoUri.replace('mongodb://', `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@`)
    : mongoUri;

  mongoose.connect(mongoUriWithAuth, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/calculate', calculateRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Démarrage du serveur seulement si ce fichier est exécuté directement
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  });
}

module.exports = app;

