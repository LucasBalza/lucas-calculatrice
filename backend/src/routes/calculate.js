const express = require('express');
const router = express.Router();
const calculateController = require('../controllers/calculateController');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware, calculateController.calculate);

module.exports = router;

