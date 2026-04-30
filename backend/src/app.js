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
// CORS CONFIGURATION (FIX IMPORTANT)
// =======================

const allowedOrigins = [
  'https://lucas-calculator-frontend.apps.openshift.kakor.ovh'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise Postman / tests (pas d'origine)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS non autorisé'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Gestion du preflight OPTIONS (OBLIGATOIRE)
app.options('*', cors());

// =======================
// Middlewares
// =======================
app.use(express.json());

// =======================
// Routes
// =======================
app.use('/auth', authRoutes);
app.use('/calculate', calculateRoutes);

// Healthcheck
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