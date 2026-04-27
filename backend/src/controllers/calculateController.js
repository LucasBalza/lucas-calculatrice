const calculateService = require('../services/calculateService');

const calculate = (req, res) => {
  try {
    const { operation, a, b } = req.body;

    // Validation
    if (operation === undefined || a === undefined || b === undefined) {
      return res.status(400).json({
        error: 'Paramètres manquants. Requis: operation, a, b'
      });
    }

    if (typeof a !== 'number' || typeof b !== 'number') {
      return res.status(400).json({
        error: 'Les paramètres a et b doivent être des nombres'
      });
    }

    const validOperations = ['+', '-', '*', '/'];
    if (!validOperations.includes(operation)) {
      return res.status(400).json({
        error: `Opération invalide. Opérations supportées: ${validOperations.join(', ')}`
      });
    }

    // Calcul
    const result = calculateService.calculate(operation, a, b);

    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { calculate };

