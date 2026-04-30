const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const calculateRoutes = require('./routes/calculate');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// MongoDB connection
// =======================
if (process.env.NODE_ENV !== 'test') {
  const mongoUri =
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017/calculator';

  const mongoUriWithAuth =
    process.env.MONGO_ROOT_USERNAME && process.env.MONGO_ROOT_PASSWORD
      ? mongoUri.replace(
          'mongodb://',
          `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@`
        )
      : mongoUri;

  mongoose
    .connect(mongoUriWithAuth)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch((err) =>
      console.error('❌ Erreur de connexion MongoDB:', err)
    );
}

// =======================
// CORS CONFIGURATION (FIX PROPRE)
// =======================
const corsOptions = {
  origin: [
    'https://lucas-calculator-frontend.apps.openshift.kakor.ovh'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// IMPORTANT : CORS AVANT LES ROUTES
app.use(cors(corsOptions));

// Gestion des preflight requests
app.options('*', cors(corsOptions));

// =======================
// Middlewares
// =======================
app.use(express.json());

// =======================
// Routes
// =======================
app.use('/auth', authRoutes);
app.use('/calculate', calculateRoutes);

// =======================
// Healthcheck
// =======================
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// =======================
// Start server
// =======================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  });
}

module.exports = app;