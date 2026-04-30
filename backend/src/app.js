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

const cors = require('cors');

const corsOptions = {
  origin: 'https://lucas-calculator-frontend.apps.openshift.kakor.ovh',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

// IMPORTANT : appliquer avant routes
app.use(cors(corsOptions));

// IMPORTANT : gérer preflight explicitement
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://lucas-calculator-frontend.apps.openshift.kakor.ovh');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

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